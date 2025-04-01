import { MdDelete, MdEditSquare, MdInfo, MdOutlineAdd } from "react-icons/md";
import { CommonProps } from "../../../types/Common";
import { Link } from "react-router-dom";
import { EmptyEvent } from "../../../types/Events";
import { ReviewLink } from "../../../store/remote/reviews/Reviews.Types";


interface ReviewTBarProps extends CommonProps {
    selectedItem: ReviewLink | null,
    onClickAdd: EmptyEvent
    onClickUpdate: EmptyEvent
    onClickDelete: EmptyEvent
    onClickInfo: EmptyEvent
}

const ReviewTBar = (props : ReviewTBarProps) => {
    
    return <>
    <div className="navbar bg-gray-200 min-h-1 p-1">
        <div className="flex-1">
            <a
                className="btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none"
                onClick={props.onClickAdd}
            >
                <MdOutlineAdd /> Add
            </a>

            <Link
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                    props.selectedItem ?? "btn-disabled"
                }`}
                to={`/links/${props.selectedItem?.linkId}/edit`}
            >
                <MdEditSquare /> Edit
            </Link>

            <a
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                    (props.selectedItem && !props.selectedItem?.updatedAt)  || "btn-disabled"
                }`}
                onClick={props.onClickDelete}
            >
                <MdDelete /> Delete
            </a>

            <a
                className={`btn btn-ghost text-slate-500 btn-sm text-sm mx-2 rounded-none ${
                    (props.selectedItem)  || "btn-disabled"
                }`}
                onClick={props.onClickInfo}
            >
                <MdInfo /> Info
            </a>

        </div>
    </div>

    </>
}

export default ReviewTBar;