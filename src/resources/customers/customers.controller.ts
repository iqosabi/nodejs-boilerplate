import { Request, Response, Router } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import { CustomerService } from './customers.service';
import { ApiError } from '@/utils/helpers';

class CustomerController implements Controller {
  public path = '/customers';
  public router = Router();
  private customerService = new CustomerService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/customers', this.create);
    this.router.get(`${this.path}`, this.getAll);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.put(`${this.path}/:id`, this.update);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      const existingCustomer = await this.customerService.findByEmail(email);
      if (existingCustomer) {
        res.status(409).json({
          success: false,
          message: '[1-UAR] - Customer already exists',
        });
      }

      const customer = await this.customerService.create(req.body);

      res.status(201).json({
        success: true,
        data: customer,
      });
    } catch (error: any) {
      console.error(error);
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };



  private getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const customers = await this.customerService.findAll();
        res.status(200).json({
            success: true,
            data: customers
        });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch customers' });
    }
  };

  private getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const customer = await this.customerService.findById(parseInt(id));
      if (!customer) {
        throw new ApiError('Customer not found', 404);
      }
        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  };

  private update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedCustomer = await this.customerService.update(parseInt(id), req.body);
        res.status(200).json({
            success: true,
            data: updatedCustomer
        });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ success: false, message: error.message });
    }
  };

  private delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.customerService.delete(parseInt(id));
      res.status(200).json({ success: true, message: 'Customer deleted successfully' });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  };
}

export default CustomerController;