const filesize = require('filesize');

function Stats(rawStats) {
    return {
        accessTime: rawStats.atime * 1000,
        modifyTime: rawStats.mtime * 1000,
        owner: rawStats.uid,
        group: rawStats.gid,
        size: rawStats.size,
        humanSize: filesize(rawStats.size),
    };
}

function File(from) {
    const file = {
        name: from.filename,
        permissions: from.longname.split(' ')[0],
        
    };

    Object.assign(file, Stats(from.attrs));

    return file;
}

function Directory(from) {
    const dir = {
        path: from.path,
        files: from.files.map(File),
    };
 
    Object.assign(dir, Stats(from.stats));

    return dir;
}

module.exports = function(stream) {
    return {
        readdir: function(path, dirFn) {
            stream.stat(path, function(err, rawStats) {
                if (err) {
                    return dirFn();
                }

                stream.readdir(path, function(err, rawFiles) {
                    if (err) {
                        return dirFn();
                    }

                    dirFn(Directory({
                        path: path,
                        stats: rawStats,
                        files: rawFiles
                    }));
                });
            });
        },
    };
};
