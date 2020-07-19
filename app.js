var fs = require("fs");
var http = require("http");
var path = require("path");
var url = require("url");


http.createServer(function(req,res){
    var parsed = url.parse(req.url);
    var filename = path.parse(parsed.pathname);

    filen = filename.name===""?"index":filename.name;
    ext = filename.ext===""?".html":filename.ext;
    dir = filename.dir==="/"?"":filename.dir+"/";
    page = filename.name===""?"index.html":filename.name;

    f = (dir+filen+ext).replace("/", "")

    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif'
    };

    if(f){
        fs.readFile(f, function(err,data){

            if(page){
                if(mimeTypes.hasOwnProperty(ext)){
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write("<script> var hdr = 'Shop'; var shop = 'MyShop'; var navi = ['Home', 'About', 'Services', 'Contact']; var hc = '80ffdb'</script>")
                    res.end(data, 'utf-8');
                }
            }

        })
    }

}).listen("8080")