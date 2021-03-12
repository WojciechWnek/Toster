#!/usr/bin/env node

import { join } from "path"
import { Server } from "ws"

import express, {static} from 'express'
const app = express()

import Program from "./program"

const p1 = new Program("test", "sh", [ "./echo.sh" ]);

p1.on("data", (d) => {
    console.log(d);
});

p1.run();

p1.send({ x: 123, y : 5, arr: [ 3, 4 , 5] });

const staticApp = static("public", {
    extensions: [ "html", "js", "css" ]
})

// Serve static content
app.use("/public", staticApp)

app.get("/", (req, res, next) => {
    res.sendFile(join(__dirname, "public/index.html"))
})

const wsServer = new Server({
    port: 8000
})

const socketsList = []

wsServer.on("connection", (currentSocket) => {
    socketsList.push(currentSocket);

    currentSocket.on("message", (msg) => {
        console.log(msg);
        currentSocket.send("Henlo Boo");
    });

    currentSocket.on("close", () => {
        // Removes closed socket
        socketsList = socketsList.filter((s) => { return s !== currentSocket });
    });
})

app.listen(3000)
