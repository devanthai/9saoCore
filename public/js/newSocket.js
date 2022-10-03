let socketNew = null
if (document.domain.includes("localhost")) {
    socketNew = io.connect("http://" + document.domain + ":9956");
}
else {
    socketNew = io.connect("https://" + document.domain);
}