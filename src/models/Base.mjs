import db from '../db/connection.mjs';

export default class BaseModel {
    constructor(table) {
        this.table = table;
    }

    static async getCount() {
        const [results] = await db.query(`SELECT COUNT(*) FROM ${this.table}`);
        return results ? parseInt(results['COUNT(*)']) : 0;
    }

    static async getAll(count = 10, page = 1) {
        console.log(this.table);
        const results = await db.query(`SELECT * FROM ${this.table} ORDER BY RAND() LIMIT ? OFFSET ?`, [parseInt(count), (page - 1) * parseInt(count)]);
        return results.map(result => this.fromJSON(result));
    }
    
}