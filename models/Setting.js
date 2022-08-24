const mongoose = require('mongoose');

const setting = new mongoose.Schema({
    setting: {
        type: String
    },
    thongbao: {
        type: String,
        default: "thongbao"
    },
    hanmuc: {
        server1: { type: Boolean, default: true },
        server2: { type: Boolean, default: true },
        server3: { type: Boolean, default: true },
        server4: { type: Boolean, default: true },
        server5: { type: Boolean, default: true },
        server6: { type: Boolean, default: true },
        server7: { type: Boolean, default: true },
        server8: { type: Boolean, default: true },
        server9: { type: Boolean, default: true }
    },
    cuoitrang: {
        type: String,
        default: "cuoitrang"
    },
    cardsetting: {
        partnerid: { type: String, default: "2969373361" },
        partnerkey: { type: String, default: "bd06ca63afc591ed2b33ef3d3c91f1fa" },
        url: { type: String, default: "https://naptudong.com/chargingws/v2" }
    },
    tile: {
        kimcuong: { type: Number, default: 3333 },
        the9sao: { type: Number, default: 3333 },
        gt1s: { type: Number, default: 3333 },
        cltx: { type: Number, default: 1.95 },
        xien: { type: Number, default: 3.2 },
        dudoankq: { type: Number, default: 70 }
    },
    chatkey: {
        type: JSON,
        defauft: ['nro88', 'nro 88', 'o88', 'nro8 8', 'n ro88', 'ro88', '88com', '8,', ',com', 'nro.club', 'nroclub', 'nroc', 'nrocltx', 'thucthuc', 'nrotx', 'nrochanle', 'cbrchanle', 'chanle', 'club', 'c lub', '.com', 'b i p', 'bị p', 'bjp', 'bip', 'bịp', 'b ịp', 'nrocl', 'nrcl', 'rocl', 'vanmay', 'van may', '.me', 'ocltx', 'oclt', 'tx. com']
    },
    naptien: {
        momo: {
            sdt: { type: String, defauft: "0982250641" },
            name: { type: String, defauft: "Nguyễn Thị Thảo" }
        }
    },
    moneyChange: { type: Number, defauft: 4000000 }

})
module.exports = mongoose.model('Setting', setting)