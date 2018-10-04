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
        fileContainer.classList.toggle('selected');
    };

    fv.on = function(event, fn) {
        fileContainer.addEventListener('click', fn);
    };

    fv.data = file;
}

function DirectoryView(container) {
    var dv = this;
    var files;

    dv.showHidden = false;

    dv.empty = function() {
        files.forEach(function(file) {
            file.destroy();
        });
    };

    dv.set = function(directory) {
        if (files) {
            dv.empty();
        }

        files = directory.files.map(function(file) {
            var fileView = new FileView(file);
            if (!fileView.data.hidden || dv.showHidden) {
                fileView.render(container);
            }

            fileView.on('click', fileView.select);

            return fileView;
        });
    };
}
