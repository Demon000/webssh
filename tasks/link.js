const depLinker = require('dep-linker');

console.log('Linking dependencies.')

depLinker.linkDependenciesTo('./public/external')
	.then(() => console.log('Finished.'));
