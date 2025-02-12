import { forwardRef, useRef, useImperativeHandle, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CommonProps } from "../../types/Common";
import { MdImageSearch } from "react-icons/md";

type CategoryFromValues = { category: string; file: FileList; };

export interface NewServiceDialogProps extends CommonProps {
    onChange: (data: FormData) => void;
}

const NewCategoryDialog = forwardRef( (props: NewServiceDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<CategoryFromValues>();
    const [preview, setPreview] = useState<string | null>(null);
	const file = watch("file");

    useImperativeHandle(ref, () => {
        return {
            showModal: () => {
                modalRef.current?.showModal();
            },
            close: () => {
                modalRef.current?.close();
            }
        }
    });

    const onSubmit: SubmitHandler<CategoryFromValues> = async (data) => { 
        const formData = new FormData(); 
		if (file) {
            formData.append('image', file[0]);
        }
		formData.append('category', data.category);
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
						<h3 className="font-bold text-lg">Add new category</h3>
						<br></br>
						<label className="form-control w-full max-w-xs">
							<div className="label">
								<span className="label-text">Category</span>
							</div>
							<input
								{...register("category", {
									required: 'The category name is required',
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
						<br></br>
						<label className="form-control w-full max-w-xs">
							<div className="label">
								<span className="label-text">Image <span className="text-gray-500 text-xs">(500px x 500px)</span></span>
							</div>
						</label>
						<div className="indicator">
							<span className="indicator-item indicator-bottom">
								<label
									htmlFor="addServiceUpload"
									className="flex  bg-slate-700 hover:bg-slate-500 text-sm text-white px-2 py-1 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]"
								>
									<MdImageSearch className="text-2xl pr-2" />
									Search
									<input
										type="file"
										id="addServiceUpload"
										{...register("file", { required: true })}
										accept="image/*"
										className="hidden"
									/>
								</label>
							</span>

							{!!preview ? (
								<div className="avatar">
									<div className="w-32 rounded">
										<img src={preview} />
									</div>
								</div>
							) : (
								<div className="bg-base-300 grid h-32 w-32 place-items-center">No image</div>
							)}
						</div>
						<div className="modal-action">
							<button type="submit" disabled={!preview} className="btn btn-info btn-sm mr-5">
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

})

export default NewCategoryDialog;