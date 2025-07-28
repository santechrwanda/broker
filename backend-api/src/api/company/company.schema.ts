import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"
import { commonValidations } from "@/common/utils/commonValidation"

extendZodWithOpenApi(z)

export type Company = z.infer<typeof CompanySchema>

// Complete Company schema
export const CompanySchema = z
  .object({
    id: z.string().uuid().optional(),
    companyName: z.string().min(1, "Company name is required"),
    companyAddress: z.string().min(1, "Company address is required"),
    companyTelephone: z.string().min(1, "Company telephone is required"),
    companyLogo: z.string().url().optional(),
    ownerFullName: z.string().min(1, "Owner full name is required"),
    ownerEmail: z.string().email("Invalid email format"),
    ownerAddress: z.string().min(1, "Owner address is required"),
    ownerPhone: z.string().min(1, "Owner phone is required"),
    numberOfShares: z.number().int().min(1, "Number of shares must be at least 1"),
    companyCategory: z.enum([
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
    ]),
    status: z.enum(["pending", "approved", "rejected"]).default("pending"),
    registeredBy: z.string().uuid().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .openapi("Company")

// Schema for creating a company
export const CreateCompanySchema = z
  .object({
    companyName: z.string().min(1, "Company name is required"),
    companyAddress: z.string().min(1, "Company address is required"),
    companyTelephone: z.string().min(1, "Company telephone is required"),
    ownerFullName: z.string().min(1, "Owner full name is required"),
    ownerEmail: z.string().email("Invalid email format"),
    ownerAddress: z.string().min(1, "Owner address is required"),
    ownerPhone: z.string().min(1, "Owner phone is required"),
    numberOfShares: z.number().int().min(1, "Number of shares must be at least 1"),
    companyCategory: z.enum([
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
    ]),
  })
  .openapi("CreateCompany")

// Schema for updating a company
export const UpdateCompanySchema = z
  .object({
    companyName: z.string().min(1, "Company name is required").optional(),
    companyAddress: z.string().min(1, "Company address is required").optional(),
    companyTelephone: z.string().min(1, "Company telephone is required").optional(),
    ownerFullName: z.string().min(1, "Owner full name is required").optional(),
    ownerEmail: z.string().email("Invalid email format").optional(),
    ownerAddress: z.string().min(1, "Owner address is required").optional(),
    ownerPhone: z.string().min(1, "Owner phone is required").optional(),
    numberOfShares: z.number().int().min(1, "Number of shares must be at least 1").optional(),
    companyCategory: z
      .enum([
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
      ])
      .optional(),
  })
  .openapi("UpdateCompany")

// Schema for updating company status
export const CompanyStatusSchema = z
  .object({
    status: z.enum(["pending", "approved", "rejected"]),
  })
  .openapi("CompanyStatus")

// Input Validation for 'GET companies/:id' endpoint
export const GetCompanySchema = z.object({
  params: z.object({ id: commonValidations.id }),
})
