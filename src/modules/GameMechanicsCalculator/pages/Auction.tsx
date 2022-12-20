import { Button, Col, Empty, Form, Row } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuctionForm from '../components/Auction/AuctionForm/AuctionForm';
import Calculation from '../components/Auction/Calculation/Calculation';
import DepartmentsTable from '../components/Auction/DepartmentsTable/DepartmentsTable';
import { useStores } from '../hooks/useStores';
import { RouteNames } from '../router';

const Auction: FC = observer(() => {
	const { auctionStore } = useStores();
	let navigate = useNavigate();
	const params = useParams();

	async function fetchAuctionById(auctionId: string) {
		const response = await auctionStore.fetchAuctionsHistoryItemById(auctionId);
	}

	React.useEffect(() => {
		if (params.id) {
			fetchAuctionById(params.id);
			navigate(RouteNames.AUCTION);
		}
	}, []);

	return (
		<>
			<Row style={{ marginTop: 50 }} justify='center'>
				<Col flex={'0 0 1200px'} xs={{ span: 20 }}>
					<Row justify='space-between'>
						<Col span={7}>
							<AuctionForm />
						</Col>
						<Col span={16}>
							{auctionStore.departments ? (
								<DepartmentsTable departments={auctionStore.departments} />
							) : (
								<Empty />
							)}
						</Col>
					</Row>
					{auctionStore.isCalculationActive ? <Calculation /> : ''}
				</Col>
			</Row>
		</>
	);
});

export default Auction;
