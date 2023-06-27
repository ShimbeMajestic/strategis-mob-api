import { Module } from '@nestjs/common';
import { UserService } from './providers/user.service';
import { UserResolver } from './resolvers/user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SortDirection } from '@ptc-org/nestjs-query-core';
import { UsePermission } from '../permission/decorators/permission.decorator';
import { PermissionEnum } from '../permission/enums/permission.enum';
import { GqlAuthGuard } from '../auth/auth.guard';
import { PermissionGuard } from '../permission/guards/permission.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
        NestjsQueryGraphQLModule.forFeature({
            // import the NestjsQueryTypeOrmModule to register the entity with typeorm
            // and provide a QueryService
            imports: [NestjsQueryTypeOrmModule.forFeature([User])],
            // describe the resolvers you want to expose
            resolvers: [
                {
                    DTOClass: User,
                    EntityClass: User,
                    CreateDTOClass: CreateUserInput,
                    UpdateDTOClass: UpdateUserInput,
                    // guards: [GqlAuthGuard, PermissionGuard],
                    read: {
                        defaultSort: [
                            {
                                field: 'id',
                                direction: SortDirection.DESC,
                            },
                        ],
                        decorators: [UsePermission(PermissionEnum.VIEW_USERS)],
                    },
                    create: {
                        // decorators: [
                        //     UsePermission(PermissionEnum.MANAGE_USERS),
                        // ],
                    },
                    update: {
                        decorators: [
                            UsePermission(PermissionEnum.MANAGE_USERS),
                        ],
                    },
                    delete: { disabled: true },
                },
            ],
        }),
    ],
    providers: [UserService, UserResolver],
    exports: [UserService],
})
export class UserModule {}
