import React, { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStores } from './hooks/useStores';
import { RouteNames, routes } from './router';

const GameMechanicsCalculatorRouter: FC = () => {
	const { settingsStore } = useStores();
	React.useEffect(() => {
		settingsStore.fetchSettings();
	}, []);

	return (
		<Routes>
			{routes.map((route, index) => (
				<Route key={index + route.path} path={route.path} element={<route.element />} />
			))}
			<Route path='*' element={<Navigate to={RouteNames.AUCTION} replace />} />
		</Routes>
	);
};

export default GameMechanicsCalculatorRouter;
