export interface IWheelOfFortuneShowcaseForm {
	wheelNextTime: number;
	computationBudget: number;
	computationType: number;
	activeOptionId: string;
	fortuneItems: [
		{
			id: string;
			lotName: string;
			price: string;
			tickets: string;
			percentage: string;
			discounts: Array<number>;
		}
	];
}

export interface IWheelOfFortuneShowcaseCalculation {
	spent: number;
	tickets: number;
	calculationName?: string;
	fortuneItems: [
		{
			id: string;
			lotName: string;
			totalSpentInRub: number;
			tickets: number;
			percentage: number;
			discountTickets: [
				{
					first: string; // discount
					second: number; // number of tickets
				}
			];
		}
	];
}

export interface IWheelOfFortuneShowcaseConfiguration {
	form: IWheelOfFortuneShowcaseForm;
	calculation: IWheelOfFortuneShowcaseCalculation;
	saveDate: string;
}

export interface IWheelOfFortuneShowcaseConfigurationResponse {
	jsonData: IWheelOfFortuneShowcaseConfiguration;
	id: number;
}
