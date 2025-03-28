import Loading from "./Loading";
import { CommonProps } from "../types/Common";
import useStores from "../hooks/useStores";
import { useSelector, useDispatch } from "react-redux"; 
import { useEffect, useState } from "react";
import { StoreStatus } from "../store/remote/Store";
import { setData } from "../store/local/slices/globalSlice";
import { RootState } from "../store/local/store"; 
import ErrorMessage from "./ErrorMessage";

const Loader = (props: CommonProps) => {

    const loaded = useSelector((state: RootState) => state.global.loaded);
	const dispatch = useDispatch();

	const [status, setStatus] = useState<StoreStatus>(!!loaded ? StoreStatus.READY : StoreStatus.LOADING);
	const stores = useStores();

    useEffect(() => {
        if(!loaded) {
            setStatus(StoreStatus.LOADING);
            stores.dashboardStore.load(null).then(
                (newStatus: StoreStatus) => {
                    setStatus(newStatus)
                    if(newStatus == StoreStatus.READY && stores.dashboardStore.content) {
                        dispatch(setData(stores.dashboardStore.content));
                    }
                }
            );
        }
        return () => {stores.dashboardStore.release}
    }, []);

    return (
		<>
			{status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <ErrorMessage text={stores.dashboardStore.lastError} /> : ""}
			{status == StoreStatus.READY ? props.children : ""}
		</>
	);
        
};

export default Loader;