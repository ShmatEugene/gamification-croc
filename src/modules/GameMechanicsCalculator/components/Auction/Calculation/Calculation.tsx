import { Button, Col, Form, InputNumber, Row, Slider, Statistic, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { useStores } from '../../../hooks/useStores';
import AllDepartmentsChart from './AllDepartmentsChart/AllDepartmentsChart';

import './Calculation.scss';

const Calculation: FC = observer(() => {
	const { auctionStore } = useStores();
	const [sliderValues, setSliderValues] = React.useState([10, 100]);

	const minPossibleBid = auctionStore.mergedEmployees[0]?.availableBalance;
	const maxPossibleBid =
		auctionStore.mergedEmployees[auctionStore.mergedEmployees.length - 1]?.availableBalance;

	const onSliderChange = (value: [number, number]) => {
		auctionStore.setBidRange(value[0], value[1]);
	};

	const onChangeMinBid = (minBid: number) => {
		if (minBid < auctionStore.bidRange.to) {
			auctionStore.setBidRange(minBid, auctionStore.bidRange.to);
		}
	};

	const onChangeMaxBid = (maxBid: number) => {
		if (maxBid > auctionStore.bidRange.from) {
			auctionStore.setBidRange(auctionStore.bidRange.from, maxBid);
		}
	};

	return (
		<Row style={{ marginTop: 50 }} justify='space-between'>
			<Col span={24}>
				<Typography.Title level={2}>Расчёт</Typography.Title>
			</Col>
			<Col span={7}>
				<Form className='calculation-form' layout='vertical'>
					<Form.Item label='Диапазон ставок'>
						{auctionStore.mergedEmployees ? (
							<Slider
								range={true}
								step={1}
								min={minPossibleBid}
								max={maxPossibleBid}
								defaultValue={[10000, 30000]}
								onChange={value => auctionStore.setSliderRange(value[0], value[1])}
								onAfterChange={onSliderChange}
								value={[auctionStore.sliderRange.from, auctionStore.sliderRange.to]}
							/>
						) : (
							''
						)}
					</Form.Item>
					<Row gutter={20}>
						<Col span={12}>
							<Form.Item label='Минимальная ставка, Б'>
								<InputNumber
									min={minPossibleBid}
									max={maxPossibleBid}
									value={auctionStore.bidRange.from}
									onChange={onChangeMinBid}
									step={10}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label='Максимальная ставка, Б'>
								<InputNumber
									min={minPossibleBid}
									max={maxPossibleBid}
									value={auctionStore.bidRange.to}
									onChange={onChangeMaxBid}
									step={10}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<Row gutter={[0, 16]}>
					<Col span={12}>
						<Statistic title='Цена закупки' value={auctionStore.lotPriceInRub + ' ₽'} />
					</Col>
					<Col span={12}>
						<Statistic title='Цена в бобриках' value={auctionStore.lotPriceInBobr + ' Б'} />
					</Col>
					<Col span={12}>
						<Statistic title='Участвуют' value={auctionStore.numberOfParticipants + ' чел.'} />
					</Col>
					<Col span={12}>
						<Statistic title='Участвуют' value={auctionStore.percentOfParticipants + ' %'} />
					</Col>
					<Col span={12}>
						<Statistic title='Департаментов' value={auctionStore.numberOfActiveDepartments} />
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Button
							style={{ marginTop: 30 }}
							type='primary'
							htmlType='submit'
							size='large'
							shape='round'
							onClick={() => auctionStore.postCurrentAuction()}
						>
							Сохранить расчет
						</Button>
					</Col>
				</Row>
			</Col>
			<Col span={16}>
				<AllDepartmentsChart />
			</Col>
		</Row>
	);
});

export default Calculation;
