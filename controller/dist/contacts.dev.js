"use strict";

var _require = require("express-validator"),
    validationResult = _require.validationResult;

var _require2 = require("../util/functions"),
    deleteFile = _require2.deleteFile;

var Contact = require("../model/contact");

var fs = require("fs"); // GET => Getting all contacts


exports.getContacts = function _callee(req, res) {
  var contacts;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Contact.find());

        case 3:
          contacts = _context.sent;
          // response from the server with the render method and passing an object
          res.status(200).json(contacts);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Something went wrong with the contacts fetching"
          });
          console.log("Something went wrong with the contacts fetching: ", _context.t0.message);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // POST => Adding a Contact


exports.addContact = function _callee2(req, res) {
  var _req$body, name, surname, role, bio, email, slug, phoneNumber, image, errors, existingContact, contact;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, surname = _req$body.surname, role = _req$body.role, bio = _req$body.bio, email = _req$body.email, slug = _req$body.slug, phoneNumber = _req$body.phoneNumber;
          image = req.file;
          errors = validationResult(req); // if there are errors
          // Send a response with the status and a json

          if (!errors.isEmpty()) {
            console.log("POST adding contacts errors: ", errors.array());
            res.status(422).json({
              contact: {
                name: name,
                surname: surname,
                role: role,
                bio: bio,
                email: email,
                slug: slug,
                phoneNumber: phoneNumber
              },
              message: "There was a problem with the validation process",
              errorMessage: errors.array()[0].msg,
              validationErrors: errors.array()
            });
          }

          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Contact.findOne({
            name: name,
            surname: surname,
            email: email
          }));

        case 7:
          existingContact = _context2.sent;

          if (!existingContact) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "The contact exists already"
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(Contact.create({
            name: name,
            surname: surname,
            role: role,
            bio: bio,
            email: email,
            slug: slug,
            phoneNumber: phoneNumber,
            imageUrl: {
              data: fs.readFileSync("images/" + image.filename),
              contentType: "image/png"
            }
          }));

        case 12:
          contact = _context2.sent;
          deleteFile("images/" + image.filename);
          return _context2.abrupt("return", res.status(201).send(contact));

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](4);
          return _context2.abrupt("return", res.status(500).json({
            message: "Something went wrong.",
            error: _context2.t0
          }));

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 17]]);
}; // PUT => Editing a contact


exports.editContact = function _callee3(req, res) {
  var _req$body2, name, surname, role, bio, email, slug, phoneNumber, _id, image, imageUrl, update, errors, updatedContact;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, name = _req$body2.name, surname = _req$body2.surname, role = _req$body2.role, bio = _req$body2.bio, email = _req$body2.email, slug = _req$body2.slug, phoneNumber = _req$body2.phoneNumber, _id = _req$body2._id;
          image = req.file;
          imageUrl = {
            data: fs.readFileSync("images/" + image.filename),
            contentType: image.mimetype
          };

          if (!_id) {
            res.status(404).json({
              message: "Was not possible to update the specific contact, because the id is missing"
            });
          }

          update = {
            name: name,
            surname: surname,
            role: role,
            bio: bio,
            email: email,
            slug: slug,
            phoneNumber: phoneNumber,
            imageUrl: imageUrl
          };
          errors = validationResult(req); // if there are errors
          // Send a response with the status and a json

          if (!errors.isEmpty()) {
            console.log("POST adding contacts errors: ", errors.array());
            res.status(422).json({
              contact: {
                name: name,
                surname: surname,
                role: role,
                bio: bio,
                email: email,
                slug: slug,
                phoneNumber: phoneNumber,
                _id: _id
              },
              message: "There was a problem with the validation process",
              errorMessage: errors.array()[0].msg,
              validationErrors: errors.array()
            });
          }

          _context3.prev = 7;
          _context3.next = 10;
          return regeneratorRuntime.awrap(Contact.findByIdAndUpdate(_id, update, {
            "new": true
          }));

        case 10:
          updatedContact = _context3.sent;
          deleteFile("images/" + image.filename);
          res.status(200).json(updatedContact);
          _context3.next = 18;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](7);
          res.status(500).json({
            message: "Was not possible to update the specific contact."
          });

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[7, 15]]);
}; //DELETE => Delete a single contact


exports.deleteContact = function _callee4(req, res) {
  var contactId;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          contactId = req.body._id;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Contact.findByIdAndRemove(contactId));

        case 4:
          res.status(200).json({
            message: "The contact has been deleted"
          });
          _context4.next = 11;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](1);
          res.status(500).send(_context4.t0.message);
          console.log("Something went wrong while deleting a contact: ", _context4.t0.message);

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 7]]);
};