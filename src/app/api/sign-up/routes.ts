import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.models";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod";


export async function POST(request : Request) {
    await dbConnect()

    try {
        const {username , email , password } = await request.json()
        const exsistingUserVerifiedByUsername = await UserModel.findOne({username , isVerified:true})

        if(exsistingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"

            },{status : 400})
        }

        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random()* 900000).toString()

        if(existingUserByEmail) {

            if(existingUserByEmail.isVerified){
                 return Response.json({
                success:false,
                message:"USER ALREADY EXIST WITH THIS EMAIL"
            }, {status : 500})

            } else{
                const hashedPass = await bcrypt.hash(password ,10)
                existingUserByEmail.password = hashedPass
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
                await existingUserByEmail.save()
            }
        }else {
            const hashedPass = await bcrypt.hash(password , 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser  =new UserModel ({
                 username,
                    email,
                    password : hashedPass,
                    verifyCode,
                    verifyCodeExpiry : expiryDate,
                    isVerified : false,
                    isAcceptingMessage : true,
                    message:[]
            })

            await newUser.save()
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email , username , verifyCode)
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:"Faild to send verification email"
            }, {status : 500})
        }


        return  Response.json({
                success:true,
                message:"user registration successfull , please verify your email"
            }, {status : 201})
        
    } catch (error) {
        console.error("Error while registring user", error)
        return Response.json({
            success:false,
            message:"Error while registring user"
        })
    }
}