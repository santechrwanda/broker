import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiReqestBody, createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { UserSchema } from "../user/user.schema";

const authRegistry = new OpenAPIRegistry();

//REGISTRACTION
authRegistry.registerPath({
    method: "post",
    path: "/api/register",
    request: {
        body: createApiReqestBody(UserSchema.pick({ names: true, email: true, password: true })),
    },
    tags: ["Authentication"],
    responses: createApiResponse(UserSchema, "User registered successfully", StatusCodes.OK),
});


//LOGIN WITH CREDENTIALS
authRegistry.registerPath({
    method: "post",
    path: "/api/credentials-login",
    description: `## After login, session-token will be automatically stored in your browser. You can use the following format to send it to request.
            const response = await fetch("{backend_url}/users/profile", {
                method: "GET",
                credentials: "include" // include this line to get your token sent on request
            });
            For other libraries like **Axios** refer to online documentations for how to send request with httpOnly Token
        `,
    tags: ["Authentication"],
    request: {
        body: createApiReqestBody(UserSchema.pick({ email: true, password: true })),
    },
    responses: createApiResponse(UserSchema, "Success"),
});

// LOGIN WITH GOOGLE
authRegistry.registerPath({
    method: "get",
    path: "/api/google-login",
    description: "*Paste in browser: http://localhost:8080/api/google-login*",
    tags: ["Authentication"],
    responses: createApiResponse(UserSchema, "Success"),
});

// HANDLE FORGOT PASSWORD
authRegistry.registerPath({
    method: "post",
    path: "/api/forgot-password",
    tags: ["Authentication"],
    request: {
        body: createApiReqestBody(UserSchema.pick({ email: true })),
    },
    responses: createApiResponse(UserSchema, "Success"),
});

// HANDLE RESET PASSWORD
authRegistry.registerPath({
    method: "post",
    path: "/api/reset-password/{resetCode}",
    tags: ["Authentication"],
    request: {
        params: z.object({ resetCode: z.number() }),
        body: createApiReqestBody(UserSchema.pick({ password: true }).extend({ confirmPassword: z.string() })),
    },
    responses: createApiResponse(UserSchema, "Success"),
});

// LOGOUT USER AND CLEAR COOKIES
authRegistry.registerPath({
    method: "delete",
    path: "/api/logout",
    tags: ["Authentication"],
    responses: createApiResponse(UserSchema, "Success"),
});

// GET LOGGED USER
authRegistry.registerPath({
    method: "get",
    path: "/api/me",
    tags: ["Authentication"],
    responses: createApiResponse(UserSchema, "Success"),
});

export { authRegistry };
