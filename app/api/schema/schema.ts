import { z } from "zod";

export const postSchema = z.object({
  posts: z.array(
    z.object({
      content: z.string().describe("Content of the post."),
      potential: z.number().describe("Viral potential out of 10."),
    })
  ),
});
