(function() {
    var fileExplorer = new FileExplorer();
    fileExplorer.list('/home/aicpdevs', function(dir) {
        console.log(dir);
    });
})();
