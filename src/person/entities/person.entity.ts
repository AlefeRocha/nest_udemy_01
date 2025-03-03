import { IsEmail } from "class-validator";
import { MessageEntity } from "src/messages/entities/message.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PersonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ length: 255 })
    passwordHash: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @OneToMany(() => MessageEntity, message => message.by)
    messagesSent: MessageEntity[];

    @OneToMany(() => MessageEntity, message => message.to)
    messagesReceived: MessageEntity[];
}
