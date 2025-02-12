import { MdOutlineBusinessCenter, MdOutlineCases, MdPeopleAlt } from "react-icons/md";
import Breadcrumbs from "../components/Breadcrumbs";
import { NavLink } from "react-router-dom";

import { useSelector } from 'react-redux'; 
import { RootState } from "../store/local/store"; 

const Home = () => {
    const accounts = useSelector((state: RootState) => state.global.accounts); 
    const categories = useSelector((state: RootState) => state.global.categories); 
    const products = useSelector((state: RootState) => state.global.products);
    
    return (
		<>
			<Breadcrumbs
				pages={[
					{
						url: ".",
						label: "Dashboard",
					},
				]}
			/>
			<h1 className="text-slate-600 text-3xl text-right">Administration Dashboard</h1>
			<br></br>
			<br></br>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
				<div className="stats shadow bg-base-100">
					<div className="stat">
						<div className="stat-figure text-indigo-500">
							<MdOutlineCases className="text-6xl" />
						</div>
						<div className="stat-title text-slate-500">Categories</div>
						<div className="stat-value text-slate-600">{categories}</div>
						<div className="stat-actions text-right">
							<NavLink to={"/categories"} className="btn btn-sm btn-info btn-outline">
								Edit
							</NavLink>
						</div>
					</div>
				</div>

				<div className="stats shadow bg-base-100">
					<div className="stat">
						<div className="stat-figure text-indigo-500">
							<MdOutlineBusinessCenter className="text-6xl" />
						</div>
						<div className="stat-title text-slate-500">Products</div>
						<div className="stat-value text-slate-600">{products}</div>
						<div className="stat-actions text-right">
							<NavLink to={"/products"} className="btn btn-sm btn-info btn-outline">
								Edit
							</NavLink>
						</div>
					</div>
				</div>

				<div className="stats shadow bg-base-100">
					<div className="stat">
						<div className="stat-figure text-indigo-500">
							<MdPeopleAlt className="text-6xl" />
						</div>
						<div className="stat-title text-slate-500">Accounts</div>
						<div className="stat-value text-slate-600">{accounts}</div>
						<div className="stat-actions text-right">
							<NavLink to={"/accounts"} className="btn btn-sm btn-info btn-outline">
								Edit
							</NavLink>
						</div>
					</div>
				</div>

			</div>
		</>
	);
}

export default Home;