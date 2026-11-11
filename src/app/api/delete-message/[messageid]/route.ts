import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ messageid: string }> }
) {
    const { messageid: messageId } = await params
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        },
            { status: 401 })
    }



    try {
        const updatedResult = await UserModel.updateOne(
            {
                _id: session.user._id
            },
            {
                $pull: {
                    messages: {
                        _id: messageId
                    }
                }
            }
        )

        if(updatedResult.modifiedCount == 0){
          return  Response.json(

            {
                success: false,
                message:"Message not found or already deleted"
            },
            {
                status: 404
            }

            )
        }
          return  Response.json(

            {
                success: true,
                message:"Message deleted successfully"
            },
            {
                status: 200
            }

            )

    }catch(error){
        console.log("Error in delete-message : ", error);
                  return  Response.json(

            {
                success: false,
                message:"Error deleting message"
            },
            {
                status: 500
            }

            )
    }



}