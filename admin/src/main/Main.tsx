import { useAuth } from "../hooks/useAuth"
import Dashboard from "./Dashboard";
import LoginForm from "./Login";

const Main = () => {

    const {user} = useAuth();

    if(!user)
        return <LoginForm/>;

    return <Dashboard/>
    
}

export default Main;