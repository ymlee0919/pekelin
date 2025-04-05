import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlobalState {
	user: string;
	userName: string;

	accounts: number;
	categories: number;
	products: number;
	orders: number; // Pending orders

	loaded: boolean;
}

interface InitialGlobalState {
	accounts: number;
	categories: number;
	products: number;
	orders: number;
}

interface UserInfo {
    user: string;
    userName: string;
}

const initialState: GlobalState = {
    user: '',
    userName: '',
    accounts: -1,
    categories: -1,
    products: -1,
    orders: -1,

    loaded: false
};

let isStateComplete = (state: GlobalState) : boolean => {
	for(const key in state){
		if (initialState.hasOwnProperty(key) && state.hasOwnProperty(key)){
			if (state[key as keyof GlobalState] == initialState[key as keyof GlobalState]) {
				return false;
			}
		}
	}
	return true;
}

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setAccounts: (state, action: PayloadAction<number>) => {
            state.accounts = action.payload;
			state.loaded = isStateComplete(state);
        },
        setCategories: (state, action: PayloadAction<number>) => {
            state.categories = action.payload;
			state.loaded = isStateComplete(state);
        },
        setProducts: (state, action: PayloadAction<number>) => {
            state.products = action.payload;
			state.loaded = isStateComplete(state);
        },
        setOrders: (state, action: PayloadAction<number>) => {
            state.orders = action.payload;
			state.loaded = isStateComplete(state);
        },
        setUser: (state, action: PayloadAction<UserInfo>) => {
            state.user = action.payload.user;
            state.userName = action.payload.userName;
			state.loaded = isStateComplete(state);
        },
        setData: (state, action: PayloadAction<InitialGlobalState>) => {
            Object.assign(state, action.payload);
			state.loaded = true;
        }
    },
});

export const { 
    setAccounts, 
    setCategories,
    setProducts,
    setOrders,
    setData, 
    setUser
} = globalSlice.actions;

export default globalSlice.reducer;
