function setFileIcon(icon, file) {
    icon.classList.add('file-view-icon');

    switch (file.type) {
    case 'd':
        icon.src = '/assets/directory.svg';
        icon.classList.add('directory');
        break;
    default:
        icon.src = '/assets/file.svg';
        icon.classList.add('file');
        break;
    }
}

function FileView(file, container) {
    var fv = this;

    var fileContainer = document.createElement('div');
    fileContainer.classList.add('file-view');

    var icon = document.createElement('img');
    setFileIcon(icon, file);
    fileContainer.appendChild(icon);

    var name = document.createElement('span');
    name.classList.add('file-view-name');
    name.innerHTML = file.name;
    fileContainer.appendChild(name);

    var selection = document.createElement('div');
    selection.classList.add('file-view-selection');
    fileContainer.appendChild(selection);

    fv.destroy = function() {
        container.removeChild(fileContainer);
    };

    fv.render = function() {
        container.appendChild(fileContainer);
    };

    fv.select = function(value) {
        return fileContainer.classList.toggle('selected');
    };

    fv.on = function(event, fn) {
        fileContainer.addEventListener(event, fn);
    };

    fv.data = file;
}

function DirectoryView(container) {
    var dv = this;

    dv.fileViews = [];
    dv.directory = null;
    dv.showHidden = false;
    dv.emitter = new EventEmitter();

    dv.eachView = function(fn) {
        dv.fileViews.forEach(fn);
    };

    dv.empty = function() {
        dv.eachView(function(fileView) {
            fileView.destroy();
        });
    };

    dv.render = function() {
        dv.eachView(function(fileView) {
            if (!fileView.data.hidden || dv.showHidden) {
                fileView.render(container);
            }
        });
    };

    dv.addFile = function(fileView) {
        fileView.on('click', function() {
            dv.emitter.emit('click', fileView);
        });

        fileView.on('dbclick', function() {
            dv.emitter.emit('dbclick', fileView);
        });

        dv.fileViews.push(fileView);
    };

    dv.set = function(directory) {
        dv.directory = directory;
        dv.empty();

        dv.directory.files.forEach(function(file) {
            var fileView = new FileView(file, container);
            dv.addFile(fileView);
        });

        dv.render();
        dv.emitter.emit('set');
    };
}
