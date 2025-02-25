import { InputType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { IsDefined, IsOptional, IsMobilePhone, IsEnum } from 'class-validator';
import { GenderEnum } from 'src/modules/lists/enums/gender.enum';

@InputType()
export class CreateUserInput {
    @IsDefined()
    @Field()
    email: string;

    @IsDefined()
    @Field()
    password: string;

    @IsOptional()
    @Field({ nullable: true, defaultValue: true })
    active?: boolean;

    @IsOptional()
    @Field({ nullable: true })
    roleId?: number;

    @Field()
    firstName: string;

    @IsOptional()
    @Field({ nullable: true })
    middleName?: string;

    @Field()
    lastName: string;

    @IsOptional()
    @IsMobilePhone()
    @Field({ nullable: true })
    phone?: string;

    @IsOptional()
    @IsEnum(GenderEnum)
    @Field({ nullable: true })
    gender?: GenderEnum;

    @Field(() => GraphQLISODateTime, { nullable: true })
    dateOfBirth?: Date;

    @IsOptional()
    @Field({ nullable: true })
    residenceID: string;

    @IsOptional()
    @Field({ nullable: true })
    workID: string;

    @IsOptional()
    @Field({ nullable: true })
    address: string;

    @IsOptional()
    @Field(() => Int, { nullable: true })
    countryId?: number;

    @IsOptional()
    @Field(() => Int, { nullable: true })
    regionId?: number;
}
