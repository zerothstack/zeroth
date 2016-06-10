let {UbiquitsProject} = require('@ubiquits/toolchain');

const project = new UbiquitsProject(__dirname)
  .configureDeployment({
    docs: {
      branch: 'master',
      repo: 'git@github.com:ubiquits/ubiquits.github.io.git'
    }
  })
  .configureDocs({
    meta: {
      gaCode: 'UA-79131526-1'
    }
  })
;

module.exports = project;
