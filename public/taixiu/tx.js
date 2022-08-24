
socketzzz.on("usercuoc", (data) => {
    //console.log(data)
    $('.khung-tx .cuoc-tai')['html'](njs(data.cuocTai));
    $('.khung-tx .cuoc-xiu')['html'](njs(data.cuocXiu));

})

socketzzz.on("trunghu", (data) => {
    console.log("Trúng hủ", data)
    document.getElementById("trunghu-tx").style.display = "block";
    numanimate_2($('#moneyTrunghu'), data.vangWinHu, 35);
    setTimeout(() => {
        document.getElementById("trunghu-tx").style.display = "none";
        note_play('.move-here .note_here', "Trúng hủ +" + numberWithCommas(data.vangWinHu), '28a745');
    }, 10000)
})

socketzzz.on("traothuong", (data) => {
    if (data.status == "thua") {
        note_play('.move-here .note_here', data.message, 'ff0000');
    }
    else {
        note_play('.move-here .note_here', data.message, '28a745');

    }
})
socketzzz.on("waitgame", (data) => {

    $(".vung_number").html('<span>' + data.time + "</span>")
    $(".clock-small").html(data.time)

    var ketqua = data.ketqua.x1 + data.ketqua.x2 + data.ketqua.x3
    var x1 = data.ketqua.x1
    var x2 = data.ketqua.x2
    var x3 = data.ketqua.x3
    $('#khung-tx .effect')['css']('background-image', ' url(/images/taixiu/xx' + Math['floor'](x1) + '_1.png),url(/images/taixiu/xx' + Math['floor'](x2) + '_2.png),url(/images/taixiu/xx' + Math['floor'](x3) + '_3.png)');
    $('#game-taixiu .kq-num div')['html'](ketqua);
    $('.effect')['css']({
        'opacity': '1'
    });
    $('.clock-big')['css']({
        'opacity': '0'
    });

    $('.clock-small')['css']({
        'opacity': '1'
    });

    if ($('#vung-taixiu')['css']('display') == 'block' && data.time < 4) {
        thaluot(ketqua)
    }
    numanimate_2($('.khung-tx .money-tai,.game-item-2 .money-tai .middle'), data.vangtai, 17);
    numanimate_2($('.khung-tx .money-xiu,.game-item-2 .money-xiu .middle'), data.vangxiu, 17);
    $('.khung-tx .user-tai')['html'](njs(data.usertai));
    $('.khung-tx .user-xiu')['html'](njs(data.userxiu));

})

socketzzz.on("running", (data) => {
    vungtxxx = false
    numanimate_2($('.khung-tx .money-tai,.game-item-2 .money-tai .middle'), data.vangtai, 17);
    numanimate_2($('.khung-tx .money-xiu,.game-item-2 .money-xiu .middle'), data.vangxiu, 17);
    $('.effect')['css']({
        'opacity': '0'
    });
    $('.nangame')['css']({
        'opacity': '1'
    });
    $('.clock-big')['css']({
        'opacity': '1'
    });
    $('#vung-taixiu')['hide']();
    $('#game-taixiu .kq-num')['css']({
        'opacity': '0'
    });
    $('.clock-small')['css']({
        'opacity': '0'
    });


    $(".clock-big").text(data.time)
    if (data.time < 6) {
        $('.clock-big')['css']('color', '#dc3545');
    }
    else {
        $('.clock-big')['css']('color', '#dada25');
    }

    $('.khung-tx .user-tai')['html'](njs(data.usertai));
    $('.khung-tx .user-xiu')['html'](njs(data.userxiu));

    numanimate_2($('#hu-tx'), data.Hu, 10);



})
var ketqualast = -1;
var x1last = -1;
var x2last = -1;
var x3last = -1;
socketzzz.on("ketqua", (data) => {
    vungtxxx = false
    $('.nangame')['css']({
        'opacity': '0'
    });
    $('.clock-big')['css']({
        'opacity': '0'
    });

    $('.khung-tx .user-tai')['html'](njs(data.usertai));
    $('.khung-tx .user-xiu')['html'](njs(data.userxiu));
    numanimate_2($('.khung-tx .money-tai,.game-item-2 .money-tai .middle'), data.vangtai, 17);
    numanimate_2($('.khung-tx .money-xiu,.game-item-2 .money-xiu .middle'), data.vangxiu, 17);

    ketqualast = data.ketqua.x1 + data.ketqua.x2 + data.ketqua.x3
    x1last = data.ketqua.x1
    x2last = data.ketqua.x2
    x3last = data.ketqua.x3
    $(".kq-num").html('<div class="middle">' + ketqualast + '</div>')
    if ($('#game-taixiu2')['hasClass']('nantx') == false) {

        $('#vung-taixiu')['show']()['css']({
            'left': '0px',
            'top': '0px'
        })
    }
    else {
        $('#game-taixiu .kq-num')['css']({
            'opacity': '1'
        });
        $('.clock-small')['css']({
            'opacity': '1'
        });

        if (ketqualast >= 11) {
            $('.tai-wrap .icon')['addClass']('kq')['delay'](10000)['queue'](function () {
                $(this)['removeClass']('kq')['dequeue']()
            });
        }
        else {
            $('.xiu-wrap .icon')['addClass']('kq')['delay'](10000)['queue'](function () {
                $(this)['removeClass']('kq')['dequeue']()
            });
        }
        $('#game-taixiu .his div')['first']()['remove']();
        if (ketqualast < 11) {
            var zzzzz = '<div class=\"btn-xiu\" onmouseover=\"show_roll_tx($(this))\" data-title=\"' + ' (' + x1last + '-' + x2last + '-' + x3last + ') ' + ketqualast + '-Xỉu\"></div>'
        } else {

            var zzzzz = '<div class=\"btn-tai\" onmouseover=\"show_roll_tx($(this))\" data-title=\"' + ' (' + x1last + '-' + x2last + '-' + x3last + ') ' + ketqualast + '-T\xE0i"></div>'

        };
        $('#game-taixiu .his span')['before'](zzzzz);


    }
    set_roll_tx(1, { xn1: x1last, xn2: x2last, xn3: x3last })
})

function thaluot(ketqualast) {
    if (vungtxxx) {
        return;
    }
    vungtxxx = true
    if (ketqualast >= 11) {
        $('.tai-wrap .icon')['addClass']('kq')['delay'](10000)['queue'](function () {
            $(this)['removeClass']('kq')['dequeue']()
        });
    }
    else {
        $('.xiu-wrap .icon')['addClass']('kq')['delay'](10000)['queue'](function () {
            $(this)['removeClass']('kq')['dequeue']()
        });
    }


    $('#game-taixiu .kq-num')['css']({
        'opacity': '1'
    });
    $('#vung-taixiu')['hide']();
    $('#game-taixiu .his div')['first']()['remove']();
    if (ketqualast < 11) {
        var zzzzz = '<div class=\"btn-xiu\" onmouseover=\"show_roll_tx($(this))\" data-title=\"' + ' (' + x1last + '-' + x2last + '-' + x3last + ') ' + ketqualast + '-Xỉu\"></div>'
    } else {

        var zzzzz = '<div class=\"btn-tai\" onmouseover=\"show_roll_tx($(this))\" data-title=\"' + ' (' + x1last + '-' + x2last + '-' + x3last + ') ' + ketqualast + '-T\xE0i"></div>'

    };
    $('#game-taixiu .his span')['before'](zzzzz);
}
var vungtxxx = false
$(document)['ready'](function () {
    $('#vung-taixiu')['draggable']({

        drag: function () {

            var _0x9ca2x19 = $(this)['position']();
            if (_0x9ca2x19['left'] > Math['floor']($(this)['width']() * 0.91)) {
                thaluot(ketqualast)
            };
            if (_0x9ca2x19['top'] > Math['floor']($(this)['height']() * 0.91)) {
                thaluot(ketqualast)
            };
            if (_0x9ca2x19['left'] < Math['floor']('-' + $(this)['width']() * 0.91)) {
                thaluot(ketqualast)
            };
            if (_0x9ca2x19['top'] < Math['floor']('-' + $(this)['height']() * 0.91)) {
                thaluot(ketqualast)
            }
        }
    });
})
var tien = 0;


function so_khac_tx(_0x90f8x4) {
    if (_0x90f8x4 == 1) {
        $('#khung-tx .group-button div')['html']('<div class="button" onclick="btn_money_tx($(this));"><div class="middle" data-txt="100"></div></div><div class="button" onclick="btn_money_tx($(this));"><div class="middle" data-txt="500"></div> </div><div class="button"onclick="btn_money_tx($(this));"><div class="middle" data-txt="1K"></div> </div><div class="button"onclick="btn_money_tx($(this));"><div class="middle" data-txt="5K" ></div> </div><div class="button"onclick="btn_money_tx($(this));"><div class="middle" data-txt="10K"></div> </div><div class="button"onclick="btn_money_tx($(this));"><div class="middle" data-txt="50K"></div> </div><div class="button"onclick="btn_money_tx($(this));"><div class="middle" data-txt="100K"></div> </div><div class="button"onclick="btn_money_tx($(this));" ><div class="middle" data-txt="500K"></div> </div><div class="button"onclick="btn_money_tx($(this));"><div class="middle" data-txt="1M"></div> </div><div class="button" onclick="btn_money_tx($(this));"><div class="middle" data-txt="2M" ></div> </div><div class="button" onclick="btn_money_tx($(this));"><div class="middle" data-txt="5M"></div> </div><div class="button"><div class="middle" data-txt="T\u1EA5t Tay" onclick="tattay_tx()"></div> </div><div class="button blue" onclick="so_khac_tx(2);"><div class="middle" data-txt="S\u1ED1 Kh\xE1c" ></div> </div><div class="button green"  onclick="dat_tx();" ><div class="middle" data-txt="\u0110\u1EB7t C\u01B0\u1EE3c"></div> </div><div class="button red" onclick="cuoc_tx(3)" ><div class="middle" data-txt="H\u1EE7y" ></div></div>')
    } else {
        $('#khung-tx .group-button div')['html']('<div class="button" onclick="btn_khac_tx($(this));"><div class="middle" data-txt="1" ></div></div><div class="button" onclick="btn_khac_tx($(this));"><div class="middle" data-txt="2" ></div> </div><div class="button" onclick="btn_khac_tx($(this));"><div class="middle" data-txt="3" ></div> </div><div class="button" onclick="btn_khac_tx($(this));"><div class="middle" data-txt="4" ></div> </div><div class="button" onclick="btn_khac_tx($(this));"><div class="middle" data-txt="5" ></div> </div><div class="button" onclick="btn_khac_tx($(this));"><div class="middle" data-txt="6" ></div> </div><div class="button" onclick="btn_khac_tx($(this));"><div class="middle" data-txt="7" ></div> </div><div class="button" onclick="btn_khac_tx($(this));"><div class="middle" data-txt="8" ></div> </div><div class="button" onclick="btn_khac_tx($(this));"><div class="middle" data-txt="9" ></div> </div><div class="button" onclick="btn_khac_tx($(this));"><div class="middle" data-txt="0" ></div> </div><div class="button" onclick="btn_khac_tx($(this));"><div class="middle" data-txt="000" ></div> </div><div class="button"  onclick="btn_khac_tx($(this));"><div class="middle" data-txt="X\xF3a" ></div> </div><div class="button blue" ><div class="middle" data-txt="S\u1ED1 Nhanh" onclick="so_khac_tx(1);"></div> </div><div class="button green"  onclick="dat_tx();" ><div class="middle" data-txt="\u0110\u1EB7t C\u01B0\u1EE3c"></div> </div><div class="button red" ><div class="middle" data-txt="H\u1EE7y"  onclick="cuoc_tx(3)"></div></div>')
    }
}



function dragx(_0x90f8x4, _0x90f8xd) {
    $(function () {
        var _0x90f8xe = 0;
        _0x90f8x4['draggable']({
            axis: 'x',
            start: function () { },
            drag: function () {
                _0x90f8xe++;
                if (_0x90f8xe > 7) {
                    $('.menu_game_drag')['show']();
                    _0x90f8xe = -999999
                }
            },
            stop: function () {
                $('.menu_game_drag')['hide']();
                _0x90f8xe = 0;
                var _0x90f8xf = $(this)['position']();
                if (_0x90f8xf['left'] > 0) {
                    $(this)['animate']({
                        left: '0px'
                    }, 500)
                };
                var _0x90f8x10 = $(_0x90f8xd)['length'],
                    _0x90f8x11 = 0,
                    _0x90f8xa = 0;
                for (_0x90f8xa = 0; _0x90f8xa < _0x90f8x10; _0x90f8xa++) {
                    _0x90f8x11 += $(_0x90f8xd)['eq'](_0x90f8xa)['width']()
                };
                var _0x90f8x9 = '-' + (_0x90f8x11 - _0x90f8x4['width']() + 10);
                if (_0x90f8x11 < _0x90f8x4['width']() && _0x90f8xf['left'] < 0) {
                    _0x90f8x4['animate']({
                        left: '0px'
                    }, 200)
                };
                var _0x90f8x12 = _0x90f8x11 - $(this)['width']();
                if ((_0x90f8x12 + _0x90f8xf['left']) < 0 && _0x90f8xf['left'] < 0) {
                    $(this)['animate']({
                        left: _0x90f8x9 + 'px'
                    }, 500)
                }
            }
        })
    })
}

function dragy(_0x90f8x4, _0x90f8xd) {
    $(function () {
        function _0x90f8x14(_0x90f8x15) {
            return false;
            var _0x90f8xf = _0x90f8x4['position']();
            if (_0x90f8xf['top'] > -10 && _0x90f8x15 != 1) {
                if (_0x90f8x15 > 0) {
                    return false
                };
                _0x90f8x4['animate']({
                    top: '0px'
                }, 300)
            };
            var _0x90f8x10 = $(_0x90f8xd)['length'],
                _0x90f8x11 = 0,
                _0x90f8xa = 0;
            for (_0x90f8xa = 0; _0x90f8xa < _0x90f8x10; _0x90f8xa++) {
                _0x90f8x11 += $(_0x90f8xd)['eq'](_0x90f8xa)['height']()
            };
            var _0x90f8x9 = '-' + (_0x90f8x11 - _0x90f8x4['height']() + 10);
            if (_0x90f8x11 < _0x90f8x4['height']() && _0x90f8x15 != 2) {
                if (_0x90f8x15 > 0) {
                    return false
                };
                _0x90f8x4['animate']({
                    top: '0px'
                }, 200)
            };
            if (((_0x90f8x11 - _0x90f8x4['height']()) + _0x90f8xf['top']) < 10 && _0x90f8xf['top'] < 0 && _0x90f8x15 != 2) {
                if (_0x90f8x15 > 0) {
                    return false
                };
                _0x90f8x4['animate']({
                    top: _0x90f8x9 + 'px'
                }, 300)
            };
            return true
        }
        _0x90f8x4['on']('mousewheel', function (_0x90f8x16) {
            if (_0x90f8x16['originalEvent']['wheelDelta'] / 120 > 0) {
                if (_0x90f8x14(2) == true) {
                    _0x90f8x4['css']({
                        top: _0x90f8x4['position']()['top'] + (_0x90f8x4['height']() * 0.1) + 'px'
                    })
                }
            } else {
                if (_0x90f8x14(1) == true) {
                    _0x90f8x4['css']({
                        top: _0x90f8x4['position']()['top'] - (_0x90f8x4['height']() * 0.1) + 'px'
                    })
                }
            };
            _0x90f8x16['preventDefault']()
        });
        _0x90f8x4['draggable']({
            axis: 'y',
            stop: function () {
                _0x90f8x14()
            }
        });
        _0x90f8x14('1')
    })
}

function dragz(_0x90f8x18, _0x90f8xd, _0x90f8x19) {
    $(function () {
        function _0x90f8x14(_0x90f8x18, _0x90f8xd, _0x90f8x19, _0x90f8x15) {
            var _0x90f8x1a = Number(_0x90f8x1e['css']('left')['replace']('px', ''));
            if (_0x90f8x15 == 1) {
                var _0x90f8x1b = Math['floor'](_0x90f8x1a + _0x90f8x1e['width']()) + 10
            } else {
                var _0x90f8x1b = Math['floor'](_0x90f8x1a - _0x90f8x1e['width']()) + 10
            };
            var _0x90f8x1c = Math['floor'](_0x90f8x1b / _0x90f8x1e['width']());
            var _0x90f8x1d = Math['floor'](_0x90f8x1b - _0x90f8x1e['width']());
            _0x90f8x1e['css']({
                left: _0x90f8x1c + '' + '00%'
            });
            var _0x90f8x10 = $(_0x90f8x19)['length'],
                _0x90f8x11 = 0,
                _0x90f8xa = 0;
            for (_0x90f8xa = 0; _0x90f8xa < _0x90f8x10; _0x90f8xa++) {
                _0x90f8x11 += $(_0x90f8x19)['eq'](_0x90f8xa)['width']()
            };
            if (_0x90f8x1c > -1) {
                $(_0x90f8x18 + ' .left')['hide']()
            } else {
                $(_0x90f8x18 + ' .left')['show']()
            };
            if ('-' + _0x90f8x11 > _0x90f8x1d) {
                $(_0x90f8x18 + ' .right')['hide']()
            } else {
                $(_0x90f8x18 + ' .right')['show']()
            };
            console['log'](_0x90f8x1b);
            console['log'](_0x90f8x1c);
            console['log'](_0x90f8x1b / _0x90f8x1e['width']());
            return true
        }
        var _0x90f8x4 = $(_0x90f8x18);
        var _0x90f8x1e = $(_0x90f8xd);
        $(_0x90f8x18 + ' .left')['on']('click touchstart mousedown touchend', function () {
            if (check_click($(this)) == true) {
                _0x90f8x14(_0x90f8x18, _0x90f8xd, _0x90f8x19, 1)
            }
        })['hide']();
        $(_0x90f8x18 + ' .right')['on']('click touchstart mousedown touchend', function () {
            if (check_click($(this)) == true) {
                _0x90f8x14(_0x90f8x18, _0x90f8xd, _0x90f8x19, 2)
            }
        })
    })
}

function njs(_0x90f8x4) {
    var _0x90f8x20 = String(_0x90f8x4);
    var _0x90f8x21 = _0x90f8x20['length'];
    var _0x90f8x22 = 0;
    var _0x90f8x23 = '';
    var _0x90f8xa;
    for (_0x90f8xa = _0x90f8x21 - 1; _0x90f8xa >= 0; _0x90f8xa--) {
        _0x90f8x22 += 1;
        aa = _0x90f8x20[_0x90f8xa];
        if (_0x90f8x22 % 3 == 0 && _0x90f8x22 != 0 && _0x90f8x22 != _0x90f8x21) {
            _0x90f8x23 = '.' + aa + _0x90f8x23
        } else {
            _0x90f8x23 = aa + _0x90f8x23
        }
    };
    return _0x90f8x23
}



function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}






function hideHis() {
    $('.main-his')['removeClass']('show-main');
    $('.main-his .show-main')['removeClass']('show-main')
}


var ketquatxvung = false
function show_roll_tx(_0x9ca2x2) {
    var _0x9ca2x3 = _0x9ca2x2['offset']();
    var _0x9ca2x4 = $('#game-taixiu .his')['offset']();
    $('#game-taixiu .tooltip_tx')['html'](_0x9ca2x2['attr']('data-title'))['css']({
        'margin-left': (_0x9ca2x3['left'] - _0x9ca2x4['left']) + 'px'
    })['show']()
}



function hide_roll_tx(_0x9ca2x2) {
    $('#game-taixiu .tooltip_tx')['hide']()
}

function set_roll_tx(_0x9ca2x2, _0x9ca2x6) {
    if (_0x9ca2x2 < 15) {
        m = 20
    } else {
        m = -15
    };
    setTimeout(function () {
        $('#khung-tx .effect')['css']({
            '\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x70\x6F\x73\x69\x74\x69\x6F\x6E\x2D\x79': 0 + (34 - _0x9ca2x2) * 2.94105 + '%',
            '\x62\x61\x63\x6B\x67\x72\x6F\x75\x6E\x64\x2D\x69\x6D\x61\x67\x65': 'url(/images/taixiu/ef.png)',
            '\x6F\x70\x61\x63\x69\x74\x79': '1'
        });
        if (_0x9ca2x2 != 34) {
            set_roll_tx(_0x9ca2x2 + 1, _0x9ca2x6)
        } else {
            $('#khung-tx .effect')['css']('background-image', ' url(/images/taixiu/xx' + Math['floor'](_0x9ca2x6['xn1']) + '_1.png),url(/images/taixiu/xx' + Math['floor'](_0x9ca2x6['xn2']) + '_2.png),url(/images/taixiu/xx' + Math['floor'](_0x9ca2x6['xn3']) + '_3.png)');
            $('#game-taixiu .kq-num div')['html'](_0x9ca2x6['xn4']);
            setTimeout(function () {
                $('#game-taixiu .effect')['css']({
                    '\x6F\x70\x61\x63\x69\x74\x79': '0'
                });
                $('#game-taixiu .kq-num')['css']({
                    '\x6F\x70\x61\x63\x69\x74\x79': '0'
                })
            }, 11000)
        }
    }, 30 + m)
}

function tattay_tx() {
    var _0x9ca2x2 = Math['floor']($('#khung-tx')['val']());
    if (_0x9ca2x2 == 0) {
        thong_bao('Th\xF4ng B\xE1o', 'Vui L\xF2ng Ch\u1ECDn T\xE0i Ho\u1EB7c X\u1EC9u')
    } else {
        if (_0x9ca2x2 == 1) {

            // $('#khung-tx input.input-tai')['val'](Math['floor']($('.mymoney')['html']()['replace'](/\,/g, '')))

            $('#khung-tx input.input-tai').val($("#goldUser").val())
        } else {
            if (_0x9ca2x2 == 2) {
                // $('#khung-tx input.input-xiu')['val'](Math['floor']($('.mymoney')['html']()['replace'](/\,/g, '')))
                $('#khung-tx input.input-xiu').val($("#goldUser").val())
            }
        }
    }
}

function btn_money_tx(_0x9ca2xc) {
    var _0x9ca2x2 = Number($('#khung-tx')['val']());
    if (_0x9ca2x2 == 0) {
        thong_bao('Th\xF4ng B\xE1o', 'Vui L\xF2ng Ch\u1ECDn T\xE0i Ho\u1EB7c X\u1EC9u')
    } else {
        if (_0x9ca2x2 == 1) {

            var moneytaiii = Number($('#khung-tx input.input-tai').val().replace(/[\D\s\._\-]+/g, ""))

            var rsss = Number(_0x9ca2xc['find']('.middle')['attr']('data-txt')['replace'](/\K/g, '000')['replace'](/\M/g, '000000')) + moneytaiii


            $('#khung-tx input.input-tai')['val'](convertNumber(rsss));
        } else {
            if (_0x9ca2x2 == 2) {

                var moneyxiuuu = Number($('#khung-tx input.input-xiu').val().replace(/[\D\s\._\-]+/g, ""))


                $('#khung-tx input.input-xiu')['val'](convertNumber(Number(_0x9ca2xc['find']('.middle')['attr']('data-txt')['replace'](/\K/g, '000')['replace'](/\M/g, '000000')) + moneyxiuuu))
            }
        }
    };
    return false
}

function btn_khac_tx(_0x9ca2xc) {
    var _0x9ca2x2 = Math['floor']($('#khung-tx')['val']());
    var _0x9ca2xc = _0x9ca2xc['find']('.middle')['attr']('data-txt');
    if (_0x9ca2x2 == 0) {
        thong_bao('Th\xF4ng B\xE1o', 'Vui L\xF2ng Ch\u1ECDn T\xE0i Ho\u1EB7c X\u1EC9u')
    } else {
        if (_0x9ca2x2 == 1) {
            if (_0x9ca2xc == 'X\xF3a') {
                $('#khung-tx input.input-tai')['val'](Math['floor'](String($('#khung-tx input.input-tai')['val']())['slice'](0, -1)))
            } else {
                $('#khung-tx input.input-tai')['val'](Math['floor']($('#khung-tx input.input-tai')['val']() + '' + _0x9ca2xc))
            }
        } else {
            if (_0x9ca2x2 == 2) {
                if (_0x9ca2xc == 'X\xF3a') {
                    $('#khung-tx input.input-xiu')['val'](Math['floor'](String($('#khung-tx input.input-xiu')['val']())['slice'](0, -1)))
                } else {
                    $('#khung-tx input.input-xiu')['val'](Math['floor']($('#khung-tx input.input-xiu')['val']() + '' + _0x9ca2xc))
                }
            }
        }
    };
    return false
}

function dat_tx() {
    var _0x9ca2x2 = Math['floor']($('#khung-tx')['val']());
    if (_0x9ca2x2 == 0) {
        thong_bao('Th\xF4ng B\xE1o', 'Vui L\xF2ng Ch\u1ECDn T\xE0i Ho\u1EB7c X\u1EC9u')
    } else {
        if (_0x9ca2x2 == 1) {
            var _0x9ca2xf = $('#khung-tx input.input-tai')['val']();
            $('#khung-tx input.input-tai')['val']('');
            var _0x9ca2x10 = 'tai'
        } else {
            if (_0x9ca2x2 == 2) {
                var _0x9ca2xf = $('#khung-tx input.input-xiu')['val']();
                $('#khung-tx input.input-xiu')['val']('');
                var _0x9ca2x10 = 'xiu'
            }
        };

        //  alert(_0x9ca2xf + "|" + _0x9ca2x10)

        $['ajax']({
            type: 'post',
            url: '/taixiu/putcuoc',
            data: { vangcuoc: _0x9ca2xf, type: _0x9ca2x10 },
            success: function (data) {
                if (data.error == 1) {
                    note_play('.move-here .note_here', data.message, 'ff0000');
                }
                else {
                    note_play('.move-here .note_here', data.message, '28a745');

                }
            }
        });
    };
    return false
}

function cuoc_tx(_0x9ca2x2) {
    if (_0x9ca2x2 == 1) {
        $('#khung-tx input.input-tai')['focus']();
        $('#khung-tx .group-button')['show']('fade', {}, 500);
        $('#khung-tx')['val'](1);
        $('#khung-tx input.input-tai')['val'](Math['floor']($('#khung-tx input.input-tai')['val']()) + 0);
        $('#khung-tx input.input-xiu')['val']('');
        $('#khung-tx .input-cuoc-hide')['removeClass']('active');
        $('#khung-tx .input-tai.input-cuoc-hide')['addClass']('active')
    } else {
        if (_0x9ca2x2 == 2) {
            $('#khung-tx input.input-xiu')['focus']()['select']();
            $('#khung-tx .group-button')['show']('fade', {}, 500);
            $('#khung-tx')['val'](2);
            $('#khung-tx input.input-xiu')['val'](Math['floor']($('#khung-tx input.input-xiu')['val']()) + 0);
            $('#khung-tx input.input-tai')['val']('');
            $('#khung-tx .input-cuoc-hide')['removeClass']('active');
            $('#khung-tx .input-xiu.input-cuoc-hide')['addClass']('active')
        } else {
            if (_0x9ca2x2 == 3) {
                $('#khung-tx .group-button')['hide']('fade', {}, 500);
                $('#khung-tx .input-cuoc-hide')['removeClass']('active');
                $('#khung-tx input.input-xiu')['val']('');
                $('#khung-tx input.input-tai')['val']('')
            }
        }
    };
    return false
}

function nan_taixiu(_0x9ca2x2) {
    if (_0x9ca2x2['val']() == 1) {
        _0x9ca2x2['attr']('src', '/images/taixiu/btn_nan_2.png')['val'](0);
        $('#game-taixiu2')['removeClass']('nantx')
    } else {
        _0x9ca2x2['attr']('src', '/images/taixiu/btn_nan_0.png')['val'](1);
        $('#game-taixiu2')['addClass']('nantx')
    };
    return false
}




$(document)['ready'](function () {
    $('#game-taixiu')['draggable']({
        start: function () {
            $('.actigame')['removeClass']('actigame');
            $(this)['addClass']('actigame')
        },
        cancel: '.group-button',
        handle: '.move-here'
    });


    $('#khung-tx .tai-wrap .input-tai')['on']('click', function () {
        if (check_click($(this)) == true) {
            cuoc_tx(1)
        }
    });
    $('#khung-tx .xiu-wrap .input-xiu')['on']('click', function () {
        if (check_click($(this)) == true) {
            cuoc_tx(2)
        }
    });
    $('#khung-tx .clogame')['on']('click ', function () {
        if (check_click($(this)) == true) {
            $('#game-taixiu')['hide']('fade', {}, 500)
        }
    });
    $('#khung-tx .wingame')['on']('click ', function () {
        if (check_click($(this)) == true) {
            showwinner('tai-xiu')
        }
    });
    $('#khung-tx .hisgame')['on']('click ', function () {

        //lichsucuoc






        getCuocs()



        $("#cuocsModal").modal()


    });



    $('#khung-tx .guigame')['on']('click ', function () {

        //huongdan

        $("#modalHuongDantx").modal();

    });
    $('#khung-tx .allgame')['on']('click ', function () {
        $['ajax']({
            type: 'post',
            url: '/taixiu/getHisNohu',
            success: function (data) {
                var hiss = ""
                var totalgold = 0
                $("#vanghu").text(numberWithCommas(data.vanghu))
                data.playerWin.forEach(his => {

                    totalgold+=his.vangWinHu
                    hiss += '<tr class="font-weight-bold"><td class="p-2">' + his.username + '</td><td class="p-2">' + numberWithCommas(his.xu) + '</td><td class="p-2 text-danger">' + numberWithCommas(his.vangWinHu) + " vàng</td>"
                })
                $("#vangallmem").text(numberWithCommas(totalgold))

                document.getElementById("lsthanghu-tx").innerHTML = hiss
                $("#thongkeTx").modal()
            }
        })
    });
    $('#khung-tx .nangame')['on']('click', function () {
        if (check_click($(this)) == true) {
            nan_taixiu($(this))
        }
    });

    $('#khung-tx .group-button .button.blue')['on']('click  ', function () {
        if (check_click($(this)) == true) {
            cuoc_tx(3)
        }
    });
    $('#khung-tx .group-button .button.money2')['on']('click ', function () {
        if (check_click($(this)) == true) {
            btn_khac_tx($(this))
        }
    });
    $('#khung-tx .group-button .button.money')['on']('click ', function () {
        if (check_click($(this)) == true) {
            btn_money_tx($(this))
        }
    });
    $('#khung-tx .group-button .button.tattay')['on']('click  ', function () {
        if (check_click($(this)) == true) {
            tattay_tx()
        }
    });
    $('#khung-tx .group-button .button.green')['on']('click ', function () {
        console.log("cc")
        if (check_click($(this)) == true) {
            dat_tx()
        }
    });
    $('#khung-tx .group-button .button.red')['on']('click  ', function () {
        if (check_click($(this)) == true) {
            cuoc_tx(3)
        }
    })
})
function getCuocs() {
    $['ajax']({
        type: 'get',
        url: '/taixiu/getcuoc',

        success: function (data) {
            //console.log(data)
            var cuoccccc = "";
            data.map((cuoc) => {
                cuoccccc += '<tr><td>' + cuoc.nhanvat + '</td><td>' + numberWithCommas(cuoc.vangdat) + '</td><td>' + (cuoc.type == "xiu" ? "Xỉu" : "Tài") + '</td><td>' + getstatustx(cuoc.status, cuoc.vangnhan) + '</td><td>' + new Date(cuoc.time).toLocaleTimeString() + '</td></tr>'
            })
            cuoccccc = '<tr class="bg bg-danger text-white"><th>Nhân vật</th><th>Vàng đặt</th> <th>Cửa đặt</th><th>Trạng thái</th><th>Thời gian</th></tr>' + cuoccccc

            document.getElementById("tablecuoc").innerHTML = cuoccccc
        }
    })
}

setInterval(() => { getCuocs() }, 5000)


function gethis() {
    $['ajax']({
        type: 'get',
        url: '/taixiu/gethis',

        success: function (data) {

            var zzzzzzzzzzzzz = ""
            data.map((his) => {
                if (his.ketqua < 11) {
                    zzzzzzzzzzzzz = '<div class=\"btn-xiu\" onmouseover=\"show_roll_tx($(this))\" data-title=\"' + ' (' + his.x1 + '-' + his.x2 + '-' + his.x3 + ') ' + his.ketqua + '-Xỉu\"></div>' + zzzzzzzzzzzzz
                } else {

                    zzzzzzzzzzzzz = '<div class=\"btn-tai\" onmouseover=\"show_roll_tx($(this))\" data-title=\"' + ' (' + his.x1 + '-' + his.x2 + '-' + his.x3 + ') ' + his.ketqua + '-T\xE0i"></div>' + zzzzzzzzzzzzz

                };

            })
            $('#game-taixiu .his span')['before'](zzzzzzzzzzzzz);
        }
    });

}
gethis()


$("#gold2").on("keyup", function (event) {
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
$("#gold3").on("keyup", function (event) {
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
