import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { createApiReqestBody, createApiResponse, createApiFormDataBody } from "@/api-docs/openAPIResponseBuilders"
import { StatusCodes } from "http-status-codes"
import { UserSchema, CreateUserSchema, UpdateUserSchema, UserStatusSchema, ImportUsersSchema } from "./user.schema"
import { z } from "zod"

export const userRegistry = new OpenAPIRegistry()

// Create user with file upload
userRegistry.registerPath({
  method: "post",
  path: "/api/users",
  tags: ["User"],
  request: {
    body: createApiFormDataBody(CreateUserSchema, ["profile"]),
  },
  responses: createApiResponse(UserSchema, "User created", StatusCodes.CREATED),
})

// Get all users
userRegistry.registerPath({
  method: "get",
  path: "/api/users",
  tags: ["User"],
  parameters: [
    {
      name: "search",
      in: "query",
      description: "Search users by name or email",
      required: false,
      schema: {
        type: "string",
      },
    },
  ],
  responses: createApiResponse(z.array(UserSchema), "Users retrieved", StatusCodes.OK),
})

// Update user with file upload
userRegistry.registerPath({
  method: "put",
  path: "/api/users/{id}",
  tags: ["User"],
  request: {
    params: z.object({ id: z.string() }),
    body: createApiFormDataBody(UpdateUserSchema, ["profile"]),
  },
  responses: createApiResponse(UserSchema, "User updated", StatusCodes.OK),
})

// Delete user
userRegistry.registerPath({
  method: "delete",
  path: "/api/users/{id}",
  tags: ["User"],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: createApiResponse(z.object({}), "User deleted", StatusCodes.OK),
})

// Update user status
userRegistry.registerPath({
  method: "patch",
  path: "/api/users/{id}/status",
  tags: ["User"],
  request: {
    params: z.object({ id: z.string() }),
    body: createApiReqestBody(UserStatusSchema),
  },
  responses: createApiResponse(UserSchema, "User status updated", StatusCodes.OK),
})

// Import users
userRegistry.registerPath({
  method: "post",
  path: "/api/users/import",
  tags: ["User"],
  request: {
    body: createApiReqestBody(ImportUsersSchema),
  },
  responses: createApiResponse(z.array(UserSchema), "Users imported", StatusCodes.CREATED),
})
