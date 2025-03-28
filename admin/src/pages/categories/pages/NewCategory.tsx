import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { MdImageSearch } from "react-icons/md";
import { EventResult } from "../../../types/Events";
import { CreatedCategory } from "../../../store/remote/categories/Categories.Types";
import { ErrorList, errorToEventResult } from "../../../types/Errors";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useStores from "../../../hooks/useStores";
import Breadcrumbs from "../../../components/Breadcrumbs";
import RouterTable from "../../../router/router.table";

type CategoryFromValues = { 
	category: string; 
	description: string; 
	file: FileList;
};

const NewCategory = () => {

    const { register, handleSubmit, watch, setError, formState: { errors } } = useForm<CategoryFromValues>();
    const [preview, setPreview] = useState<string | null>(null);
	const file = watch("file");
	const navigate = useNavigate();
	const stores = useStores();

	let addCategory = async (data: FormData) : Promise<EventResult<CreatedCategory | ErrorList | null>> => {
        try {
            let result = await stores.categoryStore.addCategory(data);
            return result;
        } catch (error) {
            return errorToEventResult(error, "Unable to create the category");
        }
    }

    const onSubmit: SubmitHandler<CategoryFromValues> = async (data) => { 
        // Collect information
		const formData = new FormData(); 
		if (file) {
            formData.append('image', file[0]);
        }
		formData.append('category', data.category);
		formData.append('description', data.description);
        let result = await addCategory(formData);

		// Treat the result
		if (result.success) {
			toast.success(result.message);
			navigate(RouterTable.categories.root);
		} else {
			toast.error(result.message);

            if(result.info && result.errorCode === 422) {
                let errors = result.info as ErrorList;

                Object.keys(data).forEach((key: string) => {
                    if(errors.hasOwnProperty(key)) {
                        setError(key as keyof CategoryFromValues, { message: errors[key][0] }  )
                    }
                })
            }
		}
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

    return <>
        <Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: "/categories", label: "Categories" },
					{ url: ".", label: "New" },
				]}
			/>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="panel mx-5 shadow-md">
                <div className="panel-header panel-header-lighten">
                    <span className="title">New category</span>
                </div>
                <div className="panel-content">
					<div className="flex flex-wrap gap-5">
						<div className="md:w-2/12 w-10/12">
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
						</div>

						<div className="md:w-8/12 w-11/12">
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
					</div>
                </div>
                <div className="panel-footer text-right">
                    <button type="submit" className="btn btn-info btn-sm mr-5">Create</button>
                    <Link className="btn btn-sm" to={RouterTable.categories.root}>Cancel</Link>
                </div>
            </div>
        </form>
		</>

}

export default NewCategory;