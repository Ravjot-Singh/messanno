import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        },
            { status: 401 })
    }

    try {
        await dbConnect()
        const foundUser = await UserModel.findById(session.user._id).select("messages")

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 })
        }

        return Response.json({
            success: true,
            messages: foundUser.messages
                .slice()
                .sort((first, second) =>
                    second.createdAt.getTime() - first.createdAt.getTime()
                )
        },
            { status: 200 })
    } catch (error) {
        console.error("Error retrieving messages:", error)
        return Response.json({
            success: false,
            message: "Could not retrieve messages"
        }, { status: 500 })
    }
}