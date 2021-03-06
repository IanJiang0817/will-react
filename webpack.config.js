const webpack = require('webpack');

module.exports = {
    devtool: 'eval-source-map',
    entry:  __dirname + "/app/app.jsx",//已多次提及的唯一入口文件
    output: {
        path: __dirname, //+ "/app",//打包后的文件存放的地方
        filename: "bundle.js"//打包后输出文件的文件名
    },
    devServer: {
        contentBase: "./",//本地服务器所加载的页面所在的目录
        hot: true,
        historyApiFallback: true,//不跳转
        inline: true,//实时刷新
        watchOptions: {
          poll: true
        }
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],
};
