import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}