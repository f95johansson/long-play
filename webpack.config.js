const path = require('path');
const webpack = require('webpack');

const prod = process.argv.indexOf('-p') !== -1 || 
             process.argv.indexOf('-prod') !== -1 ||
             process.argv.indexOf('--prod') !== -1 ||
             process.argv.indexOf('--production') !== -1;

module.exports = {
  entry: './src/App/App.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  },

  module: {
    rules: [
      // Inline svg
      {
        test: /.*\/svgs\/.*\.svg$/,
        loader: 'svg-inline-loader'
      },
      // Url svg
      {
        test: /.*\/images\/.*\.svg$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      // Files (Images, html)
      {
        test: /\.(png|jpe?g|gif|html)$/i,
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
      path.resolve('./'),
      path.resolve('./src'),
      path.resolve('./node_modules')
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          ENV: prod? JSON.stringify('prod'): JSON.stringify('dev'),
          DEV: prod? JSON.stringify(false): JSON.stringify(true)
        }
      }
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 9000,
    host: '0.0.0.0'
  },
};