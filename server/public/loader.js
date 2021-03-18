const loadPrograms = () => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "text/json";

        xhr.onload = () => {
            resolve(JSON.parse(xhr.response));
        };

        xhr.onerror = (e) => {
            console.error(e);
            reject([]);
        }
        
        xhr.open("GET", "/api/programs");
        xhr.send();
    });
};

window.onload = () => {
    loadPrograms().then((programs) => {
        const pc = document.getElementById("programsContainer");

        // TODO: Consider if iframe is not better
        const xhr = new XMLHttpRequest();
        xhr.responseType = "text/html";

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
    });
}




