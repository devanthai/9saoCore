let valueMoneyBet = 1
let isSieuTocSpin = false
let isAutoSpinHoaQua = false
let isSpin = false
let SelectMoneyBet = (index) => {
    const cuocnames = ["cuoc_1m", "cuoc_5m", "cuoc_50m", "cuoc_100m"]
    const imgOffs = ["1off", "5off", "50off", "100off"]
    const imgOns = ["1on", "5on", "50on", "100on"]
    $(`#${cuocnames[index - 1]}`).attr('src', `/wild/button/${imgOns[index - 1]}.png`);
    valueMoneyBet = index
    for (let i = 0; i < cuocnames.length; i++) {
        if (i != (index - 1)) {
            $(`#${cuocnames[i]}`).attr('src', `/wild/button/${imgOffs[i]}.png`);
        }
    }
    socketzzz.emit("hoaqua/changeMucBet", valueMoneyBet)
}
SelectMoneyBet(valueMoneyBet)
let SpinButton = () => {
    isAutoSpinHoaQua && ChangeButtonSpin()
    if (isAutoSpinHoaQua) {
        isAutoSpinHoaQua = false
        ChangeButtonSpin()
        $('#img-auto-hoaqua').attr('src', `/wild/button/${isAutoSpinHoaQua ? "auto-off" : "auto-on"}.png`);
        return
    }
    if (isSpin) return note_play('.move-here .note_here_hoaqua', "Đang quay", 'ff0000');
    $('#img-spin').attr('src', `/wild/button/spinBlock.png`);
    Spin();
}
let Spin = () => {

    socketzzz.emit("hoaqua/bet", { muc: valueMoneyBet })
}

socketzzz.on("hoaqua/bet", (data) => {
    if (!data.error) {
        isSpin = true
        for (let i = 1; i <= 3; i++) {
            $(`#qua_` + i).addClass("item-qua-quay active")
        }
        UnSpin(1, 3, data)
    }
    else {
        note_play('.move-here .note_here_hoaqua', data.message, 'ff0000');
    }
})

let ChangeButtonSpin = () => {
    $('#img-spin').attr('src', `/wild/button/${isSpin ? "spin" : "spinBlock"}.png`);
    $('#img-spin').attr('src', `/wild/button/${isAutoSpinHoaQua ? "stop" : "spin"}.png`);
}
let SieuTocButton = () => {
    isSieuTocSpin = !isSieuTocSpin
    $('#img-sieutoc-hoaqua').attr('src', `/wild/button/${isSieuTocSpin ? "sieu-toc-off" : "sieu-toc-on"}.png`);
}
let AutoSpinButton = () => {
    isAutoSpinHoaQua = !isAutoSpinHoaQua
    ChangeButtonSpin()
    $('#img-auto-hoaqua').attr('src', `/wild/button/${isAutoSpinHoaQua ? "auto-off" : "auto-on"}.png`);
    isAutoSpinHoaQua && !isSpin && Spin()
}
let UnXwild = (i, max, data) => {
    if (i <= max) {
        $(`#xxxxxxx`).addClass("xxxxxxxquay active")
        $(`#xxxxxxx`).removeClass("xxxxxxx")
        setTimeout(() => {
            $('#img-xxxxxxx').attr('src', `/wild/x/${data[i]}.png`);
            $(`#xxxxxxx`).removeClass("xxxxxxxquay active")
            $(`#xxxxxxx`).addClass("xxxxxxx")
            setTimeout(() => {
                i++
                UnXwild(i, max, data)
            }, 300)
        }, (isSieuTocSpin ? 250 : 500));
    }
    else {
        DoneSpin()
    }
}
let UnSpin = (i, max, data) => {
    if (i <= max) {
        setTimeout(() => {
            $('#img_qua_' + i).attr('src', `/wild/qua/${data.result[i - 1]}.png`);
            $(`#qua_` + i).removeClass("item-qua-quay active")
            i++
            UnSpin(i, max, data)
        }, isSieuTocSpin ? 250 : 500)
    }
    else if (i > max) {

        if (data.arrXwild.length > 0) {
            UnXwild(0, data.arrXwild.length - 1, data.arrXwild)
        }
        else {
            setTimeout(() => {
                DoneSpin()
            }, isSieuTocSpin ? 300 : 600)
        }
        if (data.win) {
            setTimeout(() => {
                $(".tienwin-hoaqua").text(convertNumber(data.win))
                note_play('.move-here .note_here_hoaqua', "+" + convertNumber(data.win), 'green');
            }, 500 * (data.arrXwild.length == 0 ? 1 : data.arrXwild.length))
        }
        $('#goldUser').val(convertNumber(Math.round(data.vangUser)))
        $('#hu-hoaqua').text(convertNumber(Math.round(data.vanghu)))

    }
}
let DoneSpin = () => {
    !isAutoSpinHoaQua && ChangeButtonSpin()
    isSpin = false
    isAutoSpinHoaQua && Spin()
}
socketzzz.emit("hoaqua/changeMucBet", valueMoneyBet)
socketzzz.on("hoaqua/changeMucBet", (data) => {
    if (data) {
        $("#hu-hoaqua").text(convertNumber(data.vanghu))
    }
})
socketzzz.on("message-hoaqua", (data) => {
    note_play('.', data.message, data.error == 1 ? 'ff0000' : 'green');
})



socketzzz.on("hoaqua/gethis", (data) => {
    console.log(data)
    var datatable = data.map(his => `<tr><td>${new Date(his.time).toLocaleString()}</td><td>${convertNumber(his.goldBet)}</td><td>${convertNumber(his.goldWin)}</td><td>${his.result.map(a => `<img width="25px" src="/wild/qua/${a}.png">`)}</td><td>${convertNumber(Math.round(his.beforeBet))}</td><td>${convertNumber(Math.round(his.afterBet))}</td></tr>`)
    $("#lshoaquatb").html(datatable)
    $("#lichsuHoaQua").modal()
})

socketzzz.on("hoaqua/getTop", (data) => {
    var datatable = data.map((his, index) => `<tr><td>${index + 1}</td><td>${his.username}</td><td>${convertNumber(his.vangwin)}</td></tr>`)
    $("#tbtopwinhoaqua").html(datatable)
    $("#topwinHoaQua").modal()
})

socketzzz.on("hoaqua/getNoHu", (data) => {
    var datatable = data.map(his => `<tr><td>${new Date(his.time).toLocaleString()}</td><td>${his.username}</td><td>${convertNumber(his.goldBet)}</td><td>${convertNumber(his.goldWin)}</td><td>${his.result.map(a => `<img width="25px" src="/wild/qua/${a}.png">`)}</td></tr>`)
    $("#tbnohuhoaqua").html(datatable)
    $("#topnohuhoaqua").modal()

})
$(document)['ready'](function () {
    $('#khung_hoaqua .his-game')['on']('click ', function () {
        socketzzz.emit("hoaqua/getHis", "aduvipvl")
    });

    $('#khung_hoaqua .help-game')['on']('click ', function () {
        $("#modalHuongDanHoaQua").modal()
    });

    $('#khung_hoaqua .clogame')['on']('click ', function () {
        $('#game-miniHoaqua')['hide']('fade', {}, 500)
    });


    $('#khung_hoaqua .top-game')['on']('click ', function () {
        socketzzz.emit("hoaqua/getNoHu", "aduvipvl")
    });
    $('#game-miniHoaqua')['draggable']({
        start: function () {
            $('.actigame')['removeClass']('actigame');
            $(this)['addClass']('actigame')
        },
        cancel: '.group-button',
        handle: '.move-here'
    });
})
