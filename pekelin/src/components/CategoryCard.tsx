import { NavLink } from "react-router-dom";
import { CategoryInfo } from "../database/database.types";
import { CommonProps } from "../types/Common";

export interface CategoryCardProps extends CommonProps {
    category: CategoryInfo
}

const CategoryCard = (props: CategoryCardProps) => {
    return <>
        <NavLink to={`/${props.category.url}`}>
            <div key={props.category.categoryId} className="py-3">
                <div className="flex bg-blue-50 shadow-md rounded-full">
                    <img src={props.category.remoteUrl} className="flex-none w-24 h-24 rounded-full p-2"></img>
                    <div className="flex-1 text-center ml-1 mr-7 pt-4">
                        <span className="text-xl border-b flex pb-1 mb-1 text-gray-600">{props.category.category}</span>
                        <p className="text-left text-gray-400 text-xs">
                            {props.category.description}
                        </p>
                    </div>
                </div>
            </div>
        </NavLink>
    </>
}

export default CategoryCard;