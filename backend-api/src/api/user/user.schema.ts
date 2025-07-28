import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"
import { commonValidations } from "@/common/utils/commonValidation"

extendZodWithOpenApi(z)

export type User = z.infer<typeof UserSchema>

// Complete User schema with all fields from the model
export const UserSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    address: z.string().optional(),
    phone: z.string().optional(),
    role: z.enum(["client", "admin", "teller", "agent", "manager", "accountant", "company"]),
    status: z.enum(["active", "blocked"]).default("active"),
    password: z.string().min(5, "Password must be at least 5 characters long").optional(),
    resetPasswordCode: z.string().optional(),
    resetPasswordExpires: z.date().optional(),
    googleId: z.string().optional(),
    salary: z.number().min(0).optional(),
    commission: z.number().min(0).max(100).optional(),
    profile: z.string().url().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .openapi("User")

// Schema for creating a user (only required and relevant fields)
export const CreateUserSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    address: z.string().optional(),
    phone: z.string().optional(),
    role: z.enum(["client", "admin", "teller", "agent", "manager", "accountant", "company"]).default("client"),
    password: z.string().min(5, "Password must be at least 5 characters long").optional(),
    salary: z.number().min(0).optional(),
    commission: z.number().min(0).max(100).optional(),
  })
  .openapi("CreateUser")

// Schema for updating a user (all fields optional except constraints)
export const UpdateUserSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    role: z.enum(["client", "admin", "teller", "agent", "manager", "accountant", "company"]).optional(),
    salary: z.number().min(0).optional(),
    commission: z.number().min(0).max(100).optional(),
  })
  .openapi("UpdateUser")

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
})

// Schema for user status update
export const UserStatusSchema = z
  .object({
    status: z.enum(["active", "blocked"]),
  })
  .openapi("UserStatus")

// Schema for bulk user import
export const ImportUsersSchema = z
  .object({
    users: z.array(CreateUserSchema),
  })
  .openapi("ImportUsers")
