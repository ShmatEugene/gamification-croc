import { Button, Divider, Form, InputNumber, message, Typography } from 'antd';
import React, { FC } from 'react';
import { useStores } from '../../hooks/useStores';

import './Settings.scss';

const Settings: FC = () => {
	const { settingsStore } = useStores();

	const onFinish = (values: any) => {
		const exchangeRate = values.exchangeRate,
			earned = values.earned,
			numberOfPurchases = values.numberOfPurchases,
			missionsCompleted = values.missionsCompleted,
			spent = values.spent;

		settingsStore.setSettings(exchangeRate, earned, numberOfPurchases, missionsCompleted, spent);
	};
	return (
		<Form
			name='settings-form'
			className='game-mechanics-calculator-settings-form'
			layout='vertical'
			onFinish={onFinish}
			requiredMark={false}
			// onFinishFailed={onFinishFailed}
		>
			<Form.Item
				rules={[{ required: true, message: 'Обязательное поле' }]}
				label='Курс перевода Бобрик/Рубль'
				name='exchangeRate'
				initialValue={settingsStore.exchangeRate}
			>
				<InputNumber controls={false} />
			</Form.Item>

			<Divider />

			<Typography.Title level={4}>Показатели активности за полгода</Typography.Title>

			<Form.Item
				rules={[{ required: true, message: 'Обязательное поле' }]}
				label='Заработано бобриков'
				name='earned'
				initialValue={settingsStore.earned}
			>
				<InputNumber />
			</Form.Item>
			<Form.Item
				rules={[{ required: true, message: 'Обязательное поле' }]}
				label='Выполнено миссий'
				name='missionsCompleted'
				initialValue={settingsStore.missionsCompleted}
			>
				<InputNumber />
			</Form.Item>
			<Form.Item
				rules={[{ required: true, message: 'Обязательное поле' }]}
				label='Потрачено бобриков'
				name='spent'
				initialValue={settingsStore.spent}
			>
				<InputNumber />
			</Form.Item>
			<Form.Item
				rules={[{ required: true, message: 'Обязательное поле' }]}
				label='Количество покупок'
				name='numberOfPurchases'
				initialValue={settingsStore.numberOfPurchases}
			>
				<InputNumber />
			</Form.Item>

			<Form.Item>
				<Button type='primary' htmlType='submit' size='middle' shape='round'>
					Сохранить
				</Button>
			</Form.Item>
		</Form>
	);
};

export default Settings;
