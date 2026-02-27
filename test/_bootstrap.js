import static_server from 'static-server';
import http from 'node:http';
import httpProxy from 'http-proxy';
import puppeteer from 'puppeteer';
import fse from 'fs-extra';

const testing_port = 9999; // this is the port all tests expect nominatim-ui to listen to

// The installation on https://nominatim.openstreetmap.org/ui/ is a bit more complex as
// for backward compatibility they run the API and the UI on the same port. Nominatim-UI
// is installed in the /ui subdirectory plus their webserver has custom redirect rules.
//
// We can simulate that with a proxy.
const use_proxy = !!process.env.API_ON_SAME_PORT;
const static_port = use_proxy ? 9998 : 9999;
const reverse_only = !!process.env.REVERSE_ONLY;

// Methods to run at the start and end of the mocha testsuite run
// https://mochajs.org/#global-setup-fixtures
export async function mochaGlobalSetup() {
  const workdir = 'dist_for_testing';

  // 1. Prepare build directory
  fse.mkdirpSync(workdir);
  fse.copySync('dist', workdir);

  const api_endpoint = use_proxy ? '/' : 'https:/nominatim.openstreetmap.org/';

  fse.outputFile(workdir + '/theme/config.theme.js', `
Nominatim_Config.Nominatim_API_Endpoint = '${api_endpoint}';
Nominatim_Config.Reverse_Only = ${reverse_only};
  `);


  // 2. Start webserver pointing to build directory
  // https://github.com/nbluis/static-server#readme
  this.static_http_server = new static_server({ port: static_port, rootPath: workdir });
  await this.static_http_server.start();
  console.log(`static server serving ${workdir} directory running on port ${static_port}`);

  if (use_proxy) {
    // https://github.com/http-party/node-http-proxy#readme
    const proxy = await httpProxy.createProxy({ changeOrigin: true, followRedirects: true });
    this.proxy = proxy;
    console.log('proxy started');

    this.proxy_server = await http.createServer((req, res) => {
      // identify if the requests should be served by the (remote) API or static webserver
      const api_url_match = !req.url.match(/(.html|.css|.js|.ico|.png)(\?|$)/);

      const target = api_url_match
        ? 'https://nominatim.openstreetmap.org'
        : 'http://localhost:' + static_port;

      // console.log(`http proxy ${req.url} => ${target + req.url}`)
      return proxy.web(req, res, { target: target });
    }).listen(testing_port);
    console.log(`proxy server started on port ${testing_port}`);
  }


  // 3. Create browser instance
  global.browser = await puppeteer.launch({
    defaultViewport: { width: 1024, height: 768 },
    timeout: 20000,
    // latency: 1000,
    headless: 'new',
    args: [
      '--user-agent=Nominatim UI test suite Mozilla/5.0 Gecko/20100101 HeadlessChrome/90.0',
      // Nominatim's /status endpoint doesn't send a Access-Control-Allow-Origin header
      '--disable-web-security'
    ]
  });
}


export async function mochaGlobalTeardown() {
  global.browser.close();

  await this.static_http_server.stop();
  console.log('static server stopped');

  if (use_proxy) {
    await this.proxy.close();
    console.log('proxy stopped');

    this.proxy_server.close(() => console.log('proxy server stopped'));
  }
}
