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

function KeyBind(options) {
    var kb = this;

    kb.matches = function(event) {
        if (options.ctrlKey != event.ctrlKey) {
            return false;
        }

        if (options.key != event.key) {
            return false;
        }

        return true;
    };

    kb.run = options.command;
}

function DirectoryView(container) {
    var dv = this;

    dv.fileViews = [];
    dv.directory = null;
    dv.emitter = new EventEmitter();

    dv.setHiddenVisible = function(value) {
        if (value) {
            container.classList.add('hidden-visible');
        } else {
            container.classList.remove('hidden-visible');
        }
    };

    dv.toggleHiddenVisible = function() {
        return container.classList.toggle('hidden-visible');
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
        dv.fileViews.splice(index, 1);

        fileView.destroy();
    };

    dv.addFromFile = function(file) {
        var fileView = new FileView(file, container);
        dv.addFileView(fileView);
    };

    dv.removeFileViews = function() {
        dv.fileViews.forEach(function(fileView) {
            fileView.destroy();
        });
        dv.fileViews = [];
    };

    dv.setDirectory = function(directory) {
        directory.files.sort(directoryFirstComparator);

        dv.removeFileViews();
        directory.files.forEach(dv.addFromFile);

        dv.directory = directory;

        dv.emitter.emit('set');
    };

    dv.bindings = [
        new KeyBind({
            ctrlKey: true,
            key: 'h',
            command: dv.toggleHiddenVisible,
        }),
    ];

    dv.addKeyBind = function(options) {
        dv.bindings.push(new KeyBind(options));
    };

    dv.handleEvent = function(event) {
        dv.bindings.forEach(function(keyBind) {
            var matches = keyBind.matches(event);
            if (matches) {
                keyBind.run();
                event.preventDefault();
            }
        });
    };

    window.addEventListener('keydown', dv.handleEvent);
}
