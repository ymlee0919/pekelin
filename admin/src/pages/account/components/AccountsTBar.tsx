import { MdDelete, MdEditSquare, MdKey, MdOutlineAdd } from "react-icons/md";
import { CommonProps } from "../../../types/Common";
import { AccountContent } from "../../../store/remote/accounts/Accounts.Types";
import { Link } from "react-router-dom";
import { EmptyEvent } from "../../../types/Events";

interface AccountsTBarProps extends CommonProps {
    selectedItem: AccountContent | null,
    onClickDelete: EmptyEvent
}

const AccountsTBar = (props : AccountsTBarProps) => {

    return <>
    <div className="navbar bg-gray-200 min-h-1 p-1">
        <div className="flex-1">
            <Link to="/accounts/new" className="btn btn-ghost text-slate-500 btn-sm text-sm mr-2 rounded-none">
                <MdOutlineAdd /> Add
            </Link>

            <Link
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                to={`/accounts/${props.selectedItem?.userId}/edit`}
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

            <Link
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                to={`/accounts/${props.selectedItem?.userId}/credentials`}
            >
                <MdKey /> Credentials
            </Link>
        </div>
    </div>

    </>
}

export default AccountsTBar;