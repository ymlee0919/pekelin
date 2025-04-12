import { MdDelete, MdEditSquare, MdOutlineAdd, MdOutlineRemoveRedEye } from "react-icons/md";
import { CommonProps } from "../../../types/Common";

import { Link } from "react-router-dom";
import { EmptyEvent } from "../../../types/Events";
import { BasicVariantInfo } from "../../../store/remote/variants/Variants.Types";
import RouterTable from "../../../router/router.table";

interface VariantsTBarProps extends CommonProps {
    selectedItem: BasicVariantInfo | null;
    productId: number;
    onClickDelete: EmptyEvent;
    onClickChangeVisibility: EmptyEvent;
}

const VariantsTBar = (props : VariantsTBarProps) => {

    return <>
    <div className="navbar bg-gray-200 min-h-1 p-1">
        <div className="flex-1">
            <Link to={RouterTable.variants.new(props.productId)} className="btn btn-ghost text-slate-500 btn-sm text-sm mr-2 rounded-none">
                <MdOutlineAdd /> Add
            </Link>
                
            <Link to={RouterTable.variants.edit(props.productId, props.selectedItem?.variantId || 0)} className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
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

export default VariantsTBar;