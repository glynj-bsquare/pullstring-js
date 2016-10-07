var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;

var libraryName = 'pullstring';
var plugins = [];
var outfile;

if (env === 'build') {
    plugins.push(new UglifyJsPlugin({minimize: true}));
    outfile = libraryName + '.min.js';
} else {
    outfile = libraryName + '.js';
}

var config = {
    entry: './src/Pullstring.js',
    devtool: 'source-map',
    output: {
        path: './dist',
        filename: outfile,
        library: libraryName,
        libratyTarget: 'umd',
        umdNameDefine: true,
    },
    module: {
        loaders: [
            {
                test: /(\.js)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /(\.js)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            },
        ]
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js']
    },
    plugins: plugins
};

module.exports = config;
