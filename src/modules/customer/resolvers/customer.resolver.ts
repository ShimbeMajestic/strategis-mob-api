import { CRUDResolver } from '@ptc-org/nestjs-query-graphql';
import { UseGuards } from '@nestjs/common';
import {
    Resolver,
    ResolveField,
    Parent,
    Mutation,
    Args,
    Query,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/modules/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/modules/auth/auth.guard';
import { UsePermission } from 'src/modules/permission/decorators/permission.decorator';
import { AllowUserType } from 'src/modules/permission/decorators/user-type.decorator';
import { PermissionEnum } from 'src/modules/permission/enums/permission.enum';
import { UserTypeEnum } from 'src/modules/permission/enums/user-type.enum';
import { PermissionGuard } from 'src/modules/permission/guards/permission.guard';
import { UserTypeGuard } from 'src/modules/permission/guards/user-type.guard';
import { User } from 'src/modules/user/models/user.model';
import { UpdateCustomerProfileInput } from '../dto/update-customer-profile.input';
import { Customer } from '../models/customer.model';
import { CustomerService } from '../providers/customer.service';

@UseGuards(GqlAuthGuard, PermissionGuard)
@Resolver(() => Customer)
export class CustomerResolver extends CRUDResolver(Customer, {
    read: { decorators: [UsePermission(PermissionEnum.VIEW_CUSTOMERS)] },
    enableAggregate: true,
    enableTotalCount: true,
    enableSubscriptions: true,
}) {
    constructor(readonly service: CustomerService) {
        super(service);
    }

    @ResolveField(() => Boolean)
    requiresProfileUpdate(@Parent() customer: Customer): boolean {
        const requiresUpdate = !customer.firstName || !customer.lastName;

        return !!requiresUpdate;
    }

    // Update the customer profile
    @Mutation(() => Customer)
    @UseGuards(UserTypeGuard)
    @AllowUserType(UserTypeEnum.CUSTOMER)
    updateCustomerProfile(
        @Args('input') input: UpdateCustomerProfileInput,
        @CurrentUser() user: User,
    ) {
        return this.service.updateOne(user.id, input);
    }

    // Get all customers
    @Query(() => [Customer])
    @AllowUserType(UserTypeEnum.ADMIN)
    async allCustomers(): Promise<Customer[]> {
        const customers = await Customer.find({
            order: {
                id: 'DESC',
            },
        });

        return customers;
    }
}
