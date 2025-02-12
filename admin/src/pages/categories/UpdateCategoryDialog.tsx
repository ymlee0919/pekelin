import { forwardRef, useRef, useImperativeHandle, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CommonProps } from "../../types/Common";
import { MdOutlineCloudUpload } from "react-icons/md";

type FormValues = { file: FileList; service: string };

export interface UpdateServiceDialogProps extends CommonProps {
	imageUrl: string | undefined;
	onChange: (data: FormData) => void;
}

const UpdateCategoryDialog = forwardRef( (props: UpdateServiceDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);
    const { register, setValue, handleSubmit, watch, reset, formState : {errors} } = useForm<FormValues>();
	const [preview, setPreview] = useState<string | null>(null);
	const file = watch("file");

    useImperativeHandle(ref, () => {
        return {
			showDialog: (service: string) => {
				setValue("service", service);
				modalRef.current?.showModal();
			},
			close: () => {
				modalRef.current?.close();
			},
		};
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => { 
        const formData = new FormData(); 
        if (file) {
            formData.append('image', file[0]);
        }
		formData.append("service", data.service);
        props.onChange(formData);           
    };

	useEffect(() => {
		if (file && file.length > 0) {
			const selectedFile = file[0];
			if (selectedFile && selectedFile.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setPreview(reader.result as string);
				};
				reader.readAsDataURL(selectedFile);
			} else {
				setPreview(null);
			}
		}
	}, [file]);

    return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<dialog ref={modalRef} className="modal">
					<div className="modal-box">
						<h3 className="font-bold text-lg">Update service</h3>
						<br></br>
						<label className="form-control w-full max-w-xs">
							<div className="label">
								<span className="label-text">Service</span>
							</div>
							<input
								{...register("service", {
									required: "The service name is required",
									minLength: {
										value: 5,
										message: "The service name must contains 5 characters minimun",
									},
								})}
								type="text"
								placeholder="Service name"
								className="input input-bordered w-full max-w-xs"
							/>

							{errors.service && (
								<div className="label">
									<span className="label-text text-red-500 text-sm">{errors.service.message}</span>
								</div>
							)}
						</label>
						<br></br>
						<label className="form-control w-full max-w-xs">
							<div className="label">
								<span className="label-text">
									Image <span className="text-gray-500 text-xs">(600px x 400px)</span>
								</span>
							</div>
						</label>
						<div className="indicator">
							<span className="indicator-item indicator-bottom z-50">
								<label
									htmlFor="editServiceUpload"
									className="flex  bg-slate-700 hover:bg-slate-500 text-sm text-white px-2 py-1 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]"
								>
									<MdOutlineCloudUpload className="text-2xl pr-2" />
									Upload
									<input
										type="file"
										id="editServiceUpload"
										{...register("file", { required: true })}
										accept="image/*"
										className="hidden"
									/>
								</label>
							</span>
							<div className="stack">
								{preview && (
									<div className="avatar">
										<div className="w-32 rounded">
											<img src={preview} className="opacity-95" />
										</div>
									</div>
								)}
								<div className="avatar">
									<div
										className="w-32 rounded"
										style={
											preview
												? {
														transform: "translateY(7%) translateX(7%) scale(100%)",
												  }
												: {}
										}
									>
										<img
											src={
												props.imageUrl &&
												`http://localhost:3000/images/services/${props.imageUrl}`
											}
										/>
									</div>
								</div>
							</div>
						</div>

						
						<div className="label">
							<span className="label-text text-gray-500 text-xs italic pl-2 pt-2">
								Upload a new image only if you want to update the current
							</span>
						</div>
						<div className="modal-action">
							<button type="submit" className="btn btn-info btn-sm mr-5">
								Apply
							</button>
							<a
								className="btn btn-sm"
								onClick={() => {
									reset();
									setPreview(null);
									modalRef.current?.close();
								}}
							>
								Close
							</a>
						</div>
					</div>
				</dialog>
			</form>
		</>
	);

})

export default UpdateCategoryDialog;