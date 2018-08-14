const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// PARTS

const page = {
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ]
}

const devServer = {
  devServer: {
    stats: "errors-only",
    open: true,
    overlay: true,
    watchOptions: {
      aggregateTimeout: 300 // delay rebuild because otherwise somehow only the changed test is shown on browser refresh
    }
  }
}

const entry = {
  entry: "./src/main.js"
}

const output = {
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  }
}

const rules = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      }
    ]
  }
}

const modeDev = { mode: "development" };
const modeProd = { mode: "production" };

// COMPOSITION

const testConfig = merge();

const common = merge([
  entry,
  rules,
  page
]);

const devConfig = merge([
  common,
  devServer,
  modeDev
]);

const distConfig = merge([
  common,
  output,
  modeProd
]);

// EXPORT

module.exports = env => {
  switch(env){
    case "test": return testConfig;
    case "development": return devConfig;
    case "production": return distConfig;
  }
};