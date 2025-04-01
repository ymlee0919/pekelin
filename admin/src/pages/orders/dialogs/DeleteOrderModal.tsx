import { CommonProps } from "../../../types/Common";
import toast from "react-hot-toast";
import { EmptyEvent, EventResult } from "../../../types/Events";
import { OrderContent } from "../../../store/remote/orders/Orders.Types";
import { useForm } from "react-hook-form";
import useStores from "../../../hooks/useStores";
import { errorToEventResult } from "../../../types/Errors";

export interface DeleteOrderModalProps extends CommonProps {
    order: OrderContent;
    reload: EmptyEvent;
	onClose: EmptyEvent;
}

const DeleteOrderModal = (props : DeleteOrderModalProps) => {
    const { handleSubmit } = useForm();
    const stores = useStores();

    const onDelete = async () : Promise<EventResult> => {
		try {
            return await stores.ordersStore.delete(props.order.orderId);
        }
        catch (error) {
            return errorToEventResult(error, "Unable to delete the order");
        }
	}

    const onSubmit = async () => {
        let loadingToast = toast.loading('Deleting order...');
        let result = await onDelete();
        toast.dismiss(loadingToast);

        if(result.success) {
            toast.success(result.message);
            props.reload();
        }
            
        else 
            toast.error(result.message);
    }

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <dialog   className="modal modal-open">
                <div className="modal-box bg-base-200">
                    <h3 className="font-bold text-lg">Delete order</h3>
                    
                    <p>Are you sure you want to delete the order for <span className="italic">{props.order.title}</span>?</p>
                    <div className="modal-action">
                        <button type="submit" className="btn btn-error btn-sm mr-5">
                            Yes, delete
                        </button>
                        <a className="btn btn-sm" onClick={() => props.onClose()}>
                            No, close
                        </a>
                    </div>
                </div>
            </dialog>
        </form>
    </>
};

export default DeleteOrderModal;