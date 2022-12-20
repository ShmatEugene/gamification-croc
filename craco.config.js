const CracoLessPlugin = require('craco-less');

module.exports = {
	plugins: [
		{
			plugin: CracoLessPlugin,
			options: {
				lessLoaderOptions: {
					lessOptions: {
						modifyVars: {
							'@primary-color': '#00a460',
							'@layout-body-background': '#fff',
							'@primary-color-hover': '#00a460',
							'@font-family': 'Circe, Croc, sans-serif',
							'@form-item-label-font-size': '15px',
							'@text-color': '#2D2F34',
							'@heading-color': '#2D2F34',



							// Buttons
							'@btn-default-color': '@primary-color',
							'@btn-default-bg': '#fff',
							'@btn-default-border': '@primary-color',
						},
						javascriptEnabled: true,
					},
				},
			},
		},
	],
};
