import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
	name: 'test',
	type: 'postgres',
	host: '127.0.0.1',
	port: 5432,
	username: 'postgres',
	password: 'toto42',
	logging: false,
	synchronize: true,
	entities: ['./models/models/**/*.ts'],
});
