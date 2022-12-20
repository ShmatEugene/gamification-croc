import { observer } from 'mobx-react-lite';
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStores } from '../../../../hooks/useStores';
import { IEmployee } from '../../../../models/EmployeeInterface';

const AllDepartmentsChart = observer(() => {
	const { auctionStore } = useStores();

	return (
		<ResponsiveContainer width='100%' height='100%'>
			<BarChart
				width={500}
				height={400}
				// data={generateChartDataFromStaffArray(inactive, active)}
				data={auctionStore.calculationChartData}
				margin={{
					top: 10,
					right: 30,
					left: 0,
					bottom: 0,
				}}
			>
				<XAxis dataKey='stepStart' />
				<YAxis />
				<Tooltip
					formatter={(value, name) => {
						if (name.includes('Active')) {
							return [value, 'Активных'];
						} else {
							return [value, 'Неактивных'];
						}
					}}
				/>
				<Bar
					dataKey='numberOfInactiveParticipants'
					label='Сотрудников'
					stroke='#00A460'
					fill='#00A460'
					radius={[0, 0, 0, 0]}
					stackId='a'
				></Bar>
				<Bar
					dataKey='numberOfActiveParticipants'
					fill='#d1d1d1'
					stackId='a'
					radius={[3, 3, 0, 0]}
				></Bar>
			</BarChart>
		</ResponsiveContainer>
	);
});

export default AllDepartmentsChart;
