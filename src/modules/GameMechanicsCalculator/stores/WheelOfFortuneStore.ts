import { message } from 'antd';
import { observable, makeAutoObservable, computed, action } from 'mobx';
import { FieldData } from 'rc-field-form/lib/interface';
import { uid } from 'uid';
import { IRootStore } from '.';
import { WheelOfFortuneServiceInstanse } from '../api/WheelOfFortuneService';
import {
	IWheelOfFortuneShowcaseCalculation,
	IWheelOfFortuneShowcaseConfiguration,
	IWheelOfFortuneShowcaseConfigurationResponse,
	IWheelOfFortuneShowcaseForm,
} from '../models/WheelOfFortuneInterfaces';

export interface IWheelOfFoutune {
	form: IWheelOfFortuneShowcaseForm;
	calculation?: IWheelOfFortuneShowcaseCalculation;
	isCalculationActive: boolean;
	isHistory: boolean;

	onFortuneItemsChange(e: React.ChangeEvent<HTMLInputElement>): void;
	addFortuneItem(): void;
	removeActiveFortuneItem(): void;
	onFortuneItemsOptionChange(value: string): void;
	onActiveDiscountChange(discounts: Array<number>): void;
	onComputationTypeChange(type: number): void;
	getActiveItemIndexById(id: string): number;

	computeWheelOfFortune(values): Promise<void>;
	onCalculationNameChange(calculationName: string): void;
	onCalculationTableEdit(value: number, rowIndex: number, activeOption: string): void;
	saveWheelOfFortune(): Promise<void>;
	fetchWheelOfFortuneShowcaseHistory(): Promise<
		Array<IWheelOfFortuneShowcaseConfigurationResponse>
	>;
	deleteWheelOfFortuneShowcaseHistoryItemById(id: string): Promise<boolean>;
	fetchWheelOfFortuneShowcaseHistoryItemById(id: string): Promise<void>;

	convertRubToBobr(rubs: number): number;
	getLotPercentage(spent: number): number;

	get uid(): string;
	get activeOptionIndex(): number;
	get isLotsValid(): boolean;
	get numberOfValidLots(): number;
}

export class WheelOfFoutuneStore implements IWheelOfFoutune {
	private rootStore: IRootStore;

	form: IWheelOfFortuneShowcaseForm;
	calculation?: IWheelOfFortuneShowcaseCalculation;
	isCalculationActive: boolean;
	isHistory: boolean;

	constructor(rootStore: IRootStore) {
		makeAutoObservable(this, {
			form: observable,
		});
		this.form = {
			wheelNextTime: 0,
			computationBudget: 0,
			computationType: 0,
			fortuneItems: [
				{
					id: '0',
					lotName: '',
					price: '',
					tickets: '',
					percentage: '',
					discounts: this.defaultDiscounts,
				},
			],
			activeOptionId: '0',
		};
		this.isCalculationActive = false;
		this.isHistory = false;

		this.rootStore = rootStore;
	}

	defaultDiscounts = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

	addFortuneItem(): void {
		const uid = this.uid;
		this.form.fortuneItems.push({
			id: uid,
			lotName: '',
			price: '',
			tickets: '',
			percentage: '',
			discounts: this.defaultDiscounts,
		});
		this.form.activeOptionId = uid;

		message.info(`Добавлен лот`);
	}

	removeActiveFortuneItem(): void {
		if (this.form.fortuneItems.length > 1) {
			// @ts-ignore
			this.form.fortuneItems = this.form.fortuneItems.filter(item => {
				if (item.id !== this.form.activeOptionId) {
					return true;
				} else {
					message.info(`Удален лот ${item.lotName !== '' ? item.lotName : 'Без названия'}`);
					return false;
				}
			});
			this.form.activeOptionId = this.form.fortuneItems[0].id;
		} else {
			message.error('Остался только один лот');
		}
	}

	onFortuneItemsOptionChange(value: string): void {
		this.form.activeOptionId = value;
	}

	onFortuneItemsChange(e: React.ChangeEvent<HTMLInputElement>): void {
		const value = e.target.value;
		const name = e.target.name;
		const itemIndex = this.activeOptionIndex;
		this.form.fortuneItems[itemIndex][name] = value;
	}

	onActiveDiscountChange(discounts: Array<number>): void {
		this.form.fortuneItems[this.activeOptionIndex].discounts = discounts;
	}

	onComputationTypeChange(type: number) {
		this.form.computationType = type;
	}

	convertRubToBobr(rubs: number): number {
		return Math.ceil(rubs / this.rootStore.settingsStore.exchangeRate);
	}

	getActiveItemIndexById(id: string): number {
		let index = 0;
		this.form.fortuneItems.forEach((item, i) => {
			if (item.id === id) {
				index = i;
			}
		});

		return index;
	}

	getLotPercentage(spent: number): number {
		console.log(spent, this.form.computationBudget);

		return Math.ceil((spent / this.form.computationBudget) * 100);
	}

	onCalculationNameChange(calculationName: string): void {
		if (this.calculation) {
			this.calculation.calculationName = calculationName;
		}
	}

	onCalculationTableEdit(value: number, rowIndex: number, activeOption: string): void {
		if (this.calculation) {
			const activeFortuneItemIndex = this.getActiveItemIndexById(activeOption);
			this.calculation.fortuneItems[activeFortuneItemIndex].discountTickets[rowIndex].second =
				value;
		}
	}

	public async computeWheelOfFortune(values): Promise<void> {
		this.form.computationBudget = values.totalBudget;
		this.form.wheelNextTime = values.wheelNextTime;

		const wheelOfFortuneCalculation = await WheelOfFortuneServiceInstanse.computeWheelOfFortuneLots(
			this.form
		);

		this.calculation = wheelOfFortuneCalculation;
		this.calculation.calculationName = '';
		this.isCalculationActive = true;
		console.log(this.calculation, wheelOfFortuneCalculation);
	}

	public async saveWheelOfFortune(): Promise<void> {
		if (this.calculation) {
			const response = await WheelOfFortuneServiceInstanse.saveWheelOfFortuneShowcase({
				form: this.form,
				calculation: this.calculation,
				saveDate: new Date().toISOString().substring(0, 10),
			});
		} else {
			message.error('Невозможно сохранить расчёт');
		}
	}

	public async fetchWheelOfFortuneShowcaseHistory(): Promise<
		Array<IWheelOfFortuneShowcaseConfigurationResponse>
	> {
		const wheelOfFortuneShowcaseHistory =
			await WheelOfFortuneServiceInstanse.fetchWheelOfFortuneShowcaseHistory();

		return wheelOfFortuneShowcaseHistory;
	}

	get uid(): string {
		return uid(8);
	}

	public async deleteWheelOfFortuneShowcaseHistoryItemById(id: string): Promise<boolean> {
		return await WheelOfFortuneServiceInstanse.deleteWheelOfFortuneShowcaseHistoryItemById(id);
	}

	public async fetchWheelOfFortuneShowcaseHistoryItemById(id: string): Promise<void> {
		const wheelOfFortuneShowcaseConfiguration =
			await WheelOfFortuneServiceInstanse.fetchWheelOfFortuneShowcaseHistoryItemById(id);

		this.form = wheelOfFortuneShowcaseConfiguration.jsonData.form;
		this.calculation = wheelOfFortuneShowcaseConfiguration.jsonData.calculation;
		this.isCalculationActive = true;
		this.isHistory = !this.isHistory;
	}

	get activeOptionIndex(): number {
		return this.form.fortuneItems.findIndex(item => item.id === this.form.activeOptionId);
	}

	get isLotsValid(): boolean {
		let valid = true;

		this.form.fortuneItems.forEach(item => {
			console.log(item);

			if (
				item.discounts.length === 0 ||
				item.lotName === '' ||
				item.percentage === '' ||
				item.price === '' ||
				item.tickets === ''
			) {
				valid = false;
			}
		});

		return valid;
	}

	get numberOfValidLots(): number {
		let numberOfValidLots = 0;
		this.form.fortuneItems.forEach(item => {
			if (
				item.discounts.length !== 0 &&
				item.lotName !== '' &&
				item.percentage !== '' &&
				item.price !== '' &&
				item.tickets !== ''
			) {
				numberOfValidLots++;
			}
		});

		return numberOfValidLots;
	}
}
