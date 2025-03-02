import axios, { AxiosError, AxiosResponse } from "axios";

const HttpProvider = axios.create({
	// .. where we make our configurations
	baseURL: import.meta.env.VITE_API_URL,
});

//axios.defaults.headers.common["Authorization"] = "AUTH TOKEN";
//axios.defaults.headers.post["Content-Type"] = "application/json";


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