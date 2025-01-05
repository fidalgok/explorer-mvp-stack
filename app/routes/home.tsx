import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { getOptionalUser } from "~/utils/auth.server";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({request}: Route.LoaderArgs){
  // get user id from request
const user = await getOptionalUser(request);
 
  return user;
}

export default function Home() {
  
  return <Welcome />;
}
