export const cartReducer = (state = { cartItems: [], shippingAddress: {} }, action) => {
    switch(action.type) {
        case 'CART_ADD_ITEM': 
            const item = action.payload
            const exists = state.cartItems.find(c => c.product === item.product)
            if(exists) {
                return { ...state, cartItems: state.cartItems.map(c => c.product === exists.product ? item : c) }
            } else {
                return { ...state, cartItems: [...state.cartItems, item] }
            }

        case 'CART_REMOVE_ITEM': 
            return { ...state, cartItems: state.cartItems.filter(c => c.product !== action.payload) }

        case 'CART_SAVE_SHIPPING_ADDRESS':
            return { ...state, shippingAddress: action.payload }

        case 'CART_SAVE_PAYMENT_METHOD':
            return { ...state, paymentMethod: action.payload }

        case 'CART_CLEAR_ITEMS':
            return { ...state, cartItems: [] }
        
        default:
            return state
    }   
}