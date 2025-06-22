import { AppDataSource } from '@/database/connection';
import { Users } from '@/resources/users/model/users.entity';
import { ApiError } from '@/utils/helpers';
import jwt from 'jsonwebtoken';

export class AuthService {
  private userRepository = AppDataSource.getRepository(Users);

  public async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['company'],
    });

    if (!user || user.password_hash !== password) {
      throw new ApiError('Invalid email or password', 401);
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '3d' });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      }
    };
  }

  public verifyAndExtendToken(token: string): string {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

      const extendedToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
      );

      return extendedToken;
    } catch (err) {
      throw new ApiError('Invalid or expired token', 401);
    }
  }
}
