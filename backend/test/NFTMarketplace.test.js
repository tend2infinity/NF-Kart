const { expect } = require("chai");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)
//wei is the smallest division of 1 ethereum , 1 ether = 10^18 wei

describe("NFTMarketplace", function () {
    let deployer, addr1, addr2, nft, marketplace
    let feePercent = 1;
    let URI = "ABC";
    let Warranty = 24;
    let dateInSecs;
    const sleep = (delay) => new Promise (( resolve) => setTimeout (resolve, delay));
    beforeEach(async function () {
        // get contract factories
        const NFT = await ethers.getContractFactory("NFT");
        const Marketplace = await ethers.getContractFactory("Marketplace");

        //get signers
        [deployer, addr1, addr2] = await ethers.getSigners()
        //Deploy contracts
        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy();
    });
    describe("Deployment", function () {
        it("Should track name and symbol of the nft collection", async function () {
            expect(await nft.name()).to.equal("DApp NFT")
            expect(await nft.symbol()).to.equal("DAPP")
        })
        it("Should track feeAccount of the marketplace", async function () {
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
        })
    })
    describe("Minting NFTs", function () {
        it("Should track each minted NFT", async function () {
            //addr1 mints an nft
            await nft.connect(addr1).mint()
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1); //return no of tokens owned by the account
            // expect(await nft.tokenURI(1)).to.equal(URI);

            //addr2 mints an nft
            // await nft.connect(addr2).mint(URI)
            // expect(await nft.tokenCount()).to.equal(2);
            // expect(await nft.balanceOf(addr2.address)).to.equal(1);
            // expect(await nft.tokenURI(2)).to.equal(URI);
        })
    })

    describe("Making merketplace items", function () {
        beforeEach(async function () {
            await nft.connect(addr1).mint()
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true) //imp to approve marketplace contract to transer the nft to the buyer
        })

        it("Should track new item , transfer NFT from seller to marketplace and emit Offered event", async function () {

            await expect(marketplace.connect(addr1).makeItem(nft.address, 1, 24)).to.emit(marketplace, "Offered")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    false,
                    24,
                    0,
                    false
                ) 

            //Owner of NFT should now br marketplace
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
            //item count should be equal to 1
            expect(await marketplace.itemCount()).to.equal(1)

            //get item from items mapping to check fields to ensure they are correct
            const item = await marketplace.items(1)
            expect(item.itemId).to.equal(1)
            expect(item.nft).to.equal(nft.address)
            expect(item.tokenId).to.equal(1)
            expect(item.sold).to.equal(false)
            expect(item.warrantyPeriod).to.equal(24)
            expect(item.warrantyOver).to.equal(false)

        })

    });
    describe("Purchasing marketplace items", function () {

        beforeEach(async function () {
            //addr1 mints an nft
            await nft.connect(addr1).mint()
            //addr1 approves marketplace to spend nft
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
            //addr1 creates a marketplace item
            await marketplace.connect(addr1).makeItem(nft.address, 1,8000)

        })

        it("Should update item as sold, transfer NFT to buyer and emit a Bought event",
         async function () {
            dateInSecs = Math.floor(new Date().getTime() / 1000);
            // addr2 purchases item
            await expect(marketplace.connect(addr2).purchaseItem(1,dateInSecs))
                .to.emit(marketplace, "Bought")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    true,
                    addr2.address,
                    8000,
                    dateInSecs,
                    false
                )


            //The buyer should now own the nft
            expect(await nft.ownerOf(1)).to.equal(addr2.address);

            //Item should be marked as sold
            expect((await marketplace.items(1)).sold).to.equal(true)
        });

        it("Should fail for invalid item ids and sold items ", async function () {
            //fails for invalid item ids
            dateInSecs = Math.floor(new Date().getTime() / 1000);

            await expect(
                marketplace.connect(addr2).purchaseItem(2, dateInSecs)
            ).to.be.revertedWith("item doesn't exist");
            await expect(
                marketplace.connect(addr2).purchaseItem(0, dateInSecs)
            ).to.be.revertedWith("item doesn't exist");


            // addr2 purchases item 1
            await marketplace.connect(addr2).purchaseItem(1, dateInSecs)
            // addr3 tries purchasing item 1 after its been sold 
            await expect(
                marketplace.connect(deployer).purchaseItem(1, dateInSecs)
            ).to.be.revertedWith("item already sold");
        });

        it("Should destroy the NFT after warranty completion", async function() {
            await marketplace.connect(addr2).purchaseItem(1, dateInSecs)
            await nft.connect(addr2).setApprovalForAll(marketplace.address, true)
            expect((await marketplace.items(1)).warrantyOver).to.equal(false);
            await(sleep(10000))
            await marketplace.destroySelectedExpiredContract(1)
            expect((await marketplace.items(1)).warrantyOver).to.equal(true); 
        })
    })

})