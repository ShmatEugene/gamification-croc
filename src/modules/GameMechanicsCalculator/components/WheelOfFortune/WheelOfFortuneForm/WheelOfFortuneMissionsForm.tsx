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

const WheelOfFortuneMissionsForm: FC = observer(() => {
	const { wheelOfFortuneMissionsStore } = useStores();
	const [form] = Form.useForm();

	const activeItem =
		wheelOfFortuneMissionsStore.form.missions[wheelOfFortuneMissionsStore.activeOptionIndex];

	React.useEffect(() => {
		const activeItem =
			wheelOfFortuneMissionsStore.form.missions[wheelOfFortuneMissionsStore.activeOptionIndex];
		form.setFieldsValue({
			missionName: activeItem.missionName,
			budget: activeItem.budget,
			missionIncome: activeItem.missionIncome,
			totalTickets: activeItem.totalTickets,
			missionSelect: {
				label: activeItem.missionName || 'Без названия',
				value: wheelOfFortuneMissionsStore.form.activeOptionId,
			},
		});
	}, [
		wheelOfFortuneMissionsStore.form.activeOptionId,
		wheelOfFortuneMissionsStore.form.missions[wheelOfFortuneMissionsStore.activeOptionIndex]
			.missionName,
	]);

	React.useEffect(() => {
		let wheelNextTime = '';

		if (wheelOfFortuneMissionsStore.form.wheelNextTime !== 0) {
			wheelNextTime = '' + wheelOfFortuneMissionsStore.form.wheelNextTime;
		}

		form.setFieldsValue({
			wheelNextTime: wheelNextTime,
		});
	}, [wheelOfFortuneMissionsStore.isHistory]);

	const onFinish = values => {
		if (wheelOfFortuneMissionsStore.isMissionsValid) {
			wheelOfFortuneMissionsStore.computeWheelOfFortune(values);
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
	const numberOfValidLots = wheelOfFortuneMissionsStore.numberOfValidMissions;
	const numberOfLots = wheelOfFortuneMissionsStore.form.missions.length;

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
					value={wheelOfFortuneMissionsStore.form.wheelNextTime}
					placeholder='Количество билетов для боброфортуны в следующий раз'
				/>
			</Form.Item>
			<Form.Item className=' calculation-type' label='Тип расчёта'>
				<Row justify='space-between'>
					<Button.Group>
						<Button
							onClick={() => wheelOfFortuneMissionsStore.onComputationTypeChange(1)}
							type={wheelOfFortuneMissionsStore.form.computationType === 1 ? 'primary' : 'ghost'}
						>
							Экономный
						</Button>
						<Button
							onClick={() => wheelOfFortuneMissionsStore.onComputationTypeChange(0)}
							type={wheelOfFortuneMissionsStore.form.computationType === 0 ? 'primary' : 'ghost'}
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
			<Typography.Title level={4}>Миссии</Typography.Title>
			<Row>
				<Alert
					className='lot-select-alert'
					message={`Заполнено миссий: ${numberOfValidLots} из ${numberOfLots}`}
					type='warning'
				/>
			</Row>

			<Row className='lot-select' align='bottom' justify='space-between'>
				<Col span={4}>
					<Row justify='start'>
						<Button
							onClick={() => wheelOfFortuneMissionsStore.removeActiveMission()}
							type='ghost'
							shape='circle'
							icon={<DeleteOutlined />}
						/>
					</Row>
				</Col>
				<Col span={16}>
					<Form.Item label='Миссия' name='missionSelect'>
						<Select
							onChange={(value, option) =>
								wheelOfFortuneMissionsStore.onMissionsOptionChange(value)
							}
						>
							{wheelOfFortuneMissionsStore.form.missions.map(item => {
								return (
									<Select.Option key={item.id} value={item.id}>
										{item.missionName || 'Без названия'}
									</Select.Option>
								);
							})}
						</Select>
					</Form.Item>
				</Col>
				<Col span={4}>
					<Row justify='end'>
						<Button
							onClick={() => wheelOfFortuneMissionsStore.addFortuneItem()}
							type='ghost'
							shape='circle'
							icon={<PlusOutlined />}
						/>
					</Row>
				</Col>
			</Row>
			<Form.Item
				rules={[{ required: true, message: 'Обязательное поле' }]}
				label='Название миссии'
				name='missionName'
			>
				<Input
					onChange={e => wheelOfFortuneMissionsStore.onMissionsChange(e)}
					placeholder='Введите название миссии'
					name='missionName'
				/>
			</Form.Item>
			<Form.Item
				rules={[
					{ required: true, message: 'Обязательное поле' },
					{ pattern: /^\d+$/, message: 'В это поле нужно вводить число' },
				]}
				label='Количество билетов для миссии'
				name='totalTickets'
			>
				<Input
					onChange={e => wheelOfFortuneMissionsStore.onMissionsChange(e)}
					name='totalTickets'
					placeholder='Введите количество билетов'
				/>
			</Form.Item>
			<Form.Item
				rules={[
					{ required: true, message: 'Обязательное поле' },
					{ pattern: /^\d+$/, message: 'В это поле нужно вводить число' },
				]}
				label='Бюджет на миссию, Б'
				name='budget'
			>
				<Input
					onChange={e => wheelOfFortuneMissionsStore.onMissionsChange(e)}
					name='budget'
					placeholder='Введите бюджет на миссию в бобриках'
				/>
			</Form.Item>
			<Form.Item
				rules={[
					{ required: true, message: 'Обязательное поле' },
					{ pattern: /^\d+$/, message: 'В это поле нужно вводить число' },
				]}
				label='Заработок по миссии, Б'
				name='missionIncome'
			>
				<Input
					onChange={e => wheelOfFortuneMissionsStore.onMissionsChange(e)}
					name='missionIncome'
					placeholder='Введите заработок по мисии в бобриках'
				/>
			</Form.Item>
			<Form.Item label='Множители'>
				<DiscountTags
					tags={activeItem.multBusters}
					setTags={busters => wheelOfFortuneMissionsStore.onActiveMultBustersChange(busters)}
					prefix='X'
					suffix=''
					addLabel='Добавить множитель'
				/>
			</Form.Item>
			<Form.Item label='% от заработка по миссии'>
				<DiscountTags
					tags={activeItem.percentBusters}
					setTags={busters => wheelOfFortuneMissionsStore.onActivePercentBustersChange(busters)}
					addLabel='Добавить %'
				/>
			</Form.Item>
			<Form.Item label='Фиксированный бонус'>
				<DiscountTags
					tags={activeItem.fixed}
					setTags={busters => wheelOfFortuneMissionsStore.onActiveFixedChange(busters)}
					suffix=' Б'
					addLabel='Добавить бонус'
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

export default WheelOfFortuneMissionsForm;
