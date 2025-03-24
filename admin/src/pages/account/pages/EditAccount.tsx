import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { EventResult } from "../../../types/Events";
import { AccountUpdateDTO, UpdatedAccount } from "../../../store/remote/accounts/Accounts.Types";
import { ErrorList, errorToEventResult } from "../../../types/Errors";
import useStores from "../../../hooks/useStores";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { useEffect, useState } from "react";
import { StoreStatus } from "../../../store/remote/Store";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";

const UpdateAccount = () => {

    const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);
    const [user, setUser] = useState<string>('');

    const stores = useStores();
    const navigate = useNavigate();
    const params = useParams();
    const accountId = params.id || '0';

    const {register, setValue, setError, handleSubmit, formState: { errors }} = useForm<AccountUpdateDTO>();

    const update = async (account: AccountUpdateDTO) : Promise<EventResult<UpdatedAccount | ErrorList | null>> => {
        try {
            let result = await stores.accountsStore.update(accountId, account);
            return result;
        } catch (error) {
            return errorToEventResult(error, "Unable to update the account");
        }
    }

    let onSubmit = async (data: AccountUpdateDTO) => {
		let loadingToast = toast.loading("Updating account...");
		let result = await update(data);
		toast.dismiss(loadingToast);

		if (result.success) {
			toast.success(result.message);
            navigate('/accounts')
		} else {
			toast.error(result.message);

            if(result.info && result.errorCode === 422) {
                let errors = result.info as ErrorList;

                Object.keys(data).forEach((key: string) => {
                    if(errors.hasOwnProperty(key)) {
                        setError(key as keyof AccountUpdateDTO, { message: errors[key][0] }  )
                    }
                })
            }
		}
	};

    useEffect(() => {
        stores.accountsStore.load(null).then(
            (newStatus: StoreStatus) => {
                setStatus(newStatus);
                if (newStatus == StoreStatus.READY && stores.accountsStore.content){
                    let account = stores.accountsStore.get(parseInt(accountId));
                    if(account) {
                        setValue("name", account?.name || '');
                        setValue("email", account?.email || '');
                        setUser(account.user);
                    }
                    else
                        setStatus(StoreStatus.ERROR);
                }
            }
        );
    }, []);

    return <>
        <Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: "/accounts", label: "Accounts" },
					{ url: ".", label: "Update" },
				]}
			/>
            {status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <Error text={stores.accountsStore.lastError} /> : ""}

			{status == StoreStatus.READY ? (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="panel mx-5 shadow-md">
                <div className="panel-header panel-header-lighten">
                    <span className="title">Update account</span>
                </div>
                <div className="panel-content">
                    <div className="flex flex-wrap gap-3">
                        <div className="lg:w-5/12 sm:w-11/12">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">User</span>
                                </div>
                                <input 
                                    name="user"
                                    type="text"
                                    value={user}
                                    readOnly={true}
                                    className="input w-full max-w-xs" />

                                {errors.name && 
                                    <div className="label">
                                        <span className="label-text text-red-500 text-sm">{errors.name.message}</span>
                                    </div>}
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="lg:w-5/12 sm:w-11/12">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Name</span>
                                </div>
                                <input 
                                    {...register("name", {
                                        required: 'The name is required', 
                                        minLength: {
                                            value: 8, message: 'The name must contains 8 characters minimun'}
                                        }
                                    )} 
                                    type="text" 
                                    placeholder="Provide a new name" 
                                    className="input input-bordered w-full max-w-xs" />

                                {errors.name && 
                                    <div className="label">
                                        <span className="label-text text-red-500 text-sm">{errors.name.message}</span>
                                    </div>}
                            </label>
                        </div>
                        <div className="lg:w-5/12 sm:w-11/12">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Email</span>
                                </div>
                                <input 
                                    {...register("email", {
                                        required: 'The email is required'}
                                    )} 
                                    type="email" 
                                    placeholder="Personal email" 
                                    className="input input-bordered w-full max-w-xs" />

                                {errors.email && 
                                    <div className="label">
                                        <span className="label-text text-red-500 text-sm">{errors.email.message}</span>
                                    </div>}
                            </label>
                        </div>
                        
                    </div>
                </div>
                <div className="panel-footer text-right">
                    <button type="submit" className="btn btn-info btn-sm mr-5">Apply</button>
                    <NavLink className="btn btn-sm" to="/accounts">Cancel</NavLink>
                </div>
            </div>
        </form>) : <>
        </>}
    </>
};

export default UpdateAccount;