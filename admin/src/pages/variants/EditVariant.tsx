import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineCheck, MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";

import Breadcrumbs from "../../components/Breadcrumbs";
import { ProductFeaturesList } from "../../store/remote/products/ProductFeatures";
import ProductFeatures from "../features/ProductFeatures";
import toast from "react-hot-toast";
import useStores from "../../hooks/useStores";
import { EmptyEvent, EventResult } from "../../types/Events";

import { MdImageSearch } from "react-icons/md";

import { StoreStatus } from "../../store/remote/Store";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import { VariantForm } from "../../store/remote/variants/Variants.Types";
import { useSelector } from 'react-redux'; 
import { RootState } from "../../store/local/store"; 
import { setCurrentProduct } from "../../store/local/slices/productSlice";
import { useDispatch } from "react-redux"; 
import { ErrorList, errorToEventResult } from "../../types/Errors";

let features: ProductFeaturesList = new ProductFeaturesList();

/**
 * Page for new product
 */
const EditVariant = () => {

    let [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    let [image, setImage] = useState<string>("");
    const [item, setItems] = useState<number>(0);
    const product = useSelector((state: RootState) => state.currentProduct.product);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const stores = useStores();
    const refFeatures = useRef<ProductFeaturesList>(features);
	
    const params = useParams();
    const productId = parseInt(params.productId ?? '0');
    const variantId = parseInt(params.variantId ?? '0');
    
    const {register, 
		setValue, 
        setError,
		watch, 
		handleSubmit, 
		formState: { errors }} = useForm<VariantForm>();

    const [preview, setPreview] = useState<string | null>(null);
	const file = watch("image");
    
    const onItemsUpdated = () => {
        setItems(Date.now());
    }

    const submitRef = useRef<EmptyEvent>();

    const handleGoBack = () => {
        // Navigate to the previous URL
        navigate(-1);
    };

    const loadVariant = () => {
        stores.singleVariantStore.load({ productId, variantId})
            .then( (newStatus : StoreStatus) => {
                if(stores.singleVariantStore.content)
                {
                    refFeatures.current = new ProductFeaturesList(stores.singleVariantStore.content.Features);
                    setImage(stores.singleVariantStore.content.remoteUrl);
                    setValue("name", stores.singleVariantStore.content.name);
                    setValue("description", stores.singleVariantStore.content.description);
                    setValue("isBestSeller", stores.singleVariantStore.content.isBestSeller);
                    setValue("isNew", stores.singleVariantStore.content.isNew);
                    setValue("visible", stores.singleVariantStore.content.visible);
                }
                setStatus(newStatus);
            })
    }

    // Page initialization
    useEffect(() => {
        if(!!product && product.productId == productId)
			loadVariant();
		else {
			stores.singleProductsStore.load({ productId }).then(
				(status: StoreStatus) => {
					if(status == StoreStatus.READY && stores.singleProductsStore.content) {
						dispatch(setCurrentProduct(stores.singleProductsStore.content));
						loadVariant();
					}
				}
			);
		}
        
        submitRef.current = handleSubmit(onSumbit);
        
        // Unmount the component and create a new offer info for new page
        return () => {stores.singleVariantStore.release()}
    }, []);

    // File preview treatment
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

    const onSumbit = async (data: VariantForm) => {
        // Append information
        const formData = new FormData(); 
        
        for (const key in data) {
            if (data.hasOwnProperty(key) && key != 'image' && key != 'items') {
                formData.append(key, data[key as keyof VariantForm] as string);
            }
        }
        
        if (file) {
            formData.append('image', file[0]);
        } else {
            if(data.image && data.image.length == 1)
                formData.append('image', data.image[0]);
        }

        formData.append('features', JSON.stringify(refFeatures.current.list));

        // Send to backend
        let loadingToast = toast.loading("Updating product variant...");

        let result : EventResult;
        try {
            result = await stores.variantsStore.update(
                product?.productId || 0, 
                params.variantId ?? '0', 
                formData
            );
        } catch (error)
        {
            result = errorToEventResult(error, "Unable to create the product");
        }

		toast.dismiss(loadingToast);

        if (result.success) {
			toast.success(result.message);
            navigate(-1);
		} else {
			toast.error(result.message);

            if(result.info && result.errorCode === 422) {
                let errors = result.info as ErrorList;

                Object.keys(data).forEach((key: string) => {
                    if(errors.hasOwnProperty(key)) {
                        setError(key as keyof VariantForm, { message: errors[key][0] }  )
                    }
                })
            }
		}
    }

    return <>
        <Breadcrumbs pages={[
            { url: '/', label: 'Dashboard' },
            { url: '/products', label: 'Products' },
            { url: `/products/${product?.productId}`, label: product?.name || 'Product' },
            { url: `/products/${product?.productId}/variants`, label: 'Variants' },
            { url: '.', label: stores.singleVariantStore.content?.name  ?? ''},
            { url: '.', label: 'Edit'},
        ]} />

        {status == StoreStatus.LOADING ? <Loading /> : ''}
        {status == StoreStatus.ERROR ? <Error text={stores.variantsStore.lastError} /> : ''}
        { status == StoreStatus.READY ? 
           
            /* Main component */
            <div className="panel">
                <div className="panel-header">
                    <span className="title" data-features={item}>Variant {stores.singleVariantStore.content?.name} of {product?.name}</span>
                </div>
                <div className="panel-content">
                    <form>
                        <div className="flex flex-wrap gap-3">
                            <div className="w-full md:w-3/12 sm:w-5/12">
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">Image <span className="text-gray-500 text-xs">(500px x 500px)</span></span>
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
												{...register("image")}
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
												<img src={(import.meta.env.VITE_IMG_URL ?? '') + image}/>
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
                            <div className="w-full md:w-8/12 sm:w-7/12">
                                
                                <div className="flex flex-wrap gap-3">
                                <div className="w-full md:w-6/12 sm:w-10/12">
                                        <label className="form-control w-full max-w-xs">
                                            <div className="label">
                                                <span className="label-text">Product name</span>
                                            </div>
                                            <input 
                                                {...register("name", {
                                                    required: 'The name is requiered', 
                                                    minLength: {
                                                        value: 5, message: 'The name must contains 5 characters minimun'}
                                                    }
                                                )} 
                                                type="text" 
                                                placeholder="Name of the product" 
                                                className="input input-bordered w-full max-w-xs"
                                            />
                                            {errors.name && 
                                                <div className="label">
                                                    <span className="label-text text-red-500 text-sm">{errors.name.message}</span>
                                                </div>}
                                        </label>
                                    </div>

                                    <div className="w-full">
                                        <label className="form-control w-full">
                                            <div className="label">
                                                <span className="label-text">Description</span>
                                            </div>
                                            <textarea 
                                                className="textarea textarea-bordered" 
                                                placeholder="Description"
                                                {...register("description", {
                                                    minLength: {
                                                        value: 5, message: 'The name must contains 5 characters minimun'
                                                    }
                                                })}
                                            ></textarea>
                                            {errors.description && 
                                                <div className="label">
                                                    <span className="label-text text-red-500 text-sm">{errors.description.message}</span>
                                                </div>}
                                        </label>
                                    </div>

                                    <div className="w-full">
                                        <fieldset id="product-view">
                                            <legend>View</legend>
                                            <div className="flex flex-wrap">
                                                <div className="w-full md:w-4/12 sm:w-11/12">
                                                    <div className="form-control">
                                                        <label className="label cursor-pointer justify-start">
                                                            <input 
                                                                type="checkbox" 
                                                                {...register("isNew")}
                                                                defaultChecked={false}
                                                                className="checkbox checkbox-primary" />
                                                            <span className="label-text px-2">Is new</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="w-full md:w-4/12 sm:w-11/12">
                                                    <div className="form-control">
                                                        <label className="label cursor-pointer justify-start">
                                                            <input 
                                                                type="checkbox" 
                                                                {...register("isBestSeller")}
                                                                defaultChecked={false}
                                                                className="checkbox checkbox-primary" />
                                                            <span className="label-text px-2">Is Best Seller</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="w-full md:w-4/12 sm:w-11/12">
                                                    <div className="form-control">
                                                        <label className="label cursor-pointer justify-start">
                                                            <input 
                                                                type="checkbox" 
                                                                defaultChecked={true}
                                                                {...register("visible")}
                                                                className="checkbox checkbox-primary" />
                                                            <span className="label-text px-2">Visible</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>                  
                            </div>
                        </div>
                        
                    </form>
                    <br></br>

                    <ProductFeatures features={refFeatures} onUpdate={onItemsUpdated} />

                </div>
                <div className="panel-footer text-right">
                    <button 
                        className="btn btn-primary btn-sm mx-4" 
                        type="button"
                        onClick={() => {if(submitRef.current) submitRef.current()}}
                    >
                        <MdOutlineCheck className="text-xl" />Update
                    </button>
                    <a href="#" onClick={handleGoBack} className="btn bg-base-300 btn-sm mt-0">
                        <MdClose className="text-xl" /> Cancel
                    </a>
                </div>
            </div>
            /* END of Main component */
            : <></>
        }
    </>
}

export default EditVariant;