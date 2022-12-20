import { IEmployee } from './EmployeeInterface';

export interface IDepartment {
	id: number;
	isChecked?: boolean;
	departmentName: string;
	giniCoefficient: number | string;
	minimumBalance: number;
	maximumBalance: number;
	numberOfStaff: number;
	// bobrDistribution: Array<number>;
	staff: Array<IEmployee>;
}
