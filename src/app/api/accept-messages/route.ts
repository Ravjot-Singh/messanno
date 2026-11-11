import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";

export async function POST(request: Request) {

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        },
            { status: 401 })
    }

    const userId = user._id;

    try {

        const body = await request.json().catch(() => null);
        const parsed = acceptMessageSchema.safeParse(body);

        if (!parsed.success) {
            return Response.json({
                success: false,
                message: "acceptMessages must be true or false"
            },
                { status: 400 })
        }

        const { acceptMessages } = parsed.data;

        await dbConnect();

        
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        ).select("isAcceptingMessage");

        if (!updatedUser) {

            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            },
                { status: 404 })

        }

        return Response.json({
            success: true,
            message: updatedUser.isAcceptingMessage
                ? "You're accepting notes again."
                : "New notes paused.",
            isAcceptingMessages: updatedUser.isAcceptingMessage
        },
            { status: 200 })

    } catch (error) {

        console.error("Failed to update user status to accept messages", error);


        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        },
            { status: 500 })

    }


}


export async function GET() {

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        },
            { status: 401 })
    }

    const userId = user._id;

    try {

        await dbConnect();

        const foundUser = await UserModel.findById(userId).select("isAcceptingMessage");

        if (!foundUser) {

            return Response.json({
                success: false,
                message: "Failed to get user status to accept messages"
            },
                { status: 404 })

        }


        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        },
            { status: 200 })

    } catch (error) {

        console.error("Failed to get user status to accept messages", error);


        return Response.json({
            success: false,
            message: "Failed to get user status to accept messages"
        },
            { status: 500 })

    }

}
