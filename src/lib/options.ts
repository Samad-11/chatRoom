import prisma from "@/lib/prisma";

import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from 'bcrypt'
import { AuthOptions } from "next-auth";
export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    theme: {
        buttonText: "Sign Up",
        colorScheme: "auto",
        brandColor: "#9d5836",
    },
    providers: [

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    placeholder: "Your Username",
                    type: "text",
                },
                password: {
                    label: "Password",
                    placeholder: "Your Password",
                    type: "password"
                }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials?.username
                    }
                })

                if (!user) throw new Error("User Not Found")

                if (!credentials?.password) throw new Error("Username or password is incorrect")

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordCorrect) throw new Error("Username or password is incorrect")

                const { password, ...userWithoutPassword } = user

                return userWithoutPassword
            },
        }),
    ],
    session: {
        maxAge: 60 * 20
    }
}