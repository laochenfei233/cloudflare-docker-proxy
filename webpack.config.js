const path = require("path");
const webpack = require("webpack");
const fs = require("fs");

// Read wrangler.toml to extract environment variables
const wranglerToml = fs.readFileSync("./wrangler.toml", "utf-8");
const vars = {};
wranglerToml.split("\n").forEach((line) => {
  const match = line.match(/^\s*(\w+)\s*=\s*"([^"]+)"/);
  if (match) {
    vars[match[1]] = match[2];
  }
});

module.exports = {
  context: path.resolve(__dirname, "./"),
  target: "webworker",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "worker.js",
  },
  plugins: [
    new webpack.DefinePlugin({
      CUSTOM_DOMAIN: JSON.stringify(vars.CUSTOM_DOMAIN || "libcuda.so"),
      MODE: JSON.stringify(vars.MODE || "production"),
      TARGET_UPSTREAM: JSON.stringify(vars.TARGET_UPSTREAM || ""),
    }),
  ],
  optimization: {
    usedExports: true,
  },
  module: {
    rules: [
      {
        include: /node_modules/,
        test: /\.mjs$/,
        type: "javascript/auto",
      },
    ],
  },
};
