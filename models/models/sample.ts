import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Sample {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 100
    })
    name: string;

    @Column({
        length: 100,
        nullable: true
    })
    lastname: string;
}
