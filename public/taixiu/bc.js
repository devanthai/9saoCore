$(document)['ready'](function () {

    $('#game-baucua')['draggable']({
        start: function () {
            $('.actigame')['removeClass']('actigame');
            $(this)['addClass']('actigame')
        },
        cancel: '.group-button',
        handle: '.move-here'
    });
    $('.chebc')['draggable']({
        drag: function () {

            var zzzz = $(this)['position']();
            if (zzzz['left'] > Math['floor']($(this)['width']() * 0.91)) {

            };
            if (zzzz['top'] > Math['floor']($(this)['height']() * 0.91)) {

            };
            if (zzzz['left'] < Math['floor']('-' + $(this)['width']() * 0.91)) {

            };
            if (zzzz['top'] < Math['floor']('-' + $(this)['height']() * 0.91)) {

            }
        }
    });
    $("#goldbaucua").on("keyup", function (event) {
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
})
var isShowRs;
var typecuoc;
var lastkq = null;


function getGamebc() {
    $['ajax']({
        type: 'get',
        url: '/baucua/gethis',
        success: function (data) {

            var cuoccccc = "";
            data.map((cuoc) => {
                cuoccccc += '<tr>' + '<td>' + getBaucua2(cuoc.x1) + getBaucua2(cuoc.x2) + getBaucua2(cuoc.x3) + '</td>' + '</tr>'
            })


            document.getElementById("tablegamebaucua").innerHTML = cuoccccc
        }
    })
}
function getCuocbc() {
    $['ajax']({
        type: 'get',
        url: '/baucua/getcuoc',

        success: function (data) {
            //console.log(data)
            var cuoccccc = "";
            data.map((cuoc) => {
                if (cuoc.__v == 9999) {
                    cuoccccc += '<tr style="color:red;background-color:#ffff0085"><td>' + cuoc.nhanvat + '</td><td>' + numberWithCommas(cuoc.vangdat) + '</td><td>' + getBaucua(cuoc.type) + '</td><td>' + getstatustx(cuoc.status, cuoc.vangnhan) + '</td><td>' + new Date(cuoc.time).toLocaleTimeString() + '</td></tr>'

                }
                else {
                    cuoccccc += '<tr ><td>' + cuoc.nhanvat + '</td><td>' + numberWithCommas(cuoc.vangdat) + '</td><td>' + getBaucua(cuoc.type) + '</td><td>' + getstatustx(cuoc.status, cuoc.vangnhan) + '</td><td>' + new Date(cuoc.time).toLocaleTimeString() + '</td></tr>'

                }
            })
            cuoccccc = '<tr style="white-space:nowrap;" class="bg bg-danger text-white"><th>Nhân vật</th><th>Vàng đặt</th> <th>Cửa đặt</th><th>Trạng thái</th><th>Thời gian</th></tr>' + cuoccccc

            document.getElementById("tablecuocbaucua").innerHTML = cuoccccc
        }
    })
}
function getBaucua2(id) {


    var img = ""
    if (id == 1) img = "/baucua/1e3d2681-24d3-434f-8150-3bc79b8501fb.png"
    else if (id == 2) img = "/baucua/7f3bf190-4896-4418-b240-a6a134c09051.png"
    else if (id == 3) img = "/baucua/528e2080-fd95-4de1-96ba-d4d27a00e593.png"
    else if (id == 4) img = "/baucua/0dd97687-0a92-496d-83d6-9cf44c755563.png"
    else if (id == 5) img = "/baucua/3927e9e9-cb6f-48bd-affe-c74a1c69df0b.png"
    else if (id == 6) img = "/baucua/7dd649a2-9139-4043-bb30-e42981b5769e.png"
    else return id
    return '<img style="height: 30px;" src="' + img + '" alt="">'

}
function getBaucua(id) {


    var img = ""
    if (id == 1) img = "/baucua/1e3d2681-24d3-434f-8150-3bc79b8501fb.png"
    else if (id == 2) img = "/baucua/7f3bf190-4896-4418-b240-a6a134c09051.png"
    else if (id == 3) img = "/baucua/528e2080-fd95-4de1-96ba-d4d27a00e593.png"
    else if (id == 4) img = "/baucua/0dd97687-0a92-496d-83d6-9cf44c755563.png"
    else if (id == 5) img = "/baucua/3927e9e9-cb6f-48bd-affe-c74a1c69df0b.png"
    else if (id == 6) img = "/baucua/7dd649a2-9139-4043-bb30-e42981b5769e.png"
    else return id
    return '<img style="height: 20px;" src="' + img + '" alt="">'

}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function SelectGold(type) {
    var inputcuocbc = $("#goldbaucua").val()
    var ssss = Number(inputcuocbc.replace(/[^0-9 ]/g, ""));
    if (type == 1) {
        ssss += 1000000
        $("#goldbaucua").val(numberWithCommas(ssss))
    }
    else if (type == 2) {
        ssss += 10000000
        $("#goldbaucua").val(numberWithCommas(ssss))
    }
    else if (type == 3) {
        ssss += 50000000
        $("#goldbaucua").val(numberWithCommas(ssss))
    }
    else if (type == 4) {
        ssss += 100000000
        $("#goldbaucua").val(numberWithCommas(ssss))
    }
    else if (type == 5) {
        ssss += 500000000
        $("#goldbaucua").val(numberWithCommas(ssss))
    }
    else if (type == 6) {
        $("#goldbaucua").val("")
    }
    else if (type == 7) {
        $['ajax']({
            type: 'post',
            url: '/baucua/putcuoc',
            data: { vangcuoc: inputcuocbc, type: typecuoc },
            success: function (data) {
                if (data.error == 1) {
                    note_play('.note_tb .note_here', data.message, 'ff0000');
                }
                else {
                    
                    note_play('.note_tb .note_here', data.message, '28a745');

                }
                $("#goldbaucua").val("")
                $("#modalcuocbc").modal("hide")
            }
        });
    }
}
function DATCUOC(id) {
    typecuoc = id
    var img = ""
    if (id == 1) img = "/baucua/1e3d2681-24d3-434f-8150-3bc79b8501fb.png"
    else if (id == 2) img = "/baucua/7f3bf190-4896-4418-b240-a6a134c09051.png"
    else if (id == 3) img = "/baucua/528e2080-fd95-4de1-96ba-d4d27a00e593.png"
    else if (id == 4) img = "/baucua/0dd97687-0a92-496d-83d6-9cf44c755563.png"
    else if (id == 5) img = "/baucua/3927e9e9-cb6f-48bd-affe-c74a1c69df0b.png"
    else if (id == 6) img = "/baucua/7dd649a2-9139-4043-bb30-e42981b5769e.png"
    $("#typecuoc").html('<b>Đặt cược con </b><img src="' + img + '" alt=""> <img src="' + img + '" alt=""><img src="' + img + '" alt="">')
    $("#modalcuocbc").modal()
}
//baucuaxucxac(1)
function baucuaxucxac(counter, ketqua) {
    if (counter < 15) {
        m = 20
    } else {
        m = -15
    };
    setTimeout(function () {
        $('.khungbaucua .effectbc')['css']({
            'background-position-y': 0 + (34 - counter) * 3.0303030303 + '%'
        });
        if (counter != 34) {
            baucuaxucxac(counter + 1, ketqua)
        }
        else {
            $('.khungbaucua .dice')['css']('background-image', ' url(/baucua/bc_' + ketqua.x1 + '_1.png),url(/baucua/bc_' + ketqua.x2 + '_2.png),url(/baucua/bc_' + ketqua.x3 + '_3.png)');


            $('.khungbaucua .dice')['css']({
                'opacity': '1'
            });
            $('.chebc')['css']({
                'display': 'block'
            });
            isShowRs = false
        }
    }, 35 + m)
}
var isRunningbc = true
setInterval(() => {
    if ($("#game-baucua").is(":hidden")) {
        isRunningbc = false
    }
    else
    {
        isRunningbc = true
    }
}, 5000)

socketzzz.on("runningbc", (data) => {
    if (!isRunningbc) return;
    isShowRs = false
    if (data.time < 6) {
        $('.clock-big1')['css']('color', '#dc3545');
    }
    else {
        $('.clock-big1')['css']('color', '#dada25');
    }

    $('.diabc')['css']({
        'opacity': '0'
    });
    $('.khungbaucua .dice')['css']({

        'opacity': '0'
    });
    $('.chebc')['css']({
        'display': 'none',
        'left': '0px',
        'top': '0px'
    });
    console.log(data)
    $("#moneyhuu").text(data.vangx1)
    $("#moneybau").text(data.vangx2)
    $("#moneyga").text(data.vangx3)
    $("#moneyca").text(data.vangx4)
    $("#moneycua").text(data.vangx5)
    $("#moneytom").text(data.vangx6)
    $(".clock-big1").text(data.time)
})
socketzzz.on("ketquabc", (data) => {
    if (!isRunningbc) return;
    lastkq = data.ketqua
    isShowRs = true;
    $('.khungbaucua .effectbc')['css']({
        'opacity': '1'
    });
    $('.diabc')['css']({
        'opacity': '1'
    });
    baucuaxucxac(1, data.ketqua)
})
socketzzz.on("traothuongbc", (data) => {
    if (!isRunningbc) return;
    if (data.status == "thua") {
        note_play('.note_tb .note_here', data.message, 'ff0000');
    }
    else {
        note_play('.note_tb .note_here', data.message, '28a745');
    }
})

socketzzz.on("waitgamebc", (data) => {
    if (!isRunningbc) return;
    lastkq = data.ketqua

    $(".vung_numberbc").html("<span>" + data.time + "</span>")
    if (!isShowRs) {
        $('.diabc')['css']({
            'opacity': '1'
        });
        $('.khungbaucua .effectbc')['css']({
            'opacity': '1'
        });

        $('.khungbaucua .dice')['css']('background-image', ' url(/baucua/bc_' + data.ketqua.x1 + '_1.png),url(/baucua/bc_' + data.ketqua.x2 + '_2.png),url(/baucua/bc_' + data.ketqua.x3 + '_3.png)');
        $('.khungbaucua .dice')['css']({
            'opacity': '1'
        });

    }
})