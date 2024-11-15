import { z } from "zod";

export const PostSchema = z.object({
  author: z.string(),
  content: z.string(),
  date: z.number(),
  id: z.number(),
});

export const PostSchemaArray = z.array(PostSchema);

// schema pour la data à POST
export const FormSchema = z.object({
  author: z.string(),
  content: z.string(),
});

// schema pour la data à patch
export const PatchPostSchema = z.object({
  content: z.string(),
  date: z.number(),
});
