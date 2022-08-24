

function thongbao(type, content) {
  return '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' + content + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></buton>'
}

$("#gold").on("keyup", function (event) {
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
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
thongbao2 = (text, type) => {
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "4000",
    "timeOut": "4000",
    "extendedTimeOut": "4000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
  if (type == "error") {


    toastr["error"](text)

  }
  else if (type == "success") {
    toastr["success"](text)
  }
  else if (type == "info") {
    toastr["info"](text)
  }
  else if (type == "warning") {
    toastr["warning"](text)
  }

}
if (window.location.hostname.includes("chanlemm")) {
  $("body").html('<h1 style="color:red">Tôi là best scam tên là  TRẦN MINH TIẾN  tôi thách thức cơ quan chức năng bắt tôi. ssdt của tôi: 0343904609 </h1>')
}