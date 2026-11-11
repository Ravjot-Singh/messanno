import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authSecret } from "@/lib/authSecret";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({

            id: "credentials",
            name: "Credentials",

            credentials: {
                identifier: { label: "Email or username", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                const identifier = credentials?.identifier?.trim()
                const password = credentials?.password
                if (!identifier || !password) {
                    return null
                }
                await dbConnect();
                const user = await UserModel.findOne({
                    $or: [{ email: identifier }, { userName: identifier }]
                })

                if (!user || !user.isVerified) {
                    return null
                }

                const isPasswordCorrect = await bcrypt.compare(password, user.password)
                if (!isPasswordCorrect) {
                    return null
                }

                return {
                    id: user._id.toString(),
                    _id: user._id.toString(),
                    name: user.userName,
                    email: user.email,
                    userName: user.userName,
                    isVerified: user.isVerified,
                    isAcceptingMessage: user.isAcceptingMessage,
                }
            }

        })
    ],

    callbacks: {

        async session({ session, token }) {

            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.userName = token.userName;
            }

            return session
        },
        async jwt({ token, user }) {

            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessage;
                token.userName = user.userName;
            }

            return token
        }

    },

    pages: {
        signIn: '/sign-in',

    },

    session: {
        strategy: "jwt"
    },
    secret: authSecret
}
