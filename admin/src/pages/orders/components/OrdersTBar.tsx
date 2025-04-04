import { MdDelete, MdEditSquare, MdExpandMore, MdOutlineAdd, MdOutlineTaskAlt } from "react-icons/md";
import { CommonProps } from "../../../types/Common";
import { OrderContent, OrderStatus } from "../../../store/remote/orders/Orders.Types";
import { Link } from "react-router-dom";
import { EmptyEvent } from "../../../types/Events";
import RouterTable from "../../../router/router.table";

interface OrdersTBarProps extends CommonProps {
    selectedItem: OrderContent | null,
    onClickDelete: EmptyEvent
    onClickStatus: (status : OrderStatus) => void;
}

const OrdersTBar = (props : OrdersTBarProps) => {

    return <>
    <div className="navbar bg-gray-200 min-h-1 p-1">
        <div className="flex-1">
            <Link to={RouterTable.orders.new} className="btn btn-ghost text-slate-500 btn-sm text-sm mr-2 rounded-none">
                <MdOutlineAdd /> Add
            </Link>

            <Link
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                to={RouterTable.orders.edit(props.selectedItem?.orderId || 0)}
            >
                <MdEditSquare /> Edit
            </Link>

            <a
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                onClick={props.onClickDelete}
            >
                <MdDelete /> Delete
            </a>
            <div>
                <div className="dropdown rounded-none">
                    <div tabIndex={0} 
                        role="button" 
                        className={`z-20 btn btn-ghost text-slate-500 btn-sm text-sm ml-0 mr-2 border-l-base-300 rounded-none ${
                            props.selectedItem ?? "btn-disabled"
                        }`}>
                        <MdOutlineTaskAlt /> Status <MdExpandMore />
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-none z-30 w-52 p-0 shadow">
                        <li className="m-0 p-0">
                            <a onClick={() => props.onClickStatus(OrderStatus.PENDING)} className="rounded-none">PENDING</a>
                        </li>
                        <li className="m-0 p-0">
                            <a onClick={() => props.onClickStatus(OrderStatus.READY)} className="rounded-none">READY</a>
                        </li>
                        <li className="m-0 p-0">
                            <a onClick={() => props.onClickStatus(OrderStatus.DISPATCHED)} className="rounded-none">DISPATCHED</a>
                        </li>
                        <li className="m-0 p-0">
                            <a onClick={() => props.onClickStatus(OrderStatus.DELIVERED)} className="rounded-none">DELIVERED</a>
                        </li>
                        <li className="m-0 p-0">
                            <a onClick={() => props.onClickStatus(OrderStatus.CANCELLED)} className="rounded-none">CANCELLED</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    </>
}

export default OrdersTBar;