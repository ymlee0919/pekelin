import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from "../hooks/useAuth"
import HttpProvider from '../store/remote/HttpProvider';

import { useDispatch } from "react-redux"; 
import { setUser } from "../store/local/slices/globalSlice";

type AuthCredentials = {
    user: string;
    password: string;
};

type LoginResponse = {
    account: {
        userId: number;
        user: string;
        name: string;
        permissions: string[];
    },
    accessToken: string;
}

enum LoginStatus {
    None, Submitting
}

const LoginForm: React.FC = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<AuthCredentials>();
    const {login} = useAuth();
    const [status, setStatus] = useState<LoginStatus>(LoginStatus.None);
    const dispatch = useDispatch();

    const onSubmit = async (data: AuthCredentials) => {
        setStatus(LoginStatus.Submitting);
        HttpProvider.post<AuthCredentials, LoginResponse>('/auth', data)
            .then((auth: LoginResponse) => {
                setStatus(LoginStatus.None);
                login(auth.account.user, auth.accessToken, auth.account.permissions);
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
        <div className="flex items-center justify-center min-h-screen bg-sky-800">
            <div className="card w-full max-w-sm p-8 shadow-lg rounded-lg bg-base-200">
                <div className="card-body">
                    <div className='w-full flex justify-center'>
                            <img src='/icon.png' className='max-w-9'></img>
                    </div>
                    <h2 className="card-title text-2xl font-bold justify-center">Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                                Usuario
                            </label>
                            <input
                                id="user"
                                type="user"
                                {...register('user', { required: 'El identificador del usuario es obligatorio' })}
                                className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.user && <span className="text-sm text-red-600">{errors.user.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password', { required: 'La contraseña es obligatoria' })}
                                className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.password && <span className="text-sm text-red-600">{errors.password.message}</span>}
                        </div>
                        {errors.root && <span className="text-sm text-red-600">{errors.root.message}</span>}
                        <div>
                            {status == LoginStatus.None ?
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                            >
                                Iniciar Sesión
                            </button> 
                            : 
                            <button
                                disabled
                                className="btn btn-primary w-full"
                            >
                                Procesando...
                            </button> 
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
