import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';

import {
    FilterableField,
    FilterableRelation,
    KeySet,
} from '@ptc-org/nestjs-query-graphql';
import { Int, ObjectType } from '@nestjs/graphql';
import { Upload } from 'src/shared/uploads/models/upload.model';
import { MotorCoverRequest } from './motor-cover-request.model';

@ObjectType()
@KeySet(['id'])
@FilterableRelation('upload', () => Upload, {
    remove: { enabled: false },
    update: { enabled: false },
})
@Entity()
export class VehiclePhoto extends BaseEntity {
    @FilterableField(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @FilterableField(() => Int, { nullable: true })
    @Column({ nullable: true })
    motorCoverRequestId: number;

    @FilterableField(() => Int)
    @Column()
    uploadId: number;

    @FilterableField()
    @Column({ comment: 'FRONT, BACK, LEFT, etc', default: null, length: 10 })
    view: string;

    @FilterableField()
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(
        () => MotorCoverRequest,
        (coverRequest) => coverRequest.vehiclePhotos,
        { nullable: true, onDelete: 'CASCADE' },
    )
    motorCoverRequest: MotorCoverRequest;

    @ManyToOne(() => Upload)
    upload: Upload;
}
