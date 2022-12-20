import React, { FC, createContext, ReactNode, ReactElement } from 'react';
import { IRootStore } from '../stores';

export const StoreContext = createContext<IRootStore>({} as IRootStore);

export type StoreComponent = FC<{
	store: IRootStore;
	children: ReactNode;
}>;

export const StoreProvider: StoreComponent = ({ children, store }): ReactElement => {
	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
