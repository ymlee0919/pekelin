import { RouterProvider } from "react-router-dom"
import AppRouter from "./AppRouter";
import "../index.css"
import "../app.css"
import Loader from "./Loader";
import { CartProvider } from "../cart/cart.context";

const Main = () => {
    return <>
        <Loader>
            <CartProvider>
                <RouterProvider router={AppRouter} />
            </CartProvider>
        </Loader>
    </>
}

export default Main;