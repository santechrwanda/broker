import { StatusCodes } from "http-status-codes"
import type { z } from "zod"

import { ServiceResponseSchema } from "@/common/utils/serviceResponse"

export function createApiResponse(schema: z.ZodTypeAny, description: string, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: {
      description,
      content: {
        "application/json": {
          schema: ServiceResponseSchema(schema),
        },
      },
    },
  }
}

export function createApiReqestBody(schema: z.ZodTypeAny, type = "application/json") {
  return {
    content: {
      [type]: {
        schema: schema,
      },
    },
  }
}

export function createApiFormDataBody(schema: z.ZodTypeAny, fileFields: string[] = []) {
  const schemaProperties: any = {}

  // Add schema properties
  if (schema._def?.shape) {
    Object.keys(schema._def.shape()).forEach((key) => {
      const field = schema._def.shape()[key]
      schemaProperties[key] = {
        type: "string",
        description: `${key} field`,
      }
    })
  }

  // Add file fields
  fileFields.forEach((fieldName) => {
    schemaProperties[fieldName] = {
      type: "string",
      format: "binary",
      description: `Upload ${fieldName} file`,
    }
  })

  return {
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: schemaProperties,
        },
      },
    },
  }
}
