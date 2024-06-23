const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "build")));

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const upload = multer();

app.post("/api/apply", upload.single("cvFile"), async (req, res) => {
  try {
    const file = req.file;
    const userDetail = req.body;

    const mailOptions = {
      from: "am911104@gmail.com", // Replace with your Gmail address
      to: "ahsanjaved74@yahoo.com", // Replace with actual email
      subject: `Job Application - ${userDetail.firstName} ${userDetail.lastName} - ${userDetail.role}`,
      text:
        userDetail.message && userDetail.message.trim() !== ""
          ? `${userDetail.message} and email: ${userDetail.email}, phone: ${userDetail.Phone}`
          : `Please see my CV and email: ${userDetail.email}, phone: ${userDetail.Phone}`,
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.sendStatus(200); // Success
  } catch (error) {
    console.error("Error sending email:", error);
    res.sendStatus(500); // Error
  }
});

app.post("/api/send-message", async (req, res) => {
  const messageDetail = req.body;
  try {
    const mailOptions = {
      from: "am911104@gmail.com",
      to: "ahsanjaved74@yahoo.com",
      subject: `Contacting - ${messageDetail.firstName} ${messageDetail.lastName} -email: ${messageDetail.email}-Phone: ${messageDetail.Phone}`,
      text: messageDetail.message,
    };

    await transporter.sendMail(mailOptions);

    res.sendStatus(200);
  } catch (error) {
    console.error("Error sending email:", error);
    res.sendStatus(500);
  }
});
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(8080, () => {
  console.log("server is working");
});
