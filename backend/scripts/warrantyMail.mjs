import { createTransport } from "nodemailer"

const sendMail = (email, productid, tokenid) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: "forpictconfessions@gmail.com",
      pass: "krrqtecqxqoshttc",
    },
  })

  const options = {
    from: "Pro Shop",
    to: `${email}`,
    subject: `Warranty Card for the purchase of product:${productid}`,
    text: `Thank you for buying from us.
    Product: ${productid}
    NFT token: ${tokenid}`,
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
