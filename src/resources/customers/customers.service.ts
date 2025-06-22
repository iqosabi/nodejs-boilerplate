import { AppDataSource } from '@/database/connection';
import { Customers } from './model/customers.entity';
import { ApiError } from '@/utils/helpers';

export class CustomerService {
  private customerRepository = AppDataSource.getRepository(Customers);

  public async create(payload: Partial<Customers>): Promise<Customers> {
    const { name } = payload;
    if (!name) {
      throw new ApiError('Customer name is required.');
    }
    const customer = this.customerRepository.create(payload);
    try {
      return await this.customerRepository.save(customer);
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new ApiError('Failed to create customer.');
    }
  }

  public async findAll(): Promise<Customers[]> {
    return await this.customerRepository.find();
  }

  public async findById(id: number): Promise<Customers | null> {
    return await this.customerRepository.findOne({ where: { id } });
  }

  public async findByEmail(email: string): Promise<Customers | null> {
      return await this.customerRepository.findOne({ where: { email } });
    }

  public async update(id: number, payload: Partial<Customers>): Promise<Customers> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new ApiError('Customer not found', 404);
    }
    Object.assign(customer, payload);
    try {
      return await this.customerRepository.save(customer);
    } catch (error) {
      console.error('Error updating customer:', error);
      throw new ApiError('Failed to update customer.');
    }
  }

  public async delete(id: number): Promise<void> {
    const result = await this.customerRepository.delete(id);
    if (result.affected === 0) {
      throw new ApiError('Customer not found', 404);
    }
  }
}