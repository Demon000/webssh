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
    fileExplorer.on('init', hashPathChange);

    directoryView.on('dblclick', function(fileView) {
        if (fileView.data.type != 'd') {
            return;
        }

        pathUpdate(fileView.data.path);
    });

    directoryView.on('select', function(selection) {
        console.log(selection);
    });
})();
