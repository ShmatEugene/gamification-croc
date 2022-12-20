import { AxiosResponse } from 'axios';
import { observable, makeAutoObservable, computed, action } from 'mobx';
import { IRootStore } from '.';
import { AuctionServiceInstance } from '../api/AuctionService';
import { ICalculationBarChart } from '../models/CalculationBarChartInterface';
import { IDepartment } from '../models/DepartmentInterface';
import { IEmployee, IEmployeeExtra } from '../models/EmployeeInterface';
import { message } from 'antd';
import { IAuctionConfiguration, IAuctionConfigurationResponse } from '../models/AuctionInterfaces';

export interface IAuction {
	isCalculationActive: boolean;
	lotName: string;
	lotPriceInRub: number;
	minNumberOfParticipants: number;

	bidRange: {
		from: number;
		to: number;
	};
	sliderRange: {
		from: number;
		to: number;
	};
	departments?: Array<IDepartment>;
	mergedEmployees: Array<IEmployee>;

	saveDate?: string;
	auctionId?: string;

	setFormData(lotName: string, lotPriceInRub: number, minNumberOfParticipants: number): void;
	uploadBalanceTable(options): void;
	uploadPurchasesTable(options): void;
	uploadMissionsTable(options): void;
	postCurrentAuction(): void;
	setBidRange(startBid: number, endBid: number): void;
	setSliderRange(startBid: number, endBid: number): void;
	onCheckDepartment(index: number): void;
	onCheckAllDepartments(isChecked: boolean): void;
	fetchAuctionsHistory(): Promise<Array<IAuctionConfigurationResponse>>;
	fetchAuctionsHistoryItemById(auctionId: string): Promise<void>;
	deleteAuctionHistoryItemById(auctionId: string): Promise<boolean>;
	get calculationChartData(): Array<ICalculationBarChart>;
	get numberOfParticipants(): number;
	get percentOfParticipants(): number;
	get numberOfActiveDepartments(): number;
	get lotPriceInBobr(): number;
	get checkAllDepartmentsActive(): boolean;
}

export class AuctionStore implements IAuction {
	private rootStore: IRootStore;

	isCalculationActive: boolean;
	lotName: string;
	lotPriceInRub: number;
	minNumberOfParticipants: number;
	bidRange: {
		from: number;
		to: number;
	};
	sliderRange: {
		from: number;
		to: number;
	};
	departments?: IDepartment[];
	mergedEmployees: Array<IEmployee>;

	constructor(rootStore: IRootStore) {
		makeAutoObservable(this, {
			lotName: observable,
			lotPriceInRub: observable,
			minNumberOfParticipants: observable,
			departments: observable,
			bidRange: observable,
		});
		this.rootStore = rootStore;
		this.bidRange = {
			from: 0,
			to: 50000,
		};
		this.sliderRange = {
			from: 0,
			to: 50000,
		};
		this.mergedEmployees = [];
		this.isCalculationActive = false;
	}

	public setFormData = (
		lotName: string,
		lotPriceInRub: number,
		minNumberOfParticipants: number
	) => {
		this.lotName = lotName;
		this.lotPriceInRub = lotPriceInRub;
		this.minNumberOfParticipants = minNumberOfParticipants;
		this.bidRange.from = lotPriceInRub;
		this.isCalculationActive = true;
	};

	public setDepartments(departments: Array<IDepartment>): void {
		this.departments = departments;
		this.departments.forEach(department => {
			department.isChecked = true;
		});
	}

	public async uploadBalanceTable(options): Promise<void> {
		const response = await AuctionServiceInstance.uploadBalanceTable(options);

		this.setDepartments(response.data);
		this.updateMergedEmployees();
	}

	public async uploadPurchasesTable(options): Promise<void> {
		const staffExtraInfo = await AuctionServiceInstance.uploadPurchasesTable(options);

		this.mergeEmployeesByField(staffExtraInfo.data, 'userCrocCode');
	}

	public async uploadMissionsTable(options): Promise<void> {
		const staffExtraInfo = await AuctionServiceInstance.uploadMissionsTable(options);

		this.mergeEmployeesByField(staffExtraInfo.data, 'login');
	}

	public async postCurrentAuction(): Promise<void> {
		const requestBody: IAuctionConfiguration = {
			isCalculationActive: this.isCalculationActive,
			lotName: this.lotName,
			lotPriceInRub: this.lotPriceInRub,
			lotPriceInBobr: this.lotPriceInBobr,
			minNumberOfParticipants: this.minNumberOfParticipants,

			bidRange: this.bidRange,
			sliderRange: this.sliderRange,
			departments: this.departments || [],
			mergedEmployees: this.mergedEmployees,
			numberOfActiveDepartments: this.numberOfActiveDepartments,

			saveDate: new Date().toISOString().substring(0, 10),
		};

		const response = await AuctionServiceInstance.postCurrentAuction(requestBody);
		console.log(response.data);
	}

	public async fetchAuctionsHistory(): Promise<Array<IAuctionConfigurationResponse>> {
		const auctionHistory = await AuctionServiceInstance.fetchAuctionsHistory();

		return auctionHistory;
	}

	public async deleteAuctionHistoryItemById(auctionId: string): Promise<boolean> {
		return await AuctionServiceInstance.deleteAuctionHistoryItemById(auctionId);
	}

	public async fetchAuctionsHistoryItemById(auctionId: string): Promise<void> {
		const auctionConfiguration = await AuctionServiceInstance.fetchAuctionsHistoryItemById(
			auctionId
		);

		this.isCalculationActive = auctionConfiguration.jsonData.isCalculationActive;
		this.lotName = auctionConfiguration.jsonData.lotName;
		this.lotPriceInRub = auctionConfiguration.jsonData.lotPriceInRub;
		this.minNumberOfParticipants = auctionConfiguration.jsonData.minNumberOfParticipants;

		this.bidRange = auctionConfiguration.jsonData.bidRange;
		this.sliderRange = auctionConfiguration.jsonData.bidRange;
		this.departments = auctionConfiguration.jsonData.departments;
		this.mergedEmployees = auctionConfiguration.jsonData.mergedEmployees;
	}

	public onCheckDepartment(id: number): void {
		if (this.departments) {
			this.departments.forEach(department => {
				if (department.id === id) {
					department.isChecked = !department.isChecked;
				}
			});
		}
		this.updateMergedEmployees();

		// if (this.mergedEmployees[0]?.availableBalance > this.bidRange.from) {
		// 	this.bidRange.from = this.mergedEmployees[0]?.availableBalance;
		// }
		// if (
		// 	this.mergedEmployees[this.mergedEmployees.length - 1]?.availableBalance < this.bidRange.to
		// ) {
		// 	this.bidRange.to = this.mergedEmployees[this.mergedEmployees.length - 1]?.availableBalance;
		// }
	}

	public onCheckAllDepartments(isChecked: boolean): void {
		this.departments?.forEach(department => {
			department.isChecked = isChecked;
		});

		this.updateMergedEmployees();

		// if (!isChecked) {
		// 	this.bidRange.from = 10;
		// 	this.bidRange.to = 100;
		// } else {
		// 	this.bidRange.from = this.mergedEmployees[0]?.availableBalance;
		// 	this.bidRange.to = this.mergedEmployees[this.mergedEmployees.length - 1]?.availableBalance;
		// }
	}

	public setBidRange(startBid: number, endBid: number) {
		if (startBid != null) {
			this.bidRange.from = startBid;
			this.sliderRange.from = startBid;
			this.bidRange.to = endBid;
			this.sliderRange.to = endBid;
		}
	}

	public setSliderRange(startBid: number, endBid: number) {
		if (startBid != null) {
			this.sliderRange.from = startBid;
			this.sliderRange.to = endBid;
		}
	}

	public get mergedEmployeesByActivity(): {
		active: Array<IEmployee>;
		inactive: Array<IEmployee>;
	} {
		const active: Array<IEmployee> = [];
		const inactive: Array<IEmployee> = [];
		this.mergedEmployees.forEach(employee => {
			if (
				this.checkIfEmployeeIsActive(
					employee.earned || 0,
					employee.missionsCompleted || 0,
					employee.spent || 0,
					employee.numberOfPurchases || 0
				)
			) {
				active.push(employee);
			} else {
				inactive.push(employee);
			}
		});

		return { active, inactive };
	}

	public get calculationChartData(): Array<ICalculationBarChart> {
		const rangeFrom = this.bidRange.from,
			rangeTo = this.bidRange.to;

		const { active, inactive } = this.mergedEmployeesByActivity;

		const inactiveParticipantsArray = inactive.filter(
			employee => employee.availableBalance >= rangeFrom
		);
		const activeParticipantsArray = active.filter(
			employee => employee.availableBalance >= rangeFrom
		);

		const MAX_BARS = 10;

		const step = Math.ceil((rangeTo - rangeFrom) / MAX_BARS);

		let data: Array<ICalculationBarChart> = [
			{
				stepStart: rangeFrom,
				numberOfInactiveParticipants: inactiveParticipantsArray.length,
				numberOfActiveParticipants: activeParticipantsArray.length,
			},
		];

		for (let i = 0; i < MAX_BARS - 1; i++) {
			data.push({
				stepStart: rangeFrom + (i + 1) * step,
				numberOfInactiveParticipants: 0,
				numberOfActiveParticipants: 0,
			});
		}

		let inactiveParticipantIndex = 0;
		let activeParticipantIndex = 0;

		inactiveParticipantsArray.reverse();
		activeParticipantsArray.reverse();

		data.reverse().forEach((bar, index) => {
			if (index != 0) {
				bar.numberOfInactiveParticipants = data[index - 1].numberOfInactiveParticipants;
				bar.numberOfActiveParticipants = data[index - 1].numberOfActiveParticipants;
			}

			for (
				inactiveParticipantIndex;
				inactiveParticipantIndex < inactiveParticipantsArray.length &&
				inactiveParticipantsArray[inactiveParticipantIndex].availableBalance >= bar.stepStart;
				inactiveParticipantIndex++
			) {
				bar.numberOfInactiveParticipants += 1;
			}
			for (
				activeParticipantIndex;
				activeParticipantIndex < activeParticipantsArray.length &&
				activeParticipantsArray[activeParticipantIndex].availableBalance >= bar.stepStart;
				activeParticipantIndex++
			) {
				bar.numberOfActiveParticipants += 1;
			}
		});
		data.reverse();

		return data;
	}

	public get numberOfParticipants(): number {
		return this.countGreater(this.mergedEmployees, this.mergedEmployees.length, this.bidRange.from);
	}

	public get percentOfParticipants(): number {
		if (this.numberOfParticipants !== 0) {
			return Math.ceil((this.numberOfParticipants / this.mergedEmployees.length) * 100);
		} else {
			return 0;
		}
	}

	public get numberOfActiveDepartments(): number {
		let numberOfActiveDepartments = 0;
		this.departments?.forEach(department => {
			if (department.isChecked) {
				numberOfActiveDepartments++;
			}
		});

		return numberOfActiveDepartments;
	}

	public get lotPriceInBobr(): number {
		const exchangeRate = this.rootStore.settingsStore.exchangeRate;
		const lotPriceInBobr = Math.ceil(this.lotPriceInRub / exchangeRate);
		return lotPriceInBobr;
	}

	public get checkAllDepartmentsActive(): boolean {
		let isAllChecked = true;
		if (this.departments) {
			this.departments.forEach(department => {
				if (department.isChecked !== true) {
					isAllChecked = false;
				}
			});
		}
		return isAllChecked;
	}

	private checkIfEmployeeIsActive(
		earned: number,
		missionsCompleted: number,
		spent: number,
		numberOfPurchases: number
	): boolean {
		const EARNED_COND = this.rootStore.settingsStore.earned,
			MISSIONS_COMPLETED_COND = this.rootStore.settingsStore.missionsCompleted,
			SPENT_COND = this.rootStore.settingsStore.spent,
			NUMBER_OF_PURCHASES_COND = this.rootStore.settingsStore.numberOfPurchases;

		console.log('start: ', earned, missionsCompleted, spent, numberOfPurchases);

		if (
			earned >= EARNED_COND &&
			missionsCompleted >= MISSIONS_COMPLETED_COND &&
			spent >= SPENT_COND &&
			numberOfPurchases >= NUMBER_OF_PURCHASES_COND
		) {
			return true;
		}
		console.log(earned, missionsCompleted, spent, numberOfPurchases);

		return false;
	}

	private updateMergedEmployees(): void {
		this.mergedEmployees = [];

		this.departments?.forEach(department => {
			if (department.isChecked && this.mergedEmployees) {
				this.mergedEmployees = this.mergedEmployees.concat(department.staff);
			}
		});
		this.mergedEmployees = this.mergedEmployees?.sort((a, b) => {
			return a.availableBalance - b.availableBalance;
		});
	}

	private mergeEmployeesByField(staffExtraInfo: IEmployeeExtra[], field: string) {
		let mergedEmployeesCounter = 0;

		staffExtraInfo.forEach(employeeExtraInfo => {
			const linkValue = employeeExtraInfo[field] || '';

			if (this.departments) {
				loop1: for (let i = 0; i < this.departments.length; i++) {
					const department = this.departments[i];
					for (let j = 0; j < department.staff.length; j++) {
						const employee = department.staff[j];

						if (employee[field] === linkValue) {
							mergedEmployeesCounter++;
							Object.keys(employeeExtraInfo).forEach(extraField => {
								employee[extraField] = employeeExtraInfo[extraField];
							});
							break loop1;
						}
					}
				}
			}
		});

		message.info(
			`Обработано ${mergedEmployeesCounter} сотрудников из ${this.mergedEmployees.length}`
		);
	}

	private countGreater(arr: Array<IEmployee>, n: number, k: number) {
		let l = 0;
		let r = n - 1;

		let leftGreater = n;

		while (l <= r) {
			let m = l + Math.ceil((r - l) / 2);

			if (arr[m].availableBalance >= k) {
				leftGreater = m;
				r = m - 1;
			} else l = m + 1;
		}

		return n - leftGreater;
	}
}
