import { useRef, useImperativeHandle, forwardRef } from "react";
import { CommonProps } from "../../types/Common";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { EventResult } from "../../types/Events";
import { AccountCreationDTO, CreatedAccount } from "../../store/remote/accounts/Accounts.Types";
import { ErrorList } from "../../types/Errors";
import { MdDone, MdOutlineCancel } from "react-icons/md";

export interface NewAccountDialogProps extends CommonProps {
    onApply: (account: AccountCreationDTO) => Promise<EventResult<CreatedAccount | ErrorList | null>>;
}

const NewAccountDialog = forwardRef( (props : NewAccountDialogProps, ref) => {

    let modalRef = useRef<HTMLDialogElement>(null);

    const {register, reset, watch, handleSubmit, setError, formState: { errors }} = useForm<AccountCreationDTO & {confirmation: string}>({
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


    useImperativeHandle(ref, () => {
        return {
            showModal: () => {
                reset();
                modalRef.current?.showModal();
            }
        }
    });

    let onSubmit = async (data: AccountCreationDTO & {confirmation: string}) => {
		let loadingToast = toast.loading("Creating account...", {
            style: {
                zIndex: 9900
            }
        });
        let {confirmation, ...dto} = data;
		let result = await props.onApply(dto);
		toast.dismiss(loadingToast);

		if (result.success) {
			modalRef.current?.close();
			toast.success(result.message);
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <dialog ref={modalRef} className="modal ">
                <div className="modal-box lg:w-8/12 md:w-10/12 max-w-5xl bg-base-200">
                    <h3 className="font-bold text-lg">New account</h3>
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
                    
                    <div className="modal-action">
                        <button type="submit" className="btn btn-info btn-sm mr-5">Add</button>
                        <a className="btn btn-sm" onClick={()=>modalRef.current?.close()}>Close</a>
                    </div>
                </div>
            </dialog>
        </form>
    </>
});

export default NewAccountDialog;