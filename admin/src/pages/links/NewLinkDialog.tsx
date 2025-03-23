import { useRef, useImperativeHandle, forwardRef } from "react";
import { CommonProps } from "../../types/Common";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { EventResult } from "../../types/Events";

export interface NewLinkDialogProps extends CommonProps {
    onApply: (clientName: string, place: string) => Promise<EventResult>;
}

type ClientReview = {
    clientName: string,
    place: string
}

const NewLinkDialog = forwardRef( (props : NewLinkDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);

    const {register, reset, handleSubmit, formState: { errors }} = useForm<ClientReview>({
        defaultValues: {
            clientName: '', place: ''
        }
    });

    useImperativeHandle(ref, () => {
        return {
            showModal: () => {
                reset();
                modalRef.current?.showModal();
            }
        }
    });

    let onSubmit = async (data: ClientReview) => {
		let loadingToast = toast.loading("Creating link...");
		let result = await props.onApply(data.clientName, data.place);
		toast.dismiss(loadingToast);

		if (result.success) {
			modalRef.current?.close();
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	};

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <dialog ref={modalRef} className="modal">
                <div className="modal-box bg-base-200">
                    <h3 className="font-bold text-lg">New review link</h3>
                    <div className="flex flex-wrap gap-3">
                        <div className="w-7/12">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Client Name</span>
                                </div>
                                <input 
                                    {...register("clientName", {
                                        required: 'The name is required', 
                                        minLength: {
                                            value: 5, message: 'The name must contains 5 characters minimun'}
                                        }
                                    )} 
                                    type="text" 
                                    placeholder="Client name" 
                                    className="input input-bordered w-full max-w-xs" />

                                {errors.clientName && 
                                    <div className="label">
                                        <span className="label-text text-red-500 text-sm">{errors.clientName.message}</span>
                                    </div>}
                            </label>
                        </div>
                        <div className="w-7/12">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Plance</span>
                                </div>
                                <input 
                                    {...register("place", {
                                        required: 'The place is required', 
                                        minLength: {
                                            value: 5, message: 'The place must contains 5 characters minimun'}
                                        }
                                    )} 
                                    type="text" 
                                    placeholder="Place" 
                                    className="input input-bordered w-full max-w-xs" />

                                {errors.place && 
                                    <div className="label">
                                        <span className="label-text text-red-500 text-sm">{errors.place.message}</span>
                                    </div>}
                            </label>
                        </div>
                    </div>
                    
                    <div className="modal-action">
                        <button type="submit" className="btn btn-info btn-sm mr-5">Add</button>
                        <a className="btn btn-sm" onClick={()=>modalRef.current?.close()}>Close</a>
                    </div>
                </div>
            </dialog>
        </form>
    </>
});

export default NewLinkDialog;