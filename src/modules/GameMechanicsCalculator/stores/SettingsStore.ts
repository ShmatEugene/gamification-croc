import { AxiosResponse } from 'axios';
import { observable, makeAutoObservable, computed, action } from 'mobx';
import { SettingsServiceInstanse } from '../api/SettingsService';
import { ISettings } from '../models/SettingsInterfaces';

export interface ISettingsStore {
	exchangeRate: number;
	earned: number;
	numberOfPurchases: number;
	missionsCompleted: number;
	spent: number;

	isSettingsOpen: boolean;

	setSettings(
		exchangeRate: number,
		earned: number,
		numberOfPurchases: number,
		missionsCompleted: number,
		spent: number
	): Promise<AxiosResponse>;
	fetchSettings(): Promise<ISettings>;
	setIsSettingsOpen(isOpen: boolean): void;
}

export class SettingsStore implements ISettingsStore {
	exchangeRate: number;
	earned: number;
	numberOfPurchases: number;
	missionsCompleted: number;
	spent: number;

	isSettingsOpen: boolean;

	constructor() {
		makeAutoObservable(this, {
			exchangeRate: observable,
			earned: observable,
			numberOfPurchases: observable,
			missionsCompleted: observable,
			spent: observable,
		});
		this.exchangeRate = 1.3;
		this.earned = 10;
		this.numberOfPurchases = 1;
		this.missionsCompleted = 1;
		this.spent = 50;

		this.isSettingsOpen = false;
	}

	public async setSettings(
		exchangeRate: number,
		earned: number,
		numberOfPurchases: number,
		missionsCompleted: number,
		spent: number
	): Promise<AxiosResponse> {
		this.exchangeRate = exchangeRate;
		this.earned = earned;
		this.numberOfPurchases = numberOfPurchases;
		this.missionsCompleted = missionsCompleted;
		this.spent = spent;

		const response = await SettingsServiceInstanse.postSettings(
			exchangeRate.toString(),
			earned.toString(),
			numberOfPurchases.toString(),
			missionsCompleted.toString(),
			spent.toString()
		);
		return response;
	}

	public async fetchSettings(): Promise<ISettings> {
		const response = await SettingsServiceInstanse.fetchSettings();

		this.exchangeRate = response.exchangeRate;
		this.earned = response.earned;
		this.missionsCompleted = response.missionsCompleted;
		this.numberOfPurchases = response.numberOfPurchases;
		this.spent = response.spent;

		return response;
	}

	public setIsSettingsOpen(isOpen: boolean): void {
		this.isSettingsOpen = isOpen;
	}
}
