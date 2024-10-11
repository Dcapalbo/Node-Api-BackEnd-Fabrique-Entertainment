"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContentType = void 0;

var getContentType = function getContentType(fileExtension) {
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
};

exports.getContentType = getContentType;