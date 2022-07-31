import React from "react"
import { Helmet } from "react-helmet"
const Meta = (title, description, keywords) => {
  return (
    <Helmet>
      <title>{title.title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}
Meta.defaultProps = {
  title: "Welcome to NF-Kart",
  description: "We sell the best products",
  keywords: "electronics, buy electronics,best electronics",
}
export default Meta
