import axios, { AxiosError, AxiosResponse } from "axios";
import { authService } from "../../services/auth.service";

const HttpProvider = axios.create({
	// .. where we make our configurations
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true, // Ensures cookies are sent with requests
});

//axios.defaults.headers.common["Authorization"] = "AUTH TOKEN";
//axios.defaults.headers.post["Content-Type"] = "application/json";

async function getCsrfToken() : Promise<string> {
	let response = await HttpProvider.get<any, {csrfToken: string}>('/app/csrf-token');
	return response.csrfToken;
}

HttpProvider.interceptors.request.use(async (config) => { 
	let token = window.localStorage.getItem("token");	

	if (!!token) {
		config.headers.Authorization = `Bearer ${JSON.parse(token)}`; 
	}
	
	if(config.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method.toUpperCase()) ) {
		let csrfToken = await getCsrfToken();
		config.headers['x-csrf-token'] = csrfToken;
	}

	return config; 
}, (error) => { 
	return Promise.reject(error) 
});

let refreshPromise: Promise<string> | null = null;

// Agregar una respuesta al interceptor
HttpProvider.interceptors.response.use(
	function (response: AxiosResponse) {
		console.log(response);
		return response.data;
	},
	async (error) => {
		
		const originalRequest = error.config;
    
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			
			try {
				// If we're not already refreshing, start the refresh process
				if (!refreshPromise) {
					refreshPromise = authService.refreshToken()
						.finally(() => {
							refreshPromise = null;
						});
				}
		
				// Wait for the refresh to complete
				const newAccessToken = await refreshPromise;
				
				// Update storage and headers
				window.localStorage.setItem('token', JSON.stringify(newAccessToken));
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				
				// Retry the original request with new token
				return HttpProvider(originalRequest);
			} catch (refreshError) {
				console.log(refreshError);
				// If refresh fails, clear tokens and redirect
				window.localStorage.removeItem('token');
				window.localStorage.removeItem('user');
				window.location.href = '/';
			  	return Promise.reject(refreshError);
			}
		  } else {
			if(error instanceof AxiosError)
			{
				if(error.status === 401) {
					window.localStorage.removeItem('token');
					window.localStorage.removeItem('user');
					window.location.href = '/';
					return Promise.reject(error);
				}
				if (!!error.response?.data) {
					return Promise.reject(error.response?.data);
				}
					
				if(error.message)
					return Promise.reject(error.message);
			}
	
			return Promise.reject(error);
		}
	}
);

export default HttpProvider;