import mariadb from "mariadb";

const pool = mariadb.createPool({
    host: "localhost",
    user: "coruja",
    password: process.env.DB_PASSWORD,
    database: "coruja",
    connectionLimit: 5
});

export default pool;