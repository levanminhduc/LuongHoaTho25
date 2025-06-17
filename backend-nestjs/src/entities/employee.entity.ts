import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('nhan_vien')
export class Employee {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  ma_nv: string;

  @Column({ type: 'varchar', length: 100 })
  ho_ten: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cccd: string;

  @Column({ type: 'varchar', length: 50 })
  chuc_vu: string;

  @Column({ type: 'varchar', length: 50 })
  phong_ban: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  luong_co_ban: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  he_so_luong: number;

  @Column({ type: 'int', default: 0 })
  so_ngay_cong: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  phu_cap: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  thuong: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  khau_tru: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  luong_thuc_linh: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
