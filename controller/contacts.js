const fs = require("fs");
const Contact = require("../model/contact");
const { validationResult } = require("express-validator");
const fileHelper = require("../util/file");

// GET => Getting all contacts
exports.getContacts = (req, res) => {
  Contact.find()
    .then((contacts) => {
      // response from the server with the render method and passing an object
      res.send(contacts);
    })
    // catching errors
    .catch((err) => {
      res.status(500).send(err);
      console.log("error: ", err);
    });
};

// POST => Adding a Contact
exports.postAddContact = (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const role = req.body.role;
  const bio = req.body.bio;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const image = req.file;
  // if there is no image
  if (!image) {
    // then return the status and the route
    return (
      res.status(422),
      {
        contact: {
          name,
          surname,
          role,
          bio,
          email,
          phoneNumber,
        },
        errorMessage: "Attached file is not an image.",
        validationErrors: [],
      }
    );
  }

  const errors = validationResult(req);

  // if there are errors
  if (!errors.isEmpty()) {
    console.log("POST adding contacts errors: ", errors.array());
    res.status(422).send("input invalid for the POST contact");
    // then return the status and the route
    return {
      //   hasError: true,
      contact: {
        name,
        surname,
        role,
        bio,
        email,
        phoneNumber,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    };
  }

  const contact = new Contact({
    name,
    surname,
    role,
    bio,
    email,
    phoneNumber,
    imageUrl: {
      data: fs.readFileSync("images/" + image.filename),
      contentType: "image/png",
    },
  });
  // saving the data inside the db
  contact
    .save()
    .then((contacts) => {
      // response from the server with the render method and passing an object
      console.log("Contact has been created");
      res.status(201).send(contacts);
    })
    // catching errors
    .catch((err) => {
      console.log("something went wrong, here the error: ", err);
      res.status(500).send(err);
    })
    .finally(() => {
      fileHelper.deleteFile("images/" + image.filename);
    });
};

// POST => Editing a contact
exports.postEditContact = (req, res, next) => {
  const updatedName = req.body.name;
  const updatedSurname = req.body.surname;
  const updatedRole = req.body.role;
  const updatedBio = req.body.bio;
  const updatedEmail = req.body.email;
  const updatedPhoneNumber = req.body.updatedPhoneNumber;
  const contactId = req.body._id;
  const image = req.file;

  const errors = validationResult(req);
  // if there are errors
  if (!errors.isEmpty()) {
    return (
      res.status(422),
      {
        contact: {
          name: updatedName,
          surname: updatedSurname,
          role: updatedRole,
          bio: updatedBio,
          email: updatedEmail,
          updatedPhoneNumber: updatedPhoneNumber,
          _id: contactId,
        },
        // take the first error message from the array
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      }
    );
  }
  // Mongoose method to find by id which has been passed
  Contact.findById(contactId)
    // Promise then product with a condition
    .then((contact) => {
      let contactDbId = contact._id.toString();
      // make the id a String, response (db) and request (user)
      if (contactDbId !== contactId) {
        res
          .status(500)
          .send("Was not possible to update the specific contact.");
        return;
      }
      // updating the contact inside the (db)
      const imageUrl = {
        data: fs.readFileSync("images/" + image.filename),
        contentType: "image/png",
      };

      contact.name = updatedName;
      contact.surname = updatedSurname;
      contact.role = updatedRole;
      contact.bio = updatedBio;
      contact.email = updatedEmail;
      contact.updatedPhoneNumber = updatedPhoneNumber;
      contact.imageUrl = imageUrl;

      contact.save().then((result) => {
        res.status(201).send(result);
        console.log("Contact has been updated");
        return;
      });
    })
    .catch((err) => {
      res.status(500).send(err);
      console.log("error: ", err);
    })
    .finally(() => {
      fileHelper.deleteFile("images/" + image.filename);
    });
};

// // POST => Delete a single contact
exports.postDeleteContact = (req, res, next) => {
  const contactId = req.body._id;
  Contact.findById(contactId)
    .then((contact) => {
      let contactDbId = contact._id.toString();
      if (!contact) {
        res.status(500).send(new Error("Contact not found."));
        return;
      } else if (contactDbId !== contactId) {
        res
          .status(500)
          .send(
            "Was not possible to delete the specific contact, because the id passed from the client it's different from the one inside the DB."
          );
        return;
      }
      // Mongoose deleteOne method looking for the contact id of a specific user which has been requested from the client to the server
      return contact.deleteOne({ _id: contactId });
    })
    // returns a promise
    .then((result) => {
      res.status(200).send(result);
      console.log("The contact has been deleted");
    })
    // catching the errors
    .catch((err) => {
      res.status(500).send(err);
      console.log("error: ", err);
    });
};
