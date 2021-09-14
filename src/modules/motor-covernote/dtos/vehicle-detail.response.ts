import { Field, ObjectType } from "@nestjs/graphql";

export enum MotorCategory {
    MOTOR_VEHICLE = 1,
    MOTOR_CYCLE = 2,
}

export enum OwnerCategory {
    SOLE_PROPRIETOR = 1,
    CORPORATE = 2,
}

@ObjectType()
export class TiraResponseHeaders {
    @Field()
    ResponseId: string;

    @Field()
    RequestId: string;

    @Field()
    ResponseStatusCode: string;

    @Field()
    ResponseStatusDesc: string;
}

@ObjectType()
export class VehicleDetailDto {

    @Field()
    MotorCategory: MotorCategory;

    @Field()
    RegistrationNumber: string;

    @Field()
    BodyType: string;

    @Field()
    SittingCapacity: number;

    @Field()
    ChassisNumber?: string;

    @Field()
    Make?: string;

    @Field()
    Model?: string;

    @Field()
    ModelNumber?: string;

    @Field()
    Color?: string;

    @Field()
    EngineNumber?: string;

    @Field()
    EngineCapacity?: number;

    @Field()
    FuelUsed?: string;

    @Field()
    NumberOfAxles?: number;

    @Field()
    AxleDistance?: number;

    @Field()
    YearOfManufacture?: number;

    @Field()
    TareWeight?: number;

    @Field()
    GrossWeight?: number;

    @Field()
    MotorUsage?: number;

    @Field()
    OwnerName?: string;

    @Field()
    OwnerCategory?: number;

}

@ObjectType()
export class VehicleDetailResponse {
    @Field(() => TiraResponseHeaders, {
        nullable
            : true
    })
    headers?: TiraResponseHeaders;

    @Field(() => VehicleDetailDto, {
        nullable
            : true
    })
    data?: VehicleDetailDto;
}

