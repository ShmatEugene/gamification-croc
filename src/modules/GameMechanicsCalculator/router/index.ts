import React from 'react';
import Auction from '../pages/Auction';
import AuctionHistory from '../pages/AuctionHistory';
import WheelOfFortuneMissions from '../pages/WheelOfFortuneMissions';
import WheelOfFortuneMissionsHistory from '../pages/WheelOfFortuneMissionsHistory';
import WheelOfFortuneShowcase from '../pages/WheelOfFortuneShowcase';
import WheelOfFortuneShowcaseHistory from '../pages/WheelOfFortuneShowcaseHistory';

export interface IRoute {
	path: string;
	element: React.ComponentType;
}

export enum RouteNames {
	AUCTION = '/auction',
	WHEEL_OF_FORTUNE_SHOWCASE = '/wheel-of-fortune/showcase',
	WHEEL_OF_FORTUNE_MISSIONS = '/wheel-of-fortune/missions',
	WHEEL_OF_FORTUNE_SHOWCASE_HISTORY = '/wheel-of-fortune/showcase/history',
	WHEEL_OF_FORTUNE_MISSIONS_HISTORY = '/wheel-of-fortune/missions/history',
	WHEEL_OF_FORTUNE_SHOWCASE_HISTORY_ITEM = '/wheel-of-fortune/showcase/history/:id',
	WHEEL_OF_FORTUNE_MISSIONS_HISTORY_ITEM = '/wheel-of-fortune/missions/history/:id',
	AUCTION_HISTORY = '/auction/history',
	AUCTION_HISTORY_ITEM = '/auction/:id',
	WHEEL_OF_FORTUNE_HISTORY = '/wheel-of-fortune/history',
}

export const routes: IRoute[] = [
	{ path: RouteNames.AUCTION, element: Auction },
	{ path: RouteNames.WHEEL_OF_FORTUNE_SHOWCASE, element: WheelOfFortuneShowcase },
	{ path: RouteNames.WHEEL_OF_FORTUNE_MISSIONS, element: WheelOfFortuneMissions },
	{ path: RouteNames.AUCTION_HISTORY, element: AuctionHistory },
	{ path: RouteNames.AUCTION_HISTORY_ITEM, element: Auction },
	{ path: RouteNames.WHEEL_OF_FORTUNE_SHOWCASE_HISTORY, element: WheelOfFortuneShowcaseHistory },
	{ path: RouteNames.WHEEL_OF_FORTUNE_MISSIONS_HISTORY, element: WheelOfFortuneMissionsHistory },
	{ path: RouteNames.WHEEL_OF_FORTUNE_SHOWCASE_HISTORY_ITEM, element: WheelOfFortuneShowcase },
	{ path: RouteNames.WHEEL_OF_FORTUNE_MISSIONS_HISTORY_ITEM, element: WheelOfFortuneMissions },
];
