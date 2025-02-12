import { CommonProps } from "../types/Common";
import { NavLink } from "react-router-dom";

type BreadcrumbPage = {url: string, label: string};

interface BreadcrumbPages extends CommonProps {
    pages: Array<BreadcrumbPage>
}

const Breadcrumbs = (props: BreadcrumbPages) => {

    return <>
        <div className="breadcrumbs text-sm text-gray-500 border-b border-gray-200 pb-2 pl-3 mr-4">
            <ul>
                {
                    props.pages.map( (page : BreadcrumbPage, index) => {
                        return page.url != '.' 
                        ? 
                            <li key={index}>
                                <NavLink to={page.url}>{page.label}</NavLink>
                            </li> 
                        :
                            <li key={index}>{page.label}</li>
                    } )
                }
            </ul>
        </div>
        <br></br>
    </>
}

export default Breadcrumbs;