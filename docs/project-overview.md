## Project Overview

Welcome to the Explorer MVP Stack. This project is a simple web application template built with React Router v7. It is a ssr rendered application that allows users to get up and running quickly with a modern web application mostly for free. It comes complete with authentication, database, and deployment.

## Project Decisions

-   Use React Router v7 for the routing system.
-   Use Tailwind CSS v4 for the styling system.
-   Use TypeScript for the programming language.
-   Use Vite for the build system.
-   Use Netlify for the deployment system.
-   Use lucide-react for the icons.
-   Use Radix UI for the component primitives
-   Use Firebase for the authentication and database system.
-   Utilize sessions for authentication.
-   Role based authentication.
-   Types for consistent DB schema.

## Project Structure

The project is structured as follows:

-   `app/`: Contains the main application code.
-   `docs/`: Contains the project overview and documentation.
-   `app/routes/`: Contains the routes.
-   `app/components/`: Contains the components.
-   `app/utils/`: Contains the utility functions for both client and server, and the types for the DB schema.
-   `app/routes.tsx`: Contains the route configuration.

## Core Functionalities

1. Authentication
   -   Sign in with Google
   -   Role based access control
   -   Session based authentication
   -   Profile management
   -   User management
   -   Role management
   -   Permission management

2. Database
    - User management
    - Profile management
    - Role management
    - Permission management
    - Session management

3. Protected routes
   - Profile route
   - Admin route for user management
   - Admin route for role management
   - Admin route for permission management

4. Public routes
   - Home page
   - Login page
   - Signup page
   - About page
