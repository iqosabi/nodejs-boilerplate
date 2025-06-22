import { AppDataSource } from '@/database/connection';
import { Users } from './model/users.entity';
import { ApiError } from '@/utils/helpers';
import { Company } from '../company/model/company.entity';

export class UserService {
  private userRepository = AppDataSource.getRepository(Users);
  private companyRepository = AppDataSource.getRepository(Company);

  public async create(payload: Partial<Users>): Promise<Users> {
    const { email, password_hash, name, company_id } = payload;

    if (!email || !password_hash || !name || !company_id) {
      throw new ApiError('Email, password, name, and company_id are required.');
    }

    // Check if user already exists
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ApiError('User with this email already exists.');
    }

    // Fetch related company
    const company = await this.companyRepository.findOne({ where: { id: company_id } });
    if (!company) {
      throw new ApiError('Invalid company_id, company not found.');
    }

    // Create and assign company relation
    const user = this.userRepository.create({
      ...payload,
      company, // ← inject the relation here
    });

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new ApiError('Failed to create user.');
    }
  }


  public async findAll(): Promise<Users[]> {
    return this.userRepository.find({
      relations: ['company'], // ← include company info
    });
  }

  public async findById(id: number): Promise<Users | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['company'],
    });
  }

  public async findByEmail(email: string): Promise<Users | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  public async update(id: number, payload: Partial<Users>): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    Object.assign(user, payload);
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new ApiError('Failed to update user.');
    }
  }

  public async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new ApiError('User not found', 404);
    }
  }
}