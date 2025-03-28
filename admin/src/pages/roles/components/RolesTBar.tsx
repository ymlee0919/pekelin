import { MdDelete, MdEditSquare, MdOutlineAdd } from "react-icons/md";
import { CommonProps } from "../../../types/Common";
import { Role } from "../../../store/remote/roles/Roles.Types";
import { Link } from "react-router-dom";
import { EmptyEvent } from "../../../types/Events";
import RouterTable from "../../../router/router.table";

interface RoleTBarProps extends CommonProps {
    selectedItem: Role | null,
    onClickDelete: EmptyEvent
}

const RoleTBar = (props : RoleTBarProps) => {

    return <>
    <div className="navbar bg-gray-200 min-h-1 p-1">
        <div className="flex-1">
            <Link to={RouterTable.roles.new} className="btn btn-ghost text-slate-500 btn-sm text-sm mr-2 rounded-none">
                <MdOutlineAdd /> Add
            </Link>

            <Link
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                to={RouterTable.roles.edit(props.selectedItem?.roleId || 0)}
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
        </div>
    </div>

    </>
}

export default RoleTBar;