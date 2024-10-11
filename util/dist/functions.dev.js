"use strict";

var path = require("path");

var fs = require("fs");

function deleteFile(filePath) {
  fs.unlink(filePath, function (err) {
    if (err) {
      throw err;
    }
  });
}

function readImageData(filePath) {
  var absolutePath = path.join(__dirname, filePath);
  var imageData = fs.readFileSync(absolutePath);
  return imageData;
}

function getContentType(fileExtension) {
  switch (fileExtension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";

    case ".png":
      return "image/png";

    case ".gif":
      return "image/gif";
    // Add more supported file extensions as needed

    default:
      return null;
  }
}

module.exports = {
  deleteFile: deleteFile,
  readImageData: readImageData,
  getContentType: getContentType
};