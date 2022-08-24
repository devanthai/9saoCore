const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/thaiDb", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }, () => console.log('Connected to db'));
const fs = require('fs');

const Momo = require('./models/Momo')

auto = async () => {
    var ccc = await Momo.aggregate([
        {
            $group: {
                _id: {
                    "sdt": "$sdt"
                   
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "sdt": "$_id.sdt"
            }
        }
    ])
    var content = '';


	ccc.forEach((item)=>{
		//console.log(item.sdtchuyen)
		content+=item.sdt+"\n"
	})
	console.log(ccc.length)

	try {
	  fs.writeFileSync('./test.txt', content);
	   
	} catch (err) {
	  console.error(err);
	}

}
auto()
