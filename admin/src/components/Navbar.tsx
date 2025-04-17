import React from "react";
import { MdAccountCircle, MdDehaze, MdLogout, MdOutlineClose } from "react-icons/md";
import { CommonProps } from "../types/Common";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from 'react-redux'; 
import { RootState } from "../store/local/store"; 
import { useNavigate } from "react-router-dom";

interface NavProps extends CommonProps {
	toggleSidebar: () => void;
	isOpen: boolean;
}

const Navbar: React.FC<NavProps> = ({ toggleSidebar, isOpen }) => {
	const user = useSelector((state: RootState) => state.global.user);
	const userName = useSelector((state: RootState) => state.global.userName);
	const navigate = useNavigate();
	const {logout} = useAuth();

	const handleLogout = () => {
		navigate('/');
		logout();
	}

	return (
	<>
		<div className="fixed lg:ml-56 h-12 from-gray-100 to-gray-300 bg-gradient-to-t opacity-75 z-20 left-0 right-0 top-0">
		</div>
		<div className="lg:px-16 sm:p-0 navbar from-indigo-800 to-indigo-900 bg-gradient-to-t text-white z-30 lg:rounded-3xl fixed lg:m-3 lg:w-auto lg:left-3 lg:right-3 shadow-xl">
			<div className="navbar-start pl-4">
				<img src="/icon.png" className="max-h-7"></img><p className="pl-1 font-semibold normal-case text-xl">Pekelin</p>
			</div>
			<div className="navbar-end sm:visible invisible">
				<div className="dropdown dropdown-end ">
					<div tabIndex={0} role="button" className="btn btn-ghost">
						<MdAccountCircle className="text-2xl"/> {user}
					</div>
					<ul
						tabIndex={0}
						className="menu menu-sm dropdown-content bg-indigo-800 rounded-none z-[1] mt-3 w-52 p-2 shadow-lg">
						<li className="px-3 py-1 text-lg">{userName}</li>
						<li></li>
						<li><a onClick={handleLogout}>Logout <MdLogout className=""/></a></li>
					</ul>
				</div>
			</div>
			<div className="flex-none">
				<button className="btn btn-square btn-ghost lg:hidden" onClick={toggleSidebar}>
				<div className={`icon-transition ${isOpen ? 'icon-close' : 'icon-open'}`}> 
					{isOpen ? <MdOutlineClose className="text-2xl" /> : <MdDehaze className="text-2xl" />}
				</div>
				</button>
			</div>
		</div>
	</>);
};

export default Navbar;