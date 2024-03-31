"use strict";

var fs = require("fs");

var deleteFile = function deleteFile(filePath) {
  fs.unlink(filePath, function (err) {
    if (err) {
      throw err;
    }

    console.log(filePath, "the file was deleted");
  });
};

exports.deleteFile = deleteFile;