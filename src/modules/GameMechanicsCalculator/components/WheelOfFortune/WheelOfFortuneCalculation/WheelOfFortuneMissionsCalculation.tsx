import {
	Button,
	Col,
	Divider,
	Empty,
	Form,
	Input,
	Modal,
	Row,
	Select,
	Statistic,
	Table,
	Typography,
} from 'antd';
import Title from 'antd/lib/skeleton/Title';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../../hooks/useStores';
import { IWheelOfFortuneShowcaseCalculation } from '../../../models/WheelOfFortuneInterfaces';
import { IWheelOfFortuneMissionsCalculation } from '../../../models/WheelOfFortuneMissionsInterfaces';

import './WheelOfFortuneCalculation.scss';

const columnsMult = [
	{
		title: 'Множители',
		dataIndex: 'bonus',
		key: 'bonus',
	},
	{
		title: 'Количество билетов',
		dataIndex: 'tickets',
		key: 'tickets',
	},
];
const columnsPercent = [
	{
		title: '% от заработка',
		dataIndex: 'bonus',
		key: 'bonus',
	},
	{
		title: 'Количество билетов',
		dataIndex: 'tickets',
		key: 'tickets',
	},
];
const columnsFixed = [
	{
		title: 'Фиксированный бонус, Б',
		dataIndex: 'bonus',
		key: 'bonus',
	},
	{
		title: 'Количество билетов',
		dataIndex: 'tickets',
		key: 'tickets',
	},
];

const WheelOfFourtuneMissionsCalculation = observer(() => {
	const { wheelOfFortuneMissionsStore } = useStores();
	const [activeOption, setActiveOption] = React.useState(0);
	const [isModalVisible, setIsModalVisible] = React.useState(false);

	const [form] = Form.useForm();

	React.useEffect(() => {
		console.log('effect');

		form.setFieldsValue({
			select: {
				label: wheelOfFortuneMissionsStore.calculation?.missions[0].missionName,
				value: 0,
			},
		});
	}, [wheelOfFortuneMissionsStore.calculation?.missions]);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
		wheelOfFortuneMissionsStore.saveWheelOfFortune();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const getTableDataSource = (
		busters: Array<{ bonus: number; tickets: number }>,
		prefix: string = '',
		suffix: string = ''
	) => {
		let dataSource: Array<{ key: number; bonus: string; tickets: number }> = [];
		busters.forEach((buster, index) => {
			dataSource.push({
				key: index,
				bonus: prefix + buster.bonus + suffix,
				tickets: buster.tickets,
			});
		});

		return dataSource;
	};

	const calculation = wheelOfFortuneMissionsStore.calculation;
	console.log(calculation);

	const totalSpentInBobr = calculation?.totalSpent || 0;
	const totalSpent = wheelOfFortuneMissionsStore.convertBobrToRubs(totalSpentInBobr);
	const totalTickets = calculation?.totalTickets || 0;
	const misstionTotalSpentInBobr = calculation?.missions[activeOption].spent || 0;
	const misstionTotalSpent =
		wheelOfFortuneMissionsStore.convertBobrToRubs(misstionTotalSpentInBobr);
	const missionTotalTickets = calculation?.missions[activeOption].tickets || 0;
	const misstionMultTickets = calculation?.missions[activeOption].multBusterTickets || 0;
	const misstionPercentTickets = calculation?.missions[activeOption].percentBusterTickets || 0;
	const misstionFixedTickets = calculation?.missions[activeOption].fixedTickets || 0;

	return (
		<div className='wheel-calculation'>
			<Row>
				<Typography.Title level={4}>Общие показатели</Typography.Title>
			</Row>
			<Row>
				<Col span={6}>
					<Statistic title='Затраты на механику, ₽' value={`${totalSpent} ₽`} />
				</Col>
				<Col span={6}>
					<Statistic title='Затраты на механику, Б' value={`${totalSpentInBobr} Б`} />
				</Col>
				<Col span={6}>
					<Statistic title='Всего билетов' value={totalTickets} />
				</Col>
			</Row>
			<Divider />
			<Row>
				<Typography.Title level={4}>Миссии</Typography.Title>
			</Row>
			<Row>
				<Form form={form} className='wheel-calculation__lots-select lots-select' layout='vertical'>
					<Form.Item name='select' label='Лот'>
						<Select style={{ width: 300 }} onChange={(value, option) => setActiveOption(value)}>
							{calculation?.missions.map((mission, index) => {
								return (
									<Select.Option key={index} value={index}>
										{mission.missionName || 'Без названия'}
									</Select.Option>
								);
							})}
						</Select>
					</Form.Item>
				</Form>
			</Row>
			<Row>
				<Col span={6}>
					<Statistic title='Затраты на миссию, ₽' value={`${misstionTotalSpent} ₽`} />
				</Col>
				<Col span={6}>
					<Statistic title='Затраты на миссию, Б' value={`${misstionTotalSpentInBobr} Б`} />
				</Col>
				<Col span={6}>
					<Statistic title='Количество билетов на миссию' value={`${missionTotalTickets}`} />
				</Col>
			</Row>
			<Divider />
			<Row gutter={10}>
				<Col span={8}>
					<Row>
						<Typography.Title level={5}>Множители</Typography.Title>
					</Row>
					<Row>
						<Statistic title='Всего билетов множители' value={`${misstionMultTickets}`} />
					</Row>
					<Row>
						{calculation ? (
							<Table
								className='wheel-calculation__tickets-table tickets-table'
								columns={columnsMult}
								dataSource={getTableDataSource(calculation.missions[activeOption].multBusters, 'X')}
								pagination={false}
							/>
						) : (
							<Empty />
						)}
					</Row>
				</Col>
				<Col span={8}>
					<Row>
						<Typography.Title level={5}>% от заработка по миссии</Typography.Title>
					</Row>
					<Row>
						<Statistic title='Всего билетов % от заработка' value={`${misstionPercentTickets}`} />
					</Row>
					<Row>
						{calculation ? (
							<Table
								className='wheel-calculation__tickets-table tickets-table'
								columns={columnsPercent}
								dataSource={getTableDataSource(
									calculation.missions[activeOption].percentBusters,
									'',
									' %'
								)}
								pagination={false}
							/>
						) : (
							<Empty />
						)}
					</Row>
				</Col>
				<Col span={8}>
					<Row>
						<Typography.Title level={5}>Фиксированные бонусы</Typography.Title>
					</Row>
					<Row>
						<Statistic
							title='Всего билетов фиксированный бонус'
							value={`${misstionFixedTickets}`}
						/>
					</Row>
					<Row>
						{calculation ? (
							<Table
								className='wheel-calculation__tickets-table tickets-table'
								columns={columnsFixed}
								dataSource={getTableDataSource(
									calculation.missions[activeOption].fixedBusters,
									'',
									' Б'
								)}
								pagination={false}
							/>
						) : (
							<Empty />
						)}
					</Row>
				</Col>
			</Row>
			<Row>
				<Button
					size='large'
					onClick={showModal}
					className='wheel-calculation__save-btn'
					shape='round'
					type='primary'
				>
					Сохранить
				</Button>
			</Row>
			<Modal
				title='Введите название расчета'
				visible={isModalVisible}
				// onOk={handleOk}
				okButtonProps={{ form: 'calculationNameForm', htmlType: 'submit' }}
				onCancel={handleCancel}
				cancelText='Отмена'
				okText='Сохранить'
			>
				<Form id='calculationNameForm' layout='vertical' requiredMark={false} onFinish={handleOk}>
					<Form.Item
						rules={[{ required: true, message: 'Обязательное поле' }]}
						label='Название расчёта'
						name='calculationName'
					>
						<Input
							onChange={e => wheelOfFortuneMissionsStore.onCalculationNameChange(e.target.value)}
							placeholder='Введите название расчёта'
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
});

export default WheelOfFourtuneMissionsCalculation;
