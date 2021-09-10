/**
 * 解密视频
 *
 * @param {*} playurl 来源 /video/index/details.html d.video.video_url_arr
 */
function dec(playurl) {
  var key = 'QE75dBbLvwaylwTe';
  var iv = 'AES_Pwd__AES_Pwd';
  var ikey = CryptoJS.enc.Utf8.parse(key);
  var iiv = CryptoJS.enc.Utf8.parse(iv);
  var decrypted = CryptoJS.AES.decrypt(playurl, ikey, {
    iv: iiv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  console.log(decrypted.toString(CryptoJS.enc.Utf8));
}
dec("O6eVenyDUndrqUC8p8aTOSOjW/1myqI9EMlSPPPDLx0pGMh5A5R9jcoL/hiufcyYt+CxKve9u2z1cW9lNqWf5Y/lQw9FBzL9V08lWidZ3GP6myU2+nZLk2wggtaBfdMPJsZhyOngU/q5JeHFLcdx0scipC/pf+2pA1hm2J3/v29PteoWWNW6bEjvirlla9ZHDlyG4cz8+bfKQyrvoBcBEK1jXJBk4PA0pl6/0Bg0ocw=")