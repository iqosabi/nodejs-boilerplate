import { Request, Response, Router } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import { CompanyService } from './company.service';
import { uploadLogo } from '@/utils/upload.middleware';

class CompanyController implements Controller {
  public path = '/companies';
  public router = Router();
  private compService = new CompanyService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, uploadLogo.single('logo'), this.create);
    this.router.get(`${this.path}`, this.getAll);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.put(`${this.path}/:id`, this.update);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email } = req.body;

      const existingCompany = await this.compService.findByEmail(email);
      if (existingCompany) {
        res.status(409).json({
          success: false,
          message: 'Company with this email already exists',
        });
      }

      const gah = req.body
      console.log("NEW 1", gah)

      if (req.file) {
        const logoUrl = `${process.env.BASE_URL || 'https://noosa.connectin-hub.com'}logos/${req.file.filename}`;
        req.body.logo_url = logoUrl;
      }

      const newCompany = await this.compService.create(req.body);

      console.log("NEW", {newCompany, gah})

      res.status(201).json({
        success: true,
        data: newCompany,
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  };

  private getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const companies = await this.compService.findAll();

      res.status(200).json({
        success: true,
        data: companies,
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
      const { id } = req.params;
      const company = await this.compService.findById(parseInt(id));

      if (!company) {
        res.status(404).json({ success: false, message: 'Company not found' });
      }

      res.status(200).json({
        success: true,
        data: company,
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
      const updatedCompany = await this.compService.update(parseInt(id), req.body);
      res.status(200).json({
        success: true,
        data: updatedCompany,
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ success: false, message: error.message });
    }
  };

  private delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.compService.delete(parseInt(id));
      res.status(200).json({ success: true, message: 'Company deleted successfully' });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
    }
  };
}

export default CompanyController;
