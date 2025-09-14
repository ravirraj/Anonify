import {email, z} from "zod"

export const usernameValidattion = z.string().min(2 , "Username must be atlest 2 char").max(20 , "username must be no more than 20 char")

export const signUpSchema = z.object({
    username : usernameValidattion,
    email : z.string().email({message: "Invalid emial address"}),
    password : z.string().min(6, {message : "password must be atleast 6 char"})
})