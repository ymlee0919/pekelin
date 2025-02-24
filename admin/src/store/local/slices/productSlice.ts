import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../remote/products/Products.Types';

interface ProductStore {
    product : Product | null;
    fill : boolean
}

const initialState : ProductStore = {
    product : null,
    fill: false
}

const productSlice = createSlice({
    name: 'currentProduct',
    initialState,
    reducers : {
        setCurrentProduct: (state, action: PayloadAction<Product>) => {
            state.product = action.payload;
            state.fill = true;
        },

        releaseProduct: (state) => {
            state.product = null;
            state.fill = false;
        }
    }
});

export const { 
    setCurrentProduct, 
    releaseProduct
} = productSlice.actions;

export default productSlice.reducer;