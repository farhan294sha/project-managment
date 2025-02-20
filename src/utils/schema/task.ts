import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    deadline: z.date().optional(),
    projectId: z.string().min(1, "Project ID is required"),
    memberEmails: z.array(z.string().email()).optional(),
    taskStatus: z.enum(["Todo", "InProgress", "Done"]),
    tags: z.array(z.string()).optional()
  });