import { useRef, useImperativeHandle, forwardRef } from "react";
import { CommonProps } from "../../types/Common";
import toast from "react-hot-toast";
import { EventResult } from "../../types/Events";

export interface DeleteFeatureDialogProps extends CommonProps {
    feature: string;
    onChange: () => EventResult;
}

const DeleteFeatureDialog = forwardRef( (props : DeleteFeatureDialogProps, ref) => {

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
                <h3 className="font-bold text-lg">Delete product feature</h3>
                <br></br>
                <p className="italic">{props.feature}</p>
                <br></br>
                <p>Are you sure you want to delete the selected product feature?</p>
                <div className="modal-action">
                    <a className="btn btn-info btn-sm mr-5" onClick={onDelete}>Yes, delete</a>
                    <a className="btn btn-sm" onClick={()=>modalRef.current?.close()}>No, close</a>
                </div>
            </div>
        </dialog>
    </>
});

export default DeleteFeatureDialog;