import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlobalState {
	user: string;
	userName: string;

    categories: number;
    products: number;
    orders: number;
    production: number;  // Pending orders
    clients: number;
    links: number;

	loaded: boolean;
}

interface InitialGlobalState {
    categories: number;
    products: number;
    orders: number;
    production: number;  // Pending orders
    clients: number;
    links: number;
}

interface UserInfo {
    user: string;
    userName: string;
}

const initialState: GlobalState = {
    user: '',
    userName: '',
    categories: -1,
    products: -1,
    orders: -1,
    clients: -1,
    links: -1,
    production: -1,

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
        setProduction: (state, action: PayloadAction<number>) => {
            state.production = action.payload;
			state.loaded = isStateComplete(state);
        },
        setClients: (state, action: PayloadAction<number>) => {
            state.clients = action.payload;
			state.loaded = isStateComplete(state);
        },
        setLinks: (state, action: PayloadAction<number>) => {
            state.links = action.payload;
			state.loaded = isStateComplete(state);
        },
        addOrder: (state) => {
            state.orders = state.orders + 1;
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
    setCategories,
    setProducts,
    setClients,
    setLinks,
    setProduction,
    setOrders,
    setData, 
    setUser,
    addOrder
} = globalSlice.actions;

export default globalSlice.reducer;
