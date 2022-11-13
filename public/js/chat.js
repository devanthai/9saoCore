
socketzzz.on("CHAT", (data) => {
    checkCHAT(data);
})
socketzzz.on("USERONLINE", (data) => {
    $("#online").text(data)
})

var lastchat = ""
var lastname = ""
var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
checkCHAT = (data) => {
    const json = JSON.parse(data)
    if (json.type === "BOT") {
        const noidung = json.noidung;
        const name = json.name;

        var charchat = "";
        if (json.typechat == 1) {
            charchat = '<p  style="display: inline-block; background-color: #E4E6EB; padding: 5px 10px; border-radius: 10px; margin-bottom: 3px; margin-top: 3px" class="text-danger"><span class="fas fa-globe-americas"></span><span class="text-danger font-weight-bold"> ' + name + ' </span>' + noidung + '</p>'

        }
        else if (json.typechat == 2 && json.server == indexServer) {
            charchat = '<div><p data-id="4256165" style="display: inline-block; background-color: #E4E6EB; padding: 5px 10px; border-radius: 10px; margin-bottom: 3px; margin-top: 3px" class="text-dark"><span class="fas fa-user-cog"></span><span class="text-danger font-weight-bold"> Hệ thống</span>: <strong style="color: green">' + noidung + '</strong> </p></div>'
        }


        var newItem = $(charchat);
        $("#chatGlobal").append(charchat);
        newItem.show("fast");
        // $("#chatGlobal").animate({
        //     scrollTop:
        //         $("#chatGlobal").prop("scrollHeight")
        // }, 1000);
        gotoBottom('chatGlobal')
    }
    else
        if (json.type === "CHAT") {

            var noidung = json.noidung;
            const sodu = json.sodu;
            const name = json.name;
            const vip = json.vip;
            const clan = json.clan;
            const top = json.top;
            const type = json.typechat;
            const token = json.token;
            var avatar = json.avatar;

            if (lastchat == noidung) {
                return;
            }
            if (vip == 0 && top == 0) {
                if (lastname == name) {
                    return;
                }
            }
            lastchat = noidung
            lastname = name

            if (isHTML(noidung) || isHTML(sodu) || isHTML(name) || isHTML(vip) || isHTML(clan) || isHTML(top) || isHTML(type) || isHTML(token) || isHTML(avatar) || noidung.length > 80) {

                return
            }
            if (avatar == "none") {
                avatar = "aaaa.png"
            }
            if (json.server == indexServer || type == 1) {

                var icon = ""
                if (top != 0) {
                    icon += '<img src="images/bxh/' + top + '.gif" style="margin-left:5px; max-width: auto; height: 30px" ;="" padding:="" 0;="" margin-bottom:="" 10px"="" alt="">';
                }
                if (vip != 0 && vip != 7 && vip != 8) {
                    icon += '<img src="images/vip/vip' + vip + '.png" style="margin-left:5px; max-width: 40px; height: auto" ;="" padding:="" 0;"="" alt="">';
                }
                if (vip == 7) {
                    icon += '<img src="images/vip/vip' + 6 + '.png" style="margin-left:5px; max-width: 40px; height: auto" ;="" padding:="" 0;"="" alt="">';
                    icon += '<img src="images/vip/vip' + 6 + '.png" style="margin-left:5px; max-width: 40px; height: auto" ;="" padding:="" 0;"="" alt="">';
                }
                if (vip == 8) {
                    icon += '<img src="images/vip/vip' + 6 + '.png" style="margin-left:5px; max-width: 40px; height: auto" ;="" padding:="" 0;"="" alt="">';
                    icon += '<img src="images/vip/vip' + 6 + '.png" style="margin-left:5px; max-width: 40px; height: auto" ;="" padding:="" 0;"="" alt="">';
                    icon += '<img src="images/vip/vip' + 6 + '.png" style="margin-left:5px; max-width: 40px; height: auto" ;="" padding:="" 0;"="" alt="">';
                }
                if (clan != 0) {
                    icon += '<img src="images/clan/' + clan + '' + clan + '.png" style="margin-left:5px;  max-width: auto; height: 30px" ;="" padding:="" 0;="" margin-bottom:="" 10px"="" alt="">';
                }
                var charchat = "";
                if (type == 0) {
                    if (icon == "") {
                        charchat = '<div><p style="display: inline-block; background-color: #E4E6EB; padding: 5px 10px; border-radius: 10px; margin-bottom: 3px; margin-top: 3px" class="text-dark"><span class="fas fa-user"></span><span class="text-primary font-weight-bold"> ' + name + " - Số dư: " + sodu + '</span><br>' + noidung + '</p></div>';
                        charchat = `<div>
                        <div style="display: inline-block;background-color: #E4E6EB;padding: 5px 10px;border-radius: 10px;margin-bottom: 3px;margin-top: 3px;" class="text-dark"><img src="`+ "/images/avatar/" + avatar + `" alt="avatar" style="width: 50px;border-radius: 50%;margin-top: 2%;">
                        <div style="
                        float: right;
                        margin-left: 8px;
                    ">
                            <span class="text-primary font-weight-bold"> `+ name + " " + " - Số dư: " + sodu + `</span>
                            <div>`+ noidung + `</div>
                    
                        </div>
                        </div>
                    </div>`






                    }
                    else {
                        charchat = '<div><p style="display: inline-block; background-color: #E4E6EB; padding: 5px 10px; border-radius: 10px; margin-bottom: 3px; margin-top: 3px" class="text-dark"><span class="fas fa-user"></span><span class="text-primary font-weight-bold"> ' + name + " " + icon + '</span><br>' + noidung + '</p></div>';
                        charchat = `<div>
                        <div style="display: inline-block;background-color: #E4E6EB;padding: 5px 10px;border-radius: 10px;margin-bottom: 3px;margin-top: 3px;" class="text-dark"><img src="`+ "/images/avatar/" + avatar + `" alt="avatar" alt="avatar" style="width: 50px;border-radius: 50%;margin-top: 2%;">
                        <div style="
                        float: right;
                        margin-left: 8px;
                    ">
                            <span class="text-primary font-weight-bold"> `+ name + " " + icon + `</span>
                            <div>`+ noidung + `</div>
                    
                        </div>
                        </div>
                    </div>`

                    }
                }
                else if (type == 1) {
                    if (icon == "") {
                        charchat = '<div><p style="display: inline-block; background-color: #E4E6EB; padding: 5px 10px; border-radius: 10px; margin-bottom: 3px; margin-top: 3px" class="text-dark"><span class="fas fa-globe-americas"></span><span class="text-danger  font-weight-bold"> ' + name + " - Số dư: " + sodu + '</span><br>' + noidung + '</p></div>';
                    }
                    else {
                        charchat = '<div><p style="display: inline-block; background-color: #E4E6EB; padding: 5px 10px; border-radius: 10px; margin-bottom: 3px; margin-top: 3px" class="text-dark"><span class="fas fa-globe-americas"></span><span class="text-danger  font-weight-bold"> ' + name + " " + icon + '</span><br>' + noidung + '</p></div>';

                    }
                    if (icon == "") {
                        charchat = '<div><p style="display: inline-block; background-color: #E4E6EB; padding: 5px 10px; border-radius: 10px; margin-bottom: 3px; margin-top: 3px" class="text-dark"><span class="fas fa-user"></span><span class="text-danger font-weight-bold"> ' + name + " - Số dư: " + sodu + '</span><br>' + noidung + '</p></div>';
                        charchat = `<div>
                        <div style="display: inline-block;background-color: #E4E6EB;padding: 5px 10px;border-radius: 10px;margin-bottom: 3px;margin-top: 3px;" class="text-dark"><img src="`+ "/images/avatar/" + avatar + `" alt="avatar" alt="avatar" style="width: 50px;border-radius: 50%;margin-top: 2%;">
                        <div style="
                        float: right;
                        margin-left: 8px;
                    ">
                            <span class="text-danger font-weight-bold"> `+ name + " " + " - Số dư: " + sodu + `</span>
                            <div>`+ noidung + `</div>
                    
                        </div>
                        </div>
                    </div>`


                    }
                    else {
                        charchat = '<div><p style="display: inline-block; background-color: #E4E6EB; padding: 5px 10px; border-radius: 10px; margin-bottom: 3px; margin-top: 3px" class="text-dark"><span class="fas fa-user"></span><span class="text-danger font-weight-bold"> ' + name + " " + icon + '</span><br>' + noidung + '</p></div>';
                        charchat = `<div>
                        <div style="display: inline-block;background-color: #E4E6EB;padding: 5px 10px;border-radius: 10px;margin-bottom: 3px;margin-top: 3px;" class="text-dark"><img src="`+ "/images/avatar/" + avatar + `" alt="avatar" alt="avatar" style="width: 50px;border-radius: 50%;margin-top: 2%;">
                        <div style="
                        float: right;
                        margin-left: 8px;
                    ">
                            <span class="text-danger font-weight-bold"> `+ name + " " + icon + `</span>
                            <div>`+ noidung + `</div>
                    
                        </div>
                        </div>
                    </div>`
                    }
                }

                var newItem = $(charchat);
                $("#chatGlobal").append(charchat);
                newItem.show("fast");
                // $("#chatGlobal").animate({
                //     scrollTop:
                //         $("#chatGlobal").prop("scrollHeight")
                // }, 1000);
                gotoBottom('chatGlobal')
            }
        }
}
function gotoBottom(id) {
    var element = document.getElementById(id);
    element.scrollTop = element.scrollHeight - element.clientHeight;
}
var typeChat = 0;
$("#btnChatAll").click(function () {
    if (!confirm("Chat thế giới với tất cả các Server Box Chat khác\nTất cả mọi người đều nhìn thấy bạn chat\n(Lợi dụng quảng cáo các website sẽ bị khóa nick vĩnh viễn)")) {
        return;
    }
    $("#btnChatAll").css("opacity", "1");
    $("#btnChatBox").css("opacity", "0.5");
    typeChat = 1;
});

$("#btnChatBox").click(function () {
    $("#btnChatBox").css("opacity", "1");
    $("#btnChatAll").css("opacity", "0.5");
    typeChat = 0;
});





sendChat = () => {
    var noidung = $("#chatContent").val();
    if (noidung.length < 5 || noidung.length > 200) {
        thongbao2("Nội dung phải có 5 kí tự và nhỏ hơn 200 kí tự", "error");
        return;
    }
    $.ajax(
        {
            url: '/chat',
            type: 'POST',
            data: { noidung: noidung, server: indexServer, type: typeChat },
            success: function (d) {

                var json = d

                if (json.error == 1) {
                    thongbao2(json.message, "error");
                }
                else {
                    //  console.log(json)
                    const noidung = json.noidung;
                    const sodu = json.sodu;
                    const name = json.name;
                    const token = json.token;
                    const server = json.server;
                    const type = json.type;
                    const top = json.top;
                    const clan = json.clan;
                    const vip = json.vip;
                    var avatar = json.avatar;
                    if (avatar == "none") avatar = "aaaa.png"
                    $("#chatContent").val('');

                    var icon = ""
                    if (top != 0) {
                        icon += '<img src="images/bxh/' + top + '.gif" style="margin-left:5px; max-width: auto; height: 30px" ;="" padding:="" 0;="" margin-bottom:="" 10px"="" alt="9sao.me">';
                    }
                    if (vip != 0 && vip != 7 && vip != 8) {
                        icon += '<img src="images/vip/vip' + vip + '.png" style="margin-left:5px; max-width: 40px; height: auto" ;="" padding:="" 0;"="" alt="9sao.me">';
                    }
                    if (vip == 7) {
                        icon += '<img src="images/vip/vip' + 6 + '.png" style="margin-left:5px; max-width: 40px; height: auto" ;="" padding:="" 0;"="" alt="9sao.me">';
                        icon += '<img src="images/vip/vip' + 6 + '.png" style="margin-left:5px; max-width: 40px; height: auto" ;="" padding:="" 0;"="" alt="9sao.me">';
                    }
                    if (vip == 8) {
                        icon += '<img src="images/vip/vip' + 6 + '.png" style="margin-left:5px; max-width: 40px; height: auto" ;="" padding:="" 0;"="" alt="9sao.me">';
                        icon += '<img src="images/vip/vip' + 6 + '.png" style="margin-left:5px; max-width: 40px; height: auto" ;="" padding:="" 0;"="" alt="9sao.me">';
                        icon += '<img src="images/vip/vip' + 6 + '.png" style="margin-left:5px; max-width: 40px; height: auto" ;="" padding:="" 0;"="" alt="9sao.me">';
                    }
                    if (clan != 0) {
                        icon += '<img src="images/clan/' + clan + '' + clan + '.png" style="margin-left:5px;  max-width: auto; height: 30px" ;="" padding:="" 0;="" margin-bottom:="" 10px"="" alt="9sao.me">';
                    }

                    if (icon != "") {
                        icon += '<br>';
                    }
                    var mychat = '<div class="text-right"><p style="display: inline-block; padding: 5px 10px; border-radius: 10px; margin-bottom: 3px; margin-top: 3px" class="bg bg-primary text-white"> ' + icon + noidung + ' </p></div>';

                    mychat = `<div class="text-right"><div style="display: inline-block; padding: 5px 10px; border-radius: 10px; margin-bottom: 3px; margin-top: 3px" class="bg bg-primary text-white"> 
                    <div style="
                    margin-right: 5px;
                    float: left;
                ">
                   `+ icon + noidung + ` 
                    </div>
                    
                    <img src="/images/avatar/`+ avatar + `" alt="avatar" style="width: 50px;border-radius: 50%;margin-top: 2%;"></div></div>`

                    const datasend = JSON.stringify({ typechat: type, top: top, clan: clan, vip: vip, server: server, type: "CHAT", token: token, name: name, noidung: noidung, sodu: sodu, avatar: avatar })

                    socketzzz.emit("CHAT", datasend)


                    var newItem = $(json.mychat);


                    $("#chatGlobal").append(mychat);


                    newItem.show("slow");
                    $("#chatGlobal").animate({
                        scrollTop:
                            $("#chatGlobal").prop("scrollHeight")
                    }, 500);
                }
            }
        });
}

$("#chatButton").click(function () {
    sendChat()
})