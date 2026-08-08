const brevo = require("../config/brevo.config");
/**
 * Generic core function to dispatch transactional mail payloads via Brevo
 */
const sendEmail = async ({ toEmail, toName, subject, htmlContent }) => {
  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent,
      sender: {
        name: process.env.SYSTEM_NAME_SENDER,
        email: process.env.SYSTEM_EMAIL_SENDER,
      },
      to: [
        {
          email: toEmail,
          name: toName,
        },
      ],
    });
    console.log(`Email dispatched successfully.`);
    return { success: true };
  } catch (error) {
    console.error("Brevo API Mail Dispatch Error:", error);
    // Do not throw the error to avoid breaking the core runtime process
    return { success: false, error: error.message };
  }
};

// this is triggered automatically upon webhook confirmation
const sendDonationConfirmation = async (
  userEmail,
  userName,
  projectTitle,
  amount,
) => {
  return await sendEmail({
    toEmail: userEmail,
    toName: userName,
    subject: `Thank you for your donation to ${projectTitle}!`,
    htmlContent: `
      <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
        <h2>Donation Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for your generous contribution of <strong>INR ${amount}</strong> towards the initiative: <strong>${projectTitle}</strong>.</p>
        <p>Your support is directly empowering our community operations. You can track ongoing updates and download your legal tax receipt by logging into your dashboard timeline.</p>
        <br>
        <p>Warm regards,</p>
        <p>The ${process.env.SYSTEM_NAME_SENDER} Team</p>
      </div>
    `,
  });
};

// this is triggered when charity owner publishes an impact report
const sendProjectUpdateNotification = async (
  userEmail,
  userName,
  projectTitle,
  reportTitle,
) => {
  return await sendEmail({
    toEmail: userEmail,
    toName: userName,
    subject: `New Impact Update: ${projectTitle}`,
    htmlContent: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>An update has been posted!</h2>
        <p>Hello ${userName},</p>
        <p>The initiative you supported, <strong>${projectTitle}</strong>, has published a new progress report:</p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #0056b3;">
          <strong>${reportTitle}</strong>
        </blockquote>
        <p>Log into the application platform to read the detailed breakdown of utilized funds and social impact milestones achieved.</p>
      </div>
    `,
  });
};

module.exports = {
  sendProjectUpdateNotification,
  sendDonationConfirmation,
};
