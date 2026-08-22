import mariadb from "mariadb";

const pool = mariadb.createPool({
    host: "localhost",
    user: "cvet",
    password: "penne",
    database: "cvet",
    connectionLimit: 5
});

export default pool;