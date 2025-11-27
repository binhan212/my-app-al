import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface User {
    id: string
    username: string
    email: string
    full_name: string | null
    role: string
    avatar: string | null
  }

  interface Session {
    user: {
      id: string
      username: string
      email: string
      full_name: string | null
      role: string
      avatar: string | null
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: {
            username: credentials.username as string
          }
        })

        if (!user || user.status !== 'active') {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        )

        if (!isPasswordValid) {
          return null
        }

        // Only allow admin and editor roles
        if (user.role !== 'admin' && user.role !== 'editor') {
          return null
        }

        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          avatar: user.avatar
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
})
