
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
                    if(json.count)
                    {
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
      data: {id:id},
      success: function(res) {
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
      data: {id:id},
      success: function(res) {
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
      data: {id:id},
      success: function(res) {
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
      data: {keyword:$("#ptAlertInput_TimBang").val()},
      success: function(res) {
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
      data: {type:ptTaoBangType,name:$("#ptAlertInput_TaoBang").val()},
      success: function(res) {
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
      success: function(res) {
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
        data: {name: kickmember},
        success: function(res) {
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
      kickmember = name;
      $("#ptAlertKickMemberName").html(name);
      $("#ptAlertKickMember").css("top", ($("#banghoiContent").scrollTop() + 130) + "px");
      $("#ptAlertKickMember").show();
    }

    function ptOut() {
      $.ajax({
        url: "/user/outpt",
        type: "post",
        success: function(res) {
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
        data: {id:id},
        success: function(res) {
          var json = (res);
          if (json.status == 0) {
            $("#ptAlertThongBao_Title").html(json.message);
            $("#ptAlertThongBao_Div").show();
          } else {
            for (var i = 0; i < json.data.length; i += 2) {
              $("#" + json.data[i]).html(json.data[i + 1]);
            }
          }
          if(json.count)
                    {
                    countMess = json.count;
                
                    $("#messageCount").html('');
                    }
        }
      });
    }

    function submitKhauHieu () {
    
      $("#ptAlertChatBang").hide();
      $.ajax({
        url: "/user/khauhieu",
        type: "post",
        data: {khauhieu:$("#ptAlertInputKhauHieu").val()},
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
          if(json.count)
                    {
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
        data:{action:action},
        success: function(res) {
          var json = (res);
          for (var i = 0; i < json.data.length; i += 2) {
            $("#" + json.data[i]).html(json.data[i + 1]);
          }
          if(json.count)
                    {
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
        success: function(res) {
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
          if(json.count)
                    {
                    countMess = json.count;
                
                    $("#messageCount").html('');
                    }
        }
      });
    } 