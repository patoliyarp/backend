import z, { ZodError } from "zod";

export const postsSchema = z.object({
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
  userId: z.string().optional(),
});

export type Posts = z.infer<typeof postsSchema>;
