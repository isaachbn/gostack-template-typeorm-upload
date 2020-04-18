import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categories', schema: 'public' })
class Category {
  @PrimaryGeneratedColumn({ name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Category;
