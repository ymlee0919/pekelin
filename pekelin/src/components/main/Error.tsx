import { CommonProps } from "../../types/Common";
import { HiOutlineFaceFrown } from "react-icons/hi2";

interface ErrorProps extends CommonProps {
    text: any
}

const Error = (props: ErrorProps) => {

    return <div className="py-24 text-center w-full">
        <div className="text-center inline-flex">
            <HiOutlineFaceFrown className="text-red-400 text-7xl my-6" />
        </div>
        
        <p className="text-red-700 text-xl">Ups...<br></br>Algo ha salido mal.</p>
        <br></br>
        <p className="text-red-700 text-sm">
            { props.text }
        </p>
    </div>
};

export default Error;