import { createServer, IncomingMessage } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import pool from "./db.js";

const frontend = join(process.cwd(), "../frontend");

let sessoes = new Map<string, number>();
const files: Record<string, [string, string]> = {
    "/": ["index.html", "text/html"],
    "/style.css": ["style.css", "text/css"],
    "/index.css": ["index.css", "text/css"],
    "/login.css": ["login.css", "text/css"],
    "/patients.css": ["patients.css", "text/css"],
    "/login.js": ["login.js", "text/javascript"],
    "/patients.js": ["patients.js", "text/javascript"],
    "/images/logo.jpg": ["images/logo.jpg", "image/jpeg"],
    "/login": ["login.html","text/html"]
};

const server = createServer(async (req, res) => {
    console.log("serving", req.method, req.url)

    const url = req.url;
    if (req.method === "GET" && url && files[url]) {
        const [file, contentType] = files[url];
        const content = await readFile(
            join(frontend, file)
        );
        res.writeHead(200, {
            "Content-Type": contentType
        })
        res.end(content);
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
        if (!verifyCookie(req)) {
            res.writeHead(401, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
                "authorized": false
            }));
            return;
        }
        const patients = await pool.query("SELECT * FROM patients");
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        patients.authorized = true;
        res.end(JSON.stringify(patients));
    }

    if (req.method === "POST" && req.url === "/api/addpatient") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {
            if (!verifyCookie(req)) {
                res.writeHead(401, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    "authorized": false
                }));
                return;
            }

            const patient = JSON.parse(body);
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

            await pool.query(
                "INSERT INTO patients (name, species, breed, birth, owner_id, notes) VALUES (?, ?, ?, ?, ?, ?)",
                [name, species, breed, birth, owner, notes]
            );

            res.writeHead(201, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
                "error": null
            }));
            return;
        });
    }
    if (req.method === "POST" && req.url === "/api/addowner") {
        console.log("owning")
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {
            if (!verifyCookie(req)) {
                res.writeHead(401, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
                "authorized": false
            }));
            return;
            }

            const owner = JSON.parse(body);
            const name = owner.name;
            const phone = owner.phone;
            const city = owner.city;
            const neighborhood = owner.neighborhood;
            const street = owner.street;
            const number = owner.number;

            await pool.query(
                "INSERT INTO owners (name, phone, city, neighborhood, street, number) VALUES (?, ?, ?, ?, ?, ?)",
                [name, phone, city, neighborhood, street, number]
            );

            res.writeHead(201, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
                "error": null
            }));
            return;
        });
    }

    if (req.method === "POST" && req.url === "/api/getpatient") {
        console.log("getpatienting");
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {
            const data = JSON.parse(body);
            if (!verifyCookie(req)) {
                res.writeHead(401, {
                    "Content-TYpe": "application/json"
                })
                res.end({
                    "authorized": false
                })
                return;
            }
            
            const patients = await pool.query(`SELECT * FROM patients WHERE ${data.row} LIKE ? `, [`%${data.value}%`]);
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify(patients));
            console.log(patients);

        });
    }
    if (req.method === "POST" && req.url === "/api/gettutor") {
        console.log("gettutoring");
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {
            const data = JSON.parse(body);
            if (!verifyCookie(req)) {
                res.writeHead(401, {
                    "Content-TYpe": "application/json"
                })
                res.end({
                    "authorized": false
                })
                return;
            }
            
            const tutors = await pool.query(`SELECT * FROM owners WHERE ${data.row} LIKE ? `, [`%${data.value}%`]);
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify(tutors));
            console.log(tutors);

        });
    }

    if (req.method === "POST" && req.url === "/api/editpatient") {
        console.log("editpatienting");
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {
            if (!verifyCookie(req)) {
                res.writeHead(401, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    "authorized": false
                }));
                return;
            }

            const patient = JSON.parse(body);
            console.log(body);
            console.log(`id: ${patient.id}`);

            const isthere = await pool.query("SELECT * FROM patients WHERE id = ?", [patient.id]);
            console.log(isthere);
            if (isthere.length === 0) {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({"error": "no patient to edit"}));
                return;
            } 
              
            const id = patient.id;
            const name = patient.name;
            const species = patient.species;
            const breed = patient.breed;
            const birth = patient.birth;
            const notes = patient.notes;
            const owner = patient.owner;

            await pool.query(
                "UPDATE patients SET name = ?, species = ?, breed = ?, birth = ?, owner_id = ?, notes = ? WHERE id = ?",
                [name, species, breed, birth, owner, notes, id]
            );

            res.writeHead(201, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
                "error": null
            }));
            return;
        });
    }
    if (req.method === "POST" && req.url === "/api/edittutor") {
        console.log("editpatienting");
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {
            if (!verifyCookie(req)) {
                res.writeHead(401, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    "authorized": false
                }));
                return;
            }

            const owner = JSON.parse(body);
            const id = owner.id;
            const name = owner.name;
            const phone = owner.phone;
            const city = owner.city;
            const neighborhood = owner.neighborhood;
            const street = owner.street;
            const number = owner.number;

            await pool.query(
                "UPDATE owners SET name = ?, phone = ?, city = ?, neighborhood = ?, street = ?, number = ? WHERE id = ?",
                [name, phone, city, neighborhood, street, number, id]
            );

            res.writeHead(201, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
                "error": null
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

function verifyCookie(req: IncomingMessage): boolean {
    const cookie = req.headers.cookie;
    const session = cookie?.split("; ").find(c => c.startsWith("session="))?.split("=")[1];
    return !!(session && sessoes.has(session));
}