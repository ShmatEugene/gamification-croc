import { IDepartment } from './DepartmentInterface';
import { IEmployee } from './EmployeeInterface';

export interface IAuctionConfiguration {
	isCalculationActive: boolean;
	lotName: string;
	lotPriceInRub: number;
	lotPriceInBobr: number;
	minNumberOfParticipants: number;

	bidRange: {
		from: number;
		to: number;
	};
	sliderRange: {
		from: number;
		to: number;
	};
	departments: Array<IDepartment>;
	mergedEmployees: Array<IEmployee>;
	numberOfActiveDepartments: number;

	saveDate?: string;
}

export interface IAuctionConfigurationResponse {
	jsonData: IAuctionConfiguration;
	id: number;
}
