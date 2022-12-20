import React, { FC } from 'react';
import { Button, Row, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { RouteNames } from '../../router';
import { HistoryOutlined } from '@ant-design/icons';

import './Navigation.scss';
import WheelOfFortuneNavigation from './WheelOfFortuneNavigation/WheelOfFortuneNavigation';

export interface ILink {
	text: string;
	to: Array<string>;
	toHistory: Array<string>;
}

const links: Array<ILink> = [
	{
		text: 'Аукцион',
		to: [RouteNames.AUCTION],
		toHistory: [RouteNames.AUCTION_HISTORY],
	},
	{
		text: 'Колесо фортуны',
		to: [RouteNames.WHEEL_OF_FORTUNE_SHOWCASE, RouteNames.WHEEL_OF_FORTUNE_MISSIONS],
		toHistory: [
			RouteNames.WHEEL_OF_FORTUNE_SHOWCASE_HISTORY,
			RouteNames.WHEEL_OF_FORTUNE_MISSIONS_HISTORY,
		],
	},
];

const Navigation: FC = () => {
	const location = useLocation();

	const renderLinks = (links: Array<ILink>) => {
		return links.map((link, index) => (
			<Button.Group key={index + link.to[0]}>
				<Link to={link.to[0]}>
					<Button
						className='gamification-navigation__btn'
						type={link.to.find(link => link === location.pathname) ? 'primary' : 'default'}
					>
						{link.text}
					</Button>
				</Link>
				<Link to={link.toHistory[0]}>
					<Button
						className='gamification-navigation__btn gamification-navigation__btn_history'
						// type={'default'}
						type={link.toHistory.find(link => link === location.pathname) ? 'primary' : 'default'}
					>
						<HistoryOutlined />
					</Button>
				</Link>
			</Button.Group>
		));
	};

	return (
		<nav className='gamification-navigation'>
			<Row justify='center'>
				<Space>{renderLinks(links)}</Space>
			</Row>
			{location.pathname === RouteNames.WHEEL_OF_FORTUNE_MISSIONS ||
			location.pathname === RouteNames.WHEEL_OF_FORTUNE_SHOWCASE ||
			location.pathname === RouteNames.WHEEL_OF_FORTUNE_SHOWCASE_HISTORY ||
			location.pathname === RouteNames.WHEEL_OF_FORTUNE_MISSIONS_HISTORY ? (
				<WheelOfFortuneNavigation />
			) : (
				''
			)}
		</nav>
	);
};

export default Navigation;
