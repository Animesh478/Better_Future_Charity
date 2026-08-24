const PDFDocument = require("pdfkit");
const cashfree = require("../utils/cashfree");
const {
  Project,
  User,
  Donation,
  Charity,
  sequelize,
} = require("../models/index");
const { sendDonationConfirmation } = require("./email.service");

// 1. create order
const createOrder = async function (userId, projectId, amount) {
  const user = await User.findByPk(userId);
  const project = await Project.findByPk(projectId);

  if (!project) return { error: "NOT_FOUND", message: "Project not found" };

  // create a pending donation in the database
  const donation = await Donation.create({
    userId,
    projectId,
    donationAmount: amount,
  });

  // create the cashfree order
  try {
    const orderRequest = {
      order_amount: amount,
      order_currency: "INR",
      order_id: donation.id,
      customer_details: {
        customer_id: user.id.toString(),
        customer_email: user.email,
        customer_phone: user.phoneNumber || "9999999999", // Cashfree requires a valid phone string
      },
      order_meta: {
        // return_url: `${process.env.BACKEND_URL}/api/donations/verify?order_id=${donation.id}`,
        return_url: `${process.env.FRONTEND_URL}/donations/status?donation_id=${donation.id}`,
        notify_url: `${process.env.CLOUDFLARE_URL}/api/donations/webhook`,
      },
    };

    const response = await cashfree.PGCreateOrder(orderRequest); // order initialization

    // The SDK nests the response data inside the 'data' property
    return {
      success: true,
      payment_session_id: response.data.payment_session_id,
      order_id: donation.id,
    };
  } catch (error) {
    // If Cashfree fails, mark the internal record as failed
    await donation.update({ status: "Failed" });

    // The SDK surfaces API errors in error.response.data.message
    console.error(
      "Cashfree SDK Error:",
      error.response?.data?.message || error.message,
    );
    throw new Error("Failed to create payment gateway order.");
  }
};

// find the donation using the donation id passed in the webhook
const fulfillDonation = async function (donationId, paymentId) {
  const t = await sequelize.transaction();

  try {
    const donation = await Donation.findByPk(donationId, {
      transaction: t,
      include: [
        { model: Project, as: "project" },
        { model: User, as: "donor" },
      ],
    });

    if (!donation || donation.status === "Success") {
      await t.rollback();
      return;
    }

    // mark donation as completed
    await donation.update(
      {
        status: "Success",
        transactionId: paymentId,
      },
      {
        transaction: t,
      },
    );

    // then increment the project's raised amount
    // let increment = 0;
    // increment++;
    // console.log("donation service, increment=", increment);
    await Project.increment("raisedAmount", {
      by: donation.donationAmount,
      where: { id: donation.projectId },
      transaction: t,
    });

    await t.commit();

    sendDonationConfirmation(
      process.env.DONOR_EMAIL,
      donation.donor.name,
      donation.project.title,
      donation.donationAmount,
    );
    return {
      message: `Donation ${donationId} completed successfully`,
    };
  } catch (error) {
    await t.rollback();
    console.error("Donation fulfillment error:", error);
    throw error;
  }
};

const fetchUserDonationHistory = async function (userId) {
  // console.log("donation service, Project=");
  const result = await Donation.findAll({
    where: {
      userId,
      status: "Success",
    },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Project,
        as: "project",
        attributes: ["title"],
        include: [
          {
            model: Charity,
            as: "charity",
            attributes: ["name", "registrationNumber"],
          },
        ],
      },
    ],
  });
  return result;
};

const generateDonationReceipt = async function (userId, donationId, res) {
  // fetch the donation details
  const donation = await Donation.findOne({
    where: {
      id: donationId,
      userId,
    },
    include: [
      {
        model: Project,
        as: "project",
        include: [
          {
            model: Charity,
            as: "charity",
          },
        ],
      },
    ],
  });

  if (!donation) {
    return { error: "NOT_FOUND", message: "Donation details not found" };
  }
  if (donation.status !== "Success") {
    return {
      error: "BAD_REQUEST",
      message: "Cannot generate receipt for incomplete transaction",
    };
  }

  // 3. Initialize PDF Kit document configuration
  const doc = new PDFDocument({ margin: 50 });

  // Pipe the document directly out to the Express HTTP response stream
  doc.pipe(res);

  // 4. Construct the Receipt Visual Layout Elements
  doc
    .fontSize(20)
    .text("OFFICIAL DONATION RECEIPT", { align: "center" })
    .moveDown();

  doc
    .fontSize(10)
    .text(`Receipt Generated On: ${new Date().toLocaleDateString()}`, {
      align: "right",
    });
  doc.text(`Transaction Reference: ${donation.id}`).moveDown(2);

  doc
    .fontSize(12)
    .text(`Thank you for your generous contribution.`, { oblique: true })
    .moveDown();

  // Create a structured data presentation layout block
  doc
    .fontSize(14)
    .text("Contribution Details", { underline: true })
    .moveDown(0.5);
  doc.fontSize(12).text(`Organization: ${donation.project.charity.name}`);
  doc.text(`Registration No: ${donation.project.charity.registrationNumber}`);
  doc.text(`Target Initiative: ${donation.project.title}`);
  doc.text(`Settlement Status: Successful`).moveDown();

  doc.rect(50, doc.y, 500, 30).fill("#f2f2f2");
  doc
    .fillColor("#000000")
    .text(
      `TOTAL AMOUNT CONTRIBUTED: INR ${donation.donationAmount}`,
      60,
      doc.y + 10,
      {
        bold: true,
      },
    );

  // 5. Finalize write streams to terminate network connections cleanly
  doc.end();

  return { success: true };
};

const fetchDonationStatusFromDb = async function (donationId) {
  const data = await Donation.findOne({
    where: {
      id: donationId,
    },
    attributes: ["status"],
  });

  if (!data) {
    return {
      error: "NOT_FOUND",
      message: "Donation details not found. Must be a valid donation",
    };
  }
  return { data };
};

module.exports = {
  createOrder,
  fulfillDonation,
  fetchUserDonationHistory,
  generateDonationReceipt,
  fetchDonationStatusFromDb,
};
