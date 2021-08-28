const path = require("path");

module.exports={
	outputDir:path.resolve(__dirname,"./build"),
	devServer: {
		proxy: 'http://localhost:4000'
	}
};
