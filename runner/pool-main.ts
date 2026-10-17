import {allocate} from './pool-state.js';
const request=JSON.parse(Buffer.from(process.argv[2]!,'base64url').toString());
console.log(JSON.stringify(await allocate('/runs',request.run_id,request.limit)));
