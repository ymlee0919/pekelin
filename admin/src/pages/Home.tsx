import { MdOutlineBusinessCenter, MdOutlineCases, MdPeopleAlt } from "react-icons/md";
import Breadcrumbs from "../components/Breadcrumbs";
import { Link } from "react-router-dom";

import { useSelector } from 'react-redux'; 
import { RootState } from "../store/local/store"; 
import RouterTable from "../router/router.table";

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
			<h1 className="text-slate-500 text-3xl text-right">Administration Dashboard</h1>
			<br></br>
			<br></br>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
				<Link to={RouterTable.categories.root} className="shadow bg-base-100 rounded-2xl p-3 hover:shadow-md">
					<div className="stats">
						<div className="stat">
							<div className="stat-figure text-indigo-500">
								<MdOutlineCases className="text-6xl" />
							</div>
							<div className="stat-title text-slate-400">Categories</div>
							<div className="stat-value text-slate-500">{categories}</div>
						</div>
					</div>
				</Link>
				
				<Link to={RouterTable.products.root} className="shadow bg-base-100 rounded-2xl p-3 hover:shadow-md">
					<div className="stat">
						<div className="stat-figure text-indigo-500">
							<MdOutlineBusinessCenter className="text-6xl" />
						</div>
						<div className="stat-title text-slate-400">Products</div>
						<div className="stat-value text-slate-500">{products}</div>	
					</div>
				</Link>

				<Link to={RouterTable.accounts.root} className="shadow bg-base-100 rounded-2xl p-3 hover:shadow-md">
					<div className="stat">
						<div className="stat-figure text-indigo-500">
							<MdPeopleAlt className="text-6xl" />
						</div>
						<div className="stat-title text-slate-400">Accounts</div>
						<div className="stat-value text-slate-500">{accounts}</div>
					</div>
				</Link>
			</div>
		</>
	);
}

export default Home;