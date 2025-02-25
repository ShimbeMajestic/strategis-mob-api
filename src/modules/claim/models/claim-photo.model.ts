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

    @FilterableField(() => Int, { nullable: true })
    @Column({ nullable: true })
    claimId: number;

    @FilterableField(() => Int)
    @Column({ nullable: true })
    uploadId: number;

    @FilterableField()
<<<<<<< HEAD
    @Column({ nullable: true })
    attachmentType: string;

    @FilterableField()
=======
>>>>>>> 1a445934da4b350261b65a0c2e25edaaf5a011c3
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Claim, (claim) => claim.claimPhotos, {
        nullable: true,
        onDelete: 'CASCADE',
<<<<<<< HEAD
    })  
=======
    })
>>>>>>> 1a445934da4b350261b65a0c2e25edaaf5a011c3
    claim: Claim;

    @ManyToOne(() => Upload, {
        nullable: true,
    })
    upload: Upload;
}
