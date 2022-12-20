import { createContext } from 'react';
import { AuctionStore, IAuction } from './AuctionStore';
import { ISettingsStore, SettingsStore } from './SettingsStore';
import {
	IWheelOfFoutuneMissions,
	WheelOfFoutuneMissionsStore,
} from './WheelOfFortuneMissionsStore';
import { IWheelOfFoutune, WheelOfFoutuneStore } from './WheelOfFortuneStore';

export interface IRootStore {
	auctionStore: IAuction;
	settingsStore: ISettingsStore;
	wheelOfFortuneStore: IWheelOfFoutune;
	wheelOfFortuneMissionsStore: IWheelOfFoutuneMissions;
}

export class RootStore implements IRootStore {
	auctionStore: AuctionStore;
	settingsStore: SettingsStore;
	wheelOfFortuneStore: IWheelOfFoutune;
	wheelOfFortuneMissionsStore: IWheelOfFoutuneMissions;

	constructor() {
		this.auctionStore = new AuctionStore(this);
		this.settingsStore = new SettingsStore();
		this.wheelOfFortuneStore = new WheelOfFoutuneStore(this);
		this.wheelOfFortuneMissionsStore = new WheelOfFoutuneMissionsStore(this);
	}
}
