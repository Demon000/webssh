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
    if (file.hidden) {
        fileContainer.classList.add('hidden');
    }

    var icon = document.createElement('img');
    setFileIcon(icon, file);
    fileContainer.appendChild(icon);

    var name = document.createElement('span');
    name.classList.add('file-view-name');
    name.innerHTML = file.name;
    fileContainer.appendChild(name);

    fv.destroy = function() {
        container.removeChild(fileContainer);
    };

    fv.render = function() {
        container.appendChild(fileContainer);
    };

    fv.setSelect = function(value) {
        if (value) {
            fileContainer.classList.add('selected');
        } else {
            fileContainer.classList.remove('selected');
        }
    };

    fv.getSelect = function() {
        return fileContainer.classList.contains('selected');
    };

    fv.on = function(event, fn) {
        fileContainer.addEventListener(event, fn);
    };

    fv.data = file;
}

function directoryFirstComparator(a, b) {
    return (a.type != 'd') - (b.type != 'd');
}

function DirectoryView(container) {
    var dv = this;

    dv.fileViews = [];
    dv.directory = null;
    dv.showHidden = false;
    dv.emitter = new EventEmitter();

    dv.setHiddenVisible = function(value) {
        if (value) {
            container.classList.add('hidden-visible');
        } else {
            container.classList.remove('hidden-visible');
        }
    };

    dv.getHiddenVisible = function(value) {
        return container.classList.contains('hidden-visible');
    };

    dv.addFileView = function(fileView) {
        fileView.on('click', function() {
            dv.emitter.emit('click', fileView);
        });

        fileView.on('dblclick', function() {
            dv.emitter.emit('dblclick', fileView);
        });

        dv.fileViews.push(fileView);

        fileView.render();
    };

    dv.removeFileView = function(fileView) {
        var index = dv.fileViews.indexOf(fileView);
        if (index > -1) {
            dv.fileViews.splice(index, 1);
        }

        fileView.destroy();
    };

    dv.addFromFile = function(file) {
        var fileView = new FileView(file, container);
        dv.addFileView(fileView);
    };

    dv.removeFileViews = function() {
        dv.fileViews.forEach(dv.removeFileView);
    };

    dv.setDirectory = function(directory) {
        directory.files.sort(directoryFirstComparator);

        dv.removeFileViews();
        directory.files.forEach(dv.addFromFile);

        dv.directory = directory;

        dv.emitter.emit('set');
    };
}
