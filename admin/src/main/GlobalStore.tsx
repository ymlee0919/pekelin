import React from 'react';
import { CommonProps } from '../types/Common';
import { Provider } from 'react-redux';
import localStore from '../store/local/store';

const GlobalStore: React.FC<CommonProps> = (props: CommonProps) => {
  return (
      <Provider store={localStore}>
        {props.children}
      </Provider>
  );
};

export default GlobalStore;
