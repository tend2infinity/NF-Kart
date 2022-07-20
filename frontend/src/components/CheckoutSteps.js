import React from "react"
import { Nav } from "react-bootstrap"
import { NavLink } from "react-router-dom"

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav
      className='justify-content-center mb-4'
      style={{ border: "4px solid #ddd", padding: "2.5px" }}
    >
      {step1 ? (
        <Nav.Item>
          <Nav.Link as={NavLink} to='/login'>
            Sign In
          </Nav.Link>
        </Nav.Item>
      ) : (
        <Nav.Item>
          <Nav.Link disabled>Sign In</Nav.Link>
        </Nav.Item>
      )}
      <h2>{`>`}</h2>
      <Nav.Item>
        {step2 ? (
          <Nav.Link as={NavLink} to='/shipping'>
            {" "}
            Shipping
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Shipping</Nav.Link>
        )}
      </Nav.Item>
      <h2>{`>`}</h2>
      <Nav.Item>
        {step3 ? (
          <Nav.Link as={NavLink} to='/payment'>
            Payment
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Payment</Nav.Link>
        )}
      </Nav.Item>
      <h2>{`>`}</h2>{" "}
      <Nav.Item>
        {step4 ? (
          <Nav.Link as={NavLink} to='/placeorder'>
            Place Order
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps
