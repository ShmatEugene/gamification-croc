import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
import { API_URL } from '../../../config';
import { ISettings, ISettingsResponse } from '../models/SettingsInterfaces';

export interface ISettingsService {
	postSettings(
		exchangeRate: string,
		earned: string,
		numberOfPurchases: string,
		missionsCompleted: string,
		spent: string
	): Promise<AxiosResponse>;

	fetchSettings(): Promise<ISettings>;
}

class SettingsService implements ISettingsService {
	public async postSettings(
		exchangeRate: string,
		earned: string,
		numberOfPurchases: string,
		missionsCompleted: string,
		spent: string
	): Promise<AxiosResponse> {
		try {
			const settings = {
				exchangeRate,
				earned,
				numberOfPurchases,
				missionsCompleted,
				spent,
			};
			const response = await axios.post(`${API_URL}/settings`, settings);
			message.info('Настройки сохранены');

			return response;
		} catch (err) {
			message.error('Ошибка сохранения настроек');

			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}

	public async fetchSettings(): Promise<ISettings> {
		try {
			const response = await axios.get<{ jsonData: string; id: number }>(`${API_URL}/settings`);

			let data: ISettingsResponse = {
				jsonData: JSON.parse(response.data.jsonData),
				id: response.data.id,
			};

			return data.jsonData;
		} catch (err) {
			message.error('Ошибка загрузки настроек');
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}
}

export const SettingsServiceInstanse = new SettingsService();
