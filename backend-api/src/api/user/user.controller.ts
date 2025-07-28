import User from "@/common/models/users"
import { ServiceResponse } from "@/common/utils/serviceResponse"
import { asyncCatch, ErrorHandler } from "@/common/middleware/errorHandler"
import type { Request, Response, NextFunction, RequestHandler } from "express"
import { Op } from "sequelize"
import { getHash } from "@/common/utils/bcrypt"
import Setting from "@/common/models/settings"

class UserController {
  public createUser: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, address, phone, role, password, salary, commission } = req.body
    let hashedPassword = ""

    if (password) {
      hashedPassword = await getHash(password)
    } else {
      const data = await Setting.findOne()
      const settings = data?.dataValues
      hashedPassword = settings?.defaultPassword || undefined
    }

    // Handle profile image upload
    let profileUrl = ""
    if (req.file) {
      // Generate URL for the uploaded file
      profileUrl = `${req.protocol}://${req.get('host')}/assets/${req.file.filename}`
    }

    const { dataValues: user } = await User.create({
      name,
      email,
      address,
      phone,
      role,
      salary,
      commission,
      password: hashedPassword,
      profile: profileUrl || undefined,
    })

    return ServiceResponse.success("User created successfully!", user, res)
  })

  public allUsers: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { search } = req.query
    console.log(req.user)
    const whereClause = search
      ? {
          [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }, { email: { [Op.iLike]: `%${search}%` } }],
        }
      : {}

    const users = await User.findAll({ where: whereClause })
    return ServiceResponse.success("Users retrieved successfully!", users, res)
  })

  public updateUser: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const updates = { ...req.body, password: undefined }

    const user = await User.findByPk(id)
    if (!user) return next(ErrorHandler.NotFound("User not found"))

    // Handle profile image upload
    if (req.file) {
      updates.profile = `${req.protocol}://${req.get('host')}/assets/${req.file.filename}`
    }

    await user.update(updates)
    return ServiceResponse.success("User updated successfully!", user, res)
  })

  public deleteUser: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const user = await User.findByPk(id)
    if (!user) return next(ErrorHandler.NotFound("User not found"))
    await user.destroy()
    return ServiceResponse.success("User deleted successfully!", null, res)
  })

  public changeUserStatus: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { status } = req.body // status: "active" | "blocked"
    const user = await User.findByPk(id)
    if (!user) return next(ErrorHandler.NotFound("User not found"))
    await user.update({ status })
    return ServiceResponse.success("User status updated!", user, res)
  })

  public importUsers: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const users = req.body.users

    if (!Array.isArray(users) || users.length === 0) {
      return ServiceResponse.failure("No users provided for import", null, res, 400)
    }
    const createdUsers = []
    for (const user of users) {
      const { name, email, address, phone, role, password } = user
      let hashedPassword = ""
      if (password) {
        hashedPassword = await getHash(password)
      } else {
        const data = await Setting.findOne()
        const settings = data?.dataValues
        hashedPassword = settings?.defaultPassword || undefined
      }
      const { dataValues: createdUser } = await User.create({
        name,
        email,
        address,
        phone,
        role,
        password: hashedPassword,
      })
      createdUsers.push(createdUser)
    }
    return ServiceResponse.success("Users imported successfully!", createdUsers, res)
  })
}

export const userController = new UserController()
