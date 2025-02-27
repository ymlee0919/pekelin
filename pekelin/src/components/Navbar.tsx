import { MdDehaze } from "react-icons/md"

const Navbar = () => {

    return <div className="px-5 navbar from-base-300 to-base-100 bg-gradient-to-t z-30 rounded-3xl fixed m-4 w-auto min-h-6 left-2 right-2 shadow-md text-gray-700">
            <div className="navbar-start">
                <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <MdDehaze className="text-2xl" />
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li>
                        <a className="text-lg">Home</a>
                    </li>
                    <li></li>
                    <li>
                        <a>About</a>
                    </li>
                </ul>
                </div>
            </div>
            <div className="navbar-center">
                <a className="text-xl">Pekelin</a>
            </div>
        </div>
}

export default Navbar