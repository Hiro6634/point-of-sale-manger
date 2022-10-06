import { createContext, useEffect, useReducer } from 'react';

import { createAction } from '../utils/reducer/reducer.utils';

export const ProductContext = createContext({
    product: null,
    hidden: true
});

const PRODUCT_ACTION_TYPES = {
    UPDATE_PRODUCT: 'UPDATE_PRODUCT',
    CLEAR_PRODUCT: 'CLEAR_PRODUCT',
    TOGGLE_EDIT_PRODUCT_HIDDEN: 'TOGGLE_EDIT_PRODUCT_HIDDEN'
}
const INITIAL_STATE = {
    product: null,
    hidden: true
}

const productReducer = (state, action) => {
    const {type, payload} = action;

    switch(type){
        case PRODUCT_ACTION_TYPES.UPDATE_PRODUCT:
            return{
                ...state,
                product: payload
            };
        case PRODUCT_ACTION_TYPES.CLEAR_PRODUCT:
            return{
                ...state,
                product: null
            };
        case PRODUCT_ACTION_TYPES.TOGGLE_EDIT_PRODUCT_HIDDEN:
            return{
                ...state,
                hidden: !state.hidden
            };
    
        default:
            throw new Error('unhandled type of ${type} in productReducer');
    }
}

export const ProductProvider = ({children}) => {
    const [{product}, dispatch] = useReducer(productReducer, INITIAL_STATE);
    
    const value = {product};

    return (
        <ProductProvider.Provider value={value}>{children}</ProductProvider.Provider>
    )
}