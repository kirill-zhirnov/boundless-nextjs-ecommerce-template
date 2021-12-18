const webpack = require('webpack');

module.exports = {
	webpack: (config) => {
		const defineMap = {};

		[
			'BOUNDLESS_API_BASE_URL',
			'BOUNDLESS_API_PERMANENT_TOKEN',
			'BOUNDLESS_S3_PREFIX',
			'BOUNDLESS_INSTANCE_ID'
		].forEach((key) => defineMap[`process.env.${key}`] = JSON.stringify(process.env[key]));

		config.plugins.push(
			new webpack.DefinePlugin(defineMap)
		);

		return config;
	},
};
