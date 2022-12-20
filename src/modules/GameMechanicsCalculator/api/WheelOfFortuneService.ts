import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
import { API_URL } from '../../../config';

import {
	IWheelOfFortuneShowcaseCalculation,
	IWheelOfFortuneShowcaseConfiguration,
	IWheelOfFortuneShowcaseConfigurationResponse,
	IWheelOfFortuneShowcaseForm,
} from '../models/WheelOfFortuneInterfaces';
import {
	IWheelOfFortuneMissionsCalculation,
	IWheelOfFortuneMissionsConfiguration,
	IWheelOfFortuneMissionsConfigurationResponse,
	IWheelOfFortuneMissionsForm,
	IWheelOfFortuneMissionsRequestBody,
} from '../models/WheelOfFortuneMissionsInterfaces';

export interface IWheelOfFortuneService {
	computeWheelOfFortuneLots(
		body: IWheelOfFortuneShowcaseForm
	): Promise<IWheelOfFortuneShowcaseCalculation>;
	computeWheelOfFortuneMissions(
		body: IWheelOfFortuneMissionsRequestBody
	): Promise<IWheelOfFortuneMissionsCalculation>;
	saveWheelOfFortuneShowcase(
		wheelOfFortuneShowcaseConfiguration: IWheelOfFortuneShowcaseConfiguration
	): Promise<AxiosResponse>;
	saveWheelOfFortuneMissions(
		wheelOfFortuneShowcaseConfiguration: IWheelOfFortuneMissionsConfiguration
	): Promise<AxiosResponse>;
	fetchWheelOfFortuneShowcaseHistory(): Promise<
		Array<IWheelOfFortuneShowcaseConfigurationResponse>
	>;
	fetchWheelOfFortuneMissionsHistory(): Promise<
		Array<IWheelOfFortuneMissionsConfigurationResponse>
	>;
	deleteWheelOfFortuneShowcaseHistoryItemById(id: string): Promise<boolean>;
	deleteWheelOfFortuneMissionsHistoryItemById(id: string): Promise<boolean>;
	fetchWheelOfFortuneShowcaseHistoryItemById(
		id: string
	): Promise<IWheelOfFortuneShowcaseConfigurationResponse>;
	fetchWheelOfFortuneMissionsHistoryItemById(
		id: string
	): Promise<IWheelOfFortuneMissionsConfigurationResponse>;
}

class WheelOfFortuneService implements IWheelOfFortuneService {
	public async computeWheelOfFortuneLots(
		body: IWheelOfFortuneShowcaseForm
	): Promise<IWheelOfFortuneShowcaseCalculation> {
		try {
			console.log(API_URL);

			const response = await axios.post<IWheelOfFortuneShowcaseCalculation>(
				`${API_URL}/compute-wheel`,
				// 'http://94.45.223.241:46902/compute',
				{ ...body }
			);

			console.log(body);

			console.log(response.data);
			return response.data;
		} catch (err) {
			message.error('Ошибка расчета');

			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}
	public async computeWheelOfFortuneMissions(
		body: IWheelOfFortuneMissionsRequestBody
	): Promise<IWheelOfFortuneMissionsCalculation> {
		try {
			const response = await axios.post<IWheelOfFortuneMissionsCalculation>(
				`${API_URL}/compute-mission`,
				{ ...body }
			);

			return response.data;
		} catch (err) {
			message.error('Ошибка расчета');

			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}

	public async saveWheelOfFortuneShowcase(
		wheelOfFortuneShowcaseConfiguration: IWheelOfFortuneShowcaseConfiguration
	): Promise<AxiosResponse> {
		try {
			const response = await axios.post(`${API_URL}/wheel-lots`, {
				...wheelOfFortuneShowcaseConfiguration,
			});

			message.info('Расчёт сохранен');
			return response;
		} catch (err) {
			message.error('Ошибка сохранения');
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}

	public async saveWheelOfFortuneMissions(
		wheelOfFortuneShowcaseConfiguration: IWheelOfFortuneMissionsConfiguration
	): Promise<AxiosResponse> {
		try {
			const response = await axios.post(`${API_URL}/missions`, {
				...wheelOfFortuneShowcaseConfiguration,
			});

			message.info('Расчёт сохранен');
			return response;
		} catch (err) {
			message.error('Ошибка сохранения');
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}

	public async fetchWheelOfFortuneShowcaseHistory(): Promise<
		Array<IWheelOfFortuneShowcaseConfigurationResponse>
	> {
		try {
			const response = await axios.get<Array<{ jsonData: string; id: number }>>(
				`${API_URL}/wheel-lots`
			);

			let data: Array<IWheelOfFortuneShowcaseConfigurationResponse> = [];
			response.data.forEach(wheel => {
				const jsonData: IWheelOfFortuneShowcaseConfiguration = JSON.parse(wheel.jsonData);

				const wheelOfFortuneShowcaseConfiguration: IWheelOfFortuneShowcaseConfigurationResponse = {
					jsonData: jsonData,
					id: wheel.id,
				};
				data.push(wheelOfFortuneShowcaseConfiguration);
			});

			return data;
		} catch (err) {
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}

	public async fetchWheelOfFortuneMissionsHistory(): Promise<
		Array<IWheelOfFortuneMissionsConfigurationResponse>
	> {
		try {
			const response = await axios.get<Array<{ jsonData: string; id: number }>>(
				`${API_URL}/missions`
			);

			let data: Array<IWheelOfFortuneMissionsConfigurationResponse> = [];
			response.data.forEach(wheel => {
				const jsonData: IWheelOfFortuneMissionsConfiguration = JSON.parse(wheel.jsonData);

				const wheelOfFortuneShowcaseConfiguration: IWheelOfFortuneMissionsConfigurationResponse = {
					jsonData: jsonData,
					id: wheel.id,
				};
				data.push(wheelOfFortuneShowcaseConfiguration);
			});

			return data;
		} catch (err) {
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}

	public async deleteWheelOfFortuneShowcaseHistoryItemById(id: string): Promise<boolean> {
		try {
			await axios.delete(`${API_URL}/wheel-lots/${id}`);
			return true;
		} catch (err) {
			message.error('Ошибка удаления расчёта');
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}

	public async deleteWheelOfFortuneMissionsHistoryItemById(id: string): Promise<boolean> {
		try {
			await axios.delete(`${API_URL}/missions/${id}`);
			return true;
		} catch (err) {
			message.error('Ошибка удаления расчёта');
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}

	public async fetchWheelOfFortuneShowcaseHistoryItemById(
		id: string
	): Promise<IWheelOfFortuneShowcaseConfigurationResponse> {
		try {
			const response = await axios.get<{ jsonData: string; id: number }>(
				`${API_URL}/wheel-lots/${id}`
			);

			let data: IWheelOfFortuneShowcaseConfigurationResponse = {
				jsonData: JSON.parse(response.data.jsonData),
				id: response.data.id,
			};

			return data;
		} catch (err) {
			message.error('Ошибка загрузки расчёта');
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}

	public async fetchWheelOfFortuneMissionsHistoryItemById(
		id: string
	): Promise<IWheelOfFortuneMissionsConfigurationResponse> {
		try {
			const response = await axios.get<{ jsonData: string; id: number }>(
				`${API_URL}/missions/${id}`
			);

			let data: IWheelOfFortuneMissionsConfigurationResponse = {
				jsonData: JSON.parse(response.data.jsonData),
				id: response.data.id,
			};

			return data;
		} catch (err) {
			message.error('Ошибка загрузки расчёта');
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}
}

export const WheelOfFortuneServiceInstanse = new WheelOfFortuneService();
