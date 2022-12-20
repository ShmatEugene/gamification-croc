import { Layout, Row, Space, Typography } from 'antd';
import React, { FC } from 'react';
import GameMechanicsCalculatorRouter from './GameMechanicsCalculatorRouter';
import Navigation from './components/Navigation/Navigation';
import Header from './components/Header/Header';
import { StoreProvider } from './stores/useStore';
import { RootStore } from './stores';

const GameMechanicsCalculator: FC = () => {
	return (
		<StoreProvider store={new RootStore()}>
			<Layout>
				<Header />
				<Navigation />
				<Layout.Content>
					<GameMechanicsCalculatorRouter />
				</Layout.Content>
			</Layout>
		</StoreProvider>
	);
};

export default GameMechanicsCalculator;
