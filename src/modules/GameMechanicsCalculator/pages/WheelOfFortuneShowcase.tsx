import { Col, Empty, Row } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import WheelOfFortuneShowcaseForm from '../components/WheelOfFortune/WheelOfFortuneForm/WheelOfFortuneShowcaseForm';
import WheelOfFourtuneShowcaseCalculation from '../components/WheelOfFortune/WheelOfFortuneCalculation/WheelOfFourtuneShowcaseCalculation';
import { useStores } from '../hooks/useStores';
import { useNavigate, useParams } from 'react-router-dom';
import { RouteNames } from '../router';

const WheelOfFortuneShowcase: FC = observer(() => {
	const { wheelOfFortuneStore } = useStores();
	let navigate = useNavigate();
	const params = useParams();

	async function fetchAuctionById(id: string) {
		const response = await wheelOfFortuneStore.fetchWheelOfFortuneShowcaseHistoryItemById(id);
	}

	React.useEffect(() => {
		if (params.id) {
			fetchAuctionById(params.id);
			navigate(RouteNames.WHEEL_OF_FORTUNE_SHOWCASE);
		}
	}, []);

	return (
		<>
			<Row style={{ marginTop: 50 }} justify='center'>
				<Col flex={'0 0 1200px'} xs={{ span: 20 }}>
					<Row justify='space-between'>
						<Col span={7}>
							<WheelOfFortuneShowcaseForm />
						</Col>
						<Col span={16}>
							{wheelOfFortuneStore.isCalculationActive ? (
								<WheelOfFourtuneShowcaseCalculation />
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

export default WheelOfFortuneShowcase;
