import { CommonProps } from "../../../types/Common";
import toast from "react-hot-toast";
import { EmptyEvent, EventResult } from "../../../types/Events";
import { useForm } from "react-hook-form";
import useStores from "../../../hooks/useStores";
import { errorToEventResult } from "../../../types/Errors";
import { ReviewLink } from "../../../store/remote/reviews/Reviews.Types";

export interface DeleteLinkModalProps extends CommonProps {
    review: ReviewLink;
    reload: EmptyEvent;
	onClose: EmptyEvent;
}

const DeleteLinkModal = (props : DeleteLinkModalProps) => {
    const { handleSubmit } = useForm();
    const stores = useStores();

    const onDelete = async () : Promise<EventResult> => {
		try {
            return await stores.reviewLinksStore.delete(props.review.linkId);
        }
        catch (error) {
            return errorToEventResult(error, "Unable to delete the link");
        }
	}

    const onSubmit = async () => {
        let loadingToast = toast.loading('Deleting review link...');
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
                    <h3 className="font-bold text-lg">Delete review</h3>
                    <p>Are you sure you want to delete the link of the client <span className="italic">{props.review.clientName}</span>?</p>
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

export default DeleteLinkModal;