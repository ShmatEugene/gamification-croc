import { message } from 'antd';
import { observable, makeAutoObservable, computed, action } from 'mobx';
import { FieldData } from 'rc-field-form/lib/interface';
import { uid } from 'uid';
import { IRootStore } from '.';
import { WheelOfFortuneServiceInstanse } from '../api/WheelOfFortuneService';
import {
	IWheelOfFortuneMissionsCalculation,
	IWheelOfFortuneMissionsConfigurationResponse,
	IWheelOfFortuneMissionsForm,
	IWheelOfFortuneMissionsRequestBody,
} from '../models/WheelOfFortuneMissionsInterfaces';
// import randomize from 'randomatic';
import randomInteger from 'random-int';

export interface IWheelOfFoutuneMissions {
	form: IWheelOfFortuneMissionsForm;
	calculation?: IWheelOfFortuneMissionsCalculation;
	isCalculationActive: boolean;
	isHistory: boolean;

	onMissionsChange(e: React.ChangeEvent<HTMLInputElement>): void;
	addFortuneItem(): void;
	removeActiveMission(): void;

	onMissionsOptionChange(value: string): void;
	onActivePercentBustersChange(busters: Array<number>): void;
	onActiveFixedChange(busters: Array<number>): void;

	onActiveMultBustersChange(busters: Array<number>): void;
	onComputationTypeChange(type: number): void;
	getActiveItemIndexById(id: string): number;

	computeWheelOfFortune(values): Promise<void>;
	saveWheelOfFortune(): Promise<void>;
	onCalculationNameChange(calculationName: string): void;
	fetchWheelOfFortuneMissionsHistory(): Promise<
		Array<IWheelOfFortuneMissionsConfigurationResponse>
	>;
	deleteWheelOfFortuneMissionsHistoryItemById(id: string): Promise<boolean>;
	fetchWheelOfFortuneMissionsHistoryItemById(id: string): Promise<void>;

	convertRubToBobr(rubs: number): number;
	convertBobrToRubs(bobrs: number): number;

	get uid(): string;
	get activeOptionIndex(): number;
	get isMissionsValid(): boolean;
	get numberOfValidMissions(): number;
}

export class WheelOfFoutuneMissionsStore implements IWheelOfFoutuneMissions {
	private rootStore: IRootStore;

	form: IWheelOfFortuneMissionsForm;
	calculation?: IWheelOfFortuneMissionsCalculation;
	isCalculationActive: boolean;
	isHistory: boolean;

	constructor(rootStore: IRootStore) {
		makeAutoObservable(this, {
			form: observable,
		});
		this.form = {
			wheelNextTime: 0,
			computationType: 0,
			missions: [
				{
					id: '0',
					missionName: '',
					totalTickets: '',
					budget: '',
					missionIncome: '',
					percentBusters: this.defaultPercentBusters,
					multBusters: this.defaultMultBusters,
					fixed: this.defaultFixed,
				},
			],
			activeOptionId: '0',
		};
		this.isCalculationActive = false;
		this.isHistory = false;

		this.rootStore = rootStore;
	}

	defaultPercentBusters = [5];
	defaultMultBusters = [6];
	defaultFixed = [7];

	addFortuneItem(): void {
		const uid = this.uid;

		this.form.missions.push({
			id: uid,
			missionName: '',
			budget: '',
			totalTickets: '',
			missionIncome: '',
			percentBusters: this.defaultPercentBusters,
			multBusters: this.defaultMultBusters,
			fixed: this.defaultFixed,
		});
		this.form.activeOptionId = uid;

		message.info(`Добавлена миссия`);
	}

	removeActiveMission(): void {
		if (this.form.missions.length > 1) {
			//@ts-ignore
			this.form.missions = this.form.missions.filter(item => {
				if (item.id !== this.form.activeOptionId) {
					return true;
				} else {
					message.info(
						`Удалена миссия ${item.missionName !== '' ? item.missionName : 'Без названия'}`
					);
					return false;
				}
			});
			this.form.activeOptionId = this.form.missions[0].id;
		} else {
			message.error('Остался только один лот');
		}
	}

	onMissionsOptionChange(value: string): void {
		this.form.activeOptionId = value;
	}

	onMissionsChange(e: React.ChangeEvent<HTMLInputElement>): void {
		const value = e.target.value;
		const name = e.target.name;
		const itemIndex = this.activeOptionIndex;
		this.form.missions[itemIndex][name] = value;
	}

	onActiveMultBustersChange(busters: Array<number>): void {
		this.form.missions[this.activeOptionIndex].multBusters = busters;
	}

	onActivePercentBustersChange(busters: Array<number>): void {
		this.form.missions[this.activeOptionIndex].percentBusters = busters;
	}

	onActiveFixedChange(busters: Array<number>): void {
		this.form.missions[this.activeOptionIndex].fixed = busters;
	}

	onComputationTypeChange(type: number) {
		this.form.computationType = type;
	}

	convertRubToBobr(rubs: number): number {
		return Math.ceil(rubs / this.rootStore.settingsStore.exchangeRate);
	}

	convertBobrToRubs(bobrs: number): number {
		return Math.ceil(bobrs * this.rootStore.settingsStore.exchangeRate);
	}

	getActiveItemIndexById(id: string): number {
		this.form.missions.forEach((item, index) => {
			if (item.id === this.form.activeOptionId) {
				return index;
			}
		});

		return 0;
	}

	public async computeWheelOfFortune(values): Promise<void> {
		this.form.wheelNextTime = values.wheelNextTime;

		const requestBody: IWheelOfFortuneMissionsRequestBody = {
			activeOptionId: this.activeOptionIndex,
			computationType: this.form.computationType,
			//@ts-ignore
			missions: this.form.missions.map(mission => {
				return {
					...mission,
					id: randomInteger(1000000, 10000000),
					totalTickets: +mission.totalTickets,
					budget: +mission.budget,
					missionIncome: +mission.missionIncome,
				};
			}),
		};

		console.log('body: ', requestBody);

		const wheelOfFortuneCalculation =
			await WheelOfFortuneServiceInstanse.computeWheelOfFortuneMissions(requestBody);

		this.calculation = wheelOfFortuneCalculation;
		this.calculation.calculationName = '';
		this.isCalculationActive = true;
	}

	public async saveWheelOfFortune(): Promise<void> {
		if (this.calculation) {
			const response = await WheelOfFortuneServiceInstanse.saveWheelOfFortuneMissions({
				form: this.form,
				calculation: this.calculation,
				saveDate: new Date().toISOString().substring(0, 10),
			});
		} else {
			message.error('Невозможно сохранить расчёт');
		}
	}

	public async fetchWheelOfFortuneMissionsHistory(): Promise<
		Array<IWheelOfFortuneMissionsConfigurationResponse>
	> {
		const wheelOfFortuneShowcaseHistory =
			await WheelOfFortuneServiceInstanse.fetchWheelOfFortuneMissionsHistory();

		return wheelOfFortuneShowcaseHistory;
	}

	public async deleteWheelOfFortuneMissionsHistoryItemById(id: string): Promise<boolean> {
		return await WheelOfFortuneServiceInstanse.deleteWheelOfFortuneMissionsHistoryItemById(id);
	}

	public async fetchWheelOfFortuneMissionsHistoryItemById(id: string): Promise<void> {
		const wheelOfFortuneMissionsConfiguration =
			await WheelOfFortuneServiceInstanse.fetchWheelOfFortuneMissionsHistoryItemById(id);

		this.form = wheelOfFortuneMissionsConfiguration.jsonData.form;
		this.calculation = wheelOfFortuneMissionsConfiguration.jsonData.calculation;
		this.isCalculationActive = true;
		this.isHistory = !this.isHistory;
	}

	onCalculationNameChange(calculationName: string): void {
		if (this.calculation) {
			this.calculation.calculationName = calculationName;
		}
	}

	get uid(): string {
		return uid(8);
	}

	get activeOptionIndex(): number {
		return this.form.missions.findIndex(item => item.id === this.form.activeOptionId);
	}

	get isMissionsValid(): boolean {
		let valid = true;

		this.form.missions.forEach(mission => {
			console.log(mission);

			if (
				mission.percentBusters.length === 0 ||
				mission.fixed.length === 0 ||
				mission.multBusters.length === 0 ||
				mission.missionIncome === '' ||
				mission.totalTickets === '' ||
				mission.missionName === '' ||
				mission.budget === ''
			) {
				valid = false;
			}
		});

		return valid;
	}

	get numberOfValidMissions(): number {
		let numberOfValidLots = 0;
		this.form.missions.forEach(mission => {
			if (
				mission.percentBusters.length !== 0 &&
				mission.fixed.length !== 0 &&
				mission.multBusters.length !== 0 &&
				mission.missionIncome !== '' &&
				mission.totalTickets !== '' &&
				mission.missionName !== '' &&
				mission.budget !== ''
			) {
				numberOfValidLots++;
			}
		});

		return numberOfValidLots;
	}
}
