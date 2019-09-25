const path = require('path');

module.exports = {
  entry: './src/App/App.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  },

  module: {
    rules: [
      // Images
      {
        test: /\.(png|jpe?g|gif|html|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      // Sass
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      // Fonts
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      // Handlebars
      { 
        test: /(\.hbs|\.handlebars)$/i,
        loader: 'handlebars-loader',
        query: { 
          helperDirs: [
            path.join(__dirname, 'src/helpers')
          ],
          partialDirs: [
            path.join(__dirname, 'src/views')
          ],
        }
      },
    ],
  },

  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },

  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 9000
  },
};