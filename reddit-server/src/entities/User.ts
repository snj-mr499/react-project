
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";
import { Post } from "./Post";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class User extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({unique: true})
    username!: string;

    @Field(() => String)
    @Column({unique: true, nullable: true})
    email!: string;

    @Column()
    password!: string;

    @OneToMany(() => Post, post => post.creator)
    posts: Post[];

    @OneToMany(() => Updoot, (updoot) => updoot.user)
    updoots: Updoot[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt?: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt?: Date;

}
