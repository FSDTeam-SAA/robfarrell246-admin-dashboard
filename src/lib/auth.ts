import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { useSecureAuthCookies } from "@/lib/auth-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5003/api/v1";

type LoginResponse = {
  success: boolean;
  message?: string;
  data?: {
    user?: {
      _id?: string;
      name?: string;
      email?: string;
      role?: string;
      profileImage?: string;
      refreshToken?: string;
    };
    accessToken?: string;
  };
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: useSecureAuthCookies,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        try {
          const loginUrl = `${API_BASE_URL.replace(/\/$/, "")}/auth/login`;
          const res = await fetch(
            loginUrl,
            {
              method: "POST",
              headers: {
                accept: "*/*",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const response = (await res.json()) as LoginResponse;

          if (!res.ok || !response?.success) {
            throw new Error(response?.message || "INVALID_CREDENTIALS");
          }

          const { user, accessToken } = response.data || {};

          if (!user?._id || !user.name || !user.email || !accessToken) {
            throw new Error("Authentication response is missing user data");
          }

          const normalizedRole = String(user.role).toUpperCase();

          if (normalizedRole !== "ADMIN") {
            throw new Error("ADMIN_ONLY");
          }

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: normalizedRole,
            profileImage: user.profileImage || "",
            accessToken,
            refreshToken: user.refreshToken,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Authentication failed. Please try again.";
          throw new Error(errorMessage);
        }
      },
    }),
  ],



  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.profileImage = user.profileImage;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id || "",
        name: token.name,
        email: token.email,
        role: token.role || "ADMIN",
        profileImage: token.profileImage,
        accessToken: token.accessToken || "",
      };
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

