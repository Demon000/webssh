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

function FileView(file) {
    var fv = this;
    var container;

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

    fv.render = function(newContainer) {
        container = newContainer;
        container.appendChild(fileContainer);
    };

    fv.select = function(value) {
        return fileContainer.classList.toggle('selected');
    };

    fv.on = function(event, fn) {
        fileContainer.addEventListener('click', fn);
    };

    fv.data = file;
}

function DirectoryView(container) {
    var dv = this;
    
    dv.files = [];
    dv.showHidden = false;
    dv.emitter = new EventEmitter();

    dv.empty = function() {
        dv.files.forEach(function(file) {
            file.destroy();
        });
        dv.files = [];
    };

    dv.addFile = function(fileView) {
        fileView.on('click', function() {
            var value = fileView.select();
            var event = value ? 'select' : 'deselect';
            dv.emitter.emit(event, fileView);
        });

        dv.files.push(fileView);
    }

    dv.set = function(directory) {
        if (dv.files) {
            dv.empty();
        }

        directory.files.forEach(function(file) {
            var fileView = new FileView(file);
            if (!fileView.data.hidden || dv.showHidden) {
                fileView.render(container);
            }
            dv.addFile(fileView);
        });
    };
}
