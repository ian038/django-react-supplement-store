import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails, createProductReview } from '../actions/productActions'

const Products = () => {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const { productId } = useParams()
    let history = useHistory()
    const productDetails= useSelector(state => state.productDetails)
    const { loading, product, error } = productDetails
    const userLogin= useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const productCreateReview= useSelector(state => state.productCreateReview)
    const { loading: loadingProductReview, success: successProductReview, error: errorProductReview } = productCreateReview
    const dispatch = useDispatch()

    useEffect(() => {
        if(successProductReview) {
            setRating(0)
            setComment('')
            dispatch({ type: 'PRODUCT_CREATE_REVIEW_RESET' })
        }
        dispatch(listProductDetails(productId))
    }, [dispatch, productId, successProductReview])

    const addToCart = () => {
        history.push(`/cart/${productId}?qty=${qty}`)
    }

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(createProductReview(productId, { rating, comment }))
    }

    return (
        <div>
            <Link to='/' className='btn btn-light my-3'>Back</Link>
            {
                loading ? <Loader /> : 
                    error ? <Message variant='danger'>{error}</Message> : 
                    (
                        <div>
                            <Row>
                                <Col md={6}>
                                    <Image src={product.image} alt={product.name} fluid />
                                </Col>
                                <Col md={3}>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <h3>{product.name}</h3>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            Price: ${product.price}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            Description: {product.description}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                                <Col md={3}>
                                    <Card>
                                        <ListGroup variant='flush'>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Price:</Col>
                                                    <Col><strong>${product.price}</strong></Col>
                                                </Row>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Status:</Col>
                                                    <Col>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            {product.countInStock > 0 && (
                                                    <ListGroup.Item>
                                                        <Row>
                                                            <Col>Qty</Col>
                                                            <Col xs='auto' className='my-1'>
                                                                <Form.Select
                                                                    value={qty}
                                                                    onChange={(e) => setQty(e.target.value)}
                                                                >
                                                                    {

                                                                        [...Array(product.countInStock).keys()].map(x => (
                                                                            <option key={x + 1} value={x + 1}>
                                                                                {x + 1}
                                                                            </option>
                                                                        ))
                                                                    }

                                                                </Form.Select>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                )}
                                            <ListGroup.Item>
                                                <Button onClick={addToCart} style={{ width: '100%' }} disabled={product.countInStock === 0} type='button'>
                                                    Add to Cart
                                                </Button>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <h4>Reviews</h4>
                                    {product.reviews.length === 0 && <Message variant='primary'>No reviews</Message>}
                                    <ListGroup variant='flush'>
                                        {product.reviews.map(review => (
                                            <ListGroup.Item key={review._id}>
                                                <strong>{review.name}</strong>
                                                <Rating value={review.rating} color='#f8e825' />
                                                <p>{new Date(review.createdAt).toDateString()}</p>
                                                <p>{review.comment}</p>
                                            </ListGroup.Item>
                                        ))}
                                        <ListGroup.Item>
                                            <h4>Write a review</h4>
                                            {loadingProductReview && <Loader />}
                                            {successProductReview && <Message variant='success'>Review submitted successfully!</Message>}
                                            {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                                            {userInfo ? (
                                                <Form onSubmit={handleSubmit}>
                                                    <Form.Group controlId='rating' className="mb-3">
                                                        <Form.Label>Rating</Form.Label>
                                                        <Form.Select value={rating} onChange={e => setRating(e.target.value)}>
                                                            <option value=''>Select Rating</option>
                                                            <option value='1'>1 - Poor</option>
                                                            <option value='2'>2 - Fair</option>
                                                            <option value='3'>3 - Good</option>
                                                            <option value='4'>4 - Very Good</option>
                                                            <option value='5'>5 - Excellent</option>
                                                        </Form.Select>
                                                    </Form.Group>

                                                    <Form.Group controlId='comment' className='mb-3'>
                                                        <Form.Label>Review</Form.Label>
                                                        <Form.Control as='textarea' rows={5} value={comment} onChange={e => setComment(e.target.value)} />
                                                    </Form.Group> 
                                                    <Button disabled={loadingProductReview} type='submit' variant='primary'>
                                                        Submit
                                                    </Button>
                                                </Form>
                                            ) : (
                                                <Message variant='primary'>Please <Link to='/login'>login</Link> to write a review</Message>
                                            )}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </div>
                    )
            }
        </div>
    )
}

export default Products