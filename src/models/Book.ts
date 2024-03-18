import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('text',{nullable:true})
  title: string;

  @Column('text',{nullable:true})
  author: string;

  @Column('text',{nullable:true})
  isbn: string;
}