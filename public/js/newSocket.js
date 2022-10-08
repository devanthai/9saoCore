let socketNew = null
if (document.domain.includes("localhost")) {
    socketNew = io.connect("http://" + document.domain + ":9956");
}
else {
    socketNew = io.connect("https://socket.9sao.me", { query: `username=${usernameUser}&tenhienthi=${tenhienThiUser}&path=${location.href}` });
}
socketNew.on("messageFromServer", (data) => {
    alert(data)
})