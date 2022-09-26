import { DataSource } from "typeorm";

export const connectionSource = new DataSource({
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "postgres",
    "database": "lireddit3",
    "entities": ["dist/entities/*.js"],
    "migrations": ["dist/migrations/*.js"]
});