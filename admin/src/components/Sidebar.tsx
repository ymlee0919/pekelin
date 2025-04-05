import React from 'react';
import {
	MdOutlineApps,
	MdBusinessCenter,
	MdOutlineCases,
	MdAccountCircle,
	MdLogout,
	//MdSave,
	MdLink,
	MdManageAccounts,
	MdSupervisorAccount,
	MdOutlineAssignmentTurnedIn,
	MdHandyman,
} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
//import toast from 'react-hot-toast';
//import useStores from '../hooks/useStores';
import RouterTable from '../router/router.table';
import RoleBasedComponent from './RoleBasedComponent';

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
	//const stores = useStores();

	const {logout} = useAuth();
	const navigate = useNavigate();
	
	const handleLogout = () => {
		navigate('/');
		logout();
	}

	/*const save = async () => {
		let loadingToast = toast.loading("Saving database...");
		let result = await stores.productsStore.save();
		toast.dismiss(loadingToast);

		if (result.success) {
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	}*/

 	return (
		<aside
			className={`drawer fixed lg:pt-14 lg:h-screen top-0 left-0 w-60 bg-gray-200 h-full lg:z-10 z-50 border-r border-gray-300 transform ${
				isOpen ? "translate-x-0" : "-translate-x-full"
			} lg:translate-x-0 transition-transform duration-200 ease-in-out`}
		>
			<div className="p-4 h-full overflow-y-auto">
				<ul className="menu p-1 pt-4 w-48 bg-gray-200 text-base-content">
					<li>
						<NavLink to="/" className="group text-sm text-gray-500 p-3 my-1">
							<span>
								<MdOutlineApps className="text-xl" />
							</span>
							<span>Dashboard</span>
						</NavLink>
					</li>
					<RoleBasedComponent roles={['Roles']}>
						<li>
							<NavLink to={RouterTable.roles.root} className="group text-sm text-gray-500 p-3 my-1">
								<span>
									<MdManageAccounts className="text-xl" />
								</span>
								<span>Roles</span>
							</NavLink>
						</li>
					</RoleBasedComponent>

					<RoleBasedComponent roles={['Account']}>
					<li>
						<NavLink to={RouterTable.accounts.root} className="group text-sm text-gray-500 p-3 my-1">
							<span>
								<MdAccountCircle className="text-xl" />
							</span>
							<span>Accounts</span>
						</NavLink>
					</li>
					</RoleBasedComponent>

					<RoleBasedComponent roles={['Categories']}>
					<li>
						<NavLink to={RouterTable.categories.root} className="group text-sm text-gray-500 p-3 my-1">
							<span>
								<MdOutlineCases className="text-xl" />
							</span>
							<span>Categories</span>
						</NavLink>
					</li>
					</RoleBasedComponent>

					<RoleBasedComponent roles={['Products']}>
					<li>
						<NavLink to={RouterTable.products.root} className="group text-sm text-gray-500 p-3 my-1">
							<span>
								<MdBusinessCenter className="text-xl" />
							</span>
							<span>Products</span>
						</NavLink>
					</li>
					</RoleBasedComponent>

					<RoleBasedComponent roles={['Clients']}>
					<li>
						<NavLink to={RouterTable.clients.root} className="group text-sm text-gray-500 p-3 my-1">
							<span>
								<MdSupervisorAccount className="text-xl" />
							</span>
							<span>Clients</span>
						</NavLink>
					</li>
					</RoleBasedComponent>

					<RoleBasedComponent roles={['Orders']}>
					<li>
						<NavLink to={RouterTable.orders.root} className="group text-sm text-gray-500 p-3 my-1">
							<span>
								<MdOutlineAssignmentTurnedIn className="text-xl" />
							</span>
							<span>Orders</span>
						</NavLink>
					</li>
					</RoleBasedComponent>

					<RoleBasedComponent roles={['Production']}>
					<li>
						<NavLink to={RouterTable.production.root} className="group text-sm text-gray-500 p-3 my-1">
							<span>
								<MdHandyman className="text-xl" />
							</span>
							<span>Production</span>
						</NavLink>
					</li>
					</RoleBasedComponent>

					<RoleBasedComponent roles={['Review']}>
					<li>
						<NavLink to={RouterTable.links.root} className="group text-sm text-gray-500 p-3 my-1">
							<span>
								<MdLink className="text-xl" />
							</span>
							<span>Review links</span>
						</NavLink>
					</li>
					</RoleBasedComponent>
					
					{/*<li></li>
					<li>
						<a className="group text-sm text-gray-500 p-3 my-1"
							onClick={save}
						>
							<span>
								<MdSave className="text-xl" />
							</span>
							<span>Save</span>
						</a>
					</li>*/}
					<li></li>
					<li className='sm:hidden block'>
						<a onClick={handleLogout} className="group text-sm text-gray-500 p-3 my-1">
							<span>
								<MdLogout className="text-xl" />
							</span>
							<span>Logout</span>
						</a>
					</li>
				</ul>
			</div>
		</aside>
  );
};

export default Sidebar;
