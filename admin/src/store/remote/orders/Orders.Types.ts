export enum OrderStatus {
	PENDING = 'PENDING',
	READY = 'READY', 
	DISPATCHED = 'DISPATCHED',
	DELIVERED = 'DELIVERED', 
	CANCELLED = 'CANCELLED'
}

export type OrderSearch = {
	status? : OrderStatus
}

export type OrderContent = {
	orderId: number;
	clientId: number;
	name: string;
	client: string;
	title: string;
	details?: string;
	note?: string;
	image?: string;
	status: OrderStatus;
	createdAt: Date;
}

type OrderClient = {
	name: string;
	place: string;
	phone?: string;
}

export type Order = {
	orderId: number;
	name: string;
	title: string;
	details?: string;
	note?: string;
	productImage?: string;
	status: OrderStatus;
	clientId: number;
	createdAt: Date;
	updatedAt: Date;

	Client: OrderClient;
}

export type OrderEntity = {
	orderId: number;
	name: string;
	title: string;
	details?: string;
	note?: string;
	productImage?: string;
	status: OrderStatus;
	clientId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderDTO {
    clientId: number;
    title: string;
    details?: string;
	note?: string;
    productImage?: string;
}