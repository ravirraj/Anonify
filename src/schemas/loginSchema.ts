import {z} from "zod";


export const loginSchema = z.object({
    identifier : z.string(),
    passeord : z.string()
})