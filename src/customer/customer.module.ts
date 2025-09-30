import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer } from './entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])], // <--- acá se registra el repo
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService], // (opcional) por si otro módulo lo usa
})
export class CustomerModule {}
