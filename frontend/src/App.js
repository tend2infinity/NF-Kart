import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Container } from "react-bootstrap"
import HomeScreen from "./screens/HomeScreen"
import ProductScreen from "./screens/ProductScreen"
import CartScreen from "./screens/CartScreen"
import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import ProfileScreen from "./screens/ProfileScreen"

function App() {
  return (
    <Router>
      <div className='App'>
        <Header />
        <Switch>
          <React.Fragment>
            <main className='py-3'>
              <Container>
                <Route path='/login' component={LoginScreen} />
                <Route path='/register' component={RegisterScreen} />
                <Route path='/profile' component={ProfileScreen} />
                <Route path='/product/:id' component={ProductScreen} />
                <Route path='/cart/:id?' component={CartScreen} />
                <Route exact path='/' component={HomeScreen} />
              </Container>
            </main>
          </React.Fragment>
        </Switch>
        <Footer />
      </div>
    </Router>
  )
}

export default App
