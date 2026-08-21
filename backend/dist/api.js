"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const server = (0, node_http_1.createServer)((req, res) => {
    if (req.method === "GET" && req.url === "/") {
        const answer = {
            "message": "Início"
        };
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(answer));
        return;
    }
    if (req.method === "GET" && req.url === "/what") {
        const answer = {
            "login": "Edna",
            "password": "1234"
        };
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(answer));
        return;
    }
    if (req.method === "POST" && req.url === "/login") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const dados = JSON.parse(body);
            console.log(dados);
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            let answer;
            if (dados.login === "Edna" && dados.password === "1234") {
                answer = {
                    "ok": true
                };
            }
            else {
                answer = {
                    "ok": false
                };
            }
            res.end(JSON.stringify(answer));
        });
        return;
    }
});
server.listen(3000, () => {
    console.log("Serviço rodando em localhost:3000");
});
