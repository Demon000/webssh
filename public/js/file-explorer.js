(function() {
    var fileExplorer = new FileExplorer().init();

    var directoryViewContainer = document.querySelector('#directory-view');
    var directoryView = new DirectoryView(directoryViewContainer);

    var pathInput = document.querySelector('#path-input');

    function getTitle(path) {
        return path + ' - File Explorer - WebSSH';
    }

    function pathUpdate(path, from) {
        fileExplorer.list(path, directoryView.setDirectory);

        if (from != 'hash') {
            window.location.hash = path;
        }

        if (from != 'input') {
            pathInput.value = path;
        }
        
        document.title  = getTitle(path);
    }

    function inputPathChange(event) {
        if (event.key != 'Enter') {
            return;
        }

        var path = pathInput.value;
        pathUpdate(path, 'input');
    }

    function hashPathChange() {
        var path = window.location.hash.slice(1);
        pathUpdate(path, 'hash');
    }

    pathInput.addEventListener('keyup', inputPathChange);
    window.addEventListener('hashchange', hashPathChange);
    fileExplorer.emitter.on('init', hashPathChange);

    directoryView.emitter.on('click', function(fileView) {
        console.log('click: ' + directoryView.directory.path + '/' + fileView.data.name);
    });

    directoryView.emitter.on('dblclick', function(fileView) {
        console.log('dblclick: ' + directoryView.directory.path + '/' + fileView.data.name);
    });
})();
