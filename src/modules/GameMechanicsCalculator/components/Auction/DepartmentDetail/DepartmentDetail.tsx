import { Col, Row, Statistic } from 'antd';
import React, { FC } from 'react';
import { IDepartment } from '../../../models/DepartmentInterface';
import MoneyDistributionChart from './MoneyDistributionChart/MoneyDistributionChart';

type Props = {
	department: IDepartment;
};

const DepartmentDetail: FC<Props> = ({ department }) => {
	return (
		<Row gutter={16}>
			<Col span={10}>
				<Row gutter={[0, 16]}>
					<Col span={12}>
						<Statistic title='Минимальный баланс' value={department.minimumBalance + ' Б'} />
					</Col>
					<Col span={12}>
						<Statistic
							title='Максимальный баланс'
							value={department.maximumBalance + ' Б'}
							precision={2}
						/>
					</Col>
					<Col span={12}>
						<Statistic title='Кол-во сотрудников' value={department.numberOfStaff + ' чел.'} />
					</Col>
					<Col span={12}>
						<Statistic title='Индекс Джини' value={department.giniCoefficient} />
					</Col>
				</Row>
			</Col>
			<Col span={14}>
				<MoneyDistributionChart staff={department.staff} />
			</Col>
		</Row>
	);
};

export default DepartmentDetail;
