import express, { type Router } from "express"
import { commissionController } from "@/api/commission/commission.controller"
import passport from "passport"

const commissionRoutes: Router = express.Router()

// Public routes (e.g., for general viewing if allowed, though most will be protected)
commissionRoutes.get("/", commissionController.getAllCommissions)
commissionRoutes.get("/stats", commissionController.getCommissionStats)
commissionRoutes.get("/:id", commissionController.getCommissionById)

// Protected routes (require authentication)
// Existing manual/admin creation route
commissionRoutes.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  commissionController.createCommissionManual,
)

// New user request commission route
commissionRoutes.post(
  "/request",
  passport.authenticate("jwt", { session: false }),
  commissionController.requestCommission,
)

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