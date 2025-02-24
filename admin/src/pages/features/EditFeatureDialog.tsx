import { useRef, useImperativeHandle, forwardRef} from "react";
import { IProductFeature } from "../../store/remote/products/ProductFeatures";
import { useForm } from "react-hook-form";
import { EventResult } from "../../types/Events";
import toast from "react-hot-toast";
import { CommonProps } from "../../types/Common";

export interface EditFeatureDialogProps extends CommonProps {
    onChange: (title:string, content?:string) => EventResult;
}

export interface HTMLEditFeatureDialogElement extends HTMLDialogElement {
    setValues : (value: IProductFeature | null) => void;
}

const EditOfferItemDialog  = forwardRef((props : EditFeatureDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);
    
    const {register, setValue, handleSubmit, formState: { errors }} = useForm<IProductFeature>();

    useImperativeHandle(ref, () => {
        return {
            showModal: () => {
                if(!!modalRef.current)
                    modalRef.current.showModal();
            },
            setValues: (value: IProductFeature) => {
                setValue("title", value.title);
                setValue("content", value.content);
            }
        }
    });

    let onSubmit = (data: IProductFeature) => {
        let result = props.onChange(data.title, data.content);
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
								<span className="label-text">Feature title</span>
							</div>
							<input
								{...register("title", { required: "The feature title is required" })}
								type="text"
								placeholder="Offer element"
								className="input input-bordered w-full max-w-xs"
							/>
							{errors.title && (
								<div className="label">
									<span className="label-text text-red-500 text-sm">{errors.title.message}</span>
								</div>
							)}
						</label>
						<label className="form-control w-full min-w-full">
							<div className="label">
								<span className="label-text">Feature content</span>
							</div>
							<input
								{...register("content")}
								type="text"
								placeholder="Feature content [Optional]"
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