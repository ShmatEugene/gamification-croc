export interface IEmployee {
	userCrocCode: string;
	availableBalance: number;
	userName: string;
	userLastName: string;
	userFirstName: string;
	userMiddleName: string;
	login?: string;
	spent?: number;
	numberOfPurchases?: number;
	missionsCompleted?: number;
	earned?: number;
}

export interface IEmployeeExtra {
	userCrocCode?: string;
	login?: string;
	spent?: number;
	numberOfPurchases?: number;
	missionsCompleted?: number;
	earned?: number;
}
