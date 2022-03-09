import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
@InputType('LocationInput')
export class Location {

    @Field()
    latitude: string;

    @Field()
    longitude: string;
}