// const { Cashfree, CFEnvironment } = require("cashfree-pg");
const cashfree = require("../utils/cashfree");
const { Project, User, Donation, sequelize } = require("../models/index");

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
        return_url: `${process.env.BACKEND_URL}/api/donations/verify?order_id=${donation.id}`,
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
    const donation = await Donation.findByPk(donationId, { transaction: t });

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

    await Project.increment("raisedAmount", {
      by: donation.donationAmount,
      where: { id: donation.projectId },
      transaction: t,
    });

    await t.commit();
    return {
      message: `Donation ${donationId} completed successfully`,
    };
  } catch (error) {
    await t.rollback();
    console.error("Donation fulfillment error:", error);
    throw error;
  }
};

module.exports = {
  createOrder,
  fulfillDonation,
};
