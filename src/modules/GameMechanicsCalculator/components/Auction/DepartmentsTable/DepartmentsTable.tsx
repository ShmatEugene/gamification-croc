import { Col, Collapse, Form, Input, Row, Space, Switch, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { useStores } from '../../../hooks/useStores';
import { IDepartment } from '../../../models/DepartmentInterface';
import DepartmentDetail from '../DepartmentDetail/DepartmentDetail';

import './DepartmentsTable.scss';

type Props = {
	departments: IDepartment[];
};

const DepartmentsTable: FC<Props> = observer(({ departments }) => {
	const { auctionStore } = useStores();
	const [departmentsFilter, setDepartmentsFilter] = React.useState('');

	const renderCollapsePannels = (departments: IDepartment[]) => {
		return departments
			.filter(department =>
				department.departmentName.toString().toLowerCase().includes(departmentsFilter.toLowerCase())
			)
			.map((department, index) => {
				return (
					<Collapse.Panel
						key={department.id + ' ' + index}
						header={renderCollapseHeader(department, index)}
					>
						<DepartmentDetail department={department} />
					</Collapse.Panel>
				);
			});
	};

	const renderCollapseHeader = (department: IDepartment, index: number) => {
		const HIGH_DISBALANE = 0.5;

		return (
			<Row className='departments-table__row' align='middle' gutter={20}>
				<Col span={3}>
					<div onClick={e => e.stopPropagation()}>
						<Switch
							onChange={() => {
								auctionStore.onCheckDepartment(department.id);
							}}
							checked={department?.isChecked}
						/>
					</div>
				</Col>
				<Col span={16}>{department.departmentName}</Col>
				<Col span={5}>
					<Row align='middle' className='departments-table__disbalance'>
						<Col
							className={`departments-table__disbalance-icon ${
								department.giniCoefficient > HIGH_DISBALANE
									? 'departments-table__disbalance-icon_high'
									: 'departments-table__disbalance-icon_low'
							}`}
						></Col>
						<Col className='departments-table__disbalance-text'>
							{department.giniCoefficient > HIGH_DISBALANE ? 'Высокий' : 'Низкий'}
						</Col>
					</Row>
				</Col>
			</Row>
		);
	};
	return (
		<>
			<div className='departments-table'>
				<Form layout='vertical'>
					<Row className='departments-table__filter' align='middle' gutter={20}>
						<Col span={5}>
							<Row>
								<Space>
									<Switch
										defaultChecked={true}
										onChange={checked => auctionStore.onCheckAllDepartments(checked)}
										checked={auctionStore.checkAllDepartmentsActive}
									/>
									Выбрать все
								</Space>
							</Row>
						</Col>
						<Col span={19}>
							<Form.Item label='Фильтр по департаментам'>
								<Input onChange={e => setDepartmentsFilter(e.target.value)} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<Row className='departments-table__header' align='middle' gutter={20}>
					<Col offset={3} span={16}>
						Департамаент
					</Col>
					<Col span={5}>Дисбаланс</Col>
				</Row>

				<Collapse
					className='departments-table__content'
					defaultActiveKey={['1']}
					expandIconPosition={'right'}
					ghost={true}
				>
					{renderCollapsePannels(departments)}
				</Collapse>
			</div>
		</>
	);
});

export default DepartmentsTable;
