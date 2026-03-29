import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    // port: 465,
    // secure: false,
    service: "gmail",
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Sarah App " <${process.env.SMTP_USER}>`, // sender address
    to, // list of recipients
    subject: subject, // subject line
    html: html,
  });

  console.log("Message sent: %s", info.messageId);

  return info.accepted.length > 0;
};

export const generateOtp = async () => {
  return Math.floor(1000 + Math.random() * 9000);
};
