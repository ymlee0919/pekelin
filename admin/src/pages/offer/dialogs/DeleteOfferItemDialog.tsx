import { useRef, useImperativeHandle, forwardRef } from "react";
import { CommonProps } from "../../../types/Common";
import toast from "react-hot-toast";
import { EventResult } from "../../../types/Events";

export interface DeleteOfferItemDialogProps extends CommonProps {
    offerLabel: string;
    onChange: () => EventResult;
}

const DeleteOfferItemDialog = forwardRef( (props : DeleteOfferItemDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => {
        return {
            showModal: () => {
                if(!!modalRef.current)
                    modalRef.current.showModal();
            }
        }
    });

    const onDelete = () => {
        let result = props.onChange();
        if(result.success)
            modalRef.current?.close();
        else {
            toast.error(result.message);
        }
    }

    return <>
        <dialog ref={modalRef} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Delete offer element</h3>
                <br></br>
                <p className="italic">{props.offerLabel}</p>
                <br></br>
                <p>Are you sure you want to delete the selected offer item?</p>
                <div className="modal-action">
                    <a className="btn btn-info btn-sm mr-5" onClick={onDelete}>Yes, delete</a>
                    <a className="btn btn-sm" onClick={()=>modalRef.current?.close()}>No, close</a>
                </div>
            </div>
        </dialog>
    </>
});

export default DeleteOfferItemDialog;