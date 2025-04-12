import { createBrowserRouter } from "react-router-dom";

import NotFound from "./NotFound";
import Layout from "./Layout";

import Home from "../pages/Home";
import Category from "../pages/Category";
import Product from "../pages/Product";
import Variant from "../pages/Variant";
import Review from "../pages/Review";
import { Cart } from "../pages/Cart";

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
			},
			{
				path: "/:category",
				element: <Category />,
			},
			{
				path: "/:category/:product",
				element: <Product />,
			},
			{
				path: "/:category/:product/v/:variantId",
				element: <Variant />,
			},
			{
				path: "/review",
				element: <Review />,
			},
			{
				path: "/cart",
				element: <Cart />,
			},
		],
	},
]);

export default AppRouter;