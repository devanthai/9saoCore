const router = require('express').Router()
const Napvang = require('../models/Napvang')
const Napthoi = require('../models/Napthoi')
const BotGold = require('../models/BotGold')

const Botthoi = require('../models/Botthoi')

// router.get('/addnewbottest', async (req, res) => {
//     new Botnap({ map: "Nhà Thái", server: 1, khu: 99, tnv: "Thái Lê Văn", sovang: 9999999999, taikhoan: "cc@cc.com" }).save()
//     new Botthoi({ map: "Nhà Thái", server: 1, khu: 999, tnv: "Thái Lê Văn", sothoi: 99, taikhoan: "cc@cc.com" }).save()
//     res.send("cc")
// })
router.get('/napvang', async (req, res) => {
    var page = "pages/user/napvang";
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    const getNapvang = await Napvang.find({ uid: req.user._id }).sort({ 'time': -1 });
    const getBotnap = await BotGold.find({ Server: req.user.server, TypeBot: 1, Status: { $ne: -1 } })
    res.render("index", { page: page, data: req.user, lsnap: getNapvang, getBotnap: getBotnap });
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function getStatus(status) {

    return (status == 0 ? '<span class="badge badge-warning text-white">Chưa giao dịch</span>' : (status == 1 ? '<span class="badge badge-success text-white">Giao dịch thành công</span>' : '<span class="badge badge-danger text-white">Đã hủy</span>'))
}
router.post('/napvang', async (req, res) => {

    if (!req.user.isLogin) {
        return res.json({ error: 1, message: "<strong>Thất bại: </strong> Vui lòng đăng nhập" });
    }
    else if (req.body.remove) {

        const type = req.body.remove;
        if (type != 1 && type != 2) {
            return res.send({ error: 1, message: "Adu vip" });
        }
        // console.log(req.body.id)
        if (type == 1) {
            const getNapvang = await Napvang.findOneAndUpdate({ uid: req.user._id, _id: req.body.id, status: 0 }, { status: 2 }, { new: true });
            // console.log(getNapvang)
            if (getNapvang)
                return res.send('<tr><td hidden="">' + getNapvang._id + '</td><td>' + getNapvang.server + '</td><td>' + getNapvang.tnv + '</td><td>' + numberWithCommas(getNapvang.sovang) + '</td><td>' + getStatus(getNapvang.status) + '</td><td>' + new Date(Date.parse(getNapvang.time)).toLocaleString() + '</td><td></td></tr>')
        }
        else {
            const getNapvang = await Napthoi.findOneAndUpdate({ uid: req.user._id, _id: req.body.id, status: 0 }, { status: 2 }, { new: true });
            //    console.log(getNapvang)

            if (getNapvang)
                return res.send('<tr><td hidden="">' + getNapvang._id + '</td><td>' + getNapvang.server + '</td><td>' + getNapvang.tnv + '</td><td>' + numberWithCommas(getNapvang.sovang) + '</td><td>' + getStatus(getNapvang.status) + '</td><td>' + new Date(Date.parse(getNapvang.time)).toLocaleString() + '</td><td></td></tr>')

        }
    }

    else if (req.body.changetype) {
        const type = req.body.type;
        if (type != 1 && type != 2) {
            return res.json({ error: 1, message: "<strong>Thất bại: </strong>" })
        }
        if (type == 1) {

            const getNapvang = await Napvang.find({ uid: req.user._id });

            var tableLS = "";
            getNapvang.forEach(element => {
                tableLS = "<tr><td hidden=''>" + element._id + "</td><td>" + element.server + "</td>" +
                    "<td>" + element.tnv + "</td>" +
                    "<td>" + numberWithCommas(element.sovang) + "</td>" +
                    "<td>" + getStatus(element.status) + "</td>" +
                    "<td>" + new Date(Date.parse(element.time)).toLocaleString() + "</td>" +
                    "<td>" + (element.status == 0 ? '<i class="fas fa-trash-alt" onclick="return remove(this);"></i>' : '') + "</td></tr>" +
                    tableLS;
            });
            if (tableLS == "") {
                tableLS = '<tr><td colspan="7">Bạn chưa thực hiện giao dịch nào</td></tr>'
            }


            const getBotnapvang = await BotGold.find({ Server: req.user.server, TypeBot: 1, Status: { $ne: -1 } })

            var tablebot = "";
            getBotnapvang.forEach(element => {
                tablebot = "<tr><td>" + element.Server + "</td>" +
                    "<td>" + element.Name + "</td>" +
                    "<td>Vách núi kkr</td>" +
                    "<td>" + (element.Zone) + "</td>" +
                    "<td>" + numberWithCommas(element.Gold) + "</td>" +

                    "</tr>" + tablebot;
            });
            if (tablebot == "") {
                tablebot = '<tr><td colspan="5">Không tìm thấy bot</td></tr>'
            }
            tablebot += '<td colspan="5" style="font-size: 15px;"><span style="color: red;">Vui lòng kiễm tra kĩ đúng 100% tên nhân vật bot mới được giao dịch</span></td>'

            var cc = [
                'formLoad',
                '<div class="form-group"><label>Số vàng cần nạp</label> <input type="text" name="gold" id="gold" class="form-control" placeholder="Nhập số vàng cần nạp bằng số"></div>',
                'headerGold',
                'Số vàng',
                'headerGold2',
                'Số Vàng',
                'lichsugd',
                tableLS,
                'goldvitri',
                tablebot
            ]
            res.send({ data: cc, js: "" });
        }
        else {




            const getNapthoi = await Napthoi.find({ uid: req.user._id });
            var tableLS = "";


            getNapthoi.forEach(doc => {
                tableLS = "<tr><td hidden=''>" + doc._id + "</td><td>" + doc.server + "</td>" +
                    "<td>" + doc.tnv + "</td>" +
                    "<td>" + doc.sovang + "</td>" +
                    "<td>" + getStatus(doc.status) + "</td>" +
                    "<td>" + new Date(Date.parse(doc.time)).toLocaleString() + "</td>" +
                    "<td>" + (doc.status == 0 ? '<i class="fas fa-trash-alt" onclick="return remove(this);"></i>' : '') + "</td></tr>" +
                    tableLS;
            });
            if (tableLS == "") {
                tableLS = '<tr><td colspan="7">Bạn chưa thực hiện giao dịch nào</td></tr>'
            }



            const getBotnapvang = await Botthoi.find({ Server: req.user.server, TypeBot: 1, Status: { $ne: -1 } })
            var tablebot = "";
            getBotnapvang.forEach(element => {
                tablebot = "<tr><td>" + element.Server + "</td>" +
                    "<td>" + element.Name + "</td>" +
                    "<td>Vách núi kkr</td>" +
                    "<td>" + (element.Zone) + "</td>" +
                    "<td>" + numberWithCommas(element.Gold) + "</td>" +
                    "</tr>" + tablebot;
            });
            if (tablebot == "") {
                tablebot = '<tr><td colspan="5">Không tìm thấy bot</td></tr>'
            }
            tablebot += '<td colspan="5" style="font-size: 15px;"><span style="color: red;">Vui lòng kiễm tra kĩ đúng 100% tên nhân vật bot mới được giao dịch</span></td>'
            var cc = [
                "formLoad",
                "<div class=\"form-group\">\r\n    <label>Số thỏi cần nạp</label>\r\n    <input type=\"number\" name=\"golds\" id=\"golds\" class=\"form-control\" placeholder=\"Nhập số thỏi cần nạp bằng số\">\r\n    <small>thỏi vàng có giá trị 37tr vàng 1 thỏi</small>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label>Số vàng nhận được</label>\r\n      <input type=\"text\" name=\"gold\" id=\"gold\" class=\"form-control readonly\" style=\"color: red\" readonly>\r\n    </div>",
                "headerGold",
                "Số thỏi",
                'headerGold2',
                'Số Thỏi',
                "lichsugd",
                tableLS,
                "goldvitri",
                tablebot
            ]
            res.send({ data: cc, js: '<script>\r\n      var golds = $(\"#golds\");\r\n      golds.keyup(function(){\r\n        $(\"#gold\").val(formatNumber(golds.val() * 37000000));\r\n      });\r\n      \r\n      function formatNumber(number) {\r\n        var amount = number.toLocaleString(\"en-US\", {\r\n          style: \"currency\",\r\n          currency: \"USD\",\r\n        });\r\n        return amount.replace(\"$\", \"\").replace(\".00\", \"\");\r\n      }\r\n      </script>' })
        }
    }
    else if (req.body.add && req.body.type) {
        const vang = req.body.gold;
        const name = req.body.tnv;
        const type = req.body.type;
        if (type == 1) {
            const checkNapvang = await Napvang.countDocuments({ uid: req.user._id, status: 0 })
            if (checkNapvang > 0) {
                return res.json({ error: 1, message: "<strong>Thất bại: </strong> Vui lòng hủy đơn trước đó để tạo" });
            }
            else {
                var vang2 = Number(vang.replace(/,/g, ''))
                var nameee = name.toLowerCase().match(/([0-9]|[a-z]|[A-Z])/g);
                var namelow = name.toLowerCase();
                if (vang == "" || name == '') {
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Vui lòng nhập đầy đủ thông tin" });
                } else if (nameee.length != name.length) {
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Tên nhân vật không hợp lệ" });
                }
                else if (isNaN(vang2)) {
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Lỗi" });
                }
                else if (vang2 < 10000000) {
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Chỉ được nạp trên 10tr vàng" });
                }
                else if (vang2 > 500000000) {
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Chỉ được dưới 500tr vàng" });
                }
                else if (type != 1 && type != 2) {
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Lỗi" });
                }
                else {
                    const rutvangme = await Napvang.findOne({ tnv: namelow, status: 0 })
                    if (rutvangme) {
                        return res.json({ error: 1, message: "<strong>Thất bại: </strong> Vui lòng hủy đơn nạp của nhân vật này trước đó" });
                        // await Napvang.updateMany({ tnv: namelow, status: 0 }, { status: 2 })
                    }
                    else {
                        const addnapvang = new Napvang({ uid: req.user._id, server: req.user.server, sovang: vang2, tnv: name.toLowerCase(), taikhoan: req.user.name })
                        try {
                            const newnapvang = await addnapvang.save();
                            var table = "<tr><td hidden=''>" + newnapvang._id + "</td>" + '<td>' + newnapvang.server + '</td>' + '<td>' + newnapvang.tnv + '</td>' + '<td>' + numberWithCommas(newnapvang.sovang) + '</td>' + '<td>' + getStatus(newnapvang.status) + '</td>' + '<td>' + new Date(Date.parse(newnapvang.time)).toLocaleString() + '</td>' + '<td><i class="fas fa-trash-alt" onclick="return remove(this);"></i></td>' + '</tr>';

                            setTimeout(async () => {
                                const checkcc = await Napvang.findOne({ _id: newnapvang._id, status: 0 })
                                if (checkcc) {
                                    const nap = await Napvang.findOneAndUpdate({ _id: newnapvang._id, status: 0 }, { status: 2 })
                                }
                            }, 900000);

                            return res.json({ error: 0, message: "<strong>Thành công</strong> Bạn vui lòng tới địa điểm giao hàng gặp BOT để giao dịch", table: table });
                        } catch {
                            return res.json({ error: 1, message: "<strong>Thất bại: </strong> Lỗi" });
                        }
                    }
                }
            }
        }
        else if (type == 2) {
            const checkNapthoi = await Napthoi.countDocuments({ uid: req.user._id, status: 0 })
            if (checkNapthoi > 0) {
                return res.json({ error: 1, message: "<strong>Thất bại: </strong> Vui lòng hủy đơn trước đó để tạo" });
            }
            else {
                var vang2 = Number(vang.replace(/,/g, ''))
                var nameee = name.toLowerCase().match(/([0-9]|[a-z]|[A-Z])/g);
                var sothoi = vang2 / 37000000;
                if (vang == "" || name == '') {
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Vui lòng nhập đầy đủ thông tin" });
                }
                else if (nameee.length != name.length) {
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Tên nhân vật không hợp lệ" });
                }
                else if (isNaN(vang2)) {
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Lỗi" });
                }
                else if (sothoi > 99) {
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Thỏi vàng giao dịch tối đa là 99" });
                }
                else if (sothoi < 1) {
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Thỏi vàng giao dịch tối thiểu là 1" });
                }
                else if (type != 1 && type != 2) {
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Lỗi" });
                }
                else {
                    const addnapthoi = new Napthoi({ uid: req.user._id, server: req.user.server, sovang: sothoi, tnv: name, taikhoan: req.user.name })
                    try {
                        const newnapvang = await addnapthoi.save();
                        var table = "<tr><td hidden=''>" + newnapvang._id + "</td>" + '<td>' + newnapvang.server + '</td>' + '<td>' + newnapvang.tnv + '</td>' + '<td>' + numberWithCommas(newnapvang.sovang) + '</td>' + '<td>' + getStatus(newnapvang.status) + '</td>' + '<td>' + new Date(Date.parse(newnapvang.time)).toLocaleString() + '</td>' + '<td><i class="fas fa-trash-alt" onclick="return remove(this);"></i></td>' + '</tr>';
                        return res.json({ error: 0, message: "<strong>Thành công</strong> Bạn vui lòng tới địa điểm giao hàng gặp BOT để giao dịch", table: table });
                    } catch {
                        return res.json({ error: 1, message: "<strong>Thất bại: </strong> Lỗi" });
                    }
                }
            }
        }
    }
})
module.exports = router