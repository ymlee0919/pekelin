import { Store } from "../Store";
import { EventResult } from "../../../types/Events";
import OrdersHttpProvider from "./Orders.HttpProvider";
import { Order, OrderContent, OrderDTO, OrderEntity } from "./Orders.Types";

export default class OrdersStore extends Store<Array<OrderContent>> {
	private _provider: OrdersHttpProvider;

	constructor() {
		super();
		this._provider = new OrdersHttpProvider();
	}

	protected getData(): Promise<Array<OrderContent>> {
		return this._provider.load();
	}

	protected get provider(): OrdersHttpProvider {
		return this._provider as OrdersHttpProvider;
	}

	async create(newOrder: OrderDTO): Promise<EventResult<OrderEntity | null>> {
		
		let created = await this.provider.createOrder(newOrder);
		
		return {
			success: true,
			message: "Order successfully created",
			info: created,
		};
	}

	
	async get(orderId: number|string): Promise<Order> {
		
		if(typeof orderId != "number")
			orderId = parseInt(orderId);

		let order = await this.provider.get(orderId);
		return order;
	}

	async update(
		orderId: string | number,
		newOrder: OrderDTO
	): Promise<EventResult<OrderEntity | null>> {

		let id = typeof orderId == "string" ? parseInt(orderId) : orderId;
		let updated = await this.provider.updateOrder(id, newOrder);

		return {
			success: true,
			message: "Order successfully updated",
			info: updated,
		};
	}
	
	async delete(orderId: string | number): Promise<EventResult> {
		
		let id = typeof orderId == "string" ? parseInt(orderId) : orderId;
		await this.provider.deleteOrder(id);

		return {
			success: true,
			message: "Order successfully deleted",
		};
	}
}

