import { createContext, useContext } from "react";
import { CommonProps } from '../types/Common';
import RemoteStoresFactory from "../store/remote/RemoteStoresFactory";

const StoresContext = createContext<RemoteStoresFactory | undefined>(undefined);
const stores = new RemoteStoresFactory();

export const RemoteStoresProvider: React.FC<CommonProps> = (props: CommonProps) => {
    return (
      <StoresContext.Provider value={stores}>
          {props.children}
      </StoresContext.Provider>
    );
  };

const useStores = () : RemoteStoresFactory => { 
    const context = useContext(StoresContext); 
    if (context === undefined) { 
        throw new Error('useStores must be used within a StoreProvider'); 
    } 

    return context;
}

export default useStores;