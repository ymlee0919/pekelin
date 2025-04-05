import { lazy, ReactNode, Suspense } from "react";
import Loading from "../components/Loading";
import RouterTable from "./router.table";

const Roles = lazy(() => import("../pages/roles/Roles"));
const NewRole = lazy(() => import("../pages/roles/pages/NewRole"));
const EditRole = lazy(() => import("../pages/roles/pages/EditRole"));

const Accounts = lazy(() => import("../pages/accounts/Accounts"));
const NewAccount = lazy(() => import("../pages/accounts/pages/NewAccount"));
const EditAccount = lazy(() => import("../pages/accounts/pages/EditAccount"));
const CredentialsAccount = lazy(() => import("../pages/accounts/pages/CredentialsAccount"));

const Products = lazy(() => import("../pages/products/Products"));
const NewProduct = lazy(() => import("../pages/products/pages/NewProduct"));
const EditProduct = lazy(() => import("../pages/products/pages/EditProduct"));
const ProductInfo = lazy(() => import("../pages/products/pages/ProductInfo"));

const Categories = lazy(() => import("../pages/categories/Categories"));
const NewCategory = lazy(() => import("../pages/categories/pages/NewCategory"));
const EditCategory = lazy(() => import("../pages/categories/pages/EditCategory"));

const ProductVariants = lazy(() => import("../pages/variants/ProductVariants"));
const NewVariant = lazy(() => import("../pages/variants/pages/NewVariant"));
const EditVariant = lazy(() => import("../pages/variants/pages/EditVariant"));

const NewSet = lazy(() => import("../pages/products/pages/NewSet"));
const EditSet = lazy(() => import("../pages/products/pages/EditSet"));

const ReviewLinks = lazy(() => import("../pages/reviews/ReviewLinks"));
const EditReview = lazy(() => import("../pages/reviews/pages/EditReview"));

const Clients = lazy(() => import("../pages/clients/Clients"));
const NewClient = lazy(() => import("../pages/clients/pages/NewClient"));
const EditClient = lazy(() => import("../pages/clients/pages/EditClient"));

const Orders = lazy(() => import("../pages/orders/Orders"));
const NewOrder = lazy(() => import("../pages/orders/pages/NewOrder"));
const EditOrder = lazy(() => import("../pages/orders/pages/EditOrder"));

const Production = lazy(() => import("../pages/production/Production"));

export type Route = {
  path: string;
  permission: string;
  element: ReactNode;
};

const routes : Route[] = [
    {
        path: RouterTable.roles.root,
        permission: "Roles",
        element: <Suspense fallback={<Loading/>}> <Roles /> </Suspense>
    },
    {
        path: RouterTable.roles.new,
        permission: "Roles",
        element: <Suspense fallback={<Loading/>}> <NewRole /> </Suspense>
    },
    {
        path: RouterTable.roles.edit(':roleId'),
        permission: "Roles",
        element: <Suspense fallback={<Loading/>}> <EditRole /> </Suspense>
    },
    {
        path: RouterTable.accounts.root,
        permission: "Accounts",
        element: <Suspense fallback={<Loading/>}> <Accounts /> </Suspense>
    },
    {
        path: RouterTable.accounts.new,
        permission: "Accounts",
        element: <Suspense fallback={<Loading/>}> <NewAccount /> </Suspense>
    },
    {
        path: RouterTable.accounts.edit(':id'),
        permission: "Accounts",
        element: <Suspense fallback={<Loading/>}> <EditAccount /> </Suspense>
    },
    {
        path: RouterTable.accounts.credentials(':id'),
        permission: "Accounts",
        element: <Suspense fallback={<Loading/>}> <CredentialsAccount /> </Suspense>
    },
    {
        path: RouterTable.categories.root,
        permission: "Categories",
        element: <Suspense fallback={<Loading/>}> <Categories /> </Suspense>
    },
    {
        path: RouterTable.categories.new,
        permission: "Categories",
        element: <Suspense fallback={<Loading/>}> <NewCategory /> </Suspense>
    },
    {
        path: RouterTable.categories.edit(':id'),
        permission: "Categories",
        element: <Suspense fallback={<Loading/>}> <EditCategory /> </Suspense>
    },
    {
        path: RouterTable.products.root,
        permission: "Products",
        element: <Suspense fallback={<Loading/>}> <Products /> </Suspense>
    },
    {
        path: RouterTable.products.new,
        permission: "Products",
        element: <Suspense fallback={<Loading/>}> <NewProduct /> </Suspense>
    },
    {
        path: RouterTable.products.newSet,
        permission: "Products",
        element: <Suspense fallback={<Loading/>}> <NewSet /> </Suspense>
    },
    {
        path: RouterTable.products.edit(':id'),
        permission: "Products",
        element: <Suspense fallback={<Loading/>}> <EditProduct /> </Suspense>
    },
    {
        path: RouterTable.products.editSet(':id'),
        permission: "Products",
        element: <Suspense fallback={<Loading/>}> <EditSet /> </Suspense>
    },
    {
        path: RouterTable.products.info(':productId'),
        permission: "Products",
        element: <Suspense fallback={<Loading/>}> <ProductInfo /> </Suspense>
    },
    {
        path: RouterTable.variants.root(':productId'),
        permission: "Variants",
        element: <Suspense fallback={<Loading/>}> <ProductVariants /> </Suspense>
    },
    {
        path: RouterTable.variants.new(':productId'),
        permission: "Variants",
        element: <Suspense fallback={<Loading/>}> <NewVariant /> </Suspense>
    },
    {
        path:  RouterTable.variants.edit(':productId', ':variantId'),
        permission: "Variants",
        element: <Suspense fallback={<Loading/>}> <EditVariant /> </Suspense>
    },
    {
        path: RouterTable.links.root,
        permission: "Reviews",
        element: <Suspense fallback={<Loading/>}> <ReviewLinks /> </Suspense>
    },
    {
        path: RouterTable.links.edit(':linkId'),
        permission: "Reviews",
        element: <Suspense fallback={<Loading/>}> <EditReview /> </Suspense>
    },
    {
        path: RouterTable.clients.root,
        permission: "Clients",
        element: <Suspense fallback={<Loading/>}> <Clients /> </Suspense>
    },
    {
        path: RouterTable.clients.new,
        permission: "Clients",
        element: <Suspense fallback={<Loading/>}> <NewClient /> </Suspense>
    },
    {
        path: RouterTable.clients.edit(':clientId'),
        permission: "Clients",
        element: <Suspense fallback={<Loading/>}> <EditClient /> </Suspense>
    },
    {
        path: RouterTable.orders.root,
        permission: "Orders",
        element: <Suspense fallback={<Loading/>}> <Orders /> </Suspense>
    },
    {
        path: RouterTable.orders.new,
        permission: "Orders",
        element: <Suspense fallback={<Loading/>}> <NewOrder /> </Suspense>
    },{
        path: RouterTable.orders.edit(':orderId'),
        permission: "Orders",
        element: <Suspense fallback={<Loading/>}> <EditOrder /> </Suspense>
    },{
        path: RouterTable.production.root,
        permission: "Production",
        element: <Suspense fallback={<Loading/>}> <Production /> </Suspense>
    },
];

export default routes;