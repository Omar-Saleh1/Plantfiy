import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string;
      name?: string;
      role?: string;
      [key: string]: any;
    } & DefaultSession["user"];
    token?: string;
  }

  interface User extends DefaultUser {
    token?: string;
    user?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token?: string;
    user?: any;
  }
}
