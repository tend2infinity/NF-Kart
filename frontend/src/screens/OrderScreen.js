import React, { useState, useEffect } from "react"
import axios from "axios"
import { PayPalButton } from "react-paypal-button-v2"
import { Link } from "react-router-dom"
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Message from "../components/Message"
import Loader from "../components/Loader"
import Alert from "react-bootstrap/Alert"
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions"
import { listProductDetails } from "../actions/productActions"
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants"

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id
  const [showAlert, setShowAlert] = useState(false)

  const [sdkReady, setSdkReady] = useState(false)
  const [productIdArray, setProductIdArray] = useState([])
  const [nftDetails, setNftDetails] = useState([])
  const [nftEmailButton, setNftEmailButton] = useState(false);
  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  // const isPaid = order.length>0 ? order.is
  const nft = useSelector((state) => state.contractDetails.nft)
  const marketplace = useSelector((state) => state.contractDetails.marketplace)
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const productDetails = useSelector((state) => state.productDetails)

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay, error: errorPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }
    if (order) {
      order.itemsPrice = addDecimals(
        order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      )
    }
  }

  useEffect(() => {
    if (
      productIdArray.length > 0 &&
      marketplace &&
      Object.keys(marketplace).length > 0 &&
      nft
    ) {
      getNftData()
    }
  }, [productIdArray, marketplace, nft, setProductIdArray])

  const getNftData = async () => {
    let nftData = []
    let itemTokenURI = []
    if (marketplace) {
      const itemCount = await marketplace.itemCount()
      productIdArray.map(async (uriLink) => {
        if (uriLink) {
          let response = await fetch(uriLink.tokenId)
          let json = await response.json()
          let obj = {}
          obj.result = json
          obj.dbID = uriLink.dbID
          itemTokenURI.push(obj)
        }
      })
      if (marketplace) {
        for (let i = 1; i <= itemCount; i++) {
          const item = await marketplace.items(i)
          const owner = await nft.ownerOf(item.tokenId)
          itemTokenURI.map((x) => {
            if (
              x &&
              x.result &&
              x.result.id &&
              item.tokenId._hex === x.result.id.hex
            ) {
              let obj = {}
              obj.tokenId = item.tokenId
              obj.sold = item.sold
              obj.warrantyPeriod = item.warrantyPeriod
              obj.warrantyStartPeriod = item.warrantyStartPeriod
              obj.warrantyOver = item.warrantyOver
              obj.owner = owner
              obj.dbID = x.dbID
              nftData.push(obj)
            }
          })
        }
      }
    }

    console.log(nftData)
    setNftDetails(nftData)
    setNftEmailButton(true)
    console.log("get nft works")
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login")
    }
    console.log(nftDetails)
    let productIds = []
    let productTokenIds = []
    if (order) {
      order.orderItems.map((item) => {
        productIds.push(item.product)
      })
    }
    productIds.map(async (productId) => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`)
        let obj = {}
        console.log(data)
        obj.tokenId = data.tokenURI
        obj.dbID = data._id
        productTokenIds.push(obj)
      } catch (error) {
        console.log(error)
      }
    })
    setProductIdArray(productTokenIds)

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal")
      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }
    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [dispatch, orderId, successPay, successDeliver, order, userInfo, history])

  useEffect(() => {
    transferNFT()
  }, [order, marketplace, nft])

  const transferNFT = async () => {
    if (!showAlert) {
      console.log(" works!")
      if (marketplace && order && order.isPaid) {
        const itemCount = await marketplace.itemCount()
        let itemTokenURI = []
        cartItems.map(async (item) => {
          const uri = item.tokenURI
          let response = await fetch(uri)
          let json = await response.json()
          itemTokenURI.push(json)
        })
        let matchItemId = null

        console.log("prev item count", itemCount)
        const dateInSecs = Math.floor(new Date().getTime() / 1000)
        for (let i = 1; i <= itemCount; i++) {
          const item = await marketplace.items(i)
          console.log("tokenId", item.tokenId)
          // eslint-disable-next-line no-loop-func
          itemTokenURI.map(async (uri) => {
            if (uri) {
              console.log("uri", uri.id)
              if (uri && uri.id && uri.id.hex === item.tokenId._hex) {
                matchItemId = await marketplace.items(i).itemId
                console.log("linear search complete, match found", uri.id)
                await (
                  await marketplace.purchaseItem(item.itemId, dateInSecs)
                ).wait()
                setShowAlert(true)
              }
            }
          })
        }
        if (matchItemId) {
          const itemSoldStatus = await marketplace.items(matchItemId)
          console.log("item turned to sold", itemSoldStatus.sold)
        }
      }

    }

  }
  const emailNFTDetails = async (dbID,tokenId,name,email,owner) => {
    console.log("emailNFTDetails",dbID,tokenId.toString(),name,email,owner)
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    console.log(tokenId)
    let obj={}
    obj.productID = dbID
    obj.tokenID = tokenId.toString()
    obj.name = name
    obj.email = email 
    obj.owner = owner
    try {
      const { data } = await axios.post(`/api/orders/myorders/getemail`,obj,config)
      console.log(data)
      
    } catch (error) {
      console.log(error)
    }
}

const successPaymentHandler = async (paymentResult) => {
  console.log(paymentResult)

  dispatch(
    payOrder(
      orderId,
      paymentResult
    )
  )
  await transferNFT()
}

const deliverHandler = () => {
  dispatch(deliverOrder(order))
}

return loading ? (
  <Loader />
) : error ? (
  <Message variant='danger'>{error}</Message>
) : (
  <>
    <Alert
      show={showAlert}
      onClose={() => setShowAlert(false)}
      dismissible
      variant='success'
    >
      <h5> Nft Issued Successfully! </h5>
    </Alert>
    <h1>Order {order._id}</h1>
    <Row>
      <Col md={8}>
        <ListGroup variant='flush'>
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p>
              <strong>Name: </strong> {order.user.name}
            </p>
            <p>
              <strong>Email: </strong>{" "}
              <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
            </p>
            <p>
              <strong>Address:</strong>
              {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
              {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <Message variant='success'>
                Delivered on {order.deliveredAt}
              </Message>
            ) : (
              <Message variant='danger'>Not Delivered</Message>
            )}
          </ListGroup.Item>

          <ListGroup.Item>
            <h2>Payment Method</h2>
            <p>
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <Message variant='success'>Paid on {order.paidAt}</Message>
            ) : (
              <Message variant='danger'>Not Paid</Message>
            )}
          </ListGroup.Item>

          <ListGroup.Item>
            <h2>Order Items</h2>
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div>
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => {
                    return (
                      nftDetails.length > 0 &&
                      nftDetails.map((nft) => {
                        return (
                          nft.dbID === item.product && (
                            <div>
                              <ListGroup.Item key={index}>
                                <Row>
                                  <Col md={2}>
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fluid
                                      rounded
                                    />
                                  </Col>
                                  <Col sm={5}>
                                    <Link to={`/product/${item.product}`}>
                                      {item.name}
                                    </Link>
                                  </Col>
                                  <Col sm={5}>
                                    {item.qty} x ${item.price} = $
                                    {item.qty * item.price}
                                  </Col>
                                  <Col sm={5}>Owner Account : {nft.owner}</Col>
                                  <Col sm={5}>
                                    Warranty Period :{" "}
                                    {nft.warrantyPeriod.toNumber()} Months
                                  </Col>
                                  <Col sm={5}>
                                    Warranty Start Period :{" "}
                                    {new Date(
                                      nft.warrantyStartPeriod * 1000
                                    ).getUTCDate()}{" "}
                                    |{" "}
                                    {new Date(
                                      nft.warrantyStartPeriod * 1000
                                    ).getUTCMonth()}{" "}
                                    |{" "}
                                    {new Date(
                                      nft.warrantyStartPeriod * 1000
                                    ).getUTCFullYear()}
                                  </Col>
                                  <Col sm={5}>
                                    Warranty Expired :{" "}
                                    {nft.warrantyOver ? "True" : "False"}
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                              <Button onClick={()=> emailNFTDetails(nft.dbID,nft.tokenId,userInfo.name,userInfo.email, nft.owner)} disabled={!nftEmailButton}>
                                Email NFT Details
                              </Button>
                            </div>
                          )
                        )
                      })
                    )
                  })}
                </ListGroup>
                <Button onClick={getNftData} disabled={nftDetails.length > 0}>
                  Get NFT Data
                </Button>

              </div>
            )}
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Items</Col>
                <Col>${order.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping</Col>
                <Col>${order.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax</Col>
                <Col>${order.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total</Col>
                <Col>${order.totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            {!order.isPaid && (
              <ListGroup.Item>
                {loadingPay && <Loader />}
                {!sdkReady ? (
                  <Loader />
                ) : (
                  <PayPalButton
                    amount={order.totalPrice}
                    onSuccess={successPaymentHandler}
                  />
                )}
              </ListGroup.Item>
            )}
            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn btn-block'
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
          </ListGroup>
          <ListGroup>
            <ListGroup.Item>
              {errorPay && <Message variant='danger'>{errorPay}</Message>}
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  </>
)
}

export default OrderScreen
