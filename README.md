<!-- @format -->

Here's the updated README file based on the provided methods:

Fabrique Cinema Company RESTful API
This is a RESTful API for the Fabrique Cinema Company. It provides endpoints for managing movies, contacts, users, and articles.

Getting Started
Prerequisites
Node.js (v14.16.1 or later)
MongoDB (v4.1.1 or later)
Mongoose ( v6.7.0 or later)

Install dependencies:
npm install

Endpoints:

Users:
POST /sign-up: Create a user
POST /login: Login a user
POST /forgot-password: Forgot password
PUT /reset-password: Reset password

Contacts:
GET /get-contacts: Get all contacts
POST /add-contact: Add a contact
PUT /update-contact: Edit a contact
DELETE /delete-contact: Delete a single contact
DELETE /delete-contact-image: Delete a single contact cover

Films:
GET /get-films: Get all films
POST /add-film: Add a film
PUT /update-film: Edit a film
DELETE /delete-film: Delete a film
DELETE /delete-film-image: Delete a film cover

Articles:
GET /articles: Get all articles
POST /add-article: Add a film
PUT /update-article: Edit a film
DELETE /delete-article: Delete a single article
DELETE /delete-article-image: Delete a single article image
