const path = require('path');
// DefinePlugin

module.exports = {
    entry: {
        'front':  ['./src/front/index.jsx'],
    },
    output: {
        path: path.resolve(__dirname, 'web', 'build')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.svg$/,
                use: [
                  "babel-loader",
                  {
                    loader: "react-svg-loader",
                    options: {
                      jsx: true // true outputs JSX tags
                    }
                  }
                ]
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [],
    devtool: "source-map" 
}
