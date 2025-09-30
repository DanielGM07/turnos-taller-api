import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      const customer = this.customerRepository.create(createCustomerDto);
      return await this.customerRepository.save(customer);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Customer[]> {
    try {
      return await this.customerRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Customer> {
    try {
      const customer = await this.customerRepository.findOneBy({ id });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      return customer;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    try {
      const result = await this.customerRepository.update(
        id,
        updateCustomerDto,
      );
      if (result.affected === 0) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      const customer = await this.customerRepository.findOneBy({ id });
      if (!customer) {
        throw new NotFoundException(
          `Customer with ID ${id} not found after update`,
        );
      }

      return customer;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.customerRepository.softDelete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      return { message: `Customer with ID ${id} successfully deleted` };
    } catch (error) {
      throw error;
    }
  }
}
