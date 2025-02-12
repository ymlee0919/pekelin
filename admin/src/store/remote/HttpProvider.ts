import axios, { AxiosError, AxiosResponse } from "axios";

const HttpProvider = axios.create({
	// .. where we make our configurations
	baseURL: "http://localhost:3000/api",
});

//axios.defaults.headers.common["Authorization"] = "AUTH TOKEN";
//axios.defaults.headers.post["Content-Type"] = "application/json";

HttpProvider.interceptors.request.use((config) => { 
	let token = window.localStorage.getItem("token");
	if (!!token) {
		config.headers.Authorization = `Bearer ${JSON.parse(token)}`; 
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
			if(error.status === 401) {
				window.localStorage.removeItem('token');
				window.localStorage.removeItem('user');
				window.location.href = '/';
				Promise.reject(error);
			}
			if (!!error.response?.data)
				return Promise.reject(error.response?.data);
			if(error.message)
				return Promise.reject(error.message);
		}

		return Promise.reject(error);
	}
);

export default HttpProvider;