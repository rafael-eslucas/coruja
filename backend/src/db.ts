import mariadb from "mariadb";

const pool = mariadb.createPool({
    host: "localhost",
    user: "coruja",
    password: "penne",
    database: "coruja",
    connectionLimit: 5
});

export default pool;