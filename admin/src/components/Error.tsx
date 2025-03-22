import { MdError } from "react-icons/md";
import { CommonProps } from "../types/Common";

interface ErrorProps extends CommonProps {
    text: any
}

const Error = (props: ErrorProps) => {

    return <div className="mockup-window bg-base-300 border m-6">
        <div className="bg-base-200 flex justify-center px-5 pt-5  pb-28">
            <div role="alert" className="alert alert-error shadow-md p-4 border-l-4 border-red-600 text-slate-700">
                <span><MdError /></span>
                <span>{ props.text }</span>
            </div>
        </div>
    </div>
};

export default Error;