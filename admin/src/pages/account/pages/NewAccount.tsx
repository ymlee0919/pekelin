import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { EventResult } from "../../../types/Events";
import { AccountCreationDTO, CreatedAccount } from "../../../store/remote/accounts/Accounts.Types";
import { ErrorList, errorToEventResult } from "../../../types/Errors";
import { MdDone, MdOutlineCancel } from "react-icons/md";
import useStores from "../../../hooks/useStores";
import { NavLink, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";


const NewAccount = () => {

    const stores = useStores();
    const navigate = useNavigate();

    const {register, watch, handleSubmit, setError, formState: { errors }} = useForm<AccountCreationDTO & {confirmation: string}>({
        defaultValues: {
            user: '', name: '', email: '', password: '', confirmation: ''
        }
    });

    let password = watch("password", "");

    // Validation criteria
    const validations = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
    };

    const add = async (account: AccountCreationDTO) : Promise<EventResult<CreatedAccount | ErrorList | null>> => {
        try {
            let result = await stores.accountsStore.create(account);
            return result;
        } catch (error) {
            return errorToEventResult(error, "Unable to create the account");
        }
    }

    let onSubmit = async (data: AccountCreationDTO & {confirmation: string}) => {
		let loadingToast = toast.loading("Creating account...");

        // Remove confirmation from data
        let {confirmation, ...dto} = data;
        let result = await add(dto);
        toast.dismiss(loadingToast);

        // Treat resutl
		if (result.success) {
			toast.success(result.message);
            navigate("/accounts");
		} else {
			toast.error(result.message);

            if(result.info && result.errorCode === 422) {
                let errors = result.info as ErrorList;

                Object.keys(data).forEach((key: string) => {
                    if(errors.hasOwnProperty(key)) {
                        setError(key as keyof AccountCreationDTO, { message: errors[key][0] }  )
                    }
                })
            }
		}
	};

    return <>
        <Breadcrumbs
				pages={[
					{ url: "/", label: "Dashboard" },
					{ url: "/accounts", label: "Accounts" },
					{ url: ".", label: "Create" },
				]}
			/>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="panel mx-5 shadow-md">
                <div className="panel-header panel-header-lighten">
                    <span className="title">New account</span>
                </div>
                <div className="panel-content">
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
                                            value: 5, message: 'The name must contains 8 characters minimun'}
                                        }
                                    )} 
                                    type="text" 
                                    placeholder="Your name" 
                                    className="input input-bordered w-full max-w-xs" />

                                {errors.name && 
                                    <div className="label">
                                        <span className="label-text text-red-500 text-xs">{errors.name.message}</span>
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
                                        <span className="label-text text-red-500 text-xs">{errors.email.message}</span>
                                    </div>}
                            </label>
                        </div>
                    </div>
                    <br></br>
                    <fieldset>
                        <legend>Credentials</legend>
                        <div className="flex flex-wrap gap-3">
                            <div className="lg:w-3/12 sm:w-11/12">
                                <label className="form-control w-full min-w-full">
                                    <div className="label">
                                        <span className="label-text">User</span>
                                    </div>
                                    <input 
                                        {...register('user', { 
                                            required: 'The user is required', 
                                            minLength: {
                                                value: 5, message: 'The user must contains 5 characters minimun'}
                                            }
                                        )} 
                                        type="text" 
                                        placeholder="User identifier" 
                                        className="input input-bordered w-full min-w-full" />
                                    {errors.user && 
                                        <div className="label">
                                            <span className="label-text text-red-500 text-xs">{errors.user.message}</span>
                                        </div>}
                                </label>
                            </div>

                            <div className="lg:w-4/12 sm:w-11/12">
                                <label className="form-control w-full min-w-full">
                                    <div className="label">
                                        <span className="label-text">Password</span>
                                    </div>
                                    <input 
                                        {...register('password', { 
                                            required: 'The password is required', 
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
                                            required: 'Confirm your password', 
                                            validate: (value) => value === password || "Confirmation missmatch" 
                                        })} 
                                        type="password" 
                                        placeholder="Confirm your password" 
                                        className="input input-bordered w-full min-w-full" />
                                        {errors.confirmation && 
                                            <div className="label">
                                                <span className="label-text text-red-500 text-xs">{errors.confirmation.message}</span>
                                            </div>}
                                </label>
                            </div>
                        </div>
                        {password.length > 0 &&
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
                <div className="panel-footer text-right">
                    <button type="submit" className="btn btn-info btn-sm mr-5">Create</button>
                    <NavLink className="btn btn-sm" to="/accounts">Cancel</NavLink>
                </div>
            </div>
        </form>
    </>
};

export default NewAccount;