let {ZerothProject} = require('@zerothstack/toolchain');

const project = new ZerothProject(__dirname)
  .configureDeployment({
    docs: {
      branch: 'master',
      repo: 'git@github.com:zerothstack/zeroth.github.io.git'
    }
  })
  .configureDocs({
    meta: {
      gaCode: 'UA-79131526-1'
    }
  })
  .configureSocial({
    twitter: 'zeroth',
    gitter: 'zeroth/zeroth'
  })
;

module.exports = project;
