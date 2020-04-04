const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';

const optimize = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if(!isDev) {
        config.minimizer = [
            new OptimizeCssPlugin(),
            new TerserPlugin()
        ];
    }
    return config;
}

const fileName = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: './js/index.js',
    output: {
        filename: fileName('js'), 
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HTMLPlugin({
            template: 'index.html',
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: fileName('css')
        })
    ],
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true
                        }
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass')
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|ttf|otf|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img/',
                            publicPath: 'img/'
                        }
                    }
                ]
            },
        ]
    },
    optimization: optimize(),
    devServer: {
        port: '4000',
        hot: isDev
    }
}
