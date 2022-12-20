import { useContext } from 'react';
import { StoreContext } from '../stores/useStore';

export const useStores = () => useContext(StoreContext);
