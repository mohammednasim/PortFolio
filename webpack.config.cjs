/**
 * Webpack configuration — pure-JS toolchain (no native binaries).
 * Used on machines where Windows Smart App Control / WDAC blocks
 * native build tools (rollup .node bindings, esbuild.exe).
 *
 * `npm run dev`   -> webpack-dev-server (HMR, port 5173)
 * `npm run build` -> production bundle in dist/
 *
 * The original Vite toolchain remains available via
 * `npm run dev:vite` / `npm run build:vite` / `npm run preview:vite`
 * on machines without such restrictions.
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env = {}, argv = {}) => {
  const isProd =
    argv.mode === "production" || process.env.NODE_ENV === "production";

  return {
    mode: isProd ? "production" : "development",
    entry: path.resolve(__dirname, "src/main.jsx"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "assets/[name].[contenthash:8].js",
      publicPath: "/",
      clean: true,
    },
    resolve: {
      extensions: [".jsx", ".js", ".json"],
      fallback: { fs: false, path: false },
    },
    devtool: isProd ? false : "cheap-module-source-map",
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { targets: { chrome: "100", firefox: "100", edge: "100", safari: "15" } }],
                ["@babel/preset-react", { runtime: "automatic" }],
              ],
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(jpe?g|png|gif|svg|webp|ico|mp3|pdf)$/i,
          type: "asset/resource",
          generator: { filename: "assets/[name][ext]" },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "index.webpack.html"),
        inject: "body",
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: path.resolve(__dirname, "public"), to: "" }],
      }),
    ],
    devServer: {
      port: 5174,
      hot: true,
      open: false,
      historyApiFallback: true,
      compress: true,
      static: {
        directory: path.resolve(__dirname, "public"),
        publicPath: "/",
        watch: true,
      },
      proxy: [
        {
          context: ["/api"],
          target: "http://localhost:8787",
          changeOrigin: true,
        },
      ],
      client: { overlay: { errors: true, warnings: false } },
    },
    performance: { hints: false },
    optimization: {
      splitChunks: { chunks: "all", maxAsyncRequests: 30, maxInitialRequests: 30 },
    },
  };
};
