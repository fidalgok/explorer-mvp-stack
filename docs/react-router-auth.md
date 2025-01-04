## Session-Based Authentication with Firebase

This guide outlines how to implement session-based authentication using React Router, focusing on Firebase for authentication and manually storing user information. We'll leverage React Router's session management to handle user sessions and use Firebase to get user profile data.

### Key Concepts

-   **Firebase Authentication:** We'll use Firebase for handling user authentication (login, registration, etc.).
-   **Session Storage:** React Router's `createCookieSessionStorage` will store session data, such as a user ID.
-   **Manual User Data Storage:** After Firebase authentication, we will manually store the user profile information in our database.
-   **Session Management:** We'll use React Router's loader and action functions for reading and writing session data.

### Setting Up Session Storage

First, create a session storage object in `~/utils/sessions.server.ts`. This will manage cookie-based sessions.

```typescript
import { createCookieSessionStorage } from "react-router";

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      cookie: {
        name: "__session",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        sameSite: "lax",
        secrets: ["your-super-secret-key"], // Replace with a real secret
        secure: process.env.NODE_ENV === "production",
      },
    }
  );

export { getSession, commitSession, destroySession };
```

**Explanation:**

-   `createCookieSessionStorage`: Creates a session storage that uses HTTP cookies.
-   `SessionData`: Defines the type of data stored in the session (in this case a `userId`).
-   `SessionFlashData`: Defines the type of flash data used to convey information for a single request, such as errors.
-   `cookie`: Configures the cookie settings, such as `name`, `httpOnly`, `maxAge`, and `secure`.
-   `secrets`:  An array of secrets used for signing cookies and preventing tampering (rotate these occasionally for added security).

### Firebase Authentication and User Profile

When a user logs in using Firebase, we will handle the authentication process in a React Router action. We'll then retrieve the user profile information from Firebase and store it in our database along with the userId. For simplicity's sake we'll assume that the user is logged in already and the `firebaseUser` object exists.

```typescript
// ~/utils/auth.server.ts

import { auth } from "./firebase.server";

export async function handleFirebaseLogin(){

  // In a real world app, you will handle the auth redirect on the client
  const firebaseUser = auth.currentUser // In this example we are using the currentUser for simplicty

  if(!firebaseUser) {
     throw new Error("No user found");
   }
  return {
    userId: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
  }
}
```

### Login Action

Here's an example of how you might handle login with Firebase and store user data in the action:

```typescript
// ~/app/routes/login.tsx
import { redirect } from "react-router";
import type { Route } from "./+types/login";

import {
  getSession,
  commitSession,
} from "~/utils/sessions.server";
import { handleFirebaseLogin } from "~/utils/auth.server";
import { createUser } from "~/utils/users.server"; // Helper function to create user in database

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  try {
   const firebaseProfile = await handleFirebaseLogin()

   // Fetch the user record from our database
    const user = await createUser(firebaseProfile)

    session.set("userId", user.id); // Set the user ID in the session
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  catch(e){
       session.flash("error", "There was a problem logging you in");

        // Redirect back to the login page with errors.
        return redirect("/login", {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
      });
  }
}

export default function LoginRoute() {
  return (
    <div >
      <p>This route should redirect</p>
    </div>
  )
}

```

**Explanation:**

-   `handleFirebaseLogin`: This function (defined above) handles the firebase authentication process. In a real world application you would use the firebase client and redirect the user here. In this example, we're assuming the user is already signed in.
-   `createUser`: A helper function to create the user information in our database.
-   `session.set("userId", userId)`: Sets the user ID in the session.
-   `commitSession`: Sends the session cookie back to the browser.

### Logout Action

The logout process clears the session using `destroySession`.

```typescript
// ~/app/routes/logout.tsx
import { redirect } from "react-router";
import type { Route } from "./+types/logout";

import {
  getSession,
  destroySession,
} from "~/utils/sessions.server";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function LogoutRoute() {
  return (
    <div>
        <p>Logout Page</p>
    </div>
  )
}
```

**Explanation:**

-   `destroySession`: Removes the session cookie, logging the user out.

### Protecting Routes

To protect routes, verify that the user is logged in during the loader.

```typescript
// ~/app/routes/dashboard.tsx
import type { Route } from "./+types/dashboard";
import { redirect } from "react-router";

import { getSession } from "~/utils/sessions.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    // Redirect to login if not logged in
    return redirect("/login");
  }

  return null
}


export default function DashboardPage() {
    return <div>Dashboard Page</div>
}
```


