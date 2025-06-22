import { Request, Response, Router } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import { UserService } from './users.service';
import { ApiError } from '@/utils/helpers';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
      this.router.post(`${this.path}`, this.create);
      this.router.get(`${this.path}`, this.getAll);
      this.router.get(`${this.path}/:id`, this.getById);
      this.router.put(`${this.path}/:id`, this.update);
      this.router.delete(`${this.path}/:id`, this.delete);
  }

  private create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      const existingCustomer = await this.userService.findByEmail(email);
      if (existingCustomer) {
        res.status(409).json({
          success: false,
          message: '[1-UAR] - User Already Exists',
        });
      }

      const customer = await this.userService.create(req.body);

      res.status(201).json({
        success: true,
        data: {
          ...customer,
          company: customer.company, // return company juga
        }
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  private getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.findAll();

      const sanitizedUsers = users.map(user => {
        const { password_hash, created_at, company_id, ...rest } = user;
        return {
          ...rest,
          company: user.company, // ← include company
        };
      });

      res.status(200).json({
        success: true,
        data: sanitizedUsers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  };

  private getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.findById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User Not Found',
        });
        return;
      }

      const { password_hash, created_at, company_id, ...rest } = user;
      const sanitizedUser = {
        ...rest,
        company: user.company,
      };

      res.status(200).json({
        success: true,
        data: sanitizedUser,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
      });
    }
  };


  private update = async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const updatedUser = await this.userService.update(parseInt(id), req.body);
        res.status(200).json({
              success: true
          });
      } catch (error: any) {
        res.status(error.statusCode || 400).json({ success: false, message: error.message });
      }
  };

  private delete = async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        await this.userService.delete(parseInt(id));
        res.status(200).json({ success: true, message: 'User deleted successfully' });
      } catch (error: any) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
      }
  };
}

export default UserController;