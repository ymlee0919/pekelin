import HttpProvider from "../HttpProvider";
import { AxiosProvider } from "../Provider";
import { Order, OrderContent, OrderDTO, OrderEntity } from "./Orders.Types";

export default class OrdersHttpProvider extends AxiosProvider<Array<OrderContent>> {
	async load(): Promise<Array<OrderContent>> {
		try {
			return await HttpProvider.get<null, Array<OrderContent>>("/orders");
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load orders");
		}
	}

	async get(orderId: number): Promise<Order> {
		try {
			return await HttpProvider.get<null, Order>(`/orders/${orderId}`);
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load the order");
		}
	}

	async createOrder(order: OrderDTO): Promise<OrderEntity | null> {
		try {
			let created = await HttpProvider.post<OrderDTO, OrderEntity>("/orders", order);
			return created;
		} catch (error: any) {
			this.handleError(error, "Unable to create the order");
		}
		return null;
	}

	
	async updateOrder(orderId: number, newOrder: OrderDTO): Promise<OrderEntity | null> {
		try {
			let updated = await HttpProvider.patch<OrderDTO, OrderEntity>(`/orders/${orderId}`, newOrder);
			return updated;
		} catch (error: any) {
			this.handleError(error, "Unable to update the order");
		}

		return null;
	}
	
	async deleteOrder(orderId: number): Promise<boolean> {
		try {
			await HttpProvider.delete<null, any>(`/orders/${orderId}`);
		} catch (error: any) {
			this.handleError(error, "Unable to delete the order");
		}

		return true;
	}
}