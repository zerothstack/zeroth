declare module '~vantage/lib/vantage' {
  function Vantage(): Vantage.VantageStatic;

  module Vantage {
    interface VantageStatic {
      new (): Vantage;
    }

    interface Action {
      (args:any, callback:Function):void|Promise<any>;
    }

    interface Vantage {
      command(name: string): this;
      description(desc: string): this;
      action(cb: Action): this;
    }

  }

  export = Vantage;
}
declare module 'vantage/lib/vantage' {
  import alias = require('~vantage/lib/vantage');
  export = alias;
}

declare module '~vantage/index' {
  import Vantage = require('~vantage/lib/vantage');

  var vantage: Vantage.VantageStatic;

  export = vantage;
}
declare module 'vantage/index' {
  import alias = require('~vantage/index');
  export = alias;
}
declare module 'vantage' {
  import alias = require('~vantage/index');
  export = alias;
}
declare module '@xiphiaz/vantage' {
  import alias = require('~vantage/index');
  export = alias;
}
