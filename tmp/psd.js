// using nodejs to export png from psd file without third party dependencies
// https://github.com/adobe/photoshop/blob/master/docs/fileformat.md

const fs = require("fs");
const psdData = fs.readFileSync("./tmp/hello.psd");
const psdBuffer = Buffer.from(psdData);

// Check for PSD signature
if (psdBuffer.toString("ascii", 0, 4) !== "8BPS") {
  throw new Error("Not a valid PSD file");
}
// Read version and reserved bytes
const version = psdBuffer.readUInt16BE(4);
const reserved = psdBuffer.slice(6, 12);

// Read number of channels
const numChannels = psdBuffer.readUInt16BE(12);

// Read image dimensions
const height = psdBuffer.readUInt32BE(14);
const width = psdBuffer.readUInt32BE(18);

// Read bit depth and color mode
const bitDepth = psdBuffer.readUInt16BE(28);
const colorMode = psdBuffer.readUInt16BE(30);

// Skip optional data
const optionalDataLength = psdBuffer.readUInt32BE(36);
const imageDataStart = 36 + optionalDataLength;

const parsedData = {
  version,
  numChannels,
  height,
  width,
  bitDepth,
  colorMode,
  imageDataStart,
};

console.log(parsedData);

// Save each channel as a separate file
for (let i = 0; i < numChannels; i++) {
  const channelStart = imageDataStart + i * numChannels;
  const channelData = psdBuffer.slice(channelStart, channelStart + numChannels);
  fs.writeFileSync(`channel${i}.raw`, channelData);
}
