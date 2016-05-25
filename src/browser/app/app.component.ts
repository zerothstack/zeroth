import { Component } from '@angular/core';
import '../public/css/styles.css';
import { Cat } from '../../../_demo/common/models/cat.model';
@Component({
  selector: 'my-app',
  template: require('./app.component.html'),
  styles: [require('./app.component.css')]
})
export class AppComponent {

  public handleClick() {
    console.log('click!', new Cat());
  }

}
