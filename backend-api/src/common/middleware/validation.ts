import type { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import type { ZodError, ZodSchema } from "zod"
import { ServiceResponse } from "../utils/serviceResponse"

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params })
    next()
  } catch (err) {
    console.log("Validation error:", err)
    const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => e.message).join(", ")}`
    const statusCode = StatusCodes.BAD_REQUEST
    return ServiceResponse.failure(errorMessage, null, res, statusCode)
  }
}

export const validateRole = (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any

  if (!user) {
    return ServiceResponse.failure("Authentication required", null, res, StatusCodes.UNAUTHORIZED)
  }

  if (!allowedRoles.includes(user.role)) {
    return ServiceResponse.failure("Insufficient permissions", null, res, StatusCodes.FORBIDDEN)
  }

  next()
}

export const validateOwnership =
  (userIdField = "userId") =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any
    const resourceUserId = req.params[userIdField] || req.body[userIdField]

    if (!user) {
      return ServiceResponse.failure("Authentication required", null, res, StatusCodes.UNAUTHORIZED)
    }

    // Admin can access everything
    if (user.role === "admin") {
      return next()
    }

    // User can only access their own resources
    if (user.id !== resourceUserId) {
      return ServiceResponse.failure("Access denied", null, res, StatusCodes.FORBIDDEN)
    }

    next()
  }
