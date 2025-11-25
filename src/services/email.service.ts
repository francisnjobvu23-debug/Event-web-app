import nodemailer from 'nodemailer';

// Create Ethereal test account
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

export const sendWelcomeEmail = async (email: string) => {
  const transporter = await createTestAccount();
  
  const info = await transporter.sendMail({
    from: '"EventFlow 👻" <no-reply@eventflow.com>',
    to: email,
    subject: "Welcome to EventFlow! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3498db;">Welcome to EventFlow!</h1>
        <p>Thank you for joining our community! We're excited to have you on board.</p>
        <p>To verify your email address, please click the link below:</p>
        <a href="http://localhost:3000/verify-email?token=mock-token" 
           style="display: inline-block; background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p style="color: #666; margin-top: 20px;">
          If you didn't create this account, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  console.log("Message sent: %s", info.messageId);
  const previewUrl = nodemailer.getTestMessageUrl(info) || null;
  console.log("Preview URL: %s", previewUrl);
  
  return { info, previewUrl };
};
