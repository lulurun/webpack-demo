const COMPONENT_ATTR = 'f-component';

const knownComponents = {};

function registerComponent(name, component) {
  knownComponents[name] = component;
}

function getTemplate(name) {
  return require('./' + name + '.tmpl');
};

function getComponent(name) {
  if (name in knownComponents) {
    return knownComponents[name];
  }
  const c = require('./' + name).default;
  registerComponent(name, c);
  return c;
}

export const F = (() => {
  return {
    init: () => {
      const c = new Component('__root__', document.body);
      c.loadChildren();
    },
    registerComponent: registerComponent,
  };
})();

export class Component {
  constructor(name, el, parent) {
    this.name = name;
    this.el = el;
    this.complete = false;
    this.parent = parent;
    this.children = [];
  }

  getData(cb, param) {
    cb(this.data || {});
  }

  render(data, template, param) {
    this.el.innerHTML = template(data);
    this.children.forEach(c => {
      c.destroyed(param);
    });
    this.children = [];
  }

  loadChildren(cb, param) {
    const els = this.el.querySelectorAll('[' + COMPONENT_ATTR + ']');
    if (!els || !els.length)
      return cb();

    const len = els.length;
    let nbComplete = 0;
    Array.prototype.forEach.call(els, (el, i) => {
      const name = el.getAttribute(COMPONENT_ATTR);
      console.debug("found component:", name);
      const Class = getComponent(name);
      const c = new Class(name, el, this);
      this.children.push(c);
      c.load(param, () => {
        if (++nbComplete === len)
          cb();
      });
    });
  }

  destroyed(param) {
    this.children.forEach(c => {
      c.destroyed(param);
    });
    this.children = [];
    console.debug(this.name, "destroyed");
  }

  rendered(param){}
  loaded(param){}

  load(param, cb) {
    param = param || {};
    console.time('Component.' + this.name);
    this.complete = false;
    this.getData(data => {
      const template = this.template || getTemplate(this.templateName || this.name);
      this.render(data, template, param);
      this.rendered(param);
      this.loadChildren(() => {
        this.complete = true;
        console.timeEnd('Component.' + this.name);
        this.loaded(param);
      }, param)
    }, param)
  }
}

