import gsap from 'https://cdn.skypack.dev/gsap';

var script = {
  data() {
    return {
      message: "Welcome to Vue!",
      modalOpened: false
    };
  },
  methods: {
    doSomething() {
      alert("Hello!");
    },
    modalOpen(el, done) {
      const modalInner = el.querySelector(".modal__inner");
      const image = el.querySelector(".modal__image");
      const content = el.querySelector(".modal__content");

      const modalTL = new gsap.timeline();

      modalTL.set(modalInner, {
        opacity: 0,
        y: 300
      });

      modalTL
        .from(el, {
          opacity: 0,
          duration: 0.35
        })
        .to(
          modalInner,
          {
            opacity: 1,
            y: 0,
            ease: "back.out(1.7)",
            duration: 0.35
          },
          "-=0.25"
        )
        .to(image, {
          x: -150,
          duration: 0.35
        })
        .to(
          content,
          {
            x: 150,
            duration: 0.35,
            onComplete: done
          },
          "<"
        );
    },
    modalClose(el, done) {
      const modalTL = gsap.timeline();

      modalTL.to(el, {
        opacity: 0,
        duration: 0.25,
        onComplete: done
      });
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { attrs: { id: "app" } },
    [
      _c("h1", [_vm._v("Vue Transitions with GSAP!")]),
      _vm._v(" "),
      _c(
        "button",
        {
          on: {
            click: function($event) {
              _vm.modalOpened = true;
            }
          }
        },
        [_vm._v("View more")]
      ),
      _vm._v(" "),
      _c(
        "transition",
        {
          attrs: { name: "modal-open" },
          on: { enter: _vm.modalOpen, leave: _vm.modalClose }
        },
        [
          _vm.modalOpened
            ? _c("article", { staticClass: "modal" }, [
                _c("div", { staticClass: "modal__inner" }, [
                  _c("figure", { staticClass: "modal__image" }, [
                    _c("img", {
                      attrs: {
                        src:
                          "https://images.unsplash.com/photo-1554306297-0c86e837d24b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1021&q=80",
                        alt: "burgers grilling!"
                      }
                    }),
                    _vm._v(" "),
                    _c("figcaption", [_vm._v("Photo by Joshua Kantarges")])
                  ]),
                  _vm._v(" "),
                  _c("section", { staticClass: "modal__content" }, [
                    _c(
                      "button",
                      {
                        staticClass: "modal__close",
                        on: {
                          click: function($event) {
                            _vm.modalOpened = false;
                          }
                        }
                      },
                      [_vm._v("\n            ×\n          ")]
                    ),
                    _vm._v(" "),
                    _c("h1", [_vm._v("Firehouse Cheeseburgers")]),
                    _vm._v(" "),
                    _c("p", [
                      _vm._v(
                        "\n            If you love hot sauce with every meal, these burgers are for you.\n            We blend ground beef patties with both tangy hot sauce AND Frank’s\n            seasoning for layers of spicy, zesty flavor, then top them with\n            Monterey Jack for the melt-factor.\n          "
                      )
                    ]),
                    _vm._v(" "),
                    _c("button", [_vm._v("Order Now!")])
                  ])
                ])
              ])
            : _vm._e()
        ]
      )
    ],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-3ebfaa86_0", { source: "#app {\n  font-family: Avenir, Helvetica, Arial, sans-serif;\n  text-align: center;\n  color: #2c3e50;\n  margin-top: 60px;\n}\nbutton {\n  cursor: pointer;\n  background: none;\n  border: solid 1px;\n  border-radius: 2em;\n  font: inherit;\n  padding: 0.75em 2em;\n  color: white;\n  background-color: #d62300;\n  text-transform: uppercase;\n  font-weight: 900;\n}\n.modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  height: 100vh;\n  width: 100vw;\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0 auto;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: rgba(0, 0, 0, 0.6);\n}\n.modal__inner {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n}\n.modal__image {\n  position: absolute;\n  z-index: 20;\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n  aspect-ratio: 1/1;\n  height: 300px;\n  overflow: hidden;\n}\n.modal__image img {\n  height: 100%;\n  width: 100%;\n  object-fit: cover;\n  object-position: cover;\n}\n.modal__content {\n  position: absolute;\n  z-index: 10;\n  box-sizing: border-box;\n  padding: 1rem;\n  background: #f5ebdc;\n  aspect-ratio: 1/1;\n  height: 300px;\n  display: flex;\n  flex-flow: column;\n  align-items: center;\n  justify-content: center;\n}\n.modal__content h1 {\n  padding: 0;\n  margin: 0;\n}\n.modal__close {\n  font-size: 2rem;\n  box-sizing: border-box;\n  padding: 0;\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  top: 0;\n  right: 0;\n  height: 60px;\n  width: 60px;\n  border: 0;\n  color: #d62300;\n  background: none;\n}\n\n/*# sourceMappingURL=pen.vue.map */", map: {"version":3,"sources":["/tmp/codepen/vuejs/src/pen.vue","pen.vue"],"names":[],"mappings":"AAuGA;EACA,iDAAA;EACA,kBAAA;EACA,cAAA;EACA,gBAAA;ACtGA;ADyGA;EACA,eAAA;EACA,gBAAA;EACA,iBAAA;EACA,kBAAA;EACA,aAAA;EACA,mBAAA;EACA,YAAA;EACA,yBAAA;EACA,yBAAA;EACA,gBAAA;ACtGA;ADyGA;EACA,eAAA;EACA,MAAA;EACA,OAAA;EACA,aAAA;EACA,YAAA;EACA,sBAAA;EACA,UAAA;EACA,cAAA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,8BAAA;ACtGA;ADuGA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,kBAAA;EACA,MAAA;EACA,OAAA;EACA,YAAA;EACA,WAAA;ACrGA;ADuGA;EACA,kBAAA;EACA,WAAA;EACA,sBAAA;EACA,UAAA;EACA,SAAA;EACA,iBAAA;EACA,aAAA;EACA,gBAAA;ACrGA;ADsGA;EACA,YAAA;EACA,WAAA;EACA,iBAAA;EACA,sBAAA;ACpGA;ADuGA;EACA,kBAAA;EACA,WAAA;EACA,sBAAA;EACA,aAAA;EACA,mBAAA;EACA,iBAAA;EACA,aAAA;EACA,aAAA;EACA,iBAAA;EACA,mBAAA;EACA,uBAAA;ACrGA;ADsGA;EACA,UAAA;EACA,SAAA;ACpGA;ADuGA;EACA,eAAA;EACA,sBAAA;EACA,UAAA;EACA,kBAAA;EACA,aAAA;EACA,mBAAA;EACA,uBAAA;EACA,MAAA;EACA,QAAA;EACA,YAAA;EACA,WAAA;EACA,SAAA;EACA,cAAA;EACA,gBAAA;ACrGA;;AAEA,kCAAkC","file":"pen.vue","sourcesContent":["<template>\n  <div id=\"app\">\n    <h1>Vue Transitions with GSAP!</h1>\n    <button @click=\"modalOpened = true\">View more</button>\n\n    <transition name=\"modal-open\" @enter=\"modalOpen\" @leave=\"modalClose\">\n      <article class=\"modal\" v-if=\"modalOpened\">\n        <div class=\"modal__inner\">\n          <figure class=\"modal__image\">\n            <img\n              src=\"https://images.unsplash.com/photo-1554306297-0c86e837d24b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1021&q=80\"\n              alt=\"burgers grilling!\"\n            />\n            <figcaption>Photo by Joshua Kantarges</figcaption>\n          </figure>\n          <section class=\"modal__content\">\n            <button class=\"modal__close\" @click=\"modalOpened = false\">\n              &times;\n            </button>\n            <h1>Firehouse Cheeseburgers</h1>\n            <p>\n              If you love hot sauce with every meal, these burgers are for you.\n              We blend ground beef patties with both tangy hot sauce AND Frank’s\n              seasoning for layers of spicy, zesty flavor, then top them with\n              Monterey Jack for the melt-factor.\n            </p>\n            <button>Order Now!</button>\n          </section>\n        </div>\n      </article>\n    </transition>\n  </div>\n</template>\n\n<script>\nimport gsap from \"https://cdn.skypack.dev/gsap\";\n\nexport default {\n  data() {\n    return {\n      message: \"Welcome to Vue!\",\n      modalOpened: false\n    };\n  },\n  methods: {\n    doSomething() {\n      alert(\"Hello!\");\n    },\n    modalOpen(el, done) {\n      const modalInner = el.querySelector(\".modal__inner\");\n      const image = el.querySelector(\".modal__image\");\n      const content = el.querySelector(\".modal__content\");\n\n      const modalTL = new gsap.timeline();\n\n      modalTL.set(modalInner, {\n        opacity: 0,\n        y: 300\n      });\n\n      modalTL\n        .from(el, {\n          opacity: 0,\n          duration: 0.35\n        })\n        .to(\n          modalInner,\n          {\n            opacity: 1,\n            y: 0,\n            ease: \"back.out(1.7)\",\n            duration: 0.35\n          },\n          \"-=0.25\"\n        )\n        .to(image, {\n          x: -150,\n          duration: 0.35\n        })\n        .to(\n          content,\n          {\n            x: 150,\n            duration: 0.35,\n            onComplete: done\n          },\n          \"<\"\n        );\n    },\n    modalClose(el, done) {\n      const modalTL = gsap.timeline();\n\n      modalTL.to(el, {\n        opacity: 0,\n        duration: 0.25,\n        onComplete: done\n      });\n    }\n  }\n};\n</script>\n\n<style lang=\"scss\">\n#app {\n  font-family: Avenir, Helvetica, Arial, sans-serif;\n  text-align: center;\n  color: #2c3e50;\n  margin-top: 60px;\n}\n\nbutton {\n  cursor: pointer;\n  background: none;\n  border: solid 1px;\n  border-radius: 2em;\n  font: inherit;\n  padding: 0.75em 2em;\n  color: white;\n  background-color: rgb(214, 35, 0);\n  text-transform: uppercase;\n  font-weight: 900;\n}\n\n.modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  height: 100vh;\n  width: 100vw;\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0 auto;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: rgba(0, 0, 0, 0.6);\n  &__inner {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 100%;\n    width: 100%;\n  }\n  &__image {\n    position: absolute;\n    z-index: 20;\n    box-sizing: border-box;\n    padding: 0;\n    margin: 0;\n    aspect-ratio: 1/1;\n    height: 300px;\n    overflow: hidden;\n    img {\n      height: 100%;\n      width: 100%;\n      object-fit: cover;\n      object-position: cover;\n    }\n  }\n  &__content {\n    position: absolute;\n    z-index: 10;\n    box-sizing: border-box;\n    padding: 1rem;\n    background: #f5ebdc;\n    aspect-ratio: 1/1;\n    height: 300px;\n    display: flex;\n    flex-flow: column;\n    align-items: center;\n    justify-content: center;\n    h1 {\n      padding: 0;\n      margin: 0;\n    }\n  }\n  &__close {\n    font-size: 2rem;\n    box-sizing: border-box;\n    padding: 0;\n    position: absolute;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    top: 0;\n    right: 0;\n    height: 60px;\n    width: 60px;\n    border: 0;\n    color: rgb(214, 35, 0);\n    background: none;\n  }\n}\n</style>\n","#app {\n  font-family: Avenir, Helvetica, Arial, sans-serif;\n  text-align: center;\n  color: #2c3e50;\n  margin-top: 60px;\n}\n\nbutton {\n  cursor: pointer;\n  background: none;\n  border: solid 1px;\n  border-radius: 2em;\n  font: inherit;\n  padding: 0.75em 2em;\n  color: white;\n  background-color: #d62300;\n  text-transform: uppercase;\n  font-weight: 900;\n}\n\n.modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  height: 100vh;\n  width: 100vw;\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0 auto;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: rgba(0, 0, 0, 0.6);\n}\n.modal__inner {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n}\n.modal__image {\n  position: absolute;\n  z-index: 20;\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n  aspect-ratio: 1/1;\n  height: 300px;\n  overflow: hidden;\n}\n.modal__image img {\n  height: 100%;\n  width: 100%;\n  object-fit: cover;\n  object-position: cover;\n}\n.modal__content {\n  position: absolute;\n  z-index: 10;\n  box-sizing: border-box;\n  padding: 1rem;\n  background: #f5ebdc;\n  aspect-ratio: 1/1;\n  height: 300px;\n  display: flex;\n  flex-flow: column;\n  align-items: center;\n  justify-content: center;\n}\n.modal__content h1 {\n  padding: 0;\n  margin: 0;\n}\n.modal__close {\n  font-size: 2rem;\n  box-sizing: border-box;\n  padding: 0;\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  top: 0;\n  right: 0;\n  height: 60px;\n  width: 60px;\n  border: 0;\n  color: #d62300;\n  background: none;\n}\n\n/*# sourceMappingURL=pen.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

export default __vue_component__;