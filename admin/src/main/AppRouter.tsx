import { createBrowserRouter } from "react-router-dom";

import NotFound from "./NotFound";
import Layout from "./Layout";

import Home from "../pages/Home";
import Products from "../pages/Products";
import NewProduct from "../pages/products/NewProduct";
import EditProduct from "../pages/products/EditProduct";
import Accounts from "../pages/Accounts";
import Categories from "../pages/Categories";
import ProductVariants from "../pages/ProductVariants";
import NewVariant from "../pages/variants/NewVariant";
import EditVariant from "../pages/variants/EditVariant";

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
				path: "/accounts",
				element: <Accounts />,
			},
			{
				path: "/categories",
				element: <Categories />,
			},
			{
				path: "/products",
				element: <Products />,
			},
			{
				path: "/products/new",
				element: <NewProduct />,
			},
			{
				path: "/products/:id/edit",
				element: <EditProduct />,
			},
			{
				path: "/products/:productId/variants",
				element: <ProductVariants />,
			},
			{
				path: "/products/:id/variants/new",
				element: <NewVariant />,
			},
			{
				path: "/products/:id/variants/:variant/edit",
				element: <EditVariant />,
			},
		],
	},
]);

export default AppRouter;