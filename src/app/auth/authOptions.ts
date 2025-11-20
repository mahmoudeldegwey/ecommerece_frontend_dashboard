import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

async function login(credentials: any) {
    try {

        const {email, password} = credentials;
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, {
            method: 'POST',
            body: JSON.stringify({email:email, password:password}),
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        const data = await response.json();
        
        if (data.error) {
            return null;
        }

        return data.data;

    } catch (e) {
        throw new Error(`Something went wrong2. ${e}`);
        return null;
    }
}

export const authOptions: NextAuthOptions = {
    pages: {signIn: "/login"},
    
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email", placeholder: "example@email.com"},
                password: {label: "Password", type: "password", placeholder: "******"}
            },
            async authorize(credentials,) {
                try {
                    const user = await login(credentials);
                    if (!user) return null;
                    return user;
                } catch (e) {
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({user, token}) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({session, token}: any) {
            session.user = token.user;
            return session;
        },
    },
    debug: process.env.NODE_ENV === "development",
};