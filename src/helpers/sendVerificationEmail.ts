import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(email: string , username:string , otp:string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'Anonify |Verification Code ',
    react: VerificationEmail({username , otp}),
  });
        return {success:true , message:'verification email sent successfully'}
        
    } catch (error) {
        console.error("Error sending verification email", error)
        return {success:false , message:'Faild to send verification email'}
    }
}