import axios, { AxiosResponse } from 'axios';
import { IDepartment } from '../models/DepartmentInterface';
import { IEmployeeExtra } from '../models/EmployeeInterface';
import { IAuction } from '../stores/AuctionStore';
import { message } from 'antd';
import { IAuctionConfiguration, IAuctionConfigurationResponse } from '../models/AuctionInterfaces';
import { API_URL } from '../../../config';

export interface IAuctionService {
	uploadBalanceTable(options): Promise<AxiosResponse<IDepartment[]>>;
	uploadPurchasesTable(options): Promise<AxiosResponse<IEmployeeExtra[]>>;
	uploadMissionsTable(options): Promise<AxiosResponse<IEmployeeExtra[]>>;
	postCurrentAuction(auctionStore: IAuctionConfiguration): Promise<AxiosResponse>;
	fetchAuctionsHistory(): Promise<Array<IAuctionConfigurationResponse>>;
	deleteAuctionHistoryItemById(auctionId: string): Promise<boolean>;
	fetchAuctionsHistoryItemById(auctionId: string): Promise<IAuctionConfigurationResponse>;
}

class AuctionService implements IAuctionService {
	public async uploadBalanceTable(options): Promise<AxiosResponse<IDepartment[]>> {
		const { onSuccess, onError, file } = options;

		const fmData = new FormData();
		const config = {
			headers: { 'content-type': 'multipart/form-data' },
		};
		fmData.append('file', file);
		try {
			const response = await axios.post(`${API_URL}/uploadFile/departments?file`, fmData, config);

			onSuccess('Ok');

			console.log('server res: ', response);
			return response;
		} catch (err) {
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			message.error('Не удалось загрузить таблицу');
			onError({ err });
			throw error;
		}
	}

	public async uploadPurchasesTable(options): Promise<AxiosResponse<IEmployeeExtra[]>> {
		const { onSuccess, onError, file } = options;

		const fmData = new FormData();
		const config = {
			headers: { 'content-type': 'multipart/form-data' },
		};
		fmData.append('file', file);
		try {
			const response = await axios.post(`${API_URL}/uploadFile/purchases?file`, fmData, config);

			onSuccess('Ok');
			console.log('server res: ', response);
			return response;
		} catch (err) {
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			message.error('Не удалось загрузить таблицу');
			onError({ err });
			throw error;
		}
	}

	public async uploadMissionsTable(options): Promise<AxiosResponse<IEmployeeExtra[]>> {
		const { onSuccess, onError, file } = options;

		const fmData = new FormData();
		const config = {
			headers: { 'content-type': 'multipart/form-data' },
		};
		fmData.append('file', file);
		try {
			const response = await axios.post(`${API_URL}/uploadFile/missions`, fmData, config);

			onSuccess('Ok');
			console.log('server res: ', response);
			return response;
		} catch (err) {
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			message.error('Не удалось загрузить таблицу');
			onError({ err });
			throw error;
		}
	}

	public async postCurrentAuction(
		auctionConfiguration: IAuctionConfiguration
	): Promise<AxiosResponse> {
		try {
			const response = await axios.post(`${API_URL}/auction`, {
				...auctionConfiguration,
			});
			message.info('Расчёт сохранен');
			return response;
		} catch (err) {
			message.error('Ошибка сохранения аукциона');
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}

	public async fetchAuctionsHistory(): Promise<Array<IAuctionConfigurationResponse>> {
		try {
			const response = await axios.get<Array<{ jsonData: string; id: number }>>(
				`${API_URL}/auctions`
			);

			let data: Array<IAuctionConfigurationResponse> = [];
			response.data.forEach(auction => {
				const jsonData: IAuctionConfiguration = JSON.parse(auction.jsonData);

				const auctionConfiguration: IAuctionConfigurationResponse = {
					jsonData: jsonData,
					id: auction.id,
				};
				data.push(auctionConfiguration);
			});

			return data;
		} catch (err) {
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}

	public async deleteAuctionHistoryItemById(auctionId: string): Promise<boolean> {
		try {
			await axios.delete(`${API_URL}/auction/${auctionId}`);
			return true;
		} catch (err) {
			message.error('Ошибка удаления расчёта');
			console.log('Eroor: ', err);
			const error = new Error('Some error');
			throw error;
		}
	}

	public async fetchAuctionsHistoryItemById(
		auctionId: string
	): Promise<IAuctionConfigurationResponse> {
		try {
			const response = await axios.get<{ jsonData: string; id: number }>(
				`${API_URL}/auction/${auctionId}`
			);

			let data: IAuctionConfigurationResponse = {
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

export const AuctionServiceInstance = new AuctionService();
