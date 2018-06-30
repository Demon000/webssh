const depLinker = require('dep-linker');

console.log('Linking dependencies.')

depLinker.linkDependenciesTo('./public/js/external')
  .then(() => console.log('Finished.'));
