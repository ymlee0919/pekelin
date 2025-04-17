import { MdDelete, MdEditSquare, MdKey, MdOutlineAdd } from "react-icons/md";
import { CommonProps } from "../../../types/Common";
import { AccountContent } from "../../../store/remote/accounts/Accounts.Types";
import { Link } from "react-router-dom";
import { EmptyEvent } from "../../../types/Events";
import RouterTable from "../../../router/router.table";

interface AccountsTBarProps extends CommonProps {
    selectedItem: AccountContent | null,
    onClickDelete: EmptyEvent
}

const AccountsTBar = (props : AccountsTBarProps) => {

    return <>
    <div className="navbar bg-gray-200 min-h-1 p-1">
        <div className="flex-1">
            <Link to={RouterTable.accounts.new} className="btn btn-ghost text-slate-500 btn-sm text-sm mr-2 rounded-none">
                <MdOutlineAdd /> <span className="hidden md:block">Add</span>
            </Link>

            <Link
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                to={RouterTable.accounts.edit(props.selectedItem?.userId || 0)}
            >
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

            <Link
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                to={RouterTable.accounts.credentials(props.selectedItem?.userId || 0)}
            >
                <MdKey /> <span className="hidden md:block">Credentials</span>
            </Link>
        </div>
    </div>

    </>
}

export default AccountsTBar;