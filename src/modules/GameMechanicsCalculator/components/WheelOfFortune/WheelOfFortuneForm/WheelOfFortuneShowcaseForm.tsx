import {
	Alert,
	Button,
	Col,
	Divider,
	Form,
	Input,
	InputNumber,
	message,
	Popover,
	Row,
	Select,
	Typography,
} from 'antd';
import { PlusOutlined, DeleteOutlined, QuestionOutlined } from '@ant-design/icons';
import React, { FC } from 'react';

import './WheelOfFortuneForm.scss';
import DiscountTags from '../DiscountTags/DiscountTags';
import { useStores } from '../../../hooks/useStores';
import { observer } from 'mobx-react-lite';

const WheelOfFortuneShowcaseForm: FC = observer(() => {
	const { wheelOfFortuneStore } = useStores();
	const [form] = Form.useForm();

	const activeItem = wheelOfFortuneStore.form.fortuneItems[wheelOfFortuneStore.activeOptionIndex];

	React.useEffect(() => {
		const activeItem = wheelOfFortuneStore.form.fortuneItems[wheelOfFortuneStore.activeOptionIndex];
		form.setFieldsValue({
			lotName: activeItem.lotName,
			price: activeItem.price,
			tickets: activeItem.tickets,
			percentage: activeItem.percentage,
			lotSelect: {
				label: activeItem.lotName || 'Без названия',
				value: wheelOfFortuneStore.form.activeOptionId,
			},
		});
	}, [
		wheelOfFortuneStore.form.activeOptionId,
		wheelOfFortuneStore.form.fortuneItems[wheelOfFortuneStore.activeOptionIndex].lotName,
	]);

	React.useEffect(() => {
		let wheelNextTime = '';
		let totalBudget = '';
		if (wheelOfFortuneStore.form.wheelNextTime !== 0) {
			wheelNextTime = '' + wheelOfFortuneStore.form.wheelNextTime;
		}
		if (wheelOfFortuneStore.form.computationBudget !== 0) {
			totalBudget = '' + wheelOfFortuneStore.form.computationBudget;
		}
		form.setFieldsValue({
			wheelNextTime: wheelNextTime,
			totalBudget: totalBudget,
		});
	}, [wheelOfFortuneStore.isHistory]);

	const onFinish = values => {
		if (wheelOfFortuneStore.isLotsValid) {
			wheelOfFortuneStore.computeWheelOfFortune(values);
		} else {
			message.error('Заполнены не все лоты');
		}
	};

	const computationTypeDesc = (
		<div>
			<p>
				Щедрый расчет - возможность расчета, который более лоялен к сотрудникам (оставляет меньше
				бюджета), Экономичный расчет - возможность проведения расчета с целью экономии бюджета
				(оставляет больше бюджета получая целевое кол-во билетов)
			</p>
		</div>
	);
	const numberOfValidLots = wheelOfFortuneStore.numberOfValidLots;
	const numberOfLots = wheelOfFortuneStore.form.fortuneItems.length;

	return (
		<Form
			name='wheel-of-fortune-form'
			className='wheel-of-fortune-form'
			layout='vertical'
			form={form}
			onFinish={values => onFinish(values)}
			// onFinishFailed={onFinishFailed}
			requiredMark={false}
		>
			<Typography.Title level={4}>Общие параметры</Typography.Title>
			<Form.Item
				rules={[{ required: true, message: 'Обязательное поле' }]}
				label='Боброфортуна в следующий раз, шт.'
				name='wheelNextTime'
			>
				<InputNumber
					value={wheelOfFortuneStore.form.wheelNextTime}
					placeholder='Количество билетов для боброфортуны в следующий раз'
				/>
			</Form.Item>
			<Form.Item
				rules={[{ required: true, message: 'Обязательное поле' }]}
				label='Общий бюджет'
				name='totalBudget'
			>
				<InputNumber placeholder='Введите общий бюджет' />
			</Form.Item>
			<Form.Item className=' calculation-type' label='Тип расчёта'>
				<Row justify='space-between'>
					<Button.Group>
						<Button
							onClick={() => wheelOfFortuneStore.onComputationTypeChange(1)}
							type={wheelOfFortuneStore.form.computationType === 1 ? 'primary' : 'ghost'}
						>
							Экономный
						</Button>
						<Button
							onClick={() => wheelOfFortuneStore.onComputationTypeChange(0)}
							type={wheelOfFortuneStore.form.computationType === 0 ? 'primary' : 'ghost'}
						>
							Лояльный
						</Button>
					</Button.Group>
					<Popover overlayStyle={{ maxWidth: 300 }} content={computationTypeDesc}>
						<Button shape='circle' type='ghost'>
							<QuestionOutlined />
						</Button>
					</Popover>
				</Row>
			</Form.Item>
			<Divider />
			<Typography.Title level={4}>Лоты</Typography.Title>
			<Row>
				<Alert
					className='lot-select-alert'
					message={`Заполнено лотов: ${numberOfValidLots} из ${numberOfLots}`}
					type='warning'
				/>
			</Row>

			<Row className='lot-select' align='bottom' justify='space-between'>
				<Col span={4}>
					<Row justify='start'>
						<Button
							onClick={() => wheelOfFortuneStore.removeActiveFortuneItem()}
							type='ghost'
							shape='circle'
							icon={<DeleteOutlined />}
						/>
					</Row>
				</Col>
				<Col span={16}>
					<Form.Item label='Лот' name='lotSelect'>
						<Select
							onChange={(value, option) => wheelOfFortuneStore.onFortuneItemsOptionChange(value)}
						>
							{wheelOfFortuneStore.form.fortuneItems.map(item => {
								return (
									<Select.Option key={item.id} value={item.id}>
										{item.lotName || 'Без названия'}
									</Select.Option>
								);
							})}
						</Select>
					</Form.Item>
				</Col>
				<Col span={4}>
					<Row justify='end'>
						<Button
							onClick={() => wheelOfFortuneStore.addFortuneItem()}
							type='ghost'
							shape='circle'
							icon={<PlusOutlined />}
						/>
					</Row>
				</Col>
			</Row>
			<Form.Item
				rules={[{ required: true, message: 'Обязательное поле' }]}
				label='Название лота'
				name='lotName'
			>
				<Input
					onChange={e => wheelOfFortuneStore.onFortuneItemsChange(e)}
					placeholder='Введите название лота'
					name='lotName'
				/>
			</Form.Item>
			<Form.Item
				rules={[
					{ required: true, message: 'Обязательное поле' },
					{ pattern: /^\d+$/, message: 'В это поле нужно вводить число' },
				]}
				label='Цена лота в рублях'
				name='price'
			>
				<Input
					onChange={e => wheelOfFortuneStore.onFortuneItemsChange(e)}
					name='price'
					placeholder='Введите цену лота в рублях'
				/>
			</Form.Item>
			<Form.Item
				rules={[
					{ required: true, message: 'Обязательное поле' },
					{ pattern: /^\d+$/, message: 'В это поле нужно вводить число' },
				]}
				label='Количество билетов'
				name='tickets'
			>
				<Input
					onChange={e => wheelOfFortuneStore.onFortuneItemsChange(e)}
					name='tickets'
					placeholder='Введите количество билетов для лота'
				/>
			</Form.Item>
			<Form.Item
				rules={[
					{ required: true, message: 'Обязательное поле' },
					{ pattern: /^\d+$/, message: 'В это поле нужно вводить число' },
				]}
				label='% от общего бюджета'
				name='percentage'
			>
				<Input
					onChange={e => wheelOfFortuneStore.onFortuneItemsChange(e)}
					name='percentage'
					placeholder='Введите % от общего бюджета'
				/>
			</Form.Item>
			<Form.Item label='Скидки'>
				<DiscountTags
					tags={activeItem.discounts}
					setTags={discounts => wheelOfFortuneStore.onActiveDiscountChange(discounts)}
				/>
			</Form.Item>
			<Form.Item>
				<Button type='primary' htmlType='submit' size='large' shape='round'>
					Рассчитать
				</Button>
			</Form.Item>
		</Form>
	);
});

export default WheelOfFortuneShowcaseForm;
