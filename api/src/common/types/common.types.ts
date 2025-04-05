export type ActionResult = {
	success: boolean;
	message: string;
	errorCode?: number;
};

export type ImageSrc = {
	local: string;
	remote: string;
	expiryRemote: number
}
