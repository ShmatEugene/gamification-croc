import React, { FC } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { IEmployee } from '../../../../models/EmployeeInterface';

type Props = {
	staff: Array<IEmployee>;
};

const MoneyDistributionChart: FC<Props> = ({ staff }: Props) => {
	const generateDataFromStaffArray = (staff: Array<IEmployee>) => {
		return staff.map((employee, index) => {
			return {
				name: index,
				balance: employee.availableBalance,
			};
		});
	};

	return (
		<ResponsiveContainer width='100%' height='100%'>
			<AreaChart
				width={500}
				height={400}
				data={generateDataFromStaffArray(staff)}
				margin={{
					top: 10,
					right: 30,
					left: 0,
					bottom: 0,
				}}
			>
				<XAxis dataKey='name' />
				<YAxis />
				<Tooltip formatter={value => [value, 'Бобриков']} />
				<Area type='monotone' dataKey='balance' stroke='#00A460' fill='#00A460' />
			</AreaChart>
		</ResponsiveContainer>
	);
};

export default MoneyDistributionChart;
