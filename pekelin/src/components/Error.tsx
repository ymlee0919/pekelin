import { MdError } from "react-icons/md";
import { CommonProps } from "../types/Common";

interface ErrorProps extends CommonProps {
    text: any
}

const Error = (props: ErrorProps) => {

    return <div className="mockup-window bg-base-300 border">
        <div className="bg-base-200 flex justify-center px-4 pt-4 pb-28">
            <div role="alert" className="alert alert-error p-3">
                <span><MdError /></span>
                <span>{ props.text }</span>
            </div>
        </div>
    </div>
};

export default Error;