// const { Cashfree } = require("cashfree-pg");
const cashfree = require("../utils/cashfree");

const {
  fulfillDonation,
  createOrder,
} = require("../services/donation.service");

const makeDonation = async function (req, res) {
  const userId = req.user.id;
  const { projectId, amount } = req.body;

  try {
    const result = await createOrder(userId, projectId, amount);

    if (result.error) {
      return res.status(404).json({ success: false, message: result.message });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const handleWebhook = async function (req, res) {
  try {
    // 1. Extract the required headers sent by Cashfree
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    // 2. Extract the raw body using express.raw()
    const rawBody = req.body.toString("utf8");

    // 3. Verify the signature using the Cashfree SDK
    // If the signature is invalid, this method will throw an error and jump to the catch block
    const response = await cashfree.PGVerifyWebhookSignature(
      signature,
      rawBody,
      timestamp,
    );

    const event = JSON.parse(rawBody);

    if (event.type === "PAYMENT_SUCCESS_WEBHOOK") {
      const orderId = event.data.order.order_id;
      const paymentId = event.data.cf_payment_id;

      // make changes in the database
      await fulfillDonation(orderId, paymentId);
    }

    res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    console.error("Webhook Verification Failed:", error.message);
    // Return a 400 Bad Request if the signature didn't match
    res.status(400).json({ message: "Invalid Webhook Signature" });
  }
};

const handleReturn = function (req, res) {
  const orderId = req.query.order_id;
  res.send(`
    <html>
      <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
        <h2>Payment Redirect Successful!</h2>
        <p>Order ID: <strong>${orderId}</strong></p>
        <p>Check your terminal to see if the Webhook fired!</p>
      </body>
    </html>
  `);
};

module.exports = {
  handleWebhook,
  makeDonation,
  handleReturn,
};
