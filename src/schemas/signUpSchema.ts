import { z } from 'zod';

export const userNameValidation = z
.string()
.trim()
.min(2, "Username must be at least 2 characters")
.max(20, "Username must be 20 characters or fewer")
.regex(/^[a-zA-Z0-9]{2,20}$/, "Use only letters and numbers (no spaces or symbols)");


export const signUpSchema = z.object({

    userName: userNameValidation,
    email: z.email({error: "Invalid email address"}),
    password: z.string().min(6, {error:"Password must be at least 6 characters"})

})
