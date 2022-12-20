import {
	Button,
	Col,
	Divider,
	Empty,
	Form,
	Input,
	InputNumber,
	Modal,
	Row,
	Select,
	Statistic,
	Table,
	Typography,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Title from 'antd/lib/skeleton/Title';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../../hooks/useStores';
import { IWheelOfFortuneShowcaseCalculation } from '../../../models/WheelOfFortuneInterfaces';

import './WheelOfFortuneCalculation.scss';

const WheelOfFourtuneCalculation = observer(() => {
	const { wheelOfFortuneStore } = useStores();
	const [activeOption, setActiveOption] = React.useState('0');
	const [isModalVisible, setIsModalVisible] = React.useState(false);
	const [form] = Form.useForm();

	const columns = [
		{
			title: 'Скидка',
			dataIndex: 'discount',
			key: 'discount',
		},
		{
			title: 'Количество билетов',
			dataIndex: 'tickets',
			key: 'tickets',
			render: (text: number, _, index: number) => {
				return (
					<InputNumber
						onChange={value =>
							wheelOfFortuneStore.onCalculationTableEdit(value, index, activeOption)
						}
						bordered={false}
						value={text}
					/>
				);
			},
		},
	];

	React.useEffect(() => {
		form.setFieldsValue({
			select: {
				label: wheelOfFortuneStore.calculation?.fortuneItems[0].lotName,
				value: wheelOfFortuneStore.calculation?.fortuneItems[0].id,
			},
		});
	}, [wheelOfFortuneStore.calculation?.fortuneItems]);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
		wheelOfFortuneStore.saveWheelOfFortune();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const getTableDataSource = (calculation: IWheelOfFortuneShowcaseCalculation) => {
		let dataSource: Array<{ key: number; discount: string; tickets: number }> = [];
		const activeItem = calculation.fortuneItems.find(item => item.id === activeOption);
		activeItem?.discountTickets.forEach((item, index) => {
			dataSource.push({
				key: index,
				discount: item.first + ' %',
				tickets: item.second,
			});
		});
		return dataSource;
	};

	const calculation = wheelOfFortuneStore?.calculation;
	const totalSpent =
		(calculation?.spent && wheelOfFortuneStore.form.computationBudget - calculation?.spent) || 0;
	const totalSpentInBobr = (totalSpent && wheelOfFortuneStore.convertRubToBobr(totalSpent)) || 0;
	const totalTickets = calculation?.tickets || 0;
	const activeIndex = wheelOfFortuneStore.getActiveItemIndexById(activeOption);
	const lotPriceInRub = wheelOfFortuneStore.form.fortuneItems[activeIndex].price;
	// const lotPriceInBobr = wheelOfFortuneStore.convertRubToBobr(+lotPriceInRub);
	const lotTickets = calculation?.fortuneItems[activeIndex].tickets || 0;
	const lotTotalSpentInRub = calculation?.fortuneItems[activeIndex].totalSpentInRub || 0;
	const lotPercent = wheelOfFortuneStore.getLotPercentage(
		calculation?.fortuneItems[activeIndex].totalSpentInRub || 0
	);
	console.log(activeIndex);

	return (
		<div className='wheel-calculation'>
			<Row>
				<Typography.Title level={4}>Общие показатели</Typography.Title>
			</Row>
			<Row>
				<Col span={6}>
					<Statistic title='Остаток в бобриках' value={`${totalSpentInBobr} Б`} />
				</Col>
				<Col span={6}>
					<Statistic title='Остаток в рублях' value={`${totalSpent} ₽`} />
				</Col>
				<Col span={6}>
					<Statistic groupSeparator='' title='Всего билетов' value={totalTickets} />
				</Col>
			</Row>
			<Divider />
			<Row>
				<Typography.Title level={4}>Лоты</Typography.Title>
			</Row>
			<Row>
				<Form form={form} className='wheel-calculation__lots-select lots-select' layout='vertical'>
					<Form.Item name='select' label='Лот'>
						<Select style={{ width: 300 }} onChange={(value, option) => setActiveOption(value)}>
							{calculation?.fortuneItems.map(item => {
								return (
									<Select.Option key={item.id} value={item.id}>
										{item.lotName || 'Без названия'}
									</Select.Option>
								);
							})}
						</Select>
					</Form.Item>
				</Form>
			</Row>
			<Row>
				<Col span={6}>
					<Statistic title='Затраты в рублях' value={`${lotTotalSpentInRub} ₽`} />
				</Col>
				<Col span={6}>
					<Statistic groupSeparator='' title='Всего билетов' value={`${lotTickets}`} />
				</Col>
				<Col span={6}>
					<Statistic title='% от общего бюджета' value={`${lotPercent} %`} />
				</Col>
			</Row>
			<Divider />
			<Row>
				<Typography.Title level={5}>Распределение скидок</Typography.Title>
			</Row>
			<Row>
				{calculation ? (
					<Table
						className='wheel-calculation__tickets-table tickets-table'
						columns={columns}
						dataSource={getTableDataSource(calculation)}
						pagination={false}
					/>
				) : (
					<Empty />
				)}
			</Row>
			<Row>
				<Button
					size='large'
					// onClick={() => wheelOfFortuneStore.saveWheelOfFortune()}
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
							onChange={e => wheelOfFortuneStore.onCalculationNameChange(e.target.value)}
							placeholder='Введите название расчёта'
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
});

export default WheelOfFourtuneCalculation;
