import { CommonProps } from "../../../types/Common";
import toast from "react-hot-toast";
import { EmptyEvent, EventResult } from "../../../types/Events";
import { useForm } from "react-hook-form";
import useStores from "../../../hooks/useStores";
import { errorToEventResult } from "../../../types/Errors";
import { OrderContent } from "../../../store/remote/orders/Orders.Types";

export interface ProductionNoteDialogProps extends CommonProps {
    order: OrderContent;
    reload: EmptyEvent;
	onClose: EmptyEvent;
}

type ProductionNoteFormFields = {
    note?: string
}

const ProductionNoteDialog = (props : ProductionNoteDialogProps) => {
    const { handleSubmit, register, formState: { errors } } = useForm<ProductionNoteFormFields>({
        defaultValues : {
            note: props.order.note
        }
    });

    const stores = useStores();

    const onSetNote = async (note:string | undefined) : Promise<EventResult> => {
		try {
            return await stores.ordersStore.update(props.order.orderId, {
                note
            });
        }
        catch (error) {
            return errorToEventResult(error, "Unable to update the order");
        }
	}

    const onSubmit = async (data: ProductionNoteFormFields) => {
        let loadingToast = toast.loading('Updating order...');
        let result = await onSetNote(data.note);
        toast.dismiss(loadingToast);

        if(result.success) {
            toast.success(result.message);
            props.reload();
            props.onClose();
        }
        else 
            toast.error(result.message);
    }

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <dialog   className="modal modal-open">
                <div className="modal-box bg-base-200">
                    <h3 className="font-bold text-lg">Set note</h3>
                    
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Note</span>
                        </div>
                        <textarea 
                            className="textarea textarea-bordered" 
                            placeholder="Note"
                            {...register("note", {
                                minLength: {
                                    value: 5, message: 'The note must contains 5 characters minimun'
                                }
                            })}
                        ></textarea>
                        {errors.note && 
                            <div className="label">
                                <span className="label-text text-red-500 text-sm">{errors.note.message}</span>
                            </div>}
                    </label>
                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary btn-sm mr-5">
                            Apply
                        </button>
                        <a className="btn btn-sm" onClick={() => props.onClose()}>
                            Cancel
                        </a>
                    </div>
                </div>
            </dialog>
        </form>
    </>
};

export default ProductionNoteDialog;