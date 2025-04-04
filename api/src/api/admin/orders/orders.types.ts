import { OrderStatus } from '@prisma/client';

export type OrderContent = {
	orderId: number;
    clientId: number;
    name: string;
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