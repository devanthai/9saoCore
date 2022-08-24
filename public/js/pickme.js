socketzzz.on("pickme", (data) => {
    $("#timepickme").html(convertdate(data.time))
    $("#phantuongggg").html((data.vangthuong) + " Vàng")
    $("#countthangia").html((data.countPlayer))
    $("#timePickme").html("PickMe (" + convertdate(data.time) + ")")

    if (data.lastwiner) {
        var innnndex = 0;
        var htmllllll = ""
        data.lastwiner.forEach(element => {
            innnndex++
            htmllllll = htmllllll + "<b>" + innnndex + ": " + "<span style='color:#ff000094'>" + element.name + " (+" + numberWithCommas(Math.round(element.vang)) + ")" + "</span></b><br>"
        });
        $("#lastWinner").html(htmllllll)
    }
    $("#countMuster").text((data.countPlayerDiemdanh))
    if (!isRandomwin) {
       // console.log(data.lastwindiemdanh)
        var txxxdb = ""
        for (let i = 0; i < data.lastwindiemdanh.length; i++) {
            txxxdb += data.lastwindiemdanh[i].name + (i == data.lastwindiemdanh.length - 1 ? '' : ', ')
           // console.log(txxxdb)
        }
        $("#winnerMuster").text(txxxdb)
    }
    setTimeCurrent(data.TimeDiemDanh)
})

function convertdate(value) {
    return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : '00')
}

socketzzz.on("youarewinner", (data) => {
    for (let i = 0; i < 10; i++) {
        var rssss = ["error", "warning", "success", "info"]
        thongbao2("Bạn thắng PickMe +" + numberWithCommas(data), rssss[getRandomIntInclusive(0, rssss.length - 1)]);
    }
})

var isRandomwin = false
socketzzz.on("datawin", (data) => {
    isRandomwin = true

    indexWin = data.length
    if (indexWin > 10) {
        indexWin = 10
    }
    randomMusterShow(data)
})
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function changeimgPickMe() {
    var id = Math.random();
    $("#captchaPickMe").replaceWith('<img onclick="changeimgPickMe()" src="/user/imageGen?' + id + '" id="captchaPickMe" width="140" height="30" alt="captcha" class="img-thumbnail mb-1">');
}
function changeImageCaptchaDiemDanh() {
    var id = Math.random();
    $("#captchaDiemDanh").replaceWith('<img onclick="changeImageCaptchaDiemDanh()" src="/user/imageGen?' + id + '" id="captchaDiemDanh" width="140" height="30" alt="captcha" class="img-thumbnail mb-1">');
}
function thamgiapickme() {
    $['ajax']({
        type: 'post',
        url: '/minigame/thamgia',
        dataType: "json",
        data: {
            captcha:$("#textCaptchaPickme").val()
        },
        success: function (data) {
            if (data.error == 1) {
                thongbao2(data.message, "warning")
            }
            else {
                thongbao2(data.message, "success")
                changeimgPickMe()
            }

        }
    });
}

function thamgiadiemdanh() {
    $['ajax']({
        type: 'post',
        url: '/minigame/thamgiadiemdanh',
        dataType: "json",
        data: {
            captcha:$("#textCaptchaDiemDanh").val()
        },
        success: function (data) {
            if (data.error == 1) {
                thongbao2(data.message, "warning")
            }
            else {
                thongbao2(data.message, "success")
                changeImageCaptchaDiemDanh()
            }

        }
    });
}
var indexWin = 0
function randomMusterShow(data) {

    setTimeout(() => {
        indexWin--
        if (indexWin > -1) {


            $("#winnerMuster").text(data[indexWin].name);
            randomMusterShow(data)
        }
        else {
            isRandomwin = false
        }
    }, 200)

}
function setTimeCurrent(time) {
    if (time > 0) {
        var minutes = Math.floor((time / 60) % 60);
        var seconds = time % 60;
        if (seconds < 10) seconds = "0" + seconds;
        $("#timeMuster").text(minutes + ":" + seconds + "s");
    } else {
        $("#timeMuster").text("0s");
    }
}