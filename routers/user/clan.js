const router = require('express').Router()
const Clan = require('../../models/Clan');
const User = require('../../models/User');
const Cuoc = require('../../models/Cuoc');

const { getMessageClanRedis, addMessageClanRedis, deleteMessIdRedis, getMess } = require("../../controller/ChatClanRedisManager")

const UserControl = require('../../controller/user');

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function formatNumber(number) {

    var text = "";
    var text2 = "";
    if (number >= 1000000000) {
        text2 = " tỷ";
        var num = (number % (1000000000 / 100000000));
        number = (number / 1000000000);
        number = Math.round(number * 1000) / 1000
        text = number;

        text += text2;

    }
    else {
        text = numberWithCommas(Math.round(number));
    }
    return text;
}
router.get('/clan', async (req, res) => {
    try {
        if (!req.user.isLogin) {
            return res.send({ status: 0, message: "Vui lòng đăng nhập" });
        }
        if (req.user.clan != 0) {

            const findClan = await Clan.find({}).sort({ thanhtich: -1, time: 1 });
            var index = findClan.findIndex(clannn => clannn._id.toString() === req.user.clan.id.toString()) + 1;
            const myclan = await Clan.findOne({ _id: req.user.clan.id })

            var admin = 0;
            if (req.user._id.toString() == myclan.uid.toString()) {
                admin = 1;
            }

            //const chats = await Chatclan.find({ uidclan: req.user.clan.id }).sort({ time: -1 }).limit(15)
            const chats = await getMessageClanRedis(req.user.clan.id)
            var chat = "";
            if (chats.mess) {
                chats.mess.forEach(item => {
                    if (item.type == 0) {
                        if (item.admin == 1) {
                            chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red;">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                        }
                        else {
                            chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="' + (item.admin == 2 ? 'color: green;' : '#635f5f') + '">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                        }
                    }
                    else if (item.type == 1) {
                        if (admin == 1) {
                            chat += '<div class="ptItem"> <div class="row" style="margin: 0;"><div class="col-10" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName">' + item.name + ' (' + formatNumber(item.sodu) + '$)' + '</p><small class="ptScrenText" style="color: blue">Xin vào</small></div><div class="col-2" style="padding: 0"><button class="ptItemBtn" onclick="ptAcceptMember(\'' + item._id + '\')">Nhận</button></div></div></div>'
                        }
                        else {
                            chat += '<div class="ptItem"> <div class="row" style="margin: 0;"><div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName">' + item.name + ' (' + formatNumber(item.sodu) + '$)' + '</p><small class="ptScrenText" style="color: blue">Xin vào</small></div><div class="col-4 text-right" style="padding: 0"> ' + timeSince(item.time) + ' </div></div></div>'
                        }
                    }
                    else if (item.type == 2 || item.type == 3) {
                        chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red;">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                    }
                    else if (item.type == 4) {
                        chat += '<div class="ptItem"><div class="row" style="margin: 0;"><div class="col-8" style="padding-left: 5px; padding-right: 0px;"> <p class="ptScreenName" style="color: rgb(46, 43, 38);">' + item.name + ' <small>(' + formatNumber(item.sodu) + '$)</small>' + '</p><small class="ptScrenText" style="color: red;">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                    }
                })

                data = [
                    "ptList",
                    chat
                ]
            }
            var data = [
                "ptInfo"
                , "\r\n       <div class=\"col\" style=\"margin-left: 7px;\">\r\n       <p class=\"ptName\" style=\"text-align: left; color: red\"><span id=\"ptInfoName\">Tên bang hội</span></p>\r\n       <div style=\"text-align: left;\">\r\n         <small><span id=\"ptInfoPC\">admin</span></small>\r\n       </div>\r\n     </div>\r\n     <div class=\"col\" style=\"margin-right: 27px;\">\r\n       <p class=\"ptName\" style=\"text-align: right; color: red\">Rank: <span id=\"ptInfoRank\">1</span></p>\r\n       <div style=\"text-align: right;\">\r\n         <small>Thành tích: <span id=\"ptInfoPoint\"></span></small>\r\n       </div>\r\n     </div>\r\n     <div style=\"position: absolute; right: 20px; top: -2px;\">\r\n       <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n         <span aria-hidden=\" true\">&times;</span>\r\n       </button>\r\n     </div>\r\n     "
                , "ptTitle"
                , "Tin nhắn"
                , "ptInfoName"
                , myclan.name
                , "ptInfoPC"
                , myclan.khauhieu
                , "ptInfoRank"
                , index
                , "ptInfoPoint"
                , myclan.thanhtich == 0 ? "0 tỉ" : formatNumber(myclan.thanhtich)
                , "ptHeader"
                , "<button class=\"ptBtnHeader\" onclick=\"$('#ptAlertChatBang').show()\">Chat</br>bang</button>" + (admin == 1 ? "<button class=\"ptBtnHeader\" onclick=\"$('#ptAlertKhauHieu').show()\" style=\"margin-left: 5px\">Khẩu</br>hiệu</button>" : "") + "\r\n       <button  class=\"ptBtnHeader\" onclick=\"showIndex('viewMember');\">Thành</br> viên</button>"
                , "alertMain"
                , " <div class=\"ptAlert\" id=\"ptAlertKickMember\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\" style=\"padding-left: 5px; padding-right: 5px\">\r\n      <p>Bạn có chắc chắn muốn kick <span id=\"ptAlertKickMemberName\"></span> khỏi bang hội không?</p>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"confirmKickMember();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertRoiBang\"  style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Bạn có chắc chắn muốn rời bang không?</p>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"ptOut()\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertChatBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Nhập nội dung cần chat</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <input type=\"text\" class=\"ptAlertInput\" id=\"ptAlertChatBangInput\" placeholder=\"Nội dung chat\" autocomplete=\"off\">\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"chatBang();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertThongBao_Div\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p id=\"ptAlertThongBao_Title\"></p>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n    \r\n    <div class=\"ptAlert\" id=\"ptAlertKhauHieu\" style=\"display: none;\">\r\n      <div class=\"ptAlertTitle\">\r\n        <p>Nhập khẩu hiệu</p>\r\n      </div>\r\n      <div id=\"\">\r\n        <input type=\"text\" class=\"ptAlertInput\" placeholder=\"Nhập khẩu hiệu\" id=\"ptAlertInputKhauHieu\">\r\n      </div>\r\n      <div class=\"ptAlertFooter\">\r\n        <button class=\"ptAlertBtn\" onclick=\"submitKhauHieu()\">OK</button>\r\n        <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n      </div>\r\n    </div>\r\n    "
                , "viewModalJs"
                , ""
                , "ptList"
                , chat
            ]

            //const getcount = await Chatclan.countDocuments({ uidclan: req.user.clan.id })
            res.send({ data: data, count: chats.countMess });
        }
        else {
            const showclan = await Clan.find({}).sort({ time: -1 }).limit(8)
            const checkUserClan = await User.find({ "clan": { "$ne": 0 } })
            // console.log(checkUserClan)
            var strclan = "";
            showclan.forEach(element => {
                var countMem = checkUserClan.filter(x => x.clan.id == element._id.toString()).length
                strclan += '<div class="ptItem" onclick="showInfoPt(\'' + element._id + '\'); "><div class="row" style="margin: 0;"><div class="ptIcon col-2"><img src="images/clan/' + element.type + '.png" alt="" style="width:50px; height: 50px; display: inline-block"> </div><div class="col"> <p class="ptName">' + element.name + '</p><small class="ptPoint">' + element.khauhieu + '</small> </div><div class="col-2" style="margin-right: 5px;">(' + countMem + '/25)</div></div></div>'
            })
            const js = '';
            var data = [
                "ptHeader",
                "<button class=\"ptBtnHeader\" onclick=\"$('#ptAlertTimBang').show()\">Tìm</br>\r\n         bang</button>\r\n       <button class=\"ptBtnHeader\" onclick=\"showTaoBang();\">Lập</br>\r\n         bang</button>",
                "ptTitle",
                "Danh sách bang",
                "ptInfo",
                "\r\n           <div style=\"position: absolute; right: 20px; top: -2px;\">\r\n             <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n               <span aria-hidden=\" true\">&times;</span>\r\n             </button>\r\n           </div>\r\n           ",
                "alertMain",
                "<div class=\"ptAlert\" id=\"ptAlertLapBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Chọn biểu tượng bang hội</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <div class=\"ptItemBieuTuong;\" id=\"ptItemBieuTuong\" class=\"text-center\">\r\n      </div>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"$('#ptAlertTaoBang').show(); $(this).parent().parent().hide();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertTimBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Nhập tên bang hội cần tìm</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <input type=\"text\" class=\"ptAlertInput\" placeholder=\"Tên bang\" id=\"ptAlertInput_TimBang\" autocomplete=\"off\">\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"timbang_submit()\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertTaoBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Nhập tên bang hội cần tạo</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <input type=\"text\" class=\"ptAlertInput\" placeholder=\"Tên bang\" id=\"ptAlertInput_TaoBang\" autocomplete=\"off\">\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"taobang_submit();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertThongBao_Div\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p id=\"ptAlertThongBao_Title\"></p>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"alertInfo\" id=\"alertInfoPt\" style=\"display: none;\">\r\n    </div>",
                "viewModalJs",
                js,
                "ptList",
                strclan
            ]
            res.send({ data: data });
        }
    }
    catch
    {
        return res.send({ status: 0, message: "Lỗi không xác định" });
    }

})
router.get('/createclan', (req, res) => {

    var data = [
        "ptItemBieuTuong",
        "<div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/1.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"1\">5,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/2.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"2\">25,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/3.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"3\">50,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/4.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"4\">100,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/5.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"5\">100,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/6.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"6\">100,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/7.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"7\">200,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/8.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"8\">200,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/9.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"9\">200,000,000 vàng</p>\r\n            </div>\r\n          </div>",
        "taobangJs",
        "<script>\r\n                  var ptTaoBangType = 1;\r\n"
    ]
    res.send({ data: data });
})
router.post('/timbang', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({ status: 0, message: "Vui lòng đăng nhập" });
    }
    const keyword = req.body.keyword;
    const showclan = await Clan.find({ name: { $regex: keyword, $options: "i" } }).sort({ thanhtich: -1 }).limit(8)
    if (showclan) {
        //  console.log(showclan)
        const checkUserClan = await User.find({ "clan": { "$ne": 0 } })
        if (checkUserClan) {
            // console.log(checkUserClan)
            var strclan = "";
            showclan.forEach(element => {
                var countMem = checkUserClan.filter(x => x.clan.id == element._id.toString()).length
                strclan += '<div class="ptItem" onclick="showInfoPt(\'' + element._id + '\'); "><div class="row" style="margin: 0;"><div class="ptIcon col-2"><img src="images/clan/' + element.type + '.png" alt="" style="width:50px; height: 50px; display: inline-block"> </div><div class="col"> <p class="ptName">' + element.name + '</p><small class="ptPoint">' + element.khauhieu + '</small> </div><div class="col-2" style="margin-right: 5px;">(' + countMem + '/25)</div></div></div>'
            })
            const js = '';
            var data = [
                "ptHeader",
                "<button class=\"ptBtnHeader\" onclick=\"$('#ptAlertTimBang').show()\">Tìm</br>\r\n         bang</button>\r\n       <button class=\"ptBtnHeader\" onclick=\"showTaoBang();\">Lập</br>\r\n         bang</button>",
                "ptTitle",
                "Danh sách bang",
                "ptInfo",
                "\r\n           <div style=\"position: absolute; right: 20px; top: -2px;\">\r\n             <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n               <span aria-hidden=\" true\">&times;</span>\r\n             </button>\r\n           </div>\r\n           ",
                "alertMain",
                "<div class=\"ptAlert\" id=\"ptAlertLapBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Chọn biểu tượng bang hội</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <div class=\"ptItemBieuTuong;\" id=\"ptItemBieuTuong\" class=\"text-center\">\r\n      </div>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"$('#ptAlertTaoBang').show(); $(this).parent().parent().hide();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertTimBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Nhập tên bang hội cần tìm</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <input type=\"text\" class=\"ptAlertInput\" placeholder=\"Tên bang\" id=\"ptAlertInput_TimBang\" autocomplete=\"off\">\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"timbang_submit()\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertTaoBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Nhập tên bang hội cần tạo</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <input type=\"text\" class=\"ptAlertInput\" placeholder=\"Tên bang\" id=\"ptAlertInput_TaoBang\" autocomplete=\"off\">\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"taobang_submit();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertThongBao_Div\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p id=\"ptAlertThongBao_Title\"></p>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"alertInfo\" id=\"alertInfoPt\" style=\"display: none;\">\r\n    </div>",
                "viewModalJs",
                js,
                "ptList",
                strclan
            ]
            res.send({ data: data });
        }
    }
})
router.post('/showclan', async (req, res) => {
    const id = req.body.id;
    if (!req.user.isLogin) {
        return res.send({ status: 0, message: "Vui lòng đăng nhập" });
    }

    try {


        const getClan = await Clan.findOne({ _id: id });
        if (getClan) {

            const getMember = await User.find({ 'clan.id': id });
            if (getMember) {
                var index = getMember.findIndex(pc => pc._id.toString() === getClan.uid.toString());
                if (getMember[index].tenhienthi == undefined) {
                    return res.send({ id: "#alertInfoPt", message: "loii" })
                }
                const event = new Date(getClan.time).toLocaleDateString()
                const newDate = event.replace(/(\d+[/])(\d+[/])/, '$2$1');

                const message = '<div class="alertInfoContent" style="padding-top: 5px;">' +
                    '<div class="" style="float: left;position: absolute;">' +
                    '<img src="/images/clan/1.png" alt="9sao.me Chẵn lẻ tài xỉu uy tín" style="width:50px; height: 50px; display: inline-block">' +
                    '</div>' +
                    ' <div style="text-align: center;">' +
                    '<p style="margin: 0px; font-weight: bold; color: #501c04">' + getClan.name + '</p>' +
                    '<small style="color: blue"></small>' +
                    ' </div>' +
                    '<hr class="mt-2 mb-2">' +
                    '<div>' +
                    '<p style="font-weight: bold; color: red; text-align: center; margin-bottom: 0px;">Bang chủ: ' + getMember[index].tenhienthi +
                    '</p>' +
                    '<p style="font-weight: bold; color: green; text-align: center; margin-bottom: 0px;">Thành tích: ' +
                    numberWithCommas(getClan.thanhtich) + '</p>' +
                    '<p style="text-align: center; margin-bottom: 0px;">Thành viên: ' + getMember.length + '/25</p>' +
                    '<p style="text-align: center;">' +
                    'Ngày thành lập: ' + newDate +
                    '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div id="alertBtnThamGia" style="padding: 5px 5px;">' +
                    '<div style="float: left;">' +
                    '<button class="ptAlertBtn" style="padding-bottom: 3px" onclick="ptThamGia(\'' + getClan._id + '\')">Tham<br>gia</button>' +
                    '</div>' +
                    '<div style="float: left;">' +
                    '<button class="ptAlertBtn" style="padding-bottom: 3px; margin-left: 5px;" onclick="ptMember(\'' + getClan._id + '\')">Thành<br>Viên</button></div>' +
                    '<button class="ptAlertBtn" style="height:54px;padding-bottom: 3px; margin-left: 5px;" onclick="$(this).parent().parent().hide();">Đóng</button>' +
                    '</div>';

                res.send({ id: "#alertInfoPt", message: message })
            }
        }

    } catch { res.send({ id: "#alertInfoPt", message: "Lỗi không xác định" }) }
})
router.get('/viewtaobang', (req, res) => {
    var data = ["ptItemBieuTuong",
        "<div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/1.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"1\">5,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/2.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"2\">25,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/3.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"3\">50,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/4.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"4\">100,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/5.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"5\">100,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/6.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"6\">100,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/7.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"7\">200,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/8.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"8\">200,000,000 vàng</p>\r\n            </div>\r\n          </div><div class=\"row\">\r\n            <div class=\"col-4\" style=\"padding: 0\">\r\n              <img src=\"/images/clan/9.png\" alt=\"\" style=\"width:50px; height: 50px; display: inline-block\">\r\n            </div>\r\n            <div class=\"col-8\" style=\"padding: 0\">\r\n              <p class=\"ptBieuTuongGold\" data-type=\"9\">200,000,000 vàng</p>\r\n            </div>\r\n          </div>",
        "taobangJs",
        "<script>\r\n                  var ptTaoBangType = 1;\r\n                  $(\".ptBieuTuongGold\").first().css(\"color\", \"red\");\r\n                    $(\".ptBieuTuongGold\").first().css(\"font-weight\", \"bold\");\r\n\r\n                    $(\".ptBieuTuongGold\").each(function(index) {\r\n                      $(this).click(function() {\r\n                        $(this).css(\"color\", \"red\");\r\n                        $(this).css(\"font-weight\", \"bold\");\r\n                        ptTaoBangType = $(this).attr(\"data-type\");\r\n                        $(\".ptBieuTuongGold\").each(function(i) {\r\n                          if (i != index) {\r\n                            $(this).css(\"color\", \"black\");\r\n                            $(this).css(\"font-weight\", \"normal\");\r\n                          }\r\n                        });\r\n\r\n                      });\r\n                    });</script>"
    ];
    res.send({ data: data });
})
router.post('/join', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({ status: 0, message: "Vui lòng đăng nhập" });
    }
    const clanid = req.body.id;
    var type = 1;
    if (req.user.clan != 0) {
        return res.send({ status: 0, message: "Bạn đã có bang" });
    }
    const user = await User.findById(req.user._id)
    if (user) {

        const getchats = await getMessageClanRedis(clanid)

        const check = getchats.mess.find(x => x.type == type && x.uidclan == clanid && x.name == user.tenhienthi)
        // console.log(check)
        //const check = await Chatclan.findOne({ type: type, uidclan: clanid, name: user.tenhienthi }).sort({ time: -1 })
        if (check) {
            if (timeSince(check.time).includes('giây')) {
                return res.send({ status: 0, message: "Vui lòng đợi 1 chút để xin vào pt này" });
            }
        }
        const checkUserClan = await User.find({ "clan": { "$ne": 0 } })
        var countMem = checkUserClan.filter(x => x.clan.id == clanid.toString()).length
        if (countMem >= 25) {
            return res.send({ status: 0, message: "Bang đã đủ thành viên" });
        }

        const messageR = getMess(req.user.name, type, 0, user.tenhienthi, user.vang, clanid)
        //{ _id: uuidv4(), noidung: req.user.name, type: type, admin: 0, name: user.tenhienthi, sodu: user.vang, uidclan: clanid, time: new Date().getTime() }

        await addMessageClanRedis(clanid, messageR)
        // const newChat = new Chatclan({ noidung: req.user.name, type: type, admin: 0, name: user.tenhienthi, sodu: user.vang, uidclan: clanid })
        // const chatnew = await newChat.save();
        // if (chatnew) {
        return res.json({ message: "Thành công !!! Đơn xin gia nhập đã được gửi tới bang chủ !!!", status: 1 })
        // }
    }
})
router.get('/test', async (req, res) => {
    const ccccc = await User.findOneAndUpdate({ _id: req.user._id }, { $inc: { 'clan.thanhtich': 10000 } })
    //console.log(ccccc)
    res.send("cc")
})
router.post('/viewmember', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({ status: 0, message: "Vui lòng đăng nhập" });
    }

    const id = req.body.id;
    const checkclan = await Clan.findById(id)
    if (checkclan) {
        const checkUserClan = await User.find({ "clan.id": id }).sort({ "clan.thanhtich": -1 })
        // console.log(checkUserClan)
        if (checkUserClan) {
            var clannz = "";
            checkUserClan.forEach(element => {

                //     console.log(element)
                if (element._id.toString() === checkclan.uid.toString()) {
                    clannz += '<div class="ptItem"><div class="row" style="margin: 0;"><div class="col-6" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red">' + element.tenhienthi + '</p><small class="ptScrenText">Thành tích: ' + formatNumber(element.clan.thanhtich) + (element.clan.thanhtichngay != undefined ? " - Ngày: " + formatNumber(element.clan.thanhtichngay) : "") + '</small></div><div class="col-6 text-right" style="padding-right: 5px; padding-left: 0px"><small style="color: red">Số dư: ' + numberWithCommas(Math.round(element.vang)) + '</small><br><small class="ptScrenText">Tham gia: ' + element.clan.time + '</small></div></div></div>';
                }
                else {
                    clannz += '<div class="ptItem"><div class="row" style="margin: 0;"><div class="col-6" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: green">' + element.tenhienthi + '</p><small class="ptScrenText">Thành tích: ' + formatNumber(element.clan.thanhtich) + (element.clan.thanhtichngay != undefined ? " - Ngày: " + formatNumber(element.clan.thanhtichngay) : "") + '</small></div><div class="col-6 text-right" style="padding-right: 5px; padding-left: 0px"><small style="color: green">Số dư: ' + numberWithCommas(Math.round(element.vang)) + '</small><br><small class="ptScrenText">Tham gia: ' + element.clan.time + '</small></div></div></div>';

                }
                //var countMem = checkUserClan.filter(x => x.clan.id == element._id.toString()).length

            })

            const data = [
                "ptTitle",
                "Thành viên",
                "ptList",
                clannz,
                "ptHeader",
                "<button class=\"ptBtnHeader\" onclick=\"$('#ptAlertTimBang').show()\">Tìm</br>\r\n  bang</button>\r\n<button class=\"ptBtnHeader\" onclick=\"showTaoBang();\">Lập</br>\r\n  bang</button>"
            ]
            res.send({ data: data })
        }
    }
})
router.post('/taobang', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({ status: 0, message: "Vui lòng đăng nhập" });
    }
    var name = req.body.name;
    var type = req.body.type;
    if (isHTML(name)) {
        return res.send({ status: 0, message: "Bậy nha" });
    }
    if (req.sesstion)
        if (name == '' || (type != 1 && type != 2 && type != 3 && type != 4 && type != 5 && type != 6 && type != 7 && type != 8 && type != 9)) {
            return res.send({ status: 0, message: "Vui lòng nhập đủ thông tin" });
        }
    if (name.length < 6 || name.length > 24) {
        return res.send({ status: 0, message: "Tên bang hội phải từ 6 tới 24 kí tự !!!" });
    }
    var goldCreate = 0;
    if (type == 1) goldCreate = 5000000;
    else if (type == 2) goldCreate = 25000000;
    else if (type == 3) goldCreate = 50000000;
    else if (type == 4) goldCreate = 100000000;
    else if (type == 5) goldCreate = 100000000;
    else if (type == 6) goldCreate = 100000000;
    else if (type == 7) goldCreate = 200000000;
    else if (type == 8) goldCreate = 200000000;
    else if (type == 9) goldCreate = 200000000;
    else {
        return res.send({ status: 0, message: "Vui lòng nhập đủ thông tin" });
    }
    const user = await User.findOne({ _id: req.user._id })


    if (user) {
        if (user.clan != 0) {
            return res.send({ status: 0, message: "Bạn đã có bang không thể tạo" });
        }
        else if (user.vang < goldCreate) {
            return res.send({ status: 0, message: "Bạn còn thiếu " + numberWithCommas(goldCreate - user.vang) + " vàng !!!" });
        }
        else {
            const upxuuu = await UserControl.upMoney(user._id, -goldCreate)
            await UserControl.sodu(user._id, "-" + numberWithCommas(goldCreate), "Tạo bang hội")
            if (upxuuu) {
                const newClan = new Clan({ name: name, khauhieu: "", uid: req.user._id, type: type })
                try {
                    const newClanz = await newClan.save()
                    const findClan = await Clan.find({}).sort({ thanhtich: -1, time: 1 });
                    var index = findClan.findIndex(clannn => clannn._id.toString() === newClanz._id.toString()) + 1;
                    const event = new Date().toLocaleDateString()
                    const newDate = event.replace(/(\d+[/])(\d+[/])/, '$2$1');
                    const USup = await User.findByIdAndUpdate(user._id, { clan: { id: newClanz._id.toString(), time: newDate, thanhtich: 0 } })
                    if (USup) {
                        const data = ["ptInfo"
                            , "\r\n       <div class=\"col\" style=\"margin-left: 7px;\">\r\n       <p class=\"ptName\" style=\"text-align: left; color: red\"><span id=\"ptInfoName\">Tên bang hội</span></p>\r\n       <div style=\"text-align: left;\">\r\n         <small><span id=\"ptInfoPC\">admin</span></small>\r\n       </div>\r\n     </div>\r\n     <div class=\"col\" style=\"margin-right: 27px;\">\r\n       <p class=\"ptName\" style=\"text-align: right; color: red\">Rank: <span id=\"ptInfoRank\">1</span></p>\r\n       <div style=\"text-align: right;\">\r\n         <small>Thành tích: <span id=\"ptInfoPoint\"></span></small>\r\n       </div>\r\n     </div>\r\n     <div style=\"position: absolute; right: 20px; top: -2px;\">\r\n       <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n         <span aria-hidden=\" true\">&times;</span>\r\n       </button>\r\n     </div>\r\n     "
                            , "ptTitle"
                            , "Tin nhắn"
                            , "ptInfoName"
                            , name
                            , "ptInfoPC"
                            , ""
                            , "ptInfoRank"
                            , index
                            , "ptInfoPoint"
                            , "0 tỉ"
                            , "ptHeader"
                            , "<button class=\"ptBtnHeader\" onclick=\"$('#ptAlertChatBang').show()\">Chat</br>bang</button><button class=\"ptBtnHeader\" onclick=\"$('#ptAlertKhauHieu').show()\" style=\"margin-left: 5px\">Khẩu</br>hiệu</button>\r\n       <button class=\"ptBtnHeader\" onclick=\"showIndex('viewMember');\">Thành</br> viên</button>"
                            , "alertMain"
                            , " <div class=\"ptAlert\" id=\"ptAlertKickMember\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\" style=\"padding-left: 5px; padding-right: 5px\">\r\n      <p>Bạn có chắc chắn muốn kick <span id=\"ptAlertKickMemberName\"></span> khỏi bang hội không?</p>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"confirmKickMember();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertRoiBang\"  style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Bạn có chắc chắn muốn rời bang không?</p>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"ptOut()\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertChatBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Nhập nội dung cần chat</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <input type=\"text\" class=\"ptAlertInput\" id=\"ptAlertChatBangInput\" placeholder=\"Nội dung chat\" autocomplete=\"off\">\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"chatBang();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertThongBao_Div\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p id=\"ptAlertThongBao_Title\"></p>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n    \r\n    <div class=\"ptAlert\" id=\"ptAlertKhauHieu\" style=\"display: none;\">\r\n      <div class=\"ptAlertTitle\">\r\n        <p>Nhập khẩu hiệu</p>\r\n      </div>\r\n      <div id=\"\">\r\n        <input type=\"text\" class=\"ptAlertInput\" placeholder=\"Nhập khẩu hiệu\" id=\"ptAlertInputKhauHieu\">\r\n      </div>\r\n      <div class=\"ptAlertFooter\">\r\n        <button class=\"ptAlertBtn\" onclick=\"submitKhauHieu()\">OK</button>\r\n        <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n      </div>\r\n    </div>\r\n    "
                            , "viewModalJs"
                            , ""
                            , "ptList"
                            , ""
                        ]
                        res.send({ data: data, status: 1 })
                    }
                }
                catch
                {
                    return res.send({ status: 0, message: "Lỗi không xác định vui lòng thử lại" });
                }
            }
        }
    }
    else {
        return res.send({ status: 0, message: "Lỗi không xác định vui lòng thử lại" });
    }




})
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " năm";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " tháng";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " ngày";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " tiếng";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " phút";
    }
    return Math.floor(seconds) + " giây";
}


var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
router.post('/chatbang', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({ status: 0, message: "Vui lòng đăng nhập" });
    }

    const message = req.body.message;
    if (isHTML(message)) {
        return res.send({ status: 0, message: "Bậy nha" });
    }
    const idClan = req.user.clan.id
    if (req.user.clan == 0) {
        return res.send({ status: 0, message: "Ko có bang mà đòi gì" });
    }
    if (message.length > 50) {
        return res.send({ status: 0, message: "Nội dung chat quá dài" });
    }
    const checkclan = await Clan.findById(idClan)
    if (checkclan) {
        let type = 0;
        let admin = 0;
        if (checkclan.uid.toString() == req.user._id.toString()) {
            admin = 1;
        }
        if (req.user.clan.role == 2) {
            admin = 2;
        }
        const user = await User.findById(req.user._id)
        if (user) {




            const messageR = getMess(message, type, admin, user.tenhienthi, user.vang, idClan)
            // { _id: uuidv4(), noidung: message, type: type, admin: admin, name: user.tenhienthi, sodu: user.vang, uidclan: idClan, time: new Date().getTime() }
            // const newChat = new Chatclan(message)
            // const chatnew = await newChat.save();
            //   console.log(messageR)

            const chats = await addMessageClanRedis(idClan, messageR)


            // if (chatnew) {


            //const chats = await Chatclan.find({ uidclan: idClan }).sort({ time: -1 }).limit(15)//
            //const chats = await getMessageClanRedis(idClan)
            if (chats.mess) {
                var chat = "";

                chats.mess.forEach(item => {
                    if (item.type == 0) {
                        if (item.admin == 1) {
                            chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red;">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                        }
                        else {
                            chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: green;">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                        }
                    }
                    else if (item.type == 1) {
                        if (admin == 1) {
                            chat += '<div class="ptItem"> <div class="row" style="margin: 0;"><div class="col-10" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName">' + item.name + ' (' + formatNumber(item.sodu) + '$)' + '</p><small class="ptScrenText" style="color: blue">Xin vào</small></div><div class="col-2" style="padding: 0"><button class="ptItemBtn" onclick="ptAcceptMember(\'' + item._id + '\')">Nhận</button></div></div></div>'
                        }
                        else {
                            chat += '<div class="ptItem"> <div class="row" style="margin: 0;"><div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName">' + item.name + ' (' + formatNumber(item.sodu) + '$)' + '</p><small class="ptScrenText" style="color: blue">Xin vào</small></div><div class="col-4" style="padding: 0"> ' + timeSince(item.time) + ' </div></div></div>'
                        }
                    }
                    else if (item.type == 2 || item.type == 3) {
                        chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red;">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                    }
                    else if (item.type == 4) {
                        chat += '<div class="ptItem"><div class="row" style="margin: 0;"><div class="col-8" style="padding-left: 5px; padding-right: 0px;"> <p class="ptScreenName" style="color: rgb(46, 43, 38);">' + item.name + ' <small>(' + formatNumber(item.sodu) + '$)</small>' + '</p><small class="ptScrenText" style="color: red;">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                    }
                })

                data = [
                    "ptList",
                    chat
                ]
                // const getcount = await Chatclan.countDocuments({ uidclan: req.user.clan.id })
                res.send({ data: data, count: chats.countMess });
            }
            //}
        }
    }
})
router.post('/showindex', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({ status: 0, message: "Vui lòng đăng nhập" });
    }
    const action = req.body.action
    if (req.user.clan == 0) {
        return res.send({ status: 0, message: "Ko có bang mà đòi gì" });
    }
    if (action == 'viewMember') {
        const id = req.user.clan.id
        const checkclan = await Clan.findById(id)
        if (checkclan) {
            const checkUserClan = await User.find({ "clan.id": id }).sort({ "clan.thanhtich": -1 })
            // console.log(checkUserClan)
            if (checkUserClan) {
                var clannz = "";
                var admin = 0;
                if (req.user._id.toString() == checkclan.uid.toString()) {
                    admin = 1;
                }
                checkUserClan.forEach(element => {

                    //  console.log(element)

                    if (admin == 0) {

                        if (element._id.toString() === checkclan.uid.toString()) {
                            clannz += '<div class="ptItem"><div class="row" style="margin: 0;"><div class="col-6" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red">' + element.tenhienthi + '</p><small class="ptScrenText">Thành tích: ' + formatNumber(element.clan.thanhtich) + (element.clan.thanhtichngay != undefined ? " - Ngày: " + formatNumber(element.clan.thanhtichngay) : "") + '</small></div><div class="col-6 text-right" style="padding-right: 5px; padding-left: 0px"><small style="color: red">Số dư: ' + numberWithCommas(Math.round(element.vang)) + '</small><br><small class="ptScrenText">Tham gia: ' + element.clan.time + '</small></div></div></div>';
                        }
                        else {
                            clannz += '<div class="ptItem"><div class="row" style="margin: 0;"><div class="col-6" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="' + (element.clan.role==2 ? 'color: green;' : '#635f5f') + '">' + element.tenhienthi + '</p><small class="ptScrenText">Thành tích: ' + formatNumber(element.clan.thanhtich) + (element.clan.thanhtichngay != undefined ? " - Ngày: " + formatNumber(element.clan.thanhtichngay) : "") + '</small></div><div class="col-6 text-right" style="padding-right: 5px; padding-left: 0px"><small style="color: green">Số dư: ' + numberWithCommas(Math.round(element.vang)) + '</small><br><small class="ptScrenText">Tham gia: ' + element.clan.time + '</small></div></div></div>';

                        }
                    }
                    else if (admin == 1) {
                        if (element._id.toString() === checkclan.uid.toString()) {
                            clannz += '<div class="ptItem"><div class="row" style="margin: 0;"><div class="col-6" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red">' + element.tenhienthi + '</p><small class="ptScrenText">Thành tích: ' + formatNumber(element.clan.thanhtich) + (element.clan.thanhtichngay != undefined ? " - Ngày: " + formatNumber(element.clan.thanhtichngay) : "") + '</small></div><div class="col-6 text-right" style="padding-right: 5px; padding-left: 0px"><small style="color: red">Số dư: ' + numberWithCommas(Math.round(element.vang)) + '</small><br><small class="ptScrenText">Tham gia: ' + element.clan.time + '</small></div></div></div>';
                        }
                        else {
                            clannz += '<div class="ptItem" onclick="viewUser(\'' + element.tenhienthi + '\')"><div class="row" style="margin: 0;"><div class="col-6" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="' + (element.clan.role==2 ? 'color: green;' : '#635f5f') + '">' + element.tenhienthi + '</p><small class="ptScrenText">Thành tích: ' + formatNumber(element.clan.thanhtich) + (element.clan.thanhtichngay != undefined ? " - Ngày: " + formatNumber(element.clan.thanhtichngay) : "") + '</small></div><div class="col-6 text-right" style="padding-right: 5px; padding-left: 0px"><small style="color: green">Số dư: ' + numberWithCommas(Math.round(element.vang)) + '</small><br><small class="ptScrenText">Tham gia: ' + element.clan.time + '</small></div></div></div>';

                        }
                    }
                })
                const data = ["ptTitle"
                    , "Thành viên"
                    , "ptList"
                    , clannz
                    , "ptHeader"
                    , " <button class=\"ptBtnHeader\" onclick=\"showIndex('viewMessage')\">Tin</br>nhắn</button>\r\n  <button class=\"ptBtnHeader\" onclick=\"$('#ptAlertRoiBang').show();\">Rời</br>bang</button>"

                ]

                return res.send({ data: data })
            }
        }
    }
    else if (action == 'viewMessage') {

        //const chats = await Chatclan.find({ uidclan: req.user.clan.id }).sort({ time: -1 }).limit(15)
        const chats = await getMessageClanRedis(req.user.clan.id)


        var admin = 0;
        const checkclan = await Clan.findById(req.user.clan.id)
        if (req.user._id.toString() == checkclan.uid.toString()) {
            admin = 1;
        }

        var chat = "";
        if (chats.mess) {
            chats.mess.forEach(item => {
                if (item.type == 0) {
                    if (item.admin == 1) {
                        chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red;">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                    }
                    else {
                        chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="' + (item.admin==2 ? 'color: green;' : '#635f5f') + '">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                    }
                }
                else if (item.type == 1) {
                    if (admin == 1) {
                        chat += '<div class="ptItem"> <div class="row" style="margin: 0;"><div class="col-10" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName">' + item.name + ' (' + formatNumber(item.sodu) + '$)' + '</p><small class="ptScrenText" style="color: blue">Xin vào</small></div><div class="col-2" style="padding: 0"><button class="ptItemBtn" onclick="ptAcceptMember(\'' + item._id + '\')">Nhận</button></div></div></div>'
                    }
                    else {
                        chat += '<div class="ptItem"> <div class="row" style="margin: 0;"><div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName">' + item.name + ' (' + formatNumber(item.sodu) + '$)' + '</p><small class="ptScrenText" style="color: blue">Xin vào</small></div><div class="col-4 text-right" style="padding: 0"> ' + timeSince(item.time) + ' </div></div></div>'
                    }
                }
                else if (item.type == 2 || item.type == 3) {
                    chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red;">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                }
                else if (item.type == 4) {
                    chat += '<div class="ptItem"><div class="row" style="margin: 0;"><div class="col-8" style="padding-left: 5px; padding-right: 0px;"> <p class="ptScreenName" style="color: rgb(46, 43, 38);">' + item.name + ' <small>(' + formatNumber(item.sodu) + '$)</small>' + '</p><small class="ptScrenText" style="color: red;">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                }
            })


        }

        const data = ["ptTitle"
            , "Tin nhắn"
            , "ptList"
            , chat
            , "ptHeader"
            , "<button class=\"ptBtnHeader\" onclick=\"$('#ptAlertChatBang').show()\">Chat</br>bang</button>" + (admin == 1 ? "<button class=\"ptBtnHeader\" onclick=\"$('#ptAlertKhauHieu').show()\" style=\"margin-left: 5px\">Khẩu</br>hiệu</button>" : "") + "\r\n       <button  class=\"ptBtnHeader\" onclick=\"showIndex('viewMember');\">Thành</br> viên</button>"
        ]
        //  const getcount = await Chatclan.countDocuments({ uidclan: req.user.clan.id })

        return res.send({ data: data, count: chats.countMess })
    }

})

router.post("/clan/phobang", async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({ error: true, message: "Vui lòng đăng nhập" });
    }
    if (req.user.clan == 0) {
        return res.send({ error: true, message: "Bạn không có bang" });
    }

    const { uid, type } = req.body
    if (type != "phongpho" && type != "huypho") {
        return res.send({ error: true, message: "Lỗi" });
    }
    let checkUser = await User.findById(uid)
    if (checkUser) {
        const findClan = await Clan.findById(req.user.clan.id)
        if (findClan) {
            if (req.user._id.toString() != findClan.uid.toString()) {
                return res.send({ error: true, message: "Bạn không có quyền" });
            }
            else {

                if (checkUser.clan.role == 2 && type == "phongpho") {
                    return res.send({ error: true, message: "Thành viên này đã là phó bang" });
                }
                else if ((!checkUser.clan.role || checkUser.clan.role == 0) && type == "huypho") {
                    return res.send({ error: true, message: "Thành viên này không phải phó bang" });
                }
                else {
                    if (type == "phongpho") await User.findByIdAndUpdate(checkUser._id, { 'clan.role': 2 })
                    if (type == "huypho") await User.findByIdAndUpdate(checkUser._id, { 'clan.role': 0 })
                    return res.send({ error: false, message: "Đã " + (type == "phongpho" ? "phong" : "hủy") + " phó bang cho " + checkUser.tenhienthi });
                }
            }
        }
        else {
            return res.send({ error: true, message: "Không tìm thấy bang này" });
        }
    }
    else {
        return res.send({ error: true, message: "Không tìm thấy thành viên này" });
    }
})

router.post("/clan/viewUser", async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({ status: 0, message: "Vui lòng đăng nhập" });
    }
    const { name } = req.body
    let checkUser = await User.findOne({ tenhienthi: name })
    if (checkUser) {
        if (checkUser.clan == 0) {
            return res.send({ error: true, data: null, message: "Thành viên này không có bang" })
        }
        let myrole = 0
        let userrole = 0
        //1: admin
        //2: pho bang
        const clan = await Clan.findById(req.user.clan.id)
        if (req.user._id.toString() == clan.uid.toString()) {
            myrole = 1
        }
        else if (req.user.clan.role == 2) {
            myrole = 2
        }

        if (checkUser._id.toString() == clan.uid.toString()) {
            userrole = 1
        }
        else if (checkUser.clan.role == 2) {
            userrole = 2
        }

        checkUser.clan.avatar = checkUser.avatar
        checkUser.clan.uid = checkUser._id
        return res.send({ error: false, data: checkUser.clan, role: { myrole: myrole, userrole: userrole } })
    }
    else {
        return res.send({ error: true, data: null, message: "Không tìm thấy thành viên này" })
    }
})

router.post('/chapnhan', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({ status: 0, message: "Vui lòng đăng nhập" });
    }
    const id = req.body.id




    // const findMess = await Chatclan.findOne({ _id: id })
    const chatsz = await getMessageClanRedis(req.user.clan.id)
    const findMess = chatsz.mess.find(x => x._id == id)
    if (findMess) {
        const checkUserrr = await User.findOne({ tenhienthi: findMess.name })
        if (req.user.clan == 0) {
            return res.send({ status: 0, message: "Ko có bang mà đòi gì" });
        }
        if (checkUserrr.clan != 0) {
            return res.send({ status: 0, message: "Thành viên này đang ở bang khác" });
        }
        const checkUserClan = await User.find({ "clan": { "$ne": 0 } })
        var countMem = checkUserClan.filter(x => x.clan.id == req.user.clan.id.toString()).length
        if (countMem >= 25) {
            return res.send({ status: 0, message: "Bang đã đủ thành viên" });
        }
        const clannnnnn = await Clan.findOne({ _id: req.user.clan.id })
        if (req.user._id.toString() != clannnnnn.uid.toString()) {
            return res.send({ status: 0, message: "Mày không đủ quyền" });

        }
        var admin = 1;

        const event = new Date().toLocaleDateString()
        const newDate = event.replace(/(\d+[/])(\d+[/])/, '$2$1');
        const USup = await User.findOneAndUpdate({ tenhienthi: findMess.name }, { clan: { id: findMess.uidclan.toString(), time: newDate, thanhtich: 0 } })
        if (USup) {

            var chat = "";
            const user = await User.findOne({ _id: req.user._id })
            if (user) {

                await deleteMessIdRedis(user.clan.id, id)

                //console.log(user.clan.id)
                // const newChat = new Chatclan({ noidung: "Chấp nhận " + findMess.name + " vào bang", type: 3, admin: 1, name: user.tenhienthi, sodu: user.vang, uidclan: user.clan.id })
                // const chatnew = await newChat.save();

                const messJ = getMess("Chấp nhận " + findMess.name + " vào bang", 3, 1, user.tenhienthi, user.vang, user.clan.id)
                const chats = await addMessageClanRedis(user.clan.id, messJ)

                // const deleteChat = await Chatclan.deleteMany({ name: findMess.name, type: 1 })

                //if (chatnew) {
                // const chats = await Chatclan.find({ uidclan: user.clan.id }).sort({ time: -1 }).limit(15)
                if (chats.mess) {
                    chats.mess.forEach(item => {
                        if (item.type == 0) {
                            if (item.admin == 1) {
                                chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red;">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                            }
                            else {
                                chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: green;">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                            }
                        }
                        else if (item.type == 1) {
                            if (admin == 1) {
                                chat += '<div class="ptItem"> <div class="row" style="margin: 0;"><div class="col-10" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName">' + item.name + ' (' + formatNumber(item.sodu) + '$)' + '</p><small class="ptScrenText" style="color: blue">Xin vào</small></div><div class="col-2" style="padding: 0"><button class="ptItemBtn" onclick="ptAcceptMember(\'' + item._id + '\')">Nhận</button></div></div></div>'
                            }
                            else {
                                chat += '<div class="ptItem"> <div class="row" style="margin: 0;"><div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName">' + item.name + ' (' + formatNumber(item.sodu) + '$)' + '</p><small class="ptScrenText" style="color: blue">Xin vào</small></div><div class="col-4 text-right" style="padding: 0"> ' + timeSince(item.time) + ' </div></div></div>'
                            }
                        }
                        else if (item.type == 2 || item.type == 3) {
                            chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red;">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                        }
                        else if (item.type == 4) {
                            chat += '<div class="ptItem"><div class="row" style="margin: 0;"><div class="col-8" style="padding-left: 5px; padding-right: 0px;"> <p class="ptScreenName" style="color: rgb(46, 43, 38);">' + item.name + ' <small>(' + formatNumber(item.sodu) + '$)</small>' + '</p><small class="ptScrenText" style="color: red;">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                        }
                    })
                    var data = ['ptList', chat]
                    //const getcount = await Chatclan.countDocuments({ uidclan: req.user.clan.id })
                    res.send({ data: data, count: chats.countMess });
                }
                // }
            }
        }

    }

})
router.post('/khauhieu', async (req, res) => {
    const khauhieu = req.body.khauhieu
    if (!req.user.isLogin) {
        return res.send({ status: 0, message: "Vui lòng đăng nhập" });
    }
    if (isHTML(khauhieu)) {
        return res.send({ status: 0, message: "Bậy nha" });
    }
    if ((khauhieu.length > 50)) {
        return res.send({ status: 0, message: "Quá dài" });
    }
    if (req.user.clan == 0) {
        return res.send({ status: 0, message: "Bạn không có bang" });
    }
    const findClan = await Clan.findById(req.user.clan.id)
    if (findClan) {
        if (req.user._id.toString() != findClan.uid.toString()) {
            return res.send({ status: 0, message: "Bạn không có quyền" });
        }
        else {
            const upInfo = await Clan.findByIdAndUpdate(req.user.clan.id, { khauhieu: khauhieu })
            if (upInfo) {
                const findClanz = await Clan.find({}).sort({ thanhtich: -1, time: 1 });
                var index = findClanz.findIndex(clannn => clannn._id.toString() === req.user.clan.id.toString()) + 1;
                const myclan = await Clan.findOne({ _id: req.user.clan.id })

                var admin = 0;
                if (req.user._id.toString() == myclan.uid.toString()) {
                    admin = 1;
                }

                //const chats = await Chatclan.find({ uidclan: req.user.clan.id }).sort({ time: -1 }).limit(15)

                const chats = await getMessageClanRedis(req.user.clan.id)

                var chat = "";
                if (chats.mess) {
                    chats.mess.forEach(item => {
                        if (item.type == 0) {
                            if (item.admin == 1) {
                                chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red;">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                            }
                            else {
                                chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: green;">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                            }
                        }
                        else if (item.type == 1) {
                            if (admin == 1) {
                                chat += '<div class="ptItem"> <div class="row" style="margin: 0;"><div class="col-10" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName">' + item.name + ' (' + formatNumber(item.sodu) + '$)' + '</p><small class="ptScrenText" style="color: blue">Xin vào</small></div><div class="col-2" style="padding: 0"><button class="ptItemBtn" onclick="ptAcceptMember(\'' + item._id + '\')">Nhận</button></div></div></div>'
                            }
                            else {
                                chat += '<div class="ptItem"> <div class="row" style="margin: 0;"><div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName">' + item.name + ' (' + formatNumber(item.sodu) + '$)' + '</p><small class="ptScrenText" style="color: blue">Xin vào</small></div><div class="col-4 text-right" style="padding: 0"> ' + timeSince(item.time) + ' </div></div></div>'
                            }
                        }
                        else if (item.type == 2 || item.type == 3) {
                            chat += '<div class="ptItem"> <div class="row" style="margin: 0;"> <div class="col-8" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red;">' + item.name + ' <small>(Số dư: ' + formatNumber(item.sodu) + ')</small></p><small class="ptScrenText">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                        }
                        else if (item.type == 4) {
                            chat += '<div class="ptItem"><div class="row" style="margin: 0;"><div class="col-8" style="padding-left: 5px; padding-right: 0px;"> <p class="ptScreenName" style="color: rgb(46, 43, 38);">' + item.name + ' <small>(' + formatNumber(item.sodu) + '$)</small>' + '</p><small class="ptScrenText" style="color: red;">' + item.noidung + '</small></div><div class="col-4 text-right" style="padding-right: 5px; padding-left: 5px">' + timeSince(item.time) + '</div></div></div>'
                        }
                    })

                    data = [
                        "ptList",
                        chat
                    ]
                }
                var data = [
                    "ptInfo"
                    , "\r\n       <div class=\"col\" style=\"margin-left: 7px;\">\r\n       <p class=\"ptName\" style=\"text-align: left; color: red\"><span id=\"ptInfoName\">Tên bang hội</span></p>\r\n       <div style=\"text-align: left;\">\r\n         <small><span id=\"ptInfoPC\">admin</span></small>\r\n       </div>\r\n     </div>\r\n     <div class=\"col\" style=\"margin-right: 27px;\">\r\n       <p class=\"ptName\" style=\"text-align: right; color: red\">Rank: <span id=\"ptInfoRank\">1</span></p>\r\n       <div style=\"text-align: right;\">\r\n         <small>Thành tích: <span id=\"ptInfoPoint\"></span></small>\r\n       </div>\r\n     </div>\r\n     <div style=\"position: absolute; right: 20px; top: -2px;\">\r\n       <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n         <span aria-hidden=\" true\">&times;</span>\r\n       </button>\r\n     </div>\r\n     "
                    , "ptTitle"
                    , "Tin nhắn"
                    , "ptInfoName"
                    , myclan.name
                    , "ptInfoPC"
                    , myclan.khauhieu
                    , "ptInfoRank"
                    , index
                    , "ptInfoPoint"
                    , myclan.thanhtich == 0 ? "0 tỉ" : formatNumber(myclan.thanhtich)
                    , "ptHeader"
                    , "<button class=\"ptBtnHeader\" onclick=\"$('#ptAlertChatBang').show()\">Chat</br>bang</button>" + (admin == 1 ? "<button class=\"ptBtnHeader\" onclick=\"$('#ptAlertKhauHieu').show()\" style=\"margin-left: 5px\">Khẩu</br>hiệu</button>" : "") + "\r\n       <button  class=\"ptBtnHeader\" onclick=\"showIndex('viewMember');\">Thành</br> viên</button>"
                    , "alertMain"
                    , " <div class=\"ptAlert\" id=\"ptAlertKickMember\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\" style=\"padding-left: 5px; padding-right: 5px\">\r\n      <p>Bạn có chắc chắn muốn kick <span id=\"ptAlertKickMemberName\"></span> khỏi bang hội không?</p>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"confirmKickMember();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertRoiBang\"  style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Bạn có chắc chắn muốn rời bang không?</p>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"ptOut()\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertChatBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Nhập nội dung cần chat</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <input type=\"text\" class=\"ptAlertInput\" id=\"ptAlertChatBangInput\" placeholder=\"Nội dung chat\" autocomplete=\"off\">\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"chatBang();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertThongBao_Div\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p id=\"ptAlertThongBao_Title\"></p>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n    \r\n    <div class=\"ptAlert\" id=\"ptAlertKhauHieu\" style=\"display: none;\">\r\n      <div class=\"ptAlertTitle\">\r\n        <p>Nhập khẩu hiệu</p>\r\n      </div>\r\n      <div id=\"\">\r\n        <input type=\"text\" class=\"ptAlertInput\" placeholder=\"Nhập khẩu hiệu\" id=\"ptAlertInputKhauHieu\">\r\n      </div>\r\n      <div class=\"ptAlertFooter\">\r\n        <button class=\"ptAlertBtn\" onclick=\"submitKhauHieu()\">OK</button>\r\n        <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n      </div>\r\n    </div>\r\n    "
                    , "viewModalJs"
                    , ""
                    , "ptList"
                    , chat
                ]
                // const getcount = await Chatclan.countDocuments({ uidclan: req.user.clan.id })
                res.send({ data: data, count: chats.countMess });
            }
        }
    }
})
router.post('/kickmember', async (req, res) => {
    try {


        var name = req.body.name;
        if (!req.user.isLogin) {
            return res.send({ status: 0, message: "Vui lòng đăng nhập" });
        }
        if (req.user.clan == 0) {
            return res.send({ status: 0, message: "Bạn không có bang" });
        }
        const findClan = await Clan.findById(req.user.clan.id)
        if (findClan) {
            if (req.user._id.toString() != findClan.uid.toString()) {
                return res.send({ status: 0, message: "Bạn không có quyền" });
            }
            else if (req.user.name == name) {
                return res.send({ status: 0, message: "Không thể kick chính mình" });
            }
            else {
                const checkUser = await User.findOne({ tenhienthi: name })
                if (checkUser.clan.id.toString() != findClan._id.toString()) {
                    return res.send({ status: 0, message: "Không thể kick bang người ta :))" });
                }

                try {
                    const userChar = await User.findOne({ tenhienthi: name })
                    if (userChar) {
                        const us = await Clan.findOneAndUpdate({ _id: req.user.clan.id }, { $inc: { thanhtich: -userChar.clan.thanhtichngay } })
                    }
                }
                catch { }



                const kick = await User.findOneAndUpdate({ tenhienthi: name }, { clan: 0 })


                const user = await User.findById(req.user._id)
                if (kick && user) {
                    // const newChat = new Chatclan({ noidung: "Đã kick " + name + " ra khỏi bang hội", type: 2, admin: 1, name: user.tenhienthi, sodu: user.vang, uidclan: user.clan.id })
                    // const chatnew = await newChat.save();


                    const chats = await addMessageClanRedis(user.clan.id, getMess("Đã kick " + name + " ra khỏi bang hội", 2, 1, user.tenhienthi, user.vang, user.clan.id))

                    // if (chatnew) {
                    const id = req.user.clan.id
                    const checkclan = await Clan.findById(id)
                    if (checkclan) {
                        const checkUserClan = await User.find({ "clan.id": id }).sort({ "clan.thanhtich": -1 })
                        // console.log(checkUserClan)
                        if (checkUserClan) {
                            var clannz = "";
                            var admin = 0;
                            if (req.user._id.toString() == checkclan.uid.toString()) {
                                admin = 1;
                            }
                            checkUserClan.forEach(element => {

                                //  console.log(element)
                                if (admin == 0) {


                                    if (element._id.toString() === checkclan.uid.toString()) {
                                        clannz += '<div class="ptItem"><div class="row" style="margin: 0;"><div class="col-6" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red">' + element.tenhienthi + '</p><small class="ptScrenText">Thành tích: ' + formatNumber(element.clan.thanhtich) + (element.clan.thanhtichngay != undefined ? " - Ngày: " + formatNumber(element.clan.thanhtichngay) : "") + '</small></div><div class="col-6 text-right" style="padding-right: 5px; padding-left: 0px"><small style="color: red">Số dư: ' + numberWithCommas(element.vang) + '</small><br><small class="ptScrenText">Tham gia: ' + element.clan.time + '</small></div></div></div>';
                                    }
                                    else {
                                        clannz += '<div class="ptItem"><div class="row" style="margin: 0;"><div class="col-6" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: green">' + element.tenhienthi + '</p><small class="ptScrenText">Thành tích: ' + formatNumber(element.clan.thanhtich) + (element.clan.thanhtichngay != undefined ? " - Ngày: " + formatNumber(element.clan.thanhtichngay) : "") + '</small></div><div class="col-6 text-right" style="padding-right: 5px; padding-left: 0px"><small style="color: green">Số dư: ' + numberWithCommas(element.vang) + '</small><br><small class="ptScrenText">Tham gia: ' + element.clan.time + '</small></div></div></div>';

                                    }
                                }
                                else if (admin == 1) {
                                    if (element._id.toString() === checkclan.uid.toString()) {
                                        clannz += '<div class="ptItem"><div class="row" style="margin: 0;"><div class="col-6" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: red">' + element.tenhienthi + '</p><small class="ptScrenText">Thành tích: ' + formatNumber(element.clan.thanhtich) + '</small></div><div class="col-6 text-right" style="padding-right: 5px; padding-left: 0px"><small style="color: red">Số dư: ' + numberWithCommas(element.vang) + '</small><br><small class="ptScrenText">Tham gia: ' + element.clan.time + '</small></div></div></div>';
                                    }
                                    else {
                                        clannz += '<div class="ptItem" onclick="kickMember(\'' + element.tenhienthi + '\')"><div class="row" style="margin: 0;"><div class="col-6" style="padding-left: 5px; padding-right: 0px;"><p class="ptScreenName" style="color: green">' + element.tenhienthi + '</p><small class="ptScrenText">Thành tích: ' + formatNumber(element.clan.thanhtich) + (element.clan.thanhtichngay != undefined ? " - Ngày: " + formatNumber(element.clan.thanhtichngay) : "") + '</small></div><div class="col-6 text-right" style="padding-right: 5px; padding-left: 0px"><small style="color: green">Số dư: ' + numberWithCommas(element.vang) + '</small><br><small class="ptScrenText">Tham gia: ' + element.clan.time + '</small></div></div></div>';

                                    }
                                }
                            })
                            const data = [

                                "ptList"
                                , clannz

                            ]

                            return res.send({ data: data, status: 1 })
                        }
                    }
                    //  }
                }
            }
        }
    } catch {

        return res.send({ status: 0, message: "Đã có lỗi xảy ra vui lòng thử lại" });

    }
})
router.post('/outpt', async (req, res) => {
    const myclanid = req.user.clan.id
    if (!req.user.isLogin) {
        return res.send({ status: 0, message: "Vui lòng đăng nhập" });
    }
    var cuocs = await Cuoc.findOne({ uid: req.user._id, status: -1 })

    if (cuocs) {
        return res.send({ status: 0, message: "Không thể rời bang khi đang cược" });
    }
    if (req.user.clan == 0) {
        return res.send({ status: 0, message: "Bạn không có bang" });
    }
    const findClan = await Clan.findById(myclanid)
    if (findClan) {
        if (req.user._id.toString() == findClan.uid.toString()) {
            const findMem = await User.updateMany({ "clan.id": myclanid }, { clan: 0 })
            const delept = await Clan.findByIdAndDelete(myclanid)
            const showclan = await Clan.find({}).sort({ time: -1 }).limit(8)

            const checkUserClan = await User.find({ "clan": { "$ne": 0 } })
            // console.log(checkUserClan)
            var strclan = "";
            showclan.forEach(element => {
                var countMem = checkUserClan.filter(x => x.clan.id == element._id.toString()).length
                strclan += '<div class="ptItem" onclick="showInfoPt(\'' + element._id + '\'); "><div class="row" style="margin: 0;"><div class="ptIcon col-2"><img src="images/clan/' + element.type + '.png" alt="" style="width:50px; height: 50px; display: inline-block"> </div><div class="col"> <p class="ptName">' + element.name + '</p><small class="ptPoint">' + element.khauhieu + '</small> </div><div class="col-2" style="margin-right: 5px;">(' + countMem + '/25)</div></div></div>'
            })
            const js = '';
            var data = [
                "ptHeader",
                "<button class=\"ptBtnHeader\" onclick=\"$('#ptAlertTimBang').show()\">Tìm</br>\r\n         bang</button>\r\n       <button class=\"ptBtnHeader\" onclick=\"showTaoBang();\">Lập</br>\r\n         bang</button>",
                "ptTitle",
                "Danh sách bang",
                "ptInfo",
                "\r\n           <div style=\"position: absolute; right: 20px; top: -2px;\">\r\n             <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n               <span aria-hidden=\" true\">&times;</span>\r\n             </button>\r\n           </div>\r\n           ",
                "alertMain",
                "<div class=\"ptAlert\" id=\"ptAlertLapBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Chọn biểu tượng bang hội</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <div class=\"ptItemBieuTuong;\" id=\"ptItemBieuTuong\" class=\"text-center\">\r\n      </div>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"$('#ptAlertTaoBang').show(); $(this).parent().parent().hide();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertTimBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Nhập tên bang hội cần tìm</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <input type=\"text\" class=\"ptAlertInput\" placeholder=\"Tên bang\" id=\"ptAlertInput_TimBang\" autocomplete=\"off\">\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"timbang_submit()\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertTaoBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Nhập tên bang hội cần tạo</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <input type=\"text\" class=\"ptAlertInput\" placeholder=\"Tên bang\" id=\"ptAlertInput_TaoBang\" autocomplete=\"off\">\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"taobang_submit();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertThongBao_Div\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p id=\"ptAlertThongBao_Title\"></p>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"alertInfo\" id=\"alertInfoPt\" style=\"display: none;\">\r\n    </div>",
                "viewModalJs",
                js,
                "ptList",
                strclan
            ]
            res.send({ data: data });
        }
        else {
            const user = await User.findById(req.user._id)
            //     const newChat = new Chatclan({ noidung: user.tenhienthi + " đã rời bang", type: 4, admin: 0, name: user.tenhienthi, sodu: user.vang, uidclan: user.clan.id })


            const chats = await addMessageClanRedis(user.clan.id, getMess(user.tenhienthi + " đã rời bang", 4, 0, user.tenhienthi, user.vang, user.clan.id))

            const outpt = await User.findByIdAndUpdate(req.user._id, { clan: 0 })
            const showclan = await Clan.find({}).sort({ time: -1 }).limit(8)
            const checkUserClan = await User.find({ "clan": { "$ne": 0 } })
            //   const chatnew = await newChat.save();

            var strclan = "";
            showclan.forEach(element => {
                var countMem = checkUserClan.filter(x => x.clan.id == element._id.toString()).length
                strclan += '<div class="ptItem" onclick="showInfoPt(\'' + element._id + '\'); "><div class="row" style="margin: 0;"><div class="ptIcon col-2"><img src="images/clan/' + element.type + '.png" alt="" style="width:50px; height: 50px; display: inline-block"> </div><div class="col"> <p class="ptName">' + element.name + '</p><small class="ptPoint">' + element.khauhieu + '</small> </div><div class="col-2" style="margin-right: 5px;">(' + countMem + '/25)</div></div></div>'
            })
            const js = '';
            var data = [
                "ptHeader",
                "<button class=\"ptBtnHeader\" onclick=\"$('#ptAlertTimBang').show()\">Tìm</br>\r\n         bang</button>\r\n       <button class=\"ptBtnHeader\" onclick=\"showTaoBang();\">Lập</br>\r\n         bang</button>",
                "ptTitle",
                "Danh sách bang",
                "ptInfo",
                "\r\n           <div style=\"position: absolute; right: 20px; top: -2px;\">\r\n             <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n               <span aria-hidden=\" true\">&times;</span>\r\n             </button>\r\n           </div>\r\n           ",
                "alertMain",
                "<div class=\"ptAlert\" id=\"ptAlertLapBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Chọn biểu tượng bang hội</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <div class=\"ptItemBieuTuong;\" id=\"ptItemBieuTuong\" class=\"text-center\">\r\n      </div>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"$('#ptAlertTaoBang').show(); $(this).parent().parent().hide();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertTimBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Nhập tên bang hội cần tìm</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <input type=\"text\" class=\"ptAlertInput\" placeholder=\"Tên bang\" id=\"ptAlertInput_TimBang\" autocomplete=\"off\">\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"timbang_submit()\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertTaoBang\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p>Nhập tên bang hội cần tạo</p>\r\n    </div>\r\n    <div id=\"\">\r\n      <input type=\"text\" class=\"ptAlertInput\" placeholder=\"Tên bang\" id=\"ptAlertInput_TaoBang\" autocomplete=\"off\">\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"taobang_submit();\">OK</button>\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"ptAlert\" id=\"ptAlertThongBao_Div\" style=\"display: none;\">\r\n    <div class=\"ptAlertTitle\">\r\n      <p id=\"ptAlertThongBao_Title\"></p>\r\n    </div>\r\n    <div class=\"ptAlertFooter\">\r\n      <button class=\"ptAlertBtn\" onclick=\"$(this).parent().parent().hide();\">Đóng</button>\r\n    </div>\r\n    </div>\r\n\r\n    <div class=\"alertInfo\" id=\"alertInfoPt\" style=\"display: none;\">\r\n    </div>",
                "viewModalJs",
                js,
                "ptList",
                strclan
            ]
            res.send({ data: data });
        }
    }
})
module.exports = router