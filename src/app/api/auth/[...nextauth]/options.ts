import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.models";


export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id: "credentials",
            name : "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials : any) : Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({email : credentials.providers.email})
                    if(!user){
                        throw new Error("NO USER FOUND WITH THIS EMAIL")
                    }

                    if(!user.isVerified) {
                        throw new Error ("Please verify your account before login")
                    }

                    const corPass = await bcrypt.compare(credentials.password , user.password)

                    if(corPass) {
                        return user
                    }
                    else{
                        throw new Error ("Incorrect password")

                    }
                } catch (error: any) {
                    throw new Error(error)
                }
                
            },
        })
    ],
    callbacks : {
        async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
    },
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }
            return token
    }
    },
    pages: {
        signIn : "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret : process.env.NEXT_AUTH_SECRET
}