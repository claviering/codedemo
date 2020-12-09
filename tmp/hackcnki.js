const axios = require('axios');
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if(i == len)
        {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if(i == len)
        {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c1 == -1);
        if(c1 == -1)
            break;

        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c2 == -1);
        if(c2 == -1)
            break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if(c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while(i < len && c3 == -1);
        if(c3 == -1)
            break;

        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if(c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while(i < len && c4 == -1);
        if(c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

function utf16to8(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
        c = str.charCodeAt(i++);
        switch(c >> 4)
        {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += str.charAt(i-1);
                break;
            case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}

let url = "http://my.cnki.net/MyCNKI/managelogin.aspx?validstr=5b47a8ff19bba0ebb78b7cae827db983&amp;p=%2fMyCNKI%2fUserInfo%2fIPInfo.aspx"
let params = {
  __VIEWSTATE: '/wEPDwUJNzA1NjUxNjI4ZGR0sZ6hD3EvXSh0dRheThBGaZKHGg==',
  __VIEWSTATEGENERATOR: '599B3212',
  __EVENTVALIDATION: '/wEdAAQfgaIRjxZ+uNSnuWluzW6AGeS4lmEAS+GUGbtf3nTpCREghZBVv0boc2NaC2/zVFTN+DvxnwFeFeJ9MIBWR69355uZoDEFM9SfcK/6CPFVobDELqc=',
  HiddenPW: 'MTIzNDQ=',
  Button1: '确 定'
}
let config = {
  headers: {
    Host: 'my.cnki.net',
    Origin: 'http://my.cnki.net',
    'Upgrade-Insecure-Requests': 1,
    'Content-Type': 'application/x-www-form-urlencoded',
    Cookie: 'Ecp_ClientId=8181120220403258949; cnkiUserKey=10e03baa-2617-a6f8-701b-bae85418ca1c; DID=3cfe53c7-804f-432b-8b9a-e8be95610364; Ecp_session=1; amid=092dcffb-f47e-47e5-abc7-feda24bff2c9; UM_distinctid=169c3404eec2d4-0052450a53e99f-12356d54-384000-169c3404eed406; LID=WEEvREcwSlJHSldRa1FhcEE0QVRBNU1Qa2YyVjZPamdyOVh1OFhZL3grVT0=$9A4hF_YAuvQ5obgVAqNKPCYcEjKensW4IQMovwHtwkF4VYPoHbKxJw!!; SID=020101; Hm_lvt_3466711a9cd1cb9c9867908f7bc5bdff=1554099772; _pk_ref=%5B%22%22%2C%22%22%2C1554099773%2C%22http%3A%2F%2Fzhifu.cnki.net%2F%22%5D; _pk_ses=*; c_m_LinID=LinID=WEEvREcwSlJHSldRa1FhcEE0QVRBNU1Qa2YyVjZPamdyOVh1OFhZL3grVT0=$9A4hF_YAuvQ5obgVAqNKPCYcEjKensW4IQMovwHtwkF4VYPoHbKxJw!!&ot=04/01/2019 14:42:51; c_m_expire=2019-04-01 14:42:51; Ecp_LoginStuts=%7B%22IsAutoLogin%22%3Afalse%2C%22UserName%22%3A%22GDHNSF%22%2C%22ShowName%22%3A%22%25E5%258D%258E%25E5%258D%2597%25E5%25B8%2588%25E8%258C%2583%25E5%25A4%25A7%25E5%25AD%25A6%22%2C%22UserType%22%3A%22bk%22%2C%22r%22%3A%22qTYCS3%22%7D; Ecp_notFirstLogin=qTYCS3; _pk_id=d9697ae7-996b-4b3e-bd0e-5d0ef70f9339.1554099773.1.1554099827.1554099773.; Hm_lpvt_3466711a9cd1cb9c9867908f7bc5bdff=1554099834; ASP.NET_SessionId=d3eoe3bppjlcbfl4h0fwgbdv'
  }
}
async function run() {
  let res = await axios.post(url, params, config)
  console.log(res);
}
run()