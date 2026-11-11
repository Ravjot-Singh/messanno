import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from 'zod';
import { userNameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    userName: userNameValidation
})

export async function GET(request: Request) {

        
    const { searchParams } = new URL(request.url);

    const result = UsernameQuerySchema.safeParse({
        userName: searchParams.get('userName') ?? ''
    });

    if (!result.success) {
        const userNameErrors = z.treeifyError(result.error).properties?.userName?.errors ?? [];

        return Response.json({
            success: false,
            message: userNameErrors.length > 0 ? userNameErrors[0] : "Invalid username",

        },
            {
                status: 400
            }
        )
    }

    try {

        await dbConnect();

        const { userName } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ userName, isVerified: true });

        if (existingVerifiedUser) {

            return Response.json({
                success: false,
                message: "Username is already taken",

            },
                {
                    status: 400
                }
            )

        }

        return Response.json({
            success: true,
            message: "Username is available",

        },
            {
                status: 200
            }
        )

    } catch (error) {
        console.error("Error checking user name: ", error);
        return Response.json({
            success: false,
            message: "Couldn't check this username right now. Please try again."
        },
            {
                status: 500
            }
        )
    }

}