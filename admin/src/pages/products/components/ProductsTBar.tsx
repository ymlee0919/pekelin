import { MdDelete, MdEditSquare, MdExpandMore, MdOutlineAdd, MdOutlineRemoveRedEye } from "react-icons/md";
import { CommonProps } from "../../../types/Common";

import { Link } from "react-router-dom";
import { EmptyEvent } from "../../../types/Events";
import { BasicProductInfo } from "../../../store/remote/products/Products.Types";
import RouterTable from "../../../router/router.table";

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
                <Link to={RouterTable.products.new} className="btn btn-ghost text-slate-500 btn-sm text-sm rounded-none mr-0">
                    <MdOutlineAdd /> Add
                </Link>
                <div className="dropdown rounded-none">
                    <div tabIndex={0} role="button" className="z-20 btn btn-ghost text-slate-500 btn-sm text-sm ml-0 mr-2 border-l-base-300 rounded-none"><MdExpandMore /></div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-none z-[1] w-52 p-0 shadow">
                        <li className="m-0 p-0">
                            <Link to={RouterTable.products.newSet} className="rounded-none">New set</Link>
                        </li>
                    </ul>
                </div>
            </div>
            
            <Link to={props.selectedItem?.isSet 
                    ? RouterTable.products.editSet(props.selectedItem?.productId || 0) 
                    : RouterTable.products.edit(props.selectedItem?.productId || 0)} 
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                        props.selectedItem ?? "btn-disabled"
                    }`}>
                <MdEditSquare /> <span className="hidden md:block">Edit</span>
            </Link>

            <a
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                onClick={props.onClickDelete}
            >
                <MdDelete /> <span className="hidden md:block">Delete</span>
            </a>

            <a
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                onClick={props.onClickChangeVisibility}
            >
                <MdOutlineRemoveRedEye /> <span className="hidden md:block">Show/Hide</span>
            </a>

        </div>
    </div>
    </>
}

export default ProductsTBar;