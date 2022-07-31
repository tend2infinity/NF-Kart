import { createTransport } from "nodemailer"

const sendMail = (email, name,productid, tokenid,owner) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

  const options = {
    from: "Pro Shop",
    to: `${email}`,
    subject: `Warranty Card for the purchase of product:${productid}`,
    text: `Hello ${name}
    Thank you for buying from us.
    Product: ${productid}
    NFT token: ${tokenid}
    NFT owner account: ${owner}`,
    
  }

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err)
      return
    }
    console.log("SENT: ", info.response)
  })
}
export default sendMail
