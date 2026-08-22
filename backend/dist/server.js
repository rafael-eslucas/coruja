"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const node_crypto_1 = require("node:crypto");
const db_js_1 = __importDefault(require("./db.js"));
const frontend = (0, node_path_1.join)(process.cwd(), "../frontend");
let sessoes = new Map();
const server = (0, node_http_1.createServer)(async (req, res) => {
    if (req.method === "GET" && req.url === "/") {
        const html = await (0, promises_1.readFile)((0, node_path_1.join)(frontend, "index.html"), "utf8");
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(html);
        return;
    }
    if (req.method === "GET" && req.url === "/images/logo.jpg") {
        const html = await (0, promises_1.readFile)((0, node_path_1.join)(frontend, "images/logo.jpg"));
        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });
        res.end(html);
        return;
    }
    if (req.method === "GET" && req.url === "/style.css") {
        const html = await (0, promises_1.readFile)((0, node_path_1.join)(frontend, "style.css"), "utf8");
        res.writeHead(200, {
            "Content-Type": "text/css"
        });
        res.end(html);
        return;
    }
    if (req.method === "GET" && req.url === "/login") {
        const html = await (0, promises_1.readFile)((0, node_path_1.join)(frontend, "login.html"), "utf8");
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(html);
        return;
    }
    if (req.method === "GET" && req.url === "/login.js") {
        const js = await (0, promises_1.readFile)((0, node_path_1.join)(frontend, "login.js"), "utf8");
        res.writeHead(200, {
            "Content-Type": "text/javascript"
        });
        res.end(js);
        return;
    }
    if (req.method === "GET" && req.url === "/pacientes") {
        const cookie = req.headers.cookie;
        const session = cookie?.split("; ").find(c => c.startsWith("session="))?.split("=")[1];
        console.log(`Sessão: ${session}`);
        console.log(`Cookie: ${cookie}`);
        if (session && sessoes.has(session)) {
            const html = await (0, promises_1.readFile)((0, node_path_1.join)(frontend, "pacientes.html"), "utf8");
            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.end(html);
            return;
        }
        res.writeHead(401, {
            "Content-Type": "applications/json"
        });
        res.end(JSON.stringify({
            "authorized": false
        }));
    }
    if (req.method === "GET" && req.url === "/api/db") {
        const answer = await db_js_1.default.query("SELECT * FROM users");
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(answer));
        return;
    }
    if (req.method === "POST" && req.url === "/api/login") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", async () => {
            const dados = JSON.parse(body);
            console.log(dados);
            let users = await db_js_1.default.query("SELECT * FROM users WHERE login = ?", [dados.login]);
            let answer = {
                "authorized": false
            };
            for (const user of users) {
                if (dados.login === user.login && dados.password === user.password) {
                    let session = (0, node_crypto_1.randomBytes)(32).toString("hex");
                    sessoes.set(session, user.id);
                    console.log(`Criando sessão: ${session}`);
                    res.writeHead(200, {
                        "Content-Type": "application/json",
                        "Set-Cookie": `session=${session}; Path=/; HttpOnly; SameSite=Lax`
                    });
                    answer = {
                        "authorized": true
                    };
                    res.end(JSON.stringify(answer));
                    return;
                }
            }
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify(answer));
        });
    }
});
server.listen(3000, () => {
    console.log("Serviço rodando em localhost:3000");
});
