import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { StoreStatus } from "../../../store/remote/Store";
import { MdClose, MdOutlineCheck } from "react-icons/md";
import RouterTable from "../../../router/router.table";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import useStores from "../../../hooks/useStores";
import toast from "react-hot-toast";
import { EventResult } from "../../../types/Events";
import { ErrorList, errorToEventResult } from "../../../types/Errors";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { Review, ReviewDTO } from "../../../store/remote/reviews/Reviews.Types";
import Rating from "../components/Rating";


const EditReview: React.FC = () => {

    // Extract linkId from URL params
	const { linkId } = useParams<{ linkId: string }>();
	const navigate = useNavigate();
	const stores = useStores();

	const { register, handleSubmit, setValue, setError, control, formState: { errors }} = useForm<ReviewDTO>();

	const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
	const [error, setLoadingError] = useState<string>("");
    const [client, setClient] = useState<string>("");

	// Handle form submission
	const onSubmit: SubmitHandler<ReviewDTO> = async (data) => {
        let loadingToast = toast.loading("Updating link...");
        let result : EventResult;
        try {
            result = await stores.reviewLinksStore.updateReview(linkId || 0, data);
        } catch (error)
        {
            result = errorToEventResult(error, "Unable to update the link");
        }

		toast.dismiss(loadingToast);

        if (result.success) {
			toast.success(result.message);
            navigate(RouterTable.links.root);
		} else {
			toast.error(result.message);

            if(result.info && result.errorCode === 422) {
                let errors = result.info as ErrorList;

                Object.keys(data).forEach((key: string) => {
                    if(errors.hasOwnProperty(key)) {
                        setError(key as keyof ReviewDTO, { message: errors[key][0] }  )
                    }
                })
            }
		}
	};

	// Fetch permissions from the backend
	const load = () => {
		setStatus(StoreStatus.LOADING);
		
		// Load permissions
		stores.reviewLinksStore.getReview(parseInt(linkId || '0')).then((link: Review) => {
            setStatus(StoreStatus.READY)
            setValue("rate", link.Review?.rate || 0 );
            setValue("comment", link.Review?.comment || "");
            setClient(link.clientName);
        }).catch(
            (reason) => { {
                    setStatus(StoreStatus.ERROR);
                    setLoadingError(reason instanceof Error ? reason.message : "Unable to load the selected link")
                }
            }	
        ) 
	}
	
		
	useEffect(() => {
		if(typeof linkId == "undefined") {
			setLoadingError("Invalid link");
			setStatus(StoreStatus.ERROR)
		} 
		else 
			load();
	}, []);

	return (
        <>
			<Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: RouterTable.links.root, label: "Reviews" },
					{ url: ".", label: "Edit" },
				]}
			/>
			
            {status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <ErrorMessage text={error} /> : ""}

			{status == StoreStatus.READY ? (
                <>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="panel mx-5 shadow-md">
                        <div className="panel-header panel-header-lighten">
                            <span className="title">Edit review</span>
                        </div>
                        <div className="panel-content">
                            <div className="form-control mb-4">
                                <div className="label">
                                    <span className="label-text text-gray-600">Client</span>
                                </div>
                                <input value={client}
                                    className="input w-full max-w-xs"
                                    readOnly={true}
                                >

                                </input>
                            </div>
                            {/* Review rate */}
                            <div className="form-control mb-4">
                                <div className="label">
                                    <span className="label-text text-gray-600">Rate</span>
                                </div>
                                <Controller
                                    name="rate"
                                    control={control}
                                    render={({ field }) => <Rating {...field} control={control}/>}
                                    />
                                {errors.rate && (
                                    <span className="text-red-500 text-sm">{errors.rate.message}</span>
                                )}
                            </div>
                            {/* Review comment */}
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text font-semibold">Comment</span>
                                </label>
                                <textarea
                                    {...register("comment", { required: "Review comment is required" })}
                                    className="textarea textarea-bordered lg:w-6/12"
                                    placeholder="Review comment"
                                />
                                {errors.comment && (
                                    <span className="text-red-500 text-sm">{errors.comment.message}</span>
                                )}
                            </div>
                            {/* Permissions List */}
                            

                        </div>
                        <div className="panel-footer text-right">
                            <button className="btn btn-primary btn-sm mx-4" type="submit">
                                <MdOutlineCheck className="text-xl" /> Apply
                            </button>
                            <Link to={RouterTable.links.root} className="btn bg-base-300 btn-sm mt-0">
                                <MdClose className="text-xl" /> Cancel
                            </Link>
                        </div>
                    </div>
                </form>
             </>
            ) : null }
        </>
    );
};

export default EditReview;