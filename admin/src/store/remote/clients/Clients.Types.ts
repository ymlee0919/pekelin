export type Client = {
	clientId: number;
	name: string;
  	place: string;
  	phone?: string;
	createdAt: Date;
	updatedAt: Date;
};

export type ClientDTO = {
	name: string;
  	place: string;
  	phone?: string;
  }