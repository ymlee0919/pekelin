import { useRef, useImperativeHandle, forwardRef} from "react";
import { IOfferItem } from "../../../store/remote/offers/OfferInfo";
import { useForm } from "react-hook-form";
import { EventResult } from "../../../types/Events";
import toast from "react-hot-toast";
import { CommonProps } from "../../../types/Common";

interface EditOfferItemDialogProps extends CommonProps {
    onChange: (item: string, details?: string) => EventResult;
}

export interface HTMLEditOfferDialogElement extends HTMLDialogElement {
    setValues : (value: IOfferItem | null) => void;
}

const EditOfferItemDialog  = forwardRef((props : EditOfferItemDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);
    
    const {register, setValue, handleSubmit, formState: { errors }} = useForm<IOfferItem>();

    useImperativeHandle(ref, () => {
        return {
            showModal: () => {
                if(!!modalRef.current)
                    modalRef.current.showModal();
            },
            setValues: (value: IOfferItem) => {
                setValue("itemName", value.itemName);
                setValue("itemDetails", value.itemDetails);
            }
        }
    });

    let onSubmit = (data: IOfferItem) => {
        let result = props.onChange(data.itemName, data.itemDetails);
        if(result.success)
            modalRef.current?.close();
        else {
            toast.error(result.message);
        }
    }

    return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<dialog ref={modalRef} className="modal">
					<div className="modal-box">
						<h3 className="font-bold text-lg">Update offer element</h3>
						<label className="form-control w-full max-w-xs">
							<div className="label">
								<span className="label-text">Offer element</span>
							</div>
							<input
								{...register("itemName", { required: true })}
								type="text"
								placeholder="Offer element"
								className="input input-bordered w-full max-w-xs"
							/>
							{errors.itemName && (
								<div className="label">
									<span className="label-text text-red-500 text-sm">The offer is required</span>
								</div>
							)}
						</label>
						<label className="form-control w-full min-w-full">
							<div className="label">
								<span className="label-text">Details</span>
							</div>
							<input
								{...register("itemDetails")}
								type="text"
								placeholder="Offer details [Optional]"
								className="input input-bordered w-full min-w-full"
							/>
						</label>
						<div className="modal-action">
							<button type="submit" className="btn btn-info btn-sm mr-5">
								Apply
							</button>
							<a className="btn btn-sm" onClick={() => modalRef.current?.close()}>
								Close
							</a>
						</div>
					</div>
				</dialog>
			</form>
		</>
	);
});

export default EditOfferItemDialog;