(function() {
    function apply(Terminal) {
        Terminal.prototype.loadWebfontAndOpen = function(element) {
            var xterm = this;

            var fontFamily = xterm.getOption('fontFamily')
            var regular = new FontFaceObserver(fontFamily).load();
            var bold = new FontFaceObserver(fontFamily, { weight: 'bold' }).load();

            return regular.constructor.all([regular, bold])
                .then(function() {
                    xterm.open(element);
                    return xterm;
                })
                .catch(function() {
                    xterm.setOption('fontFamily', 'Courier');
                    xterm.open(element);
                    return xterm;
                });
        }
    }

    window.TerminalFontLoader = {
        apply: apply
    };
})();
