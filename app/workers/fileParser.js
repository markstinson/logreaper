
importScripts('/labs/logreaper/static/js/lib/xregexp-all-min.js');

importScripts('/labs/logreaper/static/js/lib/stringview.js');

importScripts('/labs/logreaper/static/js/lib/FileIdentifier.js');

var utf82ab = function(str) {
    var buf, bufView;
    buf = new ArrayBuffer(str.length);
    bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    };
    return buf;
};

self.addEventListener('message', function(e) {
    var blobSlice, chunkSize, content, fi, output, reader;
    switch (e.data.cmd) {
        case 'identify':
            blobSlice = e.data.file.slice || e.data.file.mozSlice || e.data.file.webkitSlice;
            chunkSize = 1024 * 10;
            reader = new FileReaderSync();
            content = new StringView(reader.readAsArrayBuffer(blobSlice.call(e.data.file, 0, chunkSize)));
            fi = new logreaper.FileIdentifier(e.data.formats, XRegExp);
            output = fi.identify(content.toString());
            self.postMessage({
                cmd: 'identificationComplete',
                result: output,
                hash: e.data.hash
            });
            self.close();
            break;
        case 'status':
            return void 0;
        case 'stop':
            self.postMessage({
                cmd: 'workerStopped'
            });
            return self.close();
    }
}, false);
