export type Module = {
    moduleId: number;
    module: string;
    details: string;
  };

  export type Role = {
    roleId: number;
    role: string;
    details: string;
    createdAt: Date;
    updatedAt: Date;
    modules?: Module[];
  };