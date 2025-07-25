import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiReqestBody, createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { StatusCodes } from "http-status-codes";
import { UserSchema } from "./user.schema";
import { z } from "zod";

export const userRegistry = new OpenAPIRegistry();

userRegistry.registerPath({
  method: "post",
  path: "/api/users",
  tags: ["User"],
  request: {
    body: createApiReqestBody(UserSchema),
  },
  responses: createApiResponse(UserSchema, "User created", StatusCodes.CREATED),
});

userRegistry.registerPath({
  method: "get",
  path: "/api/users",
  tags: ["User"],
  responses: createApiResponse(UserSchema, "Users retrieved", StatusCodes.OK),
});

userRegistry.registerPath({
  method: "put",
  path: "/api/users/{id}",
  tags: ["User"],
  request: {
    params: z.object({ id: z.string() }),
    body: createApiReqestBody(UserSchema.partial()),
  },
  responses: createApiResponse(UserSchema, "User updated", StatusCodes.OK),
});

userRegistry.registerPath({
  method: "delete",
  path: "/api/users/{id}",
  tags: ["User"],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: createApiResponse(z.object({}), "User deleted", StatusCodes.OK),
});

userRegistry.registerPath({
  method: "patch",
  path: "/api/users/{id}/status",
  tags: ["User"],
  request: {
    params: z.object({ id: z.string() }),
    body: createApiReqestBody(z.object({ status: z.enum(["active", "blocked"]) })),
  },
  responses: createApiResponse(UserSchema, "User status updated", StatusCodes.OK),
});