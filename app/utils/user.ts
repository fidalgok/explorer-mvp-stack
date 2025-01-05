import { redirect, useRouteLoaderData } from "react-router";

// Type for our user data
export interface UserData {
    user: {
        id: string;
        email: string | null;
        profile: {
            displayName: string | null;
            photoURL: string | null;
        } | null;
    } | null;
}

// Hook for optional user data
export function useOptionalUser() {
    // Get the root loader data which contains user info
    const data = useRouteLoaderData("root") as UserData;
    return data.user;
}

// Hook for required user data
export function useRequiredUser() {
    const user = useOptionalUser();
    if (!user) {
        throw redirect("/login");
    }
    return user;
}