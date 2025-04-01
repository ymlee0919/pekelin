import { CommonProps } from "../../../types/Common";
import { EmptyEvent } from "../../../types/Events";
import useStores from "../../../hooks/useStores";
import { useEffect, useState } from "react";
import { Order } from "../../../store/remote/orders/Orders.Types";
import { StoreStatus } from "../../../store/remote/Store";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";

export interface OrderInfoModalProps extends CommonProps {
    orderId: number;
	onClose: EmptyEvent;
}

const OrderInfoModal = (props : OrderInfoModalProps) => {
    
    const [order, setOrder] = useState<Order | null>(null);
    const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    const [loadingError, setLoadingError] = useState<string>("");

    const stores = useStores();

    useEffect(() => {
        stores.ordersStore.get(props.orderId).then((order: Order) => {
            setOrder(order);
            setStatus(StoreStatus.READY);
        }).catch((error) => {
            setStatus(StoreStatus.ERROR);
            setLoadingError(error instanceof Error ? error.message : 'Unable to load the requested order');    
        });
    }, [props.orderId]);

    return <>
        <dialog className="modal modal-open" style={{zIndex: 1300}}>
            <div className="modal-box bg-base-200">
                {status == StoreStatus.LOADING ? <Loading /> : null}
                {status == StoreStatus.ERROR ? <ErrorMessage text={loadingError} /> : null}

                {(status == StoreStatus.READY && order) ? (<>
                    <h3 className="font-bold text-lg pb-2">Order details</h3>
                    <p className="py-2"><strong>Order: </strong> {order.title}</p>
                    {order.details && 
                        <p className="py-2"><strong>Details: </strong> {order.details}</p>
                    }
                    {order.note && 
                        <p className="py-2"><strong>Note: </strong> {order.note}</p>
                    }
                    {order.productImage && 
                        <div className="w-full flex content-center p-2">
                            <img src={(import.meta.env.VITE_IMG_URL ?? '') + order.productImage} className="w-24"></img>
                        </div>
                    }
                    <fieldset>
                        <legend>Client</legend>
                        <p className="py-2"><strong>Name: </strong> {order.Client.name}</p>
                        <p className="py-2"><strong>Place: </strong> {order.Client.place}</p>
                        <p className="py-2"><strong>Phone: </strong> {order.Client.phone}</p>
                    </fieldset>
                    <p className="py-2 text-sm"><strong>Created at: </strong> {(new Date(order.createdAt)).toLocaleString()}</p>
                </>) : null}
                <div className="modal-action">    
                    <a className="btn btn-sm" onClick={() => props.onClose()}> Close </a>
                </div>
            </div>
        </dialog>
    </>
};

export default OrderInfoModal;