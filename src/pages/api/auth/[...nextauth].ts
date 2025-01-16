import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "~/server/db";
import { type DefaultSession } from "next-auth";
import jwt from "jsonwebtoken";
import { strpc } from "~/server/api/root";
// extend id in userfeild
declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: string;
    } & DefaultSession["user"];
    token?: string;
  }
}
export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Call the stRPC login Server-side calls
          const user = await strpc.post.login({
            email: credentials.email,
            password: credentials.password
          });

          // If the mutation is successful, return the user object
          if (user) {
            return {
              id: user.id, 
              email: user.email,
              name: user.name,
            };
          } else {
            throw new Error("Invalid email or password");
          }
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Failed to log in");
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      httpOptions: {
        timeout: 1000 * 10, // 10 seconds timeout
      },
    }),
    // ...add more providers here
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (token.accessToken === undefined) {
        // For providing auth for trpc server later passed using Bearer
        token.accessToken = jwt.sign(token, process.env.NEXTAUTH_SECRET!);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      // Need to access jwt using useSession()
      session.token = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions;

export default NextAuth(authOptions);
