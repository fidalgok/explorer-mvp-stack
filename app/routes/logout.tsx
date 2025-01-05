import { destroySession } from "~/utils/sessions.server";

import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import { getSession } from "~/utils/sessions.server";

export async function action({ request }: Route.ActionArgs) {
    const session = await getSession(request.headers.get('Cookie'));
    
    return redirect('/', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }
  
  export async function loader() {
    // Redirect any direct access to /logout back to home
    return redirect('/');
  }
  
  export default function Logout() {
    return null;
  }