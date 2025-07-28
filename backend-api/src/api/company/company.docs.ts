import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { createApiReqestBody, createApiResponse, createApiFormDataBody } from "@/api-docs/openAPIResponseBuilders"
import { StatusCodes } from "http-status-codes"
import { CompanySchema, CreateCompanySchema, UpdateCompanySchema, CompanyStatusSchema } from "./company.schema"
import { z } from "zod"

export const companyRegistry = new OpenAPIRegistry()

// Register/Create company with file upload
companyRegistry.registerPath({
  method: "post",
  path: "/api/companies",
  tags: ["Company"],
  request: {
    body: createApiFormDataBody(CreateCompanySchema, ["companyLogo"]),
  },
  responses: createApiResponse(CompanySchema, "Company registered successfully", StatusCodes.CREATED),
})

// Get all companies
companyRegistry.registerPath({
  method: "get",
  path: "/api/companies",
  tags: ["Company"],
  parameters: [
    {
      name: "search",
      in: "query",
      description: "Search companies by name, owner name, or email",
      required: false,
      schema: {
        type: "string",
      },
    },
    {
      name: "status",
      in: "query",
      description: "Filter by company status",
      required: false,
      schema: {
        type: "string",
        enum: ["pending", "approved", "rejected"],
      },
    },
    {
      name: "category",
      in: "query",
      description: "Filter by company category",
      required: false,
      schema: {
        type: "string",
        enum: [
          "technology",
          "finance",
          "healthcare",
          "manufacturing",
          "retail",
          "services",
          "energy",
          "real_estate",
          "agriculture",
          "transportation",
          "other",
        ],
      },
    },
  ],
  responses: createApiResponse(z.array(CompanySchema), "Companies retrieved successfully", StatusCodes.OK),
})

// Get company by ID
companyRegistry.registerPath({
  method: "get",
  path: "/api/companies/{id}",
  tags: ["Company"],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: createApiResponse(CompanySchema, "Company retrieved successfully", StatusCodes.OK),
})

// Update company with file upload
companyRegistry.registerPath({
  method: "put",
  path: "/api/companies/{id}",
  tags: ["Company"],
  request: {
    params: z.object({ id: z.string() }),
    body: createApiFormDataBody(UpdateCompanySchema, ["companyLogo"]),
  },
  responses: createApiResponse(CompanySchema, "Company updated successfully", StatusCodes.OK),
})

// Delete company
companyRegistry.registerPath({
  method: "delete",
  path: "/api/companies/{id}",
  tags: ["Company"],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: createApiResponse(z.object({}), "Company deleted successfully", StatusCodes.OK),
})

// Update company status
companyRegistry.registerPath({
  method: "patch",
  path: "/api/companies/{id}/status",
  tags: ["Company"],
  request: {
    params: z.object({ id: z.string() }),
    body: createApiReqestBody(CompanyStatusSchema),
  },
  responses: createApiResponse(CompanySchema, "Company status updated successfully", StatusCodes.OK),
})

// Get my companies (authenticated user's companies)
companyRegistry.registerPath({
  method: "get",
  path: "/api/companies/my/companies",
  tags: ["Company"],
  security: [{ bearerAuth: [] }],
  responses: createApiResponse(z.array(CompanySchema), "Your companies retrieved successfully", StatusCodes.OK),
})
