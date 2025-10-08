import { z } from "zod";

// Client form uses lowercase values; map them to Prisma enums (PascalCase)
const statusValues = [ "Todo", "InProgress", "OnHold", "Done"] as const;
const priorityValues = ["high", "urgent", "medium", "low"] as const;

export const createTodoSchema = z
  .object({
    taskName: z.string().trim().min(1, "Task name is required"),
    status: z.enum(statusValues).default("Todo"),
    priority: z.enum(priorityValues).default("high"),
    linkedId: z.string().trim().min(1),
    assignedId: z.string().trim().optional().or(z.literal("")),
    dueDate: z.string().nullable().optional(),
    notes: z.string().optional().or(z.literal("")),
    files: z.any().optional(),
  })
  .transform((data) => ({
    ...data,
    // Map to Prisma enum casing - handle both camelCase and lowercase inputs
    status:
       data.status === "InProgress"
        ? "InProgress"
        :  data.status === "OnHold"
        ? "OnHold"
        : data.status === "Done"
        ? "Done"
        : data.status === "Todo"
        ? "Todo"
        : "Todo", // default fallback
    priority:
      data.priority === "urgent"
        ? "Urgent"
        : data.priority === "medium"
        ? "Medium"
        : data.priority === "low"
        ? "Low"
        : data.priority === "high"
        ? "High"
        : "High", // default fallback
  }));

export const updateTodoSchema = z
  .object({
    id: z.string().trim().min(1).optional(), // Made optional since id comes from URL
    taskName: z.string().trim().optional(),
    status: z.enum(statusValues).optional(),
    priority: z.enum(priorityValues).optional(),
    linkedId: z.string().trim().optional(),
    assignedId: z.string().trim().optional(),
    dueDate: z.string().nullable().optional(),
    notes: z.string().optional(),
    files: z.any().optional(),
  })
  .transform((data) => ({
    ...data,
    // Map to Prisma enum casing - handle both camelCase and lowercase inputs
    status:
      data.status === undefined
        ? undefined
        : data.status === "InProgress"
        ? "InProgress"
        :  data.status === "OnHold"
        ? "OnHold"
        :  data.status === "Done"
        ? "Done"
        : data.status === "Todo"
        ? "Todo"
        : "Todo", // default fallback
    priority:
      data.priority === undefined
        ? undefined
        : data.priority === "urgent"
        ? "Urgent"
        : data.priority === "medium"
        ? "Medium"
        : data.priority === "low"
        ? "Low"
        : data.priority === "high"
        ? "High"
        : "High", // default fallback
  }));

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
