import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(request: Request) {

    try {

        const body = await request.json().catch(() => null);
        const userName = typeof body?.userName === "string" ? body.userName : "";
        const parsed = messageSchema.safeParse({ content: body?.content });

        if (!userName) {
            return Response.json({
                success: false,
                message: "User name is required"
            },
                { status: 400 })
        }

        if (!parsed.success) {
            return Response.json({
                success: false,
                message: parsed.error.issues.map((issue) => issue.message).join(", ")
            },
                { status: 400 })
        }

        await dbConnect();

        
        const user = await UserModel.findOne({ userName, isVerified: true });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 })
        }

        if (!user.isAcceptingMessage) {

            return Response.json({
                success: false,
                message: "user not accepting messages"
            },
                { status: 403 })

        }

        const newMessage = { content: parsed.data.content, createdAt: new Date() };

        user.messages.push(newMessage as Message);

        await user.save();

        return Response.json({
            success: true,
            message: "Note sent anonymously!"
        },
            { status: 200 })

    } catch (error) {

        console.error("Error while sending message ", error);

        return Response.json({
            success: false,
            message: "Error while sending message"
        },
            { status: 500 })

    }


}
