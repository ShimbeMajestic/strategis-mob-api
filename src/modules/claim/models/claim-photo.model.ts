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
import { Claim } from './claim.model';

@ObjectType()
@KeySet(['id'])
@FilterableRelation('upload', () => Upload, {
    remove: { enabled: false },
    update: { enabled: false },
})
@Entity()
export class ClaimPhoto extends BaseEntity {
    @FilterableField(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @FilterableField(() => Int)
    @Column()
    claimId: number; // Made non-nullable as it is required

    @FilterableField(() => Int)
    @Column()
    uploadId: number; // Made non-nullable as it is required

    @FilterableField()
    @Column({ nullable: true })
    attachmentType: string; // Consider using an enum for predefined attachment types

    @FilterableField()
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Claim, (claim) => claim.claimPhotos, {
        nullable: false,
        onDelete: 'CASCADE',
    })  
    claim: Claim;

    @ManyToOne(() => Upload, {
        nullable: false,
    })
    upload: Upload;
}
