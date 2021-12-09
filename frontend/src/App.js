import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Container } from "react-bootstrap"
import HomeScreen from "./screens/HomeScreen"
import ProductScreen from "./screens/ProductScreen"
function App() {
  return (
    <Router>
      <div className='App'>
        <Header />
        <Switch>
          <main className='py-3'>
            <Container>
              <Route exact path='/'>
                <HomeScreen />
              </Route>
              <Route path='/product/:id'>
                <ProductScreen />
              </Route>
            </Container>
          </main>
        </Switch>
        <Footer />
      </div>
    </Router>
  )
}

export default App
