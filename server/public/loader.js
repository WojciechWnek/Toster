const programs = [ "Echo%20program",  "Python%20repl" ]; // This should be dynamically loaded

window.onload = () => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "text/html";
    const pc = document.getElementById("programsContainer");

    xhr.onload = () => {
        const el = document.createElement("div");
        el.innerHTML = xhr.response;
        pc.appendChild(el);

        if (programs.length > 0) {
            xhr.open("GET", programs.shift() + "/" + "index.html");
            xhr.send();
        }
    };

    xhr.onerror = (e) => {
        console.error(e);

        if (programs.length > 0) {
            xhr.open("GET", programs.shift() + "/" + "index.html");
            xhr.send();
        }
    }
    
    xhr.open("GET", programs.shift() + "/" + "index.html");
    xhr.send();
}




