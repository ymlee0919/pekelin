import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from "../hooks/useAuth"

import { useDispatch } from "react-redux"; 
import { setUser } from "../store/local/slices/globalSlice";
import { MdLogin } from 'react-icons/md';
import { AuthCredentials, LoginResponse } from '../types/Auth';

enum LoginStatus {
    None, Submitting
}

const LoginForm: React.FC = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<AuthCredentials>();
    const {signIn} = useAuth();
    const [status, setStatus] = useState<LoginStatus>(LoginStatus.None);
    const dispatch = useDispatch();

    const onSubmit = async (data: AuthCredentials) => {
        setStatus(LoginStatus.Submitting);
        
        signIn(data)
            .then((auth: LoginResponse) => {
                setStatus(LoginStatus.None);
                dispatch(
                    setUser({
                        user: auth.account.user, 
                        userName: auth.account.name
                    })
                );
            }).catch((error:any) => {
                setStatus(LoginStatus.None);
                setError("root", {
                    message: String(error.message ?? error)
                });
            });
    };

    return (
        <>
        <div className="md:flex md:flex-wrap items-center justify-center h-26 md:min-h-screen bg-blue-800">
            <div className='md:w-1/2 flex flex-col items-center justify-center md:min-h-screen shadow-lg md:relative fixed  bg-indigo-800 w-full'>
                <div className='w-full justify-center items-center text-center inline-flex md:block p-4'>
                    <img src='/icon.png' className='md:max-w-24 max-w-10 md:mx-auto m-2'></img>
                    <h2 className="text-blue-300 text-2xl font-bold justify-center">Pekelín Dashboard</h2>
                </div>
            </div>
            <div className='md:w-1/2 flex flex-col items-center min-h-screen justify-center bg-blue-900'>
                <fieldset className='lg:w-3/5 w-4/5 border-blue-700 p-6 rounded-xl'>
                    <legend className="text-2xl font-bold justify-center pb-1 text-blue-200">Iniciar Sesión</legend>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label htmlFor="user" className="block text-sm font-medium text-blue-300">
                                Usuario
                            </label>
                            <input
                                id="user"
                                type="user"
                                {...register('user', { required: 'El identificador del usuario es obligatorio' })}
                                className="input input-bordered w-full my-2"
                            />
                            {errors.user && <span className="text-sm text-red-600">{errors.user.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-blue-300">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password', { required: 'La contraseña es obligatoria' })}
                                className="input input-bordered w-full my-2"
                            />
                            {errors.password && <span className="text-sm text-red-600">{errors.password.message}</span>}
                        </div>
                        <div className="form-control">
                            <label className="cursor-pointer label text-blue-300 w-32">
                                <input {...register("remember")} type="checkbox" defaultChecked className="checkbox checkbox-info" />
                                <span className="label-text text-blue-300">Recordarme</span>
                            </label>
                        </div>
                        {errors.root && <span className="text-sm text-red-200">{errors.root.message}</span>}
                        <div className='text-center'>
                            {status == LoginStatus.None ?
                            <button
                                type="submit"
                                className="btn btn-info"
                            >
                                <MdLogin className='text-xl mx-2' /> Entrar
                            </button> 
                            : 
                            <button
                                disabled
                                className="btn btn-ghost text-gray-200"
                            >
                                Procesando...
                            </button> 
                            }
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
        </>
    );
};

export default LoginForm;
