import { MdAccountCircle, MdLink, MdManageAccounts, MdOutlineAssignmentTurnedIn, MdOutlineBusinessCenter, MdOutlineCases, MdSupervisorAccount } from "react-icons/md";
import Breadcrumbs from "../components/Breadcrumbs";
import { Link } from "react-router-dom";

import { useSelector } from 'react-redux'; 
import { RootState } from "../store/local/store"; 
import RouterTable from "../router/router.table";
import RoleBasedComponent from "../components/RoleBasedComponent";
import { GiSewingMachine } from "react-icons/gi";

const Home = () => {
    const categories = useSelector((state: RootState) => state.global.categories); 
    const products = useSelector((state: RootState) => state.global.products);
    const orders = useSelector((state: RootState) => state.global.orders);
    const production = useSelector((state: RootState) => state.global.production);
    const clients = useSelector((state: RootState) => state.global.clients);
    const links = useSelector((state: RootState) => state.global.links);
    
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
			<div className="flex flex-wrap">
				<RoleBasedComponent roles={['Categories', 'Products']}>
					<div className="w-full md:w-1/2 p-3">
						<h2 className="text-slate-400 text-xl border-b mb-3">Products</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
							<RoleBasedComponent roles={['Categories']}>
								<Link to={RouterTable.categories.root} className="shadow bg-base-100 rounded-2xl p-3 hover:shadow-md">
									<div className="stat">
										<div className="stat-figure text-indigo-500">
											<MdOutlineCases className="text-6xl" />
										</div>
										<div className="stat-title text-slate-400">Categories</div>
										<div className="stat-value text-slate-500">{categories}</div>
									</div>
								</Link>
							</RoleBasedComponent>
							
							<RoleBasedComponent roles={['Products']}>
								<Link to={RouterTable.products.root} className="shadow bg-base-100 rounded-2xl p-3 hover:shadow-md">
									<div className="stat">
										<div className="stat-figure text-indigo-500">
											<MdOutlineBusinessCenter className="text-6xl" />
										</div>
										<div className="stat-title text-slate-400">Products</div>
										<div className="stat-value text-slate-500">{products}</div>	
									</div>
								</Link>
							</RoleBasedComponent>
						</div>
					</div>
				</RoleBasedComponent>

				<RoleBasedComponent roles={['Production', 'Orders']}>
					<div className="w-full md:w-1/2 p-3">
						<h2 className="text-slate-400 text-xl border-b mb-3">Production</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
							<RoleBasedComponent roles={['Production']}>
								<Link to={RouterTable.production.root} className="shadow bg-base-100 rounded-2xl p-3 hover:shadow-md">
									<div className="stat">
										<div className="stat-figure text-indigo-500">
											<GiSewingMachine className="text-6xl" />
										</div>
										<div className="stat-title text-slate-400">Production</div>
										<div className="stat-value text-slate-500">{production}</div>
									</div>
								</Link>
							</RoleBasedComponent>

							<RoleBasedComponent roles={['Orders']}>
								<Link to={RouterTable.orders.root} className="shadow bg-base-100 rounded-2xl p-3 hover:shadow-md">
									<div className="stat">
										<div className="stat-figure text-indigo-500">
											<MdOutlineAssignmentTurnedIn className="text-6xl" />
										</div>
										<div className="stat-title text-slate-400">Orders</div>
										<div className="stat-value text-slate-500">{orders}</div>
									</div>
								</Link>
							</RoleBasedComponent>
						</div>
					</div>
				</RoleBasedComponent>

				<RoleBasedComponent roles={['Clients', 'Review']}>
					<div className="w-full md:w-1/2 p-3">
						<h2 className="text-slate-400 text-xl border-b mb-3">Marketing</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
							<RoleBasedComponent roles={['Clients']}>
								<Link to={RouterTable.clients.root} className="shadow bg-base-100 rounded-2xl p-3 hover:shadow-md">
									<div className="stat">
										<div className="stat-figure text-indigo-500">
											<MdSupervisorAccount className="text-6xl" />
										</div>
										<div className="stat-title text-slate-400">Clients</div>
										<div className="stat-value text-slate-500">{clients}</div>
									</div>
								</Link>
							</RoleBasedComponent>

							<RoleBasedComponent roles={['Review']}>
								<Link to={RouterTable.links.root} className="shadow bg-base-100 rounded-2xl p-3 hover:shadow-md">
									<div className="stat">
										<div className="stat-figure text-indigo-500">
											<MdLink className="text-6xl" />
										</div>
										<div className="stat-title text-slate-400">Reviews</div>
										<div className="stat-value text-slate-500">{links}</div>
									</div>
								</Link>
							</RoleBasedComponent>
						</div>
					</div>
				</RoleBasedComponent>

				<RoleBasedComponent roles={['Account', 'Roles']}>
					<div className="lw-full md:w-1/2 p-3">
						<h2 className="text-slate-400 text-xl border-b mb-3">Management</h2>
						<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
							<RoleBasedComponent roles={['Account']}>
								<Link to={RouterTable.accounts.root} className="rounded-2xl p-3 hover:shadow-md">
									<div className="text-center grid justify-center p-2">
										<div className="text-indigo-500">
											<MdAccountCircle className="text-6xl" />
										</div>
										<div className=" text-slate-400">Accounts</div>
									</div>
								</Link>
							</RoleBasedComponent>

							<RoleBasedComponent roles={['Roles']}>
								<Link to={RouterTable.roles.root} className="rounded-2xl p-3 hover:shadow-md">
									<div className="text-center grid justify-center p-2">
										<div className="text-indigo-500">
											<MdManageAccounts className="text-6xl" />
										</div>
										<div className=" text-slate-400">Roles</div>
									</div>
								</Link>
							</RoleBasedComponent>
						</div>
					</div>
				</RoleBasedComponent>
			</div>
		</>
	);
}

export default Home;