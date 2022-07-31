import React from "react"
import { Route } from "react-router-dom"
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../actions/userActions"
import SearchBox from "./SearchBox"
const Header = (props) => {
  const { account, setAccount, setNFT, setMarketplace } = props;
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const dispatch = useDispatch()
  const logoutHandler = () => {
    setAccount(null);
    setNFT({});
    setMarketplace({});
    dispatch(logout())
  }

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <Navbar.Brand href='/'>NF-Kart</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Route render={({ history }) => <SearchBox history={history} />} />
            <Nav className='ml-auto'>
              <div style={{display:'flex', alignItems:'center'}}>
              <Nav.Link href='/cart'>
                <i className='fas fa-shopping-cart'></i>Cart
              </Nav.Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <NavDropdown.Item href='/profile'>Profile</NavDropdown.Item>

                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link href='/login'>
                  <i className='fa fa-user'></i>Sign In
                </Nav.Link>
              )}
              {userInfo && account ? (
                <Nav.Link
                  href={`https://etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button nav-button btn-sm ">
                  <Button variant="outline-light">
                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                  </Button>

                </Nav.Link>)
                :
                <div></div>}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <NavDropdown.Item href='/admin/userlist'>
                    Users
                  </NavDropdown.Item>
                  <NavDropdown.Item href='/admin/productlist'>
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item href='/admin/orderlist'>
                    Orders
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              </div>
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
