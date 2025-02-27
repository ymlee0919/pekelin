export type EmptyEvent = () => void;

export type EventResult<TInfo = any> = {
	success: boolean;
	message: string;
	errorCode?: number;
	info?: TInfo
};

export function isEventResult(e: any): boolean {
	return typeof e === "object" && e != null && e !== undefined && "success" in e && "message" in e;
}
