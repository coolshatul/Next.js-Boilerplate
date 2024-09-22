import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, message } = req.body;

  // Configure the transport for sending the email
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "kamille.swaniawski63@ethereal.email",
      pass: "kR8ZvX1CWg5CUt71Fv",
    },
  });

  try {
    // Send the email
    await transporter.sendMail({
      from: `${email}`, // Sender address
      to: "shatul@aiFormulaGenerator.com", // Your actual email address
      subject: `New message from ${name}`, // Subject line
      text: `You have received a new message from ${name} (${email}): \n\n${message}`,
      html: `<p>You have received a new message from <strong>${name}</strong> (${email}):</p><p>${message}</p>`,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
}
