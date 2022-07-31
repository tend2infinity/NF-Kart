# NF-Kart
A web application hosting a full-fledged NFT based marketplace.

- Each product in the marketplace is linked to an NFT owned by the marketplace minted on Polygon Blockchain.
Upon purchase of product the ownership of the NFT is transferred to the User.

- The NFT can be used to claim ownership of the product as well as to claim warranty.

- An admin/brand can put their product on the marketplace without any knowledge of blockchain with the help of User Interface.


## System Design
![image](https://user-images.githubusercontent.com/61948033/182045333-7d029f9f-6941-4a9d-ae52-2e1d8e7e6798.png)
## Web Application Design
![image](https://user-images.githubusercontent.com/61948033/182045440-929ed92a-983a-41b7-8542-bd388f1a4610.png)
##Use Cases (in order of priority)
### P0: Add a product
![image](https://user-images.githubusercontent.com/61948033/182045627-c9cf6022-abac-4090-abd4-2928f72bdbd5.png)
### P0: Buying a product/Transfer of NFT ownership
![image](https://user-images.githubusercontent.com/61948033/182046184-e044ba7b-68ab-4ee3-bf2c-781964cd3d38.png)
### P0: Expiration of Warranty/Burning an NFT
![image](https://user-images.githubusercontent.com/61948033/182046193-41d21253-7931-42b8-a2f8-dd32daaad472.png)

### P1: Pay for a particular order
- The User is directed to the payment gateway of the previously selected order method(PayPal).
- The User follows the required steps and completes the payment.
### P1: Inspect the warranty information of an item
- The server keeps a check on the warranty time left. 
- After the warranty period is over, the NFT is destroyed and thus cannot be used to claim warranty.
### P1: Send Warranty Card to User’s Smartphone
- The NFT’s ownership is transferred to the User.
- The details(metadata) associated with the product are fetched.
- A warranty card is generated with product ID and NFT token.
- The generated card is sent to the User.
### P2: User
- Login/ Logout
- Register new user
- Browse, search products
- Add to Cart
- Place Order
- Rate products
- Edit user details
- Add product reviews
### P2: Admin
- Edit Product Details
- Delete Products
- Manage Orders and Mark as Delivered
- Manage Users
- Authorise new admins

## Future Scope
- Implementing an Authentication procedure for new Admin/Brands.
- Integrate multiple new payment gateways like Eth wallet etc.
- Usage of Soulbound NFTs (non-transferrable)
- Adding Gamification Construct to the loyalty program
- Optimising the transaction wait time










## Contributors ✨
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/klakshya17"><img src="https://avatars.githubusercontent.com/klakshya17" width="100px;" alt=""/><br /><sub><b>Kumar Lakshya</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/tend2infinity"><img src="https://avatars.githubusercontent.com/u/61948033?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Somya S. Singh</b></sub></a><br /></td>

  </tr>
</table>
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->



