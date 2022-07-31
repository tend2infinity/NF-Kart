import axios from "axios"
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import Message from "../components/Message"
import Loader from "../components/Loader"
import FormContainer from "../components/FormContainer"
import { listProductDetails, updateProduct, updateProductTokenId } from "../actions/productActions"
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants"
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { token } from "morgan"
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const ProductEditScreen = (props) => {
  const { match, history,account } = props
  const productId = match.params.id

  const nft = useSelector(state => state.contractDetails.nft)
  const marketplace = useSelector(state => state.contractDetails.marketplace)


  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)
  const [warrantyPeriod,setWarrantyPeriod] = useState(0)
  const [tokenURI, setTokenURI] = useState("")

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    setUploading(true)
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result)
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
        setUploading(false)
      } catch (error){
        console.log("ipfs image upload error: ", error)
        setUploading(false)
      }
    }
  }
  const createNFT = async () => {
    try{
      console.log(image)
      const uri = await mintThenList()
      return uri;
    } catch(error) {
      console.log("create nft error: ", error)
    }
  }
  const mintThenList = async () => {
    // mint nft 
    await(await nft.mint()).wait()
    const itemCount = await marketplace.itemCount()
    console.log("itemCount",itemCount);
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    const result = await client.add(JSON.stringify({id}));
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`
    console.log("uri",uri);
    setTokenURI(uri)
    console.log("TokenId",id)
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    await(await marketplace.makeItem(nft.address, id, warrantyPeriod)).wait()
    // dispatch(updateProductTokenId(id))
    return uri;
  }

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {

    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      history.push("/admin/productlist")
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
        setWarrantyPeriod(product.warrantyPeriod)
        setTokenURI(product.tokenURI)
      }
    }
  }, [dispatch, history, productId, product, successUpdate])

  // const uploadFileHandler = async (e) => {
  //   const file = e.target.files[0]
  //   const formData = new FormData()
  //   formData.append("image", file)
  //   setUploading(true)

  //   try {
  //     const config = {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }

  //     const { data } = await axios.post("/api/upload", formData, config)

  //     setImage(data)
  //     setUploading(false)
  //   } catch (error) {
  //     console.error(error)
  //     setUploading(false)
  //   }
  // }

  const submitHandler = async (e) => {

    e.preventDefault()
    console.log(image)
    if(warrantyPeriod>0) {
      const uri = await createNFT() 
      dispatch(
         updateProduct({
           _id: productId,
           name,
           price,
           image,
           brand,
           category,
           description,
           countInStock,
           warrantyPeriod,
           tokenURI,
         }) )
         dispatch(     
        updateProductTokenId({
          _id:productId,
          tokenURI: uri
        }))
    } 
    else{
      console.log("Add a warranty period to create an NFT");
    }
  }

  return (
    <>
    
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <input
                type='file'
                id='image-file'
                // label='Sleect File'
                custom
                onChange={uploadToIPFS}
              ></input>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='warrantyPeriod'>
              <Form.Label>Warranty period (in months)</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Warranty Period'
                value={warrantyPeriod}
                onChange={(e) => setWarrantyPeriod(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen
