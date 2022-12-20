import React, { FC } from 'react';
import GameMechanicsCalculator from './modules/GameMechanicsCalculator/GameMechanicsCalculator';

import 'antd/dist/antd.less';
import './App.scss';

const App: FC = () => {
	return <GameMechanicsCalculator />;
};

export default App;
