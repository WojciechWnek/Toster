// ROBOT TOSTER - MIT 2021
//
// -----
//
// This files contains implementation of
// client side websocket communiaction as
// well as its logs.


// 
// Public functions and variables
//


const getLogs = () => {
    return _logs;
}

const sendRequest = (program, message) => {
    return new Promise(async (resolve, reject) => {
        if (typeof(message) !== "object") return reject({
            error: true,
            msg: "Message is not an object"
        });

        const id = await _getUniqueId();

        const requestToBeSend = {
            type: "request",
            id: id,
            program: program,
            msg: message
        }; 

        _pushLog(requestToBeSend);
        
        const messageHandler = (msg) => {
            try {
                const message = JSON.parse(msg.data);
                if (message.id === id) {
                    resolve(message);
                    _pushLog(message);
                    _ws.removeEventListener("message", messageHandler);
                }
            }   
            catch {
            }
        };

        _ws.addEventListener("message", messageHandler);

        setTimeout(() => {
            reject({ error: true, msg: "Timeout" });
            _ws.removeEventListener("message", messageHandler);
        }, _communicationTimeout);

        _ws.send(JSON.stringify(requestToBeSend));
    });
}

const registerInfoHandler = (fn) => {
    _ws.addEventListener("message", (msg) => {
        try {
            const message = JSON.parse(msg.data);
            if (message.type === "info") {
                fn(message);
                _pushLog(message);
            }
        }   
        catch {
        }
    });
};

//
// Private functions and variables
//

const _ws = new WebSocket(`ws://${location.hostname}:8000`);
const _communicationTimeout = 1000;

_ws.onerror = (err) => {
    console.error(err);
}

const _getUniqueId = () => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "text";
        xhr.onload = () => {
            const id = parseInt(xhr.response);
            resolve(id);
        };

        xhr.onerror = (e) => {
            console.error(e);
            reject(e);
        };

        xhr.open("GET", "/api/id");
        xhr.send();   
    });
};

const _logs = [];

const _pushLog = (r) => {
    _logs.push({
        timestamp: Date.now(),
        data: r
    });

    if (_logs.length > 20) {
        _logs.shift();
    }
}

const _sendRawRequest = (req) => {
    return new Promise((resolve, reject) => {
        _ws.onmessage = (msg) => {
            resolve(msg.data);
        };

        setTimeout(() => {
            reject({ error: true, msg: "Timeout" });
        }, _communicationTimeout);

        _ws.send(JSON.stringify(req));
    });
}

