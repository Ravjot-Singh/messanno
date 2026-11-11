import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";

const codeVerificationSchema = verifySchema;

export async function POST(request: Request) {
    await dbConnect();


    try {

        const { userName, code } = await request.json();
        const codeValidation = codeVerificationSchema.safeParse({ code });

        if (!codeValidation.success) {
            return Response.json({
                success: false,
                message: codeValidation.error.issues.map((issue) => issue.message).join(", ")
            }, {
                status: 400
            });
        }

        const decodedUsername = decodeURIComponent(userName);

        const user = await UserModel.findOne({ userName: decodedUsername });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }

        const isCodeValid = user.verifyCode === codeValidation.data.code;

        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "User verified successfully"
            }, {
                status: 200
            })

        }

        if (!isCodeNotExpired) {

            return Response.json({
                success: false,
                message: "Verification Code is expired, please signup again for new code"
            }, {
                status: 400
            })

        }

        return Response.json({
            success: false,
            message: "Verification Code is incorrect"
        }, {
            status: 400
        })


    } catch (error) {
        console.error("Error verifying user: ", error);
        return Response.json({
            success: false,
            message: "Error checking verification of user"
        },
            {
                status: 500
            }
        )
    }
}