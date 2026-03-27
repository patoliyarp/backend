import z from "zod";

export const userSchema = z.object(
  {
    username: z
      .string({ message: "username must required and string" })
      .min(4, { message: "Username must be at least 4 characters long." })
      .max(20, { message: "Username cannot exceed 20 characters." })
      .lowercase()
      .trim(),
    email: z.email({ message: "Email is required and must be correct" }),
    password: z
      .string({ message: "Password must be required with proper format" })
      .min(8, { message: "Password must be at least 8 characters long" }),
  },
  { message: "all fields must be required" },
);

export type UserType = z.infer<typeof userSchema>;
