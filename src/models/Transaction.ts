import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import Category from './Category';

@Entity({ name: 'transactions', schema: 'public' })
class Transaction {
  @PrimaryGeneratedColumn({ name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'type', type: 'enum', enum: ['income', 'outcome'] })
  type: 'income' | 'outcome';

  @Column('numeric')
  value: number;

  @Column()
  category_id: string;

  @ManyToOne(() => Category, (category: Category) => category.title, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
