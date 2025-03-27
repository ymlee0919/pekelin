import { useRef, useImperativeHandle, forwardRef } from "react";
import { CommonProps } from "../../types/Common";
import { useForm } from "react-hook-form";
import { IProductFeature } from "../../store/remote/products/ProductFeatures";
import toast from "react-hot-toast";
import { EventResult } from "../../types/Events";

export interface NewFeatureDialogProps extends CommonProps {
    onChange: (title:string, content?:string) => EventResult;
}

const NewFeatureDialog = forwardRef( (props : NewFeatureDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);

    const {register, reset, handleSubmit, formState: { errors }} = useForm<IProductFeature>({
        defaultValues: {
            title: '', content: ''
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
					<div className="modal-box bg-base-200">
						<h3 className="font-bold text-lg">New product feature</h3>
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
								Add
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

export default NewFeatureDialog;