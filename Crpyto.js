const crypto = require('crypto');
let iv = new Buffer.from([32, 77, "b2", 25, "0d", 24, 72, 78, 57, 86, 44, "aa", "f7", 43, "b9", "7c"]) 
let key = '12345678123456781953567812345678';

const encrypt = (text) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted
};

const decrypt = (hash) => {
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(hash, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted
};

module.exports = {
    encrypt,
    decrypt
};