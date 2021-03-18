// ROBOT TOSTER - MIT 2021
//
// -----
//
// This is an api for programs loading etc.

import { readFile } from "fs"
import { join } from "path"

// TODO: startPrograms should return object that contains 
//       all programs names and emit events when there is any info
//       so it needs to inherit EventEmmiter as well I guess

export default function startPrograms() {
    return new Promise((resolve, reject) => {
        readFile(join(__dirname, "programs/index.json"), (err, data) => {
            if (err) {
                console.error("No programs were provided to the server:");
                console.error(err);
                reject();
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

                    programsList.push(p);
                }

                const programsNames = programsData.map((v) => v.Name);
                resolve(programsNames); 
            }
            catch (err) {
                console.error("Invalid file format, no programs were loaded");
                console.error(err);
                reject();
            }
        });
    });
}



