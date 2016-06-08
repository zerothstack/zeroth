let {UbiquitsProject} = require('@ubiquits/toolchain');

const project = new UbiquitsProject(__dirname)
  .configureDeployment({
    docs: {
      branch: 'master',
      repo: 'git@github.com:ubiquits/ubiquits.github.io.git'
    }
  });

module.exports = project;
