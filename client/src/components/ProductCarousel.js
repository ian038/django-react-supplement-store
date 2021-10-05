import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'
import { listTopProducts } from '../actions/productActions'

const ProductCarousel = () => {
    const dispatch = useDispatch()
    const productTop = useSelector(state => state.productTop)
    const { products, error, loading } = productTop

    useEffect(() => {
        dispatch(listTopProducts())
    }, [dispatch])

    return (
        loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
            <Carousel pause='hover' className='bg-dark'>
                {products.map(p => (
                    <Carousel.Item key={p._id}>
                        <Link to={`/product/${p._id}`}>
                            <Image src={p.image} alt={p.name} fluid />
                            <Carousel.Caption className='carousel.caption'>
                                <h4>{p.name} (${p.price})</h4>
                            </Carousel.Caption>
                        </Link>
                    </Carousel.Item>
                ))}
            </Carousel>
        )
    )
}

export default ProductCarousel
