const contactsController = require("../controller/contacts");
const { check } = require("express-validator");
const express = require("express");
const router = express.Router();

//contacts => GET
router.get("/get-contacts", contactsController.getContacts);
//add-contacts => POST
router.post(
  "/add-contact",
  [
    check("name").isString().isLength({ min: 3, max: 15 }).trim(),
    check("surname").isString().isLength({ min: 3, max: 20 }).trim(),
    check("role").isString().isLength({ min: 5, max: 30 }).trim(),
    check("bio").isString().isLength({ min: 10, max: 300 }).trim(),
    check("email")
      .isEmail()
      .normalizeEmail()
      .isLength({ min: 10, max: 40 })
      .trim(),
    check("phoneNumber").isFloat().isLength({ min: 10, max: 10 }),
  ],
  contactsController.addContact
);
//update-contact => PUT
router.put(
  "/update-contact",
  [
    check("name").isString().isLength({ min: 3, max: 15 }).trim(),
    check("surname").isString().isLength({ min: 1, max: 20 }).trim(),
    check("role").isString().isLength({ min: 5, max: 30 }).trim(),
    check("bio").isString().isLength({ min: 10, max: 300 }).trim(),
    check("email")
      .isEmail()
      .normalizeEmail()
      .isLength({ min: 10, max: 40 })
      .trim(),
    check("phoneNumber").isFloat().isLength({ min: 10, max: 10 }),
  ],
  contactsController.editContact
);
//delete-contact => DELETE
router.delete("/delete-contact", contactsController.deleteContact);

module.exports = router;
