var indexMoneyCuoc = 1
var isAutoSpin = false
var isSieuToc = false
var isSpinPoke = false
socketzzz.emit("poke/changeMucBet", indexMoneyCuoc)



$(document)['ready'](function () {
    $('#khung_minipoke .clogame')['on']('click ', function () {
        $('#game-minipoke')['hide']('fade', {}, 500)
    });

    $('#khung_minipoke .help-poke')['on']('click ', function () {
        $("#modalHelpPoke").modal()
    });


    $('#khung_minipoke .his-poke')['on']('click ', function () {
        socketzzz.emit("poke/getHis", "aduvipvl")
    });

    $('#khung_minipoke .top-nohu')['on']('click ', function () {
        socketzzz.emit("poke/getTop", "aduvipvl")
    });


    $('#khung_minipoke .tophu-poke')['on']('click ', function () {
        socketzzz.emit("poke/getNoHu", "aduvipvl")
    });

    $('#game-minipoke')['draggable']({
        start: function () {
            $('.actigame')['removeClass']('actigame');
            $(this)['addClass']('actigame')
        },
        cancel: '.group-button',
        handle: '.move-here'
    });
})

var indexImageQuay = 0
setInterval(() => {
    $('#btn-quay').attr('src', `/minipoke/${indexImageQuay % 2 == 0 ? "quay1" : "quay2"}.png`);
    indexImageQuay++
}, 500)
socketzzz.on("poke/gethis", (data) => {
    var datatable = data.map(his => `<tr><td>${new Date(his.time).toLocaleString()}</td><td>${convertNumber(his.goldBet)}</td><td>${convertNumber(his.goldWin)}</td><td>${his.result.map(a => `<img width="25px" src="/minipoke/${a.name}.png">`)}</td><td>${convertNumber(Math.round(his.beforeBet))}</td><td>${convertNumber(Math.round(his.afterBet))}</td></tr>`)
    $("#his-poke").html(datatable)
    $("#lichsuPoke").modal()
})

socketzzz.on("poke/getTop", (data) => {
    var datatable = data.map((his, index) => `<tr><td>${index + 1}</td><td>${his.username}</td><td>${convertNumber(his.vangwin)}</td></tr>`)
    $("#tbtopwinpoke").html(datatable)
    $("#topwinPoke").modal()
})

socketzzz.on("poke/getNoHu", (data) => {
    var datatable = data.map(his => `<tr><td>${new Date(his.time).toLocaleString()}</td><td>${his.username}</td><td>${convertNumber(his.goldBet)}</td><td>${convertNumber(his.goldWin)}</td><td>${his.result.map(a => `<img width="25px" src="/minipoke/${a.name}.png">`)}</td></tr>`)
    $("#tbnohupoke").html(datatable)
    $("#topnohupoke").modal()

})




socketzzz.on("message-poke", (data) => {
    note_play('.move-here .note_here_poke', data.message, data.error == 1 ? 'ff0000' : 'green');
})
socketzzz.on("poke/changeMucBet", (data) => {
    if (data) {
        $("#hu-poke-value").text(convertNumber(data.vanghu))
    }
})


AutoSpin = (doc) => {
    isAutoSpin = !isAutoSpin
    $(doc).attr("src", isAutoSpin ? '/minipoke/button/minipoke_18.png' : '/minipoke/button/minipoke_48.png')
}


SieuToc = (doc) => {
    isSieuToc = !isSieuToc
    $("#btn-spin-poke").attr("src", isSieuToc ? '/minipoke/button/minipoke_14.png' : '/minipoke/button/minipoke_38.png')
}

QuayPoke = (doc) => {
    if (isSpinPoke) {
        note_play('.move-here .note_here_poke', "Đang quay", 'ff0000');
        return
    }
    MiniPoke()
}

SelectMoney = (index) => {
    indexMoneyCuoc = index
    for (let i = 1; i <= 3; i++) {
        $(`#money-${i}-poke`).attr('src', '/minipoke/button/cuoc' + i + `${i == index ? "" : "defaulf"}.png`);
    }
    socketzzz.emit("poke/changeMucBet", index)
}

Un = (i, max, data) => {
    if (i <= max) {
        var timeOut = setTimeout(() => {
            $('#img_poke_' + i).attr('src', `/minipoke/${data.result[i - 1]}.png`);
            $(`#img_poke_` + i)['css']({
                'opacity': '1'
            });
            $(`#poke_` + i).removeClass("active")
            i++
            Un(i, max, data)
            clearTimeout(timeOut)
        }, isSieuToc ? 100 : 500)
    }
    else if (i > max) {
        if (data.win) {
            note_play('.move-here .note_here_poke', data.win, 'green');
        }
        if (data.isnohu) {
            document.getElementById("trunghu-poke").style.display = "block";
            numanimate_2($('#moneyTrunghupoke'), data.vangWin, 35);
            setTimeout(() => {
                document.getElementById("trunghu-poke").style.display = "none";
                note_play('.move-here .note_here_poke', "Trúng hủ +" + numberWithCommas(data.vangWin), '28a745');
            }, 10000)
        }
        isSpinPoke = false
        numanimate_2($('#hu-poke-value'), data.vanghu, 35);
        //$("#hu-poke-value").text(numberWithCommas(data.vanghu))
        if (data.win) {
            setTimeout(() => {
                DoneQuayPoke()
                $('#goldUser').val(numberWithCommas(Math.round(data.vangUser)))
            }, 1000)
        }
        else {
            setTimeout(() => {
                $('#goldUser').val(numberWithCommas(Math.round(data.vangUser)))
                DoneQuayPoke()
            }, isSieuToc ? 300 : 600)
        }
    }
}
DoneQuayPoke = () => {

    if (isAutoSpin) {
        MiniPoke()
    }
}
MiniPoke = () => {
    isSpinPoke = true
    socketzzz.emit("poke/bet", { muc: indexMoneyCuoc })
}
socketzzz.on("poke/bet", (data) => {
    if (data.error == 0) {
        for (let i = 1; i <= 5; i++) {
            $(`#img_poke_` + i)['css']({
                'opacity': '0'
            });
            $(`#poke_` + i).addClass("active")
        }
        Un(1, 5, data)
    }
    else if(data.error==3)
    {
        setTimeout(() => {
            DoneQuayPoke()
        },  1000)
        note_play('.move-here .note_here_poke', data.message, 'ff0000');

    }
    else {
        isSpinPoke = false
        note_play('.move-here .note_here_poke', data.message, 'ff0000');
    }
})