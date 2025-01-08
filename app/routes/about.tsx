import { Link, useLoaderData } from "react-router";
import { getOptionalUser } from "~/utils/auth.server";
import type { Route } from "./+types/about";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getOptionalUser(request);
  return { user };
}

export default function About() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <main className="relative min-h-screen overflow-hidden bg-stone-50">
      {/* Decorative blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <filter id="blurFilter" filterUnits="userSpaceOnUse"
      x="-50%" 
      y="-50%" 
      width="200%" 
      height="200%">
              <feGaussianBlur stdDeviation="50" />
            </filter>
          </defs>
          <circle 
            cx="100%" 
            cy="40%" 
            r="200" 
            fill="#771EDC" 
            opacity="0.15" 
            filter="url(#blurFilter)"
          />
          <circle 
            cx="100%" 
            cy="60%" 
            r="200" 
            fill="#25DFE2" 
            opacity="0.15" 
            filter="url(#blurFilter)"
          />
        </svg>
      </div>
      <section className="container max-w-screen-md mx-auto px-4 py-8">
        <Link to="/" className="text-gray-500 hover:text-gray-700 mb-4 inline-block">{"<-- "}Home</Link>
        <h1 className="text-h1 font-bold mb-8">Explorer MVP Stack</h1>
      
      <section className="mb-12">
        <h2 className="text-h2 font-semibold mb-4">Overview</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          A modern, mvp-ready template for building full-stack React applications
          with React Router, Firebase Authentication, and Firestore database.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-h2 font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Server-side rendering with React Router 7</li>
          <li>Firebase Authentication with Google Sign-in</li>
          <li>Session-based authentication</li>
          <li>Protected routes with role-based access</li>
          <li>Type-safe data fetching and mutations</li>
          <li>Tailwind CSS for styling</li>
        </ul>
      </section>

      {!user && (
        <section className="mb-12">
          <h2 className="text-h2 font-semibold mb-4">Try It Out</h2>
          <p className="mb-4">
            Sign in to explore protected features and see the authentication flow in action.
          </p>
          <Link 
            to="/login"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign In
          </Link>
        </section>
      )}
      <section className="mb-12">
        <h2 className="text-h2 font-semibold mb-4">Getting Started</h2>
        <p className="mb-4">
          Follow these steps to get started with the Explorer MVP Stack.
        </p>
        <h3 className="text-h3 font-semibold mb-2">Clone the Repository</h3>
        <p className="mb-4">
          Clone the repository and install the dependencies.
        </p>
        <h3 className="text-h3 font-semibold mb-2">Set Up Firebase</h3>
        <p className="mb-4">
          Follow the instructions in the README to set up Firebase.
        </p>
        <h3 className="text-h3 font-semibold mb-2">Run the Development Server</h3>
        <p className="mb-4">
          Run the development server with <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">npm run dev</code>.
        </p>
      </section>
      </section>
    </main>
  );
}