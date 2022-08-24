


setInterval(function () {
  loadgame(false)
}, 7000)


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
loadgame = (isgetchat) => {
  $.ajax({
    url: "/game/getgame",
    type: "post",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      server: indexServer,
      record: record.value,
      isme: isMe.value,
      getchat: isgetchat
    }),
    success: function (res) {

      if (isgetchat == true && res.mess != "") {
        chatGlobal.innerHTML = res.mess
        $("#chatGlobal").animate({
          scrollTop:
            $("#chatGlobal").prop("scrollHeight")
        }, 500);
      }
      if (res.game) {
        const gamez = res.game;


        numgo($("#goldLe"), (gamez.vangle), 17)
        numgo($("#goldChan"), (gamez.vangchan), 17)
        numgo($("#goldTai"), (gamez.vangtai), 17)
        numgo($("#goldXiu"), (gamez.vangxiu), 17)

        numgo($("[id=nohu]"), (res.nohu.vanghu), 17)
        $("#rsnohuu").html(res.nohu.lastwin)

        //$("#goldLe").text(numberWithCommas(gamez.vangle))
        // $("#goldChan").text(numberWithCommas(gamez.vangchan))
        // $("#goldTai").text(numberWithCommas(gamez.vangtai))
        // $("#goldXiu").text(numberWithCommas(gamez.vangxiu))

        seccond.innerHTML = gamez.time
        result.innerHTML = gamez.ketquatruoc
        server.innerHTML = gamez.server
        timeCsmm.innerHTML = gamez.timeCsmm
        idCsmm.innerHTML = "#" + gamez._id
      }
      if (res.user) {
        var goldUsers = res.user.vang.replace(/[\D\s\._\-]+/g, "");
        if(goldUsers!=0)
        {
          goldUsers--
        }
        goldUser.value = numberWithCommas(goldUsers)
        
        userInfo.innerHTML = '<img src="/images/avatar/' + (res.user.avatar == "none" ? "aaaa.png" : res.user.avatar) + '" alt="avatar" style="width: 21px;border-radius: 50%;/* margin-top: 2%; */"> ' + res.user.name + " - " + numberWithCommas(res.user.vang) + "$"
      }
      if (res.cuoc) {

        var table = "";
        if (res.cuoc.length <= 0) {
          table = '<tr> <td colspan="9" class="text-center">Không tìm thấy giao dịch nào</td> </tr>';
        }
        else {


          res.cuoc.forEach(function (data, index) {
            table += "<tr " + (data.__v == 9999 ? 'style="background-color:#E0FFFF" class="text-dark"' : "") + "> <td>" + data.server + "</td> <td>" + data.nhanvat + "</td> <td>" + numberWithCommas(Math.round(data.vangdat)) + "</td> <td>" + gettype(data.type, data.chon) + "</td> <td>" + getvalue(data.type, data.chon) + "</td> <td>" + getxoay(data.ketqua) + "</td> <td>" + getxoay(numberWithCommas(Math.round(data.vangnhan))) + "</td> <td>" + getstatus(data.status) + "</td> <td>" + (data.__v == 9999 ? '<a href="javascript:void(0);" onclick="cancel(\'' + data._id + '\')"><span class="fas fa-trash"></span></a>' : new Date(data.time).toLocaleTimeString()) + "</td> </tr>";
          })
        }
        lichsugd.innerHTML = table

      }

      if (res.ketqua) {

        var ketquacl = "";
        var ketquatx = "";
        if (res.ketqua.length <= 0) {
          ketquacl = '';
          ketquatx = '';
        }
        else {


          res.ketqua.forEach(function (data, index) {

            if (data.ketquatruoc % 2 == 0) {
              ketquacl = '<span onmouseover="show_roll_Cl($(this))" data-title="' + "Kết quả: Chẵn - " + data.ketquatruoc + '" class="rounded-circle bg-info text-white text-center" style="padding-right: 5px; padding-left: 5px; margin-right: 3px; display: inline-block; width: 21px">C</span>' + ketquacl;
            }
            else
              if (data.ketquatruoc % 2 != 0) {
                ketquacl = '<span onmouseover="show_roll_Cl($(this))" data-title="' + "Kết quả: Lẻ - " + data.ketquatruoc + '" class="rounded-circle bg-warning text-white text-center" style="padding-right: 5px; padding-left: 5px; margin-right: 3px; display: inline-block; width: 21px">L</span>' + ketquacl;
              }

            if (data.ketquatruoc >= 50) {
              ketquatx = '<span onmouseover="show_roll_Tx($(this))" data-title="' + "Kết quả: Tài - " + data.ketquatruoc + '" class="rounded-circle bg-success text-white text-center" style="padding-right: 5px; padding-left: 5px; margin-right: 3px; display: inline-block; width: 21px">T</span>' + ketquatx;
            }
            else
              if (data.ketquatruoc < 50) {
                ketquatx = '<span onmouseover="show_roll_Tx($(this))" data-title="' + "Kết quả: Xỉu - " + data.ketquatruoc + '" class="rounded-circle bg-danger text-white text-center" style="padding-right: 5px; padding-left: 5px; margin-right: 3px; display: inline-block; width: 21px">X</span>' + ketquatx;
              }
          })
          resultCL.innerHTML = ketquacl + '<span id="showCl"></span>'
          resultTX.innerHTML = ketquatx + '<span id="showTx"></span>'

        }


      }
      if (res.countmess > countMess) {

        if (countMess == 0) {
          countMess = res.countmess
        }
        if (res.countmess - countMess != 0) {
          $("#messageCount").html(res.countmess - countMess);
        }
        else {
          $("#messageCount").html('');
        }

        // countMess=res.countmess


      }
    }
  });
}
loadgame(true)

function getxoay(zz) {
  if (zz == -1) return '<img id=\"loadding\" style=\"margin-left: 10px;\" src=\"images/loading2.gif\" alt=\"loading\" width=\"auto\" height=\"20px\">'
  else return zz
}

function getstatus(status) {
  if (status == -1) return '<img id=\"loadding\" style=\"margin-left: 10px;\" src=\"images/loading2.gif\" alt=\"loading\" width=\"auto\" height=\"20px\">'
  else if (status == 1) { return '<div class="badge badge-success text-uppercase font-weight-bold" ;="" style="padding: 5px 5px"> Đã thanh toán </div>' }
  else if (status == 2) return '<div class="badge badge-danger text-uppercase font-weight-bold" ;="" style="padding: 5px 5px"> THUA </div>'
  else if (status == 5) return '<div class="badge badge-warning text-uppercase font-weight-bold text-white" ;="" style="padding: 5px 5px"> Đã hủy </div>'
  else return '<div class="badge badge-primary text-uppercase font-weight-bold" ;="" style="padding: 5px 5px"> null </div>'
}
function getvalue(type, value) {
  if (type == 0) {
    if (value == 0) {
      return "Chẵn"
    }
    else
      if (value == 1) {
        return "Lẻ"
      }
      else
        if (value == 2) {
          return "Tài"
        }
        else
          if (value == 3) {
            return "Xỉu"
          }
          else {
            return value
          }
  }
  else if (type == 4) {
    if (value == 0) {
      return "Chẵn - Tài"
    }
    else
      if (value == 1) {
        return "Chẵn - Xỉu"
      }
      else
        if (value == 2) {
          return "Lẻ - Tài"
        }
        else
          if (value == 3) {
            return "Lẻ - Xỉu"
          }
          else {
            return value
          }
  }
  else {
    return value
  }
}

function gettype(type, value) {
  if (type == 0 && (value == 0 || value == 1)) {
    return "Chẵn lẻ"
  }
  else if (type == 0 && (value == 2 || value == 3)) {
    return "Tài xỉu"
  }
  else if (type == 4) {
    return "Xiên"
  }
  else {
    return "Đoán số"
  }
}
setInterval(() => {
  countSeccond();
}, 1000);

function countSeccond() {
  var send = Number(seccond.innerHTML);
  loadding.hidden = true;
  if (send <= 0) {
    loadding.hidden = false;
    return;
  }
  seccond.innerHTML = send - 1;
}


function cancel(id) {
  if (!confirm("Bạn có chắc chắn muốn hủy không?")) {
    return;
  }
  divAlert.innerHTML = "";
  $.ajax({
    url: "/game/cancel",
    type: "post",
    dataType: "text",
    data: {
      id: id
    },
    success: function (result) {
      var js = JSON.parse(result)
      if (js.error == 1) {
        divAlert.innerHTML = thongbao("danger", js.message);
      }
      else {
        divAlert.innerHTML = thongbao("success", js.message);
        loadgame(false)
      }

    }
  });
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
      _0x90f8x23 = ',' + aa + _0x90f8x23
    } else {
      _0x90f8x23 = aa + _0x90f8x23
    }
  };
  return _0x90f8x23
}

function numgo(item, number, tim) {
  var timz = Math['floor'](tim);
  var itemz = Math['floor'](item['val']());
  var numberz = (Math['floor'](number) - Math['floor'](item['val']())) / timz;
  (function setttttttt(alo) {
    setTimeout(function () {
      item['html'](njs(Math['floor'](itemz + (timz + 1 - alo) * numberz)));
      if (--alo) {
        setttttttt(alo)
      } else {
        item['val'](number)
      }
    }, 10)
  })(timz)
}


btnSubmit.addEventListener("click", function () {




  divAlert.innerHTML = "";
  if (type.value == -1) {
    divAlert.innerHTML = thongbao("warning", "<strong>Thất bại!</strong> Vui lòng chọn trò chơi!");
    return;
  }
  var value = 0;
  if (type.value == 0 || type.value == 3 || type.value == 4) {
    value = valueDatCuoc;
    if (value == -1) {
      divAlert.innerHTML = thongbao("warning", "<strong>Thất bại!</strong> Vui lòng chọn kết quả dự đoán!");
      return;
    }
  } else {
    value = document.getElementById("value").value;
  }
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';

  $.ajax({
    url: "/game/cuoc",
    type: "post",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      type: type.value,
      gold: gold.value,
      value: value,
      server: indexServer
    }),
    success: function (res) {


      if (res.error == 0) {
        divAlert.innerHTML = thongbao("success", res.message);
      }
      else {
        divAlert.innerHTML = thongbao("warning", res.message);
      }

      btnSubmit.disabled = false;
      btnSubmit.innerHTML = "Đặt ngay";
      selectGame()
      loadgame(false)

    }
  });













});