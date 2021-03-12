// ROBOT TOSTER - MIT 2021
//
// -----
//
// This file provides api for programs management
// potentially splitted in the future

import { spawn } from 'child_process';
import EventEmmiter from 'events';

export default class Program extends EventEmmiter {
    constructor(formalName, cmd, args = []) {
        super();
        this.formalName = formalName;
        this.cmd = cmd;
        this.cargs = args;
        this.processReference = null;
        this._data = null;
    }

    run() {
        this.processReference = spawn(this.cmd, this.cargs);

        this._data = null; // Create empty buffer

        this.processReference.stdout.on("data", (chunk) => {
            if (this._data === null) {
                this._data = chunk;
            }
            else {
                // If it is not a buffer convert it to buffer
                if (typeof chunk === "string") 
                    this._data = Buffer.concat([ this._data, Buffer.from(chunk)]);
                else 
                    this._data = Buffer.concat([ this._data, chunk ]);
            }

            const str = this._data.toString('utf8');
            console.log(str);
            try {
                const parsedResult = JSON.parse(str);
                this.emit("data", parsedResult);
                // Clear current this._data and end function
                this._data = null; 
                return;
            }
            catch {
                // If couldn't be parsed then wait more
            };
        });
    }

    // Should be run to clean cache, for example
    // when program timeouts
    clearData() {
        this._data = null;
    }

    send(request) {
        let output = null;
        if (typeof request === "object") // I assume this one as object
            output = Buffer.from(JSON.stringify(request) + "\n");
        else // I assume this one as string
            throw "Requst must be an object";
        
        this.processReference.stdin.write(output);
    }
}
