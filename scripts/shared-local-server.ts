import{loadEnvFile}from'node:process';
loadEnvFile('.env');
const built=new URL('../.mcp-use/build/index.js',import.meta.url).href;
const{default:server}=await import(built);
const{url}=await server.listen(0);
console.log(`AXLINT_READY ${url}`);
