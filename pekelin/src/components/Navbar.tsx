import { MdDehaze } from "react-icons/md"
import db from "../database/db"
import { CategoryInfo } from "../database/database.types"
import { NavLink } from "react-router-dom"

const Navbar = () => {

    return <>
    <div className="px-5 navbar from-blue-200 to-blue-100 bg-gradient-to-t z-30 rounded-xl fixed m-4 w-auto min-h-4 left-2 right-2 shadow-md text-sky-800">
        <div className="navbar-start">
            <img src="/icon.png" className="max-h-8"></img>
                 <span className="text-xl pl-1">Pekelin</span>
            </div>
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <MdDehaze className="text-2xl" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content rounded-box bg-base-100 z-[1] mt-3 w-52 p-2 shadow">
                        <li>
                            <NavLink to="/" className="text-xl">Inicio</NavLink>
                        </li>
                        <li></li>
                        {db.Categories.map((category: CategoryInfo) => {
                            return <li key={category.categoryId}>
                                <NavLink to={`/${category.url}`}>{category.category}</NavLink>
                            </li>
                        })}
                        
                    </ul>
                </div>
            </div>
            
        </div>
    </>
}

export default Navbar