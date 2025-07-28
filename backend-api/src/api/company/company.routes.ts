import express, { type Router } from "express"
import { companyController } from "@/api/company/company.controller"
import { uploadProfileImage } from "@/common/middleware/multer"
import passport from "passport"

const companyRoutes: Router = express.Router()

// Public routes
companyRoutes.get("/", companyController.getAllCompanies)
companyRoutes.get("/:id", companyController.getCompanyById)
companyRoutes.post("/", uploadProfileImage, companyController.createCompany)

// Protected routes (require authentication)
companyRoutes.get("/my/companies", passport.authenticate("jwt", { session: false }), companyController.getMyCompanies)

companyRoutes.put("/:id", uploadProfileImage, companyController.updateCompany)

companyRoutes.delete("/:id", companyController.deleteCompany)

companyRoutes.patch(
  "/:id/status",
  passport.authenticate("jwt", { session: false }),
  companyController.updateCompanyStatus,
)

export { companyRoutes }
