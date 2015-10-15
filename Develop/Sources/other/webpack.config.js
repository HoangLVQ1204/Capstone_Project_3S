var webpack            = require('webpack');
var _                  = require('lodash');
var BowerWebpackPlugin = require('bower-webpack-plugin');
var npm                = require('./package.json');
var bower              = require('./bower.json');
//console.log(_.union(Object.keys(npm.dependencies), Object.keys(bower.dependencies)));

module.exports = {

    entry: {
        app: './app/app.js',
        vendor: _.union(Object.keys(npm.dependencies), Object.keys(bower.dependencies))
    },

    output: {
        path: './dist',
        filename: 'bundle.js'
    },

    devtool: 'sourcemap',

    module: {
        loaders: [
            { test: /\.html$/, loader: 'raw' },
            { test: /\.styl$/, loader: 'style!css!stylus' },
            { test: /\.css/, loader: 'style!css' },
            { test: /\.(png|jpg|jpeg)$/, loader: 'file?name=[path][hash].[ext]&context=./client/public' },
            { test: /\.(woff|svg|ttf|eot)([\?]?.*)$/, loader: "file-loader?name=[path][hash].[ext]&context=./client/public" }
        ]
    },

    stylus: {
        use: [require('jeet')(), require('rupture')()]
    },

    plugins: [
        new BowerWebpackPlugin({
            modulesDirectories: ["app/public/libs"],
            excludes: [ /.*\.less/, /sass/],
            searchResolveModulesDirectories: false
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js'
        })
    ]
};
