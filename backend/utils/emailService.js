const { Resend } = require('resend');
const Tracking = require('../models/Tracking');

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.BASE_URL;

const sendEmail = async ({ to, subject, text, campaignId, contactId }) => {
  try {
    // 🔥 TRACKING URLs
    const openUrl = `${BASE_URL}/api/analytics/track/open?campaign=${campaignId}&contact=${contactId}`;

    const clickUrl = `${BASE_URL}/api/analytics/track/click?campaign=${campaignId}&contact=${contactId}&url=https://google.com`;

    // 🔥 EMAIL HTML
    const htmlContent = `
      <h2>${subject}</h2>
      <p>${text}</p>

      <a href="${clickUrl}" target="_blank">
        👉 Click here
      </a>

      <br/><br/>

      <!-- FORCE OPEN TRACK -->
      <p>
        📊 View Email:
        <a href="${openUrl}" target="_blank">Open Email</a>
      </p>

      <img src="${openUrl}" width="1" height="1" style="display:none;" />
    `;

    // 🔥 SEND EMAIL USING RESEND
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev', // ⚠️ keep this for now
      to,
      subject,
      html: htmlContent,
    });

    // ✅ TRACK SENT
    await Tracking.create({
      campaignId,
      contactId,
      type: 'sent',
    });

    return response;

  } catch (error) {
    console.error("EMAIL ERROR:", error);

    // ❌ TRACK BOUNCE
    await Tracking.create({
      campaignId,
      contactId,
      type: 'bounce',
    });

    throw error;
  }
};

module.exports = sendEmail;