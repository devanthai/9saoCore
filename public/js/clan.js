let viewUser = (name) => {
  $.ajax({
    url: "/user/clan/viewUser",
    type: "post",
    data: { name: name },
    success: function (res) {
      const data = res
      if (data.error) {
        $("#ptAlertThongBao_Title").html(data.message);
        $("#ptAlertThongBao_Div").show();
      }
      else {

        console.log(res)

        if ($('#alertInfoPt').length === 0) {
          $("#alertMain").append('<div class="alertInfo" id="alertInfoPt" style=""></div>')
        }



        let message = '<div class="alertInfoContent" style="padding-top: 5px;">' +
          '<div class="" style="float: left;position: absolute;">' +
          '<img src="' + (data.data.avatar == "none" ? "/images/avatar/aaaa.png" : data.data.avatar) + '" alt="9sao.me Chẵn lẻ tài xỉu uy tín" style="margin-left: 5px;width:50px; height: 50px; display: inline-block">' +
          '</div>' +
          ' <div style="text-align: center;">' +
          '<p style="margin: 0px; font-weight: bold; color: #501c04">' + name + '</p>' +
          '<small style="color: blue"></small>' +
          ' </div>' +
          '<hr class="mt-2 mb-2">' +
          '<div>' +
          '</p>' +
          '<p style="font-weight: bold; color: green; text-align: center; margin-bottom: 0px;">Thành tích: ' +
          numberWithCommas(data.data.thanhtich) + '</p>' +
          '<p style="text-align: center;">' +
          'Ngày tham gia: ' + data.data.time +
          '</p>' +
          '</div>' +
          '</div>'
          ;


        if (data.role.myrole == 1) //bang chu
        {
          if (data.role.userrole == 2) //thang kia la pho bang
          {
            message += '<div id="alertBtnThamGia" style="padding: 5px 5px;">' +

              '<div style="float: left;">' +
              '<button class="ptAlertBtn" style="padding-bottom: 3px; margin-left: 5px;" onclick="phobang(\'' + data.data.uid + '\',\'huypho\')">Hủy<br>Phó Bang</button></div>' +
              '<button class="ptAlertBtn" style="height:54px;padding-bottom: 3px; margin-left: 5px;" onclick="$(this).parent().parent().hide();">Đóng</button>' +
              '</div>'
          }
          else if (data.role.userrole == 1) //thang kia la bang chu ==
          {
            message += '<div id="alertBtnThamGia" style="padding: 5px 5px;">' +
              '<div style="float: left;">' +
              '<button class="ptAlertBtn" style="height:54px;padding-bottom: 3px; margin-left: 5px;" onclick="$(this).parent().parent().hide();">Đóng</button>' +
              '</div>'
          }
          else {
            message += '<div id="alertBtnThamGia" style="padding: 5px 5px;">' +
              '<div style="float: left;">' +
              '<button class="ptAlertBtn" style="padding-bottom: 3px; margin-left: 5px;" onclick="phobang(\'' + data.data.uid + '\',\'phongpho\')">Phong<br>Phó</button></div>' +
              '<button class="ptAlertBtn" style="height:54px;padding-bottom: 3px; margin-left: 5px;" onclick="kickMember(\'' + name + '\')">Đuổi</button>' +
              '<button class="ptAlertBtn" style="height:54px;padding-bottom: 3px; margin-left: 5px;" onclick="$(this).parent().parent().hide();">Đóng</button>' +
              '</div>'
          }

        }
        else if (data.role == 2) {
          message += '<div id="alertBtnThamGia" style="padding: 5px 5px;">' +

            '<div style="float: left;">' +
            '<button class="ptAlertBtn" style="padding-bottom: 3px; margin-left: 5px;" onclick="ptMember(\'' + data.data.id + '\')">Thành<br>Viên</button></div>' +
            '<button class="ptAlertBtn" style="height:54px;padding-bottom: 3px; margin-left: 5px;" onclick="$(this).parent().parent().hide();">Đóng</button>' +
            '</div>'
        }
        else {

        }



        $("#alertInfoPt").html(message);
        $("#alertInfoPt").show();
      }
    }
  });
}


let phobang = (uid, type) => {
  $.ajax({
    url: "/user/clan/phobang",
    type: "post",
    data: { uid, type },
    success: function (res) {
      $("#alertInfoPt").hide();
      $("#ptAlertThongBao_Title").html(res.message);
      $("#ptAlertThongBao_Div").show();
      showIndex('viewMember');
    }
  });
}


function showModalBangHoi() {


  $.ajax({
    url: "/user/clan",
    type: "get",
    success: function (res) {
      var json = (res);
      for (var i = 0; i < json.data.length; i += 2) {
        $("#" + json.data[i]).html(json.data[i + 1]);
      }
      $("#modalBangHoi").modal("show");
      if (json.count) {
        countMess = json.count;

        $("#messageCount").html('');
      }
      $("#messageCount").html('');
    }
  });

}
function ptThamGia(id) {
  $.ajax({
    url: "/user/join",
    type: "post",
    dataType: "text",
    data: { id: id },
    success: function (res) {
      var json = JSON.parse(res);
      $("#alertInfoPt").hide();

      $("#ptAlertThongBao_Title").html(json.message);
      $("#ptAlertThongBao_Div").show();
    }
  });
}

function showInfoPt(id) {

  $.ajax({
    url: "/user/showclan",
    type: "post",
    data: { id: id },
    success: function (res) {
      var json = (res);
      $(json.id).html(json.message);
      $(json.id).show();
    }
  });
}

function ptMember(id) {
  $("#alertInfoPt").hide();
  $.ajax({
    url: "/user/viewmember",
    type: "post",
    data: { id: id },
    success: function (res) {
      var json = (res);
      for (var i = 0; i < json.data.length; i += 2) {
        $("#" + json.data[i]).html(json.data[i + 1]);
      }
    }
  });
}

function timbang_submit() {

  $("#ptAlertTimBang").hide();
  $.ajax({
    url: "/user/timbang",
    type: "post",
    data: { keyword: $("#ptAlertInput_TimBang").val() },
    success: function (res) {
      var json = (res);
      for (var i = 0; i < json.data.length; i += 2) {
        $("#" + json.data[i]).html(json.data[i + 1]);
      }
      $("#ptAlertInput_TimBang").val("");
    }
  });
}

function taobang_submit() {

  $("#ptAlertTaoBang").hide();
  $.ajax({
    url: "/user/taobang",
    type: "post",
    data: { type: ptTaoBangType, name: $("#ptAlertInput_TaoBang").val() },
    success: function (res) {
      var json = (res);
      if (json.status == 0) {
        $("#ptAlertThongBao_Title").html(json.message);
        $("#ptAlertThongBao_Div").show();
      } else {
        for (var i = 0; i < json.data.length; i += 2) {
          $("#" + json.data[i]).html(json.data[i + 1]);
        }
      }
    }
  });
}

function showTaoBang() {
  $.ajax({
    url: "/user/viewtaobang",
    type: "get",
    data: {},
    success: function (res) {
      var json = (res);
      for (var i = 0; i < json.data.length; i += 2) {
        $("#" + json.data[i]).html(json.data[i + 1]);
      }
      $("#ptAlertLapBang").show();
    }
  });
}


var kickmember = "";

function confirmKickMember() {
  $("#ptAlertKickMember").hide();
  $.ajax({
    url: "/user/kickmember",
    type: "post",
    data: { name: kickmember },
    success: function (res) {
      var json = (res);
      if (json.status == 0) {
        $("#ptAlertThongBao_Title").html(json.message);
        $("#ptAlertThongBao_Div").show();
      } else {
        for (var i = 0; i < json.data.length; i += 2) {
          $("#" + json.data[i]).html(json.data[i + 1]);
        }
      }
    }
  });
}

function kickMember(name) {
  $("#alertInfoPt").hide();

  kickmember = name;
  $("#ptAlertKickMemberName").html(name);
  $("#ptAlertKickMember").css("top", ($("#banghoiContent").scrollTop() + 130) + "px");
  $("#ptAlertKickMember").show();
}

function ptOut() {
  $.ajax({
    url: "/user/outpt",
    type: "post",
    success: function (res) {
      var json = (res);
      $("#ptAlertRoiBang").hide();
      if (json.status == 0) {
        $("#ptAlertThongBao_Title").html(json.message);
        $("#ptAlertThongBao_Div").show();
      } else {
        for (var i = 0; i < json.data.length; i += 2) {
          $("#" + json.data[i]).html(json.data[i + 1]);
        }
      }
    }
  });
}

function ptAcceptMember(id) {
  $.ajax({
    url: "/user/chapnhan",
    type: "post",
    data: { id: id },
    success: function (res) {
      var json = (res);
      if (json.status == 0) {
        $("#ptAlertThongBao_Title").html(json.message);
        $("#ptAlertThongBao_Div").show();
      } else {
        for (var i = 0; i < json.data.length; i += 2) {
          $("#" + json.data[i]).html(json.data[i + 1]);
        }
      }
      if (json.count) {
        countMess = json.count;

        $("#messageCount").html('');
      }
    }
  });
}

function submitKhauHieu() {

  $("#ptAlertChatBang").hide();
  $.ajax({
    url: "/user/khauhieu",
    type: "post",
    data: { khauhieu: $("#ptAlertInputKhauHieu").val() },
    success: function (res) {
      var json = (res);
      if (json.status == 0) {
        $("#ptAlertThongBao_Title").html(json.message);
        $("#ptAlertThongBao_Div").show();
      } else {
        $("#ptAlertInputKhauHieu").val("");

        for (var i = 0; i < json.data.length; i += 2) {
          $("#" + json.data[i]).html(json.data[i + 1]);
        }


      }
      if (json.count) {
        countMess = json.count;

        $("#messageCount").html('');
      }
    }
  });
}


function showIndex(action) {
  $.ajax({
    url: "/user/showindex",
    type: "post",
    data: { action: action },
    success: function (res) {
      var json = (res);
      for (var i = 0; i < json.data.length; i += 2) {
        $("#" + json.data[i]).html(json.data[i + 1]);
      }
      if (json.count) {
        countMess = json.count;

        $("#messageCount").html('');
      }
    }
  });
}

function chatBang() {
  var dataPost = "message=" + $("#ptAlertChatBangInput").val();
  $("#ptAlertChatBang").hide();
  $.ajax({
    url: "/user/chatbang",
    type: "post",
    data: dataPost,
    success: function (res) {
      var json = (res);
      if (json.status == 0) {
        $("#ptAlertThongBao_Title").html(json.message);
        $("#ptAlertThongBao_Div").show();
      } else {
        $("#ptAlertChatBangInput").val("");
        for (var i = 0; i < json.data.length; i += 2) {
          $("#" + json.data[i]).html(json.data[i + 1]);
        }
      }
      if (json.count) {
        countMess = json.count;

        $("#messageCount").html('');
      }
    }
  });
} 