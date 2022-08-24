var serverDefault = 10;
var idCsmm = document.getElementById("idCsmm");
var goldChan = document.getElementById("goldChan");
var goldLe = document.getElementById("goldLe");
var goldTai = document.getElementById("goldTai");
var goldXiu = document.getElementById("goldXiu");
var timeCsmm = document.getElementById("time");
var chatGlobal = document.getElementById("chatGlobal");
var resultCl = document.getElementById("resultCL");
var resultTx = document.getElementById("resultTX");
var content = document.getElementById("chatContent");
var isMe = document.getElementById("isMe");
var btn = document.getElementById("chatButton");
var goldUser = document.getElementById("goldUser");
var lsgd = document.getElementById("lichsugd");
var type = document.getElementById("type");
var gold = document.getElementById("gold");
var divValue = document.getElementById("divValue");
var divAlert = document.getElementById("alert")
var btnSubmit = document.getElementById("btnDatCuoc");
var result = document.getElementById("result");
var record = document.getElementById("record");
var loadding = document.getElementById("loadding");
var seccond = document.getElementById("seccond");
var server = document.getElementById("server");
var userInfo = document.getElementById("userInfo");


//btnsv
var indexServer = serverDefault;
var listBtnSv = document.getElementById("listBtnSv");
var innerHTML = "";
for (var i = 1; i <= 10; i++) {
  var className = "btn border-info font-weight-bold text-info btn-sv";
  if (i == indexServer) {
    className = "btn btn-info font-weight-bold btn-sv";
  }
  var title = i;
  if (i == 10) {
    title = " 24/24";
  }
  innerHTML += '<button type="button" class="' + className + '" data-server="' + i + '">Server ' + title + '</button>';
}
$("#cardTradeBTC").hide()

listBtnSv.innerHTML = innerHTML;
var btnSvs = document.getElementsByClassName("btn-sv");
for (var i = 0; i < btnSvs.length; i++) {
  var btnSv = btnSvs[i];
  btnSv.addEventListener("click", function () {
    var index = Number(this.getAttribute("data-server"));
    if (index == indexServer) {
      return;
    }
    btnSvs[index - 1].className = "btn btn-info font-weight-bold btn-sv";
    btnSvs[indexServer - 1].className = "btn border-info font-weight-bold text-info btn-sv";
    indexServer = index;
    if (indexServer == 11) {
      $("#cardBodyKetQua").hide()
      $("#cardDatCuoc").hide()
      $("#cardTradeBTC").show()
      //  $("#cardBetBTC").show()

      $("#cardBetBTC").css("display", "block");

      console.log("cccc")

    }
    else {
      $("#cardTradeBTC").hide()
      $("#cardBodyKetQua").show()



      $("#cardDatCuoc").show()
      // $("#cardBetBTC").hide()

      console.log("cccc")
      $("#cardBetBTC").css("display", "none");


      loadgame(true)
    }
  })
}

//Conten Youtube
$(document).ready(function () {
  var indexContent = 0;
  var arrayContent = ["Uy Tín", "Chất lượng", "Dễ chơi", "Dễ thắng", "Nhiều ưu đãi", "Giao dịch nhanh gọn"];;
  setInterval(function () {
    if (indexContent >= arrayContent.length) {
      indexContent = 0;
    }
    $("#content").html(arrayContent[indexContent]);
    indexContent += 1;
  }, 1000);
});

//darkmode
$("#darkMode").click(function () {
  var length = 8;
  if ($("#darkMode").is(":checked")) {
    reclass("body", "bg-light", "bg-dark");
    for (var i = 1; i <= length; i++) {
      reclass("#darkMode" + i, "text-dark", "text-light")
    }
    reclass("#lichsugd", "text-dark", "text-light");
    reclass("#cardBodyKetQua", "bg-light text-dark", "bg-dark text-light");
    reclass("#cardDatCuoc", "bg-light text-dark", "bg-dark text-light");
    reclass("#chatGlobal", "bg-light text-dark", "bg-dark text-light");

    reclass("#bodyBXH", "text-dark", "text-light");
    reclass("#bodyRankPt", "text-dark", "text-light");

  } else {
    reclass("body", "bg-dark", "bg-light");
    for (var i = 1; i <= length; i++) {
      reclass("#darkMode" + i, "text-light", "text-dark")
    }
    reclass("#lichsugd", "text-light", "text-dark");
    reclass("#cardBodyKetQua", "bg-dark text-light", "bg-light text-dark");
    reclass("#cardDatCuoc", "bg-dark text-light", "bg-light text-dark");
    reclass("#chatGlobal", "bg-dark text-light", "bg-light text-dark");

    reclass("#bodyBXH", "text-light", "text-dark");
    reclass("#bodyRankPt", "text-light", "text-dark");
  }
});
function reclass(select, classOld, classNew) {
  $(select).attr("class", $(select).attr("class").replace(classOld, classNew));
}


var valueDatCuoc = -1;
function btnDuDoanKetQua(id, t) {
  valueDatCuoc = id;
  var btnCurr = t;
  btnCurr.style.opacity = "1";
  if (!btnCurr.innerHTML.includes('<span class="fas fa-check-circle"></span>')) {
    btnCurr.innerHTML = btnCurr.innerHTML += ' <span class="fas fa-check-circle"></span>';
  }
  var listBtn = t.parentElement.parentElement.children;
  for (var i = 0; i < listBtn.length; i++) {
    if (i != id) {
      var btnLast = listBtn[i].children[0];
      btnLast.style.opacity = "0.5";
      btnLast.innerHTML = btnLast.innerHTML.replace('<span class="fas fa-check-circle"></span>', "");
    }
  }
}



type.addEventListener("change", function () {
  selectGame();
});

record.addEventListener("click", function () {
  loadgame()
})
isMe.addEventListener("click", function () {
  loadgame()
})
function selectGame() {
  valueDatCuoc = -1;
  if (type.value == 0) {
    divValue.innerHTML = '<div class="btn-group" style="width: 100%;"><div class="input-group" style="width: 100%;"><div class="col-6"><button type="button" class="btn btn-info form-control rounded font-weight-bold text-uppercase" onclick="btnDuDoanKetQua(0, this)" style="opacity: 0.5;">Chẵn</button></div><div class="col-6"><button type="button" class="btn btn-warning form-control rounded font-weight-bold text-uppercase text-white" style="opacity: 0.5;" onclick="btnDuDoanKetQua(1, this)">Lẻ</span></button></div> <div class="col-6 mt-3"><button type="button" class="btn btn-success form-control rounded font-weight-bold text-uppercase" onclick="btnDuDoanKetQua(2, this)" style="opacity: 0.5;">Tài </button></div><div class="col-6 mt-3"><button type="button" class="btn btn-danger form-control rounded font-weight-bold text-uppercase text-white" style="opacity: 0.5;" onclick="btnDuDoanKetQua(3, this)">Xỉu </button> </div> </div></div>';
  } else if (type.value == 2) {
    divValue.innerHTML = '<input type="number" id="value" name="value" placeholder="Nhập kết quả dự đoán bằng số" class="form-control">';
  } else if (type.value == 4) {
    divValue.innerHTML = '<div class="btn-group" style="width: 100%;"><div class="input-group" style="width: 100%;"><div class="col-6" style="padding-right : 2px;"><button type="button" class="btn btn-info form-control rounded font-weight-bold text-uppercase" onclick="btnDuDoanKetQua(0, this)" style="opacity: 0.5;">Chẵn - Tài </button></div><div class="col-6 text-right" style="padding-right : 2px;"> <button type="button" class="btn btn-warning form-control rounded font-weight-bold text-uppercase text-white" style="opacity: 0.5;" onclick="btnDuDoanKetQua(1, this)">Chẵn - Xỉu </button></div> <div class="col-6 mt-3 text-right"  style="padding-right : 2px;"><button type="button" class="btn btn-success form-control rounded font-weight-bold text-uppercase text-white" style="opacity: 0.5;" onclick="btnDuDoanKetQua(2, this)">Lẻ - Tài </button></div> <div class="col-6 mt-3  text-right"  style="padding-right : 2px;"><button type="button" class="btn btn-danger form-control rounded font-weight-bold text-uppercase text-white" style="opacity: 0.5;" onclick="btnDuDoanKetQua(3, this)">Lẻ - Xỉu </button></div></div> </div>';
  } else {
    divValue.innerHTML = '<div class="btn-group" style="width: 100%;"><div class="input-group" style="width: 100%;"><div class="col-6"><button type="button" class="btn btn-success form-control rounded font-weight-bold text-uppercase" onclick="btnDuDoanKetQua(0, this)" style="opacity: 0.5;">Tài </button></div><div class="col-6"><button type="button" class="btn btn-danger form-control rounded font-weight-bold text-uppercase text-white" onclick="btnDuDoanKetQua(1, this)" style="opacity: 0.5;">Xỉu </button></div></div></div>';
  }
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
    }, 40)
  })(timz)
}

function hide_roll() {
  $('#showCl')['hide']()
  $('#showTx')['hide']()

}

function show_roll_Cl(_0x9ca2x2) {
  var _0x9ca2x3 = _0x9ca2x2['offset']();
  var _0x9ca2x4 = $('#resultCL')['offset']();
  $('#showCl')['html'](_0x9ca2x2['attr']('data-title'))['css']({
    'margin-left': (_0x9ca2x3['left'] - _0x9ca2x4['left']) + 'px'
  })['show']()
}
function show_roll_Tx(_0x9ca2x2) {
  var _0x9ca2x3 = _0x9ca2x2['offset']();
  var _0x9ca2x4 = $('#resultTX')['offset']();
  $('#showTx')['html'](_0x9ca2x2['attr']('data-title'))['css']({
    'margin-left': (_0x9ca2x3['left'] - _0x9ca2x4['left']) + 'px'
  })['show']()
}


