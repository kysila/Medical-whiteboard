const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

// Main const
dotenv.config();
const PATHS = {
    src: path.join(__dirname, '../src'),
    dist: path.join(__dirname, '../dist'),
    assets: 'assets/'
};

// Pages const for HtmlWebpackPlugin
const PAGES_DIR = PATHS.src;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.html'));

module.exports = {
    // BASE config
    externals: {
        paths: PATHS
    },

    entry: {
        app: PATHS.src
        // module: `${PATHS.src}/your-module.js`,
    },

    output: {
        filename: `${PATHS.assets}js/[name].js`,
        path: PATHS.dist,
        publicPath: ''
    },

    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/'
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    emitFile: true,
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true, url: false}
                    },
                    {
                        loader: 'postcss-loader',
                        options: {sourceMap: true, config: {path: `./postcss.config.js`}}
                    },
                    {
                        loader: 'sass-loader',
                        options: {sourceMap: true}
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true}
                    },
                    {
                        loader: 'postcss-loader',
                        options: {sourceMap: true, config: {path: `./postcss.config.js`}}
                    }
                ]
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        new MiniCssExtractPlugin({
            filename: `${PATHS.assets}css/[name].css`
        }),

        new CopyWebpackPlugin([
            {from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img`},
            {from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts`},
            {from: `${PATHS.src}/static`, to: ''}
        ]),
        // new ImageminPlugin({
        //     disable: process.env.NODE_ENV !== 'production',
        //     pngquant: {quality: '70-100'},
        //     optipng: {
        //         optimizationLevel: 4 // Select an optimization level between 0 and 7
        //     }
        // }),
        // new ImageminPlugin({
        //     plugins: [
        //         imageminMozjpeg({
        //             quality: 100,
        //             progressive: true
        //         })
        //     ]
        // }),
        new ImageminPlugin({
            disable: process.env.NODE_ENV !== 'production',
            bail: false, // Ignore errors on corrupted images
            cache: true,
            imageminOptions: {
                // Lossless optimization with custom option
                plugins: [
                    ["gifsicle", { interlaced: true }],
                    ["jpegtran", { progressive: true }],
                    // ["pngquant", { quality: '95-100' }],
                    ["optipng", { optimizationLevel: 5 }],
                    ["svgo", {plugins: [{removeViewBox: false}]}]
                ]
            }
        }),

        // Automatic creation any html pages (Don't forget to RERUN dev server)
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `${page}`
        }))
    ]
};
