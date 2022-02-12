let FileSaver = require('file-saver'); // path to file-saver

function exportAsExcel() {
  let dataBlob = '...kAAAAFAAIcmtzaGVldHMvc2hlZXQxLnhtbFBLBQYAAAAACQAJAD8CAADdGAAAAAA='; // If have ; You should be split get blob data only
  downloadFile(dataBlob);
}

function downloadFile(blobContent) {
  let blob = new Blob([base64toBlob(blobContent, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')], {});
  FileSaver.saveAs(blob, 'report.xlsx');
}

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  let sliceSize = 1024;
  let byteCharacters = Buffer.from(base64Data, 'base64');
  let bytesLength = byteCharacters.length;
  let slicesCount = Math.ceil(bytesLength / sliceSize);
  let byteArrays = new Array(slicesCount);
  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    let begin = sliceIndex * sliceSize;
    let end = Math.min(begin + sliceSize, bytesLength);

    let bytes = new Array(end - begin);
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}