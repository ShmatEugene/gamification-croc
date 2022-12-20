export interface ISettings {
	exchangeRate: number;
	earned: number;
	numberOfPurchases: number;
	missionsCompleted: number;
	spent: number;
}

export interface ISettingsResponse {
	jsonData: ISettings;
	id: number;
}
