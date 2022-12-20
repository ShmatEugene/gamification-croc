import { Button, Col, Row, Space, Table, Popconfirm } from 'antd';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import { RouteNames } from '../router';

export interface IHistoryTableData {
	id: string;
	name: string;
	numberOfActiveDepartments: number;
	date?: string;
	minParticipants: number;
	startBid: number;
}

const AuctionHistory: FC = () => {
	const [dataSource, setDataSource] = React.useState<IHistoryTableData[]>([]);
	const { auctionStore } = useStores();

	async function fetchAuctionsHistory() {
		const response = await auctionStore.fetchAuctionsHistory();
		console.log(response);

		if (response) {
			let data: Array<IHistoryTableData> = [];

			response.forEach(item => {
				const itemData = item.jsonData;
				console.log(itemData.numberOfActiveDepartments);

				if (item.id) {
					data.push({
						id: '' + item.id,
						name: itemData.lotName,
						date: itemData.saveDate,
						numberOfActiveDepartments: itemData.numberOfActiveDepartments,
						minParticipants: itemData.minNumberOfParticipants,
						startBid: itemData.bidRange.from,
					});
				}
			});
			setDataSource(data);
		}
	}

	React.useEffect(() => {
		fetchAuctionsHistory();
	}, []);

	const handleDelete = async (id: string) => {
		const isDeleted = await auctionStore.deleteAuctionHistoryItemById(id);
		if (isDeleted) {
			setDataSource(dataSource?.filter(item => item.id !== id));
		}
	};
	const columns = [
		{
			title: 'Название лота',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Дата',
			dataIndex: 'date',
			key: 'date',
		},
		{
			title: 'Кол-во департаментов',
			key: 'numberOfActiveDepartments',
			dataIndex: 'numberOfActiveDepartments',
		},
		{
			title: 'Начальная ставка',
			key: 'startBid',
			dataIndex: 'startBid',
		},
		{
			title: 'Действие',
			key: 'action',
			dataIndex: 'action',
			render: (_, record: { id: string }) => (
				<Space size='middle'>
					<Link to={RouteNames.AUCTION_HISTORY_ITEM.split(':')[0] + record.id}>
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

export default AuctionHistory;
