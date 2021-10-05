import React, { useState, useEffect } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails, updateProduct } from '../actions/productActions'
import FormContainer from '../components/FormContainer'

const ProductEdit = () => {
    const history = useHistory()
    const { productId } = useParams()
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    const dispatch = useDispatch()
    const productDetails = useSelector(state => state.productDetails)
    const { loading, product, error } = productDetails
    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, success, error: errorUpdate } = productUpdate

    useEffect(() => {
        if(success) {
            dispatch({ type: 'PRODUCT_UPDATE_RESET' })
            history.push('/admin/productlist')
        } else {
            if(!product.name || product._id !== Number(productId)) {
                dispatch(listProductDetails(productId))
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }
        }
    }, [dispatch, product, productId, history, success])

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }))
    }

    const uploadImage = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        formData.append('product_id', productId)
        setUploading(true)
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data' 
                }
            }
            const { data } = await axios.post('/api/products/upload/', formData, config)
            setImage(data)
            setUploading(false)
        } catch(error) {
            setUploading(false)
        }
    }

    return (
        <div>
            <Link to='/admin/productlist' className='btn btn-light my-3'>Back</Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? (<Loader /> ) : error ? (<Message variant='danger'>{error}</Message>) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId='name' className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="name" placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId='price' className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" placeholder="Enter price" value={price} onChange={e => setPrice(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId='image' className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="text" placeholder="Enter image" value={image} onChange={e => setImage(e.target.value)} />
                            <Form.Control type="file" onChange={uploadImage} />
                            {uploading && <Loader />}
                        </Form.Group>

                        <Form.Group controlId='brand' className="mb-3">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type="text" placeholder="Enter brand" value={brand} onChange={e => setBrand(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId='countinstock' className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control type="number" placeholder="Enter stock" value={countInStock} onChange={e => setCountInStock(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId='category' className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control type="text" placeholder="Enter category" value={category} onChange={e => setCategory(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId='description' className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter description" value={description} onChange={e => setDescription(e.target.value)} />
                        </Form.Group>

                        <Button type='submit' variant='primary'>
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </div>
    )
}

export default ProductEdit
