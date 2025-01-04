Copied from the [React Router Docs](https://reactrouter.com/start/framework/routing)
## **React Router Specifics**

This section provides code guidelines and app architecture decisions.

### **File Structure**

#### Components

App components and primitives go in ```~/app/components```

- UI primitives → ```~/app/components/ui```  
- UI components → ```~/app/components```

#### Routing

Routes go in the ```~/app/routes``` folder and should be named descriptively.

#### Utils

This folder is where helpers for various parts of the app go. Typically miscellaneous functionality, server only functionality ie database config, database utils for CRUD, and other DB helpers, types for the app, for the Firebase MVP this is where we type the datastructure, setting up sessions

#### File Naming

Use kebab case for readability

### **Routing**

Okay, here's the rewritten routing guide in Markdown format, incorporating the previous feedback and suggestions:

```markdown
## Configuring Routes

Routes are configured in `app/routes.ts`. Each route has two required parts: a URL pattern to match the URL, and a file path to the route module that defines its behavior.

```tsx
import {
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route("some/path", "./some/file.tsx"),
  // pattern ^           ^ module file
] satisfies RouteConfig;
```

Here is a larger sample route config:

```tsx
import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("./home.tsx"), // This is a root index route that is at the `/` url
  route("about", "./about.tsx"),

  layout("./auth/layout.tsx", [
    route("login", "./auth/login.tsx"),
    route("register", "./auth/register.tsx"),
  ]),

  ...prefix("concerts", [
    index("./concerts/home.tsx"),
    route(":city", "./concerts/city.tsx"), // `:city` is a dynamic segment
    route("trending", "./concerts/trending.tsx"),
  ]),
] satisfies RouteConfig;
```

If you prefer to define your routes via file naming conventions rather than configuration, the `@react-router/fs-routes` package provides a file system routing convention.

### Route Modules

The files referenced in `routes.ts` define each route's behavior:

```tsx
route("teams/:teamId", "./team.tsx"),
//           route module ^^^^^^^^
```

Here's a sample route module:

```tsx
// provides type safety/inference
import type { Route } from "./+types/team";

// provides `loaderData` to the component
export async function loader({ params }: Route.LoaderArgs) {
  let team = await fetchTeam(params.teamId);
  return { name: team.name };
}

// renders after the loader is done
export default function Component({
  loaderData,
}: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
}
```

Route modules (also referred to as "pages" or "screens") have more features like actions, headers, and error boundaries, but they will be covered in the next guide: Route Modules. Page components should have a default export.

### Nested Routes

Routes can be nested inside parent routes.

```tsx
import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  // parent route
  route("dashboard", "./dashboard.tsx", [
    // child routes
    index("./home.tsx"), // This is a nested index route that is at the `/dashboard` url
    route("settings", "./settings.tsx"),
  ]),
] satisfies RouteConfig;
```

The path of the parent is automatically included in the child, so this config creates both `/dashboard` and `/dashboard/settings` URLs.

Child routes are rendered through the `<Outlet/>` in the parent route.

```tsx
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* will either be home.tsx or settings.tsx */}
      <Outlet />
    </div>
  );
}
```

### Root Route

Every route in `routes.ts` is nested inside the special `app/root.tsx` module.

### Layout Routes

Using `layout`, layout routes create new nesting for their children, but they don't add any segments to the URL. It's like the root route but they can be added at any level. They are commonly used to wrap routes with shared UI such as navigation bars and footers.

```tsx
import {
  type RouteConfig,
  route,
  layout,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("./marketing/layout.tsx", [
    index("./marketing/home.tsx"),
    route("contact", "./marketing/contact.tsx"),
  ]),
  ...prefix("projects", [
    index("./projects/home.tsx"),
    layout("./projects/project-layout.tsx", [
      route(":pid", "./projects/project.tsx"),
      route(":pid/edit", "./projects/edit-project.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
```

To see `projects/home.tsx` appear in the layout, we'll need an outlet:

```tsx
import { Outlet } from "react-router";

export default function ProjectLayout() {
  return (
    <div>
      <aside>Example sidebar</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

### Index Routes

```tsx
index(componentFile),
```

Index routes render into their parent's `Outlet` at their parent's URL (like a default child route).

```tsx
import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  // renders into the root.tsx Outlet at /
  index("./home.tsx"),
  route("dashboard", "./dashboard.tsx", [
    // renders into the dashboard.tsx Outlet at /dashboard
    index("./dashboard-home.tsx"),
    route("settings", "./dashboard-settings.tsx"),
  ]),
] satisfies RouteConfig;
```

Note that index routes can't have children.

### Route Prefixes

Using `prefix`, you can add a path prefix to a set of routes without needing to introduce a parent route file.

```tsx
import {
  type RouteConfig,
  route,
  layout,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("./marketing/layout.tsx", [
    index("./marketing/home.tsx"),
    route("contact", "./marketing/contact.tsx"),
  ]),
  ...prefix("projects", [
    index("./projects/home.tsx"),
    layout("./projects/project-layout.tsx", [
      route(":pid", "./projects/project.tsx"),
      route(":pid/edit", "./projects/edit-project.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
```

### Dynamic Segments

If a path segment starts with `:`, then it becomes a "dynamic segment". When the route matches the URL, the dynamic segment will be parsed from the URL and provided as `params` to other router APIs.

```tsx
route("teams/:teamId", "./team.tsx"),
```

```tsx
import type { Route } from "./+types/team";

export async function loader({ params }: Route.LoaderArgs) {
  //                           ^? { teamId: string }
}

export default function Component({
  params,
}: Route.ComponentProps) {
  params.teamId;
  //        ^ string
}
```

You can have multiple dynamic segments in one route path:

```tsx
route("c/:categoryId/p/:productId", "./product.tsx"),
```

```tsx
import type { Route } from "./+types/product";

async function loader({ params }: LoaderArgs) {
  //                    ^? { categoryId: string; productId: string }
}
```

### Optional Segments

You can make a route segment optional by adding a `?` to the end of the segment.

```tsx
route(":lang?/categories", "./categories.tsx"),
```

You can have optional static segments, too:

```tsx
route("users/:userId/edit?", "./user.tsx");
```

### Splats

Also known as "catchall" and "star" segments. If a route path pattern ends with `/*` then it will match any characters following the `/`, including other `/` characters. Splat routes are best for catch-all 404 pages or rendering content that can have an arbitrary amount of nested URLs.

```tsx
route("files/*", "./files.tsx"),
```

```tsx
export async function loader({ params }: Route.LoaderArgs) {
  // params["*"] will contain the remaining URL after files/
}
```

You can destructure the `*`, you just have to assign it a new name. A common name is `splat`:

```tsx
const { "*": splat } = params;
```

### Component Routes

You can also use components that match the URL to elements anywhere in the component tree:

```tsx
import { Routes, Route } from "react-router";

function Wizard() {
  return (
    <div>
      <h1>Some Wizard with Steps</h1>
      <Routes>
        <Route index element={<StepOne />} />
        <Route path="step-2" element={<StepTwo />} />
        <Route path="step-3" element={<StepThree />} />
      </Routes>
    </div>
  );
}
```

Component routes are best used for components like modal dialogues, step-by-step processes, form wizards, or anything that is displayed relative to the current location in the component tree.

Note that these routes do not participate in data loading, actions, code splitting, or any other route module features, so their use cases are more limited than those of the route module.

### Navigation
It is recommended to use the `<Link>` component for navigation, as this avoids full page reloads and provides a faster user experience.

### Accessing URL Parameters
When using dynamic segments, such as `route("teams/:teamId", "./team.tsx"),` you can access these parameters in your components with the `useParams` hook
```typescript
import { useParams } from "react-router";
export default function TeamPage(){
   const { teamId } = useParams()
   return <h1>Team id {teamId}</h1>
}
```

### **Data Loading and Mutations**

#### Data Loading

React router returns plain objects now for most loader functions. DO NOT use the ```json``` helper. If you need to return headers in the loader, use the ```data``` helper from ```react-router```.

It’s important to know that only the deepest child’s headers will be set, if you need headers from parent routes, you should merge them

**Types**  
You can get types from react router as part of its codegen. This happens on save and can be accessed from ```import type {Route} from “./+types/\[route-name\]”``` The route name is based on the file name in the routes folder. The type inference for loaders and actions are below.

- Route.LoaderArgs  
- Route.ActionArgs

**Helpers**
For database operations, helper functions for loading data go in a matching file for the db type in ```~/utils/``` folder. i.e. for loading users, update a ```~/utils/users.server.ts``` file.

#### Data Mutations

For database operations, helper functions for mutating data go in a matching file for the db type in ```~/utils/``` folder. i.e. for mutating users, update a ```~/utils/users.server.ts``` file.

### **Handling Auth With Sessions**

This app uses cookie sessions to handle authentication. The user session is stored in the cookie and is used to authenticate the user. This is handled in the ```~/utils/auth.server.ts``` file and the ```~/utils/sessions.server.ts``` file.

### **Error Handling with Error Boundaries**

There is a helper error boundary function in the ```~/components/error-boundary.tsx``` folder. Use this throughout the app. Every route should have one that might run into an error.
