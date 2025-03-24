import { z } from "zod";

export const signUpSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    universityId: z.number().int("University ID is required"),
    universityCard: z.string().nonempty("University card is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})


export const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

