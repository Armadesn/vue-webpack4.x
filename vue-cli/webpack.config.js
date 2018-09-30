const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    VueLoaderPlugin
} = require('vue-loader')

module.exports =  {
    /**
     * @event 入口
     */
    entry: [
        path.resolve(__dirname, 'src/main.js')
    ],
    /**
     * @event 出口
     */
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出dist文件
        publicPath: '/dist'
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            // css
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            // less
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "less-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                        loader: 'url-loader',
                        options: {
                            name: '[name].[ext]',
                            limit: 50000,                   
                            outputPath: 'images'      
                        }
                    }
                ]
            },
            {
                test:  /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                        loader: 'url-loader',
                        options: {
                            name: '[name].[ext]',
                            limit: 50000,                   
                            outputPath: 'images'      
                        }
                    }
                ]
            }

        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: { // 抽离自己写的公共代码
                    chunks: "initial",
                    name: "common", // 打包后的文件名，任意命名
                    minChunks: 2, //最小引用2次
                    minSize: 0 // 只要超出0字节就生成一个新包
                },
                vendor: { // 抽离第三方插件
                    test: /node_modules/, // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor', // 打包后的文件名，任意命名
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
            }
        }
    },
    resolve: {
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名  
        extensions: ['.js', '.jsx', '.vue'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            vue: 'vue/dist/vue.js',
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        new CleanWebpackPlugin(['dist'], {
            root: __dirname, //根目录
            verbose: true, //开启在控制台输出信息
            dry: false //启用删除文件
        }),
        new VueLoaderPlugin()

    ],
    // web服务器
    devServer: {
        //用于指定目录为 dist 下的index  否则则会跳到根目录
        historyApiFallback: {
            index: '/dist/index.html'
        },
        proxy: {
            '/api': {
                target: 'http://test.weifenghr.com:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
}