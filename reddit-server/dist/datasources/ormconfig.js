"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionSource = void 0;
const typeorm_1 = require("typeorm");
exports.connectionSource = new typeorm_1.DataSource({
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "postgres",
    "database": "lireddit3",
    "entities": ["dist/entities/*.js"],
    "migrations": ["dist/migrations/*.js"]
});
//# sourceMappingURL=ormconfig.js.map