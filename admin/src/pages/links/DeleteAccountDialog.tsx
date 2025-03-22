import { useRef, useImperativeHandle, forwardRef } from "react";
import { CommonProps } from "../../types/Common";
import toast from "react-hot-toast";
import { EventResult } from "../../types/Events";

export interface DeleteAccountDialogProps extends CommonProps {
    user: string;
    onChange: () => Promise<EventResult>;
}

const DeleteAccountDialog = forwardRef( (props : DeleteAccountDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => {
        return {
            showModal: () => {
                if(!!modalRef.current)
                    modalRef.current.showModal();
            }
        }
    });

    const onDelete = async () => {
        let loadingToast = toast.loading('Deleteing account...');
        let result = await props.onChange();
        toast.dismiss(loadingToast);

        if(result.success)
        {
            modalRef.current?.close();
            toast.success(result.message);
        }
        else {
            toast.error(result.message);
        }
    }

    return <>
        <dialog ref={modalRef} className="modal">
            <div className="modal-box bg-base-200">
                <h3 className="font-bold text-lg">Delete account</h3>
                <br></br>
                <p>Are you sure you want to delete the account of the user <span className="italic">{props.user}</span>?</p>
                <div className="modal-action">
                    <a className="btn btn-info btn-sm mr-5" onClick={onDelete}>Yes, delete</a>
                    <a className="btn btn-sm" onClick={()=>modalRef.current?.close()}>No, close</a>
                </div>
            </div>
        </dialog>
    </>
});

export default DeleteAccountDialog;