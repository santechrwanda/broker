import Company from "@/common/models/company"
import { ServiceResponse } from "@/common/utils/serviceResponse"
import { asyncCatch, ErrorHandler } from "@/common/middleware/errorHandler"
import type { Request, Response, NextFunction, RequestHandler } from "express"
import { Op } from "sequelize"
import User from "@/common/models/users"
import type { User as UserShape } from "../user/user.schema"

class CompanyController {
  public createCompany: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const {
      companyName,
      security, // Added security
      companyAddress,
      companyTelephone,
      ownerFullName,
      ownerEmail,
      ownerAddress,
      ownerPhone,
      numberOfShares,
      companyCategory,
    } = req.body

    // Handle company logo upload
    let logoUrl = ""
    if (req.file) {
      logoUrl = `${req.protocol}://${req.get("host")}/assets/${req.file.filename}`
    }

    // Get the user who is registering the company (if authenticated)
    const registeredBy = (req.user as UserShape)?.id || null

    const { dataValues: company } = await Company.create({
      companyName,
      security, // Added security
      companyAddress,
      companyTelephone,
      companyLogo: logoUrl || undefined,
      ownerFullName,
      ownerEmail,
      ownerAddress,
      ownerPhone,
      numberOfShares: Number.parseInt(numberOfShares),
      companyCategory,
      registeredBy,
      status: "pending",
    })

    return ServiceResponse.success("Company registered successfully!", company, res)
  })

  public getAllCompanies: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { search, status, category } = req.query

    const whereClause: any = {}

    // Add search functionality
    if (search) {
      whereClause[Op.or] = [
        { companyName: { [Op.iLike]: `%${search}%` } },
        { security: { [Op.iLike]: `%${search}%` } }, // Search by security
        { ownerFullName: { [Op.iLike]: `%${search}%` } },
        { ownerEmail: { [Op.iLike]: `%${search}%` } },
      ]
    }

    // Filter by status
    if (status) {
      whereClause.status = status
    }

    // Filter by category
    if (category) {
      whereClause.companyCategory = category
    }

    const companies = await Company.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "registrar",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    return ServiceResponse.success("Companies retrieved successfully!", companies, res)
  })

  public getCompanyById: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const company = await Company.findByPk(id, {
      include: [
        {
          model: User,
          as: "registrar",
          attributes: ["id", "name", "email"],
        },
      ],
    })

    if (!company) {
      return next(ErrorHandler.NotFound("Company not found"))
    }

    return ServiceResponse.success("Company retrieved successfully!", company, res)
  })

  public updateCompany: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const updates = { ...req.body }

    const company = await Company.findByPk(id)
    if (!company) {
      return next(ErrorHandler.NotFound("Company not found"))
    }

    // Handle company logo upload
    if (req.file) {
      updates.companyLogo = `${req.protocol}://${req.get("host")}/assets/${req.file.filename}`
    }

    // Convert numberOfShares to integer if provided
    if (updates.numberOfShares) {
      updates.numberOfShares = Number.parseInt(updates.numberOfShares)
    }

    await company.update(updates)
    return ServiceResponse.success("Company updated successfully!", company, res)
  })

  public deleteCompany: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const company = await Company.findByPk(id)
    if (!company) {
      return next(ErrorHandler.NotFound("Company not found"))
    }

    await company.destroy()
    return ServiceResponse.success("Company deleted successfully!", null, res)
  })

  public updateCompanyStatus: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { status } = req.body

    const company = await Company.findByPk(id)
    if (!company) {
      return next(ErrorHandler.NotFound("Company not found"))
    }

    await company.update({ status })
    return ServiceResponse.success("Company status updated successfully!", company, res)
  })

  public getMyCompanies: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as UserShape)?.id

    if (!userId) {
      return next(ErrorHandler.BadRequest("User not authenticated"))
    }

    const companies = await Company.findAll({
      where: { registeredBy: userId },
      order: [["createdAt", "DESC"]],
    })

    return ServiceResponse.success("Your companies retrieved successfully!", companies, res)
  })
}

export const companyController = new CompanyController()
