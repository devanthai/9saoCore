
socketzzz.on("usercuoc-chanle", (data) => {
    //console.log(data)
    $('.khung-chanle .cuoc-chan')['html'](njs(data.cuocTai));
    $('.khung-chanle .cuoc-le')['html'](njs(data.cuocXiu));
})


socketzzz.on("traothuong-chanle", (data) => {
    if (data.status == "thua") {
        note_play_chanle('.move-here .note_here_chanle', data.message, 'ff0000');
    }
    else {
        note_play_chanle('.move-here .note_here_chanle', data.message, '28a745');
    }
})
socketzzz.on("waitgame-chanle", (data) => {
    $(".vung_number_chanle").html('<span>' + data.time + "</span>")
    $(".clock-small-chanle").html(data.time)
    var ketqua = data.ketqua.x1 + data.ketqua.x2 + data.ketqua.x3
    var x1 = data.ketqua.x1
    var x2 = data.ketqua.x2
    var x3 = data.ketqua.x3
    $('#khung-chanle .effect_chanle')['css']('background-image', ' url(/images/taixiu/xx' + Math['floor'](x1) + '_1.png),url(/images/taixiu/xx' + Math['floor'](x2) + '_2.png),url(/images/taixiu/xx' + Math['floor'](x3) + '_3.png)');
    $('#game-chanle .kq-num-chanle div')['html'](ketqua);
    $('.effect_chanle')['css']({
        'opacity': '1'
    });
    $('.clock-big-chanle')['css']({
        'opacity': '0'
    });
    $('.clock-small-chanle')['css']({
        'opacity': '1'
    });

    if ($('#vung-chanle')['css']('display') == 'block' && data.time < 4) {
        thaluot_chanle(ketqua)
    }
    numanimate_2($('.khung-chanle .money-chan,.game-item-2 .money-chan .middle'), data.vangtai, 17);
    numanimate_2($('.khung-chanle .money-le,.game-item-2 .money-le .middle'), data.vangxiu, 17);
    $('.khung-chanle .user-chan')['html'](njs(data.usertai));
    $('.khung-chanle .user-le')['html'](njs(data.userxiu));

})

socketzzz.on("running-chanle", (data) => {
    vungchanle = false
    numanimate_2($('.khung-chanle .money-chan,.game-item-2 .money-chan .middle'), data.vangtai, 17);
    numanimate_2($('.khung-chanle .money-le,.game-item-2 .money-le .middle'), data.vangxiu, 17);
    $('.effect_chanle')['css']({
        'opacity': '0'
    });
    $('.nangame-chanle')['css']({
        'opacity': '1'
    });
    $('.clock-big-chanle')['css']({
        'opacity': '1'
    });
    $('#vung-chanle')['hide']();
    $('#game-chanle .kq-num-chanle')['css']({
        'opacity': '0'
    });
    $('.clock-small-chanle')['css']({
        'opacity': '0'
    });


    $(".clock-big-chanle").text(data.time)
    if (data.time < 6) {
        $('.clock-big-chanle')['css']('color', '#dc3545');
    }
    else {
        $('.clock-big-chanle')['css']('color', '#dada25');
    }

    $('.khung-chanle .user-chan')['html'](njs(data.usertai));
    $('.khung-chanle .user-le')['html'](njs(data.userxiu));

})

function show_roll_chanle(_0x9ca2x2) {
    var _0x9ca2x3 = _0x9ca2x2['offset']();
    var _0x9ca2x4 = $('#game-chanle .his-chanle')['offset']();
    $('#game-chanle .tooltip_chanle')['html'](_0x9ca2x2['attr']('data-title'))['css']({
        'margin-left': (_0x9ca2x3['left'] - _0x9ca2x4['left']) + 'px'
    })['show']()
}


var ketqualastchanle = -1;
var x1last_chanle_chanle = -1;
var x2last_chanle = -1;
var x3last_chanle = -1;
socketzzz.on("ketqua-chanle", (data) => {
    
    vungchanle = false
    $('.nangame-chanle')['css']({
        'opacity': '0'
    });
    $('.clock-big-chanle')['css']({
        'opacity': '0'
    });

    $('.khung-chanle .user-chan')['html'](njs(data.usertai));
    $('.khung-chanle .user-le')['html'](njs(data.userxiu));
    numanimate_2($('.khung-chanle .money-chan,.game-item-2 .money-chan .middle'), data.vangtai, 17);
    numanimate_2($('.khung-chanle .money-le,.game-item-2 .money-le .middle'), data.vangxiu, 17);

    ketqualastchanle = data.ketqua.x1 + data.ketqua.x2 + data.ketqua.x3
    x1last_chanle = data.ketqua.x1
    x2last_chanle = data.ketqua.x2
    x3last_chanle = data.ketqua.x3
    $(".kq-num-chanle").html('<div class="middle">' + ketqualastchanle + '</div>')
    if ($('#game-chanle2')['hasClass']('nanchanle') == false) {

        $('#vung-chanle')['show']()['css']({
            'left': '0px',
            'top': '0px'
        })
    }
    else {
        $('#game-chanle .kq-num-chanle')['css']({
            'opacity': '1'
        });
        $('.clock-small-chanle')['css']({
            'opacity': '1'
        });

        if (ketqualastchanle % 2 == 0) {
            $('.chan-wrap .icon-chanle')['addClass']('kq-chanle')['delay'](10000)['queue'](function () {
                $(this)['removeClass']('kq-chanle')['dequeue']()
            });
        }
        else {
            $('.le-wrap .icon-chanle')['addClass']('kq-chanle')['delay'](10000)['queue'](function () {
                $(this)['removeClass']('kq-chanle')['dequeue']()
            });
        }
        $('#game-chanle .his-chanle div')['first']()['remove']();
        if (ketqualastchanle % 2 != 0) {
            var zzzzz = '<div class=\"btn-le\" onmouseover=\"show_roll_chanle($(this))\" data-title=\"' + ' (' + x1last_chanle + '-' + x2last_chanle + '-' + x3last_chanle + ') ' + ketqualastchanle + '-Lẻ\"></div>'
        } else {

            var zzzzz = '<div class=\"btn-chan\" onmouseover=\"show_roll_chanle($(this))\" data-title=\"' + ' (' + x1last_chanle + '-' + x2last_chanle + '-' + x3last_chanle + ') ' + ketqualastchanle + '-Chẵn"></div>'

        };
        $('#game-chanle .his-chanle span')['before'](zzzzz);


    }
    set_roll_chanle(1, { xn1: x1last_chanle, xn2: x2last_chanle, xn3: x3last_chanle })
})

function thaluot_chanle(ketqualastchanle) {
    if (vungchanle) {
        return;
    }

    
    vungchanle = true
    if (ketqualastchanle % 2 == 0) {
        $('.chan-wrap .icon-chanle')['addClass']('kq-chanle')['delay'](10000)['queue'](function () {
            $(this)['removeClass']('kq-chanle')['dequeue']()
        });
    }
    else {
        $('.le-wrap .icon-chanle')['addClass']('kq-chanle')['delay'](10000)['queue'](function () {
            $(this)['removeClass']('kq-chanle')['dequeue']()
        });
    }


    $('#game-chanle .kq-num-chanle')['css']({
        'opacity': '1'
    });
    $('#vung-chanle')['hide']();
    $('#game-chanle .his-chanle div')['first']()['remove']();
    if (ketqualastchanle % 2 != 0) {
        var zzzzz = '<div class=\"btn-le\" onmouseover=\"show_roll_chanle($(this))\" data-title=\"' + ' (' + x1last_chanle + '-' + x2last_chanle + '-' + x3last_chanle + ') ' + ketqualastchanle + '-Lẻ\"></div>'
    } else {

        var zzzzz = '<div class=\"btn-chan\" onmouseover=\"show_roll_chanle($(this))\" data-title=\"' + ' (' + x1last_chanle + '-' + x2last_chanle + '-' + x3last_chanle + ') ' + ketqualastchanle + '-Chẵn"></div>'

    };
    $('#game-chanle .his-chanle span')['before'](zzzzz);
}
var vungchanle = false
$(document)['ready'](function () {
    $('#vung-chanle')['draggable']({

        drag: function () {

            var _0x9ca2x19 = $(this)['position']();
            if (_0x9ca2x19['left'] > Math['floor']($(this)['width']() * 0.91)) {
                thaluot_chanle(ketqualastchanle)
            };
            if (_0x9ca2x19['top'] > Math['floor']($(this)['height']() * 0.91)) {
                thaluot_chanle(ketqualastchanle)
            };
            if (_0x9ca2x19['left'] < Math['floor']('-' + $(this)['width']() * 0.91)) {
                thaluot_chanle(ketqualastchanle)
            };
            if (_0x9ca2x19['top'] < Math['floor']('-' + $(this)['height']() * 0.91)) {
                thaluot_chanle(ketqualastchanle)
            }
        }
    });
})




function note_play_chanle(_0x90f8x25, _0x90f8x26, _0x90f8x11) {
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


function check_click_chanle(_0x90f8x4) {
    if (_0x90f8x4['data']('click') != 'click') {
        _0x90f8x4['data']('click', 'click');
        setTimeout(function () {
            _0x90f8x4['removeData']('click')
        }, 300);
        return true
    };
    return false
}
$(document)['ready'](function () { });
//script hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee


function hide_roll_chanle(_0x9ca2x2) {
    $('#game-chanle .tooltip_chanle')['hide']()
}

function set_roll_chanle(_0x9ca2x2, _0x9ca2x6) {
    if (_0x9ca2x2 < 15) {
        m = 20
    } else {
        m = -15
    };
    setTimeout(function () {
        $('#khung-chanle .effect_chanle')['css']({
            '\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x70\x6F\x73\x69\x74\x69\x6F\x6E\x2D\x79': 0 + (34 - _0x9ca2x2) * 2.94105 + '%',
            '\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x69\x6D\x61\x67\x65': 'url(/images/taixiu/ef.png)',
            '\x6F\x70\x61\x63\x69\x74\x79': '1'
        });
        if (_0x9ca2x2 != 34) {
            set_roll_chanle(_0x9ca2x2 + 1, _0x9ca2x6)
        } else {
            $('#khung-chanle .effect_chanle')['css']('background-image', ' url(/images/taixiu/xx' + Math['floor'](_0x9ca2x6['xn1']) + '_1.png),url(/images/taixiu/xx' + Math['floor'](_0x9ca2x6['xn2']) + '_2.png),url(/images/taixiu/xx' + Math['floor'](_0x9ca2x6['xn3']) + '_3.png)');
            $('#game-chanle .kq-num-chanle div')['html'](_0x9ca2x6['xn4']);
            setTimeout(function () {
                $('#game-chanle .effect_chanle')['css']({
                    '\x6F\x70\x61\x63\x69\x74\x79': '0'
                });
                $('#game-chanle .kq-num-chanle')['css']({
                    '\x6F\x70\x61\x63\x69\x74\x79': '0'
                })
            }, 11000)
        }
    }, 30 + m)
}

function tattay_chanle() {
    var _0x9ca2x2 = Math['floor']($('#khung-chanle')['val']());
    if (_0x9ca2x2 == 0) {
        thong_bao('Th\xF4ng B\xE1o', 'Vui L\xF2ng Ch\u1ECDn T\xE0i Ho\u1EB7c X\u1EC9u')
    } else {
        if (_0x9ca2x2 == 1) {

            // $('#khung-chanle input.input-chan')['val'](Math['floor']($('.mymoney')['html']()['replace'](/\,/g, '')))

            $('#khung-chanle input.input-chan').val($("#goldUser").val())
        } else {
            if (_0x9ca2x2 == 2) {
                // $('#khung-chanle input.input-le')['val'](Math['floor']($('.mymoney')['html']()['replace'](/\,/g, '')))
                $('#khung-chanle input.input-le').val($("#goldUser").val())
            }
        }
    }
}

function btn_money_chanle(_0x9ca2xc) {
    var _0x9ca2x2 = Number($('#khung-chanle')['val']());
    if (_0x9ca2x2 == 0) {
        thong_bao('Th\xF4ng B\xE1o', 'Vui L\xF2ng Ch\u1ECDn T\xE0i Ho\u1EB7c X\u1EC9u')
    } else {
        if (_0x9ca2x2 == 1) {

            var moneytaiii = Number($('#khung-chanle input.input-chan').val().replace(/[\D\s\._\-]+/g, ""))

            var rsss = Number(_0x9ca2xc['find']('.middle')['attr']('data-txt')['replace'](/\K/g, '000')['replace'](/\M/g, '000000')) + moneytaiii


            $('#khung-chanle input.input-chan')['val'](convertNumber(rsss));
        } else {
            if (_0x9ca2x2 == 2) {

                var moneyxiuuu = Number($('#khung-chanle input.input-le').val().replace(/[\D\s\._\-]+/g, ""))


                $('#khung-chanle input.input-le')['val'](convertNumber(Number(_0x9ca2xc['find']('.middle')['attr']('data-txt')['replace'](/\K/g, '000')['replace'](/\M/g, '000000')) + moneyxiuuu))
            }
        }
    };
    return false
}

function btn_khac_chanle(_0x9ca2xc) {
    var _0x9ca2x2 = Math['floor']($('#khung-chanle')['val']());
    var _0x9ca2xc = _0x9ca2xc['find']('.middle')['attr']('data-txt');
    if (_0x9ca2x2 == 0) {
        thong_bao('Th\xF4ng B\xE1o', 'Vui L\xF2ng Ch\u1ECDn T\xE0i Ho\u1EB7c X\u1EC9u')
    } else {
        if (_0x9ca2x2 == 1) {
            if (_0x9ca2xc == 'X\xF3a') {
                $('#khung-chanle input.input-chan')['val'](Math['floor'](String($('#khung-chanle input.input-chan')['val']())['slice'](0, -1)))
            } else {
                $('#khung-chanle input.input-chan')['val'](Math['floor']($('#khung-chanle input.input-chan')['val']() + '' + _0x9ca2xc))
            }
        } else {
            if (_0x9ca2x2 == 2) {
                if (_0x9ca2xc == 'X\xF3a') {
                    $('#khung-chanle input.input-le')['val'](Math['floor'](String($('#khung-chanle input.input-le')['val']())['slice'](0, -1)))
                } else {
                    $('#khung-chanle input.input-le')['val'](Math['floor']($('#khung-chanle input.input-le')['val']() + '' + _0x9ca2xc))
                }
            }
        }
    };
    return false
}

function dat_chanle() {
    var _0x9ca2x2 = Math['floor']($('#khung-chanle')['val']());
    if (_0x9ca2x2 == 0) {
        thong_bao('Th\xF4ng B\xE1o', 'Vui L\xF2ng Ch\u1ECDn T\xE0i Ho\u1EB7c X\u1EC9u')
    } else {
        if (_0x9ca2x2 == 1) {
            var _0x9ca2xf = $('#khung-chanle input.input-chan')['val']();
            $('#khung-chanle input.input-chan')['val']('');
            var _0x9ca2x10 = 'chan'
        } else {
            if (_0x9ca2x2 == 2) {
                var _0x9ca2xf = $('#khung-chanle input.input-le')['val']();
                $('#khung-chanle input.input-le')['val']('');
                var _0x9ca2x10 = 'le'
            }
        };

        //  alert(_0x9ca2xf + "|" + _0x9ca2x10)

        $['ajax']({
            type: 'post',
            url: '/chanle/putcuoc',
            data: { vangcuoc: _0x9ca2xf, type: _0x9ca2x10 },
            success: function (data) {
                if (data.error == 1) {
                    note_play_chanle('.move-here .note_here_chanle', data.message, 'ff0000');
                }
                else {
                    note_play_chanle('.move-here .note_here_chanle', data.message, '28a745');

                }
            }
        });
    };
    return false
}

function cuoc_chanle(_0x9ca2x2) {
    if (_0x9ca2x2 == 1) {
        $('#khung-chanle input.input-chan')['focus']();
        $('#khung-chanle .group-button-chanle')['show']('fade', {}, 500);
        $('#khung-chanle')['val'](1);
        $('#khung-chanle input.input-chan')['val'](Math['floor']($('#khung-chanle input.input-chan')['val']()) + 0);
        $('#khung-chanle input.input-le')['val']('');
        $('#khung-chanle .input-cuoc-hide-chanle')['removeClass']('active');
        $('#khung-chanle .input-chan.input-cuoc-hide-chanle')['addClass']('active')
    } else {
        if (_0x9ca2x2 == 2) {
            $('#khung-chanle input.input-le')['focus']()['select']();
            $('#khung-chanle .group-button-chanle')['show']('fade', {}, 500);
            $('#khung-chanle')['val'](2);
            $('#khung-chanle input.input-le')['val'](Math['floor']($('#khung-chanle input.input-le')['val']()) + 0);
            $('#khung-chanle input.input-chan')['val']('');
            $('#khung-chanle .input-cuoc-hide-chanle')['removeClass']('active');
            $('#khung-chanle .input-le.input-cuoc-hide-chanle')['addClass']('active')
        } else {
            if (_0x9ca2x2 == 3) {
                $('#khung-chanle .group-button-chanle')['hide']('fade', {}, 500);
                $('#khung-chanle .input-cuoc-hide-chanle')['removeClass']('active');
                $('#khung-chanle input.input-le')['val']('');
                $('#khung-chanle input.input-chan')['val']('')
            }
        }
    };
    return false
}

function nan_chanle(_0x9ca2x2) {
    if (_0x9ca2x2['val']() == 1) {
        _0x9ca2x2['attr']('src', '/images/taixiu/btn_nan_2.png')['val'](0);
        $('#game-chanle2')['removeClass']('nanchanle')
    } else {
        _0x9ca2x2['attr']('src', '/images/taixiu/btn_nan_0.png')['val'](1);
        $('#game-chanle2')['addClass']('nanchanle')
    };
    return false
}



function getstatuschanle(status, money) {
    if (status == -1) return '<img id=\"loadding\" style=\"margin-left: 10px;\" src=\"images/loading2.gif\" alt=\"loading\" width=\"auto\" height=\"20px\">'
    else if (status == 1) { return '<div class="badge badge-success text-uppercase font-weight-bold" ;="" style="padding: 5px 5px"> +' + numberWithCommas(money) + '$' + ' </div>' }
    else if (status == 2) return '<div class="badge badge-danger text-uppercase font-weight-bold" ;="" style="padding: 5px 5px"> THUA </div>'
    else if (status == 5) return '<div class="badge badge-warning text-uppercase font-weight-bold text-white" ;="" style="padding: 5px 5px"> Đã hủy </div>'
    else return '<div class="badge badge-primary text-uppercase font-weight-bold" ;="" style="padding: 5px 5px"> null </div>'
}
$(document)['ready'](function () {
    $('#game-chanle')['draggable']({
        start: function () {
            $('.actigame')['removeClass']('actigame');
            $(this)['addClass']('actigame')
        },
        cancel: '.group-button-chanle',
        handle: '.move-here'
    });


    $('#khung-chanle .chan-wrap .input-chan')['on']('click', function () {
        if (check_click_chanle($(this)) == true) {
            cuoc_chanle(1)
        }
    });
    $('#khung-chanle .le-wrap .input-le')['on']('click', function () {
        if (check_click_chanle($(this)) == true) {
            cuoc_chanle(2)
        }
    });
    $('#khung-chanle .clogame')['on']('click ', function () {
        if (check_click_chanle($(this)) == true) {
            $('#game-chanle')['hide']('fade', {}, 500)
        }
    });
    $('#khung-chanle .wingame')['on']('click ', function () {
        if (check_click_chanle($(this)) == true) {
            showwinner('tai-xiu')
        }
    });
    $('#khung-chanle .hisgame-chanle')['on']('click ', function () {

        //lichsucuoc






        getCuocsChanle()



        $("#cuocsModal-chanle").modal()


    });




    $('#khung-chanle .guigame')['on']('click ', function () {

        //huongdan

        $("#modalHuongDanchanle").modal();

    });
    $('#khung-chanle .allgame')['on']('click ', function () {
        $("#thongkeTx").modal()
    });
    $('#khung-chanle .nangame_chanle')['on']('click', function () {
        if (check_click_chanle($(this)) == true) {
            nan_chanle($(this))
        }
    });

    $('#khung-chanle .group-button-chanle .button.blue')['on']('click  ', function () {
        if (check_click_chanle($(this)) == true) {
            cuoc_chanle(3)
        }
    });
    $('#khung-chanle .group-button-chanle .button.money2')['on']('click ', function () {
        if (check_click_chanle($(this)) == true) {
            btn_khac_chanle($(this))
        }
    });
    $('#khung-chanle .group-button-chanle .button.money')['on']('click ', function () {
        if (check_click_chanle($(this)) == true) {
            btn_money_chanle($(this))
        }
    });
    $('#khung-chanle .group-button-chanle .button.tattay')['on']('click  ', function () {
        if (check_click_chanle($(this)) == true) {
            tattay_chanle()
        }
    });
    $('#khung-chanle .group-button-chanle .button.green')['on']('click ', function () {
        console.log("cc")
        if (check_click_chanle($(this)) == true) {
            dat_chanle()
        }
    });
    $('#khung-chanle .group-button-chanle .button.red')['on']('click  ', function () {
        if (check_click_chanle($(this)) == true) {
            cuoc_chanle(3)
        }
    })
})
function getCuocsChanle() {
    $['ajax']({
        type: 'get',
        url: '/chanle/getcuoc',

        success: function (data) {
            //console.log(data)
            var cuoccccc = "";
            data.map((cuoc) => {
                cuoccccc += '<tr><td>' + cuoc.nhanvat + '</td><td>' + numberWithCommas(cuoc.vangdat) + '</td><td>' + (cuoc.type == "le" ? "Lẻ" : "Chẵn") + '</td><td>' + getstatuschanle(cuoc.status, cuoc.vangnhan) + '</td><td>' + new Date(cuoc.time).toLocaleTimeString() + '</td></tr>'
            })
            cuoccccc = '<tr class="bg bg-danger text-white"><th>Nhân vật</th><th>Vàng đặt</th> <th>Cửa đặt</th><th>Trạng thái</th><th>Thời gian</th></tr>' + cuoccccc

            document.getElementById("tablecuoc-chanle").innerHTML = cuoccccc
        }
    })
}

setInterval(() => { getCuocsChanle() }, 5000)


function gethisChanle() {
    $['ajax']({
        type: 'get',
        url: '/chanle/gethis',
        success: function (data) {
            var zzzzzzzzzzzzz = ""
            data.map((his) => {
                if (his.ketqua%2!=0) {
                    zzzzzzzzzzzzz = '<div class=\"btn-le\" onmouseover=\"show_roll_chanle($(this))\" data-title=\"' + ' (' + his.x1 + '-' + his.x2 + '-' + his.x3 + ') ' + his.ketqua + '-Lẻ\"></div>' + zzzzzzzzzzzzz
                } else {
                    zzzzzzzzzzzzz = '<div class=\"btn-chan\" onmouseover=\"show_roll_chanle($(this))\" data-title=\"' + ' (' + his.x1 + '-' + his.x2 + '-' + his.x3 + ') ' + his.ketqua + '-Chẵn"></div>' + zzzzzzzzzzzzz
                };
            })
            $('#game-chanle .his-chanle span')['before'](zzzzzzzzzzzzz);
        }
    });
}
gethisChanle()


$("#goldchanz").on("keyup", function (event) {
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
$("#goldlez").on("keyup", function (event) {
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

