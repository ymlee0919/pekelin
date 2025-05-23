import { CommonProps } from "../../../types/Common";
import toast from "react-hot-toast";
import { EmptyEvent, EventResult } from "../../../types/Events";
import { useForm } from "react-hook-form";
import useStores from "../../../hooks/useStores";
import { errorToEventResult } from "../../../types/Errors";
import { BasicVariantInfo } from "../../../store/remote/variants/Variants.Types";

export interface DeleteVariantModalProps extends CommonProps {
    variant: BasicVariantInfo;
    reload: EmptyEvent;
	onClose: EmptyEvent;
}

const DeleteVariantModal = (props : DeleteVariantModalProps) => {
    const { handleSubmit } = useForm();
    const stores = useStores();

    const onDelete = async () : Promise<EventResult> => {
		try {
            let result = await stores.variantsStore.delete(props.variant.productId, props.variant.variantId);
            if (result.success) props.reload();
            return result;
        }
        catch (error) {
            return errorToEventResult(error, "Unable to delete the variant");
        }
	}

    const onSubmit = async () => {
        let loadingToast = toast.loading('Deleting variant...');
        let result = await onDelete();
        toast.dismiss(loadingToast);

        if(result.success)
            toast.success(result.message);
        else 
            toast.error(result.message);
    }

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <dialog className="modal modal-open">
                <div className="modal-box bg-base-200">
                    <h3 className="font-bold text-lg">Delete variant</h3>
                    <br></br>
                    <p className="italic">{props.variant.name}</p>
                    <br></br>
                    <p>Are you sure you want to delete the selected variant?</p>
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

export default DeleteVariantModal;