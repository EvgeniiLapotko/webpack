const webpack = require("webpack");
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//     .BundleAnalyzerPlugin; АНализ приложения сколько занимает мест акаждый компонент для production
// раскоментировать здесь и в plugins()

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimizarion = () => {
    const config = {
        splitChunks: {
            chunks: "all",
        },
    };
    if (isProd) {
        config.minimize = true;
        config.minimizer = [new TerserPlugin(), new CssMinimizerPlugin()];
    }
    return config;
};

const filenames = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const plugins = () => {
    const base = [
        new webpack.ProgressPlugin(),
        new HTMLWebpackPlugin({
            template: "./index.html",
            minify: {
                collapseWhitespace: isProd,
            },
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/favicon.ico"),
                    to: path.resolve(__dirname, "dist"),
                },
            ],
        }),
        new MiniCssExtractPlugin(),
        new ESLintPlugin(),
    ];

    // if (isProd) {
    //     base.push(new BundleAnalyzerPlugin());
    // } АНализ места плагин

    return base;
};

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        main: "./index.jsx",
        analytics: "./analytics.ts",
    },
    output: {
        filename: filenames("js"),
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        //указываем расширения что бы не прописывать в пути при импортах
        extensions: [".js"],
        alias: {
            //для того что бы сократить пути при импортах в точку входа
            "@models": path.resolve(__dirname, "src/models"),
            "@": path.resolve(__dirname, "src"),
        },
    },
    optimization: {
        runtimeChunk: "single",
    },

    // настройка которая позволяет оптимизировать окончательный bundle что бы библиотеки не повторялись если есть несколько точек входа

    devServer: {
        open: true,
        port: 4200,
        hot: isDev,
        compress: true,
    },
    devtool: isDev ? "eval-source-map" : false,
    plugins: plugins(),
    module: {
        //для настройки дополнительных возможностей loader
        rules: [
            {
                test: /\.css$/, // регулярное выражение
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader",
                ],
            },
            {
                test: /\.scss$/, // регулярное выражение
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|jpg|svg|gif)$/, // регулярное выражение для разных типов файлов
                use: ["file-loader"],
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: "file-loader",
            },
            {
                test: /\.xml$/,
                use: "xml-loader",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
};
