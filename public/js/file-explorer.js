(function() {
    var fileExplorer = new FileExplorer();
    fileExplorer.init();

    var directoryViewContainer = document.querySelector('#directory-view');
    var directoryView = new DirectoryView(directoryViewContainer);

    fileExplorer.emitter.on('init', function() {
        fileExplorer.list('/home/aicpdevs', function(dir) {
            directoryView.set(dir);
        });
    });
})();
