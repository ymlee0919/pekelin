import { CommonProps } from "../../../types/Common";
import toast from "react-hot-toast";
import { EmptyEvent, EventResult } from "../../../types/Events";
import { AccountContent } from "../../../store/remote/accounts/Accounts.Types";
import { useForm } from "react-hook-form";
import useStores from "../../../hooks/useStores";
import { errorToEventResult } from "../../../types/Errors";

export interface DeleteAccountModalProps extends CommonProps {
    account: AccountContent;
    reload: EmptyEvent;
	onClose: EmptyEvent;
}

const DeleteAccountModal = (props : DeleteAccountModalProps) => {
    const { handleSubmit } = useForm();
    const stores = useStores();

    const onDelete = async () : Promise<EventResult> => {
		try {
            return await stores.accountsStore.delete(props.account.userId);
        }
        catch (error) {
            return errorToEventResult(error, "Unable to delete the account");
        }
	}

    const onSubmit = async () => {
        let loadingToast = toast.loading('Deleting account...');
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
                    <h3 className="font-bold text-lg">Delete account</h3>
                    
                    <p>Are you sure you want to delete the account of the user <span className="italic">{props.account.user}</span>?</p>
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

export default DeleteAccountModal;