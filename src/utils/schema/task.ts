import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  deadline: z.date().optional(),
  projectId: z.string().min(1, "Project ID is required"),
  memberEmails: z.array(z.string().email()).optional(),
  taskStatus: z.enum(["Todo", "InProgress", "Done"]),
  tags: z.array(z.string()).optional(),
  files: z.array(z.object({imageId: z.string().nullable()})).optional()
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .required({ projectId: true, title: true })
  .extend({ id: z.string() });

export type UpdateFormTypes = z.infer<typeof updateTaskSchema>;
export type TaskFormValues = z.infer<typeof createTaskSchema>;
