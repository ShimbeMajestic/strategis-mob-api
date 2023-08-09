import { Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FilterableField } from '@ptc-org/nestjs-query-graphql';

@ObjectType()
@Entity()
export class Upload extends BaseEntity {
    @FilterableField(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ nullable: true })
    userId: number;

    @Field()
    @Column()
    name: string;

    @FilterableField()
    @Column()
    fileName: string;

    @FilterableField()
    @Column()
    mimeType: string;

    @FilterableField()
    @Column()
    key: string;

    @FilterableField()
    @Column()
    size: number;

    @Field()
    @Expose()
    get isImage(): boolean {
        return this.mimeType != null && this.mimeType.startsWith('image');
    }

    @Field()
    @Expose()
    get isAudio(): boolean {
        return this.mimeType != null && this.mimeType.startsWith('audio');
    }

    @Field()
    @Expose()
    get isVideo(): boolean {
        return this.mimeType != null && this.mimeType.startsWith('video');
    }

    @Field()
    @Expose()
    get isFile(): boolean {
        return this.mimeType != null && this.mimeType.startsWith('application');
    }

    @FilterableField()
    @CreateDateColumn()
    createdAt: Date;

    @FilterableField()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
