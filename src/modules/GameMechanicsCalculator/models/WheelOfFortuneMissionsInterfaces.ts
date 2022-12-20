export interface IWheelOfFortuneMissionsForm {
	wheelNextTime: number;
	computationType: number;
	activeOptionId: string;
	missions: [
		{
			id: string;
			missionName: string;
			totalTickets: string;
			budget: string;
			missionIncome: string;
			percentBusters: Array<number>;
			multBusters: Array<number>;
			fixed: Array<number>;
		}
	];
}

export interface IWheelOfFortuneMissionsRequestBody {
	wheelNextTime: number;
	computationType: number;
	activeOptionId: number;
	missions: [
		{
			id: number;
			missionName: string;
			totalTickets: number;
			budget: number;
			missionIncome: number;
			percentBusters: Array<number>;
			multBusters: Array<number>;
			fixed: Array<number>;
		}
	];
}

export interface IWheelOfFortuneMissionsCalculation {
	totalSpent: number;
	totalTickets: number;
	calculationName?: string;
	missions: [
		{
			missionName: string;
			budget: string;
			missionIncome: string;
			spent: number;
			tickets: number;
			multBusterTickets: number;
			multBusters: [
				{
					bonus: number;
					tickets: number;
				}
			];
			percentBusterTickets: number;
			percentBusters: [
				{
					bonus: number;
					tickets: number;
				}
			];
			fixedTickets: number;
			fixedBusters: [
				{
					bonus: number;
					tickets: number;
				}
			];
		}
	];
}

export interface IWheelOfFortuneMissionsConfiguration {
	form: IWheelOfFortuneMissionsForm;
	calculation: IWheelOfFortuneMissionsCalculation;
	saveDate: string;
}

export interface IWheelOfFortuneMissionsConfigurationResponse {
	jsonData: IWheelOfFortuneMissionsConfiguration;
	id: number;
}
