import { Button, Col, Row, Space, Table, Popconfirm } from 'antd';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import { RouteNames } from '../router';

export interface IHistoryTableData {
	id: string;
	name: string;
	computationType: number;
	date?: string;
	tickets: number;
	totalSpent: number;
}

const WheelOfFortuneMissionsHistory: FC = () => {
	const [dataSource, setDataSource] = React.useState<IHistoryTableData[]>([]);
	const { wheelOfFortuneMissionsStore } = useStores();

	async function fetchWheelOfFortuneMissionsHistory() {
		const response = await wheelOfFortuneMissionsStore.fetchWheelOfFortuneMissionsHistory();
		if (response) {
			let data: Array<IHistoryTableData> = [];
			response.forEach(item => {
				const itemData = item.jsonData;
				if (item.id) {
					data.push({
						id: '' + item.id,
						name: itemData.calculation.calculationName || '',
						date: itemData.saveDate,
						computationType: itemData.form.computationType,
						tickets: itemData.calculation.totalTickets,
						totalSpent: itemData.calculation.totalSpent,
					});
				}
			});
			setDataSource(data);
		}
	}

	React.useEffect(() => {
		fetchWheelOfFortuneMissionsHistory();
	}, []);

	const handleDelete = async (id: string) => {
		const isDeleted = await wheelOfFortuneMissionsStore.deleteWheelOfFortuneMissionsHistoryItemById(
			id
		);
		if (isDeleted) {
			setDataSource(dataSource?.filter(item => item.id !== id));
		}
	};
	const columns = [
		{
			title: 'Название',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Дата',
			dataIndex: 'date',
			key: 'date',
		},
		{
			title: 'Тип расчета',
			key: 'computationType',
			dataIndex: 'computationType',
			render: (text, record: { id: string }) => <>{text === 0 ? 'Щедрый' : 'Экономный'}</>,
		},
		{
			title: 'Билетов',
			dataIndex: 'tickets',
			key: 'tickets',
		},

		{
			title: 'Затраты, Р',
			key: 'totalSpent',
			dataIndex: 'totalSpent',
		},
		{
			title: 'Действие',
			key: 'action',
			dataIndex: 'action',
			render: (_, record: { id: string }) => (
				<Space size='middle'>
					<Link to={RouteNames.WHEEL_OF_FORTUNE_MISSIONS_HISTORY_ITEM.split(':')[0] + record.id}>
						<Button type='primary' shape='round'>
							Посмотреть
						</Button>
					</Link>
					<Popconfirm
						title='Вы уверены?'
						okText='Да'
						cancelText='Нет'
						onConfirm={() => handleDelete(record.id)}
					>
						<Button type='default' shape='round'>
							Удалить
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const pageSize = 10;
	return (
		<>
			<Row style={{ marginTop: 50 }} justify='center'>
				<Col flex={'0 0 1200px'} xs={{ span: 20 }}>
					<Table
						columns={columns}
						dataSource={dataSource}
						pagination={dataSource.length > pageSize && { pageSize }}
					/>
				</Col>
			</Row>
		</>
	);
};

export default WheelOfFortuneMissionsHistory;
