export interface User {
  id: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  userId: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Type for creating a new user
export interface CreateUserData {
  id: string;
  email: string | null;
  profile: {
    displayName: string | null;
    photoURL: string | null;
  };
}

export interface UserWithProfile extends User {
  profile: Profile;
}