export const zip = async (str: string): Promise<string> => {
    const byteArray = new TextEncoder().encode(str);
    const cs = new CompressionStream('gzip');
    const writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    const resp = new Response(cs.readable).arrayBuffer();
    return resp.then(data => Array.from(new Uint8Array(data)).map(v => String.fromCharCode(v)).join(''));
};
  
export const unzip = async (data: string): Promise<string> => {
    const coded = data.split('').map(v => v.charCodeAt(0));
    const buffer = new Uint8Array(coded);
    const cs = new DecompressionStream('gzip');
    const writer = cs.writable.getWriter();
    writer.write(buffer);
    writer.close();
    const arrayBuffer = await new Response(cs.readable).arrayBuffer();
    return new TextDecoder().decode(arrayBuffer);
};