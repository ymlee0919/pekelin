import axios, { AxiosError, AxiosResponse } from "axios";

const HttpProvider = axios.create({
	// .. where we make our configurations
	baseURL: import.meta.env.VITE_API_URL,
});

//axios.defaults.headers.common["Authorization"] = "AUTH TOKEN";
//axios.defaults.headers.post["Content-Type"] = "application/json";

async function getCsrfToken() : Promise<string> {
	let response = await HttpProvider.get<any, {csrfToken: string}>('/app/csrf-token');
	return response.csrfToken;
}

HttpProvider.interceptors.request.use(async (config) => { 
	
	if(config.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method.toUpperCase()) ) {
		let csrfToken = await getCsrfToken();
		config.headers['x-csrf-token'] = csrfToken;
	}
	return config; 
}, (error) => { 
	return Promise.reject(error) 
});

// Agregar una respuesta al interceptor
HttpProvider.interceptors.response.use(
	function (response: AxiosResponse) {
		return response.data;
	},
	function (error) {
		if(error instanceof AxiosError)
		{
			if (!!error.response?.data)
				return Promise.reject(error.response?.data);
			if(error.message)
				return Promise.reject(error.message);
		}

		return Promise.reject(error);
	}
);

export default HttpProvider;