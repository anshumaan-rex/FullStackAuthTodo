import transporter from "../config/mailer.js";

export default async function sendEmail({ to, subject, text, html }){
  const info = await transporter.sendMail({
    from:`"Todo" <${process.env.SMTP_FROM}>`,
    to,
    subject,
    text,
    html
  })
  return info
}