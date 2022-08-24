const request = require('request');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');

module.exports = function TheSieuRe(Magd) {
    return new Promise(resolve => {
        try {
            const optionszz = {
                url: 'https://thesieure.com/account/login',
                method:"GET",
                header: {
                    'Cookie': 'PHPSESSID=igbo0ee6d245o8on4cv8o5l761; lang_code=eyJpdiI6IkxkWFRHRXdheTFXNm1kUW01eG05R0E9PSIsInZhbHVlIjoiZHFNR2lFMkxLS2JrVWpwTU5FUU5ydz09IiwibWFjIjoiNGY0ZTQxZWQ3ZjM5NzFlMzkxMzI0MzAxZWY5M2RiNjBiZDAwMjYzMTE0YWNmOGEzMTZjYzg0MTNhMzU5ZGVmNiJ9; client_info=eyJpdiI6InlSamtxMldsRnBJbWMzcm9nQkNuZFE9PSIsInZhbHVlIjoiYkViQytNMGt1RlNaelRvN0xnNGNiUT09IiwibWFjIjoiNDhlNjM0Njc1YzVhN2IyM2NiMjJlZTEyMWFmZWJhZDYyNjJiMzI0ZWYxYTdkMWMxZjZmOGNkMTA1ZDc5ZDczYiJ9; TCK=52458316eb9ff002c3d9c3efb8e49f1d; user_secure=eyJpdiI6InlCeVdNNndGM2VXRXRjRjRjdVh5aHc9PSIsInZhbHVlIjoiOUFZYVQ3MnczbER3dXVmbXhISnlIUENCSDNxbEVDV0phbXZcL0xwS2p3RG1IWlJqQkQyY1ozVjdFS0JJVDFnb2wiLCJtYWMiOiJlYjk0NmJhNTJmMzAwZDRmYzI4MWM0M2E4MTUxZDgyNWFiZDk5N2NlYWY1MTA5ODZmMTAyYzNhNzc1NDllODUzIn0%3D; XSRF-TOKEN=eyJpdiI6IndVeUp6dTQ1NTJvbDRXcDZwYTdRWmc9PSIsInZhbHVlIjoiNkxPTGZoYWZZbnR6ZUxLdWNyRkljaVZ2Z1pINktPQUFadk1KbDhNaG9cL05KR29QTm5YTml5cWY4RjZCazljNDAiLCJtYWMiOiJhMzgzODUyZWQ5NDZjOTcwZDk0MGZhMmFiMGJmZmEzYjVlOTUyNDJiYTJlZDlhOGY1YjE1YmMzYWI1NjVmYzFmIn0%3D; web_session=eyJpdiI6InFyb2k4czBGc01tRHV0R0JcL2NqQkpnPT0iLCJ2YWx1ZSI6IitUeWhIVGtJUXB3UUlTc210eFpkN3pYQ292U21wWGNIZTk4MzVVXC9laXBORm94bFhXbEVWbWszdUFcL2tsVzF4NCIsIm1hYyI6ImYyMDRmZmViNDM3YzJhMTQ0NWY2ZGViMWRlMWNkNjY0ZTc3NDVhZTE1Y2QyM2JlZGE2NDRhY2FkMzA0NWUwNmQifQ%3D%3D',
                    'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36',
                    'referer':"https://thesieure.com/",
                    'accept':"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    ':authority':"thesieure.com",
                    ':method':"GET",
                    ':path':"/account/login",
                    ':scheme':"https",
                    'accept-encoding':"httpsgzip, deflate, br",
                    'accept-language':"vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
                    'cache-control':"max-age=0",


                }

            };
            request.get(optionszz, 'https://thesieure.com/account/login', function (error, response, body) {
                console.log(error)
                // if (error) throw error; 
                if (error) { return resolve("loi") }
                if (response.statusCode == 200) {
                    const $ = cheerio.load(body);
                    var token = $('[name=_token]').val()
                    const cj = request.jar();
                    for (var i = 0; i < response.headers['set-cookie'].length; i++) {
                        cj.setCookie(response.headers['set-cookie'][i], 'https://thesieure.com/');
                    }
                    const options = {
                        url: 'https://thesieure.com/account/login',
                        jar: cj,
                        json: true,
                        body: {
                            _token: token,
                            phoneOrEmail: 'tronganh',
                            password: "xui901"
                        }
                    };
                    request.post(options, (error, res, body) => {

                        //      if (error) throw error; 
                        if (error) { return resolve("loi") }
                        if (res.statusCode == 302) {
                            request.get({ url: 'https://thesieure.com/wallet/transfer', jar: cj }, function (error, response, body) {
                                //   if (error) throw error;
                                //  console.log(body)
                                const $ = cheerio.load(body, {
                                    normalizeWhitespace: true,
                                    xmlMode: true
                                });
                                cheerioTableparser($);
                                var data = $(".col-sm-12.table-responsive").parsetable(true, true, true);
                                try {
                                    for (var i = 1; i < data[0].length; i++) {
                                        var magd = data[0][i];
                                        var sotien = data[1][i];
                                        var ten = data[2][i];
                                        var time = data[3][i];
                                        var status = data[4][i];
                                        var noidung = data[5][i];
                                        sotien = Number(sotien.replace(/,/g, '').replace("đ", ''))
                                        //  console.log(magd+"|"+Magd+"|"+sotien)
                                        if (sotien > 0 && Magd == magd) {
                                            return resolve(({ magd: magd, sotien: sotien, ten: ten, time: time, status: status, noidung: noidung }))
                                        }
                                    }
                                    return resolve("null")
                                } catch { return resolve("loi") }
                            });
                        }
                        else
                            return resolve("loi")
                    });
                } else return resolve("loi")
            });
        } catch { return resolve("loi") }

    });

}

// async function f1() {
//     var x = await TheSieuRe('T61013AE8885BD');
//     console.log(x); // 10
// }

// f1();