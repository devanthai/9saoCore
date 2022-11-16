var inputchattttt = document.getElementById("chatContent");

// Execute a function when the user presses a key on the keyboard
inputchattttt.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    sendChat()
  }
});




function set_img(_0x90f8x4, _0x90f8x2a, _0x90f8x11) {
    _0x90f8x4 = (100 / Math['floor'](_0x90f8x2a)) * Math['floor'](_0x90f8x4);
    if (_0x90f8x11) {
        _0x90f8x4 = _0x90f8x4 + _0x90f8x11
    };
    return _0x90f8x4
}


function tron_k(_0x90f8x5) {
    _0x90f8x5 = Math['floor'](_0x90f8x5);
    return njs(Math['floor'](_0x90f8x5 / 1000))
}


function check_click2(_0x90f8x4) {
    if (_0x90f8x4['data']('click') != 'click') {
        _0x90f8x4['data']('click', 'click');
        setTimeout(function () {
            _0x90f8x4['removeData']('click')
        }, 100);
        return true
    };
    return false
}

function check_click(_0x90f8x4) {
    if (_0x90f8x4['data']('click') != 'click') {
        _0x90f8x4['data']('click', 'click');
        setTimeout(function () {
            _0x90f8x4['removeData']('click')
        }, 300);
        return true
    };
    return false
}

function numanimate(_0x90f8x4, _0x90f8x2a) {
    var _0x90f8x39 = Math['floor'](_0x90f8x4['val']());
    var _0x90f8x3a = (Math['floor'](_0x90f8x2a) - Math['floor'](_0x90f8x4['val']())) / 10;
    (function _0x90f8x2c(_0x90f8xa) {
        setTimeout(function () {
            _0x90f8x4['html'](njs(Math['floor'](_0x90f8x39 + (11 - _0x90f8xa) * _0x90f8x3a)));
            if (--_0x90f8xa) {
                _0x90f8x2c(_0x90f8xa)
            } else {
                _0x90f8x4['val'](_0x90f8x2a)
            }
        }, 30)
    })(10)
}

function numanimate_2(_0x90f8x4, _0x90f8x2a, _0x90f8x19) {
    var _0x90f8x3c = Math['floor'](_0x90f8x19);
    var _0x90f8x39 = Math['floor'](_0x90f8x4['val']());
    var _0x90f8x3a = (Math['floor'](_0x90f8x2a) - Math['floor'](_0x90f8x4['val']())) / _0x90f8x3c;
    (function _0x90f8x2c(_0x90f8xa) {
        setTimeout(function () {
            _0x90f8x4['html'](njs(Math['floor'](_0x90f8x39 + (_0x90f8x3c + 1 - _0x90f8xa) * _0x90f8x3a)));
            if (--_0x90f8xa) {
                _0x90f8x2c(_0x90f8xa)
            } else {
                _0x90f8x4['val'](_0x90f8x2a)
            }
        }, 40)
    })(_0x90f8x3c)
}

function mcccc(a) {
    if (+a <= 999) {
        return a;
    }

    if (+a >= 1000 && +a <= 999999) {
        return Math.floor(a / 1000) + 'K';
    }
    if (+a >= 1000000) {
        return Math.floor(a / 1000000) + 'M';
    }
}

function json(data) {
    return encode(JSON.stringify(data));
}

function convertNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function note_play(_0x90f8x25, _0x90f8x26, _0x90f8x11) {
    var _0x90f8x4 = Math['floor']((Math['random']() * 99999999) + 1);
    $('' + _0x90f8x25)['html']('<p  class=\"note_play id' + _0x90f8x4 + '\">' + _0x90f8x26 + '</p>');
    $('.note_play.id' + _0x90f8x4)['css']({
        'color': '#' + _0x90f8x11
    })['slideDown']('slow');
    setTimeout(function () {
        $('.note_play.id' + _0x90f8x4)['animate']({
            opacity: '0.0',
            height: 'toggle'
        }, 500)['promise']()['done'](function () {
            $(this)['remove']()
        })
    }, 1500);
    return false
}


var isLoadTaixiu = false
function openTaixiu() {
    var jstaixiu = document.getElementById("jstaixiu");
    if (jstaixiu != null) {
        $('#game-taixiu')['show']('fade', {}, 500);
        return;
    }
    var script = document.createElement('script');
    script.src = '/taixiu/tx.js?ver=1.22424333524s';
    script.type = 'text/javascript';
    script.id = "jstaixiu"
    document.getElementsByTagName('head')[0].appendChild(script);
    $('#game-taixiu')['show']('fade', {}, 500);
}


var isLoadPoker = false
function openPoker() {
    if (!isLoadPoker) {
        $.ajax({
            url: '/taixiu/getPoke',
            type: 'GET',
            success: function (d) {
                document.getElementById("Poker").innerHTML = d
                isLoadPoker = true
                openPoker()
            }
        })
    }
    else {
        var jstaixiu = document.getElementById("jspoker");
        if (jstaixiu != null) {
            $('#game-minipoke')['show']('fade', {}, 500);
            return;
        }
        var script = document.createElement('script');
        script.src = '/taixiu/minipoke.js?ver=1.6';
        script.type = 'text/javascript';
        script.id = "jspoker"
        document.getElementsByTagName('head')[0].appendChild(script);
        $('#game-minipoke')['show']('fade', {}, 500);
    }
}


var isLoadHoaqua = false
function openHoaQua() {
    if (!isLoadHoaqua) {
        $.ajax({
            url: '/taixiu/getLuckyWild',
            type: 'GET',
            success: function (d) {
                document.getElementById("HoaQua").innerHTML = d
                isLoadHoaqua = true
                openHoaQua()
            }
        })
    }
    else {
        var jstaixiu = document.getElementById("jshoaqua");
        if (jstaixiu != null) {
            $('#game-miniHoaqua')['show']('fade', {}, 500);
            return;
        }
        var script = document.createElement('script');
        script.src = '/taixiu/hoaqua.js?ver=1.6';
        script.type = 'text/javascript';
        script.id = "jshoaqua"
        document.getElementsByTagName('head')[0].appendChild(script);
        $('#game-miniHoaqua')['show']('fade', {}, 500);
    }
}


var isLoadxocdia = false
function openXocdia() {
    if (!isLoadxocdia) {
        $.ajax({
            url: '/xocdia/getgame',
            type: 'GET',
            success: function (d) {
                document.getElementById("XocDia").innerHTML = d
                isLoadxocdia = true
                openXocdia()
            }
        })
    }
    else {
        var jstaixiu = document.getElementById("jsxocdia");
        if (jstaixiu != null) {
            $('#game-xocdia')['show']('fade', {}, 500);
            return;
        }
        var script = document.createElement('script');
        script.src = '/taixiu/xocdia.js?ver=1.0';
        script.type = 'text/javascript';
        script.id = "jsxocdia"
        document.getElementsByTagName('head')[0].appendChild(script);
        $('#game-xocdia')['show']('fade', {}, 500);
    }
}


var isLoadChanLe = false
function openChanLe() {
    if (!isLoadChanLe) {
        $.ajax({
            url: '/chanle/getgame',
            type: 'GET',
            success: function (d) {
                document.getElementById("ChanLe").innerHTML = d
                isLoadChanLe = true
                openChanLe()
            }
        })
    }
    else {
        var jstaixiu = document.getElementById("jschanle");
        if (jstaixiu != null) {
            $('#game-chanle')['show']('fade', {}, 500);
            return;
        }
        var script = document.createElement('script');
        script.src = '/taixiu/chanle.js?ver=1.2';
        script.type = 'text/javascript';
        script.id = "jschanle"
        document.getElementsByTagName('head')[0].appendChild(script);
        $('#game-chanle')['show']('fade', {}, 500);
    }
}
var isLoadBauCua = false
function openBauCua() {
    if (!isLoadBauCua) {
        $.ajax({
            url: '/baucua/getgame',
            type: 'GET',
            success: function (d) {
                document.getElementById("BauCua").innerHTML = d
                isLoadBauCua = true
                openBauCua()
            }
        })
    }
    else {
        var jstaixiu = document.getElementById("jsbaucua");
        if (jstaixiu != null) {
            $('#game-baucua')['show']('fade', {}, 500);
            return;
        }
        var script = document.createElement('script');
        script.src = '/taixiu/bc.js';
        script.type = 'text/javascript';
        script.id = "jsbaucua"
        document.getElementsByTagName('head')[0].appendChild(script);
        $('#game-baucua')['show']('fade', {}, 500);
    }
}
function nhanvang() {

    $.ajax({
        url: '/user/nhanvip',
        type: 'POST',
        data: { alo: "cc", captcha: $("#textCaptchavip").val() },
        beforeSend: function () {
            $("#textCaptchavip").val("")
        },
        success: function (d) {
            document.getElementById('result_qua').innerHTML = d.message
            changeImageCaptchaDiemDanh()
            $("#textCaptchavip").val("")
            //   $('#modalNhanVang').modal("show")
        }
    })
}
var countMess = 0;
$('#modalThongBao').modal("show")
//vongquayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy



var disablezzz = false;
var image = document.getElementById("vongquay");
var btn = document.getElementById("btnStart");
btn.addEventListener("click", function () {
    if (disablezzz) {
        return;
    }
    disablezzz = true;
    $.ajax({
        url: "/user/vongquayfree",
        type: "post",
        data: { action: 'submit' },
        success: function (res) {
            var json = (res);
            if (res.status <= 0) {
                disablezzz = false;
                alert(res.message)
                return;
            }
            if (res.status > 0) {
                image.style.transform = res.transform;
                setTimeout(function () {
                    disablezzz = false;
                    alert(res.message)
                }, 7000);
            }
        }
    });
});

function getstatustx(status, money) {
    if (status == -1) return '<img id=\"loadding\" style=\"margin-left: 10px;\" src=\"images/loading2.gif\" alt=\"loading\" width=\"auto\" height=\"20px\">'
    else if (status == 1) { return '<div class="badge badge-success text-uppercase font-weight-bold" ;="" style="padding: 5px 5px"> +' + numberWithCommas(money) + '$' + ' </div>' }
    else if (status == 2) return '<div class="badge badge-danger text-uppercase font-weight-bold" ;="" style="padding: 5px 5px"> THUA </div>'
    else if (status == 5) return '<div class="badge badge-warning text-uppercase font-weight-bold text-white" ;="" style="padding: 5px 5px"> Đã hủy </div>'
    else return '<div class="badge badge-primary text-uppercase font-weight-bold" ;="" style="padding: 5px 5px"> null </div>'
}


