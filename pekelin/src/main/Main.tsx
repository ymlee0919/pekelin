import { RouterProvider } from "react-router-dom"
import AppRouter from "./AppRouter";
import "../index.css"
import "../app.css"
import Loader from "./Loader";


const Main = () => {
    return <>
        <Loader>
            <RouterProvider router={AppRouter} />
        </Loader>
    </>
}

export default Main;