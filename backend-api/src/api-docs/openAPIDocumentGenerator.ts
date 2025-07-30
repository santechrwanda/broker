import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi"
import { authRegistry } from "@/api/authentication/auth.docs"
import { userRegistry } from "@/api/user/user.docs"
import { companyRegistry } from "@/api/company/company.docs"
import { commissionRegistry } from "@/api/commission/commission.docs"
import { marketRegistry } from "@/api/market/market.docs"
import { transactionRegistry } from "@/api/transaction/transaction.docs"

export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>

export function generateOpenAPIDocument(): OpenAPIDocument {
  const registry = new OpenAPIRegistry([
    authRegistry,
    userRegistry,
    companyRegistry,
    commissionRegistry,
    marketRegistry,
    transactionRegistry,
  ])
  const generator = new OpenApiGeneratorV3(registry.definitions)

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  })
}