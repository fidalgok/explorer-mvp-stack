import type { Route } from "./+types/profile";
import { getRequiredUser } from "~/utils/auth.server";
import { useLoaderData } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getRequiredUser(request);
  
  return user;
}

export default function ProfilePage() {
  const {user, profile} = useLoaderData<typeof loader>();
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      
      <div className="flex items-center gap-4">
       <div>
        {profile?.photoURL && <img src={profile?.photoURL} alt={`${profile?.displayName}'s profile picture`} className="w-20 h-20 rounded-full" />}
       </div>
       <div>
        <h2 className="text-xl font-semibold">{profile?.displayName}</h2>
        <p className="text-gray-600">{user.email}</p>
       </div>
      </div>
    </div>
  );
}