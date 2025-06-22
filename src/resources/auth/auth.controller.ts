import { Request, Response, Router } from 'express';
import { AuthService } from './auth.service';
import Controller from '@/utils/interfaces/controller.interface';

export default class AuthController implements Controller {
  public path = '/auth';
  public router = Router();
  private authService = new AuthService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.login);
    this.router.get(`${this.path}/check-token`, this.checkToken);
  }

  private login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and Password are required' });
      }

      const result = await this.authService.login(email, password);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(err.statusCode || 401).json({ success: false, message: err.message });
    }
  };

  private checkToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      if (!token) {
        res.status(401).json({ success: false, message: 'Token required' });
        return;
      }

      const extendedToken = this.authService.verifyAndExtendToken(token);
      res.status(200).json({ success: true, token: extendedToken });
    } catch (err: any) {
      res.status(err.statusCode || 401).json({ success: false, message: err.message });
    }
  };
}
