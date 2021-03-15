#!/usr/bin/env node

import { readFile } from "fs"
import path from "path"
import { join } from "path"
import pws from "ws"
const { Server } = pws;

import express from 'express'
const app = express()

import Program from "./program.js"

const programsList = [];

const PORT = 3000;
const __dirname = path.resolve();

const staticApp = express.static("public", {
    extensions: [ "html", "js", "css" ]
});

// Serve static content
app.use("/public", staticApp);

app.get("/", (req, res, next) => {
    res.sendFile(join(__dirname, "public/index.html"))
});

readFile(join(__dirname, "programs/index.json"), (err, data) => {
    if (err) {
        console.error("No programs were provided to the server:");
        console.error(err);
        return;
    }

    const str = Buffer.from(data);
    try {
        const programsData = JSON.parse(str);
        for (const individualProgram of programsData) {
            const p = new Program(individualProgram.Name, 
                                  individualProgram.Program, 
                                  [ join(__dirname, "programs", individualProgram.Path) ]); 
            
            p.run();
            // TODO: Add logic for reading "info" message and broadcast it to all clients 
          
            // Run static routers with data associated with program
            const staticProgramData = express.static(join(__dirname, "programs", individualProgram.Static), {
                extensions: [ "html", "js", "css" ]
            });

            app.use("/" + individualProgram.Name.replace(" ", "%20") , staticProgramData);

            console.log("/" + individualProgram.Name.replace(" ", "%20"));
            console.log( join(__dirname, "programs", individualProgram.Static));

            programsList.push(p);
        }
    }
    catch (err) {
        console.error("Invalid file format, no programs were loaded");
        console.error(err);
        return;
    }
});

const wsServer = new Server({
    port: 8000
});

let socketsList = [];

wsServer.on("connection", (currentSocket) => {
    socketsList.push(currentSocket);

    currentSocket.on("message", (msg) => {
        msg = JSON.parse(msg);
        const pName = msg.program;
        const p = programsList.filter((v) => { return v.getName() === pName; });
        if (p.length === 1) {
            const prog = p[0];
            prog.once("data", (d) => {
                console.log(d);
                prog.clearData();
                currentSocket.send(JSON.stringify(d));
            });        
            prog.send(msg.msg);
        }
    });

    currentSocket.on("close", () => {
        // Removes closed socket
        socketsList = socketsList.filter((s) => { return s !== currentSocket });
    });
});


app.listen(PORT, () => {
    console.log(`Thinking on port ${PORT}`);
})
