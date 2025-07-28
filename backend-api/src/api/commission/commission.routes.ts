import express, { type Router } from "express"
import { commissionController } from "@/api/commission/commission.controller"
import passport from "passport"

const commissionRoutes: Router = express.Router()

// Public routes
commissionRoutes.get("/", commissionController.getAllCommissions)
commissionRoutes.get("/stats", commissionController.getCommissionStats)
commissionRoutes.get("/:id", commissionController.getCommissionById)

// Protected routes (require authentication)
commissionRoutes.post("/", passport.authenticate("jwt", { session: false }), commissionController.createCommission)

commissionRoutes.get(
  "/my/commissions",
  passport.authenticate("jwt", { session: false }),
  commissionController.getMyCommissions,
)

commissionRoutes.put("/:id", passport.authenticate("jwt", { session: false }), commissionController.updateCommission)

commissionRoutes.patch(
  "/:id/status",
  passport.authenticate("jwt", { session: false }),
  commissionController.updateCommissionStatus,
)

commissionRoutes.delete("/:id", passport.authenticate("jwt", { session: false }), commissionController.deleteCommission)

export { commissionRoutes }
