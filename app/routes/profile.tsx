import type { Route } from "./+types/profile";
import { getRequiredUser } from "~/utils/auth.server";
import { useLoaderData } from "react-router";
import type { ReactNode } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getRequiredUser(request);
  
  return user;
}

interface GradientCardProps {
  children: ReactNode;
  className?: string;
}

const GradientCard = ({ children, className = '' }: GradientCardProps) => {
  return (
    <div className="relative p-3 rounded-3xl bg-gradient-to-tr from-[#771EDC] to-[#25DFE2]">
      <div 
        className={`relative rounded-[14px] bg-white dark:bg-black p-8 h-full ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const {user, profile} = useLoaderData<typeof loader>();
  
  return (
    <div className="container max-w-screen-md mx-auto p-4">
      <GradientCard>

      <h1 className="text-4xl font-bold mb-12">Profile</h1>
      
      <div className="flex items-center gap-4">
       <div>
        {profile?.photoURL && <img src={profile?.photoURL} alt={`${profile?.displayName}'s profile picture`} className="w-20 h-20 rounded-full" />}
       </div>
       <div>
        <h2 className="text-xl font-semibold">{profile?.displayName}</h2>
        <p className="text-gray-600">{user.email}</p>
       </div>
      </div>
      </GradientCard>
    </div>
  );
}