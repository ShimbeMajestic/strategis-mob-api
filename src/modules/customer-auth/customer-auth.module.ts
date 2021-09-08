import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { CustomerAuthService } from './providers/customer-auth.service';
import { CustomerAuthResolver } from './resolvers/customer-auth.resolver';

@Module({
    providers: [CustomerAuthService, CustomerAuthResolver],
    imports: [AuthModule, SharedModule],
})
export class CustomerAuthModule { }
