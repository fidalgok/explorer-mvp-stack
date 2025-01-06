import { data, redirect } from "react-router";
import type {Route} from './+types/login'
import { Form, useActionData, useSubmit } from "react-router";
import { authenticateUser, createUserSession } from "~/utils/auth.server";
import { getUserId } from "~/utils/auth.server";
import { signInWithGoogle } from "~/utils/firebase.client";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const idToken = formData.get("idToken");

  if (typeof idToken !== "string") {
    return { error: "Invalid form submission" };
  }

  try {
    const user = await authenticateUser(idToken);
    return createUserSession(user.id, "/");
  } catch (error) {
   
    return { error: "Authentication failed" };
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  async function handleGoogleSignIn() {
    try {
      const idToken = await signInWithGoogle();
      
      // Submit the token to our action
      submit(
        { idToken },
        { method: "post" }
      );
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {actionData && 'error' in actionData ? (
        <div className="error">{actionData.error}</div>
      ) : null}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <button
          type="button"
        onClick={handleGoogleSignIn}
        className="cursor-pointer p-2 bg-blue-500 text-white rounded-md"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}