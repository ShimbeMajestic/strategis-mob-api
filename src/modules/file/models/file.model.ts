import { FilterableField, KeySet } from '@nestjs-query/query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Expose } from 'class-transformer';
import * as prettyBytes from 'pretty-bytes';

@Entity()
@ObjectType()
@KeySet(['id'])
export class File extends BaseEntity {
  @FilterableField(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  name: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  userId: number;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  key: string;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  size: number;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  mimeType: string;

  @FilterableField(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @FilterableField(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;

  @Field()
  @Expose()
  get humanReadableSize(): string {
    return prettyBytes(this.size);
  }

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
}
