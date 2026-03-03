export default async function globalTeardown() {
  if (globalThis.__staticServer) {
    await globalThis.__staticServer.stop();
    console.log('static server stopped');
  }

  if (globalThis.__proxy) {
    globalThis.__proxy.close();
    console.log('proxy stopped');
  }

  if (globalThis.__proxyServer) {
    globalThis.__proxyServer.close(() => console.log('proxy server stopped'));
  }
}
