import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      department: string | null;
      skillLevel: string;
      xp: number;
      level: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    department: string | null;
    skillLevel: string;
    xp: number;
    level: number;
  }
}
