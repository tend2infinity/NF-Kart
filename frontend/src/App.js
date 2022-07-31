import React from "react"
import { useState } from "react"
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom"
import { Container } from "react-bootstrap"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomeScreen from "./screens/HomeScreen"
import ProductScreen from "./screens/ProductScreen"
import CartScreen from "./screens/CartScreen"
import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import ProfileScreen from "./screens/ProfileScreen"
import ShippingScreen from "./screens/ShippingScreen"
import PaymentScreen from "./screens/PaymentScreen"
import PlaceOrderScreen from "./screens/PlaceOrderScreen"
import OrderScreen from "./screens/OrderScreen"
import UserListScreen from "./screens/UserListScreen"
import UserEditScreen from "./screens/UserEditScreen"
import ProductListScreen from "./screens/ProductListScreen"
import ProductEditScreen from "./screens/ProductEditScreen"
import OrderListScreen from "./screens/OrderListScreen"

import MarketplaceAbi from "./contractsData/Marketplace.json"
import MarketplaceAddress from "./contractsData/Marketplace-address.json"
import NFTabi from "./contractsData/NFT.json"
import NFTAddress from "./contractsData/NFT-address.json"
import { ethers } from "ethers"

const App = () => {
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})

  const web3Handler = async () => {
    console.log("yeah")
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    setAccount(accounts[0])
    //get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    //Set signer
    const signer = provider.getSigner()

    loadContracts(signer)
  }

  const loadContracts = async (signer) => {
    //fetch deployed copies of contracts
    const marketplace = new ethers.Contract(
      MarketplaceAddress.address,
      MarketplaceAbi.abi,
      signer
    )
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NFTAddress.address, NFTabi.abi, signer)
    setNFT(nft)
    console.log("fn completed")
  }
  return (
    <BrowserRouter>
      <Header
        account={account}
        setAccount={setAccount}
        setNFT={setNFT}
        setMarketplace={setMarketplace}
      />
      <main className='py-3'>
        <Switch>
          <Container>
            <Route path='/order/:id'>
              <OrderScreen />
            </Route>

            <Route path='/shipping' component={ShippingScreen} />
            <Route path='/payment' component={PaymentScreen} />
            <Route path='/placeorder' component={PlaceOrderScreen} />
            <Route
              path='/login'
              render={(props) => (
                <LoginScreen
                  {...props}
                  web3Handler={web3Handler}
                  account={account}
                />
              )}
            />
            <Route path='/register' component={RegisterScreen} />
            <Route path='/profile' component={ProfileScreen} />
            <Route path='/product/:id' component={ProductScreen} />
            <Route path='/cart/:id?' component={CartScreen} />
            <Route path='/admin/userlist' component={UserListScreen} />
            <Route path='/admin/user/:id/edit' component={UserEditScreen} />
            <Route
              path='/admin/productlist'
              component={ProductListScreen}
              exact
            />
            <Route
              path='/admin/productlist/:pageNumber'
              component={ProductListScreen}
              exact
            />
            <Route
              path='/admin/product/:id/edit'
              component={ProductEditScreen}
            />
            <Route path='/admin/orderlist' component={OrderListScreen} />
            <Route path='/search/:keyword' component={HomeScreen} exact />
            <Route path='/page/:pageNumber' component={HomeScreen} exact />
            <Route
              path='/search/:keyword/page/:pageNumber'
              component={HomeScreen}
              exact
            />
            <Route path='/' component={HomeScreen} exact />
          </Container>
        </Switch>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
