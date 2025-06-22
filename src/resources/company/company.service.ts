import { AppDataSource } from '@/database/connection';
import { ApiError } from '@/utils/helpers';
import { Company } from '../company/model/company.entity';

export class CompanyService {
  private companyRepository = AppDataSource.getRepository(Company);

  public async create(payload: Partial<Company>): Promise<Company> {
    const { name, email, address, phone, logo_url } = payload;

    if (!name || !email || !address || !phone) {
      throw new ApiError('Name, email, address, and phone are required.');
    }

    const existing = await this.companyRepository.findOne({ where: { email } });
    if (existing) {
      throw new ApiError('Company with this email already exists.');
    }

    const company = this.companyRepository.create({
      name,
      email,
      address,
      phone,
      logo_url,
    });

    try {
      return await this.companyRepository.save(company);
    } catch (error) {
      console.error('Error creating company:', error);
      throw new ApiError('Failed to create company.');
    }
  }

  public async findAll(): Promise<Company[]> {
    return await this.companyRepository.find({
      relations: ['users'], // Include users if needed
    });
  }

  public async findById(id: number): Promise<Company | null> {
    return await this.companyRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  public async findByEmail(email: string): Promise<Company | null> {
    return await this.companyRepository.findOne({ where: { email } });
  }

  public async update(id: number, payload: Partial<Company>): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new ApiError('Company not found', 404);
    }

    Object.assign(company, payload);

    try {
      return await this.companyRepository.save(company);
    } catch (error) {
      console.error('Error updating company:', error);
      throw new ApiError('Failed to update company.');
    }
  }

  public async delete(id: number): Promise<void> {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) {
      throw new ApiError('Company not found', 404);
    }
  }
}
