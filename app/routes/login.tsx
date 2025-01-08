import { redirect } from "react-router";
import type {Route} from './+types/login'
import {  useActionData, useSubmit } from "react-router";
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
    <div className="flex flex-col items-center pt-32 h-screen relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <filter id="blurFilter" filterUnits="userSpaceOnUse"
      x="-50%" 
      y="-50%" 
      width="200%" 
      height="200%">
              <feGaussianBlur stdDeviation="50"  />
            </filter>
          </defs>
          <circle 
            cx="40%" 
            cy="5%" 
            r="200" 
            fill="#771EDC" 
            opacity="0.12" 
            filter="url(#blurFilter)"
          />
          <circle 
            cx="50%" 
            cy="5%" 
            r="200" 
            fill="#25DFE2" 
            opacity="0.15" 
            filter="url(#blurFilter)"
          />
       
          <circle 
            cx="60%" 
            cy="5%" 
            r="200" 
            fill="#95FF00" 
            opacity="0.12" 
            filter="url(#blurFilter)"
          />
        </svg>
      </div>

      {actionData && 'error' in actionData ? (
        <div className="error">{actionData.error}</div>
      ) : null}
      <div className="z-10 flex flex-col items-center gap-4 min-w md:min-w-lg border border-stone-950/20  backdrop-blur-xl rounded-3xl p-8">
        <h1 className="text-2xl md:text-3xl font-bold">Sign in</h1>
        <button
          type="button"
        onClick={handleGoogleSignIn}
        className="cursor-pointer p-2 bg-stone-950 text-stone-50 rounded-md"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}