import { resend } from "@/lib/resend";
import { render } from "@react-email/render";
import OtpEmailTemplate from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, userName: string, otp: string): Promise<ApiResponse> {

    try {

        const html = await render(OtpEmailTemplate({ firstName: userName, otp }));

        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Messanno Verification code',
            html,
        });

        return { success: true, message: "Sent verification email successfully" };
    }
    catch (emailError) {
        console.error('error while sending verification email', emailError);

        return { success: false, message: "Failed to send verification email" };
    }

}
