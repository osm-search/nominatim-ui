import http from 'node:http';
import httpProxy from 'http-proxy';
import sirv from 'sirv';
import fse from 'fs-extra';

const testing_port = 9999;
const use_proxy = !!process.env.API_ON_SAME_PORT;
const static_port = use_proxy ? 9998 : 9999;
const reverse_only = !!process.env.REVERSE_ONLY;

export default async function globalSetup() {
  const workdir = 'dist_for_testing';

  fse.mkdirpSync(workdir);
  fse.copySync('dist', workdir);

  const api_endpoint = use_proxy
    ? '/'
    : 'https:/nominatim.openstreetmap.org/';

  fse.outputFileSync(workdir + '/theme/config.theme.js', `
Nominatim_Config.Nominatim_API_Endpoint = '${api_endpoint}';
Nominatim_Config.Reverse_Only = ${reverse_only};
  `);

  const handler = sirv(workdir);
  const server = http.createServer(handler).listen(static_port);
  await new Promise(resolve => server.on('listening', resolve));
  console.log(
    `static server serving ${workdir} directory running on port ${static_port}`
  );

  globalThis.__staticServer = server;

  if (use_proxy) {
    const proxy = httpProxy.createProxy({
      changeOrigin: true,
      followRedirects: true,
    });
    globalThis.__proxy = proxy;
    console.log('proxy started');

    const proxy_server = http.createServer((req, res) => {
      const api_url_match = !req.url.match(
        /(.html|.css|.js|.ico|.png|.svg)(\?|$)/
      );
      const target = api_url_match
        ? 'https://nominatim.openstreetmap.org'
        : 'http://localhost:' + static_port;
      return proxy.web(req, res, { target });
    }).listen(testing_port);

    globalThis.__proxyServer = proxy_server;
    console.log(`proxy server started on port ${testing_port}`);
  }
}
