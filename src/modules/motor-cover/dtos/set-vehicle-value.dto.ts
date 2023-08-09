import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class SetVehicleValueDto {
    @Field()
    @IsNotEmpty()
    value: number;

    @Field()
    @IsNotEmpty()
    requestId: number;
}
