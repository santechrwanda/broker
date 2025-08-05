import { Router } from "express"
import { holdingsController } from "./holdings.controller"
import passport from "passport"

const holdingsRoutes = Router()

holdingsRoutes.get("/", passport.authenticate("jwt", { session: false }), holdingsController.getUserHoldings)

export { holdingsRoutes }
