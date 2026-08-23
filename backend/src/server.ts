import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import pool from "./db.js";

const frontend = join(process.cwd(), "../frontend");

let sessoes = new Map<string, number>();

const server = createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/") {
        const html = await readFile(
            join(frontend, "index.html"),
            "utf8"
        )

        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(html);
        return;
    }
    if (req.method === "GET" && req.url === "/images/logo.jpg") {
        const html = await readFile(
            join(frontend, "images/logo.jpg")
        )

        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });
        res.end(html);
        return;
    }
    if (req.method === "GET" && req.url === "/style.css") {
        const html = await readFile(
            join(frontend, "style.css"),
            "utf8"
        )

        res.writeHead(200, {
            "Content-Type": "text/css"
        });
        res.end(html);
        return;
    }
    if (req.method === "GET" && req.url === "/index.css") {
        const html = await readFile(
            join(frontend, "index.css"),
            "utf8"
        )

        res.writeHead(200, {
            "Content-Type": "text/css"
        });
        res.end(html);
        return;
    }
    if (req.method === "GET" && req.url === "/login.css") {
        const html = await readFile(
            join(frontend, "login.css"),
            "utf8"
        )

        res.writeHead(200, {
            "Content-Type": "text/css"
        });
        res.end(html);
        return;
    }
    if (req.method === "GET" && req.url === "/login") {
        const html = await readFile(
            join(frontend, "login.html"),
            "utf8"
        )

        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(html);
        return;
    }
    if (req.method === "GET" && req.url === "/login.js") {
        const js = await readFile(
            join(frontend, "login.js"),
            "utf8"
        )

        res.writeHead(200, {
            "Content-Type": "text/javascript"
        });
        res.end(js);
        return;
    }
    if (req.method === "GET" && req.url === "/patients.js") {
        const js = await readFile(
            join(frontend, "patients.js"),
            "utf8"
        )

        res.writeHead(200, {
            "Content-Type": "text/javascript"
        });
        res.end(js);
        return;
    }

    if (req.method === "GET" && req.url === "/patients") {
        const cookie = req.headers.cookie;
        const session = cookie?.split("; ").find(c => c.startsWith("session="))?.split("=")[1];

        if (session && sessoes.has(session)) {
            const html = await readFile(
                join(frontend, "patients.html"),
                "utf8"
            )

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

    if (req.method === "GET" && req.url === "/api/patients") {
        const cookie = req.headers.cookie;
        const session = cookie?.split("; ").find(c => c.startsWith("session="))?.split("=")[1];
        if (session && sessoes.has(session)) {
            const patients = await pool.query("SELECT * FROM patients");
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            patients.authorized = true;
            res.end(JSON.stringify(patients));
            return;
        }
        res.writeHead(401, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
            "authorized": false
        }));
        return;
    }
    if (req.method === "POST" && req.url === "/api/patients") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {
            const data = JSON.parse(body);
            const cookie = req.headers.cookie;
            const session = cookie?.split("; ").find(c => c.startsWith("session="))?.split("=")[1];
            if (session && sessoes.has(session)) {
                const patient = data;
                const owner = patient.owner_id;
                if (owner == 0) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({"error": "no owner"}));
                    return;
                }
                const database_owner = await pool.query("SELECT * FROM owners WHERE id = ?", [owner]);
                if (database_owner.length === 0) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({"error": "no owner"}));
                    return;
                } 
                
                const name = patient.name;
                const species = patient.species;
                const breed = patient.breed;
                const birth = patient.birth;
                const notes = patient.notes;
                console.log(name);
                console.log(species);
                console.log(breed);
                console.log(birth);
                console.log(notes);
                console.log(owner);

                await pool.query(
                    "INSERT INTO patients (name, specie, breed, birth, owner_id, notes) VALUES (?, ?, ?, ?, ?, ?)",
                    [name, species, breed, birth, owner, notes]
                );

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    "error": null
                }));
                return;
            }
            res.writeHead(401, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
                "authorized": false
            }));
            return;
        });
    }

    if (req.method === "POST" && req.url === "/api/login") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            const dados = JSON.parse(body);

            console.log(dados);
            let users = await pool.query("SELECT * FROM users WHERE login = ?", [dados.login]);
            let answer = {
                "authorized": false
            };
            for (const user of users) {
                if (dados.login === user.login && dados.password === user.password) {
                    let session: string = randomBytes(32).toString("hex");
                    sessoes.set(session, user.id);
                    console.log(`Criando sessão: ${session}`);
                    res.writeHead(200, {
                        "Content-Type": "application/json",
                        "Set-Cookie": `session=${session}; Path=/; HttpOnly; SameSite=Lax`
                    });
                    answer = {
                        "authorized": true
                    }
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