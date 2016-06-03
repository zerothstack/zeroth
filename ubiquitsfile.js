let {UbiquitsProject} = require('@ubiquits/toolchain');

module.exports = new UbiquitsProject(__dirname)
  .configureDeployment({
    docs: {
      branch: 'master',
      repo: 'git@github.com:ubiquits/ubiquits.github.io.git'
    }
  })
  .registerDefaultTasks()
;
