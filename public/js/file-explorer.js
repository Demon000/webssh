(function() {
    var fileExplorer = new FileExplorer();
    fileExplorer.init();

    fileExplorer.emitter.on('init', function() {
        fileExplorer.list('/home/aicpdevs', function(dir) {
            console.log(dir);
        });
    });
})();
