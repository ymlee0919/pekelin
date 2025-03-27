import { MdDelete, MdEditSquare, MdExpandMore, MdOutlineAdd, MdOutlineRemoveRedEye } from "react-icons/md";
import { CommonProps } from "../../../types/Common";

import { Link } from "react-router-dom";
import { EmptyEvent } from "../../../types/Events";
import { BasicProductInfo } from "../../../store/remote/products/Products.Types";

interface ProductsTBarProps extends CommonProps {
    selectedItem: BasicProductInfo | null,
    onClickChangeVisibility: EmptyEvent
    onClickDelete: EmptyEvent
}

const ProductsTBar = (props : ProductsTBarProps) => {

    return <>
    <div className="navbar bg-gray-200 min-h-1 p-1">
        <div className="flex-1">
            <div>
                <Link to={"/products/new"} className="btn btn-ghost text-slate-500 btn-sm text-sm rounded-none mr-0">
                    <MdOutlineAdd /> Add
                </Link>
                <div className="dropdown rounded-none">
                    <div tabIndex={0} role="button" className="z-20 btn btn-ghost text-slate-500 btn-sm text-sm ml-0 mr-2 border-l-base-300 rounded-none"><MdExpandMore /></div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-none z-[1] w-52 p-0 shadow">
                        <li className="m-0 p-0">
                            <Link to={"/products/new-set"} className="rounded-none">New set</Link>
                        </li>
                    </ul>
                </div>
            </div>
            
            <Link to={`/products/${props.selectedItem?.productId}/${props.selectedItem?.isSet ? 'edit-set' : 'edit'}`} className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                        props.selectedItem ?? "btn-disabled"
                    }`}>
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

            <a
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                onClick={props.onClickChangeVisibility}
            >
                <MdOutlineRemoveRedEye /> Show/Hide
            </a>

        </div>
    </div>
    </>
}

export default ProductsTBar;