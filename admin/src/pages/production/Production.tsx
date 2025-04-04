import { useEffect, useState} from "react";

import useStores from "../../hooks/useStores";
import { StoreStatus } from "../../store/remote/Store";

import Loading from "../../components/Loading";
import ErrorMessage  from "../../components/ErrorMessage";
import Breadcrumbs from "../../components/Breadcrumbs";
import ProductionNoteDialog from "./dialogs/ProductionNoteDialog";
import { OrderContent, OrderStatus } from "../../store/remote/orders/Orders.Types";
import { MdDoneAll, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import { EventResult } from "../../types/Events";
import { errorToEventResult } from "../../types/Errors";

const Production =() => {

    const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
	const [showNote, setShowNote] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<OrderContent|null>(null);

    const stores = useStores();

    const onDone = async (orderId: number) : Promise<EventResult> => {
        try {
            return await stores.ordersStore.done(orderId);
        }
        catch (error) {
            return errorToEventResult(error, "Unable to delete the order");
        }
    }

    const onDoneClick = async (order: OrderContent) => {
        let loadingToast = toast.loading('Completing order...');
        let result = await onDone(order.orderId);
        toast.dismiss(loadingToast);

        if(result.success) {
            toast.success(result.message);
            reload();
        }
        else 
            toast.error(result.message);
    }

	// General functions
    const reload = () => {
        setStatus(StoreStatus.LOADING);
		setSelectedItem(null);
        
        stores.ordersStore.load({status: OrderStatus.PENDING}).then(
			(newStatus: StoreStatus) => {
				setStatus(newStatus);
			}
		);
    }
    
	useEffect(() => {
		reload();
		return () => {stores.ordersStore.release()}
	}, []);

    return (
		<>
			<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: ".", label: "Production" },
				]}
			/>

			{status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <ErrorMessage text={stores.ordersStore.lastError} /> : ""}

			{status == StoreStatus.READY ? (
				/** Main component */
				<>
                    <div className="text-right pb-2">
                        <p>Pending orders: <strong>{stores.ordersStore.content?.length}</strong></p>
                    </div>
					{
                        stores.ordersStore.content?.map((order: OrderContent) => {
                            return <div key={order.orderId} className="collapse collapse-arrow border border-base-300 bg-base-200 rounded-box my-2">
                                <input type="checkbox" />
                                <div className="collapse-title text-lg font-semibold">{order.title}</div>
                                <div className="collapse-content bg-base-100">
                                    <div className="flex flex-wrap gap-3">
                                        <div className="w-full text-right">
                                            <p className="font-light">{order.name}</p>
                                        </div>
                                        {order.image && 
                                            <div className="md:w-3/12 w-8/12">
                                                <img className="w-full" src={(import.meta.env.VITE_IMG_URL ?? '') + order.image}></img>
                                            </div>
                                        }
                                        <div className="md:w-8/12 w-11/12">
                                            
                                            {order.details && <p><strong>Details:</strong> {order.details}</p>}
                                            <p className="inline-flex">
                                                <strong>Note: </strong> &nbsp; {order.note} 
                                                <a className="px-2 mx-2 btn btn-ghost btn-sm btn-info"
                                                    onClick={() => {
                                                        setSelectedItem(order);
                                                        setShowNote(true);
                                                    }}
                                                >
                                                    <MdEdit className="text-2xl" />
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <a onClick={() => onDoneClick(order)} className="btn btn-primary btn-sm"><MdDoneAll className="text-2xl" /> Done</a>
                                    </div>
                                </div>
                            </div>
                        })
                    }

					{(selectedItem && showNote) &&
						<ProductionNoteDialog 
							order={selectedItem}
							reload={reload}
							onClose={() => setShowNote(false)}
						/>
					}
				</>
			) : (
				/** END OF Main component */

				""
			)}
		</>
	);
}

export default Production;