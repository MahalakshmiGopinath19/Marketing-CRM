const { Resend } = require('resend');
const Tracking = require('../models/Tracking');

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.BASE_URL;

const sendEmail = async ({ to, subject, text, campaignId, contactId }) => {
  try {
    // 🔥 SAFETY CHECK
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    // 🔥 TRACKING URLs
    const openUrl = `${BASE_URL}/api/analytics/track/open?campaign=${campaignId}&contact=${contactId}`;
    const clickUrl = `${BASE_URL}/api/analytics/track/click?campaign=${campaignId}&contact=${contactId}&url=https://google.com`;

    // 🔥 EMAIL CONTENT
    const htmlContent = `
      <h2>${subject}</h2>
      <p>${text}</p>

      <a href="${clickUrl}" target="_blank">
        👉 Click here
      </a>

      <br/><br/>

      <p>
        📊 View Email:
        <a href="${openUrl}" target="_blank">Open Email</a>
      </p>

      <img src="${openUrl}" width="1" height="1" style="display:none;" />
    `;

    console.log("📩 Sending email to:", to);

    // 🔥 SEND EMAIL
    const response = await resend.emails.send({
      from: 'Maha <onboarding@resend.dev>', // ✅ FIXED
      to,
      subject,
      html: htmlContent,
    });

    console.log("✅ Email sent:", response);

    // ✅ TRACK SENT
    await Tracking.create({
      campaignId,
      contactId,
      type: 'sent',
    });

    return response;

  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);

    // ❌ TRACK FAILURE
    await Tracking.create({
      campaignId,
      contactId,
      type: 'bounce',
    });

    throw error;
  }
};

module.exports = sendEmail;