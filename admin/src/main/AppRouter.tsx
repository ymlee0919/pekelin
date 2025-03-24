import { createBrowserRouter } from "react-router-dom";

import NotFound from "./NotFound";
import Layout from "./Layout";

import Home from "../pages/Home";

import Products from "../pages/Products";
import NewProduct from "../pages/products/NewProduct";
import EditProduct from "../pages/products/EditProduct";
import ProductInfo from "../pages/products/ProductInfo";

import Accounts from "../pages/Accounts";
import NewAccount from "../pages/account/pages/NewAccount";
import EditAccount from "../pages/account/pages/EditAccount";
import CredentialsAccount from "../pages/account/pages/CredentialsAccount";

import Categories from "../pages/Categories";

import ProductVariants from "../pages/ProductVariants";
import NewVariant from "../pages/variants/NewVariant";
import EditVariant from "../pages/variants/EditVariant";

import NewSet from "../pages/products/NewSet";
import EditSet from "../pages/products/EditSet";

import ReviewLinks from "../pages/ReviewLinks";


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
				path: "/accounts/new",
				element: <NewAccount />,
			},
			{
				path: "/accounts/:id/edit",
				element: <EditAccount />,
			},
			{
				path: "/accounts/:id/credentials",
				element: <CredentialsAccount />,
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
				path: "/products/new-set",
				element: <NewSet />,
			},
			{
				path: "/products/:id/edit",
				element: <EditProduct />,
			},
			{
				path: "/products/:id/edit-set",
				element: <EditSet />,
			},
			{
				path: "/products/:productId",
				element: <ProductInfo />,
			},
			{
				path: "/products/:productId/variants",
				element: <ProductVariants />,
			},
			{
				path: "/products/:productId/variants/new",
				element: <NewVariant />,
			},
			{
				path: "/products/:productId/variants/:variantId/edit",
				element: <EditVariant />,
			},
			{
				path: "/links",
				element: <ReviewLinks />,
			},
		],
	},
]);

export default AppRouter;