// ROBOT TOSTER - MIT 2021
//
// -----
//
// This file provides simple function:
// sendRequst(program, msg)
// All it does is sents it over websocket 
// and returns response or throws error


const _ws = new WebSocket('ws://localhost:8000');
const _communicationTimeout = 1000;

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

const getLogs = () => {
    return _logs;
}

const sendRequest = async (program, message) => {
    if (typeof(message) != "object") return {
        error: true,
        msg: "Message is not an object"
    };

    const requestToBeSend = {
        type: "request",
        "program": program,
        msg: message
    }; 

    _pushLog(requestToBeSend);

    try {
        const response = await _sendRawRequest(requestToBeSend);
        _pushLog(response);
        return response;
    }
    catch (err) {
        return err; 
    }
}
