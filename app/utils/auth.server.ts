import { auth } from "./firebase.server";
import { type DecodedIdToken } from "firebase-admin/auth";
import { getSession, commitSession, destroySession } from "./sessions.server";
import { redirect } from "react-router";
import { createUser, getUserById } from "./users.server";
import { sanitizeUserInput } from "./sanitize.server";
import { sanitizePhotoURL } from "./sanitize.server";

interface AuthUser {
    id: string;
    email: string | undefined;
    displayName: string | undefined;
    photoURL: string | undefined;
}

export async function verifyFirebaseToken(token: string): Promise<DecodedIdToken> {
    try {
        return await auth.verifyIdToken(token);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

export async function createUserSession(userId: string, redirectTo: string) {
    const session = await getSession();
    session.set("userId", userId);

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export async function authenticateUser(token: string): Promise<AuthUser> {
    try {
        const decodedToken = await verifyFirebaseToken(token);
        const firebaseUser = await auth.getUser(decodedToken.uid);

        let user = await getUserById(firebaseUser.uid);

        if (!user) {
            user = await createUser({
                id: firebaseUser.uid,
                email: firebaseUser.email ?? null,
                profile: {
                    displayName: firebaseUser.displayName ?? null,
                    photoURL: firebaseUser.photoURL ?? null,
                },
            });

        }
        return {
            id: user.user.id,
            email: user.user.email ?? firebaseUser.email,
            displayName: user.profile?.displayName ?? firebaseUser.displayName,
            photoURL: user.profile?.photoURL ?? firebaseUser.photoURL,
        };
    } catch (error) {

        throw new Error('Authentication failed');
    }
}

export async function logout(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));

    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}

// Helper to check if user is authenticated
export async function getUserId(request: Request): Promise<string | null> {
    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");
    return userId || null;
}

// Helper to require authentication
export async function requireUserId(request: Request): Promise<string> {
    const userId = await getUserId(request);
    if (!userId) {
        throw redirect("/login");
    }
    return userId;
}

// For optional user routes
export async function getOptionalUser(request: Request) {
    const userId = await getUserId(request);
    if (!userId) return null;

    return getUserById(userId);
}

// For protected routes
export async function getRequiredUser(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        throw redirect("/login");
    }

    const user = await getUserById(userId);
    if (!user) {
        throw new Response("User not found", { status: 404 });
    }
    // sanitize the user data, just displayName and photoURL
    let sanitizedUser = { ...user };
    sanitizedUser.profile.displayName = sanitizeUserInput(user.profile.displayName);
    sanitizedUser.profile.photoURL = sanitizePhotoURL(user.profile.photoURL);

    return sanitizedUser;
}
