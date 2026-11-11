import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module 'next-auth' {

    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        userName?: string
    }

    interface Session {

        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            userName?: string
        } & DefaultSession['user']

    }


}

declare module "next-auth/jwt" {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        userName?: string
    }
}
