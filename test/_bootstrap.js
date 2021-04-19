const static_server = require('static-server');
const puppeteer = require('puppeteer');
const fse = require('fs-extra');

// Methods to run at the start and end of the mocha testsuite run
// https://mochajs.org/#global-setup-fixtures

exports.mochaGlobalSetup = async function () {
  const workdir = 'dist_for_testing';

  // 1. Prepare build directory
  fse.mkdirpSync(workdir);
  fse.copySync('dist', workdir);

  fse.outputFile(workdir + '/theme/config.theme.js', `
Nominatim_Config.Nominatim_API_Endpoint = 'https:/nominatim.openstreetmap.org/';
  `);

  // 2. Start webserver pointing to build directory
  // https://github.com/nbluis/static-server#readme
  this.server = new static_server({ port: 9999, rootPath: workdir });
  await this.server.start();
  console.log(`server running on port ${this.server.port}`);

  // 3. Create browser instance
  global.browser = await puppeteer.launch({
    defaultViewport: { width: 1024, height: 768 },
    timeout: 5000
  });
};


exports.mochaGlobalTeardown = async function () {
  global.browser.close();

  await this.server.stop();
  console.log('server stopped');
};
