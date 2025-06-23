import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('luong_import')
export class SalaryImport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  ma_nv: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ho_ten: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  luong_cb: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  phu_cap: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  thue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  thuc_linh: number;

  @Column({ type: 'tinyint', default: 0 })
  da_ky: number;

  @Column({ type: 'datetime', nullable: true })
  ngay_ky: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ten_da_ky: string;

  @CreateDateColumn()
  created_at: Date;
}
