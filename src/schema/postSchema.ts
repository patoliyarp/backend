import { z } from "zod";

export const postSchema = z.object({
  id: z
    .number({ message: "id is required and must be number" })
    .int()
    .positive(),
  title: z.string().min(5, "title must be at least 5 character long"),
  body: z.string().min(10, "content must be 10 character long"),
  tags: z.array(z.string()).optional(),
  reactions: z
    .object({
      likes: z.number().nonnegative().optional(),
      dislikes: z.number().nonnegative().optional(),
    })
    .optional(),
  views: z.number().int().optional(),
  userId: z.number().int(),
});

export type postType = z.infer<typeof postSchema>;
