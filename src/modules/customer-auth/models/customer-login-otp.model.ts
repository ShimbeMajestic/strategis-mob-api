import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CustomerLoginOtp extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone: string;

    @Column()
    otp: string;

    @Column()
    nonce: string;

    @Column({ default: 0 })
    attempts: number;

    @Column({ nullable: true })
    message?: string;

    @Column({ default: false })
    isRevoked: boolean;

    @Column()
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
