import { forwardRef, useRef, useImperativeHandle, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CommonProps } from "../../types/Common";
import { MdImageSearch } from "react-icons/md";

type FormValues = { file: FileList; category: string; description: string };

export interface UpdateCategoryDialogProps extends CommonProps {
	imageUrl: string | undefined;
	onChange: (data: FormData) => void;
}

const UpdateCategoryDialog = forwardRef( (props: UpdateCategoryDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);
    const { register, setValue, handleSubmit, watch, reset, formState : {errors} } = useForm<FormValues>();
	const [preview, setPreview] = useState<string | null>(null);
	const file = watch("file");

	console.log(errors);

    useImperativeHandle(ref, () => {
        return {
			showDialog: (category: string, description: string) => {
				setValue("category", category);
				setValue("description", description);
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
		formData.append("category", data.category);
		formData.append("description", data.description);
		console.log(formData);
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
						<h3 className="font-bold text-lg">Update category</h3>
						<br></br>
						<div className="flex flex-wrap gap-5">
                        	<div className="w-6/12">
								<label className="form-control w-full max-w-xs">
									<div className="label">
										<span className="label-text">Category</span>
									</div>
									<input
										{...register("category", {
											required: "The category name is required",
											minLength: {
												value: 5,
												message: "The category name must contains 5 characters minimun",
											},
										})}
										type="text"
										placeholder="Category name"
										className="input input-bordered w-full max-w-xs"
									/>

									{errors.category && (
										<div className="label">
											<span className="label-text text-red-500 text-sm">{errors.category.message}</span>
										</div>
									)}
								</label>

								<label className="form-control w-full max-w-xs">
									<div className="label">
										<span className="label-text">Description</span>
									</div>
									<textarea 
										className="textarea textarea-bordered"
										placeholder="Description"
										{...register("description", {
											required: 'The description name is required',
											minLength: {
												value: 10,
												message: "The description name must contains 10 characters minimun",
											},
										})}>

									</textarea>
									{errors.description && (
										<div className="label">
											<span className="label-text text-red-500 text-sm">{errors.description.message}</span>
										</div>
									)}
								</label>
							</div>
							<div className="w-5/12">
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
											htmlFor="editCategoryUpload"
											className="flex  bg-slate-700 hover:bg-slate-500 text-sm text-white px-2 py-1 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]"
										>
											<MdImageSearch className="text-2xl pr-2" />
												Search
											<input
												type="file"
												id="editCategoryUpload"
												{...register("file")}
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
														import.meta.env.VITE_IMG_URL + props.imageUrl 
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
							</div>
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