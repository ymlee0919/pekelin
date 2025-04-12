import React from "react";
import { IconType } from "react-icons";


interface SetpCardProps {
  title: string;
  description: string;
  Icon: IconType
}

const StepCard: React.FC<SetpCardProps> = ({ title, description, Icon }) => {
    return (
        <div className="lg:w-4/12 md:w-6/12 sm:w-full text-center content-center mx-auto">
            <div className="md:flex sm:inline-flex bg-blue-50 shadow-md md:rounded-full rounded-2xl p-3 mx-3 my-5">
                <div className="md:flex-none inline-block text-center content-center rounded-full max-h-19 max-w-19 w-19 h-19 p-4 bg-blue-200">
                    <Icon className="text-xl max-h-12 max-w-12 w-12 h-12 p-1 text-sky-500" />
                </div>
                <div className="flex-1 text-center ml-3 mr-4 pt-1">
                    <span className="text-xl border-b flex pb-1 mb-1 text-gray-500">
                        {title}
                    </span>
                    <p className="text-left text-gray-400 text-sm"
                        dangerouslySetInnerHTML={{ __html: description }}
                    >
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StepCard;