import { NavLink } from "react-router-dom";
import { CategoryInfo } from "../../database/database.types";
import { CommonProps } from "../../types/Common";

export interface CategoryCardProps extends CommonProps {
    category: CategoryInfo
}

const CategoryCard = (props: CategoryCardProps) => {
    return <>
        <NavLink to={`/${props.category.url}`}>    
            <div key={props.category.categoryId} className="py-3">
                <div className="flex bg-blue-50 shadow-md rounded-3xl">
                    <img src={props.category.remoteUrl} className="flex-none sm:w-40 sm:h-40 w-36 h-36 rounded-3xl p-2"></img>
                    <div className="flex-1 text-center ml-1 mr-7 pt-4">
                        <span className="text-xl border-b flex pb-1 mb-1 text-gray-600">{props.category.category}</span>
                        <p className="text-left text-gray-400 font-medium">
                            {props.category.description}
                        </p>
                    </div>
                </div>
            </div>
        </NavLink>
    </>
}

export default CategoryCard;