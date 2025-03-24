import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { EventResult } from "../../../types/Events";
import { AccountCredentialsUpdateDTO, UpdatedAccount } from "../../../store/remote/accounts/Accounts.Types";
import { ErrorList, errorToEventResult } from "../../../types/Errors";
import useStores from "../../../hooks/useStores";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { useEffect, useState } from "react";
import { StoreStatus } from "../../../store/remote/Store";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import { MdDone, MdOutlineCancel } from "react-icons/md";

interface AccountCredentialsFormField extends AccountCredentialsUpdateDTO {
    confirmation: string
}

const CredentialsAccount = () => {

    const [status, setStatus] = useState<StoreStatus>(StoreStatus.LOADING);

    const stores = useStores();
    const navigate = useNavigate();
    const params = useParams();
    const accountId = params.id || '0';

    const {register, setValue, setError, watch, handleSubmit, formState: { errors }} = useForm<AccountCredentialsFormField>();

    let password = watch("password", "");

    // Validation criteria
    const validations = {
        length: password && password.length >= 8,
        lowercase: password && /[a-z]/.test(password),
        uppercase: password && /[A-Z]/.test(password),
        number: password && /\d/.test(password),
    };

    const update = async (account: AccountCredentialsUpdateDTO) : Promise<EventResult<UpdatedAccount | ErrorList | null>> => {
        try {
            let result = await stores.accountsStore.updateCredentials(accountId, account);
            return result;
        } catch (error) {
            return errorToEventResult(error, "Unable to update the account");
        }
    }

    let onSubmit = async (data: AccountCredentialsFormField) => {
		let loadingToast = toast.loading("Updating credentials...");
        
        // Extract confirmation
        let {confirmation, ...dto} = data;
		let result = await update(dto);

		toast.dismiss(loadingToast);

        // Treat the result
		if (result.success) {
			toast.success(result.message);
            navigate('/accounts')
		} else {
			toast.error(result.message);

            if(result.info && result.errorCode === 422) {
                let errors = result.info as ErrorList;

                Object.keys(data).forEach((key: string) => {
                    if(errors.hasOwnProperty(key)) {
                        setError(key as keyof AccountCredentialsUpdateDTO, { message: errors[key][0] }  )
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
                        setValue("user", account.user);
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
					{ url: ".", label: "Update credentials" },
				]}
			/>
            {status == StoreStatus.LOADING ? <Loading /> : ""}
			{status == StoreStatus.ERROR ? <Error text={stores.accountsStore.lastError} /> : ""}

			{status == StoreStatus.READY ? (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="panel mx-5 shadow-md">
                <div className="panel-header panel-header-lighten">
                    <span className="title">Update credentials</span>
                </div>
                <div className="panel-content">
                    <div className="flex flex-wrap gap-3">
                        <div className="lg:w-5/12 sm:w-11/12">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">User</span>
                                </div>
                                <input 
                                    {...register("user", {
                                        required: 'The user is required', 
                                        minLength: {
                                            value: 5, message: 'The user name must contains 5 characters minimun'}
                                        }
                                    )} 
                                    type="text" 
                                    placeholder="New user name" 
                                    className="input input-bordered w-full max-w-xs" />
                            </label>
                        </div>
                        <div className="w-full">
                            <fieldset>
                                <legend>Credentials</legend>
                                <div className="flex flex-wrap gap-3">
                                    <div className="label w-full" >
                                        <span className="label-text text-gray-700 italic font-extralight text-xs">Provide a new password only if you want to change the current</span>
                                    </div>
                                    <div className="lg:w-3/12 sm:w-11/12">
                                        <label className="form-control w-full min-w-full">
                                            <div className="label">
                                                <span className="label-text">Previous password</span>
                                            </div>
                                            <input 
                                                {...register('prevPassword', {
                                                    validate: (value, record) => {
                                                        if(!record.password){
                                                            return true;
                                                        }
                                                        else {
                                                            return (!!value && value.length) ? true : 'Previous password is required'
                                                        }
                                                    }
                                                })} 
                                                type="text" 
                                                placeholder="Previous password" 
                                                className="input input-bordered w-full min-w-full" />
                                                {errors.prevPassword && 
                                                    <div className="label">
                                                        <span className="label-text text-red-500 text-xs">{errors.prevPassword.message}</span>
                                                    </div>}
                                        </label>
                                    </div>
        
                                    <div className="lg:w-4/12 sm:w-11/12">
                                        <label className="form-control w-full min-w-full">
                                            <div className="label">
                                                <span className="label-text">New password</span>
                                            </div>
                                            <input 
                                                {...register('password', { 
                                                    minLength: {
                                                        value: 8, message: 'The name must contains 8 characters minimun'}
                                                    }
                                                )} 
                                                type="password" 
                                                placeholder="Password" 
                                                className="input input-bordered w-full min-w-full" />
                                                {errors.password && 
                                                    <div className="label">
                                                        <span className="label-text text-red-500 text-xs">{errors.password.message}</span>
                                                    </div>}
                                        </label>
                                    </div>
                                    
                                    <div className="lg:w-4/12 sm:w-11/12">
                                        <label className="form-control w-full min-w-full">
                                            <div className="label">
                                                <span className="label-text">Confirmation</span>
                                            </div>
                                            <input 
                                                {...register('confirmation', { 
                                                    validate: (value, record) => (!record.password && value === password) || "Confirmation missmatch" 
                                                })} 
                                                type="password" 
                                                placeholder="Confirm new password" 
                                                className="input input-bordered w-full min-w-full" />
                                                {errors.confirmation && 
                                                    <div className="label">
                                                        <span className="label-text text-red-500 text-xs">{errors.confirmation.message}</span>
                                                    </div>}
                                        </label>
                                    </div>
                                </div>
                                {(password && password.length > 0) &&
                                <div className="flex flex-wrap gap-1 pt-2">
                                    <div className="lg:w-3/12 w-11/12 text-xs">
                                        <span className={validations.length ? 'text-green-700 flex' : 'text-red-600 flex'}>
                                            {validations.length ? <MdDone className="mt-1 mr-1" /> : <MdOutlineCancel className="mt-1 mr-1" />} 8 Characters
                                        </span>
                                    </div>
                                    <div className="lg:w-3/12 w-11/12 text-xs">
                                        <span className={validations.lowercase ? 'text-green-700 flex' : 'text-red-600 flex'}>
                                            {validations.lowercase ? <MdDone className="mt-1 mr-1" /> : <MdOutlineCancel className="mt-1 mr-1" />} Lowercase letters
                                        </span>
                                    </div>
                                    <div className="lg:w-3/12 w-11/12 text-xs">
                                        <span className={validations.uppercase ? 'text-green-700 flex' : 'text-red-600 flex'}>
                                            {validations.uppercase ? <MdDone className="mt-1 mr-1" /> : <MdOutlineCancel className="mt-1 mr-1"/>} Uppercase letters
                                        </span>
                                    </div>
                                    <div className="lg:w-2/12 w-11/12 text-xs">
                                        <span className={validations.number ? 'text-green-700 flex' : 'text-red-600 flex'}>
                                            {validations.number ? <MdDone className="mt-1 mr-1" /> : <MdOutlineCancel className="mt-1 mr-1" />} Number
                                        </span>
                                    </div>
                                </div>
                                }
                            </fieldset>
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

export default CredentialsAccount;