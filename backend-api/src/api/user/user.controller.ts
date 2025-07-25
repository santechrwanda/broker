import User from "@/common/models/users";
import { ServiceResponse } from "@/common/utils/serviceResponse";
import { asyncCatch, ErrorHandler } from "@/common/middleware/errorHandler";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import { Op } from "sequelize";
import { getHash } from "@/common/utils/bcrypt";

class UserController {
  public createUser: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { names, email, address, phone_number, role, password } = req.body;
      
      const hashedPassword = await getHash(password);
      const user = await User.create({
        names,
        email,
        address,
        phone_number,
        role,
        password: hashedPassword,
      });
      return ServiceResponse.success("User created successfully!", user, res);
    }
  );

    public allUsers: RequestHandler = asyncCatch(
        async (req: Request, res: Response, next: NextFunction) => {
        const { search } = req.query;
        const whereClause = search
            ? {
                [Op.or]: [
                { names: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                ],
            }
            : {};
    
        const users = await User.findAll({ where: whereClause });
        return ServiceResponse.success("Users retrieved successfully!", users, res);
        }
    );

  public updateUser: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const updates = { ...req.body, password: undefined };
      const user = await User.findByPk(id);
      if (!user) return next(ErrorHandler.NotFound("User not found"));
      await user.update(updates);
      return ServiceResponse.success("User updated successfully!", user, res);
    }
  );

  public deleteUser: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) return next(ErrorHandler.NotFound("User not found"));
      await user.destroy();
      return ServiceResponse.success("User deleted successfully!", null, res);
    }
  );

  public changeUserStatus: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { status } = req.body; // status: "active" | "blocked"
      const user = await User.findByPk(id);
      if (!user) return next(ErrorHandler.NotFound("User not found"));
      await user.update({ status });
      return ServiceResponse.success("User status updated!", user, res);
    }
  );
}

export const userController = new UserController();