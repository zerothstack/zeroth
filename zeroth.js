let { ZerothProject } = require('@zerothstack/toolchain');

const project = new ZerothProject(__dirname)
  .configureDeployment({
    docs: {
      branch: 'master',
      repo: 'git@github.com:zerothstack/zerothstack.github.io.git'
    }
  })
  .configureDocs({
    meta: {
      gaCode: 'UA-88015201-1'
    }
  })
  .configureSocial({
    twitter: 'zeroth',
    gitter: 'zerothstack/zeroth'
  })
;

module.exports = project;
