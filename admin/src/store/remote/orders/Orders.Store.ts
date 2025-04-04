import { Store } from "../Store";
import { EventResult } from "../../../types/Events";
import OrdersHttpProvider from "./Orders.HttpProvider";
import { Order, OrderContent, OrderDTO, OrderEntity, OrderSearch, OrderStatus } from "./Orders.Types";

export default class OrdersStore extends Store<Array<OrderContent>, OrderSearch> {
	private _provider: OrdersHttpProvider;

	constructor() {
		super();
		this._provider = new OrdersHttpProvider();
	}

	protected getData(params: OrderSearch|null): Promise<Array<OrderContent>> {
		return this._provider.load(params);
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
		newOrder: Partial<OrderDTO>
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

	async done(orderId: string | number): Promise<EventResult> {
		
		let id = typeof orderId == "string" ? parseInt(orderId) : orderId;
		await this.provider.setStatus(id, OrderStatus.READY);

		return {
			success: true,
			message: "Order successfully completed",
		};
	}

	async setStatus(orderId: string | number, status: OrderStatus): Promise<EventResult> {
		
		let id = typeof orderId == "string" ? parseInt(orderId) : orderId;
		await this.provider.setStatus(id, status);

		return {
			success: true,
			message: "Order successfully completed",
		};
	}
}

