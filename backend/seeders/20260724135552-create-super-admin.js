"use strict";
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const phoneNumber = process.env.ADMIN_PHONENUMBER;

    const passwordHash = await bcrypt.hash(password, 10);

    // we are inserting the data directly into the table (bypassing the Sequelize orm)
    await queryInterface.bulkInsert("user", [
      {
        id: uuidv4(),
        name,
        email,
        password_hash: passwordHash,
        role: "Admin",
        phone_number: phoneNumber,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", {
      email: process.env.ADMIN_EMAIL,
    });
  },
};
