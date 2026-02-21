import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email("Format d'email invalide").min(1, "L'email est requis"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const registerSchema = z.object({
    firstName: z.string().min(2, "Prénom trop court"),
    lastName: z.string().min(2, "Nom trop court"),
    email: z.string().email("Email invalide"),
    password: z.string()
        .min(8, "8 caractères minimum")
        .regex(/[A-Z]/, "Il faut au moins une majuscule")
        .regex(/[0-9]/, "Il faut au moins un chiffre"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Format d'email invalide").min(1, "L'email est requis"),
});

export const resetPasswordSchema = z.object({
    newPassword: z.string()
        .min(8, "8 caractères minimum")
        .regex(/[A-Z]/, "Il faut au moins une majuscule")
        .regex(/[0-9]/, "Il faut au moins un chiffre"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});