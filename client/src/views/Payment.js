import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { savePaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'

const Payment = () => {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart
    const dispatch = useDispatch()
    const history = useHistory()
    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    if(!shippingAddress.address) {
        history.push('/shipping')
    } 

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/login?redirect=placeorder')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='address' className="mb-3">
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check
                        type='radio'
                        label='PayPal or Credit Card'
                        id='paypal'
                        name='paymentMethod'
                        checked
                        onChange={e => setPaymentMethod(e.target.value)}
                        >
                        </Form.Check>
                    </Col>
                </Form.Group>
                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default Payment
