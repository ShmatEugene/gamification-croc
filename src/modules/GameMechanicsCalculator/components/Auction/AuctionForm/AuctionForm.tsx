import { Button, Col, Form, Input, InputNumber, Row, Upload } from 'antd';
import React, { FC } from 'react';
import { observer } from 'mobx-react';

import './AuctionForm.scss';
import { UploadOutlined } from '@ant-design/icons';
import { useStores } from '../../../hooks/useStores';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

const AuctionForm: FC = observer(() => {
	const { auctionStore } = useStores();
	const [isPurchasesUploadHidden, setIsPurchasesUploadHidden] = React.useState(true);
	const [isMissionsUploadHidden, setIsMissionsUploadHidden] = React.useState(true);

	const onFinish = (values: any) => {
		console.log('Success:', values);

		const lotName = values.lotName,
			lotPriceInRub = values.lotPriceInRub,
			minNumberOfParticipants = values.minNumberOfParticipants;
		auctionStore.setFormData(lotName, lotPriceInRub, minNumberOfParticipants);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	const onBalancesFileUploadSuccess = (info: UploadChangeParam<UploadFile<any>>) => {
		if (info.file.status === 'done') {
			setIsPurchasesUploadHidden(false);
		} else {
			setIsMissionsUploadHidden(true);
			setIsPurchasesUploadHidden(true);
		}
	};

	const onPurchasesFileUploadSuccess = (info: UploadChangeParam<UploadFile<any>>) => {
		if (info.file.status === 'done') {
			setIsMissionsUploadHidden(false);
		} else {
			setIsMissionsUploadHidden(true);
		}
	};

	return (
		<Form
			name='auction-form'
			className='auction-form'
			layout='vertical'
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
		>
			<Form.Item
				rules={[{ required: true, message: 'Введите название лота' }]}
				label='Название лота'
				name='lotName'
			>
				<Input placeholder='Введите название лота' />
			</Form.Item>
			<Form.Item
				rules={[{ required: true, message: 'Введите цену' }]}
				label='Цена лота в рублях'
				name='lotPriceInRub'
			>
				<InputNumber placeholder='Введите цену лота в рублях' />
			</Form.Item>
			<Form.Item
				rules={[{ required: true, message: 'Введите минимальное количество участников' }]}
				name='minNumberOfParticipants'
				label='Минимальное количество участников'
			>
				<InputNumber placeholder='Введите минимальное количество участников' />
			</Form.Item>
			<Form.Item name='table' label='Баланс сотрудников'>
				<Form.Item
					rules={[{ required: true, message: 'Загрузите таблицу' }]}
					name='dragger'
					noStyle
				>
					<Upload.Dragger
						name='table'
						customRequest={async options => {
							auctionStore.uploadBalanceTable(options);
						}}
						accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
						maxCount={1}
						onChange={onBalancesFileUploadSuccess}
					>
						<p className='ant-upload-drag-icon'>
							<UploadOutlined />
						</p>
						<p className='ant-upload-text'>Перетащите</p>
						<p className='ant-upload-hint'>файлы или выберите с компьютера</p>
					</Upload.Dragger>
				</Form.Item>
			</Form.Item>

			<Form.Item hidden={isPurchasesUploadHidden} name='upload' label='Активность по покупкам'>
				<Upload
					customRequest={async options => {
						auctionStore.uploadPurchasesTable(options);
					}}
					accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
					maxCount={1}
					name='purchases-table'
					onChange={onPurchasesFileUploadSuccess}
				>
					<Button icon={<UploadOutlined />}>Загрузить</Button>
				</Upload>
			</Form.Item>

			<Form.Item hidden={isMissionsUploadHidden} name='upload' label='Активность по миссиям'>
				<Upload
					customRequest={async options => {
						auctionStore.uploadMissionsTable(options);
					}}
					accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
					maxCount={1}
					name='missions-table'
				>
					<Button icon={<UploadOutlined />}>Загрузить</Button>
				</Upload>
			</Form.Item>

			<Form.Item>
				<Button type='primary' htmlType='submit' size='large' shape='round'>
					Рассчитать
				</Button>
			</Form.Item>
		</Form>
	);
});
export default AuctionForm;
