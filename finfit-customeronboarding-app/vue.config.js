const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const key = fs.readFileSync('./src/_config/certificates/server.key');
const certificate = fs.readFileSync('./src/_config/certificates/server.cert');
const globalSassFiles = [
  '~@/themes/default/_variables.scss',
  '~@/themes/default/_mixins.scss',
  '~@/themes/default/defaultColorPalette.scss',
  '~@/themes/custom/_variables.scss',
  '~@/themes/custom/customColorPalette.scss',
];
const ZipFilesPlugin = require('webpack-zip-files-plugin');

module.exports = {
  publicPath: '/dco',
  configureWebpack: {
    resolve: {
      alias: {
        '@/': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [{
        type: 'javascript/auto',
        test: /\.json$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '_config/_app/[name].[ext]',
            },
          },
        ],
      }],
    },
    plugins: [
      /* new ZipFilesPlugin({
        entries: [
          { src: path.join(__dirname, 'dist'), dist: 'DCO_App' },
        ],
        output: path.join(__dirname, 'DCO_App'),
        format: 'zip',
      }), */
      new CopyWebpackPlugin([
        { from: 'src/_config', to: '_config' },
        { from: 'server', to: 'server' },
        { from: 'mocks', to: 'mocks' },
        { from: 'start.bat', to: 'start.bat' },
        { from: 'stop.bat', to: 'stop.bat' },
        { from: 'start_nohup.sh', to: 'start_nohup.sh' },
        { from: 'stop_nohup.sh', to: 'stop_nohup.sh' },
        { from: 'start_pm2.sh', to: 'start_pm2.sh' },
        { from: 'stop_pm2.sh', to: 'stop_pm2.sh' },
      ]),
    ],
    entry: {
      main: path.resolve(__dirname, 'src/main.js'),
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        data: globalSassFiles.map(src => `@import "${src}";`).join('\n'),
      },
    },
  },
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');
    if (process.env.NODE_ENV === 'test') {
      const sassRule = config.module.rule('sass');
      const scssRule = config.module.rule('scss');
      scssRule.uses.clear();
      sassRule.uses.clear();
      scssRule.use('null-loader').loader('null-loader');
      sassRule.use('null-loader').loader('null-loader');
    }
    ['vue-modules', 'vue', 'normal-modules', 'normal'].forEach((match) => {
      config.module.rule('sass').oneOf(match).use('sass-loader')
        .tap(opt => Object.assign(opt, {
          data: globalSassFiles.map(src => `@import "${src}"`).join('\n'),
        }));
    });
  },
  pluginOptions: {
    storybook: {
      allowedPlugins: [
        'define',
      ],
    },
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: '_config/_locale',
      enableInSFC: false,
    },
  },
  devServer: {
    publicPath: '/dco',
    disableHostCheck: true,
    host: 'localhost',
    port: 8080,
    https: {
      key,
      cert: certificate,
    },
    //Uncomment while creating docker image
    /*public: '0.0.0.0:5000',
    hot: true,
    disableHostCheck: true,
    https: {
      key,
      cert: certificate,
    },*/
    setup(app) {
      app.post('/saveConfiguration', (req, res) => {
        let body = '';
        req.on('data', (data) => {
          body += data;
          console.log(body);
          fs.writeFile('./src/_config/_features/components/flowConfiguration-en.json', body, (err) => {
            if (err) {
              return res.status(404).send({
                success: 'false',
                message: 'Error in Updating',
              });
            }
            return res.status(200).send({
              success: 'true',
              message: 'Updated successfully',
            });
          });
        });
      });
      app.post('/getConfiguration', (req, res) => {
        let body = '';
        req.on('data', (data) => {
          body += data;
          fs.readFile('./src/admin/assets/flowConfiguration-en.json', 'utf-8', (err, data) => {
            if (err) {
              return res.status(404).send({
                success: 'false',
                message: 'Error in Updating',
              });
            }
            return res.status(200).send({
              success: 'true',
              message: 'Updated successfully',
              data: JSON.parse(data),
            });
          });
        });
      });
      app.post('/getFormSchema', (req, res) => {
        let body = '';
        req.on('data', (newData) => {
          body += newData;

          fs.readFile(`./src/_config/_features/forms/${body}.json`, 'utf-8', (err, data) => {
            if (err) {
              return res.status(404).send({
                success: 'false',
                message: 'Error in Updating',
              });
            }
            return res.status(200).send({
              success: 'true',
              message: 'Data Read successfully',
              data: JSON.parse(data),
            });
          });
        });
      });
      app.post('/saveFormSchema', (req, res) => {
        let body = '';
        req.on('data', (newData) => {
          body += newData;
          body = JSON.parse(body);
          fs.writeFile(`./src/_config/_features/forms/${body.path}-en.json`, JSON.stringify(body.data), (err) => {
            if (err) {
              return res.status(404).send({
                success: 'false',
                message: 'Error in Updating',
              });
            }
            return res.status(200).send({
              success: 'true',
              message: 'Updated successfully',
            });
          });
        });
      });
      app.post('/getProducts', (req, res) => {
        let body = '';
        req.on('data', (data) => {
          body += data;
          fs.readFile('./src/admin/assets/products.json', 'utf-8', (err, data) => {
            if (err) {
              return res.status(404).send({
                success: 'false',
                message: 'Error in Updating',
              });
            }
            return res.status(200).send({
              success: 'true',
              message: 'Updated successfully',
              data: JSON.parse(data),
            });
          });
        });
      });
      app.post('/getCustomConfiguration', (req, res) => {
        let body = '';
        req.on('data', (data) => {
          body += data;
          fs.readFile('./src/admin/assets/customflowConfiguration-en.json', 'utf-8', (err, data) => {
            if (err) {
              return res.status(404).send({
                success: 'false',
                message: 'Error in Updating',
              });
            }
            return res.status(200).send({
              success: 'true',
              message: 'Updated successfully',
              data: JSON.parse(data),
            });
          });
        });
      });
      app.post('/addCustomConfiguration', (req, res) => {
        let body = '';
        req.on('data', (data) => {
          body += data;
          console.log(body);
          fs.writeFile('./src/admin/assets/flowConfiguration-en.json', body, (err) => {
            if (err) {
              return res.status(404).send({
                success: 'false',
                message: 'Error in Updating',
              });
            }
            return res.status(200).send({
              success: 'true',
              message: 'Updated successfully',
            });
          });
        });
      });
      app.post('/saveDefaultConfiguration', (req, res) => {
        let body = '';
        req.on('data', (data) => {
          body += data;
          console.log(body);
          fs.writeFile('./src/_config/_app/appConfiguration-en.json', body, (err) => {
            if (err) {
              return res.status(404).send({
                success: 'false',
                message: 'Error in Updating',
              });
            }
            return res.status(200).send({
              success: 'true',
              message: 'Updated successfully',
            });
          });
        });
      });
      app.post('/getDefaultConfiguration', (req, res) => {
        let body = '';
        req.on('data', (data) => {
          body += data;
          fs.readFile('./src/_config/_app/appConfiguration-en.json', 'utf-8', (err, data) => {
            if (err) {
              return res.status(404).send({
                success: 'false',
                message: 'Error in Updating',
              });
            }
            return res.status(200).send({
              success: 'true',
              message: 'Updated successfully',
              data: JSON.parse(data),
            });
          });
        });
      });
    },
  },
};
