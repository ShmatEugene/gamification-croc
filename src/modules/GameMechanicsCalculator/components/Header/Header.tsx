import { Button, Col, Popover, Row, Space, Typography } from 'antd';
import React, { FC } from 'react';
import { SettingOutlined } from '@ant-design/icons';

import './Header.scss';
import Settings from '../Settings/Settings';

const Header: FC = () => {
	return (
		<Row align='middle' className='game-mechanics-calculator-header'>
			<Col span={16} offset={4}>
				<Typography.Title>Калькулятор игровых механик</Typography.Title>
			</Col>

			<Col span={4}>
				<Popover content={<Settings />} placement={'bottomRight'} title='Настройки' trigger='click'>
					<Button shape='round' icon={<SettingOutlined />} type='ghost'>
						Настройки
					</Button>
				</Popover>
			</Col>
		</Row>
	);
};

export default Header;
