import { z } from 'zod';

export const userNameValidation = z
.string()
.trim()
.min(2, "Username must be atleast 2 characters long")
.max(20, "Must be less than 20 characters")
.regex(/^[a-zA-Z0-9]{2,20}$/   , "Username must not contain special character");


export const signUpSchema = z.object({

    userName: userNameValidation,
    email: z.email({error: "Invalid email address"}),
    password: z.string().min(6, {error:"Password must be atleast 6 characters"})

})
