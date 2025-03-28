import { MdError } from "react-icons/md";
import { CommonProps } from "../types/Common";

interface ErrorProps extends CommonProps {
    text: any
}

const ErrorMessage = (props: ErrorProps) => {

    return <div className="flex justify-center px-5 pt-5">
        <div role="alert" className="alert alert-error shadow-md p-4 border-l-4 border-red-600 text-slate-700">
            <span><MdError /></span>
            <span>{ props.text }</span>
        </div>
    </div>
};

export default ErrorMessage;