import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "~/server/db";
import { type DefaultSession } from "next-auth";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { trpc } from "~/server/api/root";
// extend id in userfeild

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: string;
    } & DefaultSession["user"];
    token?: string;
  }
}
export const authOptions: NextAuthOptions = {
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
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "email and password required",
            });
          }
          return trpc.post.signin({
            email: credentials?.email,
            password: credentials?.password,
          });
        } catch (error) {
          if (error instanceof TRPCError) {
            throw new Error(error.message);
          }
          throw new Error("Something went worng");
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
    async redirect({ url, baseUrl }) {
      console.log("URL:", url); // Debug the URL
      console.log("Base URL:", baseUrl); // Debug the base URL

      // Allow the callbackUrl to be used if it's valid
      if (url.startsWith(baseUrl)) {
        if (url.endsWith("/app")) return url;
        return url;
      }

      // Default to the base URL (home page) if the URL is invalid
      return baseUrl;
    },
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
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },
} satisfies NextAuthOptions;

export default NextAuth(authOptions);
