import { db } from "./firebase.server";
import type { User, Profile, CreateUserData, UserWithProfile } from "./types.server";

// returns the user and profile
export async function createUser({ id, email, profile }: CreateUserData): Promise<{ user: User, profile: Profile }> {
  const now = new Date();
  try {
    // Create user document
    const userRef = db.collection('users').doc(id);
    const userData: User = {
      id,
      email,
      createdAt: now,
      updatedAt: now,
    };

    // Create profile subcollection document
    const profileRef = userRef.collection('profile').doc('main');
    const profileData: Profile = {
      userId: id,
      displayName: profile.displayName,
      photoURL: profile.photoURL,
      createdAt: now,
      updatedAt: now,
    };

    // Use a batch write to ensure both documents are created atomically
    const batch = db.batch();
    batch.set(userRef, userData);
    batch.set(profileRef, profileData);

    await batch.commit();

    return {
      user: userData,
      profile: profileData,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<{ user: User, profile: Profile } | null> {
  const userDoc = await db.collection('users').doc(id).get();
  if (!userDoc.exists) {
    // this only happens if the user is not found in the database
    return null;
  }

  const profileDoc = await userDoc.ref.collection('profile').doc('main').get();
  if (!profileDoc.exists) {
    // this shouldn't happen, but just in case
    throw new Error('Profile not found');
  }
  return {
    user: userDoc.data() as User,
    profile: profileDoc.data() as Profile,
  };
}