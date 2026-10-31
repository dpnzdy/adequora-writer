import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT||4173);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg','.mp4':'video/mp4','.adq':'application/octet-stream'};
const server=http.createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const target=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
    const relative=path.relative(root,target);
    if(relative.startsWith('..')||path.isAbsolute(relative)||relative.split(path.sep).some(p=>p.startsWith('.'))){res.writeHead(403);return res.end('Forbidden');}
    const info=await stat(target);
    if(!info.isFile()){res.writeHead(404);return res.end('Not found');}
    const headers={'Content-Type':mime[path.extname(target)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'};
    let start=0,end=info.size-1,status=200;
    const range=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range||'');
    if(range){
      if(range[1]){start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),end):end;}
      else if(range[2]) start=Math.max(0,info.size-Number(range[2]));
      if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
    }
    headers['Content-Length']=end-start+1;
    res.writeHead(status,headers);
    if(req.method==='HEAD') return res.end();
    const stream=createReadStream(target,{start,end});
    stream.on('error',()=>res.destroy());req.on('close',()=>stream.destroy());stream.pipe(res);
  }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('페이지를 찾을 수 없습니다.');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Adequora Writer preview: http://127.0.0.1:${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
