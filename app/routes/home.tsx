import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({request}: Route.LoaderArgs){
  // mock a user for now
  const user = {
    id: "1",
    name: "Explorer",
    email: "explorer@example.com",
  };
  return {user};
}

export default function Home() {
  
  return <Welcome />;
}
