let isNanXocdia = true
function formatNumberToStr(number) {

    var text = "";
    var text2 = "";
    if (number >= 1000000000) {
        text2 = "tỉ";
        var num = (number % (1000000000 / 100000000));
        number = (number / 1000000000);
        number = Math.round(number * 1000) / 1000
        text = number;
        text += text2;
    }
    else if (number >= 1000000) {
        text2 = "tr";
        var num = (number % (1000000 / 100000));
        number = (number / 1000000);
        number = Math.round(number * 1000) / 1000
        text = number;
        text += text2;
    }
    else {
        text = numberWithCommas(Math.round(number));
    }
    return text;
}

$('#modalcuoc-xocdia').dblclick(function (e) {
    e.preventDefault();
})
let typecuocXocDia = ''
function cuoc_xocdia(tpyecuoc) {
    let htmlCuocXd = ''
    if (tpyecuoc == "le") {
        htmlCuocXd = 'Dự đoán <img src="/xocdia/le.png"> thắng x1.98 tiền cược'
    }
    else if (tpyecuoc == "chan") {
        htmlCuocXd = 'Dự đoán <img src="/xocdia/chan.png"> thắng x1.98 tiền cược'
    }
    else if (tpyecuoc == "chan4do") {
        htmlCuocXd = 'Dự đoán <img src="/xocdia/quanDo.png"><img src="/xocdia/quanDo.png"><img src="/xocdia/quanDo.png"><img src="/xocdia/quanDo.png"> thắng x15 tiền cược'
    }
    else if (tpyecuoc == "chan4den") {
        htmlCuocXd = 'Dự đoán <img src="/xocdia/quanDen.png"><img src="/xocdia/quanDen.png"><img src="/xocdia/quanDen.png"><img src="/xocdia/quanDen.png"> thắng x15 tiền cược'
    }
    else if (tpyecuoc == "le3den") {
        htmlCuocXd = 'Dự đoán <img src="/xocdia/quanDen.png"><img src="/xocdia/quanDen.png"><img src="/xocdia/quanDen.png"><img src="/xocdia/quanDo.png"> thắng x3 tiền cược'
    }
    else if (tpyecuoc == "le3do") {
        htmlCuocXd = 'Dự đoán <img src="/xocdia/quanDo.png"><img src="/xocdia/quanDo.png"><img src="/xocdia/quanDo.png"><img src="/xocdia/quanDen.png"> thắng x3 tiền cược'
    }
    typecuocXocDia = tpyecuoc
    $("#typecuocXocDia").html(htmlCuocXd)
    $("#modalcuoc-xocdia").modal()
}
function SelectGoldXocDia(type) {
    var inputcuocbc = $("#goldXocDia").val()
    var ssss = Number(inputcuocbc.replace(/[^0-9 ]/g, ""));
    if (type == 1) {
        ssss += 10000000
        $("#goldXocDia").val(numberWithCommas(ssss))
    }
    else if (type == 2) {
        ssss += 50000000
        $("#goldXocDia").val(numberWithCommas(ssss))
    }
    else if (type == 3) {
        ssss += 100000000
        $("#goldXocDia").val(numberWithCommas(ssss))
    }
    else if (type == 4) {
        ssss += 500000000
        $("#goldXocDia").val(numberWithCommas(ssss))
    }
    else if (type == 5) {
        ssss += 1000000000
        $("#goldXocDia").val(numberWithCommas(ssss))
    }
    else if (type == 6) {
        $("#goldXocDia").val("")
    }
    else if (type == 7) {
        $['ajax']({
            type: 'post',
            url: '/xocdia/putcuoc',
            data: { vangcuoc: inputcuocbc, type: typecuocXocDia },
            success: function (data) {
                if (data.error == 1) {
                    note_play('.note_here_xocdia', data.message, 'ff0000');
                }
                else {
                    note_play('.note_here_xocdia', data.message, '28a745');
                }
                $("#goldXocDia").val("")
                $("#modalcuoc-xocdia").modal("hide")
            }
        });
    }
}

function note_play_xocdia(ob, text, color) {
    var note_id = Math['floor']((Math['random']() * 99999999) + 1);
    $('' + ob)['html']('<p  class=\"note_play id' + note_id + '\">' + text + '</p>');
    $('.note_play.id' + note_id)['css']({
        'color': '#' + color
    })['slideDown']('slow');
    setTimeout(function () {
        $('.note_play.id' + note_id)['animate']({
            opacity: '0.0',
            height: 'toggle'
        }, 500)['promise']()['done'](function () {
            $(this)['remove']()
        })
    }, 1000);
    return false
}


socketzzz.on("cuoc-xd-user", (data) => {
    $("#xd-cuoc-chan").text((data.chan == 0 ? "" : "Đặt: " + formatNumberToStr(data.chan)))
    $("#xd-cuoc-le").text((data.le == 0 ? "" : "Đặt: " + formatNumberToStr(data.le)))
    $("#xd-cuoc-4do").text((data.chan4do == 0 ? "" : "Đặt: " + formatNumberToStr(data.chan4do)))
    $("#xd-cuoc-4den").text((data.chan4den == 0 ? "" : "Đặt: " + formatNumberToStr(data.chan4den)))
    $("#xd-cuoc-3den").text((data.le3den == 0 ? "" : "Đặt: " + formatNumberToStr(data.le3den)))
    $("#xd-cuoc-3do").text((data.le3do == 0 ? "" : "Đặt: " + formatNumberToStr(data.le3do)))
})

socketzzz.on("traothuong-xd", (data) => {
    if (data.status == "thua") {
        note_play('.note_here_xocdia', data.message, 'ff0000');
    }
    else {
        note_play('.note_here_xocdia', data.message, '28a745');

    }
})

socketzzz.on("running-xocdia", (data) => {
    $(".time-wait-xocdia").hide()

    setDefauftocuoc()
    $('.dia-bat')['css']({
        'display': 'block',
    })
    $('.bat-drop')['css']({
        'display': 'none',
    })
    $('#clock-xocdia')['css']({
        'display': 'block',
    })
    setTimeXocDia(data.time.toString())
    $("#xd-gold-chan").text(data.vangChan == 0 ? "" : formatNumberToStr(data.vangChan))
    $("#xd-gold-le").text(data.vangLe == 0 ? "" : formatNumberToStr(data.vangLe))
    $("#xd-gold-4do").text(data.vang4do == 0 ? "" : formatNumberToStr(data.vang4do))
    $("#xd-gold-4den").text(data.vang4den == 0 ? "" : formatNumberToStr(data.vang4den))
    $("#xd-gold-3den").text(data.vang3den == 0 ? "" : formatNumberToStr(data.vang3den))
    $("#xd-gold-3do").text(data.vang3do == 0 ? "" : formatNumberToStr(data.vang3do))
    $("#xd-player-chan").text(data.countPlayerChan)
    $("#xd-player-le").text(data.countPlayerLe)
    $("#xd-player-4do").text(data.countPlayer4do)
    $("#xd-player-4den").text(data.countPlayer4den)
    $("#xd-player-3den").text(data.countPlayer3den)
    $("#xd-player-3do").text(data.countPlayer3do)
})

socketzzz.on("ketqua-xd", (data) => {
    note_play_xocdia('.note_here_xocdia', "Đến giờ Mở bát", 'fd7e14');


    $('.bat-drop')['css']({
        'left': '11%',
        'top': '8%',
    })
    $("#xd-gold-chan").text(data.data.vangChan == 0 ? "" : formatNumberToStr(data.data.vangChan))
    $("#xd-gold-le").text(data.data.vangLe == 0 ? "" : formatNumberToStr(data.data.vangLe))
    $("#xd-gold-4do").text(data.data.vang4do == 0 ? "" : formatNumberToStr(data.data.vang4do))
    $("#xd-gold-4den").text(data.data.vang4den == 0 ? "" : formatNumberToStr(data.data.vang4den))
    $("#xd-gold-3den").text(data.data.vang3den == 0 ? "" : formatNumberToStr(data.data.vang3den))
    $("#xd-gold-3do").text(data.data.vang3do == 0 ? "" : formatNumberToStr(data.data.vang3do))
    $("#xd-player-chan").text(data.data.countPlayerChan)
    $("#xd-player-le").text(data.data.countPlayerLe)
    $("#xd-player-4do").text(data.data.countPlayer4do)
    $("#xd-player-4den").text(data.data.countPlayer4den)
    $("#xd-player-3den").text(data.data.countPlayer3den)
    $("#xd-player-3do").text(data.data.countPlayer3do)
    $(".hot_xd1").attr("data-txt", data.ketqua.x1);
    $(".hot_xd2").attr("data-txt", data.ketqua.x2);
    $(".hot_xd3").attr("data-txt", data.ketqua.x3);
    $(".hot_xd4").attr("data-txt", data.ketqua.x4);




})
setDefauftocuoc = () => {
    $(".chan-wrap-xd-v").removeClass("o-active-lon nhapnhay")
    $(".le-wrap-xd-v").removeClass("o-active-lon nhapnhay")
    $(".o-3-le-v").removeClass("o-active-be nhapnhay")
    $(".o-3-chan-v").removeClass("o-active-be nhapnhay")
    $(".o-4-chan-v").removeClass("o-active-be nhapnhay")
    $(".o-4-le-v").removeClass("o-active-be nhapnhay")
}


socketzzz.on("phienmoi-xd", (data) => {
    updateCaus()
    note_play_xocdia('.note_here_xocdia', "Phiên mới", 'fd7e14');

})

socketzzz.on("waitgame-xd", (data) => {
    $(".time-wait-xocdia").show()
    $(".time-wait-xocdia").text(data.data.timeWait)

    $(".hot_xd1").attr("data-txt", data.ketqua.x1);
    $(".hot_xd2").attr("data-txt", data.ketqua.x2);
    $(".hot_xd3").attr("data-txt", data.ketqua.x3);
    $(".hot_xd4").attr("data-txt", data.ketqua.x4);

    if (data.data.timeWait < 5 || !isNanXocdia) {
        $('.bat-drop')['css']({
            'display': 'none',
        })
        if (data.ketqua2 == "chan") {
            $(".chan-wrap-xd-v").addClass("o-active-lon nhapnhay")
        }
        else if (data.ketqua2 == "le3den") {
            $(".le-wrap-xd-v").addClass("o-active-lon nhapnhay")
            $(".o-3-le-v").addClass("o-active-be nhapnhay")
        }
        else if (data.ketqua2 == "le3do") {
            $(".le-wrap-xd-v").addClass("o-active-lon nhapnhay")
            $(".o-3-chan-v").addClass("o-active-be nhapnhay")
        }
        else if (data.ketqua2 == "chan4do") {
            $(".chan-wrap-xd-v").addClass("o-active-lon nhapnhay")
            $(".o-4-chan-v").addClass("o-active-be nhapnhay")
        }
        else if (data.ketqua2 == "chan4den") {
            $(".chan-wrap-xd-v").addClass("o-active-lon nhapnhay")
            $(".o-4-le-v").addClass("o-active-be nhapnhay")
        }
    }
    else {

        $('.bat-drop')['css']({
            'display': 'block',
        })

    }



    $('.dia-bat')['css']({
        'display': 'none',
    })
    $('#clock-xocdia')['css']({
        'display': 'none',
    })
    setTimeXocDia(data.data.time.toString())
    $("#xd-gold-chan").text(data.data.vangChan == 0 ? "" : formatNumberToStr(data.data.vangChan))
    $("#xd-gold-le").text(data.data.vangLe == 0 ? "" : formatNumberToStr(data.data.vangLe))
    $("#xd-gold-4do").text(data.data.vang4do == 0 ? "" : formatNumberToStr(data.data.vang4do))
    $("#xd-gold-4den").text(data.data.vang4den == 0 ? "" : formatNumberToStr(data.data.vang4den))
    $("#xd-gold-3den").text(data.data.vang3den == 0 ? "" : formatNumberToStr(data.data.vang3den))
    $("#xd-gold-3do").text(data.data.vang3do == 0 ? "" : formatNumberToStr(data.data.vang3do))
    $("#xd-player-chan").text(data.data.countPlayerChan)
    $("#xd-player-le").text(data.data.countPlayerLe)
    $("#xd-player-4do").text(data.data.countPlayer4do)
    $("#xd-player-4den").text(data.data.countPlayer4den)
    $("#xd-player-3den").text(data.data.countPlayer3den)
    $("#xd-player-3do").text(data.data.countPlayer3do)
})
getImageCuaDat = (tpyecuoc) => {
    let htmlCuocXd = ''
    if (tpyecuoc == "le") {
        htmlCuocXd = ' <img style="width: 8%;" src="/xocdia/le.png">'
    }
    else if (tpyecuoc == "chan") {
        htmlCuocXd = ' <img style="width: 21%;" src="/xocdia/chan.png">'
    }
    else if (tpyecuoc == "chan4do") {
        htmlCuocXd = ' <img style="width: 10%;" src="/xocdia/quanDo.png"><img style="width: 10%;" src="/xocdia/quanDo.png"><img style="width: 10%;" src="/xocdia/quanDo.png"><img style="width: 10%;" src="/xocdia/quanDo.png">'
    }
    else if (tpyecuoc == "chan4den") {
        htmlCuocXd = ' <img style="width: 10%;" src="/xocdia/quanDen.png"><img style="width: 10%;" src="/xocdia/quanDen.png"><img style="width: 10%;" src="/xocdia/quanDen.png"><img style="width: 10%;" src="/xocdia/quanDen.png"> '
    }
    else if (tpyecuoc == "le3den") {
        htmlCuocXd = ' <img style="width: 10%;" src="/xocdia/quanDen.png"><img style="width: 10%;" src="/xocdia/quanDen.png"><img style="width: 10%;" src="/xocdia/quanDen.png"><img style="width: 10%;" src="/xocdia/quanDo.png"> '
    }
    else if (tpyecuoc == "le3do") {
        htmlCuocXd = ' <img style="width: 10%;" src="/xocdia/quanDo.png"><img style="width: 10%;" src="/xocdia/quanDo.png"><img style="width: 10%;" src="/xocdia/quanDo.png"><img style="width: 10%;" src="/xocdia/quanDen.png"> '
    }
    else {
        htmlCuocXd = tpyecuoc
    }
    return htmlCuocXd
}
getImageDenDo = (type) => {
    if (type == "l") {
        return `<img id="den-soicau" src="/xocdia/den.png">`
    }
    else if (type == "c") {
        return `<img id="do-soicau" src="/xocdia/do.png">`
    }
    else {
        return `<img style="opacity:0;" id="do-soicau" src="/xocdia/do.png">`
    }
}
updateCaus = () => {
    $['ajax']({
        type: 'get',
        url: '/xocdia/caus',
        success: function (data) {
            var cau = "";
            for (let cauz of data) {
                cau += ` <div class="cau-xocdia">
                            <img alt="soi cai xoc dia 9sao.me" src="/xocdia/${(cauz == "l" ? "den" : "do")}.png">
                        </div>`
            }
            $(".view-cau-xocdia").html(cau)
        }
    })
}

$(document).ready(() => {
    updateCaus()
    $('#game-xocdia')['draggable']({
        start: function () {
            $('.actigame')['removeClass']('actigame');
            $(this)['addClass']('actigame')
        },
        cancel: '.group-button',
        handle: '.move-here'
    });
    $('.bat-drop')['draggable']({

    })

    $('#khung_xocdia .his-game')['on']('click ', function () {
        $['ajax']({
            type: 'get',
            url: '/xocdia/getHis',
            success: function (data) {
                var cuoccccc = "";
                data.map((cuoc) => {
                    cuoccccc += '<tr><td>' + cuoc.username + '</td><td>' + numberWithCommas(cuoc.vangdat) + '</td><td>' + getImageCuaDat(cuoc.cuadat) + '</td><td>' + getstatustx(cuoc.status, cuoc.vangthang) + '</td><td>' + new Date(cuoc.time).toLocaleTimeString() + '</td></tr>'
                })
                cuoccccc = '<tr class="bg bg-danger text-white"><th>Nhân vật</th><th>Vàng đặt</th> <th>Cửa đặt</th><th>Trạng thái</th><th>Thời gian</th></tr>' + cuoccccc
                document.getElementById("tablecuoc-xocdia").innerHTML = cuoccccc
                $("#cuocsModal-xocdia").modal()
            }
        })
    });

    $('#khung_xocdia .soi-cau')['on']('click ', function () {
        $['ajax']({
            type: 'get',
            url: '/xocdia/soicau',
            success: function (data) {
                var table = "";
                for (let line of data) {
                    table += "<tr style='background: rgb(0 0 0 / 0%);'>" + line.map(cau => `<th>${getImageDenDo(cau)} </th>`).join('') + "</tr>"
                }
                //console.log(table)
                document.getElementById("table-soicau-xocdia").innerHTML = table
                $("#soicauModal-xocdia").modal()
            }
        })
        updateCaus()

    });


    $('#khung_xocdia .help-game')['on']('click ', function () {
        $('#modalHelp-Xocdia').modal()
    });
    $('#khung_xocdia .top-game')['on']('click ', function () {
        alert("Chức năng này đang xây dựng")
    });
    $('#khung_xocdia .clogame')['on']('click ', function () {
        $('#game-xocdia')['hide']('fade', {}, 500)
    });

    $('#khung_xocdia .soi-cau')['on']('click ', function () {
        $("#soicauModal-xocdia").modal()
    });

    $('#khung_xocdia .nan')['on']('click ', function () {
        isNanXocdia = !isNanXocdia
        if (isNanXocdia) {
            $("#button-nan-xocdia").attr("src", "/xocdia/btn-nan.png");
        }
        else {
            $("#button-nan-xocdia").attr("src", "/xocdia/btn-nan-off.png");
        }
    });

    $("#goldXocDia").on("keyup", function (event) {
        var selection = window.getSelection().toString();
        if (selection !== '') {
            return;
        }
        if ($.inArray(event.keyCode, [38, 40, 37, 39]) !== -1) {
            return;
        }
        var $this = $(this);
        var input = $this.val();
        var input = input.replace(/[\D\s\._\-]+/g, "");
        input = input ? parseInt(input, 10) : 0;
        $this.val(function () {
            return (input === 0) ? "" : input.toLocaleString("en-US");
        });
    });
    const config_image_xodia = {
        characterSet: '0123456789',
        characterWidth: 103.2,
        characterHeight: 102,
        horizontalSpacing: 0,
        verticalSpacing: 0,
        columnCount: 10,
        rowCount: 1,
    };




    const canvas_time_xd = document.createElement('canvas');
    // canvas.width = 120;
    // canvas.height = 120
    canvas_time_xd.style.width = '60%';
    canvas_time_xd.style.left = '51%';
    canvas_time_xd.style.top = '47%';



    canvas_time_xd.className = ""





    $("#clock-xocdia").append(canvas_time_xd)


    let context_xd = canvas_time_xd.getContext('2d');

    context_xd.imageSmoothingEnabled = false;

    const image_time_xd = new Image();


    setTimeXocDia = (time) => {
        if (time == "-1") {
            time = "0"
        }
        context_xd.clearRect(0, 0, 500, 500);
        let scale = (canvas_time_xd.width / config_image_xodia.characterHeight) / 2
        let imageWidth = getWordWidth_xodia(time, scale, 0)
        let xCenterCanvas = (canvas_time_xd.width / 2) - imageWidth / 2
        let yCenterCanvas = (canvas_time_xd.height / 2) - (config_image_xodia.characterHeight * scale / 2)
        drawLine_xd(time, { x: xCenterCanvas, y: yCenterCanvas }, scale);
    }


    image_time_xd.src = '/xocdia/fontxanh.png';

    function drawCharacter_xodia(character, position = { x: 0, y: 0 }, scale = 1) {
        const characterIndex = config_image_xodia.characterSet.indexOf(character);

        if (characterIndex === -1) {
            throw new Error(`Font character "${character}" is not defined`);
        }
        const rowIndex = Math.floor(characterIndex / config_image_xodia.columnCount);
        const columnIndex = characterIndex % config_image_xodia.columnCount;

        const {
            characterWidth,
            characterHeight,
            horizontalSpacing,
            verticalSpacing,
        } = config_image_xodia;

        const sourceX = columnIndex * (characterWidth + horizontalSpacing);
        const sourceY = rowIndex * (characterHeight + verticalSpacing);
        const sourceWidth = characterWidth;
        const sourceHeight = characterHeight;

        const destinationX = position.x;
        const destinationY = position.y;
        const destinationWidth = characterWidth * scale;
        const destinationHeight = characterHeight * scale;



        context_xd.drawImage(
            image_time_xd,
            sourceX, sourceY, sourceWidth, sourceHeight,
            destinationX, destinationY, destinationWidth, destinationHeight
        );
    }

    function drawWord_xd(word, position = { x: 0, y: 0 }, scale = 1, optCharacterSpacing = 1) {
        const characters = Array.from(word);



        characters.forEach((character, characterIndex) => {
            let characterSpacing = optCharacterSpacing;
            if (characterIndex === 0) {
                characterSpacing = 0;
            }

            const characterTotalWidth = config_image_xodia.characterWidth * scale + characterSpacing;

            const characterX = position.x + characterIndex * characterTotalWidth;
            const characterY = position.y;

            const characterPosition = {
                x: characterX,
                y: characterY,
            };

            drawCharacter_xodia(character, characterPosition, scale);
        });
    }

    function getWordWidth_xodia(word, scale = 1, optCharacterSpacing = 1) {
        const allCharactersWidth = word.length * (config_image_xodia.characterWidth * scale);
        const allSpacingsWidth = (word.length - 1) * optCharacterSpacing;

        const wordWidth = allCharactersWidth + allSpacingsWidth;

        return wordWidth;
    }

    function drawLine_xd(
        line,
        position = { x: 0, y: 0 },
        scale = 1,
        optCharacterSpacing = 0,
    ) {
        const words = line.split(' ');
        let prevWordEndX = 0;
        words.forEach((word, wordIndex) => {
            const wordX = position.x + prevWordEndX;
            const wordY = position.y;
            const wordPosition = {
                x: wordX,
                y: wordY,
            };
            drawWord_xd(word, wordPosition, scale, optCharacterSpacing);
            const wordWidth = getWordWidth_xodia(word, scale, optCharacterSpacing);
            let wordSpacing = config_image_xodia.characterWidth * scale + optCharacterSpacing * 2;
            if (wordIndex === words.length - 1) {
                wordSpacing = 0;
            }
            const wordTotalWidth = wordWidth + wordSpacing;
            prevWordEndX += wordTotalWidth;
        });
    }
})