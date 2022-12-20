import { Col, Empty, Row } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WheelOfFourtuneMissionsCalculation from '../components/WheelOfFortune/WheelOfFortuneCalculation/WheelOfFortuneMissionsCalculation';
import WheelOfFortuneMissionsForm from '../components/WheelOfFortune/WheelOfFortuneForm/WheelOfFortuneMissionsForm';

import { useStores } from '../hooks/useStores';
import { RouteNames } from '../router';

const WheelOfFortuneMissions: FC = observer(() => {
	const { wheelOfFortuneMissionsStore } = useStores();

	let navigate = useNavigate();
	const params = useParams();

	async function fetchAuctionById(id: string) {
		const response = await wheelOfFortuneMissionsStore.fetchWheelOfFortuneMissionsHistoryItemById(
			id
		);
	}

	React.useEffect(() => {
		if (params.id) {
			fetchAuctionById(params.id);
			navigate(RouteNames.WHEEL_OF_FORTUNE_MISSIONS);
		}
	}, []);

	return (
		<>
			<Row style={{ marginTop: 50 }} justify='center'>
				<Col flex={'0 0 1200px'} xs={{ span: 20 }}>
					<Row justify='space-between'>
						<Col span={7}>
							<WheelOfFortuneMissionsForm />
						</Col>
						<Col span={16}>
							{wheelOfFortuneMissionsStore.isCalculationActive ? (
								<WheelOfFourtuneMissionsCalculation />
							) : (
								<Empty />
							)}
						</Col>
					</Row>
				</Col>
			</Row>
		</>
	);
});

export default WheelOfFortuneMissions;
