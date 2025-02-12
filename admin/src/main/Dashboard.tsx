import { RouterProvider } from "react-router-dom"

import AppRouter from "../main/AppRouter";
import Loader from "../components/Loader"
import { RemoteStoresProvider } from "../hooks/useStores";

const Dashboard = () => {
  return (
		<>
			<RemoteStoresProvider>
				<Loader>
					<RouterProvider router={AppRouter} />
				</Loader>				
			</RemoteStoresProvider>
		</>
  );
}

export default Dashboard;