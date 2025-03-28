import { createBrowserRouter } from "react-router-dom";

import NotFound from "./NotFound";
import Layout from "./Layout";
import Home from "../pages/Home";

import routes from "../router/routes";

const AppRouter = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		errorElement: <NotFound />,
		children: [
			{
				index: true,
				element: <Home />,
				errorElement: <NotFound />,
			}, ...routes
		],
	},
]);

export default AppRouter;