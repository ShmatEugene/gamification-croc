import React, { FC } from 'react';
import { Button, Row, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { RouteNames } from '../../../router';

import '../Navigation.scss';

export interface IWheelOfFoutuneLink {
	text: string;
	to: string;
	toHistory: string;
}

const links: Array<IWheelOfFoutuneLink> = [
	{
		text: 'Витрина',
		to: RouteNames.WHEEL_OF_FORTUNE_SHOWCASE,
		toHistory: RouteNames.WHEEL_OF_FORTUNE_SHOWCASE_HISTORY,
	},
	{
		text: 'Миссии',
		to: RouteNames.WHEEL_OF_FORTUNE_MISSIONS,
		toHistory: RouteNames.WHEEL_OF_FORTUNE_MISSIONS_HISTORY,
	},
];

const WheelOfFortuneNavigation: FC = () => {
	const location = useLocation();

	const renderLinks = (links: Array<IWheelOfFoutuneLink>) => {
		return links.map((link, index) => {
			let to = '';
			if (location.pathname.includes('/history')) {
				to = link.toHistory;
			} else {
				to = link.to;
			}
			return (
				<Button.Group key={index + to}>
					<Link to={to}>
						<Button
							className='gamification-navigation__btn'
							type={location.pathname === to ? 'primary' : 'default'}
						>
							{link.text}
						</Button>
					</Link>
				</Button.Group>
			);
		});
	};

	return (
		<Row justify='center'>
			<Space className='gamification-navigation__wheel-of-fortune'>{renderLinks(links)}</Space>
		</Row>
	);
};

export default WheelOfFortuneNavigation;
