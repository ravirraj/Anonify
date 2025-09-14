import {z} from "zod";


export const messageSchema= z.object({
    content : z.string().min(1 , {message : "Message can not be empty"}).max(1000 , {message : "Message is too long"})
    
})