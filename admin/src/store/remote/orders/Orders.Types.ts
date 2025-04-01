export enum OrderStatus {
	PENDING, READY, DELIVERED
}

export type OrderContent = {
	orderId: number;
	clientId: number;
	client: string;
	title: string;
	details?: string;
	note?: string;
	productImage?: string;
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
    productImage?: string;
}