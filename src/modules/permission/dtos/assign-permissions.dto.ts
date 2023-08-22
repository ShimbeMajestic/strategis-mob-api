import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AssignPermissionsDto {
    @Field(() => Int)
    roleId: number;

    @Field(() => [Int])
    permissionsIds: number[];
}
