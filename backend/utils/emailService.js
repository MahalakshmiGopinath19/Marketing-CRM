const nodemailer = require('nodemailer');
const Tracking = require('../models/Tracking');

const BASE_URL = process.env.BASE_URL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, text, campaignId, contactId }) => {
  try {
    const openUrl = `${BASE_URL}/api/analytics/track/open?campaign=${campaignId}&contact=${contactId}`;

    const clickUrl = `${BASE_URL}/api/analytics/track/click?campaign=${campaignId}&contact=${contactId}&url=https://google.com`;

    const htmlContent = `
      <h2>${subject}</h2>
      <p>${text}</p>

      <a href="${clickUrl}" target="_blank">
        👉 Click here
      </a>

      <br/><br/>

      <!--  FORCE OPEN TRACK  -->
      <p>
        📊 View Email:
        <a href="${openUrl}" target="_blank">Open Email</a>
      </p>

      <img src="${openUrl}" width="50" height="50" style="display:block;" />
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);

    await Tracking.create({
      campaignId,
      contactId,
      type: 'sent'
    });

    return info;

  } catch (error) {
    console.error(error);

    await Tracking.create({
      campaignId,
      contactId,
      type: 'bounce'
    });

    throw error;
  }
};

module.exports = sendEmail;