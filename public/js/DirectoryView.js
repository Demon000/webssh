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
    var emitter = new EventEmitter();
    fv.on = emitter.on.bind(emitter);
    fv.emit = emitter.emit.bind(emitter);

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

        fv.emit('select', value);
    };

    fv.toggleSelect = function() {
        return fileContainer.classList.toggle('selected');
    };

    fv.getSelect = function() {
        return fileContainer.classList.contains('selected');
    };

    function eventHandler(event) {
        fv.emit(event.type, event);
    }

    fileContainer.addEventListener('click', eventHandler);
    fileContainer.addEventListener('dblclick', eventHandler);

    fv.data = file;
}

function directoryFirstComparator(a, b) {
    return (a.type != 'd') - (b.type != 'd');
}

function KeyBind(options) {
    var kb = this;

    var matchingKeys = ['type', 'ctrlKey', 'key'];

    function match(event) {
        return matchingKeys.every(function(key) {
            return options[key] == null || options[key] == event[key];
        });
    }

    kb.runIfMatches = function(event) {
        var matches = match(event);
        if (matches) {
            options.command(event);
        }
        return matches;
    };
}

function DirectoryView(container) {
    var dv = this;

    dv.fileViews = [];
    dv.directory = null;
    var emitter = new EventEmitter();
    dv.on = emitter.on.bind(emitter);
    dv.emit = emitter.emit.bind(emitter);

    dv.inSelection = false;

    dv.setHiddenVisible = function(value) {
        if (value) {
            container.classList.add('hidden-visible');
        } else {
            container.classList.remove('hidden-visible');
            dv.cancelSelection();
        }
    };

    dv.getHiddenVisible = function(value) {
        return container.classList.contains('hidden-visible');
    };

    dv.toggleHiddenVisible = function() {
        var currentValue = dv.getHiddenVisible();
        dv.setHiddenVisible(!currentValue);
    };

    dv.cancelSelection = function() {
        dv.fileViews.forEach(function(fileView) {
            fileView.setSelect(false);
        });
    };

    dv.getSelection = function() {
        return dv.fileViews.filter(function(fileView) {
            return fileView.getSelect();
        });
    };

    dv.setInSelection = function(value) {
        dv.inSelection = value;
    };

    function onCtrlKeyPress(event) {
        dv.setInSelection(event.ctrlKey);
    }

    function onFileViewClick(fileView) {
        if (!dv.inSelection) {
            dv.cancelSelection();
            fileView.setSelect(true);
        } else {
            fileView.toggleSelect();
        }
    }

    function onDirectoryViewClick() {
        if (!dv.inSelection) {
            dv.cancelSelection();
        }
    }

    dv.addFileView = function(fileView) {
        fileView.on('click', function(event) {
            onFileViewClick(fileView);
            dv.emit('click', fileView);
            event.stopPropagation();
        });

        fileView.on('dblclick', function(event) {
            dv.emit('dblclick', fileView);
            event.stopPropagation();
        });

        fileView.on('select', function() {
            var selection = dv.getSelection();
            dv.emit('select', selection);
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
    };

    dv.bindings = [
        new KeyBind({
            type: 'click',
            command: onDirectoryViewClick,
        }),
        new KeyBind({
            command: onCtrlKeyPress,
            key: 'Control'
        }),
        new KeyBind({
            type: 'keydown',
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
            var matches = keyBind.runIfMatches(event);
            if (matches) {
                event.preventDefault();
            }
        });
    };

    window.addEventListener('keydown', dv.handleEvent);
    window.addEventListener('keyup', dv.handleEvent);
    container.addEventListener('click', dv.handleEvent);
}
