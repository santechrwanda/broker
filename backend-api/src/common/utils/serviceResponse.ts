import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { ApiResponse } from "./httpHandlers";

export class ServiceResponse<T = null> {
  readonly success: boolean;
  readonly message: string;
  readonly result: T;
  readonly statusCode: number;

  private constructor(success: boolean, message: string, result: T, statusCode: number) {
    this.success = success;
    this.message = message;
    this.result = result;
    this.statusCode = statusCode;
  }

  static success<T>(
    message: string,
    result: T,
    res: Response,
    statusCode: number = StatusCodes.OK,
    customFields: Record<string, string | number> = {},
  ) {
    const serviceResponse = new ServiceResponse(true, message, result, statusCode);
    return ApiResponse({ ...customFields, ...serviceResponse }, res);
  }

  static failure<T>(message: string, result: T, res: Response, statusCode: number = StatusCodes.BAD_REQUEST) {
    const serviceResponse = new ServiceResponse(false, message, result, statusCode);
    return ApiResponse(serviceResponse, res);
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    result: dataSchema.optional(),
    statusCode: z.number(),
  });
