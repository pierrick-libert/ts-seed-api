import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
	name: 'docker',
	type: 'postgres',
	host: 'postgres',
	port: 5432,
	username: 'postgres',
	password: 'toto42',
	database: 'ts_seed_api',
	logging: false,
	synchronize: false,
	entities: ['./dist/models/models/**/*.js'],
	migrations: ['./dist/models/migrations/**/*.js'],
	subscribers: ['./dist/models/subscribers/**/*.js'],
	cli: {
		entitiesDir: './models/models',
		migrationsDir: './models/migrations',
		subscribersDir: './models/subscribers'
	}
});
