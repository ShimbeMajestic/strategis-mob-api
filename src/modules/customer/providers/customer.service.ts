import { QueryService } from '@ptc-org/nestjs-query-core';
import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../models/customer.model';

@QueryService(Customer)
export class CustomerService extends TypeOrmQueryService<Customer> {
    constructor(@InjectRepository(Customer) repo: Repository<Customer>) {
        // pass the use soft delete option to the service.
        super(repo, { useSoftDelete: true });
    }

    async getAllCustomers(): Promise<Customer[]> {
        return this.repo.find();
    }

    async checkProfileCompletion(customerId: number): Promise<boolean> {
        // reselect the customer
        const existingCustomer = await Customer.findOne({
            where: {
                id: customerId,
            },
        });

        const response =
            existingCustomer.firstName && existingCustomer.dob ? true : false;

        return response;
    }
}
