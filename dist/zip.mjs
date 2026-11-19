// ZIP "store" format: no dependency, UTF-8 filenames, CRC32, one browser download.
const encoder=new TextEncoder();
const table=Uint32Array.from({length:256},(_,i)=>{for(let j=0;j<8;j++)i=(i&1)?0xedb88320^(i>>>1):i>>>1;return i>>>0;});
export function crc32(bytes){let crc=0xffffffff;for(const byte of bytes)crc=table[(crc^byte)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
function block(size){const bytes=new Uint8Array(size);return {bytes,view:new DataView(bytes.buffer)};}
export function zipFiles(files){
 const chunks=[],directory=[];let offset=0,centralLength=0;
 const entries=Object.entries(files);if(entries.length>65535)throw new Error('Too many export files.');
 for(const [filename,content] of entries){
  if(!filename||filename.startsWith('/')||filename.includes('\\')||filename.split('/').includes('..'))throw new Error('Invalid export filename.');
  const name=encoder.encode(filename),data=typeof content==='string'?encoder.encode(content):content;
  if(name.length>65535||data.length>0xffffffff)throw new Error('Export file is too large.');
  const crc=crc32(data),local=block(30),central=block(46);
  local.view.setUint32(0,0x04034b50,true);local.view.setUint16(4,20,true);local.view.setUint16(6,0x800,true);local.view.setUint16(12,33,true);local.view.setUint32(14,crc,true);local.view.setUint32(18,data.length,true);local.view.setUint32(22,data.length,true);local.view.setUint16(26,name.length,true);
  central.view.setUint32(0,0x02014b50,true);central.view.setUint16(4,20,true);central.view.setUint16(6,20,true);central.view.setUint16(8,0x800,true);central.view.setUint16(14,33,true);central.view.setUint32(16,crc,true);central.view.setUint32(20,data.length,true);central.view.setUint32(24,data.length,true);central.view.setUint16(28,name.length,true);central.view.setUint32(42,offset,true);
  chunks.push(local.bytes,name,data);directory.push(central.bytes,name);offset+=30+name.length+data.length;centralLength+=46+name.length;
 }
 if(offset+centralLength>0xffffffff)throw new Error('Export exceeds ZIP32 size limits.');
 const end=block(22);end.view.setUint32(0,0x06054b50,true);end.view.setUint16(8,entries.length,true);end.view.setUint16(10,entries.length,true);end.view.setUint32(12,centralLength,true);end.view.setUint32(16,offset,true);
 const output=new Uint8Array(offset+centralLength+22);let at=0;for(const part of [...chunks,...directory,end.bytes]){output.set(part,at);at+=part.length;}return output;
}
