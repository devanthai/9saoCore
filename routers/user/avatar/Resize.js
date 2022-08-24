const resizeImg = require('resize-image-buffer');
var fs = require('fs');

const path = require('path');

class Resizeavatar {
    constructor(folder) {
        this.folder = folder;
    }
    async save(buffer, filename) {

        const filepath = this.filepath(filename);
        // console.log(filepath)

        const image = await resizeImg(buffer, {
            width: 300,
            height: 300,
          });
         
          fs.writeFileSync(filepath, image);
        

        // await sharp(buffer)
        //     .resize(300, 300)
        //     .toFile(filepath).then(data => { })
        //     .catch(err => { console.log(err) });

        return filename;
    }
    filepath(filename) {
        return path.resolve(`${this.folder}/${filename}`)
    }
}
module.exports = Resizeavatar;