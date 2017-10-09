import { Component } from './fractal'

export default class Print extends Component {
  // constructor(name, el, parent) {
  //   super(name, el, parent);
  //   this.data = {
  //     a: 123
  //   };
  // }

  getData(cb, param) {
    cb({a: 123});
  }
}

