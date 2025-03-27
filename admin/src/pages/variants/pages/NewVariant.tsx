import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineCheck, MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";

import Breadcrumbs from "../../../components/Breadcrumbs";
import { ProductFeaturesList } from "../../../store/remote/products/ProductFeatures";
import ProductFeatures from "../../../components/features/ProductFeatures";
import toast from "react-hot-toast";
import useStores from "../../../hooks/useStores";
import { EmptyEvent, EventResult } from "../../../types/Events";

import { MdImageSearch } from "react-icons/md";

import { useSelector } from 'react-redux'; 
import { RootState } from "../../../store/local/store"; 
import { VariantForm } from "../../../store/remote/variants/Variants.Types";
import { StoreStatus } from "../../../store/remote/Store";
import { setCurrentProduct } from "../../../store/local/slices/productSlice";
import { useDispatch } from "react-redux"; 
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import { ErrorList, errorToEventResult } from "../../../types/Errors";

let features: ProductFeaturesList = new ProductFeaturesList();

/**
 * Page for new product
 */
const NewVariant = () => {

    let [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    const [preview, setPreview] = useState<string | null>(null);
    const [item, setItems] = useState<number>(0);

    const params = useParams();
    const productId = parseInt(params.productId ?? '0');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const stores = useStores();
    const refFeatures = useRef<ProductFeaturesList>(features);
    const product = useSelector((state: RootState) => state.currentProduct.product);
    
    const {register, watch, reset, setError, handleSubmit, formState: { errors }} = useForm<VariantForm>({
        defaultValues: {
            name: '',
            description: '',
            isBestSeller: false,
            isNew: false,
            visible: true
        }
    });

    const file = watch("image");
	
    
    const submitRef = useRef<EmptyEvent>();

    const onItemsUpdated = () => { 
        setItems(Date.now());
    }

    const handleGoBack = () => {
        // Navigate to the previous URL
        navigate(-1);
    };

    useEffect(() => {
        if(!product || product.productId != productId) {
			stores.singleProductsStore.load({ productId }).then(
				(status: StoreStatus) => {
					if(status == StoreStatus.READY && stores.singleProductsStore.content) {
						dispatch(setCurrentProduct(stores.singleProductsStore.content));
					}
                    setStatus(status);
				}
			);
		}
        else {
            setStatus(StoreStatus.READY);
        }

        reset();
        submitRef.current = handleSubmit(onSumbit)
        return () => { features = new ProductFeaturesList(); refFeatures.current = features; }
    }, []);

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
        let loadingToast = toast.loading("Creating product variant...");

        let result : EventResult;
        try {
            result = await stores.variantsStore.create(productId, formData);
        } catch (error)
        {
            result = errorToEventResult(error, "Unable to create the product");
        }

		toast.dismiss(loadingToast);

        if (result.success) {
			toast.success(result.message);
            navigate(`/products/${product?.productId}/variants`);
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
            { url: '.', label: 'New' },
        ]} />

        {status == StoreStatus.LOADING ? <Loading /> : ''}
        {status == StoreStatus.ERROR ? <Error text={stores.variantsStore.lastError} /> : ''}
        { status == StoreStatus.READY ? 
           
           /* Main component */
        <div className="panel">
            <div className="panel-header">
                <span className="title" data-features={item}>New variant for {product?.name}</span>
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
                                            {...register("image", { required: true })}
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
                    <MdOutlineCheck className="text-xl" />Create
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

export default NewVariant;