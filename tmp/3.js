let asc_key = "jeH3O1VX";
let base_lv = "nHnsU4cX";
function aesEncrypt(a) {
  let tmpiv = CryptoJS.enc.Utf8.parse(base_lv);
  let key = CryptoJS.enc.Utf8.parse(asc_key);
  var b = CryptoJS.AES.encrypt(a, key, {
    iv: tmpiv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    formatter: CryptoJS.format.OpenSSL
  });
  let result = b.toString();
  return result
}
function aesDecrypt(a) {
  let tmpiv = CryptoJS.enc.Utf8.parse(base_lv);
  let key = CryptoJS.enc.Utf8.parse(asc_key);
  var b = CryptoJS.AES.decrypt(a, key, {
    iv: tmpiv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    formatter: CryptoJS.format.OpenSSL
  });
  return CryptoJS.enc.Utf8.stringify(b)
}
function desEncrypt(a) {
  let tmpiv = CryptoJS.enc.Utf8.parse(base_lv);
  let key = CryptoJS.enc.Utf8.parse(asc_key);
  var b = CryptoJS.DES.encrypt(a, key, {
    iv: tmpiv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    formatter: CryptoJS.format.OpenSSL
  });
  return b.ciphertext.toString(CryptoJS.enc.Base64)
}
function desDecrypt(a) {
  a = a.replace(/\s*/g, "");
  let tmpiv = CryptoJS.enc.Utf8.parse(base_lv);
  var b = CryptoJS.enc.Utf8.parse(asc_key);
  var c = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(a)
  },
    b,
    {
      iv: tmpiv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      formatter: CryptoJS.format.OpenSSL
    });
  return c.toString(CryptoJS.enc.Utf8)
}
function desVideoUrl(a, b) { 
  let ts = (new Date()).getTime();
  let token = CryptoJS.MD5("i" + b + "am" + ts + "IronMan").toString(); 
  let result_url = a + "?ts=" + ts + "&token=" + token; return result_url
}