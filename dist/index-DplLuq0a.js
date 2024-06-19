function noop() {
}
const identity = (x2) => x2;
function assign(tar, src) {
  for (const k2 in src) tar[k2] = src[k2];
  return (
    /** @type {T & S} */
    tar
  );
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a2, b2) {
  return a2 != a2 ? b2 == b2 : a2 !== b2 || a2 && typeof a2 === "object" || typeof a2 === "function";
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
  if (element_src === url) return true;
  if (!src_url_equal_anchor) {
    src_url_equal_anchor = document.createElement("a");
  }
  src_url_equal_anchor.href = url;
  return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_2) => value = _2)();
  return value;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i2 = 0; i2 < len; i2 += 1) {
        merged[i2] = $$scope.dirty[i2] | lets[i2];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i2 = 0; i2 < length; i2++) {
      dirty[i2] = -1;
    }
    return dirty;
  }
  return -1;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0) raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0) raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function append(target, node) {
  target.appendChild(node);
}
function get_root_for_style(node) {
  if (!node) return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && /** @type {ShadowRoot} */
  root.host) {
    return (
      /** @type {ShadowRoot} */
      root
    );
  }
  return node.ownerDocument;
}
function append_empty_stylesheet(node) {
  const style_element = element("style");
  style_element.textContent = "/* empty */";
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
function append_stylesheet(node, style) {
  append(
    /** @type {Document} */
    node.head || node,
    style
  );
  return style.sheet;
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i2 = 0; i2 < iterations.length; i2 += 1) {
    if (iterations[i2]) iterations[i2].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
}
function stop_propagation(fn) {
  return function(event) {
    event.stopPropagation();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data) return;
  text2.data = /** @type {string} */
  data;
}
function set_style(node, key, value, important) {
  if (value == null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, "");
  }
}
function toggle_class(element2, name, toggle) {
  element2.classList.toggle(name, !!toggle);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  return new CustomEvent(type, { detail, bubbles, cancelable });
}
class HtmlTag {
  /**
   * @private
   * @default false
   */
  is_svg = false;
  /** parent for creating node */
  e = void 0;
  /** html tag nodes */
  n = void 0;
  /** target */
  t = void 0;
  /** anchor */
  a = void 0;
  constructor(is_svg = false) {
    this.is_svg = is_svg;
    this.e = this.n = null;
  }
  /**
   * @param {string} html
   * @returns {void}
   */
  c(html) {
    this.h(html);
  }
  /**
   * @param {string} html
   * @param {HTMLElement | SVGElement} target
   * @param {HTMLElement | SVGElement} anchor
   * @returns {void}
   */
  m(html, target, anchor = null) {
    if (!this.e) {
      if (this.is_svg)
        this.e = svg_element(
          /** @type {keyof SVGElementTagNameMap} */
          target.nodeName
        );
      else
        this.e = element(
          /** @type {keyof HTMLElementTagNameMap} */
          target.nodeType === 11 ? "TEMPLATE" : target.nodeName
        );
      this.t = target.tagName !== "TEMPLATE" ? target : (
        /** @type {HTMLTemplateElement} */
        target.content
      );
      this.c(html);
    }
    this.i(anchor);
  }
  /**
   * @param {string} html
   * @returns {void}
   */
  h(html) {
    this.e.innerHTML = html;
    this.n = Array.from(
      this.e.nodeName === "TEMPLATE" ? this.e.content.childNodes : this.e.childNodes
    );
  }
  /**
   * @returns {void} */
  i(anchor) {
    for (let i2 = 0; i2 < this.n.length; i2 += 1) {
      insert(this.t, this.n[i2], anchor);
    }
  }
  /**
   * @param {string} html
   * @returns {void}
   */
  p(html) {
    this.d();
    this.h(html);
    this.i(this.a);
  }
  /**
   * @returns {void} */
  d() {
    this.n.forEach(detach);
  }
}
function construct_svelte_component(component, props) {
  return new component(props);
}
const managed_styles = /* @__PURE__ */ new Map();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i2 = str.length;
  while (i2--) hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i2);
  return hash2 >>> 0;
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
function create_rule(node, a2, b2, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p2 = 0; p2 <= 1; p2 += step) {
    const t2 = a2 + (b2 - a2) * ease(p2);
    keyframes += p2 * 100 + `%{${fn(t2, 1 - t2)}}
`;
  }
  const rule = keyframes + `100% {${fn(b2, 1 - b2)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(
    name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
    // remove all Svelte animations
  );
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active -= deleted;
    if (!active) clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active) return;
    managed_styles.forEach((info) => {
      const { ownerNode } = info.stylesheet;
      if (ownerNode) detach(ownerNode);
    });
    managed_styles.clear();
  });
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component) throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
  return context;
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length) binding_callbacks.pop()();
    for (let i2 = 0; i2 < render_callbacks.length; i2 += 1) {
      const callback = render_callbacks[i2];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c2) => fns.indexOf(c2) === -1 ? filtered.push(c2) : targets.push(c2));
  targets.forEach((c2) => c2());
  render_callbacks = filtered;
}
let promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block)) return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2) block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
  const options = { direction: "in" };
  let config = fn(node, params, options);
  let running = false;
  let animation_name;
  let task;
  let uid = 0;
  function cleanup() {
    if (animation_name) delete_rule(node, animation_name);
  }
  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    if (css) animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
    tick(0, 1);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    if (task) task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, "start"));
    task = loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(1, 0);
          dispatch(node, true, "end");
          cleanup();
          return running = false;
        }
        if (now2 >= start_time) {
          const t2 = easing((now2 - start_time) / duration);
          tick(t2, 1 - t2);
        }
      }
      return running;
    });
  }
  let started = false;
  return {
    start() {
      if (started) return;
      started = true;
      delete_rule(node);
      if (is_function(config)) {
        config = config(options);
        wait().then(go);
      } else {
        go();
      }
    },
    invalidate() {
      started = false;
    },
    end() {
      if (running) {
        cleanup();
        running = false;
      }
    }
  };
}
function create_out_transition(node, fn, params) {
  const options = { direction: "out" };
  let config = fn(node, params, options);
  let running = true;
  let animation_name;
  const group = outros;
  group.r += 1;
  let original_inert_value;
  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    if (css) animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    add_render_callback(() => dispatch(node, false, "start"));
    if ("inert" in node) {
      original_inert_value = /** @type {HTMLElement} */
      node.inert;
      node.inert = true;
    }
    loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(0, 1);
          dispatch(node, false, "end");
          if (!--group.r) {
            run_all(group.c);
          }
          return false;
        }
        if (now2 >= start_time) {
          const t2 = easing((now2 - start_time) / duration);
          tick(1 - t2, t2);
        }
      }
      return running;
    });
  }
  if (is_function(config)) {
    wait().then(() => {
      config = config(options);
      go();
    });
  } else {
    go();
  }
  return {
    end(reset) {
      if (reset && "inert" in node) {
        node.inert = original_inert_value;
      }
      if (reset && config.tick) {
        config.tick(1, 0);
      }
      if (running) {
        if (animation_name) delete_rule(node, animation_name);
        running = false;
      }
    }
  };
}
function ensure_array_like(array_like_or_iterator) {
  return array_like_or_iterator?.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i2 = levels.length;
  while (i2--) {
    const o2 = levels[i2];
    const n2 = updates[i2];
    if (n2) {
      for (const key in o2) {
        if (!(key in n2)) to_null_out[key] = 1;
      }
      for (const key in n2) {
        if (!accounted_for[key]) {
          update2[key] = n2[key];
          accounted_for[key] = 1;
        }
      }
      levels[i2] = n2;
    } else {
      for (const key in o2) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2)) update2[key] = void 0;
  }
  return update2;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
function bind(component, name, callback) {
  const index = component.$$.props[name];
  if (index !== void 0) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i2) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i2 / 31 | 0] |= 1 << i2 % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i2, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i2], $$.ctx[i2] = value)) {
      if (!$$.skip_bound && $$.bound[i2]) $$.bound[i2](value);
      if (ready) make_dirty(component, i2);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$ = void 0;
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$set = void 0;
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
}
const PUBLIC_VERSION = "4";
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
function cubicOut(t2) {
  const f2 = t2 - 1;
  return f2 * f2 * f2 + 1;
}
const s_TAG_OBJECT = "[object Object]";
function deepMerge(target = {}, ...sourceObj) {
  if (Object.prototype.toString.call(target) !== s_TAG_OBJECT) {
    throw new TypeError(`deepMerge error: 'target' is not an 'object'.`);
  }
  for (let cntr = 0; cntr < sourceObj.length; cntr++) {
    if (Object.prototype.toString.call(sourceObj[cntr]) !== s_TAG_OBJECT) {
      throw new TypeError(`deepMerge error: 'sourceObj[${cntr}]' is not an 'object'.`);
    }
  }
  return _deepMerge(target, ...sourceObj);
}
function hasGetter(object, accessor) {
  if (typeof object !== "object" || object === null || object === void 0) {
    return false;
  }
  const iDescriptor = Object.getOwnPropertyDescriptor(object, accessor);
  if (iDescriptor !== void 0 && iDescriptor.get !== void 0) {
    return true;
  }
  for (let o2 = Object.getPrototypeOf(object); o2; o2 = Object.getPrototypeOf(o2)) {
    const descriptor = Object.getOwnPropertyDescriptor(o2, accessor);
    if (descriptor !== void 0 && descriptor.get !== void 0) {
      return true;
    }
  }
  return false;
}
function isIterable(value) {
  if (value === null || value === void 0 || typeof value !== "object") {
    return false;
  }
  return Symbol.iterator in value;
}
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isPlainObject(value) {
  if (Object.prototype.toString.call(value) !== s_TAG_OBJECT) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
function safeAccess(data, accessor, defaultValue) {
  if (typeof data !== "object") {
    return defaultValue;
  }
  if (typeof accessor !== "string") {
    return defaultValue;
  }
  const access = accessor.split(".");
  for (let cntr = 0; cntr < access.length; cntr++) {
    if (typeof data[access[cntr]] === "undefined" || data[access[cntr]] === null) {
      return defaultValue;
    }
    data = data[access[cntr]];
  }
  return data;
}
function safeSet(data, accessor, value, operation = "set", createMissing = true) {
  if (typeof data !== "object") {
    throw new TypeError(`safeSet Error: 'data' is not an 'object'.`);
  }
  if (typeof accessor !== "string") {
    throw new TypeError(`safeSet Error: 'accessor' is not a 'string'.`);
  }
  const access = accessor.split(".");
  for (let cntr = 0; cntr < access.length; cntr++) {
    if (Array.isArray(data)) {
      const number = +access[cntr];
      if (!Number.isInteger(number) || number < 0) {
        return false;
      }
    }
    if (cntr === access.length - 1) {
      switch (operation) {
        case "add":
          data[access[cntr]] += value;
          break;
        case "div":
          data[access[cntr]] /= value;
          break;
        case "mult":
          data[access[cntr]] *= value;
          break;
        case "set":
          data[access[cntr]] = value;
          break;
        case "set-undefined":
          if (typeof data[access[cntr]] === "undefined") {
            data[access[cntr]] = value;
          }
          break;
        case "sub":
          data[access[cntr]] -= value;
          break;
      }
    } else {
      if (createMissing && typeof data[access[cntr]] === "undefined") {
        data[access[cntr]] = {};
      }
      if (data[access[cntr]] === null || typeof data[access[cntr]] !== "object") {
        return false;
      }
      data = data[access[cntr]];
    }
  }
  return true;
}
function _deepMerge(target = {}, ...sourceObj) {
  for (let cntr = 0; cntr < sourceObj.length; cntr++) {
    const obj = sourceObj[cntr];
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (prop.startsWith("-=")) {
          delete target[prop.slice(2)];
          continue;
        }
        target[prop] = Object.prototype.hasOwnProperty.call(target, prop) && target[prop]?.constructor === Object && obj[prop]?.constructor === Object ? _deepMerge({}, target[prop], obj[prop]) : obj[prop];
      }
    }
  }
  return target;
}
class A11yHelper {
  /**
   * Apply focus to the HTMLElement targets in a given A11yFocusSource data object. An iterable list `options.focusEl`
   * can contain HTMLElements or selector strings. If multiple focus targets are provided in a list then the first
   * valid target found will be focused. If focus target is a string then a lookup via `document.querySelector` is
   * performed. In this case you should provide a unique selector for the desired focus target.
   *
   * Note: The body of this method is postponed to the next clock tick to allow any changes in the DOM to occur that
   * might alter focus targets before applying.
   *
   * @param {A11yFocusSource|{ focusSource: A11yFocusSource }}   options - The focus options instance to apply.
   */
  static applyFocusSource(options) {
    if (!isObject(options)) {
      return;
    }
    const focusOpts = isObject(options?.focusSource) ? options.focusSource : options;
    setTimeout(() => {
      const debug = typeof focusOpts.debug === "boolean" ? focusOpts.debug : false;
      if (isIterable(focusOpts.focusEl)) {
        if (debug) {
          console.debug(`A11yHelper.applyFocusSource debug - Attempting to apply focus target: `, focusOpts.focusEl);
        }
        for (const target of focusOpts.focusEl) {
          if (target instanceof HTMLElement && target.isConnected) {
            target.focus();
            if (debug) {
              console.debug(`A11yHelper.applyFocusSource debug - Applied focus to target: `, target);
            }
            break;
          } else if (typeof target === "string") {
            const element2 = document.querySelector(target);
            if (element2 instanceof HTMLElement && element2.isConnected) {
              element2.focus();
              if (debug) {
                console.debug(`A11yHelper.applyFocusSource debug - Applied focus to target: `, element2);
              }
              break;
            } else if (debug) {
              console.debug(`A11yHelper.applyFocusSource debug - Could not query selector: `, target);
            }
          }
        }
      } else if (debug) {
        console.debug(`A11yHelper.applyFocusSource debug - No focus targets defined.`);
      }
    }, 0);
  }
  /**
   * Returns first focusable element within a specified element.
   *
   * @param {HTMLElement|Document} [element=document] - Optional element to start query.
   *
   * @param {object} [options] - Optional parameters.
   *
   * @param {Iterable<string>} [options.ignoreClasses] - Iterable list of classes to ignore elements.
   *
   * @param {Set<HTMLElement>} [options.ignoreElements] - Set of elements to ignore.
   *
   * @returns {HTMLElement} First focusable child element
   */
  static getFirstFocusableElement(element2 = document, options) {
    const focusableElements = this.getFocusableElements(element2, options);
    return focusableElements.length > 0 ? focusableElements[0] : void 0;
  }
  /**
   * Returns all focusable elements within a specified element.
   *
   * @param {HTMLElement|Document} [element=document] Optional element to start query.
   *
   * @param {object}            [options] - Optional parameters.
   *
   * @param {boolean}           [options.anchorHref=true] - When true anchors must have an HREF.
   *
   * @param {Iterable<string>}  [options.ignoreClasses] - Iterable list of classes to ignore elements.
   *
   * @param {Set<HTMLElement>}  [options.ignoreElements] - Set of elements to ignore.
   *
   * @param {string}            [options.selectors] - Custom list of focusable selectors for `querySelectorAll`.
   *
   * @returns {Array<HTMLElement>} Child keyboard focusable
   */
  static getFocusableElements(element2 = document, { anchorHref = true, ignoreClasses, ignoreElements, selectors } = {}) {
    if (!(element2 instanceof HTMLElement) && !(element2 instanceof Document)) {
      throw new TypeError(`'element' is not a HTMLElement or Document instance.`);
    }
    if (typeof anchorHref !== "boolean") {
      throw new TypeError(`'anchorHref' is not a boolean.`);
    }
    if (ignoreClasses !== void 0 && !isIterable(ignoreClasses)) {
      throw new TypeError(`'ignoreClasses' is not an iterable list.`);
    }
    if (ignoreElements !== void 0 && !(ignoreElements instanceof Set)) {
      throw new TypeError(`'ignoreElements' is not a Set.`);
    }
    if (selectors !== void 0 && typeof selectors !== "string") {
      throw new TypeError(`'selectors' is not a string.`);
    }
    const selectorQuery = selectors ?? this.#getFocusableSelectors(anchorHref);
    const allElements = [...element2.querySelectorAll(selectorQuery)];
    if (ignoreElements && ignoreClasses) {
      return allElements.filter((el) => {
        let hasIgnoreClass = false;
        for (const ignoreClass of ignoreClasses) {
          if (el.classList.contains(ignoreClass)) {
            hasIgnoreClass = true;
            break;
          }
        }
        return !hasIgnoreClass && !ignoreElements.has(el) && el.style.display !== "none" && el.style.visibility !== "hidden" && !el.hasAttribute("disabled") && !el.hasAttribute("inert") && el.getAttribute("aria-hidden") !== "true";
      });
    } else if (ignoreClasses) {
      return allElements.filter((el) => {
        let hasIgnoreClass = false;
        for (const ignoreClass of ignoreClasses) {
          if (el.classList.contains(ignoreClass)) {
            hasIgnoreClass = true;
            break;
          }
        }
        return !hasIgnoreClass && el.style.display !== "none" && el.style.visibility !== "hidden" && !el.hasAttribute("disabled") && !el.hasAttribute("inert") && el.getAttribute("aria-hidden") !== "true";
      });
    } else if (ignoreElements) {
      return allElements.filter((el) => {
        return !ignoreElements.has(el) && el.style.display !== "none" && el.style.visibility !== "hidden" && !el.hasAttribute("disabled") && !el.hasAttribute("inert") && el.getAttribute("aria-hidden") !== "true";
      });
    } else {
      return allElements.filter((el) => {
        return el.style.display !== "none" && el.style.visibility !== "hidden" && !el.hasAttribute("disabled") && !el.hasAttribute("inert") && el.getAttribute("aria-hidden") !== "true";
      });
    }
  }
  /**
   * Returns the default focusable selectors query.
   *
   * @param {boolean}  [anchorHref=true] - When true anchors must have an HREF.
   *
   * @returns {string} Focusable selectors for `querySelectorAll`.
   */
  static #getFocusableSelectors(anchorHref = true) {
    return `button, [contenteditable=""], [contenteditable="true"], details summary:not([tabindex="-1"]), embed, a${anchorHref ? "[href]" : ""}, iframe, object, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])`;
  }
  /**
   * Gets a A11yFocusSource object from the given DOM event allowing for optional X / Y screen space overrides.
   * Browsers (Firefox / Chrome) forwards a mouse event for the context menu keyboard button. Provides detection of
   * when the context menu event is from the keyboard. Firefox as of (1/23) does not provide the correct screen space
   * coordinates, so for keyboard context menu presses coordinates are generated from the centroid point of the
   * element.
   *
   * A default fallback element or selector string may be provided to provide the focus target. If the event comes from
   * the keyboard however the source focused element is inserted as the target with the fallback value appended to the
   * list of focus targets. When A11yFocusSource is applied by {@link A11yHelper.applyFocusSource} the target focus
   * list is iterated through until a connected target is found and focus applied.
   *
   * @param {object} options - Options
   *
   * @param {KeyboardEvent|MouseEvent}   [options.event] - The source DOM event.
   *
   * @param {boolean} [options.debug] - When true {@link A11yHelper.applyFocusSource} logs focus target data.
   *
   * @param {HTMLElement|string} [options.focusEl] - A specific HTMLElement or selector string as the focus target.
   *
   * @param {number}   [options.x] - Used when an event isn't provided; integer of event source in screen space.
   *
   * @param {number}   [options.y] - Used when an event isn't provided; integer of event source in screen space.
   *
   * @returns {A11yFocusSource} A A11yFocusSource object.
   *
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=1426671
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=314314
   *
   * TODO: Evaluate / test against touch input devices.
   */
  static getFocusSource({ event, x: x2, y: y2, focusEl, debug = false }) {
    if (focusEl !== void 0 && !(focusEl instanceof HTMLElement) && typeof focusEl !== "string") {
      throw new TypeError(
        `A11yHelper.getFocusSource error: 'focusEl' is not a HTMLElement or string.`
      );
    }
    if (debug !== void 0 && typeof debug !== "boolean") {
      throw new TypeError(`A11yHelper.getFocusSource error: 'debug' is not a boolean.`);
    }
    if (event === void 0) {
      if (typeof x2 !== "number") {
        throw new TypeError(`A11yHelper.getFocusSource error: 'event' not defined and 'x' is not a number.`);
      }
      if (typeof y2 !== "number") {
        throw new TypeError(`A11yHelper.getFocusSource error: 'event' not defined and 'y' is not a number.`);
      }
      return {
        debug,
        focusEl: focusEl !== void 0 ? [focusEl] : void 0,
        x: x2,
        y: y2
      };
    }
    if (!(event instanceof KeyboardEvent) && !(event instanceof MouseEvent)) {
      throw new TypeError(`A11yHelper.getFocusSource error: 'event' is not a KeyboardEvent or MouseEvent.`);
    }
    if (x2 !== void 0 && !Number.isInteger(x2)) {
      throw new TypeError(`A11yHelper.getFocusSource error: 'x' is not a number.`);
    }
    if (y2 !== void 0 && !Number.isInteger(y2)) {
      throw new TypeError(`A11yHelper.getFocusSource error: 'y' is not a number.`);
    }
    const targetEl = event.target;
    if (!(targetEl instanceof HTMLElement)) {
      throw new TypeError(`A11yHelper.getFocusSource error: 'event.target' is not an HTMLElement.`);
    }
    const result = { debug };
    if (event instanceof MouseEvent) {
      if (event?.button !== 2 && event.type === "contextmenu") {
        const rect = targetEl.getBoundingClientRect();
        result.x = x2 ?? rect.left + rect.width / 2;
        result.y = y2 ?? rect.top + rect.height / 2;
        result.focusEl = focusEl !== void 0 ? [targetEl, focusEl] : [targetEl];
        result.source = "keyboard";
      } else {
        result.x = x2 ?? event.pageX;
        result.y = y2 ?? event.pageY;
        result.focusEl = focusEl !== void 0 ? [focusEl] : void 0;
      }
    } else {
      const rect = targetEl.getBoundingClientRect();
      result.x = x2 ?? rect.left + rect.width / 2;
      result.y = y2 ?? rect.top + rect.height / 2;
      result.focusEl = focusEl !== void 0 ? [targetEl, focusEl] : [targetEl];
      result.source = "keyboard";
    }
    return result;
  }
  /**
   * Returns first focusable element within a specified element.
   *
   * @param {HTMLElement|Document} [element=document] - Optional element to start query.
   *
   * @param {object} [options] - Optional parameters.
   *
   * @param {Iterable<string>} [options.ignoreClasses] - Iterable list of classes to ignore elements.
   *
   * @param {Set<HTMLElement>} [options.ignoreElements] - Set of elements to ignore.
   *
   * @returns {HTMLElement} First focusable child element
   */
  static getLastFocusableElement(element2 = document, options) {
    const focusableElements = this.getFocusableElements(element2, options);
    return focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : void 0;
  }
  /**
   * Tests if the given element is focusable.
   *
   * @param {HTMLElement} [el] - Element to test.
   *
   * @param {object} [options] - Optional parameters.
   *
   * @param {boolean} [options.anchorHref=true] - When true anchors must have an HREF.
   *
   * @param {Iterable<string>} [options.ignoreClasses] - Iterable list of classes to ignore elements.
   *
   * @returns {boolean} Element is focusable.
   */
  static isFocusable(el, { anchorHref = true, ignoreClasses } = {}) {
    if (el === void 0 || el === null || !(el instanceof HTMLElement) || el?.hidden || !el?.isConnected) {
      return false;
    }
    if (typeof anchorHref !== "boolean") {
      throw new TypeError(`'anchorHref' is not a boolean.`);
    }
    if (ignoreClasses !== void 0 && !isIterable(ignoreClasses)) {
      throw new TypeError(`'ignoreClasses' is not an iterable list.`);
    }
    const contenteditableAttr = el.getAttribute("contenteditable");
    const contenteditableFocusable = typeof contenteditableAttr === "string" && (contenteditableAttr === "" || contenteditableAttr === "true");
    const tabindexAttr = el.getAttribute("tabindex");
    const tabindexFocusable = typeof tabindexAttr === "string" && tabindexAttr !== "-1";
    const isAnchor = el instanceof HTMLAnchorElement;
    if (contenteditableFocusable || tabindexFocusable || isAnchor || el instanceof HTMLButtonElement || el instanceof HTMLDetailsElement || el instanceof HTMLEmbedElement || el instanceof HTMLIFrameElement || el instanceof HTMLInputElement || el instanceof HTMLObjectElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
      if (isAnchor && anchorHref && typeof el.getAttribute("href") !== "string") {
        return false;
      }
      return el.style.display !== "none" && el.style.visibility !== "hidden" && !el.hasAttribute("disabled") && !el.hasAttribute("inert") && el.getAttribute("aria-hidden") !== "true";
    }
    return false;
  }
  /**
   * Convenience method to check if the given data is a valid focus source.
   *
   * @param {HTMLElement|string}   data - Either an HTMLElement or selector string.
   *
   * @returns {boolean} Is valid focus source.
   */
  static isFocusSource(data) {
    return data instanceof HTMLElement || typeof data === "string";
  }
}
class StyleParse {
  static #regexPixels = /(\d+)\s*px/;
  /**
   * Parses a pixel string / computed styles. Ex. `100px` returns `100`.
   *
   * @param {string}   value - Value to parse.
   *
   * @returns {number|undefined} The integer component of a pixel string.
   */
  static pixels(value) {
    if (typeof value !== "string") {
      return void 0;
    }
    const isPixels = this.#regexPixels.test(value);
    const number = parseInt(value);
    return isPixels && Number.isFinite(number) ? number : void 0;
  }
}
class TJSStyleManager {
  /** @type {CSSStyleRule} */
  #cssRule;
  /** @type {string} */
  #docKey;
  /** @type {string} */
  #selector;
  /** @type {HTMLStyleElement} */
  #styleElement;
  /** @type {number} */
  #version;
  /**
   *
   * @param {object}   opts - Options.
   *
   * @param {string}   opts.docKey - Required key providing a link to a specific style sheet element.
   *
   * @param {string}   [opts.selector=:root] - Selector element.
   *
   * @param {Document} [opts.document] - Target document to load styles into.
   *
   * @param {number}   [opts.version] - An integer representing the version / level of styles being managed.
   */
  constructor({ docKey, selector = ":root", document: document2 = globalThis.document, version: version2 } = {}) {
    if (typeof docKey !== "string") {
      throw new TypeError(`StyleManager error: 'docKey' is not a string.`);
    }
    if (typeof selector !== "string") {
      throw new TypeError(`StyleManager error: 'selector' is not a string.`);
    }
    if (version2 !== void 0 && !Number.isSafeInteger(version2) && version2 < 1) {
      throw new TypeError(`StyleManager error: 'version' is defined and is not a positive integer >= 1.`);
    }
    this.#selector = selector;
    this.#docKey = docKey;
    this.#version = version2;
    if (document2[this.#docKey] === void 0) {
      this.#styleElement = document2.createElement("style");
      document2.head.append(this.#styleElement);
      this.#styleElement._STYLE_MANAGER_VERSION = version2;
      this.#styleElement.sheet.insertRule(`${selector} {}`, 0);
      this.#cssRule = this.#styleElement.sheet.cssRules[0];
      document2[docKey] = this.#styleElement;
    } else {
      this.#styleElement = document2[docKey];
      this.#cssRule = this.#styleElement.sheet.cssRules[0];
      if (version2) {
        const existingVersion = this.#styleElement._STYLE_MANAGER_VERSION ?? 0;
        if (version2 > existingVersion) {
          this.#cssRule.style.cssText = "";
        }
      }
    }
  }
  /**
   * @returns {string} Provides an accessor to get the `cssText` for the style sheet.
   */
  get cssText() {
    return this.#cssRule.style.cssText;
  }
  /**
   * @returns {number} Returns the version of this instance.
   */
  get version() {
    return this.#version;
  }
  /**
   * Provides a copy constructor to duplicate an existing TJSStyleManager instance into a new document.
   *
   * Note: This is used to support the `PopOut` module.
   *
   * @param {Document} [document] Target browser document to clone into.
   *
   * @returns {TJSStyleManager} New style manager instance.
   */
  clone(document2 = globalThis.document) {
    const newStyleManager = new TJSStyleManager({
      selector: this.#selector,
      docKey: this.#docKey,
      document: document2,
      version: this.#version
    });
    newStyleManager.#cssRule.style.cssText = this.#cssRule.style.cssText;
    return newStyleManager;
  }
  get() {
    const cssText = this.#cssRule.style.cssText;
    const result = {};
    if (cssText !== "") {
      for (const entry of cssText.split(";")) {
        if (entry !== "") {
          const values = entry.split(":");
          result[values[0].trim()] = values[1];
        }
      }
    }
    return result;
  }
  /**
   * Gets a particular CSS variable.
   *
   * @param {string}   key - CSS variable property key.
   *
   * @returns {string} Returns CSS variable value.
   */
  getProperty(key) {
    if (typeof key !== "string") {
      throw new TypeError(`StyleManager error: 'key' is not a string.`);
    }
    return this.#cssRule.style.getPropertyValue(key);
  }
  /**
   * Set rules by property / value; useful for CSS variables.
   *
   * @param {{ [key: string]: string }}  rules - An object with property / value string pairs to load.
   *
   * @param {boolean}                 [overwrite=true] - When true overwrites any existing values.
   */
  setProperties(rules, overwrite = true) {
    if (!isObject(rules)) {
      throw new TypeError(`StyleManager error: 'rules' is not an object.`);
    }
    if (typeof overwrite !== "boolean") {
      throw new TypeError(`StyleManager error: 'overwrite' is not a boolean.`);
    }
    if (overwrite) {
      for (const [key, value] of Object.entries(rules)) {
        this.#cssRule.style.setProperty(key, value);
      }
    } else {
      for (const [key, value] of Object.entries(rules)) {
        if (this.#cssRule.style.getPropertyValue(key) === "") {
          this.#cssRule.style.setProperty(key, value);
        }
      }
    }
  }
  /**
   * Sets a particular property.
   *
   * @param {string}   key - CSS variable property key.
   *
   * @param {string}   value - CSS variable value.
   *
   * @param {boolean}  [overwrite=true] - Overwrite any existing value.
   */
  setProperty(key, value, overwrite = true) {
    if (typeof key !== "string") {
      throw new TypeError(`StyleManager error: 'key' is not a string.`);
    }
    if (typeof value !== "string") {
      throw new TypeError(`StyleManager error: 'value' is not a string.`);
    }
    if (typeof overwrite !== "boolean") {
      throw new TypeError(`StyleManager error: 'overwrite' is not a boolean.`);
    }
    if (overwrite) {
      this.#cssRule.style.setProperty(key, value);
    } else {
      if (this.#cssRule.style.getPropertyValue(key) === "") {
        this.#cssRule.style.setProperty(key, value);
      }
    }
  }
  /**
   * Removes the property keys specified. If `keys` is an iterable list then all property keys in the list are removed.
   *
   * @param {Iterable<string>} keys - The property keys to remove.
   */
  removeProperties(keys) {
    if (!isIterable(keys)) {
      throw new TypeError(`StyleManager error: 'keys' is not an iterable list.`);
    }
    for (const key of keys) {
      if (typeof key === "string") {
        this.#cssRule.style.removeProperty(key);
      }
    }
  }
  /**
   * Removes a particular CSS variable.
   *
   * @param {string}   key - CSS variable property key.
   *
   * @returns {string} CSS variable value when removed.
   */
  removeProperty(key) {
    if (typeof key !== "string") {
      throw new TypeError(`StyleManager error: 'key' is not a string.`);
    }
    return this.#cssRule.style.removeProperty(key);
  }
}
const cssVariables = new TJSStyleManager({ docKey: "#__trl-root-styles", version: 1 });
function isUpdatableStore(store) {
  if (store === null || store === void 0) {
    return false;
  }
  switch (typeof store) {
    case "function":
    case "object":
      return typeof store.subscribe === "function" && typeof store.update === "function";
  }
  return false;
}
function subscribeIgnoreFirst(store, update2) {
  let firedFirst = false;
  return store.subscribe((value) => {
    if (!firedFirst) {
      firedFirst = true;
    } else {
      update2(value);
    }
  });
}
function resizeObserver(node, target) {
  ResizeObserverManager.add(node, target);
  return {
    /**
     * @param {ResizeObserverTarget} newTarget - An object or function to update with observed width & height changes.
     */
    update: (newTarget) => {
      ResizeObserverManager.remove(node, target);
      target = newTarget;
      ResizeObserverManager.add(node, target);
    },
    destroy: () => {
      ResizeObserverManager.remove(node, target);
    }
  };
}
resizeObserver.updateCache = function(el) {
  if (!(el instanceof HTMLElement)) {
    throw new TypeError(`resizeObserverUpdate error: 'el' is not an HTMLElement.`);
  }
  const subscribers = s_MAP.get(el);
  if (Array.isArray(subscribers)) {
    const computed = globalThis.getComputedStyle(el);
    const borderBottom = StyleParse.pixels(el.style.borderBottom) ?? StyleParse.pixels(computed.borderBottom) ?? 0;
    const borderLeft = StyleParse.pixels(el.style.borderLeft) ?? StyleParse.pixels(computed.borderLeft) ?? 0;
    const borderRight = StyleParse.pixels(el.style.borderRight) ?? StyleParse.pixels(computed.borderRight) ?? 0;
    const borderTop = StyleParse.pixels(el.style.borderTop) ?? StyleParse.pixels(computed.borderTop) ?? 0;
    const paddingBottom = StyleParse.pixels(el.style.paddingBottom) ?? StyleParse.pixels(computed.paddingBottom) ?? 0;
    const paddingLeft = StyleParse.pixels(el.style.paddingLeft) ?? StyleParse.pixels(computed.paddingLeft) ?? 0;
    const paddingRight = StyleParse.pixels(el.style.paddingRight) ?? StyleParse.pixels(computed.paddingRight) ?? 0;
    const paddingTop = StyleParse.pixels(el.style.paddingTop) ?? StyleParse.pixels(computed.paddingTop) ?? 0;
    const additionalWidth = borderLeft + borderRight + paddingLeft + paddingRight;
    const additionalHeight = borderTop + borderBottom + paddingTop + paddingBottom;
    for (const subscriber of subscribers) {
      subscriber.styles.additionalWidth = additionalWidth;
      subscriber.styles.additionalHeight = additionalHeight;
      s_UPDATE_SUBSCRIBER(subscriber, subscriber.contentWidth, subscriber.contentHeight);
    }
  }
};
const s_MAP = /* @__PURE__ */ new Map();
class ResizeObserverManager {
  /**
   * Add an HTMLElement and ResizeObserverTarget instance for monitoring. Create cached style attributes for the
   * given element include border & padding dimensions for offset width / height calculations.
   *
   * @param {HTMLElement}    el - The element to observe.
   *
   * @param {ResizeObserverTarget} target - A target that contains one of several mechanisms for updating resize data.
   */
  static add(el, target) {
    const updateType = s_GET_UPDATE_TYPE(target);
    if (updateType === 0) {
      throw new Error(`'target' does not match supported ResizeObserverManager update mechanisms.`);
    }
    const computed = globalThis.getComputedStyle(el);
    const borderBottom = StyleParse.pixels(el.style.borderBottom) ?? StyleParse.pixels(computed.borderBottom) ?? 0;
    const borderLeft = StyleParse.pixels(el.style.borderLeft) ?? StyleParse.pixels(computed.borderLeft) ?? 0;
    const borderRight = StyleParse.pixels(el.style.borderRight) ?? StyleParse.pixels(computed.borderRight) ?? 0;
    const borderTop = StyleParse.pixels(el.style.borderTop) ?? StyleParse.pixels(computed.borderTop) ?? 0;
    const paddingBottom = StyleParse.pixels(el.style.paddingBottom) ?? StyleParse.pixels(computed.paddingBottom) ?? 0;
    const paddingLeft = StyleParse.pixels(el.style.paddingLeft) ?? StyleParse.pixels(computed.paddingLeft) ?? 0;
    const paddingRight = StyleParse.pixels(el.style.paddingRight) ?? StyleParse.pixels(computed.paddingRight) ?? 0;
    const paddingTop = StyleParse.pixels(el.style.paddingTop) ?? StyleParse.pixels(computed.paddingTop) ?? 0;
    const data = {
      updateType,
      target,
      // Stores most recent contentRect.width and contentRect.height values from ResizeObserver.
      contentWidth: 0,
      contentHeight: 0,
      // Convenience data for total border & padding for offset width & height calculations.
      styles: {
        additionalWidth: borderLeft + borderRight + paddingLeft + paddingRight,
        additionalHeight: borderTop + borderBottom + paddingTop + paddingBottom
      }
    };
    if (s_MAP.has(el)) {
      const subscribers = s_MAP.get(el);
      subscribers.push(data);
    } else {
      s_MAP.set(el, [data]);
    }
    s_RESIZE_OBSERVER.observe(el);
  }
  /**
   * Removes all targets from monitoring when just an element is provided otherwise removes a specific target
   * from the monitoring map. If no more targets remain then the element is removed from monitoring.
   *
   * @param {HTMLElement}          el - Element to remove from monitoring.
   *
   * @param {ResizeObserverTarget} [target] - A specific target to remove from monitoring.
   */
  static remove(el, target = void 0) {
    const subscribers = s_MAP.get(el);
    if (Array.isArray(subscribers)) {
      const index = subscribers.findIndex((entry) => entry.target === target);
      if (index >= 0) {
        s_UPDATE_SUBSCRIBER(subscribers[index], void 0, void 0);
        subscribers.splice(index, 1);
      }
      if (subscribers.length === 0) {
        s_MAP.delete(el);
        s_RESIZE_OBSERVER.unobserve(el);
      }
    }
  }
}
const s_UPDATE_TYPES = {
  none: 0,
  attribute: 1,
  function: 2,
  resizeObserved: 3,
  setContentBounds: 4,
  setDimension: 5,
  storeObject: 6,
  storesObject: 7
};
const s_RESIZE_OBSERVER = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const subscribers = s_MAP.get(entry?.target);
    if (Array.isArray(subscribers)) {
      const contentWidth = entry.contentRect.width;
      const contentHeight = entry.contentRect.height;
      for (const subscriber of subscribers) {
        s_UPDATE_SUBSCRIBER(subscriber, contentWidth, contentHeight);
      }
    }
  }
});
function s_GET_UPDATE_TYPE(target) {
  if (target?.resizeObserved instanceof Function) {
    return s_UPDATE_TYPES.resizeObserved;
  }
  if (target?.setDimension instanceof Function) {
    return s_UPDATE_TYPES.setDimension;
  }
  if (target?.setContentBounds instanceof Function) {
    return s_UPDATE_TYPES.setContentBounds;
  }
  const targetType = typeof target;
  if (targetType !== null && (targetType === "object" || targetType === "function")) {
    if (isUpdatableStore(target.resizeObserved)) {
      return s_UPDATE_TYPES.storeObject;
    }
    const stores = target?.stores;
    if (isObject(stores) || typeof stores === "function") {
      if (isUpdatableStore(stores.resizeObserved)) {
        return s_UPDATE_TYPES.storesObject;
      }
    }
  }
  if (targetType !== null && targetType === "object") {
    return s_UPDATE_TYPES.attribute;
  }
  if (targetType === "function") {
    return s_UPDATE_TYPES.function;
  }
  return s_UPDATE_TYPES.none;
}
function s_UPDATE_SUBSCRIBER(subscriber, contentWidth, contentHeight) {
  const styles = subscriber.styles;
  subscriber.contentWidth = contentWidth;
  subscriber.contentHeight = contentHeight;
  const offsetWidth = Number.isFinite(contentWidth) ? contentWidth + styles.additionalWidth : void 0;
  const offsetHeight = Number.isFinite(contentHeight) ? contentHeight + styles.additionalHeight : void 0;
  const target = subscriber.target;
  switch (subscriber.updateType) {
    case s_UPDATE_TYPES.attribute:
      target.contentWidth = contentWidth;
      target.contentHeight = contentHeight;
      target.offsetWidth = offsetWidth;
      target.offsetHeight = offsetHeight;
      break;
    case s_UPDATE_TYPES.function:
      target?.(offsetWidth, offsetHeight, contentWidth, contentHeight);
      break;
    case s_UPDATE_TYPES.resizeObserved:
      target.resizeObserved?.(offsetWidth, offsetHeight, contentWidth, contentHeight);
      break;
    case s_UPDATE_TYPES.setContentBounds:
      target.setContentBounds?.(contentWidth, contentHeight);
      break;
    case s_UPDATE_TYPES.setDimension:
      target.setDimension?.(offsetWidth, offsetHeight);
      break;
    case s_UPDATE_TYPES.storeObject:
      target.resizeObserved.update((object) => {
        object.contentHeight = contentHeight;
        object.contentWidth = contentWidth;
        object.offsetHeight = offsetHeight;
        object.offsetWidth = offsetWidth;
        return object;
      });
      break;
    case s_UPDATE_TYPES.storesObject:
      target.stores.resizeObserved.update((object) => {
        object.contentHeight = contentHeight;
        object.contentWidth = contentWidth;
        object.offsetHeight = offsetHeight;
        object.offsetWidth = offsetWidth;
        return object;
      });
      break;
  }
}
function applyStyles(node, properties) {
  function setProperties() {
    if (!isObject(properties)) {
      return;
    }
    for (const prop of Object.keys(properties)) {
      node.style.setProperty(`${prop}`, properties[prop]);
    }
  }
  setProperties();
  return {
    /**
     * @param {Record<string, string>}  newProperties - Key / value object of properties to set.
     */
    update: (newProperties) => {
      properties = newProperties;
      setProperties();
    }
  };
}
function lerp(start, end, amount) {
  return (1 - amount) * start + amount * end;
}
class TJSDefaultTransition {
  static #options = {};
  static #default = () => void 0;
  /**
   * @returns {() => undefined} Default empty transition.
   */
  static get default() {
    return this.#default;
  }
  /**
   * @returns {{}} Default empty options.
   */
  static get options() {
    return this.#options;
  }
}
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update2) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  if (!stores_array.every(Boolean)) {
    throw new Error("derived() expects stores as input, got a falsy value");
  }
  const auto = fn.length < 2;
  return readable(initial_value, (set, update2) => {
    let started = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set, update2);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map(
      (store, i2) => subscribe(
        store,
        (value) => {
          values[i2] = value;
          pending &= ~(1 << i2);
          if (started) {
            sync();
          }
        },
        () => {
          pending |= 1 << i2;
        }
      )
    );
    started = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
      started = false;
    };
  });
}
class AppShellContextInternal {
  /** @type {InternalAppStores} */
  #stores;
  constructor() {
    this.#stores = {
      elementContent: writable(void 0),
      elementRoot: writable(void 0)
    };
    Object.freeze(this.#stores);
    Object.seal(this);
  }
  /**
   * @returns {InternalAppStores} The internal context stores for elementContent / elementRoot
   */
  get stores() {
    return this.#stores;
  }
}
function isHMRProxy(comp) {
  const instanceName = comp?.constructor?.name;
  if (typeof instanceName === "string" && (instanceName.startsWith("Proxy<") || instanceName === "ProxyComponent")) {
    return true;
  }
  const prototypeName = comp?.prototype?.constructor?.name;
  return typeof prototypeName === "string" && (prototypeName.startsWith("Proxy<") || prototypeName === "ProxyComponent");
}
function isSvelteComponent(comp) {
  if (comp === null || comp === void 0 || typeof comp !== "function") {
    return false;
  }
  const prototypeName = comp?.prototype?.constructor?.name;
  if (typeof prototypeName === "string" && (prototypeName.startsWith("Proxy<") || prototypeName === "ProxyComponent")) {
    return true;
  }
  return typeof window !== "undefined" ? typeof comp.prototype.$destroy === "function" && typeof comp.prototype.$on === "function" : (
    // client-side
    typeof comp.render === "function"
  );
}
async function outroAndDestroy(instance2) {
  return new Promise((resolve) => {
    if (instance2.$$.fragment && instance2.$$.fragment.o) {
      group_outros();
      transition_out(instance2.$$.fragment, 0, 0, () => {
        instance2.$destroy();
        resolve();
      });
      check_outros();
    } else {
      instance2.$destroy();
      resolve();
    }
  });
}
function parseTJSSvelteConfig(config, thisArg = void 0) {
  if (!isObject(config)) {
    throw new TypeError(`parseSvelteConfig - 'config' is not an object:
${JSON.stringify(config)}.`);
  }
  if (!isSvelteComponent(config.class)) {
    throw new TypeError(
      `parseSvelteConfig - 'class' is not a Svelte component constructor for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.hydrate !== void 0 && typeof config.hydrate !== "boolean") {
    throw new TypeError(
      `parseSvelteConfig - 'hydrate' is not a boolean for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.intro !== void 0 && typeof config.intro !== "boolean") {
    throw new TypeError(
      `parseSvelteConfig - 'intro' is not a boolean for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.target !== void 0 && typeof config.target !== "string" && !(config.target instanceof HTMLElement) && !(config.target instanceof ShadowRoot) && !(config.target instanceof DocumentFragment)) {
    throw new TypeError(
      `parseSvelteConfig - 'target' is not a string, HTMLElement, ShadowRoot, or DocumentFragment for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.anchor !== void 0 && typeof config.anchor !== "string" && !(config.anchor instanceof HTMLElement) && !(config.anchor instanceof ShadowRoot) && !(config.anchor instanceof DocumentFragment)) {
    throw new TypeError(
      `parseSvelteConfig - 'anchor' is not a string, HTMLElement, ShadowRoot, or DocumentFragment for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.context !== void 0 && typeof config.context !== "function" && !(config.context instanceof Map) && !isObject(config.context)) {
    throw new TypeError(
      `parseSvelteConfig - 'context' is not a Map, function or object for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.selectorTarget !== void 0 && typeof config.selectorTarget !== "string") {
    throw new TypeError(
      `parseSvelteConfig - 'selectorTarget' is not a string for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.options !== void 0 && !isObject(config.options)) {
    throw new TypeError(
      `parseSvelteConfig - 'options' is not an object for config:
${JSON.stringify(config)}.`
    );
  }
  if (config.options !== void 0) {
    if (config.options.injectApp !== void 0 && typeof config.options.injectApp !== "boolean") {
      throw new TypeError(
        `parseSvelteConfig - 'options.injectApp' is not a boolean for config:
${JSON.stringify(config)}.`
      );
    }
    if (config.options.injectEventbus !== void 0 && typeof config.options.injectEventbus !== "boolean") {
      throw new TypeError(
        `parseSvelteConfig - 'options.injectEventbus' is not a boolean for config:
${JSON.stringify(config)}.`
      );
    }
    if (config.options.selectorElement !== void 0 && typeof config.options.selectorElement !== "string") {
      throw new TypeError(
        `parseSvelteConfig - 'selectorElement' is not a string for config:
${JSON.stringify(config)}.`
      );
    }
  }
  const svelteConfig = { ...config };
  delete svelteConfig.options;
  let externalContext = {};
  if (typeof svelteConfig.context === "function") {
    const contextFunc = svelteConfig.context;
    delete svelteConfig.context;
    const result = contextFunc.call(thisArg);
    if (isObject(result)) {
      externalContext = { ...result };
    } else {
      throw new Error(`parseSvelteConfig - 'context' is a function that did not return an object for config:
${JSON.stringify(config)}`);
    }
  } else if (svelteConfig.context instanceof Map) {
    externalContext = Object.fromEntries(svelteConfig.context);
    delete svelteConfig.context;
  } else if (isObject(svelteConfig.context)) {
    externalContext = svelteConfig.context;
    delete svelteConfig.context;
  }
  svelteConfig.props = s_PROCESS_PROPS(svelteConfig.props, thisArg, config);
  if (Array.isArray(svelteConfig.children)) {
    const children2 = [];
    for (let cntr = 0; cntr < svelteConfig.children.length; cntr++) {
      const child = svelteConfig.children[cntr];
      if (!isSvelteComponent(child.class)) {
        throw new Error(`parseSvelteConfig - 'class' is not a Svelte component for child[${cntr}] for config:
${JSON.stringify(config)}`);
      }
      child.props = s_PROCESS_PROPS(child.props, thisArg, config);
      children2.push(child);
    }
    if (children2.length > 0) {
      externalContext.children = children2;
    }
    delete svelteConfig.children;
  } else if (isObject(svelteConfig.children)) {
    if (!isSvelteComponent(svelteConfig.children.class)) {
      throw new Error(`parseSvelteConfig - 'class' is not a Svelte component for children object for config:
${JSON.stringify(config)}`);
    }
    svelteConfig.children.props = s_PROCESS_PROPS(svelteConfig.children.props, thisArg, config);
    externalContext.children = [svelteConfig.children];
    delete svelteConfig.children;
  }
  if (!(svelteConfig.context instanceof Map)) {
    svelteConfig.context = /* @__PURE__ */ new Map();
  }
  svelteConfig.context.set("#external", externalContext);
  return svelteConfig;
}
function s_PROCESS_PROPS(props, thisArg, config) {
  if (typeof props === "function") {
    const result = props.call(thisArg);
    if (isObject(result)) {
      return result;
    } else {
      throw new Error(`parseSvelteConfig - 'props' is a function that did not return an object for config:
${JSON.stringify(config)}`);
    }
  } else if (isObject(props)) {
    return props;
  } else if (props !== void 0) {
    throw new Error(
      `parseSvelteConfig - 'props' is not a function or an object for config:
${JSON.stringify(config)}`
    );
  }
  return {};
}
function localize(stringId, data) {
  const result = !isObject(data) ? globalThis.game.i18n.localize(stringId) : globalThis.game.i18n.format(stringId, data);
  return result !== void 0 ? result : "";
}
function writableDerived(origins, derive, reflect, initial) {
  var childDerivedSetter, originValues, blockNextDerive = false;
  var reflectOldValues = reflect.length >= 2;
  var wrappedDerive = (got, set, update3) => {
    childDerivedSetter = set;
    if (reflectOldValues) {
      originValues = got;
    }
    if (!blockNextDerive) {
      let returned = derive(got, set, update3);
      if (derive.length < 2) {
        set(returned);
      } else {
        return returned;
      }
    }
    blockNextDerive = false;
  };
  var childDerived = derived(origins, wrappedDerive, initial);
  var singleOrigin = !Array.isArray(origins);
  function doReflect(reflecting) {
    var setWith = reflect(reflecting, originValues);
    if (singleOrigin) {
      blockNextDerive = true;
      origins.set(setWith);
    } else {
      setWith.forEach((value, i2) => {
        blockNextDerive = true;
        origins[i2].set(value);
      });
    }
    blockNextDerive = false;
  }
  var tryingSet = false;
  function update2(fn) {
    var isUpdated, mutatedBySubscriptions, oldValue, newValue;
    if (tryingSet) {
      newValue = fn(get_store_value(childDerived));
      childDerivedSetter(newValue);
      return;
    }
    var unsubscribe = childDerived.subscribe((value) => {
      if (!tryingSet) {
        oldValue = value;
      } else if (!isUpdated) {
        isUpdated = true;
      } else {
        mutatedBySubscriptions = true;
      }
    });
    newValue = fn(oldValue);
    tryingSet = true;
    childDerivedSetter(newValue);
    unsubscribe();
    tryingSet = false;
    if (mutatedBySubscriptions) {
      newValue = get_store_value(childDerived);
    }
    if (isUpdated) {
      doReflect(newValue);
    }
  }
  return {
    subscribe: childDerived.subscribe,
    set(value) {
      update2(() => value);
    },
    update: update2
  };
}
function propertyStore(origin, propName) {
  if (!Array.isArray(propName)) {
    return writableDerived(
      origin,
      (object) => object[propName],
      (reflecting, object) => {
        object[propName] = reflecting;
        return object;
      }
    );
  } else {
    let props = propName.concat();
    return writableDerived(
      origin,
      (value) => {
        for (let i2 = 0; i2 < props.length; ++i2) {
          value = value[props[i2]];
        }
        return value;
      },
      (reflecting, object) => {
        let target = object;
        for (let i2 = 0; i2 < props.length - 1; ++i2) {
          target = target[props[i2]];
        }
        target[props[props.length - 1]] = reflecting;
        return object;
      }
    );
  }
}
const EPSILON = 1e-6;
const IDENTITY_4X4 = new Float32Array([
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1
]);
class Mat4 extends Float32Array {
  /**
   * The number of bytes in a {@link Mat4}.
   */
  static BYTE_LENGTH = 16 * Float32Array.BYTES_PER_ELEMENT;
  /**
   * Create a {@link Mat4}.
   */
  constructor(...values) {
    switch (values.length) {
      case 16:
        super(values);
        break;
      case 2:
        super(values[0], values[1], 16);
        break;
      case 1:
        const v2 = values[0];
        if (typeof v2 === "number") {
          super([
            v2,
            v2,
            v2,
            v2,
            v2,
            v2,
            v2,
            v2,
            v2,
            v2,
            v2,
            v2,
            v2,
            v2,
            v2,
            v2
          ]);
        } else {
          super(v2, 0, 16);
        }
        break;
      default:
        super(IDENTITY_4X4);
        break;
    }
  }
  //============
  // Attributes
  //============
  /**
   * A string representation of `this`
   * Equivalent to `Mat4.str(this);`
   */
  get str() {
    return Mat4.str(this);
  }
  //===================
  // Instance methods
  //===================
  /**
   * Copy the values from another {@link Mat4} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(a2) {
    this.set(a2);
    return this;
  }
  /**
   * Set `this` to the identity matrix
   * Equivalent to Mat4.identity(this)
   *
   * @returns `this`
   */
  identity() {
    this.set(IDENTITY_4X4);
    return this;
  }
  /**
   * Multiplies this {@link Mat4} against another one
   * Equivalent to `Mat4.multiply(this, this, b);`
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `this`
   */
  multiply(b2) {
    return Mat4.multiply(this, this, b2);
  }
  /**
   * Alias for {@link Mat4.multiply}
   */
  mul(b2) {
    return this;
  }
  /**
   * Transpose this {@link Mat4}
   * Equivalent to `Mat4.transpose(this, this);`
   *
   * @returns `this`
   */
  transpose() {
    return Mat4.transpose(this, this);
  }
  /**
   * Inverts this {@link Mat4}
   * Equivalent to `Mat4.invert(this, this);`
   *
   * @returns `this`
   */
  invert() {
    return Mat4.invert(this, this);
  }
  /**
   * Translate this {@link Mat4} by the given vector
   * Equivalent to `Mat4.translate(this, this, v);`
   *
   * @param v - The {@link Vec3} to translate by
   * @returns `this`
   */
  translate(v2) {
    return Mat4.translate(this, this, v2);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the given axis
   * Equivalent to `Mat4.rotate(this, this, rad, axis);`
   *
   * @param rad - the angle to rotate the matrix by
   * @param axis - the axis to rotate around
   * @returns `out`
   */
  rotate(rad, axis) {
    return Mat4.rotate(this, this, rad, axis);
  }
  /**
   * Scales this {@link Mat4} by the dimensions in the given vec3 not using vectorization
   * Equivalent to `Mat4.scale(this, this, v);`
   *
   * @param v - The {@link Vec3} to scale the matrix by
   * @returns `this`
   */
  scale(v2) {
    return Mat4.scale(this, this, v2);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the X axis
   * Equivalent to `Mat4.rotateX(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateX(rad) {
    return Mat4.rotateX(this, this, rad);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the Y axis
   * Equivalent to `Mat4.rotateY(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateY(rad) {
    return Mat4.rotateY(this, this, rad);
  }
  /**
   * Rotates this {@link Mat4} by the given angle around the Z axis
   * Equivalent to `Mat4.rotateZ(this, this, rad);`
   *
   * @param rad - the angle to rotate the matrix by
   * @returns `this`
   */
  rotateZ(rad) {
    return Mat4.rotateZ(this, this, rad);
  }
  /**
   * Generates a perspective projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * Equivalent to `Mat4.perspectiveNO(this, fovy, aspect, near, far);`
   *
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `this`
   */
  perspectiveNO(fovy, aspect, near, far) {
    return Mat4.perspectiveNO(this, fovy, aspect, near, far);
  }
  /**
   * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * Equivalent to `Mat4.perspectiveZO(this, fovy, aspect, near, far);`
   *
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `this`
   */
  perspectiveZO(fovy, aspect, near, far) {
    return Mat4.perspectiveZO(this, fovy, aspect, near, far);
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Equivalent to `Mat4.orthoNO(this, left, right, bottom, top, near, far);`
   *
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `this`
   */
  orthoNO(left, right, bottom, top, near, far) {
    return Mat4.orthoNO(this, left, right, bottom, top, near, far);
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Equivalent to `Mat4.orthoZO(this, left, right, bottom, top, near, far);`
   *
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `this`
   */
  orthoZO(left, right, bottom, top, near, far) {
    return Mat4.orthoZO(this, left, right, bottom, top, near, far);
  }
  //================
  // Static methods
  //================
  /**
   * Creates a new, identity {@link Mat4}
   * @category Static
   *
   * @returns A new {@link Mat4}
   */
  static create() {
    return new Mat4();
  }
  /**
   * Creates a new {@link Mat4} initialized with values from an existing matrix
   * @category Static
   *
   * @param a - Matrix to clone
   * @returns A new {@link Mat4}
   */
  static clone(a2) {
    return new Mat4(a2);
  }
  /**
   * Copy the values from one {@link Mat4} to another
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - Matrix to copy
   * @returns `out`
   */
  static copy(out, a2) {
    out[0] = a2[0];
    out[1] = a2[1];
    out[2] = a2[2];
    out[3] = a2[3];
    out[4] = a2[4];
    out[5] = a2[5];
    out[6] = a2[6];
    out[7] = a2[7];
    out[8] = a2[8];
    out[9] = a2[9];
    out[10] = a2[10];
    out[11] = a2[11];
    out[12] = a2[12];
    out[13] = a2[13];
    out[14] = a2[14];
    out[15] = a2[15];
    return out;
  }
  /**
   * Create a new mat4 with the given values
   * @category Static
   *
   * @param values - Matrix components
   * @returns A new {@link Mat4}
   */
  static fromValues(...values) {
    return new Mat4(...values);
  }
  /**
   * Set the components of a mat4 to the given values
   * @category Static
   *
   * @param out - The receiving matrix
   * @param values - Matrix components
   * @returns `out`
   */
  static set(out, ...values) {
    out[0] = values[0];
    out[1] = values[1];
    out[2] = values[2];
    out[3] = values[3];
    out[4] = values[4];
    out[5] = values[5];
    out[6] = values[6];
    out[7] = values[7];
    out[8] = values[8];
    out[9] = values[9];
    out[10] = values[10];
    out[11] = values[11];
    out[12] = values[12];
    out[13] = values[13];
    out[14] = values[14];
    out[15] = values[15];
    return out;
  }
  /**
   * Set a {@link Mat4} to the identity matrix
   * @category Static
   *
   * @param out - The receiving Matrix
   * @returns `out`
   */
  static identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Transpose the values of a {@link Mat4}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static transpose(out, a2) {
    if (out === a2) {
      const a01 = a2[1], a02 = a2[2], a03 = a2[3];
      const a12 = a2[6], a13 = a2[7];
      const a23 = a2[11];
      out[1] = a2[4];
      out[2] = a2[8];
      out[3] = a2[12];
      out[4] = a01;
      out[6] = a2[9];
      out[7] = a2[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a2[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a2[0];
      out[1] = a2[4];
      out[2] = a2[8];
      out[3] = a2[12];
      out[4] = a2[1];
      out[5] = a2[5];
      out[6] = a2[9];
      out[7] = a2[13];
      out[8] = a2[2];
      out[9] = a2[6];
      out[10] = a2[10];
      out[11] = a2[14];
      out[12] = a2[3];
      out[13] = a2[7];
      out[14] = a2[11];
      out[15] = a2[15];
    }
    return out;
  }
  /**
   * Inverts a {@link Mat4}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static invert(out, a2) {
    const a00 = a2[0], a01 = a2[1], a02 = a2[2], a03 = a2[3];
    const a10 = a2[4], a11 = a2[5], a12 = a2[6], a13 = a2[7];
    const a20 = a2[8], a21 = a2[9], a22 = a2[10], a23 = a2[11];
    const a30 = a2[12], a31 = a2[13], a32 = a2[14], a33 = a2[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  /**
   * Calculates the adjugate of a {@link Mat4}
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the source matrix
   * @returns `out`
   */
  static adjoint(out, a2) {
    const a00 = a2[0], a01 = a2[1], a02 = a2[2], a03 = a2[3];
    const a10 = a2[4], a11 = a2[5], a12 = a2[6], a13 = a2[7];
    const a20 = a2[8], a21 = a2[9], a22 = a2[10], a23 = a2[11];
    const a30 = a2[12], a31 = a2[13], a32 = a2[14], a33 = a2[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    out[0] = a11 * b11 - a12 * b10 + a13 * b09;
    out[1] = a02 * b10 - a01 * b11 - a03 * b09;
    out[2] = a31 * b05 - a32 * b04 + a33 * b03;
    out[3] = a22 * b04 - a21 * b05 - a23 * b03;
    out[4] = a12 * b08 - a10 * b11 - a13 * b07;
    out[5] = a00 * b11 - a02 * b08 + a03 * b07;
    out[6] = a32 * b02 - a30 * b05 - a33 * b01;
    out[7] = a20 * b05 - a22 * b02 + a23 * b01;
    out[8] = a10 * b10 - a11 * b08 + a13 * b06;
    out[9] = a01 * b08 - a00 * b10 - a03 * b06;
    out[10] = a30 * b04 - a31 * b02 + a33 * b00;
    out[11] = a21 * b02 - a20 * b04 - a23 * b00;
    out[12] = a11 * b07 - a10 * b09 - a12 * b06;
    out[13] = a00 * b09 - a01 * b07 + a02 * b06;
    out[14] = a31 * b01 - a30 * b03 - a32 * b00;
    out[15] = a20 * b03 - a21 * b01 + a22 * b00;
    return out;
  }
  /**
   * Calculates the determinant of a {@link Mat4}
   * @category Static
   *
   * @param a - the source matrix
   * @returns determinant of a
   */
  static determinant(a2) {
    const a00 = a2[0], a01 = a2[1], a02 = a2[2], a03 = a2[3];
    const a10 = a2[4], a11 = a2[5], a12 = a2[6], a13 = a2[7];
    const a20 = a2[8], a21 = a2[9], a22 = a2[10], a23 = a2[11];
    const a30 = a2[12], a31 = a2[13], a32 = a2[14], a33 = a2[15];
    const b0 = a00 * a11 - a01 * a10;
    const b1 = a00 * a12 - a02 * a10;
    const b2 = a01 * a12 - a02 * a11;
    const b3 = a20 * a31 - a21 * a30;
    const b4 = a20 * a32 - a22 * a30;
    const b5 = a21 * a32 - a22 * a31;
    const b6 = a00 * b5 - a01 * b4 + a02 * b3;
    const b7 = a10 * b5 - a11 * b4 + a12 * b3;
    const b8 = a20 * b2 - a21 * b1 + a22 * b0;
    const b9 = a30 * b2 - a31 * b1 + a32 * b0;
    return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
  }
  /**
   * Multiplies two {@link Mat4}s
   * @category Static
   *
   * @param out - The receiving Matrix
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static multiply(out, a2, b2) {
    const a00 = a2[0];
    const a01 = a2[1];
    const a02 = a2[2];
    const a03 = a2[3];
    const a10 = a2[4];
    const a11 = a2[5];
    const a12 = a2[6];
    const a13 = a2[7];
    const a20 = a2[8];
    const a21 = a2[9];
    const a22 = a2[10];
    const a23 = a2[11];
    const a30 = a2[12];
    const a31 = a2[13];
    const a32 = a2[14];
    const a33 = a2[15];
    let b0 = b2[0];
    let b1 = b2[1];
    let b22 = b2[2];
    let b3 = b2[3];
    out[0] = b0 * a00 + b1 * a10 + b22 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b22 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b22 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b22 * a23 + b3 * a33;
    b0 = b2[4];
    b1 = b2[5];
    b22 = b2[6];
    b3 = b2[7];
    out[4] = b0 * a00 + b1 * a10 + b22 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b22 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b22 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b22 * a23 + b3 * a33;
    b0 = b2[8];
    b1 = b2[9];
    b22 = b2[10];
    b3 = b2[11];
    out[8] = b0 * a00 + b1 * a10 + b22 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b22 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b22 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b22 * a23 + b3 * a33;
    b0 = b2[12];
    b1 = b2[13];
    b22 = b2[14];
    b3 = b2[15];
    out[12] = b0 * a00 + b1 * a10 + b22 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b22 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b22 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b22 * a23 + b3 * a33;
    return out;
  }
  /**
   * Alias for {@link Mat4.multiply}
   * @category Static
   */
  static mul(out, a2, b2) {
    return out;
  }
  /**
   * Translate a {@link Mat4} by the given vector
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to translate
   * @param v - vector to translate by
   * @returns `out`
   */
  static translate(out, a2, v2) {
    const x2 = v2[0];
    const y2 = v2[1];
    const z2 = v2[2];
    if (a2 === out) {
      out[12] = a2[0] * x2 + a2[4] * y2 + a2[8] * z2 + a2[12];
      out[13] = a2[1] * x2 + a2[5] * y2 + a2[9] * z2 + a2[13];
      out[14] = a2[2] * x2 + a2[6] * y2 + a2[10] * z2 + a2[14];
      out[15] = a2[3] * x2 + a2[7] * y2 + a2[11] * z2 + a2[15];
    } else {
      const a00 = a2[0];
      const a01 = a2[1];
      const a02 = a2[2];
      const a03 = a2[3];
      const a10 = a2[4];
      const a11 = a2[5];
      const a12 = a2[6];
      const a13 = a2[7];
      const a20 = a2[8];
      const a21 = a2[9];
      const a22 = a2[10];
      const a23 = a2[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x2 + a10 * y2 + a20 * z2 + a2[12];
      out[13] = a01 * x2 + a11 * y2 + a21 * z2 + a2[13];
      out[14] = a02 * x2 + a12 * y2 + a22 * z2 + a2[14];
      out[15] = a03 * x2 + a13 * y2 + a23 * z2 + a2[15];
    }
    return out;
  }
  /**
   * Scales the {@link Mat4} by the dimensions in the given {@link Vec3} not using vectorization
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param v - the {@link Vec3} to scale the matrix by
   * @returns `out`
   **/
  static scale(out, a2, v2) {
    const x2 = v2[0];
    const y2 = v2[1];
    const z2 = v2[2];
    out[0] = a2[0] * x2;
    out[1] = a2[1] * x2;
    out[2] = a2[2] * x2;
    out[3] = a2[3] * x2;
    out[4] = a2[4] * y2;
    out[5] = a2[5] * y2;
    out[6] = a2[6] * y2;
    out[7] = a2[7] * y2;
    out[8] = a2[8] * z2;
    out[9] = a2[9] * z2;
    out[10] = a2[10] * z2;
    out[11] = a2[11] * z2;
    out[12] = a2[12];
    out[13] = a2[13];
    out[14] = a2[14];
    out[15] = a2[15];
    return out;
  }
  /**
   * Rotates a {@link Mat4} by the given angle around the given axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @param axis - the axis to rotate around
   * @returns `out`
   */
  static rotate(out, a2, rad, axis) {
    let x2 = axis[0];
    let y2 = axis[1];
    let z2 = axis[2];
    let len = Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
    if (len < EPSILON) {
      return null;
    }
    len = 1 / len;
    x2 *= len;
    y2 *= len;
    z2 *= len;
    const s2 = Math.sin(rad);
    const c2 = Math.cos(rad);
    const t2 = 1 - c2;
    const a00 = a2[0];
    const a01 = a2[1];
    const a02 = a2[2];
    const a03 = a2[3];
    const a10 = a2[4];
    const a11 = a2[5];
    const a12 = a2[6];
    const a13 = a2[7];
    const a20 = a2[8];
    const a21 = a2[9];
    const a22 = a2[10];
    const a23 = a2[11];
    const b00 = x2 * x2 * t2 + c2;
    const b01 = y2 * x2 * t2 + z2 * s2;
    const b02 = z2 * x2 * t2 - y2 * s2;
    const b10 = x2 * y2 * t2 - z2 * s2;
    const b11 = y2 * y2 * t2 + c2;
    const b12 = z2 * y2 * t2 + x2 * s2;
    const b20 = x2 * z2 * t2 + y2 * s2;
    const b21 = y2 * z2 * t2 - x2 * s2;
    const b22 = z2 * z2 * t2 + c2;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a2 !== out) {
      out[12] = a2[12];
      out[13] = a2[13];
      out[14] = a2[14];
      out[15] = a2[15];
    }
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the X axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotateX(out, a2, rad) {
    let s2 = Math.sin(rad);
    let c2 = Math.cos(rad);
    let a10 = a2[4];
    let a11 = a2[5];
    let a12 = a2[6];
    let a13 = a2[7];
    let a20 = a2[8];
    let a21 = a2[9];
    let a22 = a2[10];
    let a23 = a2[11];
    if (a2 !== out) {
      out[0] = a2[0];
      out[1] = a2[1];
      out[2] = a2[2];
      out[3] = a2[3];
      out[12] = a2[12];
      out[13] = a2[13];
      out[14] = a2[14];
      out[15] = a2[15];
    }
    out[4] = a10 * c2 + a20 * s2;
    out[5] = a11 * c2 + a21 * s2;
    out[6] = a12 * c2 + a22 * s2;
    out[7] = a13 * c2 + a23 * s2;
    out[8] = a20 * c2 - a10 * s2;
    out[9] = a21 * c2 - a11 * s2;
    out[10] = a22 * c2 - a12 * s2;
    out[11] = a23 * c2 - a13 * s2;
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the Y axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotateY(out, a2, rad) {
    let s2 = Math.sin(rad);
    let c2 = Math.cos(rad);
    let a00 = a2[0];
    let a01 = a2[1];
    let a02 = a2[2];
    let a03 = a2[3];
    let a20 = a2[8];
    let a21 = a2[9];
    let a22 = a2[10];
    let a23 = a2[11];
    if (a2 !== out) {
      out[4] = a2[4];
      out[5] = a2[5];
      out[6] = a2[6];
      out[7] = a2[7];
      out[12] = a2[12];
      out[13] = a2[13];
      out[14] = a2[14];
      out[15] = a2[15];
    }
    out[0] = a00 * c2 - a20 * s2;
    out[1] = a01 * c2 - a21 * s2;
    out[2] = a02 * c2 - a22 * s2;
    out[3] = a03 * c2 - a23 * s2;
    out[8] = a00 * s2 + a20 * c2;
    out[9] = a01 * s2 + a21 * c2;
    out[10] = a02 * s2 + a22 * c2;
    out[11] = a03 * s2 + a23 * c2;
    return out;
  }
  /**
   * Rotates a matrix by the given angle around the Z axis
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to rotate
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static rotateZ(out, a2, rad) {
    let s2 = Math.sin(rad);
    let c2 = Math.cos(rad);
    let a00 = a2[0];
    let a01 = a2[1];
    let a02 = a2[2];
    let a03 = a2[3];
    let a10 = a2[4];
    let a11 = a2[5];
    let a12 = a2[6];
    let a13 = a2[7];
    if (a2 !== out) {
      out[8] = a2[8];
      out[9] = a2[9];
      out[10] = a2[10];
      out[11] = a2[11];
      out[12] = a2[12];
      out[13] = a2[13];
      out[14] = a2[14];
      out[15] = a2[15];
    }
    out[0] = a00 * c2 + a10 * s2;
    out[1] = a01 * c2 + a11 * s2;
    out[2] = a02 * c2 + a12 * s2;
    out[3] = a03 * c2 + a13 * s2;
    out[4] = a10 * c2 - a00 * s2;
    out[5] = a11 * c2 - a01 * s2;
    out[6] = a12 * c2 - a02 * s2;
    out[7] = a13 * c2 - a03 * s2;
    return out;
  }
  /**
   * Creates a {@link Mat4} from a vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, dest, vec);
   * @category Static
   *
   * @param out - {@link Mat4} receiving operation result
   * @param v - Translation vector
   * @returns `out`
   */
  static fromTranslation(out, v2) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v2[0];
    out[13] = v2[1];
    out[14] = v2[2];
    out[15] = 1;
    return out;
  }
  /**
   * Creates a {@link Mat4} from a vector scaling
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.scale(dest, dest, vec);
   * @category Static
   *
   * @param out - {@link Mat4} receiving operation result
   * @param v - Scaling vector
   * @returns `out`
   */
  static fromScaling(out, v2) {
    out[0] = v2[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v2[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v2[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a {@link Mat4} from a given angle around a given axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotate(dest, dest, rad, axis);
   * @category Static
   *
   * @param out - {@link Mat4} receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @param axis - the axis to rotate around
   * @returns `out`
   */
  static fromRotation(out, rad, axis) {
    let x2 = axis[0];
    let y2 = axis[1];
    let z2 = axis[2];
    let len = Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
    if (len < EPSILON) {
      return null;
    }
    len = 1 / len;
    x2 *= len;
    y2 *= len;
    z2 *= len;
    const s2 = Math.sin(rad);
    const c2 = Math.cos(rad);
    const t2 = 1 - c2;
    out[0] = x2 * x2 * t2 + c2;
    out[1] = y2 * x2 * t2 + z2 * s2;
    out[2] = z2 * x2 * t2 - y2 * s2;
    out[3] = 0;
    out[4] = x2 * y2 * t2 - z2 * s2;
    out[5] = y2 * y2 * t2 + c2;
    out[6] = z2 * y2 * t2 + x2 * s2;
    out[7] = 0;
    out[8] = x2 * z2 * t2 + y2 * s2;
    out[9] = y2 * z2 * t2 - x2 * s2;
    out[10] = z2 * z2 * t2 + c2;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the X axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateX(dest, dest, rad);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromXRotation(out, rad) {
    let s2 = Math.sin(rad);
    let c2 = Math.cos(rad);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c2;
    out[6] = s2;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s2;
    out[10] = c2;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the Y axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateY(dest, dest, rad);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromYRotation(out, rad) {
    let s2 = Math.sin(rad);
    let c2 = Math.cos(rad);
    out[0] = c2;
    out[1] = 0;
    out[2] = -s2;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s2;
    out[9] = 0;
    out[10] = c2;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from the given angle around the Z axis
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.rotateZ(dest, dest, rad);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param rad - the angle to rotate the matrix by
   * @returns `out`
   */
  static fromZRotation(out, rad) {
    const s2 = Math.sin(rad);
    const c2 = Math.cos(rad);
    out[0] = c2;
    out[1] = s2;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s2;
    out[5] = c2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from a quaternion rotation and vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Rotation quaternion
   * @param v - Translation vector
   * @returns `out`
   */
  static fromRotationTranslation(out, q2, v2) {
    const x2 = q2[0];
    const y2 = q2[1];
    const z2 = q2[2];
    const w2 = q2[3];
    const x22 = x2 + x2;
    const y22 = y2 + y2;
    const z22 = z2 + z2;
    const xx = x2 * x22;
    const xy = x2 * y22;
    const xz = x2 * z22;
    const yy = y2 * y22;
    const yz = y2 * z22;
    const zz = z2 * z22;
    const wx = w2 * x22;
    const wy = w2 * y22;
    const wz = w2 * z22;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v2[0];
    out[13] = v2[1];
    out[14] = v2[2];
    out[15] = 1;
    return out;
  }
  /**
   * Sets a {@link Mat4} from a {@link Quat2}.
   * @category Static
   *
   * @param out - Matrix
   * @param a - Dual Quaternion
   * @returns `out`
   */
  static fromQuat2(out, a2) {
    let translation = [0, 0, 0];
    const bx = -a2[0];
    const by = -a2[1];
    const bz = -a2[2];
    const bw = a2[3];
    const ax = a2[4];
    const ay = a2[5];
    const az = a2[6];
    const aw = a2[7];
    let magnitude = bx * bx + by * by + bz * bz + bw * bw;
    if (magnitude > 0) {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
    } else {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }
    Mat4.fromRotationTranslation(out, a2, translation);
    return out;
  }
  /**
   * Returns the translation vector component of a transformation
   * matrix. If a matrix is built with fromRotationTranslation,
   * the returned vector will be the same as the translation vector
   * originally supplied.
   * @category Static
   *
   * @param  {vec3} out Vector to receive translation component
   * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */
  static getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
  }
  /**
   * Returns the scaling factor component of a transformation
   * matrix. If a matrix is built with fromRotationTranslationScale
   * with a normalized Quaternion paramter, the returned vector will be
   * the same as the scaling vector
   * originally supplied.
   * @category Static
   *
   * @param  {vec3} out Vector to receive scaling factor component
   * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
   * @return {vec3} out
   */
  static getScaling(out, mat) {
    const m11 = mat[0];
    const m12 = mat[1];
    const m13 = mat[2];
    const m21 = mat[4];
    const m22 = mat[5];
    const m23 = mat[6];
    const m31 = mat[8];
    const m32 = mat[9];
    const m33 = mat[10];
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
  }
  /**
   * Returns a quaternion representing the rotational component
   * of a transformation matrix. If a matrix is built with
   * fromRotationTranslation, the returned quaternion will be the
   * same as the quaternion originally supplied.
   * @category Static
   *
   * @param out - Quaternion to receive the rotation component
   * @param mat - Matrix to be decomposed (input)
   * @return `out`
   */
  static getRotation(out, mat) {
    Mat4.getScaling(tmpVec3$1, mat);
    const is1 = 1 / tmpVec3$1[0];
    const is2 = 1 / tmpVec3$1[1];
    const is3 = 1 / tmpVec3$1[2];
    const sm11 = mat[0] * is1;
    const sm12 = mat[1] * is2;
    const sm13 = mat[2] * is3;
    const sm21 = mat[4] * is1;
    const sm22 = mat[5] * is2;
    const sm23 = mat[6] * is3;
    const sm31 = mat[8] * is1;
    const sm32 = mat[9] * is2;
    const sm33 = mat[10] * is3;
    const trace = sm11 + sm22 + sm33;
    let S2 = 0;
    if (trace > 0) {
      S2 = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S2;
      out[0] = (sm23 - sm32) / S2;
      out[1] = (sm31 - sm13) / S2;
      out[2] = (sm12 - sm21) / S2;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S2 = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S2;
      out[0] = 0.25 * S2;
      out[1] = (sm12 + sm21) / S2;
      out[2] = (sm31 + sm13) / S2;
    } else if (sm22 > sm33) {
      S2 = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S2;
      out[0] = (sm12 + sm21) / S2;
      out[1] = 0.25 * S2;
      out[2] = (sm23 + sm32) / S2;
    } else {
      S2 = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S2;
      out[0] = (sm31 + sm13) / S2;
      out[1] = (sm23 + sm32) / S2;
      out[2] = 0.25 * S2;
    }
    return out;
  }
  /**
   * Decomposes a transformation matrix into its rotation, translation
   * and scale components. Returns only the rotation component
   * @category Static
   *
   * @param out_r - Quaternion to receive the rotation component
   * @param out_t - Vector to receive the translation vector
   * @param out_s - Vector to receive the scaling factor
   * @param mat - Matrix to be decomposed (input)
   * @returns `out_r`
   */
  static decompose(out_r, out_t, out_s, mat) {
    out_t[0] = mat[12];
    out_t[1] = mat[13];
    out_t[2] = mat[14];
    const m11 = mat[0];
    const m12 = mat[1];
    const m13 = mat[2];
    const m21 = mat[4];
    const m22 = mat[5];
    const m23 = mat[6];
    const m31 = mat[8];
    const m32 = mat[9];
    const m33 = mat[10];
    out_s[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out_s[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out_s[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    const is1 = 1 / out_s[0];
    const is2 = 1 / out_s[1];
    const is3 = 1 / out_s[2];
    const sm11 = m11 * is1;
    const sm12 = m12 * is2;
    const sm13 = m13 * is3;
    const sm21 = m21 * is1;
    const sm22 = m22 * is2;
    const sm23 = m23 * is3;
    const sm31 = m31 * is1;
    const sm32 = m32 * is2;
    const sm33 = m33 * is3;
    const trace = sm11 + sm22 + sm33;
    let S2 = 0;
    if (trace > 0) {
      S2 = Math.sqrt(trace + 1) * 2;
      out_r[3] = 0.25 * S2;
      out_r[0] = (sm23 - sm32) / S2;
      out_r[1] = (sm31 - sm13) / S2;
      out_r[2] = (sm12 - sm21) / S2;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S2 = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out_r[3] = (sm23 - sm32) / S2;
      out_r[0] = 0.25 * S2;
      out_r[1] = (sm12 + sm21) / S2;
      out_r[2] = (sm31 + sm13) / S2;
    } else if (sm22 > sm33) {
      S2 = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out_r[3] = (sm31 - sm13) / S2;
      out_r[0] = (sm12 + sm21) / S2;
      out_r[1] = 0.25 * S2;
      out_r[2] = (sm23 + sm32) / S2;
    } else {
      S2 = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out_r[3] = (sm12 - sm21) / S2;
      out_r[0] = (sm31 + sm13) / S2;
      out_r[1] = (sm23 + sm32) / S2;
      out_r[2] = 0.25 * S2;
    }
    return out_r;
  }
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Rotation quaternion
   * @param v - Translation vector
   * @param s - Scaling vector
   * @returns `out`
   */
  static fromRotationTranslationScale(out, q2, v2, s2) {
    const x2 = q2[0];
    const y2 = q2[1];
    const z2 = q2[2];
    const w2 = q2[3];
    const x22 = x2 + x2;
    const y22 = y2 + y2;
    const z22 = z2 + z2;
    const xx = x2 * x22;
    const xy = x2 * y22;
    const xz = x2 * z22;
    const yy = y2 * y22;
    const yz = y2 * z22;
    const zz = z2 * z22;
    const wx = w2 * x22;
    const wy = w2 * y22;
    const wz = w2 * z22;
    const sx = s2[0];
    const sy = s2[1];
    const sz = s2[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v2[0];
    out[13] = v2[1];
    out[14] = v2[2];
    out[15] = 1;
    return out;
  }
  /**
   * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     mat4.translate(dest, origin);
   *     let quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *     mat4.scale(dest, scale)
   *     mat4.translate(dest, negativeOrigin);
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Rotation quaternion
   * @param v - Translation vector
   * @param s - Scaling vector
   * @param o - The origin vector around which to scale and rotate
   * @returns `out`
   */
  static fromRotationTranslationScaleOrigin(out, q2, v2, s2, o2) {
    const x2 = q2[0];
    const y2 = q2[1];
    const z2 = q2[2];
    const w2 = q2[3];
    const x22 = x2 + x2;
    const y22 = y2 + y2;
    const z22 = z2 + z2;
    const xx = x2 * x22;
    const xy = x2 * y22;
    const xz = x2 * z22;
    const yy = y2 * y22;
    const yz = y2 * z22;
    const zz = z2 * z22;
    const wx = w2 * x22;
    const wy = w2 * y22;
    const wz = w2 * z22;
    const sx = s2[0];
    const sy = s2[1];
    const sz = s2[2];
    const ox = o2[0];
    const oy = o2[1];
    const oz = o2[2];
    const out0 = (1 - (yy + zz)) * sx;
    const out1 = (xy + wz) * sx;
    const out2 = (xz - wy) * sx;
    const out4 = (xy - wz) * sy;
    const out5 = (1 - (xx + zz)) * sy;
    const out6 = (yz + wx) * sy;
    const out8 = (xz + wy) * sz;
    const out9 = (yz - wx) * sz;
    const out10 = (1 - (xx + yy)) * sz;
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v2[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v2[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v2[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
  }
  /**
   * Calculates a 4x4 matrix from the given quaternion
   * @category Static
   *
   * @param out - mat4 receiving operation result
   * @param q - Quaternion to create matrix from
   * @returns `out`
   */
  static fromQuat(out, q2) {
    const x2 = q2[0];
    const y2 = q2[1];
    const z2 = q2[2];
    const w2 = q2[3];
    const x22 = x2 + x2;
    const y22 = y2 + y2;
    const z22 = z2 + z2;
    const xx = x2 * x22;
    const yx = y2 * x22;
    const yy = y2 * y22;
    const zx = z2 * x22;
    const zy = z2 * y22;
    const zz = z2 * z22;
    const wx = w2 * x22;
    const wy = w2 * y22;
    const wz = w2 * z22;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  /**
   * Generates a frustum matrix with the given bounds
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `out`
   */
  static frustum(out, left, right, bottom, top, near, far) {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    const nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
  }
  /**
   * Generates a perspective projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static perspectiveNO(out, fovy, aspect, near, far) {
    const f2 = 1 / Math.tan(fovy / 2);
    out[0] = f2 / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
  /**
   * Alias for {@link Mat4.perspectiveNO}
   * @category Static
   * @deprecated Use {@link Mat4.perspectiveNO} or {@link Mat4.perspectiveZO} explicitly
   */
  static perspective(out, fovy, aspect, near, far) {
    return out;
  }
  /**
   * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param fovy - Vertical field of view in radians
   * @param aspect - Aspect ratio. typically viewport width/height
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum, can be null or Infinity
   * @returns `out`
   */
  static perspectiveZO(out, fovy, aspect, near, far) {
    const f2 = 1 / Math.tan(fovy / 2);
    out[0] = f2 / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = far * nf;
      out[14] = far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -near;
    }
    return out;
  }
  /**
   * Generates a perspective projection matrix with the given field of view.
   * This is primarily useful for generating projection matrices to be used
   * with the still experiemental WebVR API.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param fov - Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `out`
   * @deprecated
   */
  static perspectiveFromFieldOfView(out, fov, near, far) {
    const upTan = Math.tan(fov.upDegrees * Math.PI / 180);
    const downTan = Math.tan(fov.downDegrees * Math.PI / 180);
    const leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
    const rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
    const xScale = 2 / (leftTan + rightTan);
    const yScale = 2 / (upTan + downTan);
    out[0] = xScale;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = yScale;
    out[6] = 0;
    out[7] = 0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near / (near - far);
    out[15] = 0;
    return out;
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
   * which matches WebGL/OpenGL's clip volume.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `out`
   */
  static orthoNO(out, left, right, bottom, top, near, far) {
    const lr = 1 / (left - right);
    const bt2 = 1 / (bottom - top);
    const nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt2;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  /**
   * Alias for {@link Mat4.orthoNO}
   * @category Static
   * @deprecated Use {@link Mat4.orthoNO} or {@link Mat4.orthoZO} explicitly
   */
  static ortho(out, left, right, bottom, top, near, far) {
    return out;
  }
  /**
   * Generates a orthogonal projection matrix with the given bounds.
   * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
   * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param left - Left bound of the frustum
   * @param right - Right bound of the frustum
   * @param bottom - Bottom bound of the frustum
   * @param top - Top bound of the frustum
   * @param near - Near bound of the frustum
   * @param far - Far bound of the frustum
   * @returns `out`
   */
  static orthoZO(out, left, right, bottom, top, near, far) {
    const lr = 1 / (left - right);
    const bt2 = 1 / (bottom - top);
    const nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt2;
    out[14] = near * nf;
    out[15] = 1;
    return out;
  }
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis.
   * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param eye - Position of the viewer
   * @param center - Point the viewer is looking at
   * @param up - vec3 pointing up
   * @returns `out`
   */
  static lookAt(out, eye, center, up) {
    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];
    const centerx = center[0];
    const centery = center[1];
    const centerz = center[2];
    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return Mat4.identity(out);
    }
    let z0 = eyex - centerx;
    let z1 = eyey - centery;
    let z2 = eyez - centerz;
    let len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    let x0 = upy * z2 - upz * z1;
    let x1 = upz * z0 - upx * z2;
    let x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    let y0 = z1 * x2 - z2 * x1;
    let y1 = z2 * x0 - z0 * x2;
    let y2 = z0 * x1 - z1 * x0;
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }
  /**
   * Generates a matrix that makes something look at something else.
   * @category Static
   *
   * @param out - mat4 frustum matrix will be written into
   * @param eye - Position of the viewer
   * @param target - Point the viewer is looking at
   * @param up - vec3 pointing up
   * @returns `out`
   */
  static targetTo(out, eye, target, up) {
    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];
    let z0 = eyex - target[0];
    let z1 = eyey - target[1];
    let z2 = eyez - target[2];
    let len = z0 * z0 + z1 * z1 + z2 * z2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      z0 *= len;
      z1 *= len;
      z2 *= len;
    }
    let x0 = upy * z2 - upz * z1;
    let x1 = upz * z0 - upx * z2;
    let x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
  }
  /**
   * Returns Frobenius norm of a {@link Mat4}
   * @category Static
   *
   * @param a - the matrix to calculate Frobenius norm of
   * @returns Frobenius norm
   */
  static frob(a2) {
    return Math.sqrt(a2[0] * a2[0] + a2[1] * a2[1] + a2[2] * a2[2] + a2[3] * a2[3] + a2[4] * a2[4] + a2[5] * a2[5] + a2[6] * a2[6] + a2[7] * a2[7] + a2[8] * a2[8] + a2[9] * a2[9] + a2[10] * a2[10] + a2[11] * a2[11] + a2[12] * a2[12] + a2[13] * a2[13] + a2[14] * a2[14] + a2[15] * a2[15]);
  }
  /**
   * Adds two {@link Mat4}'s
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static add(out, a2, b2) {
    out[0] = a2[0] + b2[0];
    out[1] = a2[1] + b2[1];
    out[2] = a2[2] + b2[2];
    out[3] = a2[3] + b2[3];
    out[4] = a2[4] + b2[4];
    out[5] = a2[5] + b2[5];
    out[6] = a2[6] + b2[6];
    out[7] = a2[7] + b2[7];
    out[8] = a2[8] + b2[8];
    out[9] = a2[9] + b2[9];
    out[10] = a2[10] + b2[10];
    out[11] = a2[11] + b2[11];
    out[12] = a2[12] + b2[12];
    out[13] = a2[13] + b2[13];
    out[14] = a2[14] + b2[14];
    out[15] = a2[15] + b2[15];
    return out;
  }
  /**
   * Subtracts matrix b from matrix a
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(out, a2, b2) {
    out[0] = a2[0] - b2[0];
    out[1] = a2[1] - b2[1];
    out[2] = a2[2] - b2[2];
    out[3] = a2[3] - b2[3];
    out[4] = a2[4] - b2[4];
    out[5] = a2[5] - b2[5];
    out[6] = a2[6] - b2[6];
    out[7] = a2[7] - b2[7];
    out[8] = a2[8] - b2[8];
    out[9] = a2[9] - b2[9];
    out[10] = a2[10] - b2[10];
    out[11] = a2[11] - b2[11];
    out[12] = a2[12] - b2[12];
    out[13] = a2[13] - b2[13];
    out[14] = a2[14] - b2[14];
    out[15] = a2[15] - b2[15];
    return out;
  }
  /**
   * Alias for {@link Mat4.subtract}
   * @category Static
   */
  static sub(out, a2, b2) {
    return out;
  }
  /**
   * Multiply each element of the matrix by a scalar.
   * @category Static
   *
   * @param out - the receiving matrix
   * @param a - the matrix to scale
   * @param b - amount to scale the matrix's elements by
   * @returns `out`
   */
  static multiplyScalar(out, a2, b2) {
    out[0] = a2[0] * b2;
    out[1] = a2[1] * b2;
    out[2] = a2[2] * b2;
    out[3] = a2[3] * b2;
    out[4] = a2[4] * b2;
    out[5] = a2[5] * b2;
    out[6] = a2[6] * b2;
    out[7] = a2[7] * b2;
    out[8] = a2[8] * b2;
    out[9] = a2[9] * b2;
    out[10] = a2[10] * b2;
    out[11] = a2[11] * b2;
    out[12] = a2[12] * b2;
    out[13] = a2[13] * b2;
    out[14] = a2[14] * b2;
    out[15] = a2[15] * b2;
    return out;
  }
  /**
   * Adds two mat4's after multiplying each element of the second operand by a scalar value.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b's elements by before adding
   * @returns `out`
   */
  static multiplyScalarAndAdd(out, a2, b2, scale) {
    out[0] = a2[0] + b2[0] * scale;
    out[1] = a2[1] + b2[1] * scale;
    out[2] = a2[2] + b2[2] * scale;
    out[3] = a2[3] + b2[3] * scale;
    out[4] = a2[4] + b2[4] * scale;
    out[5] = a2[5] + b2[5] * scale;
    out[6] = a2[6] + b2[6] * scale;
    out[7] = a2[7] + b2[7] * scale;
    out[8] = a2[8] + b2[8] * scale;
    out[9] = a2[9] + b2[9] * scale;
    out[10] = a2[10] + b2[10] * scale;
    out[11] = a2[11] + b2[11] * scale;
    out[12] = a2[12] + b2[12] * scale;
    out[13] = a2[13] + b2[13] * scale;
    out[14] = a2[14] + b2[14] * scale;
    out[15] = a2[15] + b2[15] * scale;
    return out;
  }
  /**
   * Returns whether or not two {@link Mat4}s have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static exactEquals(a2, b2) {
    return a2[0] === b2[0] && a2[1] === b2[1] && a2[2] === b2[2] && a2[3] === b2[3] && a2[4] === b2[4] && a2[5] === b2[5] && a2[6] === b2[6] && a2[7] === b2[7] && a2[8] === b2[8] && a2[9] === b2[9] && a2[10] === b2[10] && a2[11] === b2[11] && a2[12] === b2[12] && a2[13] === b2[13] && a2[14] === b2[14] && a2[15] === b2[15];
  }
  /**
   * Returns whether or not two {@link Mat4}s have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first matrix.
   * @param b - The second matrix.
   * @returns True if the matrices are equal, false otherwise.
   */
  static equals(a2, b2) {
    const a0 = a2[0];
    const a1 = a2[1];
    const a22 = a2[2];
    const a3 = a2[3];
    const a4 = a2[4];
    const a5 = a2[5];
    const a6 = a2[6];
    const a7 = a2[7];
    const a8 = a2[8];
    const a9 = a2[9];
    const a10 = a2[10];
    const a11 = a2[11];
    const a12 = a2[12];
    const a13 = a2[13];
    const a14 = a2[14];
    const a15 = a2[15];
    const b0 = b2[0];
    const b1 = b2[1];
    const b22 = b2[2];
    const b3 = b2[3];
    const b4 = b2[4];
    const b5 = b2[5];
    const b6 = b2[6];
    const b7 = b2[7];
    const b8 = b2[8];
    const b9 = b2[9];
    const b10 = b2[10];
    const b11 = b2[11];
    const b12 = b2[12];
    const b13 = b2[13];
    const b14 = b2[14];
    const b15 = b2[15];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a22 - b22) <= EPSILON * Math.max(1, Math.abs(a22), Math.abs(b22)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
  }
  /**
   * Returns a string representation of a {@link Mat4}
   * @category Static
   *
   * @param a - matrix to represent as a string
   * @returns string representation of the matrix
   */
  static str(a2) {
    return `Mat4(${a2.join(", ")})`;
  }
}
const tmpVec3$1 = [0, 0, 0];
Mat4.prototype.mul = Mat4.prototype.multiply;
Mat4.sub = Mat4.subtract;
Mat4.mul = Mat4.multiply;
Mat4.perspective = Mat4.perspectiveNO;
Mat4.ortho = Mat4.orthoNO;
class Vec3 extends Float32Array {
  /**
  * The number of bytes in a {@link Vec3}.
  */
  static BYTE_LENGTH = 3 * Float32Array.BYTES_PER_ELEMENT;
  /**
  * Create a {@link Vec3}.
  */
  constructor(...values) {
    switch (values.length) {
      case 3:
        super(values);
        break;
      case 2:
        super(values[0], values[1], 3);
        break;
      case 1: {
        const v2 = values[0];
        if (typeof v2 === "number") {
          super([v2, v2, v2]);
        } else {
          super(v2, 0, 3);
        }
        break;
      }
      default:
        super(3);
        break;
    }
  }
  //============
  // Attributes
  //============
  // Getters and setters to make component access read better.
  // These are likely to be a little bit slower than direct array access.
  /**
   * The x component of the vector. Equivalent to `this[0];`
   * @category Vector components
   */
  get x() {
    return this[0];
  }
  set x(value) {
    this[0] = value;
  }
  /**
   * The y component of the vector. Equivalent to `this[1];`
   * @category Vector components
   */
  get y() {
    return this[1];
  }
  set y(value) {
    this[1] = value;
  }
  /**
   * The z component of the vector. Equivalent to `this[2];`
   * @category Vector components
   */
  get z() {
    return this[2];
  }
  set z(value) {
    this[2] = value;
  }
  // Alternate set of getters and setters in case this is being used to define
  // a color.
  /**
   * The r component of the vector. Equivalent to `this[0];`
   * @category Color components
   */
  get r() {
    return this[0];
  }
  set r(value) {
    this[0] = value;
  }
  /**
   * The g component of the vector. Equivalent to `this[1];`
   * @category Color components
   */
  get g() {
    return this[1];
  }
  set g(value) {
    this[1] = value;
  }
  /**
   * The b component of the vector. Equivalent to `this[2];`
   * @category Color components
   */
  get b() {
    return this[2];
  }
  set b(value) {
    this[2] = value;
  }
  /**
   * The magnitude (length) of this.
   * Equivalent to `Vec3.magnitude(this);`
   *
   * Magnitude is used because the `length` attribute is already defined by
   * `Float32Array` to mean the number of elements in the array.
   */
  get magnitude() {
    const x2 = this[0];
    const y2 = this[1];
    const z2 = this[2];
    return Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
  }
  /**
   * Alias for {@link Vec3.magnitude}
   */
  get mag() {
    return this.magnitude;
  }
  /**
   * The squared magnitude (length) of `this`.
   * Equivalent to `Vec3.squaredMagnitude(this);`
   */
  get squaredMagnitude() {
    const x2 = this[0];
    const y2 = this[1];
    const z2 = this[2];
    return x2 * x2 + y2 * y2 + z2 * z2;
  }
  /**
   * Alias for {@link Vec3.squaredMagnitude}
   */
  get sqrMag() {
    return this.squaredMagnitude;
  }
  /**
   * A string representation of `this`
   * Equivalent to `Vec3.str(this);`
   */
  get str() {
    return Vec3.str(this);
  }
  //===================
  // Instances methods
  //===================
  /**
   * Copy the values from another {@link Vec3} into `this`.
   *
   * @param a the source vector
   * @returns `this`
   */
  copy(a2) {
    this.set(a2);
    return this;
  }
  /**
   * Adds a {@link Vec3} to `this`.
   * Equivalent to `Vec3.add(this, this, b);`
   *
   * @param b - The vector to add to `this`
   * @returns `this`
   */
  add(b2) {
    this[0] += b2[0];
    this[1] += b2[1];
    this[2] += b2[2];
    return this;
  }
  /**
   * Subtracts a {@link Vec3} from `this`.
   * Equivalent to `Vec3.subtract(this, this, b);`
   *
   * @param b - The vector to subtract from `this`
   * @returns `this`
   */
  subtract(b2) {
    this[0] -= b2[0];
    this[1] -= b2[1];
    this[2] -= b2[2];
    return this;
  }
  /**
   * Alias for {@link Vec3.subtract}
   */
  sub(b2) {
    return this;
  }
  /**
   * Multiplies `this` by a {@link Vec3}.
   * Equivalent to `Vec3.multiply(this, this, b);`
   *
   * @param b - The vector to multiply `this` by
   * @returns `this`
   */
  multiply(b2) {
    this[0] *= b2[0];
    this[1] *= b2[1];
    this[2] *= b2[2];
    return this;
  }
  /**
   * Alias for {@link Vec3.multiply}
   */
  mul(b2) {
    return this;
  }
  /**
   * Divides `this` by a {@link Vec3}.
   * Equivalent to `Vec3.divide(this, this, b);`
   *
   * @param b - The vector to divide `this` by
   * @returns `this`
   */
  divide(b2) {
    this[0] /= b2[0];
    this[1] /= b2[1];
    this[2] /= b2[2];
    return this;
  }
  /**
   * Alias for {@link Vec3.divide}
   */
  div(b2) {
    return this;
  }
  /**
   * Scales `this` by a scalar number.
   * Equivalent to `Vec3.scale(this, this, b);`
   *
   * @param b - Amount to scale `this` by
   * @returns `this`
   */
  scale(b2) {
    this[0] *= b2;
    this[1] *= b2;
    this[2] *= b2;
    return this;
  }
  /**
   * Calculates `this` scaled by a scalar value then adds the result to `this`.
   * Equivalent to `Vec3.scaleAndAdd(this, this, b, scale);`
   *
   * @param b - The vector to add to `this`
   * @param scale - The amount to scale `b` by before adding
   * @returns `this`
   */
  scaleAndAdd(b2, scale) {
    this[0] += b2[0] * scale;
    this[1] += b2[1] * scale;
    this[2] += b2[2] * scale;
    return this;
  }
  /**
   * Calculates the euclidian distance between another {@link Vec3} and `this`.
   * Equivalent to `Vec3.distance(this, b);`
   *
   * @param b - The vector to calculate the distance to
   * @returns Distance between `this` and `b`
   */
  distance(b2) {
    return Vec3.distance(this, b2);
  }
  /**
   * Alias for {@link Vec3.distance}
   */
  dist(b2) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between another {@link Vec3} and `this`.
   * Equivalent to `Vec3.squaredDistance(this, b);`
   *
   * @param b The vector to calculate the squared distance to
   * @returns Squared distance between `this` and `b`
   */
  squaredDistance(b2) {
    return Vec3.squaredDistance(this, b2);
  }
  /**
   * Alias for {@link Vec3.squaredDistance}
   */
  sqrDist(b2) {
    return 0;
  }
  /**
   * Negates the components of `this`.
   * Equivalent to `Vec3.negate(this, this);`
   *
   * @returns `this`
   */
  negate() {
    this[0] *= -1;
    this[1] *= -1;
    this[2] *= -1;
    return this;
  }
  /**
   * Inverts the components of `this`.
   * Equivalent to `Vec3.inverse(this, this);`
   *
   * @returns `this`
   */
  invert() {
    this[0] = 1 / this[0];
    this[1] = 1 / this[1];
    this[2] = 1 / this[2];
    return this;
  }
  /**
   * Calculates the dot product of this and another {@link Vec3}.
   * Equivalent to `Vec3.dot(this, b);`
   *
   * @param b - The second operand
   * @returns Dot product of `this` and `b`
   */
  dot(b2) {
    return this[0] * b2[0] + this[1] * b2[1] + this[2] * b2[2];
  }
  /**
   * Normalize `this`.
   * Equivalent to `Vec3.normalize(this, this);`
   *
   * @returns `this`
   */
  normalize() {
    return Vec3.normalize(this, this);
  }
  //================
  // Static methods
  //================
  /**
   * Creates a new, empty vec3
   * @category Static
   *
   * @returns a new 3D vector
   */
  static create() {
    return new Vec3();
  }
  /**
   * Creates a new vec3 initialized with values from an existing vector
   * @category Static
   *
   * @param a - vector to clone
   * @returns a new 3D vector
   */
  static clone(a2) {
    return new Vec3(a2);
  }
  /**
   * Calculates the magnitude (length) of a {@link Vec3}
   * @category Static
   *
   * @param a - Vector to calculate magnitude of
   * @returns Magnitude of a
   */
  static magnitude(a2) {
    let x2 = a2[0];
    let y2 = a2[1];
    let z2 = a2[2];
    return Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
  }
  /**
   * Alias for {@link Vec3.magnitude}
   * @category Static
   */
  static mag(a2) {
    return 0;
  }
  /**
   * Alias for {@link Vec3.magnitude}
   * @category Static
   * @deprecated Use {@link Vec3.magnitude} to avoid conflicts with builtin `length` methods/attribs
   *
   * @param a - vector to calculate length of
   * @returns length of a
   */
  // @ts-ignore: Length conflicts with Function.length
  static length(a2) {
    return 0;
  }
  /**
   * Alias for {@link Vec3.magnitude}
   * @category Static
   * @deprecated Use {@link Vec3.mag}
   */
  static len(a2) {
    return 0;
  }
  /**
   * Creates a new vec3 initialized with the given values
   * @category Static
   *
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @returns a new 3D vector
   */
  static fromValues(x2, y2, z2) {
    return new Vec3(x2, y2, z2);
  }
  /**
   * Copy the values from one vec3 to another
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the source vector
   * @returns `out`
   */
  static copy(out, a2) {
    out[0] = a2[0];
    out[1] = a2[1];
    out[2] = a2[2];
    return out;
  }
  /**
   * Set the components of a vec3 to the given values
   * @category Static
   *
   * @param out - the receiving vector
   * @param x - X component
   * @param y - Y component
   * @param z - Z component
   * @returns `out`
   */
  static set(out, x2, y2, z2) {
    out[0] = x2;
    out[1] = y2;
    out[2] = z2;
    return out;
  }
  /**
   * Adds two {@link Vec3}s
   * @category Static
   *
   * @param out - The receiving vector
   * @param a - The first operand
   * @param b - The second operand
   * @returns `out`
   */
  static add(out, a2, b2) {
    out[0] = a2[0] + b2[0];
    out[1] = a2[1] + b2[1];
    out[2] = a2[2] + b2[2];
    return out;
  }
  /**
   * Subtracts vector b from vector a
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static subtract(out, a2, b2) {
    out[0] = a2[0] - b2[0];
    out[1] = a2[1] - b2[1];
    out[2] = a2[2] - b2[2];
    return out;
  }
  /**
   * Alias for {@link Vec3.subtract}
   * @category Static
   */
  static sub(out, a2, b2) {
    return [0, 0, 0];
  }
  /**
   * Multiplies two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static multiply(out, a2, b2) {
    out[0] = a2[0] * b2[0];
    out[1] = a2[1] * b2[1];
    out[2] = a2[2] * b2[2];
    return out;
  }
  /**
   * Alias for {@link Vec3.multiply}
   * @category Static
   */
  static mul(out, a2, b2) {
    return [0, 0, 0];
  }
  /**
   * Divides two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static divide(out, a2, b2) {
    out[0] = a2[0] / b2[0];
    out[1] = a2[1] / b2[1];
    out[2] = a2[2] / b2[2];
    return out;
  }
  /**
   * Alias for {@link Vec3.divide}
   * @category Static
   */
  static div(out, a2, b2) {
    return [0, 0, 0];
  }
  /**
   * Math.ceil the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to ceil
   * @returns `out`
   */
  static ceil(out, a2) {
    out[0] = Math.ceil(a2[0]);
    out[1] = Math.ceil(a2[1]);
    out[2] = Math.ceil(a2[2]);
    return out;
  }
  /**
   * Math.floor the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to floor
   * @returns `out`
   */
  static floor(out, a2) {
    out[0] = Math.floor(a2[0]);
    out[1] = Math.floor(a2[1]);
    out[2] = Math.floor(a2[2]);
    return out;
  }
  /**
   * Returns the minimum of two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static min(out, a2, b2) {
    out[0] = Math.min(a2[0], b2[0]);
    out[1] = Math.min(a2[1], b2[1]);
    out[2] = Math.min(a2[2], b2[2]);
    return out;
  }
  /**
   * Returns the maximum of two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static max(out, a2, b2) {
    out[0] = Math.max(a2[0], b2[0]);
    out[1] = Math.max(a2[1], b2[1]);
    out[2] = Math.max(a2[2], b2[2]);
    return out;
  }
  /**
   * symmetric round the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to round
   * @returns `out`
   */
  /*static round(out: Vec3Like, a: Readonly<Vec3Like>): Vec3Like {
    out[0] = glMatrix.round(a[0]);
    out[1] = glMatrix.round(a[1]);
    out[2] = glMatrix.round(a[2]);
    return out;
  }*/
  /**
   * Scales a vec3 by a scalar number
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to scale
   * @param scale - amount to scale the vector by
   * @returns `out`
   */
  static scale(out, a2, scale) {
    out[0] = a2[0] * scale;
    out[1] = a2[1] * scale;
    out[2] = a2[2] * scale;
    return out;
  }
  /**
   * Adds two vec3's after scaling the second operand by a scalar value
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param scale - the amount to scale b by before adding
   * @returns `out`
   */
  static scaleAndAdd(out, a2, b2, scale) {
    out[0] = a2[0] + b2[0] * scale;
    out[1] = a2[1] + b2[1] * scale;
    out[2] = a2[2] + b2[2] * scale;
    return out;
  }
  /**
   * Calculates the euclidian distance between two vec3's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns distance between a and b
   */
  static distance(a2, b2) {
    const x2 = b2[0] - a2[0];
    const y2 = b2[1] - a2[1];
    const z2 = b2[2] - a2[2];
    return Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
  }
  /**
   * Alias for {@link Vec3.distance}
   */
  static dist(a2, b2) {
    return 0;
  }
  /**
   * Calculates the squared euclidian distance between two vec3's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns squared distance between a and b
   */
  static squaredDistance(a2, b2) {
    const x2 = b2[0] - a2[0];
    const y2 = b2[1] - a2[1];
    const z2 = b2[2] - a2[2];
    return x2 * x2 + y2 * y2 + z2 * z2;
  }
  /**
   * Alias for {@link Vec3.squaredDistance}
   */
  static sqrDist(a2, b2) {
    return 0;
  }
  /**
   * Calculates the squared length of a vec3
   * @category Static
   *
   * @param a - vector to calculate squared length of
   * @returns squared length of a
   */
  static squaredLength(a2) {
    const x2 = a2[0];
    const y2 = a2[1];
    const z2 = a2[2];
    return x2 * x2 + y2 * y2 + z2 * z2;
  }
  /**
   * Alias for {@link Vec3.squaredLength}
   */
  static sqrLen(a2, b2) {
    return 0;
  }
  /**
   * Negates the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to negate
   * @returns `out`
   */
  static negate(out, a2) {
    out[0] = -a2[0];
    out[1] = -a2[1];
    out[2] = -a2[2];
    return out;
  }
  /**
   * Returns the inverse of the components of a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to invert
   * @returns `out`
   */
  static inverse(out, a2) {
    out[0] = 1 / a2[0];
    out[1] = 1 / a2[1];
    out[2] = 1 / a2[2];
    return out;
  }
  /**
   * Normalize a vec3
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - vector to normalize
   * @returns `out`
   */
  static normalize(out, a2) {
    const x2 = a2[0];
    const y2 = a2[1];
    const z2 = a2[2];
    let len = x2 * x2 + y2 * y2 + z2 * z2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = a2[0] * len;
    out[1] = a2[1] * len;
    out[2] = a2[2] * len;
    return out;
  }
  /**
   * Calculates the dot product of two vec3's
   * @category Static
   *
   * @param a - the first operand
   * @param b - the second operand
   * @returns dot product of a and b
   */
  static dot(a2, b2) {
    return a2[0] * b2[0] + a2[1] * b2[1] + a2[2] * b2[2];
  }
  /**
   * Computes the cross product of two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @returns `out`
   */
  static cross(out, a2, b2) {
    const ax = a2[0], ay = a2[1], az = a2[2];
    const bx = b2[0], by = b2[1], bz = b2[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  /**
   * Performs a linear interpolation between two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static lerp(out, a2, b2, t2) {
    const ax = a2[0];
    const ay = a2[1];
    const az = a2[2];
    out[0] = ax + t2 * (b2[0] - ax);
    out[1] = ay + t2 * (b2[1] - ay);
    out[2] = az + t2 * (b2[2] - az);
    return out;
  }
  /**
   * Performs a spherical linear interpolation between two vec3's
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static slerp(out, a2, b2, t2) {
    const angle = Math.acos(Math.min(Math.max(Vec3.dot(a2, b2), -1), 1));
    const sinTotal = Math.sin(angle);
    const ratioA = Math.sin((1 - t2) * angle) / sinTotal;
    const ratioB = Math.sin(t2 * angle) / sinTotal;
    out[0] = ratioA * a2[0] + ratioB * b2[0];
    out[1] = ratioA * a2[1] + ratioB * b2[1];
    out[2] = ratioA * a2[2] + ratioB * b2[2];
    return out;
  }
  /**
   * Performs a hermite interpolation with two control points
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param c - the third operand
   * @param d - the fourth operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static hermite(out, a2, b2, c2, d2, t2) {
    const factorTimes2 = t2 * t2;
    const factor1 = factorTimes2 * (2 * t2 - 3) + 1;
    const factor2 = factorTimes2 * (t2 - 2) + t2;
    const factor3 = factorTimes2 * (t2 - 1);
    const factor4 = factorTimes2 * (3 - 2 * t2);
    out[0] = a2[0] * factor1 + b2[0] * factor2 + c2[0] * factor3 + d2[0] * factor4;
    out[1] = a2[1] * factor1 + b2[1] * factor2 + c2[1] * factor3 + d2[1] * factor4;
    out[2] = a2[2] * factor1 + b2[2] * factor2 + c2[2] * factor3 + d2[2] * factor4;
    return out;
  }
  /**
   * Performs a bezier interpolation with two control points
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the first operand
   * @param b - the second operand
   * @param c - the third operand
   * @param d - the fourth operand
   * @param t - interpolation amount, in the range [0-1], between the two inputs
   * @returns `out`
   */
  static bezier(out, a2, b2, c2, d2, t2) {
    const inverseFactor = 1 - t2;
    const inverseFactorTimesTwo = inverseFactor * inverseFactor;
    const factorTimes2 = t2 * t2;
    const factor1 = inverseFactorTimesTwo * inverseFactor;
    const factor2 = 3 * t2 * inverseFactorTimesTwo;
    const factor3 = 3 * factorTimes2 * inverseFactor;
    const factor4 = factorTimes2 * t2;
    out[0] = a2[0] * factor1 + b2[0] * factor2 + c2[0] * factor3 + d2[0] * factor4;
    out[1] = a2[1] * factor1 + b2[1] * factor2 + c2[1] * factor3 + d2[1] * factor4;
    out[2] = a2[2] * factor1 + b2[2] * factor2 + c2[2] * factor3 + d2[2] * factor4;
    return out;
  }
  /**
   * Generates a random vector with the given scale
   * @category Static
   *
   * @param out - the receiving vector
   * @param {Number} [scale] Length of the resulting vector. If omitted, a unit vector will be returned
   * @returns `out`
   */
  /*static random(out: Vec3Like, scale) {
      scale = scale === undefined ? 1.0 : scale;
  
      let r = glMatrix.RANDOM() * 2.0 * Math.PI;
      let z = glMatrix.RANDOM() * 2.0 - 1.0;
      let zScale = Math.sqrt(1.0 - z * z) * scale;
  
      out[0] = Math.cos(r) * zScale;
      out[1] = Math.sin(r) * zScale;
      out[2] = z * scale;
      return out;
    }*/
  /**
   * Transforms the vec3 with a mat4.
   * 4th vector component is implicitly '1'
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param m - matrix to transform with
   * @returns `out`
   */
  static transformMat4(out, a2, m2) {
    const x2 = a2[0], y2 = a2[1], z2 = a2[2];
    const w2 = m2[3] * x2 + m2[7] * y2 + m2[11] * z2 + m2[15] || 1;
    out[0] = (m2[0] * x2 + m2[4] * y2 + m2[8] * z2 + m2[12]) / w2;
    out[1] = (m2[1] * x2 + m2[5] * y2 + m2[9] * z2 + m2[13]) / w2;
    out[2] = (m2[2] * x2 + m2[6] * y2 + m2[10] * z2 + m2[14]) / w2;
    return out;
  }
  /**
   * Transforms the vec3 with a mat3.
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param m - the 3x3 matrix to transform with
   * @returns `out`
   */
  static transformMat3(out, a2, m2) {
    let x2 = a2[0], y2 = a2[1], z2 = a2[2];
    out[0] = x2 * m2[0] + y2 * m2[3] + z2 * m2[6];
    out[1] = x2 * m2[1] + y2 * m2[4] + z2 * m2[7];
    out[2] = x2 * m2[2] + y2 * m2[5] + z2 * m2[8];
    return out;
  }
  /**
   * Transforms the vec3 with a quat
   * Can also be used for dual quaternions. (Multiply it with the real part)
   * @category Static
   *
   * @param out - the receiving vector
   * @param a - the vector to transform
   * @param q - quaternion to transform with
   * @returns `out`
   */
  static transformQuat(out, a2, q2) {
    const qx = q2[0];
    const qy = q2[1];
    const qz = q2[2];
    const w2 = q2[3] * 2;
    const x2 = a2[0];
    const y2 = a2[1];
    const z2 = a2[2];
    const uvx = qy * z2 - qz * y2;
    const uvy = qz * x2 - qx * z2;
    const uvz = qx * y2 - qy * x2;
    const uuvx = (qy * uvz - qz * uvy) * 2;
    const uuvy = (qz * uvx - qx * uvz) * 2;
    const uuvz = (qx * uvy - qy * uvx) * 2;
    out[0] = x2 + uvx * w2 + uuvx;
    out[1] = y2 + uvy * w2 + uuvy;
    out[2] = z2 + uvz * w2 + uuvz;
    return out;
  }
  /**
   * Rotate a 3D vector around the x-axis
   * @param out - The receiving vec3
   * @param a - The vec3 point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotateX(out, a2, b2, rad) {
    const by = b2[1];
    const bz = b2[2];
    const py = a2[1] - by;
    const pz = a2[2] - bz;
    out[0] = a2[0];
    out[1] = py * Math.cos(rad) - pz * Math.sin(rad) + by;
    out[2] = py * Math.sin(rad) + pz * Math.cos(rad) + bz;
    return out;
  }
  /**
   * Rotate a 3D vector around the y-axis
   * @param out - The receiving vec3
   * @param a - The vec3 point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotateY(out, a2, b2, rad) {
    const bx = b2[0];
    const bz = b2[2];
    const px = a2[0] - bx;
    const pz = a2[2] - bz;
    out[0] = pz * Math.sin(rad) + px * Math.cos(rad) + bx;
    out[1] = a2[1];
    out[2] = pz * Math.cos(rad) - px * Math.sin(rad) + bz;
    return out;
  }
  /**
   * Rotate a 3D vector around the z-axis
   * @param out - The receiving vec3
   * @param a - The vec3 point to rotate
   * @param b - The origin of the rotation
   * @param rad - The angle of rotation in radians
   * @returns `out`
   */
  static rotateZ(out, a2, b2, rad) {
    const bx = b2[0];
    const by = b2[1];
    const px = a2[0] - bx;
    const py = a2[1] - by;
    out[0] = px * Math.cos(rad) - py * Math.sin(rad) + bx;
    out[1] = px * Math.sin(rad) + py * Math.cos(rad) + by;
    out[2] = b2[2];
    return out;
  }
  /**
   * Get the angle between two 3D vectors
   * @param a - The first operand
   * @param b - The second operand
   * @returns The angle in radians
   */
  static angle(a2, b2) {
    const ax = a2[0];
    const ay = a2[1];
    const az = a2[2];
    const bx = b2[0];
    const by = b2[1];
    const bz = b2[2];
    const mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz));
    const cosine = mag && Vec3.dot(a2, b2) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  /**
   * Set the components of a vec3 to zero
   * @category Static
   *
   * @param out - the receiving vector
   * @returns `out`
   */
  static zero(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }
  /**
   * Returns a string representation of a vector
   * @category Static
   *
   * @param a - vector to represent as a string
   * @returns string representation of the vector
   */
  static str(a2) {
    return `Vec3(${a2.join(", ")})`;
  }
  /**
   * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static exactEquals(a2, b2) {
    return a2[0] === b2[0] && a2[1] === b2[1] && a2[2] === b2[2];
  }
  /**
   * Returns whether or not the vectors have approximately the same elements in the same position.
   * @category Static
   *
   * @param a - The first vector.
   * @param b - The second vector.
   * @returns True if the vectors are equal, false otherwise.
   */
  static equals(a2, b2) {
    const a0 = a2[0];
    const a1 = a2[1];
    const a22 = a2[2];
    const b0 = b2[0];
    const b1 = b2[1];
    const b22 = b2[2];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a22 - b22) <= EPSILON * Math.max(1, Math.abs(a22), Math.abs(b22));
  }
}
Vec3.prototype.sub = Vec3.prototype.subtract;
Vec3.prototype.mul = Vec3.prototype.multiply;
Vec3.prototype.div = Vec3.prototype.divide;
Vec3.prototype.dist = Vec3.prototype.distance;
Vec3.prototype.sqrDist = Vec3.prototype.squaredDistance;
Vec3.sub = Vec3.subtract;
Vec3.mul = Vec3.multiply;
Vec3.div = Vec3.divide;
Vec3.dist = Vec3.distance;
Vec3.sqrDist = Vec3.squaredDistance;
Vec3.sqrLen = Vec3.squaredLength;
Vec3.mag = Vec3.magnitude;
Vec3.length = Vec3.magnitude;
Vec3.len = Vec3.magnitude;
async function nextAnimationFrame(cntr = 1) {
  if (!Number.isInteger(cntr) || cntr < 1) {
    throw new TypeError(`nextAnimationFrame error: 'cntr' must be a positive integer greater than 0.`);
  }
  let currentTime = performance.now();
  for (; --cntr >= 0; ) {
    currentTime = await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return currentTime;
}
function clamp(value = 0, min = 0, max2 = 0) {
  return Math.min(Math.max(value, min), max2);
}
function degToRad(deg) {
  return deg * (Math.PI / 180);
}
class AnimationControl {
  /** @type {object} */
  #animationData;
  /** @type {Promise<void>} */
  #finishedPromise;
  #willFinish;
  /**
   * Defines a static empty / void animation control.
   *
   * @type {AnimationControl}
   */
  static #voidControl = new AnimationControl(null);
  /**
   * Provides a static void / undefined AnimationControl that is automatically resolved.
   *
   * @returns {AnimationControl} Void AnimationControl
   */
  static get voidControl() {
    return this.#voidControl;
  }
  /**
   * @param {object|null} [animationData] - Animation data from {@link AnimationAPI}.
   *
   * @param {boolean}     [willFinish] - Promise that tracks animation finished state.
   */
  constructor(animationData, willFinish = false) {
    this.#animationData = animationData;
    this.#willFinish = willFinish;
    if (isObject(animationData)) {
      animationData.control = this;
    }
  }
  /**
   * Get a promise that resolves when animation is finished.
   *
   * @returns {Promise<void>}
   */
  get finished() {
    if (!(this.#finishedPromise instanceof Promise)) {
      this.#finishedPromise = this.#willFinish ? new Promise((resolve) => this.#animationData.resolve = resolve) : Promise.resolve();
    }
    return this.#finishedPromise;
  }
  /**
   * Returns whether this animation is currently active / animating.
   *
   * Note: a delayed animation may not be started / active yet. Use {@link AnimationControl.isFinished} to determine
   * if an animation is actually finished.
   *
   * @returns {boolean} Animation active state.
   */
  get isActive() {
    return this.#animationData.active;
  }
  /**
   * Returns whether this animation is completely finished.
   *
   * @returns {boolean} Animation finished state.
   */
  get isFinished() {
    return this.#animationData.finished;
  }
  /**
   * Cancels the animation.
   */
  cancel() {
    const animationData = this.#animationData;
    if (animationData === null || animationData === void 0) {
      return;
    }
    animationData.cancelled = true;
  }
}
class AnimationManager {
  /**
   * @type {object[]}
   */
  static activeList = [];
  /**
   * @type {object[]}
   */
  static newList = [];
  /**
   * @type {number}
   */
  static current;
  /**
   * Add animation data.
   *
   * @param {object}   data -
   */
  static add(data) {
    const now2 = performance.now();
    data.start = now2 + (AnimationManager.current - now2);
    AnimationManager.newList.push(data);
  }
  /**
   * Manage all animation
   */
  static animate() {
    const current = AnimationManager.current = performance.now();
    if (AnimationManager.activeList.length === 0 && AnimationManager.newList.length === 0) {
      globalThis.requestAnimationFrame(AnimationManager.animate);
      return;
    }
    if (AnimationManager.newList.length) {
      for (let cntr = AnimationManager.newList.length; --cntr >= 0; ) {
        const data = AnimationManager.newList[cntr];
        if (data.cancelled) {
          AnimationManager.newList.splice(cntr, 1);
          data.cleanup(data);
        }
        if (data.active) {
          AnimationManager.newList.splice(cntr, 1);
          AnimationManager.activeList.push(data);
        }
      }
    }
    for (let cntr = AnimationManager.activeList.length; --cntr >= 0; ) {
      const data = AnimationManager.activeList[cntr];
      if (data.cancelled || data.el !== void 0 && !data.el.isConnected) {
        AnimationManager.activeList.splice(cntr, 1);
        data.cleanup(data);
        continue;
      }
      data.current = current - data.start;
      if (data.current >= data.duration) {
        for (let dataCntr = data.keys.length; --dataCntr >= 0; ) {
          const key = data.keys[dataCntr];
          data.newData[key] = data.destination[key];
        }
        data.position.set(data.newData);
        AnimationManager.activeList.splice(cntr, 1);
        data.cleanup(data);
        continue;
      }
      const easedTime = data.ease(data.current / data.duration);
      for (let dataCntr = data.keys.length; --dataCntr >= 0; ) {
        const key = data.keys[dataCntr];
        data.newData[key] = data.interpolate(data.initial[key], data.destination[key], easedTime);
      }
      data.position.set(data.newData);
    }
    globalThis.requestAnimationFrame(AnimationManager.animate);
  }
  /**
   * Cancels all animations for given TJSPosition instance.
   *
   * @param {import('../').TJSPosition} position - TJSPosition instance.
   */
  static cancel(position) {
    for (let cntr = AnimationManager.activeList.length; --cntr >= 0; ) {
      const data = AnimationManager.activeList[cntr];
      if (data.position === position) {
        AnimationManager.activeList.splice(cntr, 1);
        data.cancelled = true;
        data.cleanup(data);
      }
    }
    for (let cntr = AnimationManager.newList.length; --cntr >= 0; ) {
      const data = AnimationManager.newList[cntr];
      if (data.position === position) {
        AnimationManager.newList.splice(cntr, 1);
        data.cancelled = true;
        data.cleanup(data);
      }
    }
  }
  /**
   * Cancels all active and delayed animations.
   */
  static cancelAll() {
    for (let cntr = AnimationManager.activeList.length; --cntr >= 0; ) {
      const data = AnimationManager.activeList[cntr];
      data.cancelled = true;
      data.cleanup(data);
    }
    for (let cntr = AnimationManager.newList.length; --cntr >= 0; ) {
      const data = AnimationManager.newList[cntr];
      data.cancelled = true;
      data.cleanup(data);
    }
    AnimationManager.activeList.length = 0;
    AnimationManager.newList.length = 0;
  }
  /**
   * Gets all {@link AnimationControl} instances for a given TJSPosition instance.
   *
   * @param {import('../index.js').TJSPosition} position - TJSPosition instance.
   *
   * @returns {import('#runtime/util/animate').TJSBasicAnimation[]} All scheduled AnimationControl instances for the
   *          given TJSPosition instance.
   */
  static getScheduled(position) {
    const results = [];
    for (let cntr = AnimationManager.activeList.length; --cntr >= 0; ) {
      const data = AnimationManager.activeList[cntr];
      if (data.position === position) {
        results.push(data.control);
      }
    }
    for (let cntr = AnimationManager.newList.length; --cntr >= 0; ) {
      const data = AnimationManager.newList[cntr];
      if (data.position === position) {
        results.push(data.control);
      }
    }
    return results;
  }
}
AnimationManager.animate();
const animateKeys = /* @__PURE__ */ new Set([
  // Main keys
  "left",
  "top",
  "maxWidth",
  "maxHeight",
  "minWidth",
  "minHeight",
  "width",
  "height",
  "rotateX",
  "rotateY",
  "rotateZ",
  "scale",
  "translateX",
  "translateY",
  "translateZ",
  "zIndex",
  // Aliases
  "rotation"
]);
const transformKeys = ["rotateX", "rotateY", "rotateZ", "scale", "translateX", "translateY", "translateZ"];
Object.freeze(transformKeys);
const relativeRegex = /^([-+*])=(-?[\d]*\.?[\d]+)$/;
const numericDefaults = {
  // Other keys
  height: 0,
  left: 0,
  maxHeight: null,
  maxWidth: null,
  minHeight: null,
  minWidth: null,
  top: 0,
  transformOrigin: null,
  width: 0,
  zIndex: null,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale: 1,
  translateX: 0,
  translateY: 0,
  translateZ: 0,
  rotation: 0
};
Object.freeze(numericDefaults);
function setNumericDefaults(data) {
  if (data.rotateX === null) {
    data.rotateX = 0;
  }
  if (data.rotateY === null) {
    data.rotateY = 0;
  }
  if (data.rotateZ === null) {
    data.rotateZ = 0;
  }
  if (data.translateX === null) {
    data.translateX = 0;
  }
  if (data.translateY === null) {
    data.translateY = 0;
  }
  if (data.translateZ === null) {
    data.translateZ = 0;
  }
  if (data.scale === null) {
    data.scale = 1;
  }
  if (data.rotation === null) {
    data.rotation = 0;
  }
}
const transformKeysBitwise = {
  rotateX: 1,
  rotateY: 2,
  rotateZ: 4,
  scale: 8,
  translateX: 16,
  translateY: 32,
  translateZ: 64
};
Object.freeze(transformKeysBitwise);
const transformOriginDefault = "top left";
const transformOrigins = [
  "top left",
  "top center",
  "top right",
  "center left",
  "center",
  "center right",
  "bottom left",
  "bottom center",
  "bottom right"
];
Object.freeze(transformOrigins);
function convertRelative(positionData, position) {
  for (const key in positionData) {
    if (animateKeys.has(key)) {
      const value = positionData[key];
      if (typeof value !== "string") {
        continue;
      }
      if (value === "auto" || value === "inherit") {
        continue;
      }
      const regexResults = relativeRegex.exec(value);
      if (!regexResults) {
        throw new Error(
          `convertRelative error: malformed relative key (${key}) with value (${value})`
        );
      }
      const current = position[key];
      switch (regexResults[1]) {
        case "-":
          positionData[key] = current - parseFloat(regexResults[2]);
          break;
        case "+":
          positionData[key] = current + parseFloat(regexResults[2]);
          break;
        case "*":
          positionData[key] = current * parseFloat(regexResults[2]);
          break;
      }
    }
  }
}
class AnimationAPI {
  /** @type {import('../').TJSPositionData} */
  #data;
  /** @type {import('../').TJSPosition} */
  #position;
  /**
   * Tracks the number of animation control instances that are active.
   *
   * @type {number}
   */
  #instanceCount = 0;
  /**
   * Provides a bound function to pass as data to AnimationManager to invoke `AnimationAPI.#cleanupInstance`.
   *
   * @type {Function}
   */
  #cleanup;
  /**
   * @param {import('../index.js').TJSPosition}       position -
   *
   * @param {import('../index.js').TJSPositionData}   data -
   */
  constructor(position, data) {
    this.#position = position;
    this.#data = data;
    this.#cleanup = this.#cleanupInstance.bind(this);
  }
  /**
   * Returns whether there are scheduled animations whether active or delayed for this TJSPosition.
   *
   * @returns {boolean} Are there active animation instances.
   */
  get isScheduled() {
    return this.#instanceCount > 0;
  }
  /**
   * Adds / schedules an animation w/ the AnimationManager. This contains the final steps common to all tweens.
   *
   * @param {object}      initial -
   *
   * @param {object}      destination -
   *
   * @param {number}      duration -
   *
   * @param {HTMLElement} el -
   *
   * @param {number}      delay -
   *
   * @param {Function}    ease -
   *
   * @param {Function}    interpolate -
   *
   * @returns {import('#runtime/util/animate').TJSBasicAnimation} The associated animation control.
   */
  #addAnimation(initial, destination, duration, el, delay, ease, interpolate) {
    setNumericDefaults(initial);
    setNumericDefaults(destination);
    for (const key in initial) {
      if (!Number.isFinite(initial[key])) {
        delete initial[key];
      }
    }
    const keys = Object.keys(initial);
    const newData = Object.assign({ immediateElementUpdate: true }, initial);
    if (keys.length === 0) {
      return AnimationControl.voidControl;
    }
    const animationData = {
      active: true,
      cleanup: this.#cleanup,
      cancelled: false,
      control: void 0,
      current: 0,
      destination,
      duration: duration * 1e3,
      // Internally the AnimationManager works in ms.
      ease,
      el,
      finished: false,
      initial,
      interpolate,
      keys,
      newData,
      position: this.#position,
      resolve: void 0,
      start: void 0
    };
    if (delay > 0) {
      animationData.active = false;
      setTimeout(() => {
        if (!animationData.cancelled) {
          animationData.active = true;
          const now2 = performance.now();
          animationData.start = now2 + (AnimationManager.current - now2);
        }
      }, delay * 1e3);
    }
    this.#instanceCount++;
    AnimationManager.add(animationData);
    return new AnimationControl(animationData, true);
  }
  /**
   * Cancels all animation instances for this TJSPosition instance.
   */
  cancel() {
    AnimationManager.cancel(this.#position);
  }
  /**
   * Cleans up an animation instance.
   *
   * @param {object}   data - Animation data for an animation instance.
   */
  #cleanupInstance(data) {
    this.#instanceCount--;
    data.active = false;
    data.finished = true;
    if (typeof data.resolve === "function") {
      data.resolve(data.cancelled);
    }
  }
  /**
   * Returns all currently scheduled AnimationControl instances for this TJSPosition instance.
   *
   * @returns {import('#runtime/util/animate').TJSBasicAnimation[]} All currently scheduled animation controls for
   *          this TJSPosition instance.
   */
  getScheduled() {
    return AnimationManager.getScheduled(this.#position);
  }
  /**
   * Provides a tween from given position data to the current position.
   *
   * @param {import('../index.js').TJSPositionDataExtended} fromData - The starting position.
   *
   * @param {object}         [opts] - Optional parameters.
   *
   * @param {number}         [opts.delay=0] - Delay in seconds before animation starts.
   *
   * @param {number}         [opts.duration=1] - Duration in seconds.
   *
   * @param {Function}       [opts.ease=cubicOut] - Easing function.
   *
   * @param {Function}       [opts.interpolate=lerp] - Interpolation function.
   *
   * @returns {import('#runtime/util/animate').TJSBasicAnimation}  A control object that can cancel animation and
   *          provides a `finished` Promise.
   */
  from(fromData, { delay = 0, duration = 1, ease = cubicOut, interpolate = lerp } = {}) {
    if (!isObject(fromData)) {
      throw new TypeError(`AnimationAPI.from error: 'fromData' is not an object.`);
    }
    const position = this.#position;
    const parent = position.parent;
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      return AnimationControl.voidControl;
    }
    const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
    const el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;
    if (!Number.isFinite(delay) || delay < 0) {
      throw new TypeError(`AnimationAPI.from error: 'delay' is not a positive number.`);
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError(`AnimationAPI.from error: 'duration' is not a positive number.`);
    }
    if (typeof ease !== "function") {
      throw new TypeError(`AnimationAPI.from error: 'ease' is not a function.`);
    }
    if (typeof interpolate !== "function") {
      throw new TypeError(`AnimationAPI.from error: 'interpolate' is not a function.`);
    }
    const initial = {};
    const destination = {};
    const data = this.#data;
    for (const key in fromData) {
      if (data[key] !== void 0 && fromData[key] !== data[key]) {
        initial[key] = fromData[key];
        destination[key] = data[key];
      }
    }
    convertRelative(initial, data);
    return this.#addAnimation(initial, destination, duration, el, delay, ease, interpolate);
  }
  /**
   * Provides a tween from given position data to the current position.
   *
   * @param {import('../index.js').TJSPositionDataExtended} fromData - The starting position.
   *
   * @param {import('../index.js').TJSPositionDataExtended} toData - The ending position.
   *
   * @param {object}         [opts] - Optional parameters.
   *
   * @param {number}         [opts.delay=0] - Delay in seconds before animation starts.
   *
   * @param {number}         [opts.duration=1] - Duration in seconds.
   *
   * @param {Function}       [opts.ease=cubicOut] - Easing function.
   *
   * @param {Function}       [opts.interpolate=lerp] - Interpolation function.
   *
   * @returns {import('#runtime/util/animate').TJSBasicAnimation}  A control object that can cancel animation and
   *          provides a `finished` Promise.
   */
  fromTo(fromData, toData, { delay = 0, duration = 1, ease = cubicOut, interpolate = lerp } = {}) {
    if (!isObject(fromData)) {
      throw new TypeError(`AnimationAPI.fromTo error: 'fromData' is not an object.`);
    }
    if (!isObject(toData)) {
      throw new TypeError(`AnimationAPI.fromTo error: 'toData' is not an object.`);
    }
    const parent = this.#position.parent;
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      return AnimationControl.voidControl;
    }
    const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
    const el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;
    if (!Number.isFinite(delay) || delay < 0) {
      throw new TypeError(`AnimationAPI.fromTo error: 'delay' is not a positive number.`);
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError(`AnimationAPI.fromTo error: 'duration' is not a positive number.`);
    }
    if (typeof ease !== "function") {
      throw new TypeError(`AnimationAPI.fromTo error: 'ease' is not a function.`);
    }
    if (typeof interpolate !== "function") {
      throw new TypeError(`AnimationAPI.fromTo error: 'interpolate' is not a function.`);
    }
    const initial = {};
    const destination = {};
    const data = this.#data;
    for (const key in fromData) {
      if (toData[key] === void 0) {
        console.warn(
          `AnimationAPI.fromTo warning: key ('${key}') from 'fromData' missing in 'toData'; skipping this key.`
        );
        continue;
      }
      if (data[key] !== void 0) {
        initial[key] = fromData[key];
        destination[key] = toData[key];
      }
    }
    convertRelative(initial, data);
    convertRelative(destination, data);
    return this.#addAnimation(initial, destination, duration, el, delay, ease, interpolate);
  }
  /**
   * Provides a tween to given position data from the current position.
   *
   * @param {import('../index.js').TJSPositionDataExtended} toData - The destination position.
   *
   * @param {object}         [opts] - Optional parameters.
   *
   * @param {number}         [opts.delay=0] - Delay in seconds before animation starts.
   *
   * @param {number}         [opts.duration=1] - Duration in seconds.
   *
   * @param {Function}       [opts.ease=cubicOut] - Easing function.
   *
   * @param {Function}       [opts.interpolate=lerp] - Interpolation function.
   *
   * @returns {import('#runtime/util/animate').TJSBasicAnimation}  A control object that can cancel animation and
   *          provides a `finished` Promise.
   */
  to(toData, { delay = 0, duration = 1, ease = cubicOut, interpolate = lerp } = {}) {
    if (!isObject(toData)) {
      throw new TypeError(`AnimationAPI.to error: 'toData' is not an object.`);
    }
    const parent = this.#position.parent;
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      return AnimationControl.voidControl;
    }
    const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
    const el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;
    if (!Number.isFinite(delay) || delay < 0) {
      throw new TypeError(`AnimationAPI.to error: 'delay' is not a positive number.`);
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError(`AnimationAPI.to error: 'duration' is not a positive number.`);
    }
    if (typeof ease !== "function") {
      throw new TypeError(`AnimationAPI.to error: 'ease' is not a function.`);
    }
    if (typeof interpolate !== "function") {
      throw new TypeError(`AnimationAPI.to error: 'interpolate' is not a function.`);
    }
    const initial = {};
    const destination = {};
    const data = this.#data;
    for (const key in toData) {
      if (data[key] !== void 0 && toData[key] !== data[key]) {
        destination[key] = toData[key];
        initial[key] = data[key];
      }
    }
    convertRelative(destination, data);
    return this.#addAnimation(initial, destination, duration, el, delay, ease, interpolate);
  }
  /**
   * Returns a function that provides an optimized way to constantly update a to-tween.
   *
   * @param {Iterable<string>}  keys - The keys for quickTo.
   *
   * @param {object}            [opts] - Optional parameters.
   *
   * @param {number}            [opts.duration=1] - Duration in seconds.
   *
   * @param {Function}          [opts.ease=cubicOut] - Easing function.
   *
   * @param {Function}          [opts.interpolate=lerp] - Interpolation function.
   *
   * @returns {import('../index.js').quickToCallback} quick-to tween function.
   */
  quickTo(keys, { duration = 1, ease = cubicOut, interpolate = lerp } = {}) {
    if (!isIterable(keys)) {
      throw new TypeError(`AnimationAPI.quickTo error: 'keys' is not an iterable list.`);
    }
    const parent = this.#position.parent;
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      throw new Error(`AnimationAPI.quickTo error: 'parent' is not positionable.`);
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError(`AnimationAPI.quickTo error: 'duration' is not a positive number.`);
    }
    if (typeof ease !== "function") {
      throw new TypeError(`AnimationAPI.quickTo error: 'ease' is not a function.`);
    }
    if (typeof interpolate !== "function") {
      throw new TypeError(`AnimationAPI.quickTo error: 'interpolate' is not a function.`);
    }
    const initial = {};
    const destination = {};
    const data = this.#data;
    for (const key of keys) {
      if (typeof key !== "string") {
        throw new TypeError(`AnimationAPI.quickTo error: key is not a string.`);
      }
      if (!animateKeys.has(key)) {
        throw new Error(`AnimationAPI.quickTo error: key ('${key}') is not animatable.`);
      }
      if (data[key] !== void 0) {
        destination[key] = data[key];
        initial[key] = data[key];
      }
    }
    const keysArray = [...keys];
    Object.freeze(keysArray);
    const newData = Object.assign({ immediateElementUpdate: true }, initial);
    const animationData = {
      active: true,
      cleanup: this.#cleanup,
      cancelled: false,
      control: void 0,
      current: 0,
      destination,
      duration: duration * 1e3,
      // Internally the AnimationManager works in ms.
      ease,
      el: void 0,
      finished: true,
      // Note: start in finished state to add to AnimationManager on first callback.
      initial,
      interpolate,
      keys,
      newData,
      position: this.#position,
      resolve: void 0,
      start: void 0
    };
    const quickToCB = (...args) => {
      const argsLength = args.length;
      if (argsLength === 0) {
        return;
      }
      for (let cntr = keysArray.length; --cntr >= 0; ) {
        const key = keysArray[cntr];
        if (data[key] !== void 0) {
          initial[key] = data[key];
        }
      }
      if (isObject(args[0])) {
        const objData = args[0];
        for (const key in objData) {
          if (destination[key] !== void 0) {
            destination[key] = objData[key];
          }
        }
      } else {
        for (let cntr = 0; cntr < argsLength && cntr < keysArray.length; cntr++) {
          const key = keysArray[cntr];
          if (destination[key] !== void 0) {
            destination[key] = args[cntr];
          }
        }
      }
      convertRelative(destination, data);
      setNumericDefaults(initial);
      setNumericDefaults(destination);
      const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
      animationData.el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;
      if (animationData.finished) {
        animationData.finished = false;
        animationData.active = true;
        animationData.current = 0;
        this.#instanceCount++;
        AnimationManager.add(animationData);
      } else {
        const now2 = performance.now();
        animationData.start = now2 + (AnimationManager.current - now2);
        animationData.current = 0;
      }
    };
    quickToCB.keys = keysArray;
    quickToCB.options = ({ duration: duration2, ease: ease2, interpolate: interpolate2 } = {}) => {
      if (duration2 !== void 0 && (!Number.isFinite(duration2) || duration2 < 0)) {
        throw new TypeError(`AnimationAPI.quickTo.options error: 'duration' is not a positive number.`);
      }
      if (ease2 !== void 0 && typeof ease2 !== "function") {
        throw new TypeError(`AnimationAPI.quickTo.options error: 'ease' is not a function.`);
      }
      if (interpolate2 !== void 0 && typeof interpolate2 !== "function") {
        throw new TypeError(`AnimationAPI.quickTo.options error: 'interpolate' is not a function.`);
      }
      if (duration2 >= 0) {
        animationData.duration = duration2 * 1e3;
      }
      if (ease2) {
        animationData.ease = ease2;
      }
      if (interpolate2) {
        animationData.interpolate = interpolate2;
      }
      return quickToCB;
    };
    return quickToCB;
  }
}
class AnimationGroupControl {
  /** @type {import('./AnimationControl').AnimationControl[]} */
  #animationControls;
  /** @type {Promise<Awaited<unknown>[]>} */
  #finishedPromise;
  /**
   * Defines a static empty / void animation control.
   *
   * @type {AnimationGroupControl}
   */
  static #voidControl = new AnimationGroupControl(null);
  /**
   * Provides a static void / undefined AnimationGroupControl that is automatically resolved.
   *
   * @returns {AnimationGroupControl} Void AnimationGroupControl
   */
  static get voidControl() {
    return this.#voidControl;
  }
  /**
   * @param {import('./AnimationControl').AnimationControl[]} animationControls - An array of AnimationControl
   *        instances.
   */
  constructor(animationControls) {
    this.#animationControls = animationControls;
  }
  /**
   * Get a promise that resolves when all animations are finished.
   *
   * @returns {Promise<Awaited<unknown>[]>|Promise<void>} Finished Promise for all animations.
   */
  get finished() {
    const animationControls = this.#animationControls;
    if (animationControls === null || animationControls === void 0) {
      return Promise.resolve();
    }
    if (!(this.#finishedPromise instanceof Promise)) {
      const promises = [];
      for (let cntr = animationControls.length; --cntr >= 0; ) {
        promises.push(animationControls[cntr].finished);
      }
      this.#finishedPromise = Promise.all(promises);
    }
    return this.#finishedPromise;
  }
  /**
   * Returns whether there are active animation instances for this group.
   *
   * Note: a delayed animation may not be started / active yet. Use {@link AnimationGroupControl.isFinished} to
   * determine if all animations in the group are finished.
   *
   * @returns {boolean} Are there active animation instances.
   */
  get isActive() {
    const animationControls = this.#animationControls;
    if (animationControls === null || animationControls === void 0) {
      return false;
    }
    for (let cntr = animationControls.length; --cntr >= 0; ) {
      if (animationControls[cntr].isActive) {
        return true;
      }
    }
    return false;
  }
  /**
   * Returns whether all animations in the group are finished.
   *
   * @returns {boolean} Are all animation instances finished.
   */
  get isFinished() {
    const animationControls = this.#animationControls;
    if (animationControls === null || animationControls === void 0) {
      return true;
    }
    for (let cntr = animationControls.length; --cntr >= 0; ) {
      if (!animationControls[cntr].isFinished) {
        return false;
      }
    }
    return false;
  }
  /**
   * Cancels the all animations.
   */
  cancel() {
    const animationControls = this.#animationControls;
    if (animationControls === null || animationControls === void 0) {
      return;
    }
    for (let cntr = this.#animationControls.length; --cntr >= 0; ) {
      this.#animationControls[cntr].cancel();
    }
  }
}
class AnimationGroupAPI {
  /**
   * Checks of the given object is a TJSPosition instance by checking for AnimationAPI.
   *
   * @param {*}  object - Any data.
   *
   * @returns {boolean} Is TJSPosition.
   */
  static #isPosition(object) {
    return isObject(object) && object.animate instanceof AnimationAPI;
  }
  /**
   * Cancels any animation for given TJSPosition data.
   *
   * @param {import('../').TJSPosition | {position: import('../').TJSPosition} | Iterable<import('../').TJSPosition> | Iterable<{position: import('../').TJSPosition}>} position -
   */
  static cancel(position) {
    if (isIterable(position)) {
      let index = -1;
      for (const entry of position) {
        index++;
        const actualPosition = this.#isPosition(entry) ? entry : entry.position;
        if (!this.#isPosition(actualPosition)) {
          console.warn(`AnimationGroupAPI.cancel warning: No Position instance found at index: ${index}.`);
          continue;
        }
        AnimationManager.cancel(actualPosition);
      }
    } else {
      const actualPosition = this.#isPosition(position) ? position : position.position;
      if (!this.#isPosition(actualPosition)) {
        console.warn(`AnimationGroupAPI.cancel warning: No Position instance found.`);
        return;
      }
      AnimationManager.cancel(actualPosition);
    }
  }
  /**
   * Cancels all TJSPosition animation.
   */
  static cancelAll() {
    AnimationManager.cancelAll();
  }
  /**
   * Gets all animation controls for the given position data.
   *
   * @param {import('../').TJSPosition | {position: import('../').TJSPosition} | Iterable<import('../').TJSPosition> | Iterable<{position: import('../').TJSPosition}>} position -
   *
   * @returns {{ position: import('../').TJSPosition, data: object | void, controls: import('./AnimationControl').AnimationControl[]}[]} Results array.
   */
  static getScheduled(position) {
    const results = [];
    if (isIterable(position)) {
      let index = -1;
      for (const entry of position) {
        index++;
        const isPosition = this.#isPosition(entry);
        const actualPosition = isPosition ? entry : entry.position;
        if (!this.#isPosition(actualPosition)) {
          console.warn(`AnimationGroupAPI.getScheduled warning: No Position instance found at index: ${index}.`);
          continue;
        }
        const controls = AnimationManager.getScheduled(actualPosition);
        results.push({ position: actualPosition, data: isPosition ? void 0 : entry, controls });
      }
    } else {
      const isPosition = this.#isPosition(position);
      const actualPosition = isPosition ? position : position.position;
      if (!this.#isPosition(actualPosition)) {
        console.warn(`AnimationGroupAPI.getScheduled warning: No Position instance found.`);
        return results;
      }
      const controls = AnimationManager.getScheduled(actualPosition);
      results.push({ position: actualPosition, data: isPosition ? void 0 : position, controls });
    }
    return results;
  }
  /**
   * Provides the `from` animation tween for one or more TJSPosition instances as a group.
   *
   * @param {import('../').TJSPosition | {position: import('../').TJSPosition} | Iterable<import('../').TJSPosition> | Iterable<{position: import('../').TJSPosition}>} position -
   *
   * @param {object|Function}   fromData -
   *
   * @param {object|Function}   options -
   *
   * @returns {import('#runtime/util/animate').TJSBasicAnimation} Basic animation control.
   */
  static from(position, fromData, options) {
    if (!isObject(fromData) && typeof fromData !== "function") {
      throw new TypeError(`AnimationGroupAPI.from error: 'fromData' is not an object or function.`);
    }
    if (options !== void 0 && !isObject(options) && typeof options !== "function") {
      throw new TypeError(`AnimationGroupAPI.from error: 'options' is not an object or function.`);
    }
    const animationControls = [];
    let index = -1;
    let callbackOptions;
    const hasDataCallback = typeof fromData === "function";
    const hasOptionCallback = typeof options === "function";
    const hasCallback = hasDataCallback || hasOptionCallback;
    if (hasCallback) {
      callbackOptions = { index, position: void 0, data: void 0 };
    }
    let actualFromData = fromData;
    let actualOptions = options;
    if (isIterable(position)) {
      for (const entry of position) {
        index++;
        const isPosition = this.#isPosition(entry);
        const actualPosition = isPosition ? entry : entry.position;
        if (!this.#isPosition(actualPosition)) {
          console.warn(`AnimationGroupAPI.from warning: No Position instance found at index: ${index}.`);
          continue;
        }
        if (hasCallback) {
          callbackOptions.index = index;
          callbackOptions.position = position;
          callbackOptions.data = isPosition ? void 0 : entry;
        }
        if (hasDataCallback) {
          actualFromData = fromData(callbackOptions);
          if (actualFromData === null || actualFromData === void 0) {
            continue;
          }
          if (!isObject(actualFromData)) {
            throw new TypeError(`AnimationGroupAPI.from error: fromData callback function iteration(${index}) failed to return an object.`);
          }
        }
        if (hasOptionCallback) {
          actualOptions = options(callbackOptions);
          if (actualOptions === null || actualOptions === void 0) {
            continue;
          }
          if (!isObject(actualOptions)) {
            throw new TypeError(`AnimationGroupAPI.from error: options callback function iteration(${index}) failed to return an object.`);
          }
        }
        animationControls.push(actualPosition.animate.from(actualFromData, actualOptions));
      }
    } else {
      const isPosition = this.#isPosition(position);
      const actualPosition = isPosition ? position : position.position;
      if (!this.#isPosition(actualPosition)) {
        console.warn(`AnimationGroupAPI.from warning: No Position instance found.`);
        return AnimationGroupControl.voidControl;
      }
      if (hasCallback) {
        callbackOptions.index = 0;
        callbackOptions.position = position;
        callbackOptions.data = isPosition ? void 0 : position;
      }
      if (hasDataCallback) {
        actualFromData = fromData(callbackOptions);
        if (!isObject(actualFromData)) {
          throw new TypeError(
            `AnimationGroupAPI.from error: fromData callback function failed to return an object.`
          );
        }
      }
      if (hasOptionCallback) {
        actualOptions = options(callbackOptions);
        if (!isObject(actualOptions)) {
          throw new TypeError(
            `AnimationGroupAPI.from error: options callback function failed to return an object.`
          );
        }
      }
      animationControls.push(actualPosition.animate.from(actualFromData, actualOptions));
    }
    return new AnimationGroupControl(animationControls);
  }
  /**
   * Provides the `fromTo` animation tween for one or more TJSPosition instances as a group.
   *
   * @param {import('../').TJSPosition | {position: import('../').TJSPosition} | Iterable<import('../').TJSPosition> | Iterable<{position: import('../').TJSPosition}>} position -
   *
   * @param {object|Function}   fromData -
   *
   * @param {object|Function}   toData -
   *
   * @param {object|Function}   options -
   *
   * @returns {import('#runtime/util/animate').TJSBasicAnimation} Basic animation control.
   */
  static fromTo(position, fromData, toData, options) {
    if (!isObject(fromData) && typeof fromData !== "function") {
      throw new TypeError(`AnimationGroupAPI.fromTo error: 'fromData' is not an object or function.`);
    }
    if (!isObject(toData) && typeof toData !== "function") {
      throw new TypeError(`AnimationGroupAPI.fromTo error: 'toData' is not an object or function.`);
    }
    if (options !== void 0 && !isObject(options) && typeof options !== "function") {
      throw new TypeError(`AnimationGroupAPI.fromTo error: 'options' is not an object or function.`);
    }
    const animationControls = [];
    let index = -1;
    let callbackOptions;
    const hasFromCallback = typeof fromData === "function";
    const hasToCallback = typeof toData === "function";
    const hasOptionCallback = typeof options === "function";
    const hasCallback = hasFromCallback || hasToCallback || hasOptionCallback;
    if (hasCallback) {
      callbackOptions = { index, position: void 0, data: void 0 };
    }
    let actualFromData = fromData;
    let actualToData = toData;
    let actualOptions = options;
    if (isIterable(position)) {
      for (const entry of position) {
        index++;
        const isPosition = this.#isPosition(entry);
        const actualPosition = isPosition ? entry : entry.position;
        if (!this.#isPosition(actualPosition)) {
          console.warn(`AnimationGroupAPI.fromTo warning: No Position instance found at index: ${index}.`);
          continue;
        }
        if (hasCallback) {
          callbackOptions.index = index;
          callbackOptions.position = position;
          callbackOptions.data = isPosition ? void 0 : entry;
        }
        if (hasFromCallback) {
          actualFromData = fromData(callbackOptions);
          if (actualFromData === null || actualFromData === void 0) {
            continue;
          }
          if (!isObject(actualFromData)) {
            throw new TypeError(`AnimationGroupAPI.fromTo error: fromData callback function iteration(${index}) failed to return an object.`);
          }
        }
        if (hasToCallback) {
          actualToData = toData(callbackOptions);
          if (actualToData === null || actualToData === void 0) {
            continue;
          }
          if (!isObject(actualToData)) {
            throw new TypeError(`AnimationGroupAPI.fromTo error: toData callback function iteration(${index}) failed to return an object.`);
          }
        }
        if (hasOptionCallback) {
          actualOptions = options(callbackOptions);
          if (actualOptions === null || actualOptions === void 0) {
            continue;
          }
          if (!isObject(actualOptions)) {
            throw new TypeError(`AnimationGroupAPI.fromTo error: options callback function iteration(${index}) failed to return an object.`);
          }
        }
        animationControls.push(actualPosition.animate.fromTo(actualFromData, actualToData, actualOptions));
      }
    } else {
      const isPosition = this.#isPosition(position);
      const actualPosition = isPosition ? position : position.position;
      if (!this.#isPosition(actualPosition)) {
        console.warn(`AnimationGroupAPI.fromTo warning: No Position instance found.`);
        return AnimationGroupControl.voidControl;
      }
      if (hasCallback) {
        callbackOptions.index = 0;
        callbackOptions.position = position;
        callbackOptions.data = isPosition ? void 0 : position;
      }
      if (hasFromCallback) {
        actualFromData = fromData(callbackOptions);
        if (!isObject(actualFromData)) {
          throw new TypeError(
            `AnimationGroupAPI.fromTo error: fromData callback function failed to return an object.`
          );
        }
      }
      if (hasToCallback) {
        actualToData = toData(callbackOptions);
        if (!isObject(actualToData)) {
          throw new TypeError(
            `AnimationGroupAPI.fromTo error: toData callback function failed to return an object.`
          );
        }
      }
      if (hasOptionCallback) {
        actualOptions = options(callbackOptions);
        if (!isObject(actualOptions)) {
          throw new TypeError(
            `AnimationGroupAPI.fromTo error: options callback function failed to return an object.`
          );
        }
      }
      animationControls.push(actualPosition.animate.fromTo(actualFromData, actualToData, actualOptions));
    }
    return new AnimationGroupControl(animationControls);
  }
  /**
   * Provides the `to` animation tween for one or more TJSPosition instances as a group.
   *
   * @param {import('../').TJSPosition | {position: import('../').TJSPosition} | Iterable<import('../').TJSPosition> | Iterable<{position: import('../').TJSPosition}>} position -
   *
   * @param {object|Function}   toData -
   *
   * @param {object|Function}   options -
   *
   * @returns {import('#runtime/util/animate').TJSBasicAnimation} Basic animation control.
   */
  static to(position, toData, options) {
    if (!isObject(toData) && typeof toData !== "function") {
      throw new TypeError(`AnimationGroupAPI.to error: 'toData' is not an object or function.`);
    }
    if (options !== void 0 && !isObject(options) && typeof options !== "function") {
      throw new TypeError(`AnimationGroupAPI.to error: 'options' is not an object or function.`);
    }
    const animationControls = [];
    let index = -1;
    let callbackOptions;
    const hasDataCallback = typeof toData === "function";
    const hasOptionCallback = typeof options === "function";
    const hasCallback = hasDataCallback || hasOptionCallback;
    if (hasCallback) {
      callbackOptions = { index, position: void 0, data: void 0 };
    }
    let actualToData = toData;
    let actualOptions = options;
    if (isIterable(position)) {
      for (const entry of position) {
        index++;
        const isPosition = this.#isPosition(entry);
        const actualPosition = isPosition ? entry : entry.position;
        if (!this.#isPosition(actualPosition)) {
          console.warn(`AnimationGroupAPI.to warning: No Position instance found at index: ${index}.`);
          continue;
        }
        if (hasCallback) {
          callbackOptions.index = index;
          callbackOptions.position = position;
          callbackOptions.data = isPosition ? void 0 : entry;
        }
        if (hasDataCallback) {
          actualToData = toData(callbackOptions);
          if (actualToData === null || actualToData === void 0) {
            continue;
          }
          if (!isObject(actualToData)) {
            throw new TypeError(`AnimationGroupAPI.to error: toData callback function iteration(${index}) failed to return an object.`);
          }
        }
        if (hasOptionCallback) {
          actualOptions = options(callbackOptions);
          if (actualOptions === null || actualOptions === void 0) {
            continue;
          }
          if (!isObject(actualOptions)) {
            throw new TypeError(`AnimationGroupAPI.to error: options callback function iteration(${index}) failed to return an object.`);
          }
        }
        animationControls.push(actualPosition.animate.to(actualToData, actualOptions));
      }
    } else {
      const isPosition = this.#isPosition(position);
      const actualPosition = isPosition ? position : position.position;
      if (!this.#isPosition(actualPosition)) {
        console.warn(`AnimationGroupAPI.to warning: No Position instance found.`);
        return AnimationGroupControl.voidControl;
      }
      if (hasCallback) {
        callbackOptions.index = 0;
        callbackOptions.position = position;
        callbackOptions.data = isPosition ? void 0 : position;
      }
      if (hasDataCallback) {
        actualToData = toData(callbackOptions);
        if (!isObject(actualToData)) {
          throw new TypeError(
            `AnimationGroupAPI.to error: toData callback function failed to return an object.`
          );
        }
      }
      if (hasOptionCallback) {
        actualOptions = options(callbackOptions);
        if (!isObject(actualOptions)) {
          throw new TypeError(
            `AnimationGroupAPI.to error: options callback function failed to return an object.`
          );
        }
      }
      animationControls.push(actualPosition.animate.to(actualToData, actualOptions));
    }
    return new AnimationGroupControl(animationControls);
  }
  /**
   * Provides the `to` animation tween for one or more TJSPosition instances as a group.
   *
   * @param {import('../').TJSPosition | {position: import('../').TJSPosition} | Iterable<import('../').TJSPosition> | Iterable<{position: import('../').TJSPosition}>} position -
   *
   * @param {Iterable<string>}  keys -
   *
   * @param {object|Function}   options -
   *
   * @returns {import('../').quickToCallback} Basic animation control.
   */
  static quickTo(position, keys, options) {
    if (!isIterable(keys)) {
      throw new TypeError(`AnimationGroupAPI.quickTo error: 'keys' is not an iterable list.`);
    }
    if (options !== void 0 && !isObject(options) && typeof options !== "function") {
      throw new TypeError(`AnimationGroupAPI.quickTo error: 'options' is not an object or function.`);
    }
    const quickToCallbacks = [];
    let index = -1;
    const hasOptionCallback = typeof options === "function";
    const callbackOptions = { index, position: void 0, data: void 0 };
    let actualOptions = options;
    if (isIterable(position)) {
      for (const entry of position) {
        index++;
        const isPosition = this.#isPosition(entry);
        const actualPosition = isPosition ? entry : entry.position;
        if (!this.#isPosition(actualPosition)) {
          console.warn(`AnimationGroupAPI.quickTo warning: No Position instance found at index: ${index}.`);
          continue;
        }
        callbackOptions.index = index;
        callbackOptions.position = position;
        callbackOptions.data = isPosition ? void 0 : entry;
        if (hasOptionCallback) {
          actualOptions = options(callbackOptions);
          if (actualOptions === null || actualOptions === void 0) {
            continue;
          }
          if (!isObject(actualOptions)) {
            throw new TypeError(`AnimationGroupAPI.quickTo error: options callback function iteration(${index}) failed to return an object.`);
          }
        }
        quickToCallbacks.push(actualPosition.animate.quickTo(keys, actualOptions));
      }
    } else {
      const isPosition = this.#isPosition(position);
      const actualPosition = isPosition ? position : position.position;
      if (!this.#isPosition(actualPosition)) {
        console.warn(`AnimationGroupAPI.quickTo warning: No Position instance found.`);
        return () => null;
      }
      callbackOptions.index = 0;
      callbackOptions.position = position;
      callbackOptions.data = isPosition ? void 0 : position;
      if (hasOptionCallback) {
        actualOptions = options(callbackOptions);
        if (!isObject(actualOptions)) {
          throw new TypeError(
            `AnimationGroupAPI.quickTo error: options callback function failed to return an object.`
          );
        }
      }
      quickToCallbacks.push(actualPosition.animate.quickTo(keys, actualOptions));
    }
    const keysArray = [...keys];
    Object.freeze(keysArray);
    const quickToCB = (...args) => {
      const argsLength = args.length;
      if (argsLength === 0) {
        return;
      }
      if (typeof args[0] === "function") {
        const dataCallback = args[0];
        index = -1;
        let cntr = 0;
        if (isIterable(position)) {
          for (const entry of position) {
            index++;
            const isPosition = this.#isPosition(entry);
            const actualPosition = isPosition ? entry : entry.position;
            if (!this.#isPosition(actualPosition)) {
              continue;
            }
            callbackOptions.index = index;
            callbackOptions.position = position;
            callbackOptions.data = isPosition ? void 0 : entry;
            const toData = dataCallback(callbackOptions);
            if (toData === null || toData === void 0) {
              continue;
            }
            const toDataIterable = isIterable(toData);
            if (!Number.isFinite(toData) && !toDataIterable && !isObject(toData)) {
              throw new TypeError(`AnimationGroupAPI.quickTo error: toData callback function iteration(${index}) failed to return a finite number, iterable list, or object.`);
            }
            if (toDataIterable) {
              quickToCallbacks[cntr++](...toData);
            } else {
              quickToCallbacks[cntr++](toData);
            }
          }
        } else {
          const isPosition = this.#isPosition(position);
          const actualPosition = isPosition ? position : position.position;
          if (!this.#isPosition(actualPosition)) {
            return;
          }
          callbackOptions.index = 0;
          callbackOptions.position = position;
          callbackOptions.data = isPosition ? void 0 : position;
          const toData = dataCallback(callbackOptions);
          if (toData === null || toData === void 0) {
            return;
          }
          const toDataIterable = isIterable(toData);
          if (!Number.isFinite(toData) && !toDataIterable && !isObject(toData)) {
            throw new TypeError(`AnimationGroupAPI.quickTo error: toData callback function iteration(${index}) failed to return a finite number, iterable list, or object.`);
          }
          if (toDataIterable) {
            quickToCallbacks[cntr++](...toData);
          } else {
            quickToCallbacks[cntr++](toData);
          }
        }
      } else {
        for (let cntr = quickToCallbacks.length; --cntr >= 0; ) {
          quickToCallbacks[cntr](...args);
        }
      }
    };
    quickToCB.keys = keysArray;
    quickToCB.options = (options2) => {
      if (options2 !== void 0 && !isObject(options2) && typeof options2 !== "function") {
        throw new TypeError(`AnimationGroupAPI.quickTo error: 'options' is not an object or function.`);
      }
      if (isObject(options2)) {
        for (let cntr = quickToCallbacks.length; --cntr >= 0; ) {
          quickToCallbacks[cntr].options(options2);
        }
      } else if (typeof options2 === "function") {
        if (isIterable(position)) {
          index = -1;
          let cntr = 0;
          for (const entry of position) {
            index++;
            const isPosition = this.#isPosition(entry);
            const actualPosition = isPosition ? entry : entry.position;
            if (!this.#isPosition(actualPosition)) {
              console.warn(
                `AnimationGroupAPI.quickTo.options warning: No Position instance found at index: ${index}.`
              );
              continue;
            }
            callbackOptions.index = index;
            callbackOptions.position = position;
            callbackOptions.data = isPosition ? void 0 : entry;
            actualOptions = options2(callbackOptions);
            if (actualOptions === null || actualOptions === void 0) {
              continue;
            }
            if (!isObject(actualOptions)) {
              throw new TypeError(
                `AnimationGroupAPI.quickTo.options error: options callback function iteration(${index}) failed to return an object.`
              );
            }
            quickToCallbacks[cntr++].options(actualOptions);
          }
        } else {
          const isPosition = this.#isPosition(position);
          const actualPosition = isPosition ? position : position.position;
          if (!this.#isPosition(actualPosition)) {
            console.warn(`AnimationGroupAPI.quickTo.options warning: No Position instance found.`);
            return quickToCB;
          }
          callbackOptions.index = 0;
          callbackOptions.position = position;
          callbackOptions.data = isPosition ? void 0 : position;
          actualOptions = options2(callbackOptions);
          if (!isObject(actualOptions)) {
            throw new TypeError(
              `AnimationGroupAPI.quickTo error: options callback function failed to return an object.`
            );
          }
          quickToCallbacks[0].options(actualOptions);
        }
      }
      return quickToCB;
    };
    return quickToCB;
  }
}
class Centered {
  /**
   * @type {HTMLElement}
   */
  #element;
  /**
   * Provides a manual setting of the element height. As things go `offsetHeight` causes a browser layout and is not
   * performance oriented. If manually set this height is used instead of `offsetHeight`.
   *
   * @type {number}
   */
  #height;
  /**
   * Set from an optional value in the constructor to lock accessors preventing modification.
   */
  #lock;
  /**
   * Provides a manual setting of the element width. As things go `offsetWidth` causes a browser layout and is not
   * performance oriented. If manually set this width is used instead of `offsetWidth`.
   *
   * @type {number}
   */
  #width;
  /**
   * @param {object}      [options] - Initial options.
   *
   * @param {HTMLElement} [options.element] - Target element.
   *
   * @param {boolean}     [options.lock=false] - Lock parameters from being set.
   *
   * @param {number}      [options.width] - Manual width.
   *
   * @param {number}      [options.height] - Manual height.
   */
  constructor({ element: element2, lock = false, width, height } = {}) {
    this.element = element2;
    this.width = width;
    this.height = height;
    this.#lock = typeof lock === "boolean" ? lock : false;
  }
  /**
   * @returns {HTMLElement|undefined|null} Target element.
   */
  get element() {
    return this.#element;
  }
  /**
   * @returns {number} Get manual height.
   */
  get height() {
    return this.#height;
  }
  /**
   * @returns {number} Get manual width.
   */
  get width() {
    return this.#width;
  }
  /**
   * @param {HTMLElement|undefined|null} element - Set target element.
   */
  set element(element2) {
    if (this.#lock) {
      return;
    }
    if (element2 === void 0 || element2 === null || element2 instanceof HTMLElement) {
      this.#element = element2;
    } else {
      throw new TypeError(`'element' is not a HTMLElement, undefined, or null.`);
    }
  }
  /**
   * @param {number}   height - Set manual height.
   */
  set height(height) {
    if (this.#lock) {
      return;
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
  }
  /**
   * @param {number}   width - Set manual width.
   */
  set width(width) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
  }
  /**
   * Set manual width & height.
   *
   * @param {number}   width - New manual width.
   *
   * @param {number}   height - New manual height.
   */
  setDimension(width, height) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
  }
  /**
   * Get the left constraint based on any manual target values or the browser inner width.
   *
   * @param {number}   width - Target width.
   *
   * @returns {number} Calculated left constraint.
   */
  getLeft(width) {
    const boundsWidth = this.#width ?? this.#element?.offsetWidth ?? globalThis.innerWidth;
    return (boundsWidth - width) / 2;
  }
  /**
   * Get the top constraint based on any manual target values or the browser inner height.
   *
   * @param {number}   height - Target height.
   *
   * @returns {number} Calculated top constraint.
   */
  getTop(height) {
    const boundsHeight = this.#height ?? this.#element?.offsetHeight ?? globalThis.innerHeight;
    return (boundsHeight - height) / 2;
  }
}
class PositionChangeSet {
  constructor() {
    this.left = false;
    this.top = false;
    this.width = false;
    this.height = false;
    this.maxHeight = false;
    this.maxWidth = false;
    this.minHeight = false;
    this.minWidth = false;
    this.zIndex = false;
    this.transform = false;
    this.transformOrigin = false;
  }
  hasChange() {
    return this.left || this.top || this.width || this.height || this.maxHeight || this.maxWidth || this.minHeight || this.minWidth || this.zIndex || this.transform || this.transformOrigin;
  }
  set(value) {
    this.left = value;
    this.top = value;
    this.width = value;
    this.height = value;
    this.maxHeight = value;
    this.maxWidth = value;
    this.minHeight = value;
    this.minWidth = value;
    this.zIndex = value;
    this.transform = value;
    this.transformOrigin = value;
  }
}
class TJSPositionData {
  constructor({
    height = null,
    left = null,
    maxHeight = null,
    maxWidth = null,
    minHeight = null,
    minWidth = null,
    rotateX = null,
    rotateY = null,
    rotateZ = null,
    scale = null,
    translateX = null,
    translateY = null,
    translateZ = null,
    top = null,
    transformOrigin = null,
    width = null,
    zIndex = null
  } = {}) {
    this.height = height;
    this.left = left;
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
    this.minHeight = minHeight;
    this.minWidth = minWidth;
    this.rotateX = rotateX;
    this.rotateY = rotateY;
    this.rotateZ = rotateZ;
    this.scale = scale;
    this.top = top;
    this.transformOrigin = transformOrigin;
    this.translateX = translateX;
    this.translateY = translateY;
    this.translateZ = translateZ;
    this.width = width;
    this.zIndex = zIndex;
    Object.seal(this);
  }
  /**
   * Copies given data to this instance.
   *
   * @param {TJSPositionData}   data - Copy from this instance.
   *
   * @returns {TJSPositionData} This instance.
   */
  copy(data) {
    this.height = data.height;
    this.left = data.left;
    this.maxHeight = data.maxHeight;
    this.maxWidth = data.maxWidth;
    this.minHeight = data.minHeight;
    this.minWidth = data.minWidth;
    this.rotateX = data.rotateX;
    this.rotateY = data.rotateY;
    this.rotateZ = data.rotateZ;
    this.scale = data.scale;
    this.top = data.top;
    this.transformOrigin = data.transformOrigin;
    this.translateX = data.translateX;
    this.translateY = data.translateY;
    this.translateZ = data.translateZ;
    this.width = data.width;
    this.zIndex = data.zIndex;
    return this;
  }
}
class PositionStateAPI {
  /** @type {import('./TJSPositionData').TJSPositionData} */
  #data;
  /**
   * @type {Map<string, import('./').TJSPositionDataExtended>}
   */
  #dataSaved = /* @__PURE__ */ new Map();
  /** @type {import('./').TJSPosition} */
  #position;
  /** @type {import('./transform').TJSTransforms} */
  #transforms;
  constructor(position, data, transforms) {
    this.#position = position;
    this.#data = data;
    this.#transforms = transforms;
  }
  /**
   * Returns any stored save state by name.
   *
   * @param {object}   options - Options
   *
   * @param {string}   options.name - Saved data set name.
   *
   * @returns {import('./').TJSPositionDataExtended} The saved data set.
   */
  get({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`Position - getSave error: 'name' is not a string.`);
    }
    return this.#dataSaved.get(name);
  }
  /**
   * Returns any associated default data.
   *
   * @returns {import('./').TJSPositionDataExtended} Associated default data.
   */
  getDefault() {
    return this.#dataSaved.get("#defaultData");
  }
  /**
   * Removes and returns any position state by name.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - Name to remove and retrieve.
   *
   * @returns {import('./').TJSPositionDataExtended} Saved position data.
   */
  remove({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`Position - remove: 'name' is not a string.`);
    }
    const data = this.#dataSaved.get(name);
    this.#dataSaved.delete(name);
    return data;
  }
  /**
   * Resets data to default values and invokes set.
   *
   * @param {object}   [opts] - Optional parameters.
   *
   * @param {boolean}  [opts.keepZIndex=false] - When true keeps current z-index.
   *
   * @param {boolean}  [opts.invokeSet=true] - When true invokes set method.
   *
   * @returns {boolean} Operation successful.
   */
  reset({ keepZIndex = false, invokeSet = true } = {}) {
    const defaultData = this.#dataSaved.get("#defaultData");
    if (!isObject(defaultData)) {
      return false;
    }
    if (this.#position.animate.isScheduled) {
      this.#position.animate.cancel();
    }
    const zIndex = this.#position.zIndex;
    const data = Object.assign({}, defaultData);
    if (keepZIndex) {
      data.zIndex = zIndex;
    }
    this.#transforms.reset(data);
    if (this.#position.parent?.reactive?.minimized) {
      this.#position.parent?.maximize?.({ animate: false, duration: 0 });
    }
    if (invokeSet) {
      setTimeout(() => this.#position.set(data), 0);
    }
    return true;
  }
  /**
      * Restores a saved positional state returning the data. Several optional parameters are available
      * to control whether the restore action occurs silently (no store / inline styles updates), animates
  -   * to the stored data, or simply sets the stored data. Restoring via {@link AnimationAPI.to}
      * allows specification of the duration, easing, and interpolate functions along with configuring a Promise to be
      * returned if awaiting the end of the animation.
      *
      * @param {object}            params - Parameters
      *
      * @param {string}            params.name - Saved data set name.
      *
      * @param {boolean}           [params.remove=false] - Remove data set.
      *
      * @param {Iterable<string>}  [params.properties] - Specific properties to set / animate.
      *
      * @param {boolean}           [params.silent] - Set position data directly; no store or style updates.
      *
      * @param {boolean}           [params.async=false] - If animating return a Promise that resolves with any saved data.
      *
      * @param {boolean}           [params.animateTo=false] - Animate to restore data.
      *
      * @param {number}            [params.duration=0.1] - Duration in seconds.
      *
      * @param {Function}          [params.ease=linear] - Easing function.
      *
      * @param {Function}          [params.interpolate=lerp] - Interpolation function.
      *
      * @returns {import('./').TJSPositionDataExtended | Promise<import('./').TJSPositionDataExtended>} Saved position
      *          data.
      */
  restore({
    name,
    remove = false,
    properties,
    silent = false,
    async = false,
    animateTo = false,
    duration = 0.1,
    ease = identity,
    interpolate = lerp
  }) {
    if (typeof name !== "string") {
      throw new TypeError(`Position - restore error: 'name' is not a string.`);
    }
    const dataSaved = this.#dataSaved.get(name);
    if (dataSaved) {
      if (remove) {
        this.#dataSaved.delete(name);
      }
      let data = dataSaved;
      if (isIterable(properties)) {
        data = {};
        for (const property of properties) {
          data[property] = dataSaved[property];
        }
      }
      if (silent) {
        for (const property in data) {
          this.#data[property] = data[property];
        }
        return dataSaved;
      } else if (animateTo) {
        if (data.transformOrigin !== this.#position.transformOrigin) {
          this.#position.transformOrigin = data.transformOrigin;
        }
        if (async) {
          return this.#position.animate.to(data, { duration, ease, interpolate }).finished.then(() => dataSaved);
        } else {
          this.#position.animate.to(data, { duration, ease, interpolate });
        }
      } else {
        this.#position.set(data);
      }
    }
    return dataSaved;
  }
  /**
   * Saves current position state with the opportunity to add extra data to the saved state.
   *
   * @param {object}   opts - Options.
   *
   * @param {string}   opts.name - name to index this saved data.
   *
   * @param {...*}     [opts.extra] - Extra data to add to saved data.
   *
   * @returns {import('./').TJSPositionData} Current position data
   */
  save({ name, ...extra }) {
    if (typeof name !== "string") {
      throw new TypeError(`Position - save error: 'name' is not a string.`);
    }
    const data = this.#position.get(extra);
    this.#dataSaved.set(name, data);
    return data;
  }
  /**
   * Directly sets a position state.
   *
   * @param {object}   opts - Options.
   *
   * @param {string}   opts.name - name to index this saved data.
   *
   * @param {...*}     [opts.data] - TJSPosition data to set.
   */
  set({ name, ...data }) {
    if (typeof name !== "string") {
      throw new TypeError(`Position - set error: 'name' is not a string.`);
    }
    this.#dataSaved.set(name, data);
  }
}
class StyleCache {
  constructor() {
    this.el = void 0;
    this.computed = void 0;
    this.marginLeft = void 0;
    this.marginTop = void 0;
    this.maxHeight = void 0;
    this.maxWidth = void 0;
    this.minHeight = void 0;
    this.minWidth = void 0;
    this.hasWillChange = false;
    this.resizeObserved = {
      contentHeight: void 0,
      contentWidth: void 0,
      offsetHeight: void 0,
      offsetWidth: void 0
    };
    const storeResizeObserved = writable(this.resizeObserved);
    this.stores = {
      element: writable(this.el),
      resizeContentHeight: propertyStore(storeResizeObserved, "contentHeight"),
      resizeContentWidth: propertyStore(storeResizeObserved, "contentWidth"),
      resizeObserved: storeResizeObserved,
      resizeOffsetHeight: propertyStore(storeResizeObserved, "offsetHeight"),
      resizeOffsetWidth: propertyStore(storeResizeObserved, "offsetWidth")
    };
  }
  /**
   * Returns the cached offsetHeight from any attached `resizeObserver` action otherwise gets the offsetHeight from
   * the element directly. The more optimized path is using `resizeObserver` as getting it from the element
   * directly is more expensive and alters the execution order of an animation frame.
   *
   * @returns {number} The element offsetHeight.
   */
  get offsetHeight() {
    if (this.el instanceof HTMLElement) {
      return this.resizeObserved.offsetHeight !== void 0 ? this.resizeObserved.offsetHeight : this.el.offsetHeight;
    }
    throw new Error(`StyleCache - get offsetHeight error: no element assigned.`);
  }
  /**
   * Returns the cached offsetWidth from any attached `resizeObserver` action otherwise gets the offsetWidth from
   * the element directly. The more optimized path is using `resizeObserver` as getting it from the element
   * directly is more expensive and alters the execution order of an animation frame.
   *
   * @returns {number} The element offsetHeight.
   */
  get offsetWidth() {
    if (this.el instanceof HTMLElement) {
      return this.resizeObserved.offsetWidth !== void 0 ? this.resizeObserved.offsetWidth : this.el.offsetWidth;
    }
    throw new Error(`StyleCache - get offsetWidth error: no element assigned.`);
  }
  /**
   * @param {HTMLElement} el -
   *
   * @returns {boolean} Does element match cached element.
   */
  hasData(el) {
    return this.el === el;
  }
  /**
   * Resets the style cache.
   */
  reset() {
    if (this.el instanceof HTMLElement && this.el.isConnected && !this.hasWillChange) {
      this.el.style.willChange = null;
    }
    this.el = void 0;
    this.computed = void 0;
    this.marginLeft = void 0;
    this.marginTop = void 0;
    this.maxHeight = void 0;
    this.maxWidth = void 0;
    this.minHeight = void 0;
    this.minWidth = void 0;
    this.hasWillChange = false;
    this.resizeObserved.contentHeight = void 0;
    this.resizeObserved.contentWidth = void 0;
    this.resizeObserved.offsetHeight = void 0;
    this.resizeObserved.offsetWidth = void 0;
    this.stores.element.set(void 0);
  }
  /**
   * Updates the style cache with new data from the given element.
   *
   * @param {HTMLElement} el - An HTML element.
   */
  update(el) {
    this.el = el;
    this.computed = globalThis.getComputedStyle(el);
    this.marginLeft = StyleParse.pixels(el.style.marginLeft) ?? StyleParse.pixels(this.computed.marginLeft);
    this.marginTop = StyleParse.pixels(el.style.marginTop) ?? StyleParse.pixels(this.computed.marginTop);
    this.maxHeight = StyleParse.pixels(el.style.maxHeight) ?? StyleParse.pixels(this.computed.maxHeight);
    this.maxWidth = StyleParse.pixels(el.style.maxWidth) ?? StyleParse.pixels(this.computed.maxWidth);
    this.minHeight = StyleParse.pixels(el.style.minHeight) ?? StyleParse.pixels(this.computed.minHeight);
    this.minWidth = StyleParse.pixels(el.style.minWidth) ?? StyleParse.pixels(this.computed.minWidth);
    const willChange = el.style.willChange !== "" ? el.style.willChange : this.computed.willChange;
    this.hasWillChange = willChange !== "" && willChange !== "auto";
    this.stores.element.set(el);
  }
}
class TJSTransformData {
  constructor() {
    Object.seal(this);
  }
  /**
   * Stores the calculated bounding rectangle.
   *
   * @type {DOMRect}
   */
  #boundingRect = new DOMRect();
  /**
   * Stores the individual transformed corner points of the window in screen space clockwise from:
   * top left -> top right -> bottom right -> bottom left.
   *
   * @type {import('#runtime/math/gl-matrix').Vec3[]}
   */
  #corners = [Vec3.create(), Vec3.create(), Vec3.create(), Vec3.create()];
  /**
   * Stores the current gl-matrix Mat4 data.
   *
   * @type {import('#runtime/math/gl-matrix').Mat4}
   */
  #mat4 = Mat4.create();
  /**
   * Stores the pre & post origin translations to apply to matrix transforms.
   *
   * @type {import('#runtime/math/gl-matrix').Mat4[]}
   */
  #originTranslations = [Mat4.create(), Mat4.create()];
  /**
   * @returns {DOMRect} The bounding rectangle.
   */
  get boundingRect() {
    return this.#boundingRect;
  }
  /**
   * @returns {import('#runtime/math/gl-matrix').Vec3[]} The transformed corner points as Vec3 in screen space.
   */
  get corners() {
    return this.#corners;
  }
  /**
   * @returns {string} Returns the CSS style string for the transform matrix.
   */
  get css() {
    return `matrix3d(${this.mat4.join(",")})`;
  }
  /**
   * @returns {import('#runtime/math/gl-matrix').Mat4} The transform matrix.
   */
  get mat4() {
    return this.#mat4;
  }
  /**
   * @returns {import('#runtime/math/gl-matrix').Mat4[]} The pre / post translation matrices for origin translation.
   */
  get originTranslations() {
    return this.#originTranslations;
  }
}
const s_SCALE_VECTOR = [1, 1, 1];
const s_TRANSLATE_VECTOR = [0, 0, 0];
const s_MAT4_RESULT = Mat4.create();
const s_MAT4_TEMP = Mat4.create();
const s_VEC3_TEMP = Vec3.create();
class TJSTransforms {
  /**
   * Stores the transform keys in the order added.
   *
   * @type {string[]}
   */
  #orderList = [];
  constructor() {
    this._data = {};
  }
  /**
   * @returns {boolean} Whether there are active transforms in local data.
   */
  get isActive() {
    return this.#orderList.length > 0;
  }
  /**
   * @returns {number|undefined} Any local rotateX data.
   */
  get rotateX() {
    return this._data.rotateX;
  }
  /**
   * @returns {number|undefined} Any local rotateY data.
   */
  get rotateY() {
    return this._data.rotateY;
  }
  /**
   * @returns {number|undefined} Any local rotateZ data.
   */
  get rotateZ() {
    return this._data.rotateZ;
  }
  /**
   * @returns {number|undefined} Any local rotateZ scale.
   */
  get scale() {
    return this._data.scale;
  }
  /**
   * @returns {number|undefined} Any local translateZ data.
   */
  get translateX() {
    return this._data.translateX;
  }
  /**
   * @returns {number|undefined} Any local translateZ data.
   */
  get translateY() {
    return this._data.translateY;
  }
  /**
   * @returns {number|undefined} Any local translateZ data.
   */
  get translateZ() {
    return this._data.translateZ;
  }
  /**
   * Sets the local rotateX data if the value is a finite number otherwise removes the local data.
   *
   * @param {number|null|undefined}   value - A value to set.
   */
  set rotateX(value) {
    if (Number.isFinite(value)) {
      if (this._data.rotateX === void 0) {
        this.#orderList.push("rotateX");
      }
      this._data.rotateX = value;
    } else {
      if (this._data.rotateX !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "rotateX");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.rotateX;
    }
  }
  /**
   * Sets the local rotateY data if the value is a finite number otherwise removes the local data.
   *
   * @param {number|null|undefined}   value - A value to set.
   */
  set rotateY(value) {
    if (Number.isFinite(value)) {
      if (this._data.rotateY === void 0) {
        this.#orderList.push("rotateY");
      }
      this._data.rotateY = value;
    } else {
      if (this._data.rotateY !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "rotateY");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.rotateY;
    }
  }
  /**
   * Sets the local rotateZ data if the value is a finite number otherwise removes the local data.
   *
   * @param {number|null|undefined}   value - A value to set.
   */
  set rotateZ(value) {
    if (Number.isFinite(value)) {
      if (this._data.rotateZ === void 0) {
        this.#orderList.push("rotateZ");
      }
      this._data.rotateZ = value;
    } else {
      if (this._data.rotateZ !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "rotateZ");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.rotateZ;
    }
  }
  /**
   * Sets the local scale data if the value is a finite number otherwise removes the local data.
   *
   * @param {number|null|undefined}   value - A value to set.
   */
  set scale(value) {
    if (Number.isFinite(value)) {
      if (this._data.scale === void 0) {
        this.#orderList.push("scale");
      }
      this._data.scale = value;
    } else {
      if (this._data.scale !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "scale");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.scale;
    }
  }
  /**
   * Sets the local translateX data if the value is a finite number otherwise removes the local data.
   *
   * @param {number|null|undefined}   value - A value to set.
   */
  set translateX(value) {
    if (Number.isFinite(value)) {
      if (this._data.translateX === void 0) {
        this.#orderList.push("translateX");
      }
      this._data.translateX = value;
    } else {
      if (this._data.translateX !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "translateX");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.translateX;
    }
  }
  /**
   * Sets the local translateY data if the value is a finite number otherwise removes the local data.
   *
   * @param {number|null|undefined}   value - A value to set.
   */
  set translateY(value) {
    if (Number.isFinite(value)) {
      if (this._data.translateY === void 0) {
        this.#orderList.push("translateY");
      }
      this._data.translateY = value;
    } else {
      if (this._data.translateY !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "translateY");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.translateY;
    }
  }
  /**
   * Sets the local translateZ data if the value is a finite number otherwise removes the local data.
   *
   * @param {number|null|undefined}   value - A value to set.
   */
  set translateZ(value) {
    if (Number.isFinite(value)) {
      if (this._data.translateZ === void 0) {
        this.#orderList.push("translateZ");
      }
      this._data.translateZ = value;
    } else {
      if (this._data.translateZ !== void 0) {
        const index = this.#orderList.findIndex((entry) => entry === "translateZ");
        if (index >= 0) {
          this.#orderList.splice(index, 1);
        }
      }
      delete this._data.translateZ;
    }
  }
  /**
   * Returns the matrix3d CSS transform for the given position / transform data.
   *
   * @param {object} [data] - Optional position data otherwise use local stored transform data.
   *
   * @returns {string} The CSS matrix3d string.
   */
  getCSS(data = this._data) {
    return `matrix3d(${this.getMat4(data, s_MAT4_RESULT).join(",")})`;
  }
  /**
   * Returns the matrix3d CSS transform for the given position / transform data.
   *
   * @param {object} [data] - Optional position data otherwise use local stored transform data.
   *
   * @returns {string} The CSS matrix3d string.
   */
  getCSSOrtho(data = this._data) {
    return `matrix3d(${this.getMat4Ortho(data, s_MAT4_RESULT).join(",")})`;
  }
  /**
   * Collects all data including a bounding rect, transform matrix, and points array of the given
   * {@link TJSPositionData} instance with the applied local transform data.
   *
   * @param {import('../').TJSPositionData} position - The position data to process.
   *
   * @param {TJSTransformData} [output] - Optional TJSTransformData output instance.
   *
   * @param {object} [validationData] - Optional validation data for adjustment parameters.
   *
   * @returns {TJSTransformData} The output TJSTransformData instance.
   */
  getData(position, output = new TJSTransformData(), validationData = {}) {
    const valWidth = validationData.width ?? 0;
    const valHeight = validationData.height ?? 0;
    const valOffsetTop = validationData.offsetTop ?? validationData.marginTop ?? 0;
    const valOffsetLeft = validationData.offsetLeft ?? validationData.offsetLeft ?? 0;
    position.top += valOffsetTop;
    position.left += valOffsetLeft;
    const width = Number.isFinite(position.width) ? position.width : valWidth;
    const height = Number.isFinite(position.height) ? position.height : valHeight;
    const rect = output.corners;
    if (this.hasTransform(position)) {
      rect[0][0] = rect[0][1] = rect[0][2] = 0;
      rect[1][0] = width;
      rect[1][1] = rect[1][2] = 0;
      rect[2][0] = width;
      rect[2][1] = height;
      rect[2][2] = 0;
      rect[3][0] = 0;
      rect[3][1] = height;
      rect[3][2] = 0;
      const matrix = this.getMat4(position, output.mat4);
      const translate = s_GET_ORIGIN_TRANSLATION(position.transformOrigin, width, height, output.originTranslations);
      if (transformOriginDefault === position.transformOrigin) {
        Vec3.transformMat4(rect[0], rect[0], matrix);
        Vec3.transformMat4(rect[1], rect[1], matrix);
        Vec3.transformMat4(rect[2], rect[2], matrix);
        Vec3.transformMat4(rect[3], rect[3], matrix);
      } else {
        Vec3.transformMat4(rect[0], rect[0], translate[0]);
        Vec3.transformMat4(rect[0], rect[0], matrix);
        Vec3.transformMat4(rect[0], rect[0], translate[1]);
        Vec3.transformMat4(rect[1], rect[1], translate[0]);
        Vec3.transformMat4(rect[1], rect[1], matrix);
        Vec3.transformMat4(rect[1], rect[1], translate[1]);
        Vec3.transformMat4(rect[2], rect[2], translate[0]);
        Vec3.transformMat4(rect[2], rect[2], matrix);
        Vec3.transformMat4(rect[2], rect[2], translate[1]);
        Vec3.transformMat4(rect[3], rect[3], translate[0]);
        Vec3.transformMat4(rect[3], rect[3], matrix);
        Vec3.transformMat4(rect[3], rect[3], translate[1]);
      }
      rect[0][0] = position.left + rect[0][0];
      rect[0][1] = position.top + rect[0][1];
      rect[1][0] = position.left + rect[1][0];
      rect[1][1] = position.top + rect[1][1];
      rect[2][0] = position.left + rect[2][0];
      rect[2][1] = position.top + rect[2][1];
      rect[3][0] = position.left + rect[3][0];
      rect[3][1] = position.top + rect[3][1];
    } else {
      rect[0][0] = position.left;
      rect[0][1] = position.top;
      rect[1][0] = position.left + width;
      rect[1][1] = position.top;
      rect[2][0] = position.left + width;
      rect[2][1] = position.top + height;
      rect[3][0] = position.left;
      rect[3][1] = position.top + height;
      Mat4.identity(output.mat4);
    }
    let maxX = Number.MIN_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    for (let cntr = 4; --cntr >= 0; ) {
      if (rect[cntr][0] > maxX) {
        maxX = rect[cntr][0];
      }
      if (rect[cntr][0] < minX) {
        minX = rect[cntr][0];
      }
      if (rect[cntr][1] > maxY) {
        maxY = rect[cntr][1];
      }
      if (rect[cntr][1] < minY) {
        minY = rect[cntr][1];
      }
    }
    const boundingRect = output.boundingRect;
    boundingRect.x = minX;
    boundingRect.y = minY;
    boundingRect.width = maxX - minX;
    boundingRect.height = maxY - minY;
    position.top -= valOffsetTop;
    position.left -= valOffsetLeft;
    return output;
  }
  /**
   * Creates a transform matrix based on local data applied in order it was added.
   *
   * If no data object is provided then the source is the local transform data. If another data object is supplied
   * then the stored local transform order is applied then all remaining transform keys are applied. This allows the
   * construction of a transform matrix in advance of setting local data and is useful in collision detection.
   *
   * @param {object}   [data] - TJSPositionData instance or local transform data.
   *
   * @param {import('#runtime/math/gl-matrix').Mat4}  [output] - The output mat4 instance.
   *
   * @returns {import('#runtime/math/gl-matrix').Mat4} Transform matrix.
   */
  getMat4(data = this._data, output = Mat4.create()) {
    const matrix = Mat4.identity(output);
    let seenKeys = 0;
    const orderList = this.#orderList;
    for (let cntr = 0; cntr < orderList.length; cntr++) {
      const key = orderList[cntr];
      switch (key) {
        case "rotateX":
          seenKeys |= transformKeysBitwise.rotateX;
          Mat4.multiply(matrix, matrix, Mat4.fromXRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;
        case "rotateY":
          seenKeys |= transformKeysBitwise.rotateY;
          Mat4.multiply(matrix, matrix, Mat4.fromYRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;
        case "rotateZ":
          seenKeys |= transformKeysBitwise.rotateZ;
          Mat4.multiply(matrix, matrix, Mat4.fromZRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;
        case "scale":
          seenKeys |= transformKeysBitwise.scale;
          s_SCALE_VECTOR[0] = s_SCALE_VECTOR[1] = data[key];
          Mat4.multiply(matrix, matrix, Mat4.fromScaling(s_MAT4_TEMP, s_SCALE_VECTOR));
          break;
        case "translateX":
          seenKeys |= transformKeysBitwise.translateX;
          s_TRANSLATE_VECTOR[0] = data.translateX;
          s_TRANSLATE_VECTOR[1] = 0;
          s_TRANSLATE_VECTOR[2] = 0;
          Mat4.multiply(matrix, matrix, Mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
          break;
        case "translateY":
          seenKeys |= transformKeysBitwise.translateY;
          s_TRANSLATE_VECTOR[0] = 0;
          s_TRANSLATE_VECTOR[1] = data.translateY;
          s_TRANSLATE_VECTOR[2] = 0;
          Mat4.multiply(matrix, matrix, Mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
          break;
        case "translateZ":
          seenKeys |= transformKeysBitwise.translateZ;
          s_TRANSLATE_VECTOR[0] = 0;
          s_TRANSLATE_VECTOR[1] = 0;
          s_TRANSLATE_VECTOR[2] = data.translateZ;
          Mat4.multiply(matrix, matrix, Mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
          break;
      }
    }
    if (data !== this._data) {
      for (let cntr = 0; cntr < transformKeys.length; cntr++) {
        const key = transformKeys[cntr];
        if (data[key] === null || (seenKeys & transformKeysBitwise[key]) > 0) {
          continue;
        }
        switch (key) {
          case "rotateX":
            Mat4.multiply(matrix, matrix, Mat4.fromXRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;
          case "rotateY":
            Mat4.multiply(matrix, matrix, Mat4.fromYRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;
          case "rotateZ":
            Mat4.multiply(matrix, matrix, Mat4.fromZRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;
          case "scale":
            s_SCALE_VECTOR[0] = s_SCALE_VECTOR[1] = data[key];
            Mat4.multiply(matrix, matrix, Mat4.fromScaling(s_MAT4_TEMP, s_SCALE_VECTOR));
            break;
          case "translateX":
            s_TRANSLATE_VECTOR[0] = data[key];
            s_TRANSLATE_VECTOR[1] = 0;
            s_TRANSLATE_VECTOR[2] = 0;
            Mat4.multiply(matrix, matrix, Mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
            break;
          case "translateY":
            s_TRANSLATE_VECTOR[0] = 0;
            s_TRANSLATE_VECTOR[1] = data[key];
            s_TRANSLATE_VECTOR[2] = 0;
            Mat4.multiply(matrix, matrix, Mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
            break;
          case "translateZ":
            s_TRANSLATE_VECTOR[0] = 0;
            s_TRANSLATE_VECTOR[1] = 0;
            s_TRANSLATE_VECTOR[2] = data[key];
            Mat4.multiply(matrix, matrix, Mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
            break;
        }
      }
    }
    return matrix;
  }
  /**
   * Provides an orthographic enhancement to convert left / top positional data to a translate operation.
   *
   * This transform matrix takes into account that the remaining operations are , but adds any left / top attributes from passed in data to
   * translate X / Y.
   *
   * If no data object is provided then the source is the local transform data. If another data object is supplied
   * then the stored local transform order is applied then all remaining transform keys are applied. This allows the
   * construction of a transform matrix in advance of setting local data and is useful in collision detection.
   *
   * @param {object}   [data] - TJSPositionData instance or local transform data.
   *
   * @param {import('#runtime/math/gl-matrix').Mat4}  [output] - The output mat4 instance.
   *
   * @returns {import('#runtime/math/gl-matrix').Mat4} Transform matrix.
   */
  getMat4Ortho(data = this._data, output = Mat4.create()) {
    const matrix = Mat4.identity(output);
    s_TRANSLATE_VECTOR[0] = (data.left ?? 0) + (data.translateX ?? 0);
    s_TRANSLATE_VECTOR[1] = (data.top ?? 0) + (data.translateY ?? 0);
    s_TRANSLATE_VECTOR[2] = data.translateZ ?? 0;
    Mat4.multiply(matrix, matrix, Mat4.fromTranslation(s_MAT4_TEMP, s_TRANSLATE_VECTOR));
    if (data.scale !== null) {
      s_SCALE_VECTOR[0] = s_SCALE_VECTOR[1] = data.scale;
      Mat4.multiply(matrix, matrix, Mat4.fromScaling(s_MAT4_TEMP, s_SCALE_VECTOR));
    }
    if (data.rotateX === null && data.rotateY === null && data.rotateZ === null) {
      return matrix;
    }
    let seenKeys = 0;
    const orderList = this.#orderList;
    for (let cntr = 0; cntr < orderList.length; cntr++) {
      const key = orderList[cntr];
      switch (key) {
        case "rotateX":
          seenKeys |= transformKeysBitwise.rotateX;
          Mat4.multiply(matrix, matrix, Mat4.fromXRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;
        case "rotateY":
          seenKeys |= transformKeysBitwise.rotateY;
          Mat4.multiply(matrix, matrix, Mat4.fromYRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;
        case "rotateZ":
          seenKeys |= transformKeysBitwise.rotateZ;
          Mat4.multiply(matrix, matrix, Mat4.fromZRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;
      }
    }
    if (data !== this._data) {
      for (let cntr = 0; cntr < transformKeys.length; cntr++) {
        const key = transformKeys[cntr];
        if (data[key] === null || (seenKeys & transformKeysBitwise[key]) > 0) {
          continue;
        }
        switch (key) {
          case "rotateX":
            Mat4.multiply(matrix, matrix, Mat4.fromXRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;
          case "rotateY":
            Mat4.multiply(matrix, matrix, Mat4.fromYRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;
          case "rotateZ":
            Mat4.multiply(matrix, matrix, Mat4.fromZRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;
        }
      }
    }
    return matrix;
  }
  /**
   * Tests an object if it contains transform keys and the values are finite numbers.
   *
   * @param {object} data - An object to test for transform data.
   *
   * @returns {boolean} Whether the given TJSPositionData has transforms.
   */
  hasTransform(data) {
    for (const key of transformKeys) {
      if (Number.isFinite(data[key])) {
        return true;
      }
    }
    return false;
  }
  /**
   * Resets internal data from the given object containing valid transform keys.
   *
   * @param {object}   data - An object with transform data.
   */
  reset(data) {
    for (const key in data) {
      if (transformKeys.includes(key)) {
        if (Number.isFinite(data[key])) {
          this._data[key] = data[key];
        } else {
          const index = this.#orderList.findIndex((entry) => entry === key);
          if (index >= 0) {
            this.#orderList.splice(index, 1);
          }
          delete this._data[key];
        }
      }
    }
  }
}
function s_GET_ORIGIN_TRANSLATION(transformOrigin, width, height, output) {
  const vector = s_VEC3_TEMP;
  switch (transformOrigin) {
    case "top left":
      vector[0] = vector[1] = 0;
      Mat4.fromTranslation(output[0], vector);
      Mat4.fromTranslation(output[1], vector);
      break;
    case "top center":
      vector[0] = -width * 0.5;
      vector[1] = 0;
      Mat4.fromTranslation(output[0], vector);
      vector[0] = width * 0.5;
      Mat4.fromTranslation(output[1], vector);
      break;
    case "top right":
      vector[0] = -width;
      vector[1] = 0;
      Mat4.fromTranslation(output[0], vector);
      vector[0] = width;
      Mat4.fromTranslation(output[1], vector);
      break;
    case "center left":
      vector[0] = 0;
      vector[1] = -height * 0.5;
      Mat4.fromTranslation(output[0], vector);
      vector[1] = height * 0.5;
      Mat4.fromTranslation(output[1], vector);
      break;
    case null:
    case "center":
      vector[0] = -width * 0.5;
      vector[1] = -height * 0.5;
      Mat4.fromTranslation(output[0], vector);
      vector[0] = width * 0.5;
      vector[1] = height * 0.5;
      Mat4.fromTranslation(output[1], vector);
      break;
    case "center right":
      vector[0] = -width;
      vector[1] = -height * 0.5;
      Mat4.fromTranslation(output[0], vector);
      vector[0] = width;
      vector[1] = height * 0.5;
      Mat4.fromTranslation(output[1], vector);
      break;
    case "bottom left":
      vector[0] = 0;
      vector[1] = -height;
      Mat4.fromTranslation(output[0], vector);
      vector[1] = height;
      Mat4.fromTranslation(output[1], vector);
      break;
    case "bottom center":
      vector[0] = -width * 0.5;
      vector[1] = -height;
      Mat4.fromTranslation(output[0], vector);
      vector[0] = width * 0.5;
      vector[1] = height;
      Mat4.fromTranslation(output[1], vector);
      break;
    case "bottom right":
      vector[0] = -width;
      vector[1] = -height;
      Mat4.fromTranslation(output[0], vector);
      vector[0] = width;
      vector[1] = height;
      Mat4.fromTranslation(output[1], vector);
      break;
    default:
      Mat4.identity(output[0]);
      Mat4.identity(output[1]);
      break;
  }
  return output;
}
class AdapterValidators {
  /** @type {boolean} */
  #enabled = true;
  /**
   * @type {import('../').ValidatorData[]}
   */
  #validatorData;
  #mapUnsubscribe = /* @__PURE__ */ new Map();
  /**
   * @returns {[AdapterValidators, import('../').ValidatorData[]]} Returns this and internal storage for validator
   *          adapter.
   */
  constructor() {
    this.#validatorData = [];
    Object.seal(this);
    return [this, this.#validatorData];
  }
  /**
   * @returns {boolean} Returns the enabled state.s
   */
  get enabled() {
    return this.#enabled;
  }
  /**
   * @returns {number} Returns the length of the validators array.
   */
  get length() {
    return this.#validatorData.length;
  }
  /**
   * @param {boolean}  enabled - Sets enabled state.
   */
  set enabled(enabled) {
    if (typeof enabled !== "boolean") {
      throw new TypeError(`'enabled' is not a boolean.`);
    }
    this.#enabled = enabled;
  }
  /**
   * Provides an iterator for validators.
   *
   * @yields {import('../').ValidatorData}
   */
  *[Symbol.iterator]() {
    if (this.#validatorData.length === 0) {
      return;
    }
    for (const entry of this.#validatorData) {
      yield { ...entry };
    }
  }
  /**
   * @param {...(import('../').ValidatorFn | import('../').ValidatorData)}   validators -
   */
  add(...validators) {
    for (const validator of validators) {
      const validatorType = typeof validator;
      if (validatorType !== "function" && validatorType !== "object" || validator === null) {
        throw new TypeError(`AdapterValidator error: 'validator' is not a function or object.`);
      }
      let data = void 0;
      let subscribeFn = void 0;
      switch (validatorType) {
        case "function":
          data = {
            id: void 0,
            validator,
            weight: 1
          };
          subscribeFn = validator.subscribe;
          break;
        case "object":
          if (typeof validator.validator !== "function") {
            throw new TypeError(`AdapterValidator error: 'validator' attribute is not a function.`);
          }
          if (validator.weight !== void 0 && typeof validator.weight !== "number" || (validator.weight < 0 || validator.weight > 1)) {
            throw new TypeError(
              `AdapterValidator error: 'weight' attribute is not a number between '0 - 1' inclusive.`
            );
          }
          data = {
            id: validator.id !== void 0 ? validator.id : void 0,
            validator: validator.validator.bind(validator),
            weight: validator.weight || 1,
            instance: validator
          };
          subscribeFn = validator.validator.subscribe ?? validator.subscribe;
          break;
      }
      const index = this.#validatorData.findIndex((value) => {
        return data.weight < value.weight;
      });
      if (index >= 0) {
        this.#validatorData.splice(index, 0, data);
      } else {
        this.#validatorData.push(data);
      }
      if (typeof subscribeFn === "function") {
        const unsubscribe = subscribeFn();
        if (typeof unsubscribe !== "function") {
          throw new TypeError(
            "AdapterValidator error: Filter has subscribe function, but no unsubscribe function is returned."
          );
        }
        if (this.#mapUnsubscribe.has(data.validator)) {
          throw new Error(
            "AdapterValidator error: Filter added already has an unsubscribe function registered."
          );
        }
        this.#mapUnsubscribe.set(data.validator, unsubscribe);
      }
    }
  }
  clear() {
    this.#validatorData.length = 0;
    for (const unsubscribe of this.#mapUnsubscribe.values()) {
      unsubscribe();
    }
    this.#mapUnsubscribe.clear();
  }
  /**
   * @param {...(import('../').ValidatorFn | import('../').ValidatorData)}   validators -
   */
  remove(...validators) {
    const length = this.#validatorData.length;
    if (length === 0) {
      return;
    }
    for (const data of validators) {
      const actualValidator = typeof data === "function" ? data : isObject(data) ? data.validator : void 0;
      if (!actualValidator) {
        continue;
      }
      for (let cntr = this.#validatorData.length; --cntr >= 0; ) {
        if (this.#validatorData[cntr].validator === actualValidator) {
          this.#validatorData.splice(cntr, 1);
          let unsubscribe = void 0;
          if (typeof (unsubscribe = this.#mapUnsubscribe.get(actualValidator)) === "function") {
            unsubscribe();
            this.#mapUnsubscribe.delete(actualValidator);
          }
        }
      }
    }
  }
  /**
   * Remove validators by the provided callback. The callback takes 3 parameters: `id`, `validator`, and `weight`.
   * Any truthy value returned will remove that validator.
   *
   * @param {function(*, import('../').ValidatorFn, number): boolean} callback - Callback function to evaluate each
   *        validator entry.
   */
  removeBy(callback) {
    const length = this.#validatorData.length;
    if (length === 0) {
      return;
    }
    if (typeof callback !== "function") {
      throw new TypeError(`AdapterValidator error: 'callback' is not a function.`);
    }
    this.#validatorData = this.#validatorData.filter((data) => {
      const remove = callback.call(callback, { ...data });
      if (remove) {
        let unsubscribe;
        if (typeof (unsubscribe = this.#mapUnsubscribe.get(data.validator)) === "function") {
          unsubscribe();
          this.#mapUnsubscribe.delete(data.validator);
        }
      }
      return !remove;
    });
  }
  removeById(...ids) {
    const length = this.#validatorData.length;
    if (length === 0) {
      return;
    }
    this.#validatorData = this.#validatorData.filter((data) => {
      let remove = false;
      for (const id of ids) {
        remove |= data.id === id;
      }
      if (remove) {
        let unsubscribe;
        if (typeof (unsubscribe = this.#mapUnsubscribe.get(data.validator)) === "function") {
          unsubscribe();
          this.#mapUnsubscribe.delete(data.validator);
        }
      }
      return !remove;
    });
  }
}
class BasicBounds {
  /**
   * When true constrains the min / max width or height to element.
   *
   * @type {boolean}
   */
  #constrain;
  /**
   * @type {HTMLElement}
   */
  #element;
  /**
   * When true the validator is active.
   *
   * @type {boolean}
   */
  #enabled;
  /**
   * Provides a manual setting of the element height. As things go `offsetHeight` causes a browser layout and is not
   * performance oriented. If manually set this height is used instead of `offsetHeight`.
   *
   * @type {number}
   */
  #height;
  /**
   * Set from an optional value in the constructor to lock accessors preventing modification.
   */
  #lock;
  /**
   * Provides a manual setting of the element width. As things go `offsetWidth` causes a browser layout and is not
   * performance oriented. If manually set this width is used instead of `offsetWidth`.
   *
   * @type {number}
   */
  #width;
  constructor({ constrain = true, element: element2, enabled = true, lock = false, width, height } = {}) {
    this.element = element2;
    this.constrain = constrain;
    this.enabled = enabled;
    this.width = width;
    this.height = height;
    this.#lock = typeof lock === "boolean" ? lock : false;
  }
  get constrain() {
    return this.#constrain;
  }
  get element() {
    return this.#element;
  }
  get enabled() {
    return this.#enabled;
  }
  get height() {
    return this.#height;
  }
  get width() {
    return this.#width;
  }
  set constrain(constrain) {
    if (this.#lock) {
      return;
    }
    if (typeof constrain !== "boolean") {
      throw new TypeError(`'constrain' is not a boolean.`);
    }
    this.#constrain = constrain;
  }
  set element(element2) {
    if (this.#lock) {
      return;
    }
    if (element2 === void 0 || element2 === null || element2 instanceof HTMLElement) {
      this.#element = element2;
    } else {
      throw new TypeError(`'element' is not a HTMLElement, undefined, or null.`);
    }
  }
  set enabled(enabled) {
    if (this.#lock) {
      return;
    }
    if (typeof enabled !== "boolean") {
      throw new TypeError(`'enabled' is not a boolean.`);
    }
    this.#enabled = enabled;
  }
  set height(height) {
    if (this.#lock) {
      return;
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
  }
  set width(width) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
  }
  setDimension(width, height) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
  }
  /**
   * Provides a validator that respects transforms in positional data constraining the position to within the target
   * elements bounds.
   *
   * @param {import('../').ValidationData}   valData - The associated validation data for position updates.
   *
   * @returns {import('../').TJSPositionData} Potentially adjusted position data.
   */
  validator(valData) {
    if (!this.#enabled) {
      return valData.position;
    }
    const boundsWidth = this.#width ?? this.#element?.offsetWidth ?? globalThis.innerWidth;
    const boundsHeight = this.#height ?? this.#element?.offsetHeight ?? globalThis.innerHeight;
    if (typeof valData.position.width === "number") {
      const maxW = valData.maxWidth ?? (this.#constrain ? boundsWidth : Number.MAX_SAFE_INTEGER);
      valData.position.width = valData.width = clamp(valData.position.width, valData.minWidth, maxW);
      if (valData.width + valData.position.left + valData.marginLeft > boundsWidth) {
        valData.position.left = boundsWidth - valData.width - valData.marginLeft;
      }
    }
    if (typeof valData.position.height === "number") {
      const maxH = valData.maxHeight ?? (this.#constrain ? boundsHeight : Number.MAX_SAFE_INTEGER);
      valData.position.height = valData.height = clamp(valData.position.height, valData.minHeight, maxH);
      if (valData.height + valData.position.top + valData.marginTop > boundsHeight) {
        valData.position.top = boundsHeight - valData.height - valData.marginTop;
      }
    }
    const maxL = Math.max(boundsWidth - valData.width - valData.marginLeft, 0);
    valData.position.left = Math.round(clamp(valData.position.left, 0, maxL));
    const maxT = Math.max(boundsHeight - valData.height - valData.marginTop, 0);
    valData.position.top = Math.round(clamp(valData.position.top, 0, maxT));
    return valData.position;
  }
}
const s_TRANSFORM_DATA = new TJSTransformData();
class TransformBounds {
  /**
   * When true constrains the min / max width or height to element.
   *
   * @type {boolean}
   */
  #constrain;
  /**
   * @type {HTMLElement}
   */
  #element;
  /**
   * When true the validator is active.
   *
   * @type {boolean}
   */
  #enabled;
  /**
   * Provides a manual setting of the element height. As things go `offsetHeight` causes a browser layout and is not
   * performance oriented. If manually set this height is used instead of `offsetHeight`.
   *
   * @type {number}
   */
  #height;
  /**
   * Set from an optional value in the constructor to lock accessors preventing modification.
   */
  #lock;
  /**
   * Provides a manual setting of the element width. As things go `offsetWidth` causes a browser layout and is not
   * performance oriented. If manually set this width is used instead of `offsetWidth`.
   *
   * @type {number}
   */
  #width;
  constructor({ constrain = true, element: element2, enabled = true, lock = false, width, height } = {}) {
    this.element = element2;
    this.constrain = constrain;
    this.enabled = enabled;
    this.width = width;
    this.height = height;
    this.#lock = typeof lock === "boolean" ? lock : false;
  }
  get constrain() {
    return this.#constrain;
  }
  get element() {
    return this.#element;
  }
  get enabled() {
    return this.#enabled;
  }
  get height() {
    return this.#height;
  }
  get width() {
    return this.#width;
  }
  set constrain(constrain) {
    if (this.#lock) {
      return;
    }
    if (typeof constrain !== "boolean") {
      throw new TypeError(`'constrain' is not a boolean.`);
    }
    this.#constrain = constrain;
  }
  set element(element2) {
    if (this.#lock) {
      return;
    }
    if (element2 === void 0 || element2 === null || element2 instanceof HTMLElement) {
      this.#element = element2;
    } else {
      throw new TypeError(`'element' is not a HTMLElement, undefined, or null.`);
    }
  }
  set enabled(enabled) {
    if (this.#lock) {
      return;
    }
    if (typeof enabled !== "boolean") {
      throw new TypeError(`'enabled' is not a boolean.`);
    }
    this.#enabled = enabled;
  }
  set height(height) {
    if (this.#lock) {
      return;
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
  }
  set width(width) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
  }
  setDimension(width, height) {
    if (this.#lock) {
      return;
    }
    if (width === void 0 || Number.isFinite(width)) {
      this.#width = width;
    } else {
      throw new TypeError(`'width' is not a finite number or undefined.`);
    }
    if (height === void 0 || Number.isFinite(height)) {
      this.#height = height;
    } else {
      throw new TypeError(`'height' is not a finite number or undefined.`);
    }
  }
  /**
   * Provides a validator that respects transforms in positional data constraining the position to within the target
   * elements bounds.
   *
   * @param {import('../').ValidationData}   valData - The associated validation data for position updates.
   *
   * @returns {import('../').TJSPositionData} Potentially adjusted position data.
   */
  validator(valData) {
    if (!this.#enabled) {
      return valData.position;
    }
    const boundsWidth = this.#width ?? this.#element?.offsetWidth ?? globalThis.innerWidth;
    const boundsHeight = this.#height ?? this.#element?.offsetHeight ?? globalThis.innerHeight;
    if (typeof valData.position.width === "number") {
      const maxW = valData.maxWidth ?? (this.#constrain ? boundsWidth : Number.MAX_SAFE_INTEGER);
      valData.position.width = clamp(valData.width, valData.minWidth, maxW);
    }
    if (typeof valData.position.height === "number") {
      const maxH = valData.maxHeight ?? (this.#constrain ? boundsHeight : Number.MAX_SAFE_INTEGER);
      valData.position.height = clamp(valData.height, valData.minHeight, maxH);
    }
    const data = valData.transforms.getData(valData.position, s_TRANSFORM_DATA, valData);
    const initialX = data.boundingRect.x;
    const initialY = data.boundingRect.y;
    if (data.boundingRect.bottom + valData.marginTop > boundsHeight) {
      data.boundingRect.y += boundsHeight - data.boundingRect.bottom - valData.marginTop;
    }
    if (data.boundingRect.right + valData.marginLeft > boundsWidth) {
      data.boundingRect.x += boundsWidth - data.boundingRect.right - valData.marginLeft;
    }
    if (data.boundingRect.top - valData.marginTop < 0) {
      data.boundingRect.y += Math.abs(data.boundingRect.top - valData.marginTop);
    }
    if (data.boundingRect.left - valData.marginLeft < 0) {
      data.boundingRect.x += Math.abs(data.boundingRect.left - valData.marginLeft);
    }
    valData.position.left -= initialX - data.boundingRect.x;
    valData.position.top -= initialY - data.boundingRect.y;
    return valData.position;
  }
}
class UpdateElementData {
  constructor() {
    this.data = void 0;
    this.dataSubscribers = new TJSPositionData();
    this.dimensionData = { width: 0, height: 0 };
    this.changeSet = void 0;
    this.options = void 0;
    this.queued = false;
    this.styleCache = void 0;
    this.transforms = void 0;
    this.transformData = new TJSTransformData();
    this.subscriptions = void 0;
    this.storeDimension = writable(this.dimensionData);
    this.storeTransform = writable(this.transformData, () => {
      this.options.transformSubscribed = true;
      return () => this.options.transformSubscribed = false;
    });
    this.queued = false;
    Object.seal(this.dimensionData);
  }
}
class UpdateElementManager {
  static list = [];
  static listCntr = 0;
  static updatePromise;
  static get promise() {
    return this.updatePromise;
  }
  /**
   * Potentially adds the given element and internal updateData instance to the list.
   *
   * @param {HTMLElement}       el - An HTMLElement instance.
   *
   * @param {import('./UpdateElementData').UpdateElementData} updateData - An UpdateElementData instance.
   *
   * @returns {Promise<number>} The unified next frame update promise. Returns `currentTime`.
   */
  static add(el, updateData) {
    if (this.listCntr < this.list.length) {
      const entry = this.list[this.listCntr];
      entry[0] = el;
      entry[1] = updateData;
    } else {
      this.list.push([el, updateData]);
    }
    this.listCntr++;
    updateData.queued = true;
    if (!this.updatePromise) {
      this.updatePromise = this.wait();
    }
    return this.updatePromise;
  }
  /**
   * Await on `nextAnimationFrame` and iterate over list map invoking callback functions.
   *
   * @returns {Promise<number>} The next frame Promise / currentTime from nextAnimationFrame.
   */
  static async wait() {
    const currentTime = await nextAnimationFrame();
    this.updatePromise = void 0;
    for (let cntr = this.listCntr; --cntr >= 0; ) {
      const entry = this.list[cntr];
      const el = entry[0];
      const updateData = entry[1];
      entry[0] = void 0;
      entry[1] = void 0;
      updateData.queued = false;
      if (!el.isConnected) {
        continue;
      }
      if (updateData.options.ortho) {
        s_UPDATE_ELEMENT_ORTHO(el, updateData);
      } else {
        s_UPDATE_ELEMENT(el, updateData);
      }
      if (updateData.options.calculateTransform || updateData.options.transformSubscribed) {
        s_UPDATE_TRANSFORM(el, updateData);
      }
      this.updateSubscribers(updateData);
    }
    this.listCntr = 0;
    return currentTime;
  }
  /**
   * Potentially immediately updates the given element.
   *
   * @param {HTMLElement}       el - An HTMLElement instance.
   *
   * @param {import('./UpdateElementData').UpdateElementData} updateData - An UpdateElementData instance.
   */
  static immediate(el, updateData) {
    if (!el.isConnected) {
      return;
    }
    if (updateData.options.ortho) {
      s_UPDATE_ELEMENT_ORTHO(el, updateData);
    } else {
      s_UPDATE_ELEMENT(el, updateData);
    }
    if (updateData.options.calculateTransform || updateData.options.transformSubscribed) {
      s_UPDATE_TRANSFORM(el, updateData);
    }
    this.updateSubscribers(updateData);
  }
  /**
   * @param {import('./UpdateElementData').UpdateElementData} updateData - Data change set.
   */
  static updateSubscribers(updateData) {
    const data = updateData.data;
    const changeSet = updateData.changeSet;
    if (!changeSet.hasChange()) {
      return;
    }
    const output = updateData.dataSubscribers.copy(data);
    const subscriptions = updateData.subscriptions;
    if (subscriptions.length > 0) {
      for (let cntr = 0; cntr < subscriptions.length; cntr++) {
        subscriptions[cntr](output);
      }
    }
    if (changeSet.width || changeSet.height) {
      updateData.dimensionData.width = data.width;
      updateData.dimensionData.height = data.height;
      updateData.storeDimension.set(updateData.dimensionData);
    }
    changeSet.set(false);
  }
}
function s_UPDATE_ELEMENT(el, updateData) {
  const changeSet = updateData.changeSet;
  const data = updateData.data;
  if (changeSet.left) {
    el.style.left = `${data.left}px`;
  }
  if (changeSet.top) {
    el.style.top = `${data.top}px`;
  }
  if (changeSet.zIndex) {
    el.style.zIndex = typeof data.zIndex === "number" ? `${data.zIndex}` : null;
  }
  if (changeSet.width) {
    el.style.width = typeof data.width === "number" ? `${data.width}px` : data.width;
  }
  if (changeSet.height) {
    el.style.height = typeof data.height === "number" ? `${data.height}px` : data.height;
  }
  if (changeSet.transformOrigin) {
    el.style.transformOrigin = data.transformOrigin;
  }
  if (changeSet.transform) {
    el.style.transform = updateData.transforms.isActive ? updateData.transforms.getCSS() : null;
  }
}
function s_UPDATE_ELEMENT_ORTHO(el, updateData) {
  const changeSet = updateData.changeSet;
  const data = updateData.data;
  if (changeSet.zIndex) {
    el.style.zIndex = typeof data.zIndex === "number" ? `${data.zIndex}` : null;
  }
  if (changeSet.width) {
    el.style.width = typeof data.width === "number" ? `${data.width}px` : data.width;
  }
  if (changeSet.height) {
    el.style.height = typeof data.height === "number" ? `${data.height}px` : data.height;
  }
  if (changeSet.transformOrigin) {
    el.style.transformOrigin = data.transformOrigin;
  }
  if (changeSet.left || changeSet.top || changeSet.transform) {
    el.style.transform = updateData.transforms.getCSSOrtho(data);
  }
}
function s_UPDATE_TRANSFORM(el, updateData) {
  s_VALIDATION_DATA$1.height = updateData.data.height !== "auto" ? updateData.data.height : updateData.styleCache.offsetHeight;
  s_VALIDATION_DATA$1.width = updateData.data.width !== "auto" ? updateData.data.width : updateData.styleCache.offsetWidth;
  s_VALIDATION_DATA$1.marginLeft = updateData.styleCache.marginLeft;
  s_VALIDATION_DATA$1.marginTop = updateData.styleCache.marginTop;
  updateData.transforms.getData(updateData.data, updateData.transformData, s_VALIDATION_DATA$1);
  updateData.storeTransform.set(updateData.transformData);
}
const s_VALIDATION_DATA$1 = {
  height: void 0,
  width: void 0,
  marginLeft: void 0,
  marginTop: void 0
};
class TJSPosition {
  /**
   * @type {{browserCentered: Centered, Centered: Centered}}
   */
  static #positionInitial = {
    browserCentered: new Centered({ lock: true }),
    Centered
  };
  /**
   * @type {{TransformBounds: TransformBounds, BasicBounds: BasicBounds, basicWindow: BasicBounds, transformWindow: TransformBounds}}
   */
  static #positionValidators = {
    basicWindow: new BasicBounds({ lock: true }),
    BasicBounds,
    transformWindow: new TransformBounds({ lock: true }),
    TransformBounds
  };
  /**
   * @type {TJSPositionData}
   */
  #data = new TJSPositionData();
  /**
   * Provides the animation API.
   *
   * @type {AnimationAPI}
   */
  #animate = new AnimationAPI(this, this.#data);
  /**
   * Provides a way to turn on / off the position handling.
   *
   * @type {boolean}
   */
  #enabled = true;
  /**
   * Stores ongoing options that are set in the constructor or by transform store subscription.
   *
   * @type {import('./').TJSPositionOptions}
   */
  #options = {
    calculateTransform: false,
    initialHelper: void 0,
    ortho: true,
    transformSubscribed: false
  };
  /**
   * The associated parent for positional data tracking. Used in validators.
   *
   * @type {import('./').TJSPositionParent}
   */
  #parent;
  /**
   * Stores the style attributes that changed on update.
   *
   * @type {PositionChangeSet}
   */
  #positionChangeSet = new PositionChangeSet();
  /**
   * @type {import('./').TJSPositionStores}
   */
  #stores;
  /**
   * Stores an instance of the computer styles for the target element.
   *
   * @type {StyleCache}
   */
  #styleCache;
  /**
   * Stores the subscribers.
   *
   * @type {import('svelte/store').Subscriber<TJSPositionData>[]}
   */
  #subscriptions = [];
  /**
   * @type {TJSTransforms}
   */
  #transforms = new TJSTransforms();
  /**
   * @type {UpdateElementData}
   */
  #updateElementData;
  /**
   * Stores the UpdateElementManager wait promise.
   *
   * @type {Promise}
   */
  #updateElementPromise;
  /**
   * @type {AdapterValidators}
   */
  #validators;
  /**
   * @type {import('./').ValidatorData[]}
   */
  #validatorData;
  /**
   * @type {PositionStateAPI}
   */
  #state = new PositionStateAPI(this, this.#data, this.#transforms);
  /**
   * @returns {AnimationGroupAPI} Public Animation API.
   */
  static get Animate() {
    return AnimationGroupAPI;
  }
  /**
   * @returns {{browserCentered: Centered, Centered: Centered}} TJSPosition initial API.
   */
  static get Initial() {
    return this.#positionInitial;
  }
  /**
   * Returns TJSTransformData class / constructor.
   *
   * @returns {TJSTransformData} TJSTransformData class / constructor.
   */
  static get TransformData() {
    return TJSTransformData;
  }
  /**
   * Returns default validators.
   *
   * Note: `basicWindow` and `BasicBounds` will eventually be removed.
   *
   * @returns {{TransformBounds: TransformBounds, BasicBounds: BasicBounds, basicWindow: BasicBounds, transformWindow: TransformBounds}}
   * Available validators.
   */
  static get Validators() {
    return this.#positionValidators;
  }
  /**
   * Returns a duplicate of a given position instance copying any options and validators.
   *
   * // TODO: Consider more safety over options processing.
   *
   * @param {TJSPosition}          position - A position instance.
   *
   * @param {import('./').TJSPositionOptions}   options - TJSPosition options.
   *
   * @returns {TJSPosition} A duplicate position instance.
   */
  static duplicate(position, options) {
    if (!(position instanceof TJSPosition)) {
      throw new TypeError(`'position' is not an instance of Position.`);
    }
    const newPosition = new TJSPosition(options);
    newPosition.#options = Object.assign({}, position.#options, options);
    newPosition.#validators.add(...position.#validators);
    newPosition.set(position.#data);
    return newPosition;
  }
  /**
   * @param {import('./').TJSPositionParent | import('./').TJSPositionOptionsAll}   [parent] - A
   *        potential parent element or object w/ `elementTarget` getter. May also be the TJSPositionOptions object
   *        w/ 1 argument.
   *
   * @param {import('./').TJSPositionOptionsAll}   [options] - Default values.
   */
  constructor(parent, options) {
    if (isPlainObject(parent)) {
      options = parent;
    } else {
      this.#parent = parent;
    }
    const data = this.#data;
    const transforms = this.#transforms;
    this.#styleCache = new StyleCache();
    const updateData = new UpdateElementData();
    updateData.changeSet = this.#positionChangeSet;
    updateData.data = this.#data;
    updateData.options = this.#options;
    updateData.styleCache = this.#styleCache;
    updateData.subscriptions = this.#subscriptions;
    updateData.transforms = this.#transforms;
    this.#updateElementData = updateData;
    if (isObject(options)) {
      if (typeof options.calculateTransform === "boolean") {
        this.#options.calculateTransform = options.calculateTransform;
      }
      if (typeof options.ortho === "boolean") {
        this.#options.ortho = options.ortho;
      }
      if (Number.isFinite(options.height) || options.height === "auto" || options.height === "inherit" || options.height === null) {
        data.height = updateData.dimensionData.height = typeof options.height === "number" ? Math.round(options.height) : options.height;
      }
      if (Number.isFinite(options.left) || options.left === null) {
        data.left = typeof options.left === "number" ? Math.round(options.left) : options.left;
      }
      if (Number.isFinite(options.maxHeight) || options.maxHeight === null) {
        data.maxHeight = typeof options.maxHeight === "number" ? Math.round(options.maxHeight) : options.maxHeight;
      }
      if (Number.isFinite(options.maxWidth) || options.maxWidth === null) {
        data.maxWidth = typeof options.maxWidth === "number" ? Math.round(options.maxWidth) : options.maxWidth;
      }
      if (Number.isFinite(options.minHeight) || options.minHeight === null) {
        data.minHeight = typeof options.minHeight === "number" ? Math.round(options.minHeight) : options.minHeight;
      }
      if (Number.isFinite(options.minWidth) || options.minWidth === null) {
        data.minWidth = typeof options.minWidth === "number" ? Math.round(options.minWidth) : options.minWidth;
      }
      if (Number.isFinite(options.rotateX) || options.rotateX === null) {
        transforms.rotateX = data.rotateX = options.rotateX;
      }
      if (Number.isFinite(options.rotateY) || options.rotateY === null) {
        transforms.rotateY = data.rotateY = options.rotateY;
      }
      if (Number.isFinite(options.rotateZ) || options.rotateZ === null) {
        transforms.rotateZ = data.rotateZ = options.rotateZ;
      }
      if (Number.isFinite(options.scale) || options.scale === null) {
        transforms.scale = data.scale = options.scale;
      }
      if (Number.isFinite(options.top) || options.top === null) {
        data.top = typeof options.top === "number" ? Math.round(options.top) : options.top;
      }
      if (typeof options.transformOrigin === "string" || options.transformOrigin === null) {
        data.transformOrigin = transformOrigins.includes(options.transformOrigin) ? options.transformOrigin : null;
      }
      if (Number.isFinite(options.translateX) || options.translateX === null) {
        transforms.translateX = data.translateX = options.translateX;
      }
      if (Number.isFinite(options.translateY) || options.translateY === null) {
        transforms.translateY = data.translateY = options.translateY;
      }
      if (Number.isFinite(options.translateZ) || options.translateZ === null) {
        transforms.translateZ = data.translateZ = options.translateZ;
      }
      if (Number.isFinite(options.width) || options.width === "auto" || options.width === "inherit" || options.width === null) {
        data.width = updateData.dimensionData.width = typeof options.width === "number" ? Math.round(options.width) : options.width;
      }
      if (Number.isFinite(options.zIndex) || options.zIndex === null) {
        data.zIndex = typeof options.zIndex === "number" ? Math.round(options.zIndex) : options.zIndex;
      }
    }
    this.#stores = {
      // The main properties for manipulating TJSPosition.
      height: propertyStore(this, "height"),
      left: propertyStore(this, "left"),
      rotateX: propertyStore(this, "rotateX"),
      rotateY: propertyStore(this, "rotateY"),
      rotateZ: propertyStore(this, "rotateZ"),
      scale: propertyStore(this, "scale"),
      top: propertyStore(this, "top"),
      transformOrigin: propertyStore(this, "transformOrigin"),
      translateX: propertyStore(this, "translateX"),
      translateY: propertyStore(this, "translateY"),
      translateZ: propertyStore(this, "translateZ"),
      width: propertyStore(this, "width"),
      zIndex: propertyStore(this, "zIndex"),
      // Stores that control validation when width / height is not `auto`.
      maxHeight: propertyStore(this, "maxHeight"),
      maxWidth: propertyStore(this, "maxWidth"),
      minHeight: propertyStore(this, "minHeight"),
      minWidth: propertyStore(this, "minWidth"),
      // Readable stores based on updates or from resize observer changes.
      dimension: { subscribe: updateData.storeDimension.subscribe },
      element: { subscribe: this.#styleCache.stores.element.subscribe },
      resizeContentHeight: { subscribe: this.#styleCache.stores.resizeContentHeight.subscribe },
      resizeContentWidth: { subscribe: this.#styleCache.stores.resizeContentWidth.subscribe },
      resizeOffsetHeight: { subscribe: this.#styleCache.stores.resizeOffsetHeight.subscribe },
      resizeOffsetWidth: { subscribe: this.#styleCache.stores.resizeOffsetWidth.subscribe },
      transform: { subscribe: updateData.storeTransform.subscribe },
      // Protected store that should only be set by resizeObserver action.
      resizeObserved: this.#styleCache.stores.resizeObserved
    };
    subscribeIgnoreFirst(this.#stores.resizeObserved, (resizeData) => {
      const parent2 = this.#parent;
      const el = parent2 instanceof HTMLElement ? parent2 : parent2?.elementTarget;
      if (el instanceof HTMLElement && Number.isFinite(resizeData?.offsetWidth) && Number.isFinite(resizeData?.offsetHeight)) {
        this.set(data);
      }
    });
    this.#stores.transformOrigin.values = transformOrigins;
    [this.#validators, this.#validatorData] = new AdapterValidators();
    if (options?.initial || options?.positionInitial) {
      const initialHelper = options.initial ?? options.positionInitial;
      if (typeof initialHelper?.getLeft !== "function" || typeof initialHelper?.getTop !== "function") {
        throw new Error(
          `'options.initial' position helper does not contain 'getLeft' and / or 'getTop' functions.`
        );
      }
      this.#options.initialHelper = options.initial;
    }
    if (options?.validator) {
      if (isIterable(options?.validator)) {
        this.validators.add(...options.validator);
      } else {
        this.validators.add(options.validator);
      }
    }
  }
  /**
   * Returns the animation API.
   *
   * @returns {AnimationAPI} Animation API.
   */
  get animate() {
    return this.#animate;
  }
  /**
   * Returns the dimension data for the readable store.
   *
   * @returns {{width: number | 'auto', height: number | 'auto'}} Dimension data.
   */
  get dimension() {
    return this.#updateElementData.dimensionData;
  }
  /**
   * Returns the enabled state.
   *
   * @returns {boolean} Enabled state.
   */
  get enabled() {
    return this.#enabled;
  }
  /**
   * Returns the current HTMLElement being positioned.
   *
   * @returns {HTMLElement|undefined} Current HTMLElement being positioned.
   */
  get element() {
    return this.#styleCache.el;
  }
  /**
   * Returns a promise that is resolved on the next element update with the time of the update.
   *
   * @returns {Promise<number>} Promise resolved on element update.
   */
  get elementUpdated() {
    return this.#updateElementPromise;
  }
  /**
   * Returns the associated {@link TJSPositionParent} instance.
   *
   * @returns {import('./').TJSPositionParent} The TJSPositionParent instance.
   */
  get parent() {
    return this.#parent;
  }
  /**
   * Returns the state API.
   *
   * @returns {import('./PositionStateAPI').PositionStateAPI} TJSPosition state API.
   */
  get state() {
    return this.#state;
  }
  /**
   * Returns the derived writable stores for individual data variables.
   *
   * @returns {import('./').TJSPositionStores} Derived / writable stores.
   */
  get stores() {
    return this.#stores;
  }
  /**
   * Returns the transform data for the readable store.
   *
   * @returns {TJSTransformData} Transform Data.
   */
  get transform() {
    return this.#updateElementData.transformData;
  }
  /**
   * Returns the validators.
   *
   * @returns {AdapterValidators} validators.
   */
  get validators() {
    return this.#validators;
  }
  /**
   * Sets the enabled state.
   *
   * @param {boolean}  enabled - New enabled state.
   */
  set enabled(enabled) {
    if (typeof enabled !== "boolean") {
      throw new TypeError(`'enabled' is not a boolean.`);
    }
    this.#enabled = enabled;
  }
  /**
   * Sets the associated {@link TJSPositionParent} instance. Resets the style cache and default data.
   *
   * @param {import('./').TJSPositionParent} parent - A TJSPositionParent instance.
   */
  set parent(parent) {
    if (parent !== void 0 && !(parent instanceof HTMLElement) && !isObject(parent)) {
      throw new TypeError(`'parent' is not an HTMLElement, object, or undefined.`);
    }
    this.#parent = parent;
    this.#state.remove({ name: "#defaultData" });
    this.#styleCache.reset();
    if (parent) {
      this.set(this.#data);
    }
  }
  // Data accessors ----------------------------------------------------------------------------------------------------
  /**
   * @returns {number|'auto'|'inherit'|null} height
   */
  get height() {
    return this.#data.height;
  }
  /**
   * @returns {number|null} left
   */
  get left() {
    return this.#data.left;
  }
  /**
   * @returns {number|null} maxHeight
   */
  get maxHeight() {
    return this.#data.maxHeight;
  }
  /**
   * @returns {number|null} maxWidth
   */
  get maxWidth() {
    return this.#data.maxWidth;
  }
  /**
   * @returns {number|null} minHeight
   */
  get minHeight() {
    return this.#data.minHeight;
  }
  /**
   * @returns {number|null} minWidth
   */
  get minWidth() {
    return this.#data.minWidth;
  }
  /**
   * @returns {number|null} rotateX
   */
  get rotateX() {
    return this.#data.rotateX;
  }
  /**
   * @returns {number|null} rotateY
   */
  get rotateY() {
    return this.#data.rotateY;
  }
  /**
   * @returns {number|null} rotateZ
   */
  get rotateZ() {
    return this.#data.rotateZ;
  }
  /**
   * @returns {number|null} alias for rotateZ
   */
  get rotation() {
    return this.#data.rotateZ;
  }
  /**
   * @returns {number|null} scale
   */
  get scale() {
    return this.#data.scale;
  }
  /**
   * @returns {number|null} top
   */
  get top() {
    return this.#data.top;
  }
  /**
   * @returns {import('./').TJSTransformOrigin} transformOrigin
   */
  get transformOrigin() {
    return this.#data.transformOrigin;
  }
  /**
   * @returns {number|null} translateX
   */
  get translateX() {
    return this.#data.translateX;
  }
  /**
   * @returns {number|null} translateY
   */
  get translateY() {
    return this.#data.translateY;
  }
  /**
   * @returns {number|null} translateZ
   */
  get translateZ() {
    return this.#data.translateZ;
  }
  /**
   * @returns {number|'auto'|'inherit'|null} width
   */
  get width() {
    return this.#data.width;
  }
  /**
   * @returns {number|null} z-index
   */
  get zIndex() {
    return this.#data.zIndex;
  }
  /**
   * @param {number|string|null} height -
   */
  set height(height) {
    this.#stores.height.set(height);
  }
  /**
   * @param {number|string|null} left -
   */
  set left(left) {
    this.#stores.left.set(left);
  }
  /**
   * @param {number|string|null} maxHeight -
   */
  set maxHeight(maxHeight) {
    this.#stores.maxHeight.set(maxHeight);
  }
  /**
   * @param {number|string|null} maxWidth -
   */
  set maxWidth(maxWidth) {
    this.#stores.maxWidth.set(maxWidth);
  }
  /**
   * @param {number|string|null} minHeight -
   */
  set minHeight(minHeight) {
    this.#stores.minHeight.set(minHeight);
  }
  /**
   * @param {number|string|null} minWidth -
   */
  set minWidth(minWidth) {
    this.#stores.minWidth.set(minWidth);
  }
  /**
   * @param {number|string|null} rotateX -
   */
  set rotateX(rotateX) {
    this.#stores.rotateX.set(rotateX);
  }
  /**
   * @param {number|string|null} rotateY -
   */
  set rotateY(rotateY) {
    this.#stores.rotateY.set(rotateY);
  }
  /**
   * @param {number|string|null} rotateZ -
   */
  set rotateZ(rotateZ) {
    this.#stores.rotateZ.set(rotateZ);
  }
  /**
   * @param {number|string|null} rotateZ - alias for rotateZ
   */
  set rotation(rotateZ) {
    this.#stores.rotateZ.set(rotateZ);
  }
  /**
   * @param {number|string|null} scale -
   */
  set scale(scale) {
    this.#stores.scale.set(scale);
  }
  /**
   * @param {number|string|null} top -
   */
  set top(top) {
    this.#stores.top.set(top);
  }
  /**
   * @param {import('./').TJSTransformOrigin} transformOrigin -
   */
  set transformOrigin(transformOrigin) {
    if (transformOrigins.includes(transformOrigin)) {
      this.#stores.transformOrigin.set(transformOrigin);
    }
  }
  /**
   * @param {number|string|null} translateX -
   */
  set translateX(translateX) {
    this.#stores.translateX.set(translateX);
  }
  /**
   * @param {number|string|null} translateY -
   */
  set translateY(translateY) {
    this.#stores.translateY.set(translateY);
  }
  /**
   * @param {number|string|null} translateZ -
   */
  set translateZ(translateZ) {
    this.#stores.translateZ.set(translateZ);
  }
  /**
   * @param {number|string|null} width -
   */
  set width(width) {
    this.#stores.width.set(width);
  }
  /**
   * @param {number|string|null} zIndex -
   */
  set zIndex(zIndex) {
    this.#stores.zIndex.set(zIndex);
  }
  /**
   * Assigns current position to object passed into method.
   *
   * @param {object|TJSPositionData}  [position] - Target to assign current position data.
   *
   * @param {import('./').TJSPositionGetOptions}   [options] - Defines options for specific keys and substituting null
   *        for numeric default values.
   *
   * @returns {TJSPositionData} Passed in object with current position data.
   */
  get(position = {}, options) {
    const keys = options?.keys;
    const excludeKeys = options?.exclude;
    const numeric = options?.numeric ?? false;
    if (isIterable(keys)) {
      if (numeric) {
        for (const key of keys) {
          position[key] = this[key] ?? numericDefaults[key];
        }
      } else {
        for (const key of keys) {
          position[key] = this[key];
        }
      }
      if (isIterable(excludeKeys)) {
        for (const key of excludeKeys) {
          delete position[key];
        }
      }
      return position;
    } else {
      const data = Object.assign(position, this.#data);
      if (isIterable(excludeKeys)) {
        for (const key of excludeKeys) {
          delete data[key];
        }
      }
      if (numeric) {
        setNumericDefaults(data);
      }
      return data;
    }
  }
  /**
   * @returns {TJSPositionData} Current position data.
   */
  toJSON() {
    return Object.assign({}, this.#data);
  }
  /**
   * All calculation and updates of position are implemented in {@link TJSPosition}. This allows position to be fully
   * reactive and in control of updating inline styles for the application.
   *
   * Note: the logic for updating position is improved and changes a few aspects from the default
   * {@link globalThis.Application.setPosition}. The gate on `popOut` is removed, so to ensure no positional
   * application occurs popOut applications can set `this.options.positionable` to false ensuring no positional inline
   * styles are applied.
   *
   * The initial set call on an application with a target element will always set width / height as this is
   * necessary for correct calculations.
   *
   * When a target element is present updated styles are applied after validation. To modify the behavior of set
   * implement one or more validator functions and add them from the application via
   * `this.position.validators.add(<Function>)`.
   *
   * Updates to any target element are decoupled from the underlying TJSPosition data. This method returns this instance
   * that you can then await on the target element inline style update by using {@link TJSPosition.elementUpdated}.
   *
   * @param {import('./').TJSPositionDataExtended} [position] - TJSPosition data to set.
   *
   * @returns {TJSPosition} This TJSPosition instance.
   */
  set(position = {}) {
    if (!isObject(position)) {
      throw new TypeError(`Position - set error: 'position' is not an object.`);
    }
    const parent = this.#parent;
    if (!this.#enabled) {
      return this;
    }
    if (parent !== void 0 && typeof parent?.options?.positionable === "boolean" && !parent?.options?.positionable) {
      return this;
    }
    const immediateElementUpdate = position.immediateElementUpdate === true;
    const data = this.#data;
    const transforms = this.#transforms;
    const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
    const el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;
    const changeSet = this.#positionChangeSet;
    const styleCache = this.#styleCache;
    if (el) {
      if (!styleCache.hasData(el)) {
        styleCache.update(el);
        if (!styleCache.hasWillChange)
          ;
        changeSet.set(true);
        this.#updateElementData.queued = false;
      }
      convertRelative(position, this);
      position = this.#updatePosition(position, parent, el, styleCache);
      if (position === null) {
        return this;
      }
    }
    if (Number.isFinite(position.left)) {
      position.left = Math.round(position.left);
      if (data.left !== position.left) {
        data.left = position.left;
        changeSet.left = true;
      }
    }
    if (Number.isFinite(position.top)) {
      position.top = Math.round(position.top);
      if (data.top !== position.top) {
        data.top = position.top;
        changeSet.top = true;
      }
    }
    if (Number.isFinite(position.maxHeight) || position.maxHeight === null) {
      position.maxHeight = typeof position.maxHeight === "number" ? Math.round(position.maxHeight) : null;
      if (data.maxHeight !== position.maxHeight) {
        data.maxHeight = position.maxHeight;
        changeSet.maxHeight = true;
      }
    }
    if (Number.isFinite(position.maxWidth) || position.maxWidth === null) {
      position.maxWidth = typeof position.maxWidth === "number" ? Math.round(position.maxWidth) : null;
      if (data.maxWidth !== position.maxWidth) {
        data.maxWidth = position.maxWidth;
        changeSet.maxWidth = true;
      }
    }
    if (Number.isFinite(position.minHeight) || position.minHeight === null) {
      position.minHeight = typeof position.minHeight === "number" ? Math.round(position.minHeight) : null;
      if (data.minHeight !== position.minHeight) {
        data.minHeight = position.minHeight;
        changeSet.minHeight = true;
      }
    }
    if (Number.isFinite(position.minWidth) || position.minWidth === null) {
      position.minWidth = typeof position.minWidth === "number" ? Math.round(position.minWidth) : null;
      if (data.minWidth !== position.minWidth) {
        data.minWidth = position.minWidth;
        changeSet.minWidth = true;
      }
    }
    if (Number.isFinite(position.rotateX) || position.rotateX === null) {
      if (data.rotateX !== position.rotateX) {
        data.rotateX = transforms.rotateX = position.rotateX;
        changeSet.transform = true;
      }
    }
    if (Number.isFinite(position.rotateY) || position.rotateY === null) {
      if (data.rotateY !== position.rotateY) {
        data.rotateY = transforms.rotateY = position.rotateY;
        changeSet.transform = true;
      }
    }
    if (Number.isFinite(position.rotateZ) || position.rotateZ === null) {
      if (data.rotateZ !== position.rotateZ) {
        data.rotateZ = transforms.rotateZ = position.rotateZ;
        changeSet.transform = true;
      }
    }
    if (Number.isFinite(position.scale) || position.scale === null) {
      position.scale = typeof position.scale === "number" ? Math.max(0, Math.min(position.scale, 1e3)) : null;
      if (data.scale !== position.scale) {
        data.scale = transforms.scale = position.scale;
        changeSet.transform = true;
      }
    }
    if (typeof position.transformOrigin === "string" && transformOrigins.includes(
      position.transformOrigin
    ) || position.transformOrigin === null) {
      if (data.transformOrigin !== position.transformOrigin) {
        data.transformOrigin = position.transformOrigin;
        changeSet.transformOrigin = true;
      }
    }
    if (Number.isFinite(position.translateX) || position.translateX === null) {
      if (data.translateX !== position.translateX) {
        data.translateX = transforms.translateX = position.translateX;
        changeSet.transform = true;
      }
    }
    if (Number.isFinite(position.translateY) || position.translateY === null) {
      if (data.translateY !== position.translateY) {
        data.translateY = transforms.translateY = position.translateY;
        changeSet.transform = true;
      }
    }
    if (Number.isFinite(position.translateZ) || position.translateZ === null) {
      if (data.translateZ !== position.translateZ) {
        data.translateZ = transforms.translateZ = position.translateZ;
        changeSet.transform = true;
      }
    }
    if (Number.isFinite(position.zIndex)) {
      position.zIndex = Math.round(position.zIndex);
      if (data.zIndex !== position.zIndex) {
        data.zIndex = position.zIndex;
        changeSet.zIndex = true;
      }
    }
    if (Number.isFinite(position.width) || position.width === "auto" || position.width === "inherit" || position.width === null) {
      position.width = typeof position.width === "number" ? Math.round(position.width) : position.width;
      if (data.width !== position.width) {
        data.width = position.width;
        changeSet.width = true;
      }
    }
    if (Number.isFinite(position.height) || position.height === "auto" || position.height === "inherit" || position.height === null) {
      position.height = typeof position.height === "number" ? Math.round(position.height) : position.height;
      if (data.height !== position.height) {
        data.height = position.height;
        changeSet.height = true;
      }
    }
    if (el) {
      const defaultData = this.#state.getDefault();
      if (!isObject(defaultData)) {
        this.#state.save({ name: "#defaultData", ...Object.assign({}, data) });
      }
      if (immediateElementUpdate) {
        UpdateElementManager.immediate(el, this.#updateElementData);
        this.#updateElementPromise = Promise.resolve(performance.now());
      } else if (!this.#updateElementData.queued) {
        this.#updateElementPromise = UpdateElementManager.add(el, this.#updateElementData);
      }
    } else {
      UpdateElementManager.updateSubscribers(this.#updateElementData);
    }
    return this;
  }
  /**
   * @param {import('svelte/store').Subscriber<TJSPositionData>} handler - Callback function that is invoked on
   *        update / changes. Receives a copy of the TJSPositionData.
   *
   * @returns {import('svelte/store').Unsubscriber} Unsubscribe function.
   */
  subscribe(handler) {
    this.#subscriptions.push(handler);
    handler(Object.assign({}, this.#data));
    return () => {
      const index = this.#subscriptions.findIndex((sub) => sub === handler);
      if (index >= 0) {
        this.#subscriptions.splice(index, 1);
      }
    };
  }
  /**
   * @param {import('./').TJSPositionDataExtended} opts -
   *
   * @param {number|null} opts.left -
   *
   * @param {number|null} opts.top -
   *
   * @param {number|null} opts.maxHeight -
   *
   * @param {number|null} opts.maxWidth -
   *
   * @param {number|null} opts.minHeight -
   *
   * @param {number|null} opts.minWidth -
   *
   * @param {number|'auto'|null} opts.width -
   *
   * @param {number|'auto'|null} opts.height -
   *
   * @param {number|null} opts.rotateX -
   *
   * @param {number|null} opts.rotateY -
   *
   * @param {number|null} opts.rotateZ -
   *
   * @param {number|null} opts.scale -
   *
   * @param {string} opts.transformOrigin -
   *
   * @param {number|null} opts.translateX -
   *
   * @param {number|null} opts.translateY -
   *
   * @param {number|null} opts.translateZ -
   *
   * @param {number|null} opts.zIndex -
   *
   * @param {number|null} opts.rotation - alias for rotateZ
   *
   * @param {*} opts.rest -
   *
   * @param {object} parent -
   *
   * @param {HTMLElement} el -
   *
   * @param {StyleCache} styleCache -
   *
   * @returns {null|TJSPositionData} Updated position data or null if validation fails.
   */
  #updatePosition({
    // Directly supported parameters
    left,
    top,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
    width,
    height,
    rotateX,
    rotateY,
    rotateZ,
    scale,
    transformOrigin,
    translateX,
    translateY,
    translateZ,
    zIndex,
    // Aliased parameters
    rotation,
    ...rest
  } = {}, parent, el, styleCache) {
    let currentPosition = s_DATA_UPDATE.copy(this.#data);
    if (el.style.width === "" || width !== void 0) {
      if (width === "auto" || currentPosition.width === "auto" && width !== null) {
        currentPosition.width = "auto";
        width = styleCache.offsetWidth;
      } else if (width === "inherit" || currentPosition.width === "inherit" && width !== null) {
        currentPosition.width = "inherit";
        width = styleCache.offsetWidth;
      } else {
        const newWidth = Number.isFinite(width) ? width : currentPosition.width;
        currentPosition.width = width = Number.isFinite(newWidth) ? Math.round(newWidth) : styleCache.offsetWidth;
      }
    } else {
      width = Number.isFinite(currentPosition.width) ? currentPosition.width : styleCache.offsetWidth;
    }
    if (el.style.height === "" || height !== void 0) {
      if (height === "auto" || currentPosition.height === "auto" && height !== null) {
        currentPosition.height = "auto";
        height = styleCache.offsetHeight;
      } else if (height === "inherit" || currentPosition.height === "inherit" && height !== null) {
        currentPosition.height = "inherit";
        height = styleCache.offsetHeight;
      } else {
        const newHeight = Number.isFinite(height) ? height : currentPosition.height;
        currentPosition.height = height = Number.isFinite(newHeight) ? Math.round(newHeight) : styleCache.offsetHeight;
      }
    } else {
      height = Number.isFinite(currentPosition.height) ? currentPosition.height : styleCache.offsetHeight;
    }
    if (Number.isFinite(left)) {
      currentPosition.left = left;
    } else if (!Number.isFinite(currentPosition.left)) {
      currentPosition.left = typeof this.#options.initialHelper?.getLeft === "function" ? this.#options.initialHelper.getLeft(width) : 0;
    }
    if (Number.isFinite(top)) {
      currentPosition.top = top;
    } else if (!Number.isFinite(currentPosition.top)) {
      currentPosition.top = typeof this.#options.initialHelper?.getTop === "function" ? this.#options.initialHelper.getTop(height) : 0;
    }
    if (Number.isFinite(maxHeight) || maxHeight === null) {
      currentPosition.maxHeight = Number.isFinite(maxHeight) ? Math.round(maxHeight) : null;
    }
    if (Number.isFinite(maxWidth) || maxWidth === null) {
      currentPosition.maxWidth = Number.isFinite(maxWidth) ? Math.round(maxWidth) : null;
    }
    if (Number.isFinite(minHeight) || minHeight === null) {
      currentPosition.minHeight = Number.isFinite(minHeight) ? Math.round(minHeight) : null;
    }
    if (Number.isFinite(minWidth) || minWidth === null) {
      currentPosition.minWidth = Number.isFinite(minWidth) ? Math.round(minWidth) : null;
    }
    if (Number.isFinite(rotateX) || rotateX === null) {
      currentPosition.rotateX = rotateX;
    }
    if (Number.isFinite(rotateY) || rotateY === null) {
      currentPosition.rotateY = rotateY;
    }
    if (rotateZ !== currentPosition.rotateZ && (Number.isFinite(rotateZ) || rotateZ === null)) {
      currentPosition.rotateZ = rotateZ;
    } else if (rotation !== currentPosition.rotateZ && (Number.isFinite(rotation) || rotation === null)) {
      currentPosition.rotateZ = rotation;
    }
    if (Number.isFinite(translateX) || translateX === null) {
      currentPosition.translateX = translateX;
    }
    if (Number.isFinite(translateY) || translateY === null) {
      currentPosition.translateY = translateY;
    }
    if (Number.isFinite(translateZ) || translateZ === null) {
      currentPosition.translateZ = translateZ;
    }
    if (Number.isFinite(scale) || scale === null) {
      currentPosition.scale = typeof scale === "number" ? Math.max(0, Math.min(scale, 1e3)) : null;
    }
    if (typeof transformOrigin === "string" || transformOrigin === null) {
      currentPosition.transformOrigin = transformOrigins.includes(transformOrigin) ? transformOrigin : null;
    }
    if (Number.isFinite(zIndex) || zIndex === null) {
      currentPosition.zIndex = typeof zIndex === "number" ? Math.round(zIndex) : zIndex;
    }
    const validatorData = this.#validatorData;
    if (this.#validators.enabled && validatorData.length) {
      s_VALIDATION_DATA.parent = parent;
      s_VALIDATION_DATA.el = el;
      s_VALIDATION_DATA.computed = styleCache.computed;
      s_VALIDATION_DATA.transforms = this.#transforms;
      s_VALIDATION_DATA.height = height;
      s_VALIDATION_DATA.width = width;
      s_VALIDATION_DATA.marginLeft = styleCache.marginLeft;
      s_VALIDATION_DATA.marginTop = styleCache.marginTop;
      s_VALIDATION_DATA.maxHeight = styleCache.maxHeight ?? currentPosition.maxHeight;
      s_VALIDATION_DATA.maxWidth = styleCache.maxWidth ?? currentPosition.maxWidth;
      const isMinimized = parent?.reactive?.minimized ?? false;
      s_VALIDATION_DATA.minHeight = isMinimized ? currentPosition.minHeight ?? 0 : styleCache.minHeight || (currentPosition.minHeight ?? 0);
      s_VALIDATION_DATA.minWidth = isMinimized ? currentPosition.minWidth ?? 0 : styleCache.minWidth || (currentPosition.minWidth ?? 0);
      for (let cntr = 0; cntr < validatorData.length; cntr++) {
        s_VALIDATION_DATA.position = currentPosition;
        s_VALIDATION_DATA.rest = rest;
        currentPosition = validatorData[cntr].validator(s_VALIDATION_DATA);
        if (currentPosition === null) {
          return null;
        }
      }
    }
    return currentPosition;
  }
}
const s_DATA_UPDATE = new TJSPositionData();
const s_VALIDATION_DATA = {
  position: void 0,
  parent: void 0,
  el: void 0,
  computed: void 0,
  transforms: void 0,
  height: void 0,
  width: void 0,
  marginLeft: void 0,
  marginTop: void 0,
  maxHeight: void 0,
  maxWidth: void 0,
  minHeight: void 0,
  minWidth: void 0,
  rest: void 0
};
Object.seal(s_VALIDATION_DATA);
function draggable(node, {
  position,
  active: active2 = true,
  button = 0,
  storeDragging = void 0,
  ease = false,
  easeOptions = { duration: 0.1, ease: cubicOut },
  hasTargetClassList,
  ignoreTargetClassList
}) {
  if (hasTargetClassList !== void 0 && !isIterable(hasTargetClassList)) {
    throw new TypeError(`'hasTargetClassList' is not iterable.`);
  }
  if (ignoreTargetClassList !== void 0 && !isIterable(ignoreTargetClassList)) {
    throw new TypeError(`'ignoreTargetClassList' is not iterable.`);
  }
  const positionData = { left: 0, top: 0 };
  let initialPosition = null;
  let initialDragPoint = {};
  let dragging = false;
  let quickTo = position.animate.quickTo(["top", "left"], easeOptions);
  const handlers = {
    dragDown: ["pointerdown", onDragPointerDown, false],
    dragMove: ["pointermove", onDragPointerChange, false],
    dragUp: ["pointerup", onDragPointerUp, false]
  };
  function activateListeners() {
    node.addEventListener(...handlers.dragDown);
    node.classList.add("draggable");
  }
  function removeListeners() {
    if (typeof storeDragging?.set === "function") {
      storeDragging.set(false);
    }
    node.removeEventListener(...handlers.dragDown);
    node.removeEventListener(...handlers.dragMove);
    node.removeEventListener(...handlers.dragUp);
    node.classList.remove("draggable");
  }
  if (active2) {
    activateListeners();
  }
  function onDragPointerDown(event) {
    if (event.button !== button || !event.isPrimary) {
      return;
    }
    if (!position.enabled) {
      return;
    }
    if (ignoreTargetClassList !== void 0 && event.target instanceof HTMLElement) {
      for (const targetClass of ignoreTargetClassList) {
        if (event.target.classList.contains(targetClass)) {
          return;
        }
      }
    }
    if (hasTargetClassList !== void 0 && event.target instanceof HTMLElement) {
      let foundTarget = false;
      for (const targetClass of hasTargetClassList) {
        if (event.target.classList.contains(targetClass)) {
          foundTarget = true;
          break;
        }
      }
      if (!foundTarget) {
        return;
      }
    }
    event.preventDefault();
    dragging = false;
    initialPosition = position.get();
    initialDragPoint = { x: event.clientX, y: event.clientY };
    node.addEventListener(...handlers.dragMove);
    node.addEventListener(...handlers.dragUp);
    node.setPointerCapture(event.pointerId);
  }
  function onDragPointerChange(event) {
    if ((event.buttons & 1) === 0) {
      onDragPointerUp(event);
      return;
    }
    if (event.button !== -1 || !event.isPrimary) {
      return;
    }
    event.preventDefault();
    if (!dragging && typeof storeDragging?.set === "function") {
      dragging = true;
      storeDragging.set(true);
    }
    const newLeft = initialPosition.left + (event.clientX - initialDragPoint.x);
    const newTop = initialPosition.top + (event.clientY - initialDragPoint.y);
    if (ease) {
      quickTo(newTop, newLeft);
    } else {
      positionData.left = newLeft;
      positionData.top = newTop;
      position.set(positionData);
    }
  }
  function onDragPointerUp(event) {
    event.preventDefault();
    dragging = false;
    if (typeof storeDragging?.set === "function") {
      storeDragging.set(false);
    }
    node.removeEventListener(...handlers.dragMove);
    node.removeEventListener(...handlers.dragUp);
  }
  return {
    // The default of active being true won't automatically add listeners twice.
    update: (options) => {
      if (typeof options.active === "boolean") {
        active2 = options.active;
        if (active2) {
          activateListeners();
        } else {
          removeListeners();
        }
      }
      if (typeof options.button === "number") {
        button = options.button;
      }
      if (options.position !== void 0 && options.position !== position) {
        position = options.position;
        quickTo = position.animate.quickTo(["top", "left"], easeOptions);
      }
      if (typeof options.ease === "boolean") {
        ease = options.ease;
      }
      if (isObject(options.easeOptions)) {
        easeOptions = options.easeOptions;
        quickTo.options(easeOptions);
      }
      if (options.hasTargetClassList !== void 0) {
        if (!isIterable(options.hasTargetClassList)) {
          throw new TypeError(`'hasTargetClassList' is not iterable.`);
        } else {
          hasTargetClassList = options.hasTargetClassList;
        }
      }
      if (options.ignoreTargetClassList !== void 0) {
        if (!isIterable(options.ignoreTargetClassList)) {
          throw new TypeError(`'ignoreTargetClassList' is not iterable.`);
        } else {
          ignoreTargetClassList = options.ignoreTargetClassList;
        }
      }
    },
    destroy: () => removeListeners()
  };
}
class DraggableOptions {
  #ease = false;
  /**
   * @type {{ duration: number, ease: (t: number) => number | string }}
   */
  #easeOptions = { duration: 0.1, ease: cubicOut };
  /**
   * Stores the subscribers.
   *
   * @type {import('svelte/store').Subscriber<DraggableOptions>[]}
   */
  #subscriptions = [];
  /**
   *
   * @param {object} [opts] - Optional parameters.
   *
   * @param {boolean}  [opts.ease] -
   *
   * @param {object}   [opts.easeOptions] -
   */
  constructor({ ease, easeOptions } = {}) {
    Object.defineProperty(this, "ease", {
      get: () => {
        return this.#ease;
      },
      set: (newEase) => {
        if (typeof newEase !== "boolean") {
          throw new TypeError(`'ease' is not a boolean.`);
        }
        this.#ease = newEase;
        this.#updateSubscribers();
      },
      enumerable: true
    });
    Object.defineProperty(this, "easeOptions", {
      get: () => {
        return this.#easeOptions;
      },
      set: (newEaseOptions) => {
        if (!isObject(newEaseOptions)) {
          throw new TypeError(`'easeOptions' is not an object.`);
        }
        if (newEaseOptions.duration !== void 0) {
          if (!Number.isFinite(newEaseOptions.duration)) {
            throw new TypeError(`'easeOptions.duration' is not a finite number.`);
          }
          if (newEaseOptions.duration < 0) {
            throw new Error(`'easeOptions.duration' is less than 0.`);
          }
          this.#easeOptions.duration = newEaseOptions.duration;
        }
        if (newEaseOptions.ease !== void 0) {
          if (typeof newEaseOptions.ease !== "function" && typeof newEaseOptions.ease !== "string") {
            throw new TypeError(`'easeOptions.ease' is not a function or string.`);
          }
          this.#easeOptions.ease = newEaseOptions.ease;
        }
        this.#updateSubscribers();
      },
      enumerable: true
    });
    if (ease !== void 0) {
      this.ease = ease;
    }
    if (easeOptions !== void 0) {
      this.easeOptions = easeOptions;
    }
  }
  /**
   * @returns {number} Get ease duration
   */
  get easeDuration() {
    return this.#easeOptions.duration;
  }
  /**
   * @returns {string|Function} Get easing function value.
   */
  get easeValue() {
    return this.#easeOptions.ease;
  }
  /**
   * @param {number}   duration - Set ease duration.
   */
  set easeDuration(duration) {
    if (!Number.isFinite(duration)) {
      throw new TypeError(`'duration' is not a finite number.`);
    }
    if (duration < 0) {
      throw new Error(`'duration' is less than 0.`);
    }
    this.#easeOptions.duration = duration;
    this.#updateSubscribers();
  }
  /**
   * @param {string|Function} value - Get easing function value.
   */
  set easeValue(value) {
    if (typeof value !== "function" && typeof value !== "string") {
      throw new TypeError(`'value' is not a function or string.`);
    }
    this.#easeOptions.ease = value;
    this.#updateSubscribers();
  }
  /**
   * Resets all options data to default values.
   */
  reset() {
    this.#ease = false;
    this.#easeOptions = { duration: 0.1, ease: cubicOut };
    this.#updateSubscribers();
  }
  /**
   * Resets easing options to default values.
   */
  resetEase() {
    this.#easeOptions = { duration: 0.1, ease: cubicOut };
    this.#updateSubscribers();
  }
  /**
   *
   * @param {import('svelte/store').Subscriber<DraggableOptions>} handler - Callback function that is invoked on
   *        update / changes. Receives the DraggableOptions object / instance.
   *
   * @returns {import('svelte/store').Unsubscriber} Unsubscribe function.
   */
  subscribe(handler) {
    this.#subscriptions.push(handler);
    handler(this);
    return () => {
      const index = this.#subscriptions.findIndex((sub) => sub === handler);
      if (index >= 0) {
        this.#subscriptions.splice(index, 1);
      }
    };
  }
  #updateSubscribers() {
    const subscriptions = this.#subscriptions;
    if (subscriptions.length > 0) {
      for (let cntr = 0; cntr < subscriptions.length; cntr++) {
        subscriptions[cntr](this);
      }
    }
  }
}
draggable.options = (options) => new DraggableOptions(options);
function create_if_block$2(ctx) {
  let span;
  let t2;
  return {
    c() {
      span = element("span");
      t2 = text(
        /*label*/
        ctx[3]
      );
      attr(span, "class", "svelte-gas-166l8wd");
      toggle_class(
        span,
        "has-icon",
        /*icon*/
        ctx[4] !== void 0
      );
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t2);
    },
    p(ctx2, dirty) {
      if (dirty & /*label*/
      8) set_data(
        t2,
        /*label*/
        ctx2[3]
      );
      if (dirty & /*icon*/
      16) {
        toggle_class(
          span,
          "has-icon",
          /*icon*/
          ctx2[4] !== void 0
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_fragment$5(ctx) {
  let a2;
  let html_tag;
  let html_anchor;
  let a_class_value;
  let applyStyles_action;
  let mounted;
  let dispose;
  let if_block = (
    /*label*/
    ctx[3] && create_if_block$2(ctx)
  );
  return {
    c() {
      a2 = element("a");
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      if (if_block) if_block.c();
      html_tag.a = html_anchor;
      attr(a2, "class", a_class_value = "header-button " + /*button*/
      ctx[0].class + " svelte-gas-166l8wd");
      attr(
        a2,
        "aria-label",
        /*label*/
        ctx[3]
      );
      attr(a2, "tabindex", "0");
      attr(a2, "role", "button");
      toggle_class(
        a2,
        "keep-minimized",
        /*keepMinimized*/
        ctx[2]
      );
    },
    m(target, anchor) {
      insert(target, a2, anchor);
      html_tag.m(
        /*icon*/
        ctx[4],
        a2
      );
      append(a2, html_anchor);
      if (if_block) if_block.m(a2, null);
      if (!mounted) {
        dispose = [
          listen(a2, "click", stop_propagation(prevent_default(
            /*onClick*/
            ctx[5]
          ))),
          listen(a2, "contextmenu", stop_propagation(prevent_default(
            /*onContextMenu*/
            ctx[6]
          ))),
          listen(
            a2,
            "keydown",
            /*onKeydown*/
            ctx[7]
          ),
          listen(
            a2,
            "keyup",
            /*onKeyup*/
            ctx[8]
          ),
          action_destroyer(applyStyles_action = applyStyles.call(
            null,
            a2,
            /*styles*/
            ctx[1]
          ))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*icon*/
      16) html_tag.p(
        /*icon*/
        ctx2[4]
      );
      if (
        /*label*/
        ctx2[3]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$2(ctx2);
          if_block.c();
          if_block.m(a2, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty & /*button*/
      1 && a_class_value !== (a_class_value = "header-button " + /*button*/
      ctx2[0].class + " svelte-gas-166l8wd")) {
        attr(a2, "class", a_class_value);
      }
      if (dirty & /*label*/
      8) {
        attr(
          a2,
          "aria-label",
          /*label*/
          ctx2[3]
        );
      }
      if (applyStyles_action && is_function(applyStyles_action.update) && dirty & /*styles*/
      2) applyStyles_action.update.call(
        null,
        /*styles*/
        ctx2[1]
      );
      if (dirty & /*button, keepMinimized*/
      5) {
        toggle_class(
          a2,
          "keep-minimized",
          /*keepMinimized*/
          ctx2[2]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(a2);
      }
      if (if_block) if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
const s_REGEX_HTML = /^\s*<.*>$/;
function instance$5($$self, $$props, $$invalidate) {
  let title;
  let icon;
  let label;
  let keepMinimized;
  let keyCode;
  let styles;
  let { button = void 0 } = $$props;
  function onClick(event) {
    const invoke = button?.onPress ?? button?.onclick;
    if (typeof invoke === "function") {
      invoke.call(button, event);
      $$invalidate(0, button);
    }
  }
  function onContextMenu(event) {
    const invoke = button?.onContextMenu;
    if (typeof invoke === "function") {
      invoke.call(button, event);
      $$invalidate(0, button);
    }
  }
  function onKeydown(event) {
    if (event.code === keyCode) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  function onKeyup(event) {
    if (event.code === keyCode) {
      const invoke = button.onPress ?? button.onclick;
      if (typeof invoke === "function") {
        invoke.call(button, event);
        $$invalidate(0, button);
      }
      event.preventDefault();
      event.stopPropagation();
    }
  }
  $$self.$$set = ($$props2) => {
    if ("button" in $$props2) $$invalidate(0, button = $$props2.button);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*button*/
    1) {
      $$invalidate(9, title = isObject(button) && typeof button.title === "string" ? localize(button.title) : "");
    }
    if ($$self.$$.dirty & /*button, title*/
    513) {
      $$invalidate(4, icon = isObject(button) && typeof button.icon !== "string" ? void 0 : s_REGEX_HTML.test(button.icon) ? button.icon : `<i class="${button.icon}" title="${title}"></i>`);
    }
    if ($$self.$$.dirty & /*button*/
    1) {
      $$invalidate(3, label = isObject(button) && typeof button.label === "string" ? localize(button.label) : void 0);
    }
    if ($$self.$$.dirty & /*button*/
    1) {
      $$invalidate(2, keepMinimized = isObject(button) && typeof button.keepMinimized === "boolean" ? button.keepMinimized : false);
    }
    if ($$self.$$.dirty & /*button*/
    1) {
      keyCode = isObject(button) && typeof button.keyCode === "string" ? button.keyCode : "Enter";
    }
    if ($$self.$$.dirty & /*button*/
    1) {
      $$invalidate(1, styles = isObject(button) && isObject(button.styles) ? button.styles : void 0);
    }
  };
  return [
    button,
    styles,
    keepMinimized,
    label,
    icon,
    onClick,
    onContextMenu,
    onKeydown,
    onKeyup,
    title
  ];
}
class TJSHeaderButton extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$5, safe_not_equal, { button: 0 });
  }
  get button() {
    return this.$$.ctx[0];
  }
  set button(button) {
    this.$$set({ button });
    flush();
  }
}
function get_each_context(ctx, list, i2) {
  const child_ctx = ctx.slice();
  child_ctx[31] = list[i2];
  return child_ctx;
}
function get_each_context_1(ctx, list, i2) {
  const child_ctx = ctx.slice();
  child_ctx[31] = list[i2];
  return child_ctx;
}
function create_if_block$1(ctx) {
  let img;
  let img_src_value;
  return {
    c() {
      img = element("img");
      attr(img, "class", "tjs-app-icon keep-minimized svelte-gas-1wviwl9");
      if (!src_url_equal(img.src, img_src_value = /*$storeHeaderIcon*/
      ctx[6])) attr(img, "src", img_src_value);
      attr(img, "alt", "icon");
    },
    m(target, anchor) {
      insert(target, img, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*$storeHeaderIcon*/
      64 && !src_url_equal(img.src, img_src_value = /*$storeHeaderIcon*/
      ctx2[6])) {
        attr(img, "src", img_src_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(img);
      }
    }
  };
}
function create_each_block_1(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    /*button*/
    ctx[31].props
  ];
  var switch_value = (
    /*button*/
    ctx[31].class
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {};
    for (let i2 = 0; i2 < switch_instance_spread_levels.length; i2 += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i2]);
    }
    if (dirty !== void 0 && dirty[0] & /*buttonsLeft*/
    2) {
      switch_instance_props = assign(switch_instance_props, get_spread_update(switch_instance_spread_levels, [get_spread_object(
        /*button*/
        ctx2[31].props
      )]));
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*buttonsLeft*/
      2 && switch_value !== (switch_value = /*button*/
      ctx2[31].class)) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2, dirty));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty[0] & /*buttonsLeft*/
        2 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
          /*button*/
          ctx2[31].props
        )]) : {};
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
}
function create_each_block(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    /*button*/
    ctx[31].props
  ];
  var switch_value = (
    /*button*/
    ctx[31].class
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {};
    for (let i2 = 0; i2 < switch_instance_spread_levels.length; i2 += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i2]);
    }
    if (dirty !== void 0 && dirty[0] & /*buttonsRight*/
    4) {
      switch_instance_props = assign(switch_instance_props, get_spread_update(switch_instance_spread_levels, [get_spread_object(
        /*button*/
        ctx2[31].props
      )]));
    }
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*buttonsRight*/
      4 && switch_value !== (switch_value = /*button*/
      ctx2[31].class)) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2, dirty));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty[0] & /*buttonsRight*/
        4 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
          /*button*/
          ctx2[31].props
        )]) : {};
        switch_instance.$set(switch_instance_changes);
      }
    },
    i(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
}
function create_key_block(ctx) {
  let header;
  let t0;
  let h4;
  let t1_value = localize(
    /*$storeTitle*/
    ctx[7]
  ) + "";
  let t1;
  let t2;
  let t3;
  let span;
  let t4;
  let draggable_action;
  let minimizable_action;
  let current;
  let mounted;
  let dispose;
  let if_block = typeof /*$storeHeaderIcon*/
  ctx[6] === "string" && create_if_block$1(ctx);
  let each_value_1 = ensure_array_like(
    /*buttonsLeft*/
    ctx[1]
  );
  let each_blocks_1 = [];
  for (let i2 = 0; i2 < each_value_1.length; i2 += 1) {
    each_blocks_1[i2] = create_each_block_1(get_each_context_1(ctx, each_value_1, i2));
  }
  const out = (i2) => transition_out(each_blocks_1[i2], 1, 1, () => {
    each_blocks_1[i2] = null;
  });
  let each_value = ensure_array_like(
    /*buttonsRight*/
    ctx[2]
  );
  let each_blocks = [];
  for (let i2 = 0; i2 < each_value.length; i2 += 1) {
    each_blocks[i2] = create_each_block(get_each_context(ctx, each_value, i2));
  }
  const out_1 = (i2) => transition_out(each_blocks[i2], 1, 1, () => {
    each_blocks[i2] = null;
  });
  return {
    c() {
      header = element("header");
      if (if_block) if_block.c();
      t0 = space();
      h4 = element("h4");
      t1 = text(t1_value);
      t2 = space();
      for (let i2 = 0; i2 < each_blocks_1.length; i2 += 1) {
        each_blocks_1[i2].c();
      }
      t3 = space();
      span = element("span");
      t4 = space();
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        each_blocks[i2].c();
      }
      attr(h4, "class", "window-title svelte-gas-1wviwl9");
      set_style(
        h4,
        "display",
        /*displayHeaderTitle*/
        ctx[4]
      );
      attr(span, "class", "tjs-window-header-spacer keep-minimized svelte-gas-1wviwl9");
      attr(header, "class", "window-header flexrow svelte-gas-1wviwl9");
    },
    m(target, anchor) {
      insert(target, header, anchor);
      if (if_block) if_block.m(header, null);
      append(header, t0);
      append(header, h4);
      append(h4, t1);
      append(header, t2);
      for (let i2 = 0; i2 < each_blocks_1.length; i2 += 1) {
        if (each_blocks_1[i2]) {
          each_blocks_1[i2].m(header, null);
        }
      }
      append(header, t3);
      append(header, span);
      append(header, t4);
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        if (each_blocks[i2]) {
          each_blocks[i2].m(header, null);
        }
      }
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(draggable_action = /*draggable*/
          ctx[0].call(
            null,
            header,
            /*dragOptions*/
            ctx[3]
          )),
          action_destroyer(minimizable_action = /*minimizable*/
          ctx[18].call(
            null,
            header,
            /*$storeMinimizable*/
            ctx[5]
          )),
          listen(
            header,
            "pointerdown",
            /*onPointerdown*/
            ctx[19]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (typeof /*$storeHeaderIcon*/
      ctx2[6] === "string") {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$1(ctx2);
          if_block.c();
          if_block.m(header, t0);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if ((!current || dirty[0] & /*$storeTitle*/
      128) && t1_value !== (t1_value = localize(
        /*$storeTitle*/
        ctx2[7]
      ) + "")) set_data(t1, t1_value);
      if (dirty[0] & /*displayHeaderTitle*/
      16) {
        set_style(
          h4,
          "display",
          /*displayHeaderTitle*/
          ctx2[4]
        );
      }
      if (dirty[0] & /*buttonsLeft*/
      2) {
        each_value_1 = ensure_array_like(
          /*buttonsLeft*/
          ctx2[1]
        );
        let i2;
        for (i2 = 0; i2 < each_value_1.length; i2 += 1) {
          const child_ctx = get_each_context_1(ctx2, each_value_1, i2);
          if (each_blocks_1[i2]) {
            each_blocks_1[i2].p(child_ctx, dirty);
            transition_in(each_blocks_1[i2], 1);
          } else {
            each_blocks_1[i2] = create_each_block_1(child_ctx);
            each_blocks_1[i2].c();
            transition_in(each_blocks_1[i2], 1);
            each_blocks_1[i2].m(header, t3);
          }
        }
        group_outros();
        for (i2 = each_value_1.length; i2 < each_blocks_1.length; i2 += 1) {
          out(i2);
        }
        check_outros();
      }
      if (dirty[0] & /*buttonsRight*/
      4) {
        each_value = ensure_array_like(
          /*buttonsRight*/
          ctx2[2]
        );
        let i2;
        for (i2 = 0; i2 < each_value.length; i2 += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i2);
          if (each_blocks[i2]) {
            each_blocks[i2].p(child_ctx, dirty);
            transition_in(each_blocks[i2], 1);
          } else {
            each_blocks[i2] = create_each_block(child_ctx);
            each_blocks[i2].c();
            transition_in(each_blocks[i2], 1);
            each_blocks[i2].m(header, null);
          }
        }
        group_outros();
        for (i2 = each_value.length; i2 < each_blocks.length; i2 += 1) {
          out_1(i2);
        }
        check_outros();
      }
      if (draggable_action && is_function(draggable_action.update) && dirty[0] & /*dragOptions*/
      8) draggable_action.update.call(
        null,
        /*dragOptions*/
        ctx2[3]
      );
      if (minimizable_action && is_function(minimizable_action.update) && dirty[0] & /*$storeMinimizable*/
      32) minimizable_action.update.call(
        null,
        /*$storeMinimizable*/
        ctx2[5]
      );
    },
    i(local) {
      if (current) return;
      for (let i2 = 0; i2 < each_value_1.length; i2 += 1) {
        transition_in(each_blocks_1[i2]);
      }
      for (let i2 = 0; i2 < each_value.length; i2 += 1) {
        transition_in(each_blocks[i2]);
      }
      current = true;
    },
    o(local) {
      each_blocks_1 = each_blocks_1.filter(Boolean);
      for (let i2 = 0; i2 < each_blocks_1.length; i2 += 1) {
        transition_out(each_blocks_1[i2]);
      }
      each_blocks = each_blocks.filter(Boolean);
      for (let i2 = 0; i2 < each_blocks.length; i2 += 1) {
        transition_out(each_blocks[i2]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(header);
      }
      if (if_block) if_block.d();
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$4(ctx) {
  let previous_key = (
    /*draggable*/
    ctx[0]
  );
  let key_block_anchor;
  let current;
  let key_block = create_key_block(ctx);
  return {
    c() {
      key_block.c();
      key_block_anchor = empty();
    },
    m(target, anchor) {
      key_block.m(target, anchor);
      insert(target, key_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*draggable*/
      1 && safe_not_equal(previous_key, previous_key = /*draggable*/
      ctx2[0])) {
        group_outros();
        transition_out(key_block, 1, 1, noop);
        check_outros();
        key_block = create_key_block(ctx2);
        key_block.c();
        transition_in(key_block, 1);
        key_block.m(key_block_anchor.parentNode, key_block_anchor);
      } else {
        key_block.p(ctx2, dirty);
      }
    },
    i(local) {
      if (current) return;
      transition_in(key_block);
      current = true;
    },
    o(local) {
      transition_out(key_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(key_block_anchor);
      }
      key_block.d(detaching);
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let $focusKeep;
  let $focusAuto;
  let $elementRoot;
  let $storeHeaderButtons;
  let $storeMinimized;
  let $storeHeaderNoTitleMinimized;
  let $storeDraggable;
  let $storeMinimizable;
  let $storeHeaderIcon;
  let $storeTitle;
  let { draggable: draggable$1 = void 0 } = $$props;
  let { draggableOptions = void 0 } = $$props;
  const { application } = getContext("#external");
  const { focusAuto, focusKeep } = application.reactive.storeAppOptions;
  component_subscribe($$self, focusAuto, (value) => $$invalidate(26, $focusAuto = value));
  component_subscribe($$self, focusKeep, (value) => $$invalidate(25, $focusKeep = value));
  const { elementRoot } = getContext("#internal").stores;
  component_subscribe($$self, elementRoot, (value) => $$invalidate(27, $elementRoot = value));
  const storeTitle = application.reactive.storeAppOptions.title;
  component_subscribe($$self, storeTitle, (value) => $$invalidate(7, $storeTitle = value));
  const storeDraggable = application.reactive.storeAppOptions.draggable;
  component_subscribe($$self, storeDraggable, (value) => $$invalidate(24, $storeDraggable = value));
  const storeDragging = application.reactive.storeUIState.dragging;
  const storeHeaderButtons = application.reactive.storeUIState.headerButtons;
  component_subscribe($$self, storeHeaderButtons, (value) => $$invalidate(21, $storeHeaderButtons = value));
  const storeHeaderIcon = application.reactive.storeAppOptions.headerIcon;
  component_subscribe($$self, storeHeaderIcon, (value) => $$invalidate(6, $storeHeaderIcon = value));
  const storeHeaderNoTitleMinimized = application.reactive.storeAppOptions.headerNoTitleMinimized;
  component_subscribe($$self, storeHeaderNoTitleMinimized, (value) => $$invalidate(23, $storeHeaderNoTitleMinimized = value));
  const storeMinimizable = application.reactive.storeAppOptions.minimizable;
  component_subscribe($$self, storeMinimizable, (value) => $$invalidate(5, $storeMinimizable = value));
  const storeMinimized = application.reactive.storeUIState.minimized;
  component_subscribe($$self, storeMinimized, (value) => $$invalidate(22, $storeMinimized = value));
  const s_DRAG_TARGET_CLASSLIST = Object.freeze(["tjs-app-icon", "tjs-window-header-spacer", "window-header", "window-title"]);
  let dragOptions;
  let displayHeaderTitle;
  let buttonsLeft;
  let buttonsRight;
  function minimizable(node, booleanStore) {
    const callback = (event) => {
      if (event.target.classList.contains("window-title") || event.target.classList.contains("window-header") || event.target.classList.contains("keep-minimized")) {
        application._onToggleMinimize(event);
      }
    };
    function activateListeners() {
      node.addEventListener("dblclick", callback);
    }
    function removeListeners() {
      node.removeEventListener("dblclick", callback);
    }
    if (booleanStore) {
      activateListeners();
    }
    return {
      update: (booleanStore2) => {
        if (booleanStore2) {
          activateListeners();
        } else {
          removeListeners();
        }
      },
      destroy: () => removeListeners()
    };
  }
  function onPointerdown(event) {
    const rootEl = $elementRoot;
    if ($focusAuto && rootEl instanceof HTMLElement && rootEl?.isConnected) {
      if ($focusKeep) {
        const focusOutside = document.activeElement instanceof HTMLElement && !rootEl.contains(document.activeElement);
        if (focusOutside) {
          rootEl.focus();
        } else {
          event.preventDefault();
        }
      } else {
        rootEl.focus();
      }
    }
  }
  $$self.$$set = ($$props2) => {
    if ("draggable" in $$props2) $$invalidate(0, draggable$1 = $$props2.draggable);
    if ("draggableOptions" in $$props2) $$invalidate(20, draggableOptions = $$props2.draggableOptions);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*draggable*/
    1) {
      $$invalidate(0, draggable$1 = typeof draggable$1 === "function" ? draggable$1 : draggable);
    }
    if ($$self.$$.dirty[0] & /*draggableOptions, $storeDraggable*/
    17825792) {
      $$invalidate(3, dragOptions = Object.assign(
        {},
        {
          ease: true,
          easeOptions: { duration: 0.06, ease: cubicOut }
        },
        isObject(draggableOptions) ? draggableOptions : {},
        {
          position: application.position,
          active: $storeDraggable,
          storeDragging,
          hasTargetClassList: s_DRAG_TARGET_CLASSLIST
        }
      ));
    }
    if ($$self.$$.dirty[0] & /*$storeHeaderNoTitleMinimized, $storeMinimized*/
    12582912) {
      $$invalidate(4, displayHeaderTitle = $storeHeaderNoTitleMinimized && $storeMinimized ? "none" : null);
    }
    if ($$self.$$.dirty[0] & /*$storeHeaderButtons, buttonsLeft, buttonsRight*/
    2097158) {
      {
        $$invalidate(1, buttonsLeft = []);
        $$invalidate(2, buttonsRight = []);
        for (const button of $storeHeaderButtons) {
          const buttonsList = typeof button?.alignLeft === "boolean" && button?.alignLeft ? buttonsLeft : buttonsRight;
          buttonsList.push(isSvelteComponent(button) ? { class: button, props: {} } : {
            class: TJSHeaderButton,
            props: { button }
          });
        }
      }
    }
  };
  return [
    draggable$1,
    buttonsLeft,
    buttonsRight,
    dragOptions,
    displayHeaderTitle,
    $storeMinimizable,
    $storeHeaderIcon,
    $storeTitle,
    focusAuto,
    focusKeep,
    elementRoot,
    storeTitle,
    storeDraggable,
    storeHeaderButtons,
    storeHeaderIcon,
    storeHeaderNoTitleMinimized,
    storeMinimizable,
    storeMinimized,
    minimizable,
    onPointerdown,
    draggableOptions,
    $storeHeaderButtons,
    $storeMinimized,
    $storeHeaderNoTitleMinimized,
    $storeDraggable
  ];
}
class TJSApplicationHeader extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$4, safe_not_equal, { draggable: 0, draggableOptions: 20 }, null, [-1, -1]);
  }
}
function create_fragment$3(ctx) {
  let div;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      attr(div, "class", "tjs-focus-wrap svelte-gas-kjcljd");
      attr(div, "tabindex", "0");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      ctx[4](div);
      if (!mounted) {
        dispose = listen(
          div,
          "focus",
          /*onFocus*/
          ctx[1]
        );
        mounted = true;
      }
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      ctx[4](null);
      mounted = false;
      dispose();
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let { elementRoot = void 0 } = $$props;
  let { enabled = true } = $$props;
  let ignoreElements, wrapEl;
  function onFocus() {
    if (!enabled) {
      return;
    }
    if (elementRoot instanceof HTMLElement) {
      const firstFocusEl = A11yHelper.getFirstFocusableElement(elementRoot, ignoreElements);
      if (firstFocusEl instanceof HTMLElement && firstFocusEl !== wrapEl) {
        firstFocusEl.focus();
      } else {
        elementRoot.focus();
      }
    }
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      wrapEl = $$value;
      $$invalidate(0, wrapEl);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("elementRoot" in $$props2) $$invalidate(2, elementRoot = $$props2.elementRoot);
    if ("enabled" in $$props2) $$invalidate(3, enabled = $$props2.enabled);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*wrapEl*/
    1) {
      if (wrapEl) {
        ignoreElements = /* @__PURE__ */ new Set([wrapEl]);
      }
    }
  };
  return [wrapEl, onFocus, elementRoot, enabled, div_binding];
}
class TJSFocusWrap extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$3, safe_not_equal, { elementRoot: 2, enabled: 3 });
  }
}
function create_fragment$2(ctx) {
  let div;
  let resizable_action;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      div.innerHTML = `<i class="fas fa-arrows-alt-h svelte-gas-14lnpz8"></i>`;
      attr(div, "class", "window-resizable-handle svelte-gas-14lnpz8");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      ctx[10](div);
      if (!mounted) {
        dispose = action_destroyer(resizable_action = /*resizable*/
        ctx[6].call(null, div, {
          active: (
            /*$storeResizable*/
            ctx[1]
          ),
          storeResizing: (
            /*storeResizing*/
            ctx[5]
          )
        }));
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (resizable_action && is_function(resizable_action.update) && dirty & /*$storeResizable*/
      2) resizable_action.update.call(null, {
        active: (
          /*$storeResizable*/
          ctx2[1]
        ),
        storeResizing: (
          /*storeResizing*/
          ctx2[5]
        )
      });
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      ctx[10](null);
      mounted = false;
      dispose();
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let $storeElementRoot;
  let $storeMinimized;
  let $storeResizable;
  let { isResizable = false } = $$props;
  const application = getContext("#external").application;
  const storeElementRoot = getContext("#internal").stores.elementRoot;
  component_subscribe($$self, storeElementRoot, (value) => $$invalidate(8, $storeElementRoot = value));
  const storeResizable = application.reactive.storeAppOptions.resizable;
  component_subscribe($$self, storeResizable, (value) => $$invalidate(1, $storeResizable = value));
  const storeMinimized = application.reactive.storeUIState.minimized;
  component_subscribe($$self, storeMinimized, (value) => $$invalidate(9, $storeMinimized = value));
  const storeResizing = application.reactive.storeUIState.resizing;
  let elementResize;
  function resizable(node, { active: active2 = true, storeResizing: storeResizing2 = void 0 } = {}) {
    let position = null;
    let initialPosition = {};
    let resizing = false;
    const handlers = {
      resizeDown: ["pointerdown", (e) => onResizePointerDown(e), false],
      resizeMove: ["pointermove", (e) => onResizePointerMove(e), false],
      resizeUp: ["pointerup", (e) => onResizePointerUp(e), false]
    };
    function activateListeners() {
      node.addEventListener(...handlers.resizeDown);
      $$invalidate(7, isResizable = true);
      node.style.display = "block";
    }
    function removeListeners() {
      if (typeof storeResizing2?.set === "function") {
        storeResizing2.set(false);
      }
      node.removeEventListener(...handlers.resizeDown);
      node.removeEventListener(...handlers.resizeMove);
      node.removeEventListener(...handlers.resizeUp);
      node.style.display = "none";
      $$invalidate(7, isResizable = false);
    }
    if (active2) {
      activateListeners();
    } else {
      node.style.display = "none";
    }
    function onResizePointerDown(event) {
      event.preventDefault();
      resizing = false;
      position = application.position.get();
      if (position.height === "auto") {
        position.height = $storeElementRoot.clientHeight;
      }
      if (position.width === "auto") {
        position.width = $storeElementRoot.clientWidth;
      }
      initialPosition = { x: event.clientX, y: event.clientY };
      node.addEventListener(...handlers.resizeMove);
      node.addEventListener(...handlers.resizeUp);
      node.setPointerCapture(event.pointerId);
    }
    function onResizePointerMove(event) {
      event.preventDefault();
      if (!resizing && typeof storeResizing2?.set === "function") {
        resizing = true;
        storeResizing2.set(true);
      }
      application.position.set({
        width: position.width + (event.clientX - initialPosition.x),
        height: position.height + (event.clientY - initialPosition.y)
      });
    }
    function onResizePointerUp(event) {
      resizing = false;
      if (typeof storeResizing2?.set === "function") {
        storeResizing2.set(false);
      }
      event.preventDefault();
      node.removeEventListener(...handlers.resizeMove);
      node.removeEventListener(...handlers.resizeUp);
      application?._onResize?.(event);
    }
    return {
      update: ({ active: active3 }) => {
        if (active3) {
          activateListeners();
        } else {
          removeListeners();
        }
      },
      destroy: () => removeListeners()
    };
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      elementResize = $$value;
      $$invalidate(0, elementResize), $$invalidate(7, isResizable), $$invalidate(9, $storeMinimized), $$invalidate(8, $storeElementRoot);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("isResizable" in $$props2) $$invalidate(7, isResizable = $$props2.isResizable);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*elementResize, isResizable, $storeMinimized, $storeElementRoot*/
    897) {
      if (elementResize) {
        $$invalidate(0, elementResize.style.display = isResizable && !$storeMinimized ? "block" : "none", elementResize);
        const elementRoot = $storeElementRoot;
        if (elementRoot) {
          elementRoot.classList[isResizable ? "add" : "remove"]("resizable");
        }
      }
    }
  };
  return [
    elementResize,
    $storeResizable,
    storeElementRoot,
    storeResizable,
    storeMinimized,
    storeResizing,
    resizable,
    isResizable,
    $storeElementRoot,
    $storeMinimized,
    div_binding
  ];
}
class ResizableHandle extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$2, safe_not_equal, { isResizable: 7 });
  }
}
function create_else_block(ctx) {
  let div;
  let tjsapplicationheader;
  let t0;
  let section;
  let applyStyles_action;
  let t1;
  let resizablehandle;
  let t2;
  let tjsfocuswrap;
  let div_id_value;
  let div_class_value;
  let div_data_appid_value;
  let applyStyles_action_1;
  let current;
  let mounted;
  let dispose;
  tjsapplicationheader = new TJSApplicationHeader({
    props: {
      draggable: (
        /*draggable*/
        ctx[6]
      ),
      draggableOptions: (
        /*draggableOptions*/
        ctx[7]
      )
    }
  });
  const default_slot_template = (
    /*#slots*/
    ctx[36].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[35],
    null
  );
  resizablehandle = new ResizableHandle({});
  tjsfocuswrap = new TJSFocusWrap({
    props: {
      elementRoot: (
        /*elementRoot*/
        ctx[1]
      ),
      enabled: (
        /*focusWrapEnabled*/
        ctx[11]
      )
    }
  });
  return {
    c() {
      div = element("div");
      create_component(tjsapplicationheader.$$.fragment);
      t0 = space();
      section = element("section");
      if (default_slot) default_slot.c();
      t1 = space();
      create_component(resizablehandle.$$.fragment);
      t2 = space();
      create_component(tjsfocuswrap.$$.fragment);
      attr(section, "class", "window-content svelte-gas-oz81f7");
      attr(section, "tabindex", "-1");
      attr(div, "id", div_id_value = /*application*/
      ctx[10].id);
      attr(div, "class", div_class_value = "app window-app " + /*application*/
      ctx[10].options.classes.join(" ") + " svelte-gas-oz81f7");
      attr(div, "data-appid", div_data_appid_value = /*application*/
      ctx[10].appId);
      attr(div, "role", "application");
      attr(div, "tabindex", "-1");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(tjsapplicationheader, div, null);
      append(div, t0);
      append(div, section);
      if (default_slot) {
        default_slot.m(section, null);
      }
      ctx[39](section);
      append(div, t1);
      mount_component(resizablehandle, div, null);
      append(div, t2);
      mount_component(tjsfocuswrap, div, null);
      ctx[40](div);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            section,
            "pointerdown",
            /*onPointerdownContent*/
            ctx[21]
          ),
          action_destroyer(applyStyles_action = applyStyles.call(
            null,
            section,
            /*stylesContent*/
            ctx[9]
          )),
          action_destroyer(
            /*contentResizeObserver*/
            ctx[13].call(
              null,
              section,
              /*resizeObservedContent*/
              ctx[22]
            )
          ),
          listen(div, "close:popup", stop_propagation(prevent_default(
            /*onClosePopup*/
            ctx[18]
          ))),
          listen(
            div,
            "keydown",
            /*onKeydown*/
            ctx[19],
            true
          ),
          listen(
            div,
            "pointerdown",
            /*onPointerdownApp*/
            ctx[20]
          ),
          action_destroyer(applyStyles_action_1 = applyStyles.call(
            null,
            div,
            /*stylesApp*/
            ctx[8]
          )),
          action_destroyer(
            /*appResizeObserver*/
            ctx[12].call(
              null,
              div,
              /*resizeObservedApp*/
              ctx[23]
            )
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      const tjsapplicationheader_changes = {};
      if (dirty[0] & /*draggable*/
      64) tjsapplicationheader_changes.draggable = /*draggable*/
      ctx2[6];
      if (dirty[0] & /*draggableOptions*/
      128) tjsapplicationheader_changes.draggableOptions = /*draggableOptions*/
      ctx2[7];
      tjsapplicationheader.$set(tjsapplicationheader_changes);
      if (default_slot) {
        if (default_slot.p && (!current || dirty[1] & /*$$scope*/
        16)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[35],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[35]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[35],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (applyStyles_action && is_function(applyStyles_action.update) && dirty[0] & /*stylesContent*/
      512) applyStyles_action.update.call(
        null,
        /*stylesContent*/
        ctx2[9]
      );
      const tjsfocuswrap_changes = {};
      if (dirty[0] & /*elementRoot*/
      2) tjsfocuswrap_changes.elementRoot = /*elementRoot*/
      ctx2[1];
      if (dirty[0] & /*focusWrapEnabled*/
      2048) tjsfocuswrap_changes.enabled = /*focusWrapEnabled*/
      ctx2[11];
      tjsfocuswrap.$set(tjsfocuswrap_changes);
      if (!current || dirty[0] & /*application*/
      1024 && div_id_value !== (div_id_value = /*application*/
      ctx2[10].id)) {
        attr(div, "id", div_id_value);
      }
      if (!current || dirty[0] & /*application*/
      1024 && div_class_value !== (div_class_value = "app window-app " + /*application*/
      ctx2[10].options.classes.join(" ") + " svelte-gas-oz81f7")) {
        attr(div, "class", div_class_value);
      }
      if (!current || dirty[0] & /*application*/
      1024 && div_data_appid_value !== (div_data_appid_value = /*application*/
      ctx2[10].appId)) {
        attr(div, "data-appid", div_data_appid_value);
      }
      if (applyStyles_action_1 && is_function(applyStyles_action_1.update) && dirty[0] & /*stylesApp*/
      256) applyStyles_action_1.update.call(
        null,
        /*stylesApp*/
        ctx2[8]
      );
    },
    i(local) {
      if (current) return;
      transition_in(tjsapplicationheader.$$.fragment, local);
      transition_in(default_slot, local);
      transition_in(resizablehandle.$$.fragment, local);
      transition_in(tjsfocuswrap.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tjsapplicationheader.$$.fragment, local);
      transition_out(default_slot, local);
      transition_out(resizablehandle.$$.fragment, local);
      transition_out(tjsfocuswrap.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(tjsapplicationheader);
      if (default_slot) default_slot.d(detaching);
      ctx[39](null);
      destroy_component(resizablehandle);
      destroy_component(tjsfocuswrap);
      ctx[40](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block(ctx) {
  let div;
  let tjsapplicationheader;
  let t0;
  let section;
  let applyStyles_action;
  let t1;
  let resizablehandle;
  let t2;
  let tjsfocuswrap;
  let div_id_value;
  let div_class_value;
  let div_data_appid_value;
  let applyStyles_action_1;
  let div_intro;
  let div_outro;
  let current;
  let mounted;
  let dispose;
  tjsapplicationheader = new TJSApplicationHeader({
    props: {
      draggable: (
        /*draggable*/
        ctx[6]
      ),
      draggableOptions: (
        /*draggableOptions*/
        ctx[7]
      )
    }
  });
  const default_slot_template = (
    /*#slots*/
    ctx[36].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[35],
    null
  );
  resizablehandle = new ResizableHandle({});
  tjsfocuswrap = new TJSFocusWrap({
    props: { elementRoot: (
      /*elementRoot*/
      ctx[1]
    ) }
  });
  return {
    c() {
      div = element("div");
      create_component(tjsapplicationheader.$$.fragment);
      t0 = space();
      section = element("section");
      if (default_slot) default_slot.c();
      t1 = space();
      create_component(resizablehandle.$$.fragment);
      t2 = space();
      create_component(tjsfocuswrap.$$.fragment);
      attr(section, "class", "window-content svelte-gas-oz81f7");
      attr(section, "tabindex", "-1");
      attr(div, "id", div_id_value = /*application*/
      ctx[10].id);
      attr(div, "class", div_class_value = "app window-app " + /*application*/
      ctx[10].options.classes.join(" ") + " svelte-gas-oz81f7");
      attr(div, "data-appid", div_data_appid_value = /*application*/
      ctx[10].appId);
      attr(div, "role", "application");
      attr(div, "tabindex", "-1");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(tjsapplicationheader, div, null);
      append(div, t0);
      append(div, section);
      if (default_slot) {
        default_slot.m(section, null);
      }
      ctx[37](section);
      append(div, t1);
      mount_component(resizablehandle, div, null);
      append(div, t2);
      mount_component(tjsfocuswrap, div, null);
      ctx[38](div);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            section,
            "pointerdown",
            /*onPointerdownContent*/
            ctx[21]
          ),
          action_destroyer(applyStyles_action = applyStyles.call(
            null,
            section,
            /*stylesContent*/
            ctx[9]
          )),
          action_destroyer(
            /*contentResizeObserver*/
            ctx[13].call(
              null,
              section,
              /*resizeObservedContent*/
              ctx[22]
            )
          ),
          listen(div, "close:popup", stop_propagation(prevent_default(
            /*onClosePopup*/
            ctx[18]
          ))),
          listen(
            div,
            "keydown",
            /*onKeydown*/
            ctx[19],
            true
          ),
          listen(
            div,
            "pointerdown",
            /*onPointerdownApp*/
            ctx[20]
          ),
          action_destroyer(applyStyles_action_1 = applyStyles.call(
            null,
            div,
            /*stylesApp*/
            ctx[8]
          )),
          action_destroyer(
            /*appResizeObserver*/
            ctx[12].call(
              null,
              div,
              /*resizeObservedApp*/
              ctx[23]
            )
          )
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const tjsapplicationheader_changes = {};
      if (dirty[0] & /*draggable*/
      64) tjsapplicationheader_changes.draggable = /*draggable*/
      ctx[6];
      if (dirty[0] & /*draggableOptions*/
      128) tjsapplicationheader_changes.draggableOptions = /*draggableOptions*/
      ctx[7];
      tjsapplicationheader.$set(tjsapplicationheader_changes);
      if (default_slot) {
        if (default_slot.p && (!current || dirty[1] & /*$$scope*/
        16)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx,
            /*$$scope*/
            ctx[35],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx[35]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx[35],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (applyStyles_action && is_function(applyStyles_action.update) && dirty[0] & /*stylesContent*/
      512) applyStyles_action.update.call(
        null,
        /*stylesContent*/
        ctx[9]
      );
      const tjsfocuswrap_changes = {};
      if (dirty[0] & /*elementRoot*/
      2) tjsfocuswrap_changes.elementRoot = /*elementRoot*/
      ctx[1];
      tjsfocuswrap.$set(tjsfocuswrap_changes);
      if (!current || dirty[0] & /*application*/
      1024 && div_id_value !== (div_id_value = /*application*/
      ctx[10].id)) {
        attr(div, "id", div_id_value);
      }
      if (!current || dirty[0] & /*application*/
      1024 && div_class_value !== (div_class_value = "app window-app " + /*application*/
      ctx[10].options.classes.join(" ") + " svelte-gas-oz81f7")) {
        attr(div, "class", div_class_value);
      }
      if (!current || dirty[0] & /*application*/
      1024 && div_data_appid_value !== (div_data_appid_value = /*application*/
      ctx[10].appId)) {
        attr(div, "data-appid", div_data_appid_value);
      }
      if (applyStyles_action_1 && is_function(applyStyles_action_1.update) && dirty[0] & /*stylesApp*/
      256) applyStyles_action_1.update.call(
        null,
        /*stylesApp*/
        ctx[8]
      );
    },
    i(local) {
      if (current) return;
      transition_in(tjsapplicationheader.$$.fragment, local);
      transition_in(default_slot, local);
      transition_in(resizablehandle.$$.fragment, local);
      transition_in(tjsfocuswrap.$$.fragment, local);
      add_render_callback(() => {
        if (!current) return;
        if (div_outro) div_outro.end(1);
        div_intro = create_in_transition(
          div,
          /*inTransition*/
          ctx[2],
          /*inTransitionOptions*/
          ctx[4]
        );
        div_intro.start();
      });
      current = true;
    },
    o(local) {
      transition_out(tjsapplicationheader.$$.fragment, local);
      transition_out(default_slot, local);
      transition_out(resizablehandle.$$.fragment, local);
      transition_out(tjsfocuswrap.$$.fragment, local);
      if (div_intro) div_intro.invalidate();
      div_outro = create_out_transition(
        div,
        /*outTransition*/
        ctx[3],
        /*outTransitionOptions*/
        ctx[5]
      );
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(tjsapplicationheader);
      if (default_slot) default_slot.d(detaching);
      ctx[37](null);
      destroy_component(resizablehandle);
      destroy_component(tjsfocuswrap);
      ctx[38](null);
      if (detaching && div_outro) div_outro.end();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$1(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*inTransition*/
      ctx2[2] !== TJSDefaultTransition.default || /*outTransition*/
      ctx2[3] !== TJSDefaultTransition.default
    ) return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let $focusKeep;
  let $focusAuto;
  let $minimized;
  let $focusTrap;
  let { $$slots: slots = {}, $$scope } = $$props;
  let { elementContent = void 0 } = $$props;
  let { elementRoot = void 0 } = $$props;
  let { draggable: draggable2 = void 0 } = $$props;
  let { draggableOptions = void 0 } = $$props;
  let { stylesApp = void 0 } = $$props;
  let { stylesContent = void 0 } = $$props;
  let { appOffsetHeight = false } = $$props;
  let { appOffsetWidth = false } = $$props;
  const appResizeObserver = !!appOffsetHeight || !!appOffsetWidth ? resizeObserver : () => null;
  let { contentOffsetHeight = false } = $$props;
  let { contentOffsetWidth = false } = $$props;
  const contentResizeObserver = !!contentOffsetHeight || !!contentOffsetWidth ? resizeObserver : () => null;
  const internal = new AppShellContextInternal();
  const s_IGNORE_CLASSES = { ignoreClasses: ["tjs-focus-wrap"] };
  setContext("#internal", internal);
  const { application } = getContext("#external");
  const { focusAuto, focusKeep, focusTrap } = application.reactive.storeAppOptions;
  component_subscribe($$self, focusAuto, (value) => $$invalidate(32, $focusAuto = value));
  component_subscribe($$self, focusKeep, (value) => $$invalidate(41, $focusKeep = value));
  component_subscribe($$self, focusTrap, (value) => $$invalidate(34, $focusTrap = value));
  const { minimized } = application.reactive.storeUIState;
  component_subscribe($$self, minimized, (value) => $$invalidate(33, $minimized = value));
  let focusWrapEnabled;
  let { transition = TJSDefaultTransition.default } = $$props;
  let { inTransition = TJSDefaultTransition.default } = $$props;
  let { outTransition = TJSDefaultTransition.default } = $$props;
  let { transitionOptions = void 0 } = $$props;
  let { inTransitionOptions = TJSDefaultTransition.options } = $$props;
  let { outTransitionOptions = TJSDefaultTransition.options } = $$props;
  let oldTransition = TJSDefaultTransition.default;
  let oldTransitionOptions = void 0;
  onMount(() => elementRoot.focus());
  function onClosePopup(event) {
    if (!$focusAuto) {
      return;
    }
    const targetEl = event?.detail?.target;
    if (!(targetEl instanceof HTMLElement)) {
      return;
    }
    if (A11yHelper.isFocusable(targetEl)) {
      return;
    }
    const elementRootContains = elementRoot.contains(targetEl);
    if (targetEl === elementRoot) {
      elementRoot.focus();
    } else if (targetEl === elementContent) {
      elementContent.focus();
    } else if (elementRootContains) {
      if (elementContent.contains(targetEl)) {
        elementContent.focus();
      } else {
        elementRoot.focus();
      }
    }
  }
  function onKeydown(event) {
    if ((event.target === elementRoot || event.target === elementContent) && KeyboardManager && KeyboardManager?._getMatchingActions?.(KeyboardManager?.getKeyboardEventContext?.(event))?.length) {
      event.target?.blur();
      return;
    }
    if (focusWrapEnabled && event.shiftKey && event.code === "Tab") {
      const allFocusable = A11yHelper.getFocusableElements(elementRoot, s_IGNORE_CLASSES);
      const firstFocusEl = allFocusable.length > 0 ? allFocusable[0] : void 0;
      const lastFocusEl = allFocusable.length > 0 ? allFocusable[allFocusable.length - 1] : void 0;
      if (elementRoot === document.activeElement || firstFocusEl === document.activeElement) {
        if (lastFocusEl instanceof HTMLElement && firstFocusEl !== lastFocusEl) {
          lastFocusEl.focus();
        }
        event.preventDefault();
        event.stopPropagation();
      }
    }
    if (typeof application?.options?.popOut === "boolean" && application.options.popOut && application !== globalThis.ui?.activeWindow) {
      application.bringToTop.call(application);
    }
  }
  function onPointerdownApp() {
    if (typeof application?.options?.popOut === "boolean" && application.options.popOut && application !== globalThis.ui?.activeWindow) {
      application.bringToTop.call(application);
    }
  }
  function onPointerdownContent(event) {
    const focusable = A11yHelper.isFocusable(event.target);
    if (!focusable && $focusAuto) {
      if ($focusKeep) {
        const focusOutside = document.activeElement instanceof HTMLElement && !elementRoot.contains(document.activeElement);
        if (focusOutside) {
          elementContent.focus();
        } else {
          event.preventDefault();
        }
      } else {
        elementContent.focus();
      }
    }
  }
  function resizeObservedContent(offsetWidth, offsetHeight) {
    $$invalidate(27, contentOffsetWidth = offsetWidth);
    $$invalidate(26, contentOffsetHeight = offsetHeight);
  }
  function resizeObservedApp(offsetWidth, offsetHeight, contentWidth, contentHeight) {
    application.position.stores.resizeObserved.update((object) => {
      object.contentWidth = contentWidth;
      object.contentHeight = contentHeight;
      object.offsetWidth = offsetWidth;
      object.offsetHeight = offsetHeight;
      return object;
    });
    $$invalidate(24, appOffsetHeight = offsetHeight);
    $$invalidate(25, appOffsetWidth = offsetWidth);
  }
  function section_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      elementContent = $$value;
      $$invalidate(0, elementContent);
    });
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      elementRoot = $$value;
      $$invalidate(1, elementRoot);
    });
  }
  function section_binding_1($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      elementContent = $$value;
      $$invalidate(0, elementContent);
    });
  }
  function div_binding_1($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      elementRoot = $$value;
      $$invalidate(1, elementRoot);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("elementContent" in $$props2) $$invalidate(0, elementContent = $$props2.elementContent);
    if ("elementRoot" in $$props2) $$invalidate(1, elementRoot = $$props2.elementRoot);
    if ("draggable" in $$props2) $$invalidate(6, draggable2 = $$props2.draggable);
    if ("draggableOptions" in $$props2) $$invalidate(7, draggableOptions = $$props2.draggableOptions);
    if ("stylesApp" in $$props2) $$invalidate(8, stylesApp = $$props2.stylesApp);
    if ("stylesContent" in $$props2) $$invalidate(9, stylesContent = $$props2.stylesContent);
    if ("appOffsetHeight" in $$props2) $$invalidate(24, appOffsetHeight = $$props2.appOffsetHeight);
    if ("appOffsetWidth" in $$props2) $$invalidate(25, appOffsetWidth = $$props2.appOffsetWidth);
    if ("contentOffsetHeight" in $$props2) $$invalidate(26, contentOffsetHeight = $$props2.contentOffsetHeight);
    if ("contentOffsetWidth" in $$props2) $$invalidate(27, contentOffsetWidth = $$props2.contentOffsetWidth);
    if ("transition" in $$props2) $$invalidate(28, transition = $$props2.transition);
    if ("inTransition" in $$props2) $$invalidate(2, inTransition = $$props2.inTransition);
    if ("outTransition" in $$props2) $$invalidate(3, outTransition = $$props2.outTransition);
    if ("transitionOptions" in $$props2) $$invalidate(29, transitionOptions = $$props2.transitionOptions);
    if ("inTransitionOptions" in $$props2) $$invalidate(4, inTransitionOptions = $$props2.inTransitionOptions);
    if ("outTransitionOptions" in $$props2) $$invalidate(5, outTransitionOptions = $$props2.outTransitionOptions);
    if ("$$scope" in $$props2) $$invalidate(35, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*elementContent*/
    1) {
      if (elementContent !== void 0 && elementContent !== null) {
        getContext("#internal").stores.elementContent.set(elementContent);
      }
    }
    if ($$self.$$.dirty[0] & /*elementRoot*/
    2) {
      if (elementRoot !== void 0 && elementRoot !== null) {
        getContext("#internal").stores.elementRoot.set(elementRoot);
      }
    }
    if ($$self.$$.dirty[1] & /*$focusAuto, $focusTrap, $minimized*/
    14) {
      $$invalidate(11, focusWrapEnabled = $focusAuto && $focusTrap && !$minimized);
    }
    if ($$self.$$.dirty[0] & /*oldTransition, transition*/
    1342177280) {
      if (oldTransition !== transition) {
        const newTransition = typeof transition === "function" ? transition : TJSDefaultTransition.default;
        $$invalidate(2, inTransition = newTransition);
        $$invalidate(3, outTransition = newTransition);
        $$invalidate(30, oldTransition = newTransition);
      }
    }
    if ($$self.$$.dirty[0] & /*transitionOptions*/
    536870912 | $$self.$$.dirty[1] & /*oldTransitionOptions*/
    1) {
      if (oldTransitionOptions !== transitionOptions) {
        const newOptions = transitionOptions !== TJSDefaultTransition.options && isObject(transitionOptions) ? transitionOptions : TJSDefaultTransition.options;
        $$invalidate(4, inTransitionOptions = newOptions);
        $$invalidate(5, outTransitionOptions = newOptions);
        $$invalidate(31, oldTransitionOptions = newOptions);
      }
    }
    if ($$self.$$.dirty[0] & /*inTransition*/
    4) {
      if (typeof inTransition !== "function") {
        $$invalidate(2, inTransition = TJSDefaultTransition.default);
      }
    }
    if ($$self.$$.dirty[0] & /*outTransition, application*/
    1032) {
      {
        if (typeof outTransition !== "function") {
          $$invalidate(3, outTransition = TJSDefaultTransition.default);
        }
        const defaultCloseAnimation = application?.options?.defaultCloseAnimation;
        if (typeof defaultCloseAnimation === "boolean" && defaultCloseAnimation && outTransition !== TJSDefaultTransition.default) {
          $$invalidate(10, application.options.defaultCloseAnimation = false, application);
        }
      }
    }
    if ($$self.$$.dirty[0] & /*inTransitionOptions*/
    16) {
      if (!isObject(inTransitionOptions)) {
        $$invalidate(4, inTransitionOptions = TJSDefaultTransition.options);
      }
    }
    if ($$self.$$.dirty[0] & /*outTransitionOptions*/
    32) {
      if (!isObject(outTransitionOptions)) {
        $$invalidate(5, outTransitionOptions = TJSDefaultTransition.options);
      }
    }
  };
  return [
    elementContent,
    elementRoot,
    inTransition,
    outTransition,
    inTransitionOptions,
    outTransitionOptions,
    draggable2,
    draggableOptions,
    stylesApp,
    stylesContent,
    application,
    focusWrapEnabled,
    appResizeObserver,
    contentResizeObserver,
    focusAuto,
    focusKeep,
    focusTrap,
    minimized,
    onClosePopup,
    onKeydown,
    onPointerdownApp,
    onPointerdownContent,
    resizeObservedContent,
    resizeObservedApp,
    appOffsetHeight,
    appOffsetWidth,
    contentOffsetHeight,
    contentOffsetWidth,
    transition,
    transitionOptions,
    oldTransition,
    oldTransitionOptions,
    $focusAuto,
    $minimized,
    $focusTrap,
    $$scope,
    slots,
    section_binding,
    div_binding,
    section_binding_1,
    div_binding_1
  ];
}
class ApplicationShell extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$1,
      create_fragment$1,
      safe_not_equal,
      {
        elementContent: 0,
        elementRoot: 1,
        draggable: 6,
        draggableOptions: 7,
        stylesApp: 8,
        stylesContent: 9,
        appOffsetHeight: 24,
        appOffsetWidth: 25,
        contentOffsetHeight: 26,
        contentOffsetWidth: 27,
        transition: 28,
        inTransition: 2,
        outTransition: 3,
        transitionOptions: 29,
        inTransitionOptions: 4,
        outTransitionOptions: 5
      },
      null,
      [-1, -1]
    );
  }
  get elementContent() {
    return this.$$.ctx[0];
  }
  set elementContent(elementContent) {
    this.$$set({ elementContent });
    flush();
  }
  get elementRoot() {
    return this.$$.ctx[1];
  }
  set elementRoot(elementRoot) {
    this.$$set({ elementRoot });
    flush();
  }
  get draggable() {
    return this.$$.ctx[6];
  }
  set draggable(draggable2) {
    this.$$set({ draggable: draggable2 });
    flush();
  }
  get draggableOptions() {
    return this.$$.ctx[7];
  }
  set draggableOptions(draggableOptions) {
    this.$$set({ draggableOptions });
    flush();
  }
  get stylesApp() {
    return this.$$.ctx[8];
  }
  set stylesApp(stylesApp) {
    this.$$set({ stylesApp });
    flush();
  }
  get stylesContent() {
    return this.$$.ctx[9];
  }
  set stylesContent(stylesContent) {
    this.$$set({ stylesContent });
    flush();
  }
  get appOffsetHeight() {
    return this.$$.ctx[24];
  }
  set appOffsetHeight(appOffsetHeight) {
    this.$$set({ appOffsetHeight });
    flush();
  }
  get appOffsetWidth() {
    return this.$$.ctx[25];
  }
  set appOffsetWidth(appOffsetWidth) {
    this.$$set({ appOffsetWidth });
    flush();
  }
  get contentOffsetHeight() {
    return this.$$.ctx[26];
  }
  set contentOffsetHeight(contentOffsetHeight) {
    this.$$set({ contentOffsetHeight });
    flush();
  }
  get contentOffsetWidth() {
    return this.$$.ctx[27];
  }
  set contentOffsetWidth(contentOffsetWidth) {
    this.$$set({ contentOffsetWidth });
    flush();
  }
  get transition() {
    return this.$$.ctx[28];
  }
  set transition(transition) {
    this.$$set({ transition });
    flush();
  }
  get inTransition() {
    return this.$$.ctx[2];
  }
  set inTransition(inTransition) {
    this.$$set({ inTransition });
    flush();
  }
  get outTransition() {
    return this.$$.ctx[3];
  }
  set outTransition(outTransition) {
    this.$$set({ outTransition });
    flush();
  }
  get transitionOptions() {
    return this.$$.ctx[29];
  }
  set transitionOptions(transitionOptions) {
    this.$$set({ transitionOptions });
    flush();
  }
  get inTransitionOptions() {
    return this.$$.ctx[4];
  }
  set inTransitionOptions(inTransitionOptions) {
    this.$$set({ inTransitionOptions });
    flush();
  }
  get outTransitionOptions() {
    return this.$$.ctx[5];
  }
  set outTransitionOptions(outTransitionOptions) {
    this.$$set({ outTransitionOptions });
    flush();
  }
}
cssVariables.setProperties({
  // Anchor text shadow / header buttons
  "--tjs-default-text-shadow-focus-hover": "0 0 8px var(--color-shadow-primary)",
  // TJSApplicationShell app background.
  "--tjs-app-background": `url("${globalThis.foundry.utils.getRoute("/ui/denim075.png")}")`
}, false);
const MODULE_ID = "foundryvtt-journal-to-pdf";
const LOG_PREFIX = "JOURNAL TO PDF |";
const MODULE_TITLE = "Journal to PDF";
const log = {
  ASSERT: 1,
  ERROR: 2,
  WARN: 3,
  INFO: 4,
  DEBUG: 5,
  VERBOSE: 6,
  set level(level) {
    this.a = level >= this.ASSERT ? console.assert.bind(window.console, LOG_PREFIX) : () => {
    };
    this.e = level >= this.ERROR ? console.error.bind(window.console, LOG_PREFIX) : () => {
    };
    this.w = level >= this.WARN ? console.warn.bind(window.console, LOG_PREFIX) : () => {
    };
    this.i = level >= this.INFO ? console.info.bind(window.console, LOG_PREFIX) : () => {
    };
    this.d = level >= this.DEBUG ? console.debug.bind(window.console, LOG_PREFIX) : () => {
    };
    this.v = level >= this.VERBOSE ? console.log.bind(window.console, LOG_PREFIX) : () => {
    };
    this.loggingLevel = level;
  },
  get level() {
    return this.loggingLevel;
  }
};
function create_default_slot(ctx) {
  let main;
  let section0;
  let h1;
  let p0;
  let h2;
  let p1;
  let hr;
  let section1;
  let div2;
  let div0;
  let input;
  let div1;
  let span;
  let footer;
  let p2;
  let a2;
  let mounted;
  let dispose;
  return {
    c() {
      main = element("main");
      section0 = element("section");
      h1 = element("h1");
      h1.textContent = `${MODULE_TITLE}`;
      p0 = element("p");
      p0.textContent = "A simple module that allows you to create a PDF from a journal. ";
      h2 = element("h2");
      h2.textContent = "Usage intructions";
      p1 = element("p");
      p1.textContent = 'Open a journal and click the "Make PDF" button to create a PDF of the journal.';
      hr = element("hr");
      section1 = element("section");
      div2 = element("div");
      div0 = element("div");
      input = element("input");
      div1 = element("div");
      span = element("span");
      span.textContent = `${localize("GJP.Setting.DontShowWelcome.Name")}`;
      footer = element("footer");
      p2 = element("p");
      p2.textContent = `${MODULE_TITLE} is sponsored by `;
      a2 = element("a");
      a2.textContent = "Round Table Games";
      attr(section0, "class", "info");
      attr(input, "type", "checkbox");
      attr(input, "label", localize("GJP.Setting.DontShowWelcome.Name"));
      attr(div0, "class", "flex0");
      attr(div1, "class", "flex");
      attr(div2, "class", "flexrow inset justify-flexrow-vertical");
      attr(div2, "data-tooltip", localize("GJP.Setting.DontShowWelcome.Hint"));
      attr(section1, "class", "opt-out");
      attr(main, "class", "svelte-gas-1f5phzh");
      attr(a2, "href", "https://www.round-table.games");
      attr(a2, "class", "svelte-gas-1f5phzh");
      attr(footer, "class", "svelte-gas-1f5phzh");
    },
    m(target, anchor) {
      insert(target, main, anchor);
      append(main, section0);
      append(section0, h1);
      append(section0, p0);
      append(section0, h2);
      append(section0, p1);
      append(main, hr);
      append(main, section1);
      append(section1, div2);
      append(div2, div0);
      append(div0, input);
      input.checked = /*dontShowWelcome*/
      ctx[1];
      append(div2, div1);
      append(div1, span);
      insert(target, footer, anchor);
      append(footer, p2);
      append(footer, a2);
      if (!mounted) {
        dispose = [
          listen(
            input,
            "change",
            /*handleChange*/
            ctx[2]
          ),
          listen(
            input,
            "change",
            /*input_change_handler*/
            ctx[5]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*dontShowWelcome*/
      2) {
        input.checked = /*dontShowWelcome*/
        ctx2[1];
      }
    },
    d(detaching) {
      if (detaching) {
        detach(main);
        detach(footer);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let current;
  function applicationshell_elementRoot_binding(value) {
    ctx[6](value);
  }
  let applicationshell_props = {
    $$slots: { default: [create_default_slot] },
    $$scope: { ctx }
  };
  if (
    /*elementRoot*/
    ctx[0] !== void 0
  ) {
    applicationshell_props.elementRoot = /*elementRoot*/
    ctx[0];
  }
  applicationshell = new ApplicationShell({ props: applicationshell_props });
  binding_callbacks.push(() => bind(applicationshell, "elementRoot", applicationshell_elementRoot_binding));
  return {
    c() {
      create_component(applicationshell.$$.fragment);
    },
    m(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const applicationshell_changes = {};
      if (dirty & /*$$scope, dontShowWelcome*/
      514) {
        applicationshell_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_elementRoot && dirty & /*elementRoot*/
      1) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot = /*elementRoot*/
        ctx2[0];
        add_flush_callback(() => updating_elementRoot = false);
      }
      applicationshell.$set(applicationshell_changes);
    },
    i(local) {
      if (current) return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(applicationshell, detaching);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let dontShowWelcome2;
  let { elementRoot = void 0 } = $$props;
  const version2 = void 0;
  const application = getContext("#external").application;
  const handleChange = (event) => {
    game.settings.set(MODULE_ID, "dontShowWelcome", event.target.checked);
  };
  let draggable2 = application.reactive.draggable;
  draggable2 = true;
  onMount(async () => {
  });
  function input_change_handler() {
    dontShowWelcome2 = this.checked;
    $$invalidate(1, dontShowWelcome2);
  }
  function applicationshell_elementRoot_binding(value) {
    elementRoot = value;
    $$invalidate(0, elementRoot);
  }
  $$self.$$set = ($$props2) => {
    if ("elementRoot" in $$props2) $$invalidate(0, elementRoot = $$props2.elementRoot);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*draggable*/
    16) {
      application.reactive.draggable = draggable2;
    }
  };
  $$invalidate(1, dontShowWelcome2 = game.settings.get(MODULE_ID, "dontShowWelcome"));
  return [
    elementRoot,
    dontShowWelcome2,
    handleChange,
    version2,
    draggable2,
    input_change_handler,
    applicationshell_elementRoot_binding
  ];
}
class WelcomeAppShell extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { elementRoot: 0, version: 3 });
  }
  get elementRoot() {
    return this.$$.ctx[0];
  }
  set elementRoot(elementRoot) {
    this.$$set({ elementRoot });
    flush();
  }
  get version() {
    return this.$$.ctx[3];
  }
}
class ApplicationState {
  /** @type {T} */
  #application;
  /** @type {Map<string, ApplicationStateData>} */
  #dataSaved = /* @__PURE__ */ new Map();
  /**
   * @param {T}   application - The application.
   */
  constructor(application) {
    this.#application = application;
    Object.seal(this);
  }
  /**
   * Returns current application state along with any extra data passed into method.
   *
   * @param {object} [extra] - Extra data to add to application state.
   *
   * @returns {ApplicationStateData} Passed in object with current application state.
   */
  get(extra = {}) {
    return Object.assign(extra, {
      position: this.#application?.position?.get(),
      beforeMinimized: this.#application?.position?.state.get({ name: "#beforeMinimized" }),
      options: Object.assign({}, this.#application?.options),
      ui: { minimized: this.#application?.reactive?.minimized }
    });
  }
  /**
   * Returns any stored save state by name.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - Saved data set name.
   *
   * @returns {ApplicationStateData} The saved data set.
   */
  getSave({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`ApplicationState - getSave error: 'name' is not a string.`);
    }
    return this.#dataSaved.get(name);
  }
  /**
   * Removes and returns any application state by name.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - Name to remove and retrieve.
   *
   * @returns {ApplicationStateData} Saved application data.
   */
  remove({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`ApplicationState - remove: 'name' is not a string.`);
    }
    const data = this.#dataSaved.get(name);
    this.#dataSaved.delete(name);
    return data;
  }
  /**
   * Restores a saved application state returning the data. Several optional parameters are available
   * to control whether the restore action occurs silently (no store / inline styles updates), animates
   * to the stored data, or simply sets the stored data. Restoring via {@link AnimationAPI.to} allows
   * specification of the duration, easing, and interpolate functions along with configuring a Promise to be
   * returned if awaiting the end of the animation.
   *
   * @param {object}            params - Parameters
   *
   * @param {string}            params.name - Saved data set name.
   *
   * @param {boolean}           [params.remove=false] - Remove data set.
   *
   * @param {boolean}           [params.async=false] - If animating return a Promise that resolves with any saved data.
   *
   * @param {boolean}           [params.animateTo=false] - Animate to restore data.
   *
   * @param {number}            [params.duration=0.1] - Duration in seconds.
   *
   * @param {Function}          [params.ease=linear] - Easing function.
   *
   * @param {Function}          [params.interpolate=lerp] - Interpolation function.
   *
   * @returns {ApplicationStateData|Promise<ApplicationStateData>} Saved application data.
   */
  restore({
    name,
    remove = false,
    async = false,
    animateTo = false,
    duration = 0.1,
    ease = identity,
    interpolate = lerp
  }) {
    if (typeof name !== "string") {
      throw new TypeError(`ApplicationState - restore error: 'name' is not a string.`);
    }
    const dataSaved = this.#dataSaved.get(name);
    if (dataSaved) {
      if (remove) {
        this.#dataSaved.delete(name);
      }
      if (async) {
        return this.set(dataSaved, { async, animateTo, duration, ease, interpolate }).then(() => dataSaved);
      } else {
        this.set(dataSaved, { async, animateTo, duration, ease, interpolate });
      }
    }
    return dataSaved;
  }
  /**
   * Saves current application state with the opportunity to add extra data to the saved state.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - name to index this saved data.
   *
   * @param {...*}     [options.extra] - Extra data to add to saved data.
   *
   * @returns {ApplicationStateData} Current application data
   */
  save({ name, ...extra }) {
    if (typeof name !== "string") {
      throw new TypeError(`ApplicationState - save error: 'name' is not a string.`);
    }
    const data = this.get(extra);
    this.#dataSaved.set(name, data);
    return data;
  }
  /**
   * Restores a saved application state returning the data. Several optional parameters are available
   * to control whether the restore action occurs silently (no store / inline styles updates), animates
   * to the stored data, or simply sets the stored data. Restoring via {@link AnimationAPI.to} allows
   * specification of the duration, easing, and interpolate functions along with configuring a Promise to be
   * returned if awaiting the end of the animation.
   *
   * Note: If serializing application state any minimized apps will use the before minimized state on initial render
   * of the app as it is currently not possible to render apps with Foundry VTT core API in the minimized state.
   *
   * TODO: THIS METHOD NEEDS TO BE REFACTORED WHEN TRL IS MADE INTO A STANDALONE FRAMEWORK.
   *
   * @param {ApplicationStateData}   data - Saved data set name.
   *
   * @param {object}            [opts] - Optional parameters
   *
   * @param {boolean}           [opts.async=false] - If animating return a Promise that resolves with any saved data.
   *
   * @param {boolean}           [opts.animateTo=false] - Animate to restore data.
   *
   * @param {number}            [opts.duration=0.1] - Duration in seconds.
   *
   * @param {Function}          [opts.ease=linear] - Easing function.
   *
   * @param {Function}          [opts.interpolate=lerp] - Interpolation function.
   *
   * @returns {T | Promise<T>} When synchronous the application or Promise when animating resolving with application.
   */
  set(data, { async = false, animateTo = false, duration = 0.1, ease = identity, interpolate = lerp } = {}) {
    if (!isObject(data)) {
      throw new TypeError(`ApplicationState - restore error: 'data' is not an object.`);
    }
    const application = this.#application;
    if (!isObject(data?.position)) {
      console.warn(`ApplicationState.set warning: 'data.position' is not an object.`);
      return application;
    }
    const rendered = application.rendered;
    if (animateTo && !rendered) {
      console.warn(`ApplicationState.set warning: Application is not rendered and 'animateTo' is true.`);
      return application;
    }
    if (animateTo) {
      if (data.position.transformOrigin !== application.position.transformOrigin) {
        application.position.transformOrigin = data.position.transformOrigin;
      }
      if (isObject(data?.ui)) {
        const minimized = typeof data.ui?.minimized === "boolean" ? data.ui.minimized : false;
        if (application?.reactive?.minimized && !minimized) {
          application.maximize({ animate: false, duration: 0 });
        }
      }
      const promise2 = application.position.animate.to(
        data.position,
        { duration, ease, interpolate }
      ).finished.then((cancelled) => {
        if (cancelled) {
          return application;
        }
        if (isObject(data?.options)) {
          application?.reactive.mergeOptions(data.options);
        }
        if (isObject(data?.ui)) {
          const minimized = typeof data.ui?.minimized === "boolean" ? data.ui.minimized : false;
          if (!application?.reactive?.minimized && minimized) {
            application.minimize({ animate: false, duration: 0 });
          }
        }
        if (isObject(data?.beforeMinimized)) {
          application.position.state.set({ name: "#beforeMinimized", ...data.beforeMinimized });
        }
        return application;
      });
      if (async) {
        return promise2;
      }
    } else {
      if (rendered) {
        if (isObject(data?.options)) {
          application?.reactive.mergeOptions(data.options);
        }
        if (isObject(data?.ui)) {
          const minimized = typeof data.ui?.minimized === "boolean" ? data.ui.minimized : false;
          if (application?.reactive?.minimized && !minimized) {
            application.maximize({ animate: false, duration: 0 });
          } else if (!application?.reactive?.minimized && minimized) {
            application.minimize({ animate: false, duration });
          }
        }
        if (isObject(data?.beforeMinimized)) {
          application.position.state.set({ name: "#beforeMinimized", ...data.beforeMinimized });
        }
        application.position.set(data.position);
      } else {
        let positionData = data.position;
        if (isObject(data.beforeMinimized)) {
          positionData = data.beforeMinimized;
          positionData.left = data.position.left;
          positionData.top = data.position.top;
        }
        application.position.set(positionData);
      }
    }
    return application;
  }
}
class GetSvelteData {
  /** @type {import('./types').MountedAppShell[] | null[]} */
  #applicationShellHolder;
  /** @type {import('./types').SvelteData[]} */
  #svelteData;
  /**
   * Keep a direct reference to the SvelteData array in an associated {@link SvelteApplication}.
   *
   * @param {import('./types').MountedAppShell[] | null[]}  applicationShellHolder - A reference to the
   *        MountedAppShell array.
   *
   * @param {import('./types').SvelteData[]}  svelteData - A reference to the SvelteData array of mounted components.
   */
  constructor(applicationShellHolder, svelteData) {
    this.#applicationShellHolder = applicationShellHolder;
    this.#svelteData = svelteData;
  }
  /**
   * Returns any mounted {@link MountedAppShell}.
   *
   * @returns {import('./types').MountedAppShell | null} Any mounted application shell.
   */
  get applicationShell() {
    return this.#applicationShellHolder[0];
  }
  /**
   * Returns the indexed Svelte component.
   *
   * @param {number}   index -
   *
   * @returns {object} The loaded Svelte component.
   */
  component(index) {
    const data = this.#svelteData[index];
    return data?.component ?? void 0;
  }
  /**
   * Returns the Svelte component entries iterator.
   *
   * @returns {IterableIterator<[number, import('svelte').SvelteComponent]>} Svelte component entries iterator.
   * @yields
   */
  *componentEntries() {
    for (let cntr = 0; cntr < this.#svelteData.length; cntr++) {
      yield [cntr, this.#svelteData[cntr].component];
    }
  }
  /**
   * Returns the Svelte component values iterator.
   *
   * @returns {IterableIterator<import('svelte').SvelteComponent>} Svelte component values iterator.
   * @yields
   */
  *componentValues() {
    for (let cntr = 0; cntr < this.#svelteData.length; cntr++) {
      yield this.#svelteData[cntr].component;
    }
  }
  /**
   * Returns the indexed SvelteData entry.
   *
   * @param {number}   index - The index of SvelteData instance to retrieve.
   *
   * @returns {import('./types').SvelteData} The loaded Svelte config + component.
   */
  data(index) {
    return this.#svelteData[index];
  }
  /**
   * Returns the {@link SvelteData} instance for a given component.
   *
   * @param {import('svelte').SvelteComponent} component - Svelte component.
   *
   * @returns {import('./types').SvelteData} -  The loaded Svelte config + component.
   */
  dataByComponent(component) {
    for (const data of this.#svelteData) {
      if (data.component === component) {
        return data;
      }
    }
    return void 0;
  }
  /**
   * Returns the SvelteData entries iterator.
   *
   * @returns {IterableIterator<[number, import('./types').SvelteData]>} SvelteData entries iterator.
   */
  dataEntries() {
    return this.#svelteData.entries();
  }
  /**
   * Returns the SvelteData values iterator.
   *
   * @returns {IterableIterator<import('./types').SvelteData>} SvelteData values iterator.
   */
  dataValues() {
    return this.#svelteData.values();
  }
  /**
   * Returns the length of the mounted Svelte component list.
   *
   * @returns {number} Length of mounted Svelte component list.
   */
  get length() {
    return this.#svelteData.length;
  }
}
function storeGenerator({ storage, serialize = JSON.stringify, deserialize = JSON.parse }) {
  function isSimpleDeriver(deriver) {
    return deriver.length < 2;
  }
  function storageReadable(key, value, start) {
    return {
      subscribe: storageWritable(key, value, start).subscribe
    };
  }
  function storageWritable(key, value, start) {
    function wrap_start(ogSet) {
      return start(function wrap_set(new_value) {
        if (storage) {
          storage.setItem(key, serialize(new_value));
        }
        return ogSet(new_value);
      }, function wrap_update(fn) {
        set(fn(get_store_value(ogStore)));
      });
    }
    if (storage) {
      const storageValue = storage.getItem(key);
      try {
        if (storageValue) {
          value = deserialize(storageValue);
        }
      } catch (err) {
      }
      storage.setItem(key, serialize(value));
    }
    const ogStore = writable(value, start ? wrap_start : void 0);
    function set(new_value) {
      if (storage) {
        storage.setItem(key, serialize(new_value));
      }
      ogStore.set(new_value);
    }
    function update2(fn) {
      set(fn(get_store_value(ogStore)));
    }
    function subscribe2(run2, invalidate) {
      return ogStore.subscribe(run2, invalidate);
    }
    return { set, update: update2, subscribe: subscribe2 };
  }
  function storageDerived(key, stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single ? [stores] : stores;
    if (storage && storage.getItem(key)) {
      try {
        initial_value = deserialize(storage.getItem(key));
      } catch (err) {
      }
    }
    return storageReadable(key, initial_value, (set, update2) => {
      let inited = false;
      const values = [];
      let pending = 0;
      let cleanup;
      const sync = () => {
        if (pending) {
          return;
        }
        cleanup?.();
        const input = single ? values[0] : values;
        if (isSimpleDeriver(fn)) {
          set(fn(input));
        } else {
          const result = fn(input, set, update2);
          if (typeof result === "function") {
            cleanup = result;
          }
        }
      };
      const unsubscribers = stores_array.map((store, i2) => store.subscribe((value) => {
        values[i2] = value;
        pending &= ~(1 << i2);
        if (inited) {
          sync();
        }
      }, () => {
        pending |= 1 << i2;
      }));
      inited = true;
      sync();
      return function stop() {
        unsubscribers.forEach((unsubscriber) => unsubscriber());
        cleanup?.();
      };
    });
  }
  return {
    readable: storageReadable,
    writable: storageWritable,
    derived: storageDerived,
    storage,
    serialize,
    deserialize
  };
}
const sessionStores = storeGenerator({ storage: globalThis?.sessionStorage });
class TJSWebStorage {
  /** @type {import('./').StorageStores} */
  #storageStores;
  /**
   * @type {(Map<string, {
   *    store: import('svelte/store').Writable,
   *    deserialize?: (value: string, ...rest: any[]) => any,
   *    serialize?: (value: any, ...rest: any[]) => string
   * }>)}
   */
  #stores = /* @__PURE__ */ new Map();
  /**
   * @param {import('./').StorageStores} storageStores - Provides a complete set of
   *        storage API store helper functions and the associated storage API instance and serializations strategy.
   */
  constructor(storageStores) {
    this.#storageStores = storageStores;
  }
  /**
   * @param {string}   key - Storage key.
   *
   * @returns {(value: string, ...rest: any[]) => any} Deserialize function.
   */
  #getDeserialize(key) {
    return this.#stores.get(key)?.deserialize ?? this.#storageStores.deserialize;
  }
  /**
   * @param {string}   key - Storage key.
   *
   * @returns {(value: any, ...rest: any[]) => string} Serialize function.
   */
  #getSerialize(key) {
    return this.#stores.get(key)?.serialize ?? this.#storageStores.serialize;
  }
  /**
   * Creates a new store for the given key.
   *
   * @template T
   *
   * @param {string}   key - Key to lookup in stores map.
   *
   * @param {T}        [defaultValue] - A default value to set for the store.
   *
   * @param {import('./').StorageStores} [storageStores] - Additional store creation options.
   *
   * @returns {import('svelte/store').Writable<T>} The new store.
   */
  #createStore(key, defaultValue = void 0, storageStores) {
    try {
      const value = this.#storageStores.storage.getItem(key);
      if (value !== null) {
        const deserialize = storageStores?.deserialize ?? this.#storageStores.deserialize;
        defaultValue = deserialize(value);
      }
    } catch (err) {
    }
    const writable2 = storageStores?.writable ?? this.#storageStores.writable;
    return writable2(key, defaultValue);
  }
  /**
   * Gets a store from the `stores` Map or creates a new store for the key and a given default value.
   *
   * @template T
   *
   * @param {string}   key - Key to lookup in stores map.
   *
   * @param {T}        [defaultValue] - A default value to set for the store.
   *
   * @param {import('./').StorageStores} [storageStores] - Additional store creation options.
   *
   * @returns {import('svelte/store').Writable<T>} The store for the given key.
   */
  #getStore(key, defaultValue = void 0, storageStores) {
    const storeEntry = this.#stores.get(key);
    if (storeEntry) {
      return storeEntry.store;
    }
    const store = this.#createStore(key, defaultValue, storageStores);
    this.#stores.set(key, {
      store,
      deserialize: storageStores?.deserialize,
      serialize: storageStores?.serialize
    });
    return store;
  }
  /**
   * Get value from the storage API.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
   *
   * @returns {*} Value from session storage or if not defined any default value provided.
   */
  getItem(key, defaultValue) {
    let value = defaultValue;
    const storageValue = this.#storageStores.storage.getItem(key);
    if (storageValue !== null) {
      try {
        value = this.#getDeserialize(key)(storageValue);
      } catch (err) {
        value = defaultValue;
      }
    } else if (defaultValue !== void 0) {
      try {
        const newValue = this.#getSerialize(key)(defaultValue);
        this.#storageStores.storage.setItem(key, newValue);
      } catch (err) {
      }
    }
    return value;
  }
  /**
   * Returns the backing Svelte store for the given key; potentially sets a default value if the key
   * is not already set.
   *
   * @template T
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {T}        [defaultValue] - A default value to return if key not present in session storage.
   *
   * @param {import('./').StorageStores} [storageStores] - Additional store creation options.
   *
   * @returns {import('svelte/store').Writable<T>} The Svelte store for this key.
   */
  getStore(key, defaultValue, storageStores) {
    return this.#getStore(key, defaultValue, storageStores);
  }
  /**
   * Sets the value for the given key in storage API.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {*}        value - A value to set for this key.
   */
  setItem(key, value) {
    const store = this.#getStore(key);
    store.set(value);
  }
  /**
   * Convenience method to swap a boolean value stored in storage API.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
   *
   * @returns {boolean} The boolean swap for the given key.
   */
  swapItemBoolean(key, defaultValue) {
    const store = this.#getStore(key, defaultValue);
    let currentValue = false;
    try {
      currentValue = !!this.#getDeserialize(key)(this.#storageStores.storage.getItem(key));
    } catch (err) {
    }
    const newValue = typeof currentValue === "boolean" ? !currentValue : false;
    store.set(newValue);
    return newValue;
  }
}
class TJSSessionStorage extends TJSWebStorage {
  constructor() {
    super(sessionStores);
  }
}
class SvelteReactive {
  /**
   * @type {import('../SvelteApplication').SvelteApplication}
   */
  #application;
  /**
   * @type {boolean}
   */
  #initialized = false;
  /** @type {import('@typhonjs-fvtt/runtime/svelte/store/web-storage').TJSWebStorage} */
  #sessionStorage;
  /**
   * The Application option store which is injected into mounted Svelte component context under the `external` key.
   *
   * @type {import('./types').StoreAppOptions}
   */
  #storeAppOptions;
  /**
   * Stores the update function for `#storeAppOptions`.
   *
   * @type {(this: void, updater: import('svelte/store').Updater<object>) => void}
   */
  #storeAppOptionsUpdate;
  /**
   * Stores the UI state data to make it accessible via getters.
   *
   * @type {object}
   */
  #dataUIState;
  /**
   * The UI option store which is injected into mounted Svelte component context under the `external` key.
   *
   * @type {import('./types').StoreUIOptions}
   */
  #storeUIState;
  /**
   * Stores the update function for `#storeUIState`.
   *
   * @type {(this: void, updater: import('svelte/store').Updater<object>) => void}
   */
  #storeUIStateUpdate;
  /**
   * Stores the unsubscribe functions from local store subscriptions.
   *
   * @type {import('svelte/store').Unsubscriber[]}
   */
  #storeUnsubscribe = [];
  /**
   * @param {import('../SvelteApplication').SvelteApplication} application - The host Foundry application.
   */
  constructor(application) {
    this.#application = application;
    const optionsSessionStorage = application?.options?.sessionStorage;
    if (optionsSessionStorage !== void 0 && !(optionsSessionStorage instanceof TJSWebStorage)) {
      throw new TypeError(`'options.sessionStorage' is not an instance of TJSWebStorage.`);
    }
    this.#sessionStorage = optionsSessionStorage !== void 0 ? optionsSessionStorage : new TJSSessionStorage();
  }
  /**
   * Initializes reactive support. Package private for internal use.
   *
   * @returns {SvelteReactiveStores | undefined} Internal methods to interact with Svelte stores.
   * @package
   * @internal
   */
  initialize() {
    if (this.#initialized) {
      return;
    }
    this.#initialized = true;
    this.#storesInitialize();
    return {
      appOptionsUpdate: this.#storeAppOptionsUpdate,
      uiStateUpdate: this.#storeUIStateUpdate,
      subscribe: this.#storesSubscribe.bind(this),
      unsubscribe: this.#storesUnsubscribe.bind(this)
    };
  }
  // Store getters -----------------------------------------------------------------------------------------------------
  /**
   * @returns {import('@typhonjs-fvtt/runtime/svelte/store/web-storage').TJSWebStorage} Returns TJSWebStorage (session) instance.
   */
  get sessionStorage() {
    return this.#sessionStorage;
  }
  /**
   * Returns the store for app options.
   *
   * @returns {import('./types').StoreAppOptions} App options store.
   */
  get storeAppOptions() {
    return this.#storeAppOptions;
  }
  /**
   * Returns the store for UI options.
   *
   * @returns {import('./types').StoreUIOptions} UI options store.
   */
  get storeUIState() {
    return this.#storeUIState;
  }
  // Only reactive getters ---------------------------------------------------------------------------------------------
  /**
   * Returns the current dragging UI state.
   *
   * @returns {boolean} Dragging UI state.
   */
  get dragging() {
    return this.#dataUIState.dragging;
  }
  /**
   * Returns the current minimized UI state.
   *
   * @returns {boolean} Minimized UI state.
   */
  get minimized() {
    return this.#dataUIState.minimized;
  }
  /**
   * Returns the current resizing UI state.
   *
   * @returns {boolean} Resizing UI state.
   */
  get resizing() {
    return this.#dataUIState.resizing;
  }
  // Reactive getter / setters -----------------------------------------------------------------------------------------
  /**
   * Returns the draggable app option.
   *
   * @returns {boolean} Draggable app option.
   */
  get draggable() {
    return this.#application?.options?.draggable;
  }
  /**
   * Returns the focusAuto app option.
   *
   * @returns {boolean} When true auto-management of app focus is enabled.
   */
  get focusAuto() {
    return this.#application?.options?.focusAuto;
  }
  /**
   * Returns the focusKeep app option.
   *
   * @returns {boolean} When `focusAuto` and `focusKeep` is true; keeps internal focus.
   */
  get focusKeep() {
    return this.#application?.options?.focusKeep;
  }
  /**
   * Returns the focusTrap app option.
   *
   * @returns {boolean} When true focus trapping / wrapping is enabled keeping focus inside app.
   */
  get focusTrap() {
    return this.#application?.options?.focusTrap;
  }
  /**
   * Returns the headerButtonNoClose app option.
   *
   * @returns {boolean} Remove the close the button in header app option.
   */
  get headerButtonNoClose() {
    return this.#application?.options?.headerButtonNoClose;
  }
  /**
   * Returns the headerButtonNoLabel app option.
   *
   * @returns {boolean} Remove the labels from buttons in header app option.
   */
  get headerButtonNoLabel() {
    return this.#application?.options?.headerButtonNoLabel;
  }
  /**
   * Returns the headerIcon app option.
   *
   * @returns {string|void} URL for header app icon.
   */
  get headerIcon() {
    return this.#application?.options?.headerIcon;
  }
  /**
   * Returns the headerNoTitleMinimized app option.
   *
   * @returns {boolean} When true removes the header title when minimized.
   */
  get headerNoTitleMinimized() {
    return this.#application?.options?.headerNoTitleMinimized;
  }
  /**
   * Returns the minimizable app option.
   *
   * @returns {boolean} Minimizable app option.
   */
  get minimizable() {
    return this.#application?.options?.minimizable;
  }
  /**
   * Returns the Foundry popOut state; {@link Application.popOut}
   *
   * @returns {boolean} Positionable app option.
   */
  get popOut() {
    return this.#application.popOut;
  }
  /**
   * Returns the positionable app option; {@link SvelteApplicationOptions.positionable}
   *
   * @returns {boolean} Positionable app option.
   */
  get positionable() {
    return this.#application?.options?.positionable;
  }
  /**
   * Returns the resizable option.
   *
   * @returns {boolean} Resizable app option.
   */
  get resizable() {
    return this.#application?.options?.resizable;
  }
  /**
   * Returns the title accessor from the parent Application class; {@link Application.title}
   * TODO: Application v2; note that super.title localizes `this.options.title`; IMHO it shouldn't.
   *
   * @returns {string} Title.
   */
  get title() {
    return this.#application.title;
  }
  /**
   * Sets `this.options.draggable` which is reactive for application shells.
   *
   * @param {boolean}  draggable - Sets the draggable option.
   */
  set draggable(draggable2) {
    if (typeof draggable2 === "boolean") {
      this.setOptions("draggable", draggable2);
    }
  }
  /**
   * Sets `this.options.focusAuto` which is reactive for application shells.
   *
   * @param {boolean}  focusAuto - Sets the focusAuto option.
   */
  set focusAuto(focusAuto) {
    if (typeof focusAuto === "boolean") {
      this.setOptions("focusAuto", focusAuto);
    }
  }
  /**
   * Sets `this.options.focusKeep` which is reactive for application shells.
   *
   * @param {boolean}  focusKeep - Sets the focusKeep option.
   */
  set focusKeep(focusKeep) {
    if (typeof focusKeep === "boolean") {
      this.setOptions("focusKeep", focusKeep);
    }
  }
  /**
   * Sets `this.options.focusTrap` which is reactive for application shells.
   *
   * @param {boolean}  focusTrap - Sets the focusTrap option.
   */
  set focusTrap(focusTrap) {
    if (typeof focusTrap === "boolean") {
      this.setOptions("focusTrap", focusTrap);
    }
  }
  /**
   * Sets `this.options.headerButtonNoClose` which is reactive for application shells.
   *
   * @param {boolean}  headerButtonNoClose - Sets the headerButtonNoClose option.
   */
  set headerButtonNoClose(headerButtonNoClose) {
    if (typeof headerButtonNoClose === "boolean") {
      this.setOptions("headerButtonNoClose", headerButtonNoClose);
    }
  }
  /**
   * Sets `this.options.headerButtonNoLabel` which is reactive for application shells.
   *
   * @param {boolean}  headerButtonNoLabel - Sets the headerButtonNoLabel option.
   */
  set headerButtonNoLabel(headerButtonNoLabel) {
    if (typeof headerButtonNoLabel === "boolean") {
      this.setOptions("headerButtonNoLabel", headerButtonNoLabel);
    }
  }
  /**
   * Sets `this.options.headerIcon` which is reactive for application shells.
   *
   * @param {string | undefined}  headerIcon - Sets the headerButtonNoLabel option.
   */
  set headerIcon(headerIcon) {
    if (headerIcon === void 0 || typeof headerIcon === "string") {
      this.setOptions("headerIcon", headerIcon);
    }
  }
  /**
   * Sets `this.options.headerNoTitleMinimized` which is reactive for application shells.
   *
   * @param {boolean}  headerNoTitleMinimized - Sets the headerNoTitleMinimized option.
   */
  set headerNoTitleMinimized(headerNoTitleMinimized) {
    if (typeof headerNoTitleMinimized === "boolean") {
      this.setOptions("headerNoTitleMinimized", headerNoTitleMinimized);
    }
  }
  /**
   * Sets `this.options.minimizable` which is reactive for application shells that are also pop out.
   *
   * @param {boolean}  minimizable - Sets the minimizable option.
   */
  set minimizable(minimizable) {
    if (typeof minimizable === "boolean") {
      this.setOptions("minimizable", minimizable);
    }
  }
  /**
   * Sets `this.options.popOut` which is reactive for application shells. This will add / remove this application
   * from `ui.windows`.
   *
   * @param {boolean}  popOut - Sets the popOut option.
   */
  set popOut(popOut) {
    if (typeof popOut === "boolean") {
      this.setOptions("popOut", popOut);
    }
  }
  /**
   * Sets `this.options.positionable` enabling / disabling {@link SvelteApplication.position}.
   *
   * @param {boolean}  positionable - Sets the positionable option.
   */
  set positionable(positionable) {
    if (typeof positionable === "boolean") {
      this.setOptions("positionable", positionable);
    }
  }
  /**
   * Sets `this.options.resizable` which is reactive for application shells.
   *
   * @param {boolean}  resizable - Sets the resizable option.
   */
  set resizable(resizable) {
    if (typeof resizable === "boolean") {
      this.setOptions("resizable", resizable);
    }
  }
  /**
   * Sets `this.options.title` which is reactive for application shells.
   *
   * Note: Will set empty string if title is undefined or null.
   *
   * @param {string | undefined | null}   title - Application title; will be localized, so a translation key is fine.
   */
  set title(title) {
    if (typeof title === "string") {
      this.setOptions("title", title);
    } else if (title === void 0 || title === null) {
      this.setOptions("title", "");
    }
  }
  // Reactive Options API -------------------------------------------------------------------------------------------
  /**
   * Provides a way to safely get this applications options given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * // TODO DOCUMENT the accessor in more detail.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {*}        [defaultValue] - A default value returned if the accessor is not found.
   *
   * @returns {*} Value at the accessor.
   */
  getOptions(accessor, defaultValue) {
    return safeAccess(this.#application.options, accessor, defaultValue);
  }
  /**
   * Provides a way to merge `options` into this applications options and update the appOptions store.
   *
   * @param {object}   options - The options object to merge with `this.options`.
   */
  mergeOptions(options) {
    this.#storeAppOptionsUpdate((instanceOptions) => deepMerge(instanceOptions, options));
  }
  /**
   * Provides a way to safely set this applications options given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * Additionally if an application shell Svelte component is mounted and exports the `appOptions` property then
   * the application options is set to `appOptions` potentially updating the application shell / Svelte component.
   *
   * // TODO DOCUMENT the accessor in more detail.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {any}      value - Value to set.
   */
  setOptions(accessor, value) {
    const success = safeSet(this.#application.options, accessor, value);
    if (success) {
      this.#storeAppOptionsUpdate(() => this.#application.options);
    }
  }
  /**
   * Initializes the Svelte stores and derived stores for the application options and UI state.
   *
   * While writable stores are created the update method is stored in private variables locally and derived Readable
   * stores are provided for essential options which are commonly used.
   *
   * These stores are injected into all Svelte components mounted under the `external` context: `storeAppOptions` and
   * `storeUIState`.
   */
  #storesInitialize() {
    const writableAppOptions = writable(this.#application.options);
    this.#storeAppOptionsUpdate = writableAppOptions.update;
    const storeAppOptions = {
      subscribe: writableAppOptions.subscribe,
      draggable: propertyStore(writableAppOptions, "draggable"),
      focusAuto: propertyStore(writableAppOptions, "focusAuto"),
      focusKeep: propertyStore(writableAppOptions, "focusKeep"),
      focusTrap: propertyStore(writableAppOptions, "focusTrap"),
      headerButtonNoClose: propertyStore(writableAppOptions, "headerButtonNoClose"),
      headerButtonNoLabel: propertyStore(writableAppOptions, "headerButtonNoLabel"),
      headerIcon: propertyStore(writableAppOptions, "headerIcon"),
      headerNoTitleMinimized: propertyStore(writableAppOptions, "headerNoTitleMinimized"),
      minimizable: propertyStore(writableAppOptions, "minimizable"),
      popOut: propertyStore(writableAppOptions, "popOut"),
      positionable: propertyStore(writableAppOptions, "positionable"),
      resizable: propertyStore(writableAppOptions, "resizable"),
      title: propertyStore(writableAppOptions, "title")
    };
    Object.freeze(storeAppOptions);
    this.#storeAppOptions = storeAppOptions;
    this.#dataUIState = {
      dragging: false,
      headerButtons: [],
      minimized: this.#application._minimized,
      resizing: false
    };
    const writableUIOptions = writable(this.#dataUIState);
    this.#storeUIStateUpdate = writableUIOptions.update;
    const storeUIState = {
      subscribe: writableUIOptions.subscribe,
      dragging: propertyStore(writableUIOptions, "dragging"),
      headerButtons: derived(writableUIOptions, ($options, set) => set($options.headerButtons)),
      minimized: derived(writableUIOptions, ($options, set) => set($options.minimized)),
      resizing: propertyStore(writableUIOptions, "resizing")
    };
    Object.freeze(storeUIState);
    this.#storeUIState = storeUIState;
  }
  /**
   * Registers local store subscriptions for app options. `popOut` controls registering this app with `ui.windows`.
   *
   * @see SvelteApplication._injectHTML
   */
  #storesSubscribe() {
    this.#storeUnsubscribe.push(subscribeIgnoreFirst(this.#storeAppOptions.headerButtonNoClose, (value) => {
      this.updateHeaderButtons({ headerButtonNoClose: value });
    }));
    this.#storeUnsubscribe.push(subscribeIgnoreFirst(this.#storeAppOptions.headerButtonNoLabel, (value) => {
      this.updateHeaderButtons({ headerButtonNoLabel: value });
    }));
    this.#storeUnsubscribe.push(subscribeIgnoreFirst(this.#storeAppOptions.popOut, (value) => {
      if (value && this.#application.rendered) {
        globalThis.ui.windows[this.#application.appId] = this.#application;
      } else {
        delete globalThis.ui.windows[this.#application.appId];
      }
    }));
  }
  /**
   * Unsubscribes from any locally monitored stores.
   *
   * @see SvelteApplication.close
   */
  #storesUnsubscribe() {
    this.#storeUnsubscribe.forEach((unsubscribe) => unsubscribe());
    this.#storeUnsubscribe = [];
  }
  /**
   * Updates the UI Options store with the current header buttons. You may dynamically add / remove header buttons
   * if using an application shell Svelte component. In either overriding `_getHeaderButtons` or responding to the
   * Hooks fired return a new button array and the uiOptions store is updated and the application shell will render
   * the new buttons.
   *
   * Optionally you can set in the SvelteApplication app options {@link SvelteApplicationOptions.headerButtonNoClose}
   * to remove the close button and {@link SvelteApplicationOptions.headerButtonNoLabel} to true and labels will be
   * removed from the header buttons.
   *
   * @param {object} [opts] - Optional parameters (for internal use)
   *
   * @param {boolean} [opts.headerButtonNoClose] - The value for `headerButtonNoClose`.
   *
   * @param {boolean} [opts.headerButtonNoLabel] - The value for `headerButtonNoLabel`.
   */
  updateHeaderButtons({
    headerButtonNoClose = this.#application.options.headerButtonNoClose,
    headerButtonNoLabel = this.#application.options.headerButtonNoLabel
  } = {}) {
    let buttons = this.#application._getHeaderButtons();
    if (typeof headerButtonNoClose === "boolean" && headerButtonNoClose) {
      buttons = buttons.filter((button) => button.class !== "close");
    }
    if (typeof headerButtonNoLabel === "boolean" && headerButtonNoLabel) {
      for (const button of buttons) {
        button.label = void 0;
      }
    }
    this.#storeUIStateUpdate((options) => {
      options.headerButtons = buttons;
      return options;
    });
  }
}
const applicationShellContract = ["elementRoot"];
Object.freeze(applicationShellContract);
function isApplicationShell(component) {
  if (component === null || component === void 0) {
    return false;
  }
  let compHasContract = true;
  let protoHasContract = true;
  for (const accessor of applicationShellContract) {
    const descriptor = Object.getOwnPropertyDescriptor(component, accessor);
    if (descriptor === void 0 || descriptor.get === void 0 || descriptor.set === void 0) {
      compHasContract = false;
    }
  }
  const prototype = Object.getPrototypeOf(component);
  for (const accessor of applicationShellContract) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, accessor);
    if (descriptor === void 0 || descriptor.get === void 0 || descriptor.set === void 0) {
      protoHasContract = false;
    }
  }
  return compHasContract || protoHasContract;
}
function loadSvelteConfig({ app, template, config, elementRootUpdate } = {}) {
  const svelteOptions = isObject(config.options) ? config.options : {};
  let target;
  if (config.target instanceof HTMLElement) {
    target = config.target;
  } else if (template instanceof HTMLElement && typeof config.target === "string") {
    target = template.querySelector(config.target);
  } else {
    target = document.createDocumentFragment();
  }
  if (target === void 0) {
    console.log(
      `%c[TRL] loadSvelteConfig error - could not find target selector, '${config.target}', for config:
`,
      "background: rgb(57,34,34)",
      config
    );
    throw new Error();
  }
  const NewSvelteComponent = config.class;
  const svelteConfig = parseTJSSvelteConfig({ ...config, target }, app);
  const externalContext = svelteConfig.context.get("#external");
  externalContext.application = app;
  externalContext.elementRootUpdate = elementRootUpdate;
  externalContext.sessionStorage = app.reactive.sessionStorage;
  let eventbus;
  if (isObject(app._eventbus) && typeof app._eventbus.createProxy === "function") {
    eventbus = app._eventbus.createProxy();
    externalContext.eventbus = eventbus;
  }
  Object.seal(externalContext);
  svelteConfig.context.set("external", new Proxy({}, {
    get(targetUnused, prop) {
      console.warn(`[TRL] Deprecation warning: Please change getContext('external') to getContext('#external').`);
      return externalContext[prop];
    }
  }));
  const component = new NewSvelteComponent(svelteConfig);
  svelteConfig.eventbus = eventbus;
  let element2;
  if (isApplicationShell(component)) {
    element2 = component.elementRoot;
  }
  if (target instanceof DocumentFragment && target.firstElementChild) {
    if (element2 === void 0) {
      element2 = target.firstElementChild;
    }
    template.append(target);
  } else if (config.target instanceof HTMLElement && element2 === void 0) {
    if (config.target instanceof HTMLElement && typeof svelteOptions.selectorElement !== "string") {
      console.log(
        `%c[TRL] loadSvelteConfig error - HTMLElement target with no 'selectorElement' defined.

Note: If configuring an application shell and directly targeting a HTMLElement did you bind an'elementRoot' and include '<svelte:options accessors={true}/>'?

Offending config:
`,
        "background: rgb(57,34,34)",
        config
      );
      throw new Error();
    }
    element2 = target.querySelector(svelteOptions.selectorElement);
    if (element2 === null || element2 === void 0) {
      console.log(
        `%c[TRL] loadSvelteConfig error - HTMLElement target with 'selectorElement', '${svelteOptions.selectorElement}', not found for config:
`,
        "background: rgb(57,34,34)",
        config
      );
      throw new Error();
    }
  }
  const injectHTML = !(config.target instanceof HTMLElement);
  return { config: svelteConfig, component, element: element2, injectHTML };
}
class TJSAppIndex {
  /**
   * Stores all visible / rendered apps.
   *
   * @type {Map<string, import('@typhonjs-fvtt/runtime/svelte/application').SvelteApplication>}
   */
  static #visibleApps = /* @__PURE__ */ new Map();
  /**
   * Adds a SvelteApplication to all visible apps tracked.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/application').SvelteApplication} app - A SvelteApplication
   *
   * @package
   */
  static add(app) {
    this.#visibleApps.set(app.id, app);
  }
  /**
   * Removes a SvelteApplication from all visible apps tracked.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/application').SvelteApplication} app - A SvelteApplication
   *
   * @package
   */
  static delete(app) {
    this.#visibleApps.delete(app.id);
  }
  /**
   * Gets a particular app by ID.
   *
   * @param {string}   key - App ID.
   *
   * @returns {import('@typhonjs-fvtt/runtime/svelte/application').SvelteApplication} Associated app.
   */
  static get(key) {
    return this.#visibleApps.get(key);
  }
  /**
   * Returns whether an associated app by ID is being tracked.
   *
   * @param {string}   key - App ID.
   *
   * @returns {boolean} The given App ID is visible.
   */
  static has(key) {
    return this.#visibleApps.has(key);
  }
  /**
   * @returns {IterableIterator<string>} All visible app IDs.
   */
  static keys() {
    return this.#visibleApps.keys();
  }
  /**
   * @returns {IterableIterator<import('@typhonjs-fvtt/runtime/svelte/application').SvelteApplication>} All visible apps.
   */
  static values() {
    return this.#visibleApps.values();
  }
}
class SvelteApplication extends Application {
  /**
   * Stores the first mounted component which follows the application shell contract.
   *
   * @type {import('./internal/state-svelte/types').MountedAppShell[]|null[]} Application shell.
   */
  #applicationShellHolder = [null];
  /**
   * Stores and manages application state for saving / restoring / serializing.
   *
   * @type {ApplicationState<SvelteApplication>}
   */
  #applicationState;
  /**
   * Stores the target element which may not necessarily be the main element.
   *
   * @type {HTMLElement}
   */
  #elementTarget = null;
  /**
   * Stores the content element which is set for application shells.
   *
   * @type {HTMLElement}
   */
  #elementContent = null;
  /**
   * Stores initial z-index from `_renderOuter` to set to target element / Svelte component.
   *
   * @type {number}
   */
  #initialZIndex = 95;
  /**
   * Stores on mount state which is checked in _render to trigger onSvelteMount callback.
   *
   * @type {boolean}
   */
  #onMount = false;
  /**
   * The position store.
   *
   * @type {TJSPosition}
   */
  #position;
  /**
   * Contains the Svelte stores and reactive accessors.
   *
   * @type {SvelteReactive}
   */
  #reactive;
  /**
   * Stores SvelteData entries with instantiated Svelte components.
   *
   * @type {import('./internal/state-svelte/types').SvelteData[]}
   */
  #svelteData = [];
  /**
   * Provides a helper class that combines multiple methods for interacting with the mounted components tracked in
   * #svelteData.
   *
   * @type {GetSvelteData}
   */
  #getSvelteData = new GetSvelteData(this.#applicationShellHolder, this.#svelteData);
  /**
   * Contains methods to interact with the Svelte stores.
   *
   * @type {import('./internal/state-reactive/SvelteReactive').SvelteReactiveStores}
   */
  #stores;
  /**
   * @param {import('@typhonjs-fvtt/runtime/svelte/application').SvelteApplicationOptions} options - The options for the application.
   *
   * @inheritDoc
   */
  constructor(options = {}) {
    super(options);
    this.#applicationState = new ApplicationState(this);
    this.#position = new TJSPosition(this, {
      ...this.position,
      ...this.options,
      initial: this.options.positionInitial,
      ortho: this.options.positionOrtho,
      validator: this.options.positionValidator
    });
    delete this.position;
    Object.defineProperty(this, "position", {
      get: () => this.#position,
      set: (position) => {
        if (isObject(position)) {
          this.#position.set(position);
        }
      }
    });
    this.#reactive = new SvelteReactive(this);
    this.#stores = this.#reactive.initialize();
  }
  /**
   * Specifies the default options that SvelteApplication supports.
   *
   * @returns {import('@typhonjs-fvtt/runtime/svelte/application').SvelteApplicationOptions} options - Application options.
   * @see https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html
   *
   * @internal
   */
  static get defaultOptions() {
    return deepMerge(super.defaultOptions, {
      defaultCloseAnimation: true,
      // If false the default slide close animation is not run.
      draggable: true,
      // If true then application shells are draggable.
      focusAuto: true,
      // When true auto-management of app focus is enabled.
      focusKeep: false,
      // When `focusAuto` and `focusKeep` is true; keeps internal focus.
      focusSource: void 0,
      // Stores any A11yFocusSource data that is applied when app is closed.
      focusTrap: true,
      // When true focus trapping / wrapping is enabled keeping focus inside app.
      headerButtonNoClose: false,
      // If true then the close header button is removed.
      headerButtonNoLabel: false,
      // If true then header button labels are removed for application shells.
      headerIcon: void 0,
      // Sets a header icon given an image URL.
      headerNoTitleMinimized: false,
      // If true then header title is hidden when application is minimized.
      minHeight: MIN_WINDOW_HEIGHT,
      // Assigned to position. Number specifying minimum window height.
      minWidth: MIN_WINDOW_WIDTH,
      // Assigned to position. Number specifying minimum window width.
      positionable: true,
      // If false then `position.set` does not take effect.
      positionInitial: TJSPosition.Initial.browserCentered,
      // A helper for initial position placement.
      positionOrtho: true,
      // When true TJSPosition is optimized for orthographic use.
      positionValidator: TJSPosition.Validators.transformWindow,
      // A function providing the default validator.
      sessionStorage: void 0,
      // An instance of TJSWebStorage (session) to share across SvelteApplications.
      svelte: void 0,
      // A Svelte configuration object.
      transformOrigin: "top left"
      // By default, 'top / left' respects rotation when minimizing.
    });
  }
  /**
   * Returns the content element if an application shell is mounted.
   *
   * @returns {HTMLElement} Content element.
   */
  get elementContent() {
    return this.#elementContent;
  }
  /**
   * Returns the target element or main element if no target defined.
   *
   * @returns {HTMLElement} Target element.
   */
  get elementTarget() {
    return this.#elementTarget;
  }
  /**
   * Returns the reactive accessors & Svelte stores for SvelteApplication.
   *
   * @returns {import('./internal/state-reactive/types').SvelteReactive} The reactive accessors & Svelte stores.
   */
  get reactive() {
    return this.#reactive;
  }
  /**
   * Returns the application state manager.
   *
   * @returns {import('./internal/state-app/types').ApplicationState<SvelteApplication>} The application state manager.
   */
  get state() {
    return this.#applicationState;
  }
  /**
   * Returns the Svelte helper class w/ various methods to access mounted Svelte components.
   *
   * @returns {import('./internal/state-svelte/types').GetSvelteData} GetSvelteData
   */
  get svelte() {
    return this.#getSvelteData;
  }
  /**
   * In this case of when a template is defined in app options `html` references the inner HTML / template. However,
   * to activate classic v1 tabs for a Svelte component the element target is passed as an array simulating JQuery as
   * the element is retrieved immediately and the core listeners use standard DOM queries.
   *
   * @protected
   * @ignore
   * @internal
   */
  _activateCoreListeners(html) {
    super._activateCoreListeners(typeof this.options.template === "string" ? html : [this.popOut ? this.#elementTarget?.firstChild : this.#elementTarget]);
  }
  /**
   * Provide an override to set this application as the active window regardless of z-index. Changes behaviour from
   * Foundry core. This is important / used for instance in dialog key handling for left / right button selection.
   *
   * @param {object} [opts] - Optional parameters.
   *
   * @param {boolean} [opts.force=false] - Force bring to top; will increment z-index by popOut order.
   *
   * @ignore
   * @internal
   */
  bringToTop({ force = false } = {}) {
    if (force || this.popOut) {
      super.bringToTop();
    }
    if (document.activeElement !== document.body && !this.elementTarget.contains(document.activeElement)) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      document.body.focus();
    }
    globalThis.ui.activeWindow = this;
  }
  /**
   * Note: This method is fully overridden and duplicated as Svelte components need to be destroyed manually and the
   * best visual result is to destroy them after the default slide up animation occurs, but before the element
   * is removed from the DOM.
   *
   * If you destroy the Svelte components before the slide up animation the Svelte elements are removed immediately
   * from the DOM. The purpose of overriding ensures the slide up animation is always completed before
   * the Svelte components are destroyed and then the element is removed from the DOM.
   *
   * Close the application and un-register references to it within UI mappings.
   * This function returns a Promise which resolves once the window closing animation concludes
   *
   * @param {object}   [options] - Optional parameters.
   *
   * @param {boolean}  [options.force] - Force close regardless of render state.
   *
   * @returns {Promise<void>}    A Promise which resolves once the application is closed.
   *
   * @ignore
   * @internal
   */
  async close(options = {}) {
    const states = Application.RENDER_STATES;
    if (!options.force && ![states.RENDERED, states.ERROR].includes(this._state)) {
      return;
    }
    this.#stores.unsubscribe();
    this._state = states.CLOSING;
    const el = this.#elementTarget;
    if (!el) {
      return this._state = states.CLOSED;
    }
    const content = el.querySelector(".window-content");
    if (content) {
      content.style.overflow = "hidden";
      for (let cntr = content.children.length; --cntr >= 0; ) {
        content.children[cntr].style.overflow = "hidden";
      }
    }
    for (const cls of this.constructor._getInheritanceChain()) {
      Hooks.call(`close${cls.name}`, this, $(el));
    }
    const animate = typeof this.options.defaultCloseAnimation === "boolean" ? this.options.defaultCloseAnimation : true;
    if (animate) {
      el.style.minHeight = "0";
      const { paddingBottom, paddingTop } = globalThis.getComputedStyle(el);
      await el.animate([
        { maxHeight: `${el.clientHeight}px`, paddingTop, paddingBottom },
        { maxHeight: 0, paddingTop: 0, paddingBottom: 0 }
      ], { duration: 250, easing: "ease-in", fill: "forwards" }).finished;
    }
    const svelteDestroyPromises = [];
    for (const entry of this.#svelteData) {
      svelteDestroyPromises.push(outroAndDestroy(entry.component));
      const eventbus = entry.config.eventbus;
      if (isObject(eventbus) && typeof eventbus.off === "function") {
        eventbus.off();
        entry.config.eventbus = void 0;
      }
    }
    await Promise.all(svelteDestroyPromises);
    TJSAppIndex.delete(this);
    this.#svelteData.length = 0;
    el.remove();
    this.position.state.restore({
      name: "#beforeMinimized",
      properties: ["width", "height"],
      silent: true,
      remove: true
    });
    this.#applicationShellHolder[0] = null;
    this._element = null;
    this.#elementContent = null;
    this.#elementTarget = null;
    delete globalThis.ui.windows[this.appId];
    this._minimized = false;
    this._scrollPositions = null;
    this._state = states.CLOSED;
    this.#onMount = false;
    this.#stores.uiStateUpdate((storeOptions) => deepMerge(storeOptions, { minimized: this._minimized }));
    A11yHelper.applyFocusSource(this.options.focusSource);
    delete this.options.focusSource;
  }
  /**
   * Inject the Svelte components defined in `this.options.svelte`. The Svelte component can attach to the existing
   * pop-out of Application or provide no template and render into a document fragment which is then attached to the
   * DOM.
   *
   * @protected
   * @ignore
   * @internal
   */
  _injectHTML(html) {
    if (this.popOut && html.length === 0 && isIterable(this.options.svelte)) {
      throw new Error(
        "SvelteApplication - _injectHTML - A popout app with no template can only support one Svelte component."
      );
    }
    this.reactive.updateHeaderButtons();
    const elementRootUpdate = () => {
      let cntr = 0;
      return (elementRoot) => {
        if (elementRoot !== null && elementRoot !== void 0 && cntr++ > 0) {
          this.#updateApplicationShell();
          return true;
        }
        return false;
      };
    };
    if (isIterable(this.options.svelte)) {
      for (const svelteConfig of this.options.svelte) {
        const svelteData = loadSvelteConfig({
          app: this,
          template: html[0],
          config: svelteConfig,
          elementRootUpdate
        });
        if (isApplicationShell(svelteData.component)) {
          if (this.svelte.applicationShell !== null) {
            throw new Error(
              `SvelteApplication - _injectHTML - An application shell is already mounted; offending config:
                    ${JSON.stringify(svelteConfig)}`
            );
          }
          this.#applicationShellHolder[0] = svelteData.component;
          if (isHMRProxy(svelteData.component) && Array.isArray(svelteData.component?.$$?.on_hmr)) {
            svelteData.component.$$.on_hmr.push(() => () => this.#updateApplicationShell());
          }
        }
        this.#svelteData.push(svelteData);
      }
    } else if (isObject(this.options.svelte)) {
      const svelteData = loadSvelteConfig({
        app: this,
        template: html[0],
        config: this.options.svelte,
        elementRootUpdate
      });
      if (isApplicationShell(svelteData.component)) {
        if (this.svelte.applicationShell !== null) {
          throw new Error(
            `SvelteApplication - _injectHTML - An application shell is already mounted; offending config:
                 ${JSON.stringify(this.options.svelte)}`
          );
        }
        this.#applicationShellHolder[0] = svelteData.component;
        if (isHMRProxy(svelteData.component) && Array.isArray(svelteData.component?.$$?.on_hmr)) {
          svelteData.component.$$.on_hmr.push(() => () => this.#updateApplicationShell());
        }
      }
      this.#svelteData.push(svelteData);
    }
    const isDocumentFragment = html.length && html[0] instanceof DocumentFragment;
    let injectHTML = true;
    for (const svelteData of this.#svelteData) {
      if (!svelteData.injectHTML) {
        injectHTML = false;
        break;
      }
    }
    if (injectHTML) {
      super._injectHTML(html);
    }
    if (this.svelte.applicationShell !== null) {
      this._element = $(this.svelte.applicationShell.elementRoot);
      this.#elementContent = hasGetter(this.svelte.applicationShell, "elementContent") ? this.svelte.applicationShell.elementContent : null;
      this.#elementTarget = hasGetter(this.svelte.applicationShell, "elementTarget") ? this.svelte.applicationShell.elementTarget : null;
    } else if (isDocumentFragment) {
      for (const svelteData of this.#svelteData) {
        if (svelteData.element instanceof HTMLElement) {
          this._element = $(svelteData.element);
          break;
        }
      }
    }
    if (this.#elementTarget === null) {
      this.#elementTarget = typeof this.options.selectorTarget === "string" ? this._element[0].querySelector(this.options.selectorTarget) : this._element[0];
    }
    if (this.#elementTarget === null || this.#elementTarget === void 0) {
      throw new Error(`SvelteApplication - _injectHTML: Target element '${this.options.selectorTarget}' not found.`);
    }
    if (typeof this.options.positionable === "boolean" && this.options.positionable) {
      this.#elementTarget.style.zIndex = typeof this.options.zIndex === "number" ? this.options.zIndex : this.#initialZIndex ?? 95;
    }
    this.#stores.subscribe();
  }
  /**
   * Provides a mechanism to update the UI options store for maximized.
   *
   * Note: the sanity check is duplicated from {@link Application.maximize} the store is updated _before_
   * performing the rest of animations. This allows application shells to remove / show any resize handlers
   * correctly. Extra constraint data is stored in a saved position state in {@link SvelteApplication.minimize}
   * to animate the content area.
   *
   * @param {object}   [opts] - Optional parameters.
   *
   * @param {boolean}  [opts.animate=true] - When true perform default maximizing animation.
   *
   * @param {number}   [opts.duration=0.1] - Controls content area animation duration in seconds.
   */
  async maximize({ animate = true, duration = 0.1 } = {}) {
    if (!this.popOut || [false, null].includes(this._minimized)) {
      return;
    }
    this._minimized = null;
    const durationMS = duration * 1e3;
    const element2 = this.elementTarget;
    const header = element2.querySelector(".window-header");
    const content = element2.querySelector(".window-content");
    const positionBefore = this.position.state.get({ name: "#beforeMinimized" });
    if (animate) {
      await this.position.state.restore({
        name: "#beforeMinimized",
        async: true,
        animateTo: true,
        properties: ["width"],
        duration: 0.1
      });
    }
    element2.classList.remove("minimized");
    for (let cntr = header.children.length; --cntr >= 0; ) {
      header.children[cntr].style.display = null;
    }
    content.style.display = null;
    let constraints;
    if (animate) {
      ({ constraints } = this.position.state.restore({
        name: "#beforeMinimized",
        animateTo: true,
        properties: ["height"],
        remove: true,
        duration
      }));
    } else {
      ({ constraints } = this.position.state.remove({ name: "#beforeMinimized" }));
    }
    await content.animate([
      { maxHeight: 0, paddingTop: 0, paddingBottom: 0, offset: 0 },
      { ...constraints, offset: 1 },
      { maxHeight: "100%", offset: 1 }
    ], { duration: durationMS, fill: "forwards" }).finished;
    this.position.set({
      minHeight: positionBefore.minHeight ?? this.options?.minHeight ?? MIN_WINDOW_HEIGHT,
      minWidth: positionBefore.minWidth ?? this.options?.minWidth ?? MIN_WINDOW_WIDTH
    });
    element2.style.minWidth = null;
    element2.style.minHeight = null;
    this._minimized = false;
    setTimeout(() => {
      content.style.overflow = null;
      for (let cntr = content.children.length; --cntr >= 0; ) {
        content.children[cntr].style.overflow = null;
      }
    }, 50);
    this.#stores.uiStateUpdate((options) => deepMerge(options, { minimized: false }));
  }
  /**
   * Provides a mechanism to update the UI options store for minimized.
   *
   * Note: the sanity check is duplicated from {@link Application.minimize} the store is updated _before_
   * performing the rest of animations. This allows application shells to remove / show any resize handlers
   * correctly. Extra constraint data is stored in a saved position state in {@link SvelteApplication.minimize}
   * to animate the content area.
   *
   * @param {object}   [opts] - Optional parameters
   *
   * @param {boolean}  [opts.animate=true] - When true perform default minimizing animation.
   *
   * @param {number}   [opts.duration=0.1] - Controls content area animation duration in seconds.
   */
  async minimize({ animate = true, duration = 0.1 } = {}) {
    if (!this.rendered || !this.popOut || [true, null].includes(this._minimized)) {
      return;
    }
    this.#stores.uiStateUpdate((options) => deepMerge(options, { minimized: true }));
    this._minimized = null;
    const durationMS = duration * 1e3;
    const element2 = this.elementTarget;
    const header = element2.querySelector(".window-header");
    const content = element2.querySelector(".window-content");
    const beforeMinWidth = this.position.minWidth;
    const beforeMinHeight = this.position.minHeight;
    this.position.set({ minWidth: 100, minHeight: 30 });
    element2.style.minWidth = "100px";
    element2.style.minHeight = "30px";
    if (content) {
      content.style.overflow = "hidden";
      for (let cntr = content.children.length; --cntr >= 0; ) {
        content.children[cntr].style.overflow = "hidden";
      }
    }
    const { paddingBottom, paddingTop } = globalThis.getComputedStyle(content);
    const constraints = {
      maxHeight: `${content.clientHeight}px`,
      paddingTop,
      paddingBottom
    };
    if (animate) {
      const animation = content.animate([
        constraints,
        { maxHeight: 0, paddingTop: 0, paddingBottom: 0 }
      ], { duration: durationMS, fill: "forwards" });
      animation.finished.then(() => content.style.display = "none");
    } else {
      setTimeout(() => content.style.display = "none", durationMS);
    }
    const saved = this.position.state.save({ name: "#beforeMinimized", constraints });
    saved.minWidth = beforeMinWidth;
    saved.minHeight = beforeMinHeight;
    const headerOffsetHeight = header.offsetHeight;
    this.position.minHeight = headerOffsetHeight;
    if (animate) {
      await this.position.animate.to({ height: headerOffsetHeight }, { duration }).finished;
    }
    for (let cntr = header.children.length; --cntr >= 0; ) {
      const className = header.children[cntr].className;
      if (className.includes("window-title") || className.includes("close")) {
        continue;
      }
      if (className.includes("keep-minimized")) {
        header.children[cntr].style.display = "block";
        continue;
      }
      header.children[cntr].style.display = "none";
    }
    if (animate) {
      await this.position.animate.to({ width: MIN_WINDOW_WIDTH }, { duration: 0.1 }).finished;
    }
    element2.classList.add("minimized");
    this._minimized = true;
  }
  /**
   * Provides a callback after all Svelte components are initialized.
   *
   * @param {import('./internal/state-svelte/types').MountedAppShell} [mountedAppShell] - The mounted app shell
   *        elements.
   */
  onSvelteMount(mountedAppShell) {
  }
  // eslint-disable-line no-unused-vars
  /**
   * Provides a callback after the main application shell is remounted. This may occur during HMR / hot module
   * replacement or directly invoked from the `elementRootUpdate` callback passed to the application shell component
   * context.
   *
   * @param {import('./internal/state-svelte/types').MountedAppShell} [mountedAppShell] - The mounted app shell
   *        elements.
   */
  onSvelteRemount(mountedAppShell) {
  }
  // eslint-disable-line no-unused-vars
  /**
   * Override replacing HTML as Svelte components control the rendering process. Only potentially change the outer
   * application frame / title for pop-out applications.
   *
   * @protected
   * @ignore
   * @internal
   */
  _replaceHTML(element2, html) {
    if (!element2.length) {
      return;
    }
    this.reactive.updateHeaderButtons();
  }
  /**
   * Provides an override verifying that a new Application being rendered for the first time doesn't have a
   * corresponding DOM element already loaded. This is a check that only occurs when `this._state` is
   * `Application.RENDER_STATES.NONE`. It is useful in particular when SvelteApplication has a static ID
   * explicitly set in `this.options.id` and long intro / outro transitions are assigned. If a new application
   * sharing this static ID attempts to open / render for the first time while an existing DOM element sharing
   * this static ID exists then the initial render is cancelled below rather than crashing later in the render
   * cycle {@link TJSPosition.set}.
   *
   * @protected
   * @ignore
   * @internal
   */
  async _render(force = false, options = {}) {
    if (isObject(options?.focusSource)) {
      this.options.focusSource = options.focusSource;
    }
    if (this._state === Application.RENDER_STATES.NONE && document.querySelector(`#${this.id}`) instanceof HTMLElement) {
      console.warn(`SvelteApplication - _render: A DOM element already exists for CSS ID '${this.id}'. Cancelling initial render for new application with appId '${this.appId}'.`);
      return;
    }
    await super._render(force, options);
    if ([Application.RENDER_STATES.CLOSING, Application.RENDER_STATES.RENDERING].includes(this._state)) {
      return;
    }
    if (!force && this._state <= Application.RENDER_STATES.NONE) {
      return;
    }
    if (!this._minimized) {
      this.#position.set(options);
    }
    if (!this.#onMount) {
      TJSAppIndex.add(this);
      this.onSvelteMount({ element: this._element[0], elementContent: this.#elementContent, elementTarget: this.#elementTarget });
      this.#onMount = true;
    }
  }
  /**
   * Render the inner application content. Only render a template if one is defined otherwise provide an empty
   * JQuery element per the core Foundry API.
   *
   * @protected
   * @ignore
   * @internal
   */
  async _renderInner(data) {
    const html = typeof this.template === "string" ? await renderTemplate(this.template, data) : document.createDocumentFragment();
    return $(html);
  }
  /**
   * Stores the initial z-index set in `_renderOuter` which is used in `_injectHTML` to set the target element
   * z-index after the Svelte component is mounted.
   *
   * @protected
   * @ignore
   * @internal
   */
  async _renderOuter() {
    const html = await super._renderOuter();
    this.#initialZIndex = html[0].style.zIndex;
    return html;
  }
  /**
   * All calculation and updates of position are implemented in {@link TJSPosition.set}. This allows position to be fully
   * reactive and in control of updating inline styles for the application.
   *
   * This method remains for backward compatibility with Foundry. If you have a custom override quite likely you need
   * to update to using the {@link TJSPosition.validators} functionality.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/store/position').TJSPositionDataExtended}   [position] - TJSPosition data.
   *
   * @returns {TJSPosition} The updated position object for the application containing the new values.
   * @ignore
   */
  setPosition(position) {
    return this.position.set(position);
  }
  /**
   * This method is invoked by the `elementRootUpdate` callback that is added to the external context passed to
   * Svelte components. When invoked it updates the local element roots tracked by SvelteApplication.
   *
   * This method may also be invoked by HMR / hot module replacement via `svelte-hmr`.
   */
  #updateApplicationShell() {
    const applicationShell = this.svelte.applicationShell;
    if (applicationShell !== null) {
      this._element = $(applicationShell.elementRoot);
      this.#elementContent = hasGetter(applicationShell, "elementContent") ? applicationShell.elementContent : null;
      this.#elementTarget = hasGetter(applicationShell, "elementTarget") ? applicationShell.elementTarget : null;
      if (this.#elementTarget === null) {
        this.#elementTarget = typeof this.options.selectorTarget === "string" ? this._element[0].querySelector(this.options.selectorTarget) : this._element[0];
      }
      if (typeof this.options.positionable === "boolean" && this.options.positionable) {
        this.#elementTarget.style.zIndex = typeof this.options.zIndex === "number" ? this.options.zIndex : this.#initialZIndex ?? 95;
        super.bringToTop();
        this.position.set(this.position.get());
      }
      super._activateCoreListeners([this.popOut ? this.#elementTarget?.firstChild : this.#elementTarget]);
      this.onSvelteRemount({ element: this._element[0], elementContent: this.#elementContent, elementTarget: this.#elementTarget });
    }
  }
}
Hooks.on("PopOut:loading", (app) => {
  if (app instanceof SvelteApplication) {
    app.position.enabled = false;
  }
});
Hooks.on("PopOut:popin", (app) => {
  if (app instanceof SvelteApplication) {
    app.position.enabled = true;
  }
});
Hooks.on("PopOut:close", (app) => {
  if (app instanceof SvelteApplication) {
    app.position.enabled = true;
  }
});
const version = "1.0.0";
class WelcomeApplication extends SvelteApplication {
  /**
   * Default Application options
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "foundryvtt-journal-pdf-welcome",
      classes: ["gjp-actor-studio"],
      resizable: true,
      minimizable: true,
      width: 220,
      height: 400,
      title: game.i18n.localize("GJP.Title") + " v" + version,
      svelte: {
        class: WelcomeAppShell,
        target: document.body,
        intro: true,
        props: {
          version
          // A prop passed to HelloFoundryAppShell for the initial message displayed.
        }
      }
    });
  }
}
function registerSettings(app) {
  console.info(`${LOG_PREFIX} | Building module settings`);
  dontShowWelcome();
}
function dontShowWelcome() {
  game.settings.register(MODULE_ID, "dontShowWelcome", {
    name: game.i18n.localize("foundryvtt-journal-to-pdf.Setting.DontShowWelcome.Name"),
    hint: game.i18n.localize("foundryvtt-journal-to-pdf.Setting.DontShowWelcome.Hint"),
    scope: "user",
    config: true,
    default: false,
    type: Boolean
  });
}
function _typeof(o2) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o3) {
    return typeof o3;
  } : function(o3) {
    return o3 && "function" == typeof Symbol && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
  }, _typeof(o2);
}
var Worker;
try {
  Worker = require("worker_threads").Worker;
} catch (e) {
}
var u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b2 = new u16(31);
  for (var i2 = 0; i2 < 31; ++i2) {
    b2[i2] = start += 1 << eb[i2 - 1];
  }
  var r = new u32(b2[30]);
  for (var i2 = 1; i2 < 30; ++i2) {
    for (var j2 = b2[i2]; j2 < b2[i2 + 1]; ++j2) {
      r[j2] = j2 - b2[i2] << 5 | i2;
    }
  }
  return [b2, r];
};
var _a = freb(fleb, 2), fl = _a[0], revfl = _a[1];
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b[0], revfd = _b[1];
var rev = new u16(32768);
for (var i$1 = 0; i$1 < 32768; ++i$1) {
  var x$1 = (i$1 & 43690) >>> 1 | (i$1 & 21845) << 1;
  x$1 = (x$1 & 52428) >>> 2 | (x$1 & 13107) << 2;
  x$1 = (x$1 & 61680) >>> 4 | (x$1 & 3855) << 4;
  rev[i$1] = ((x$1 & 65280) >>> 8 | (x$1 & 255) << 8) >>> 1;
}
var hMap = function(cd, mb, r) {
  var s2 = cd.length;
  var i2 = 0;
  var l2 = new u16(mb);
  for (; i2 < s2; ++i2)
    ++l2[cd[i2] - 1];
  var le2 = new u16(mb);
  for (i2 = 0; i2 < mb; ++i2) {
    le2[i2] = le2[i2 - 1] + l2[i2 - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i2 = 0; i2 < s2; ++i2) {
      if (cd[i2]) {
        var sv = i2 << 4 | cd[i2];
        var r_1 = mb - cd[i2];
        var v2 = le2[cd[i2] - 1]++ << r_1;
        for (var m2 = v2 | (1 << r_1) - 1; v2 <= m2; ++v2) {
          co[rev[v2] >>> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s2);
    for (i2 = 0; i2 < s2; ++i2)
      co[i2] = rev[le2[cd[i2] - 1]++] >>> 15 - cd[i2];
  }
  return co;
};
var flt = new u8(288);
for (var i$1 = 0; i$1 < 144; ++i$1)
  flt[i$1] = 8;
for (var i$1 = 144; i$1 < 256; ++i$1)
  flt[i$1] = 9;
for (var i$1 = 256; i$1 < 280; ++i$1)
  flt[i$1] = 7;
for (var i$1 = 280; i$1 < 288; ++i$1)
  flt[i$1] = 8;
var fdt = new u8(32);
for (var i$1 = 0; i$1 < 32; ++i$1)
  fdt[i$1] = 5;
var flm = /* @__PURE__ */ hMap(flt, 9, 0), flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdm = /* @__PURE__ */ hMap(fdt, 5, 0), fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a2) {
  var m2 = a2[0];
  for (var i2 = 1; i2 < a2.length; ++i2) {
    if (a2[i2] > m2)
      m2 = a2[i2];
  }
  return m2;
};
var bits = function(d2, p2, m2) {
  var o2 = p2 / 8 >> 0;
  return (d2[o2] | d2[o2 + 1] << 8) >>> (p2 & 7) & m2;
};
var bits16 = function(d2, p2) {
  var o2 = p2 / 8 >> 0;
  return (d2[o2] | d2[o2 + 1] << 8 | d2[o2 + 2] << 16) >>> (p2 & 7);
};
var shft = function(p2) {
  return (p2 / 8 >> 0) + (p2 & 7 && 1);
};
var slc = function(v2, s2, e) {
  if (e == null || e > v2.length)
    e = v2.length;
  var n2 = new (v2 instanceof u16 ? u16 : v2 instanceof u32 ? u32 : u8)(e - s2);
  n2.set(v2.subarray(s2, e));
  return n2;
};
var inflt = function(dat, buf, st2) {
  var sl = dat.length;
  var noBuf = !buf || st2;
  var noSt = !st2 || st2.i;
  if (!st2)
    st2 = {};
  if (!buf)
    buf = new u8(sl * 3);
  var cbuf = function(l3) {
    var bl = buf.length;
    if (l3 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l3));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st2.f || 0, pos = st2.p || 0, bt2 = st2.b || 0, lm = st2.l, dm = st2.d, lbt = st2.m, dbt = st2.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      st2.f = final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s2 = shft(pos) + 4, l2 = dat[s2 - 4] | dat[s2 - 3] << 8, t2 = s2 + l2;
        if (t2 > sl) {
          if (noSt)
            throw "unexpected EOF";
          break;
        }
        if (noBuf)
          cbuf(bt2 + l2);
        buf.set(dat.subarray(s2, t2), bt2);
        st2.b = bt2 += l2, st2.p = pos = t2 * 8;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i2 = 0; i2 < hcLen; ++i2) {
          clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        if (!noSt && pos + tl * (clb + 7) > tbts)
          break;
        var clm = hMap(clt, clb, 1);
        for (var i2 = 0; i2 < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s2 = r >>> 4;
          if (s2 < 16) {
            ldt[i2++] = s2;
          } else {
            var c2 = 0, n2 = 0;
            if (s2 == 16)
              n2 = 3 + bits(dat, pos, 3), pos += 2, c2 = ldt[i2 - 1];
            else if (s2 == 17)
              n2 = 3 + bits(dat, pos, 7), pos += 3;
            else if (s2 == 18)
              n2 = 11 + bits(dat, pos, 127), pos += 7;
            while (n2--)
              ldt[i2++] = c2;
          }
        }
        var lt2 = ldt.subarray(0, hLit), dt2 = ldt.subarray(hLit);
        lbt = max(lt2);
        dbt = max(dt2);
        lm = hMap(lt2, lbt, 1);
        dm = hMap(dt2, dbt, 1);
      } else
        throw "invalid block type";
      if (pos > tbts)
        throw "unexpected EOF";
    }
    if (noBuf)
      cbuf(bt2 + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var mxa = lbt + dbt + 18;
    while (noSt || pos + mxa < tbts) {
      var c2 = lm[bits16(dat, pos) & lms], sym = c2 >>> 4;
      pos += c2 & 15;
      if (pos > tbts)
        throw "unexpected EOF";
      if (!c2)
        throw "invalid length/literal";
      if (sym < 256)
        buf[bt2++] = sym;
      else if (sym == 256) {
        lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i2 = sym - 257, b2 = fleb[i2];
          add = bits(dat, pos, (1 << b2) - 1) + fl[i2];
          pos += b2;
        }
        var d2 = dm[bits16(dat, pos) & dms], dsym = d2 >>> 4;
        if (!d2)
          throw "invalid distance";
        pos += d2 & 15;
        var dt2 = fd[dsym];
        if (dsym > 3) {
          var b2 = fdeb[dsym];
          dt2 += bits16(dat, pos) & (1 << b2) - 1, pos += b2;
        }
        if (pos > tbts)
          throw "unexpected EOF";
        if (noBuf)
          cbuf(bt2 + 131072);
        var end = bt2 + add;
        for (; bt2 < end; bt2 += 4) {
          buf[bt2] = buf[bt2 - dt2];
          buf[bt2 + 1] = buf[bt2 + 1 - dt2];
          buf[bt2 + 2] = buf[bt2 + 2 - dt2];
          buf[bt2 + 3] = buf[bt2 + 3 - dt2];
        }
        bt2 = end;
      }
    }
    st2.l = lm, st2.p = pos, st2.b = bt2;
    if (lm)
      final = 1, st2.m = lbt, st2.d = dm, st2.n = dbt;
  } while (!final);
  return bt2 == buf.length ? buf : slc(buf, 0, bt2);
};
var wbits = function(d2, p2, v2) {
  v2 <<= p2 & 7;
  var o2 = p2 / 8 >> 0;
  d2[o2] |= v2;
  d2[o2 + 1] |= v2 >>> 8;
};
var wbits16 = function(d2, p2, v2) {
  v2 <<= p2 & 7;
  var o2 = p2 / 8 >> 0;
  d2[o2] |= v2;
  d2[o2 + 1] |= v2 >>> 8;
  d2[o2 + 2] |= v2 >>> 16;
};
var hTree = function(d2, mb) {
  var t2 = [];
  for (var i2 = 0; i2 < d2.length; ++i2) {
    if (d2[i2])
      t2.push({ s: i2, f: d2[i2] });
  }
  var s2 = t2.length;
  var t22 = t2.slice();
  if (!s2)
    return [new u8(0), 0];
  if (s2 == 1) {
    var v2 = new u8(t2[0].s + 1);
    v2[t2[0].s] = 1;
    return [v2, 1];
  }
  t2.sort(function(a2, b2) {
    return a2.f - b2.f;
  });
  t2.push({ s: -1, f: 25001 });
  var l2 = t2[0], r = t2[1], i0 = 0, i1 = 1, i22 = 2;
  t2[0] = { s: -1, f: l2.f + r.f, l: l2, r };
  while (i1 != s2 - 1) {
    l2 = t2[t2[i0].f < t2[i22].f ? i0++ : i22++];
    r = t2[i0 != i1 && t2[i0].f < t2[i22].f ? i0++ : i22++];
    t2[i1++] = { s: -1, f: l2.f + r.f, l: l2, r };
  }
  var maxSym = t22[0].s;
  for (var i2 = 1; i2 < s2; ++i2) {
    if (t22[i2].s > maxSym)
      maxSym = t22[i2].s;
  }
  var tr = new u16(maxSym + 1);
  var mbt = ln(t2[i1 - 1], tr, 0);
  if (mbt > mb) {
    var i2 = 0, dt2 = 0;
    var lft = mbt - mb, cst = 1 << lft;
    t22.sort(function(a2, b2) {
      return tr[b2.s] - tr[a2.s] || a2.f - b2.f;
    });
    for (; i2 < s2; ++i2) {
      var i2_1 = t22[i2].s;
      if (tr[i2_1] > mb) {
        dt2 += cst - (1 << mbt - tr[i2_1]);
        tr[i2_1] = mb;
      } else
        break;
    }
    dt2 >>>= lft;
    while (dt2 > 0) {
      var i2_2 = t22[i2].s;
      if (tr[i2_2] < mb)
        dt2 -= 1 << mb - tr[i2_2]++ - 1;
      else
        ++i2;
    }
    for (; i2 >= 0 && dt2; --i2) {
      var i2_3 = t22[i2].s;
      if (tr[i2_3] == mb) {
        --tr[i2_3];
        ++dt2;
      }
    }
    mbt = mb;
  }
  return [new u8(tr), mbt];
};
var ln = function(n2, l2, d2) {
  return n2.s == -1 ? Math.max(ln(n2.l, l2, d2 + 1), ln(n2.r, l2, d2 + 1)) : l2[n2.s] = d2;
};
var lc = function(c2) {
  var s2 = c2.length;
  while (s2 && !c2[--s2])
    ;
  var cl = new u16(++s2);
  var cli = 0, cln = c2[0], cls = 1;
  var w2 = function(v2) {
    cl[cli++] = v2;
  };
  for (var i2 = 1; i2 <= s2; ++i2) {
    if (c2[i2] == cln && i2 != s2)
      ++cls;
    else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138)
          w2(32754);
        if (cls > 2) {
          w2(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w2(cln), --cls;
        for (; cls > 6; cls -= 6)
          w2(8304);
        if (cls > 2)
          w2(cls - 3 << 5 | 8208), cls = 0;
      }
      while (cls--)
        w2(cln);
      cls = 1;
      cln = c2[i2];
    }
  }
  return [cl.subarray(0, cli), s2];
};
var clen = function(cf, cl) {
  var l2 = 0;
  for (var i2 = 0; i2 < cl.length; ++i2)
    l2 += cf[i2] * cl[i2];
  return l2;
};
var wfblk = function(out, pos, dat) {
  var s2 = dat.length;
  var o2 = shft(pos + 2);
  out[o2] = s2 & 255;
  out[o2 + 1] = s2 >>> 8;
  out[o2 + 2] = out[o2] ^ 255;
  out[o2 + 3] = out[o2 + 1] ^ 255;
  for (var i2 = 0; i2 < s2; ++i2)
    out[o2 + i2 + 4] = dat[i2];
  return (o2 + 4 + s2) * 8;
};
var wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p2) {
  wbits(out, p2++, final);
  ++lf[256];
  var _a2 = hTree(lf, 15), dlt = _a2[0], mlb = _a2[1];
  var _b2 = hTree(df, 15), ddt = _b2[0], mdb = _b2[1];
  var _c = lc(dlt), lclt = _c[0], nlc = _c[1];
  var _d = lc(ddt), lcdt = _d[0], ndc = _d[1];
  var lcfreq = new u16(19);
  for (var i2 = 0; i2 < lclt.length; ++i2)
    lcfreq[lclt[i2] & 31]++;
  for (var i2 = 0; i2 < lcdt.length; ++i2)
    lcfreq[lcdt[i2] & 31]++;
  var _e = hTree(lcfreq, 7), lct = _e[0], mlcb = _e[1];
  var nlcc = 19;
  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
    ;
  var flen = bl + 5 << 3;
  var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + (2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18]);
  if (flen <= ftlen && flen <= dtlen)
    return wfblk(out, p2, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  wbits(out, p2, 1 + (dtlen < ftlen)), p2 += 2;
  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p2, nlc - 257);
    wbits(out, p2 + 5, ndc - 1);
    wbits(out, p2 + 10, nlcc - 4);
    p2 += 14;
    for (var i2 = 0; i2 < nlcc; ++i2)
      wbits(out, p2 + 3 * i2, lct[clim[i2]]);
    p2 += 3 * nlcc;
    var lcts = [lclt, lcdt];
    for (var it2 = 0; it2 < 2; ++it2) {
      var clct = lcts[it2];
      for (var i2 = 0; i2 < clct.length; ++i2) {
        var len = clct[i2] & 31;
        wbits(out, p2, llm[len]), p2 += lct[len];
        if (len > 15)
          wbits(out, p2, clct[i2] >>> 5 & 127), p2 += clct[i2] >>> 12;
      }
    }
  } else {
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  }
  for (var i2 = 0; i2 < li; ++i2) {
    if (syms[i2] > 255) {
      var len = syms[i2] >>> 18 & 31;
      wbits16(out, p2, lm[len + 257]), p2 += ll[len + 257];
      if (len > 7)
        wbits(out, p2, syms[i2] >>> 23 & 31), p2 += fleb[len];
      var dst = syms[i2] & 31;
      wbits16(out, p2, dm[dst]), p2 += dl[dst];
      if (dst > 3)
        wbits16(out, p2, syms[i2] >>> 5 & 8191), p2 += fdeb[dst];
    } else {
      wbits16(out, p2, lm[syms[i2]]), p2 += ll[syms[i2]];
    }
  }
  wbits16(out, p2, lm[256]);
  return p2 + ll[256];
};
var deo = /* @__PURE__ */ new u32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var dflt = function(dat, lvl, plvl, pre, post, lst) {
  var s2 = dat.length;
  var o2 = new u8(pre + s2 + 5 * (1 + Math.floor(s2 / 7e3)) + post);
  var w2 = o2.subarray(pre, o2.length - post);
  var pos = 0;
  if (!lvl || s2 < 8) {
    for (var i2 = 0; i2 <= s2; i2 += 65535) {
      var e = i2 + 65535;
      if (e < s2) {
        pos = wfblk(w2, pos, dat.subarray(i2, e));
      } else {
        w2[i2] = lst;
        pos = wfblk(w2, pos, dat.subarray(i2, s2));
      }
    }
  } else {
    var opt = deo[lvl - 1];
    var n2 = opt >>> 13, c2 = opt & 8191;
    var msk_1 = (1 << plvl) - 1;
    var prev = new u16(32768), head = new u16(msk_1 + 1);
    var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
    var hsh = function(i3) {
      return (dat[i3] ^ dat[i3 + 1] << bs1_1 ^ dat[i3 + 2] << bs2_1) & msk_1;
    };
    var syms = new u32(25e3);
    var lf = new u16(288), df = new u16(32);
    var lc_1 = 0, eb = 0, i2 = 0, li = 0, wi = 0, bs = 0;
    for (; i2 < s2; ++i2) {
      var hv = hsh(i2);
      var imod = i2 & 32767;
      var pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod;
      if (wi <= i2) {
        var rem = s2 - i2;
        if ((lc_1 > 7e3 || li > 24576) && rem > 423) {
          pos = wblk(dat, w2, 0, syms, lf, df, eb, li, bs, i2 - bs, pos);
          li = lc_1 = eb = 0, bs = i2;
          for (var j2 = 0; j2 < 286; ++j2)
            lf[j2] = 0;
          for (var j2 = 0; j2 < 30; ++j2)
            df[j2] = 0;
        }
        var l2 = 2, d2 = 0, ch_1 = c2, dif = imod - pimod & 32767;
        if (rem > 2 && hv == hsh(i2 - dif)) {
          var maxn = Math.min(n2, rem) - 1;
          var maxd = Math.min(32767, i2);
          var ml = Math.min(258, rem);
          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i2 + l2] == dat[i2 + l2 - dif]) {
              var nl = 0;
              for (; nl < ml && dat[i2 + nl] == dat[i2 + nl - dif]; ++nl)
                ;
              if (nl > l2) {
                l2 = nl, d2 = dif;
                if (nl > maxn)
                  break;
                var mmd = Math.min(dif, nl - 2);
                var md = 0;
                for (var j2 = 0; j2 < mmd; ++j2) {
                  var ti = i2 - dif + j2 + 32768 & 32767;
                  var pti = prev[ti];
                  var cd = ti - pti + 32768 & 32767;
                  if (cd > md)
                    md = cd, pimod = ti;
                }
              }
            }
            imod = pimod, pimod = prev[imod];
            dif += imod - pimod + 32768 & 32767;
          }
        }
        if (d2) {
          syms[li++] = 268435456 | revfl[l2] << 18 | revfd[d2];
          var lin = revfl[l2] & 31, din = revfd[d2] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i2 + l2;
          ++lc_1;
        } else {
          syms[li++] = dat[i2];
          ++lf[dat[i2]];
        }
      }
    }
    pos = wblk(dat, w2, lst, syms, lf, df, eb, li, bs, i2 - bs, pos);
  }
  return slc(o2, 0, pre + shft(pos) + post);
};
var adler = function() {
  var a2 = 1, b2 = 0;
  return {
    p: function(d2) {
      var n2 = a2, m2 = b2;
      var l2 = d2.length;
      for (var i2 = 0; i2 != l2; ) {
        var e = Math.min(i2 + 5552, l2);
        for (; i2 < e; ++i2)
          n2 += d2[i2], m2 += n2;
        n2 %= 65521, m2 %= 65521;
      }
      a2 = n2, b2 = m2;
    },
    d: function() {
      return (a2 >>> 8 << 16 | (b2 & 255) << 8 | b2 >>> 8) + ((a2 & 255) << 23) * 2;
    }
  };
};
var dopt = function(dat, opt, pre, post, st2) {
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 12 + opt.mem, pre, post, !st2);
};
var wbytes = function(d2, b2, v2) {
  for (; v2; ++b2)
    d2[b2] = v2, v2 >>>= 8;
};
var zlh = function(c2, o2) {
  var lv = o2.level, fl2 = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
  c2[0] = 120, c2[1] = fl2 << 6 | (fl2 ? 32 - 2 * fl2 : 1);
};
var zlv = function(d2) {
  if ((d2[0] & 15) != 8 || d2[0] >>> 4 > 7 || (d2[0] << 8 | d2[1]) % 31)
    throw "invalid zlib data";
  if (d2[1] & 32)
    throw "invalid zlib data: preset dictionaries not supported";
};
function zlibSync(data, opts) {
  if (opts === void 0) {
    opts = {};
  }
  var a2 = adler();
  a2.p(data);
  var d2 = dopt(data, opts, 2, 4);
  return zlh(d2, opts), wbytes(d2, d2.length - 4, a2.d()), d2;
}
function unzlibSync(data, out) {
  return inflt((zlv(data), data.subarray(2, -4)), out);
}
/** @license
 *
 * jsPDF - PDF Document creation from JavaScript
 * Version 2.5.1 Built on 2022-01-28T15:37:57.791Z
 *                      CommitID 00000000
 *
 * Copyright (c) 2010-2021 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
 *               2015-2021 yWorks GmbH, http://www.yworks.com
 *               2015-2021 Lukas Holländer <lukas.hollaender@yworks.com>, https://github.com/HackbrettXXX
 *               2016-2018 Aras Abbasi <aras.abbasi@gmail.com>
 *               2010 Aaron Spike, https://github.com/acspike
 *               2012 Willow Systems Corporation, https://github.com/willowsystems
 *               2012 Pablo Hess, https://github.com/pablohess
 *               2012 Florian Jenett, https://github.com/fjenett
 *               2013 Warren Weckesser, https://github.com/warrenweckesser
 *               2013 Youssef Beddad, https://github.com/lifof
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2013 Stefan Slonevskiy, https://github.com/stefslon
 *               2013 Jeremy Morel, https://github.com/jmorel
 *               2013 Christoph Hartmann, https://github.com/chris-rock
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Makes, https://github.com/dollaruw
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 Steven Spungin, https://github.com/Flamenco
 *               2014 Kenneth Glassey, https://github.com/Gavvers
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Contributor(s):
 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
 *    kim3er, mfo, alnorth, Flamenco
 */
var n = /* @__PURE__ */ function() {
  return "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this;
}();
function i() {
  n.console && "function" == typeof n.console.log && n.console.log.apply(n.console, arguments);
}
var a = { log: i, warn: function(t2) {
  n.console && ("function" == typeof n.console.warn ? n.console.warn.apply(n.console, arguments) : i.call(null, arguments));
}, error: function(t2) {
  n.console && ("function" == typeof n.console.error ? n.console.error.apply(n.console, arguments) : i(t2));
} };
function o(t2, e, r) {
  var n2 = new XMLHttpRequest();
  n2.open("GET", t2), n2.responseType = "blob", n2.onload = function() {
    l(n2.response, e, r);
  }, n2.onerror = function() {
    a.error("could not download file");
  }, n2.send();
}
function s(t2) {
  var e = new XMLHttpRequest();
  e.open("HEAD", t2, false);
  try {
    e.send();
  } catch (t3) {
  }
  return e.status >= 200 && e.status <= 299;
}
function c(t2) {
  try {
    t2.dispatchEvent(new MouseEvent("click"));
  } catch (r) {
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null), t2.dispatchEvent(e);
  }
}
var u, h, l = n.saveAs || ("object" !== ("undefined" == typeof window ? "undefined" : _typeof(window)) || window !== n ? function() {
} : "undefined" != typeof HTMLAnchorElement && "download" in HTMLAnchorElement.prototype ? function(t2, e, r) {
  var i2 = n.URL || n.webkitURL, a2 = document.createElement("a");
  e = e || t2.name || "download", a2.download = e, a2.rel = "noopener", "string" == typeof t2 ? (a2.href = t2, a2.origin !== location.origin ? s(a2.href) ? o(t2, e, r) : c(a2, a2.target = "_blank") : c(a2)) : (a2.href = i2.createObjectURL(t2), setTimeout(function() {
    i2.revokeObjectURL(a2.href);
  }, 4e4), setTimeout(function() {
    c(a2);
  }, 0));
} : "msSaveOrOpenBlob" in navigator ? function(e, r, n2) {
  if (r = r || e.name || "download", "string" == typeof e) if (s(e)) o(e, r, n2);
  else {
    var i2 = document.createElement("a");
    i2.href = e, i2.target = "_blank", setTimeout(function() {
      c(i2);
    });
  }
  else navigator.msSaveOrOpenBlob(function(e2, r2) {
    return void 0 === r2 ? r2 = { autoBom: false } : "object" !== _typeof(r2) && (a.warn("Deprecated: Expected third argument to be a object"), r2 = { autoBom: !r2 }), r2.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e2.type) ? new Blob([String.fromCharCode(65279), e2], { type: e2.type }) : e2;
  }(e, n2), r);
} : function(e, r, i2, a2) {
  if ((a2 = a2 || open("", "_blank")) && (a2.document.title = a2.document.body.innerText = "downloading..."), "string" == typeof e) return o(e, r, i2);
  var s2 = "application/octet-stream" === e.type, c2 = /constructor/i.test(n.HTMLElement) || n.safari, u2 = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((u2 || s2 && c2) && "object" === ("undefined" == typeof FileReader ? "undefined" : _typeof(FileReader))) {
    var h2 = new FileReader();
    h2.onloadend = function() {
      var t2 = h2.result;
      t2 = u2 ? t2 : t2.replace(/^data:[^;]*;/, "data:attachment/file;"), a2 ? a2.location.href = t2 : location = t2, a2 = null;
    }, h2.readAsDataURL(e);
  } else {
    var l2 = n.URL || n.webkitURL, f2 = l2.createObjectURL(e);
    a2 ? a2.location = f2 : location.href = f2, a2 = null, setTimeout(function() {
      l2.revokeObjectURL(f2);
    }, 4e4);
  }
});
/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * {@link   http://www.phpied.com/rgb-color-parser-in-javascript/}
 * @license Use it if you like it
 */
function f(t2) {
  var e;
  t2 = t2 || "", this.ok = false, "#" == t2.charAt(0) && (t2 = t2.substr(1, 6));
  t2 = { aliceblue: "f0f8ff", antiquewhite: "faebd7", aqua: "00ffff", aquamarine: "7fffd4", azure: "f0ffff", beige: "f5f5dc", bisque: "ffe4c4", black: "000000", blanchedalmond: "ffebcd", blue: "0000ff", blueviolet: "8a2be2", brown: "a52a2a", burlywood: "deb887", cadetblue: "5f9ea0", chartreuse: "7fff00", chocolate: "d2691e", coral: "ff7f50", cornflowerblue: "6495ed", cornsilk: "fff8dc", crimson: "dc143c", cyan: "00ffff", darkblue: "00008b", darkcyan: "008b8b", darkgoldenrod: "b8860b", darkgray: "a9a9a9", darkgreen: "006400", darkkhaki: "bdb76b", darkmagenta: "8b008b", darkolivegreen: "556b2f", darkorange: "ff8c00", darkorchid: "9932cc", darkred: "8b0000", darksalmon: "e9967a", darkseagreen: "8fbc8f", darkslateblue: "483d8b", darkslategray: "2f4f4f", darkturquoise: "00ced1", darkviolet: "9400d3", deeppink: "ff1493", deepskyblue: "00bfff", dimgray: "696969", dodgerblue: "1e90ff", feldspar: "d19275", firebrick: "b22222", floralwhite: "fffaf0", forestgreen: "228b22", fuchsia: "ff00ff", gainsboro: "dcdcdc", ghostwhite: "f8f8ff", gold: "ffd700", goldenrod: "daa520", gray: "808080", green: "008000", greenyellow: "adff2f", honeydew: "f0fff0", hotpink: "ff69b4", indianred: "cd5c5c", indigo: "4b0082", ivory: "fffff0", khaki: "f0e68c", lavender: "e6e6fa", lavenderblush: "fff0f5", lawngreen: "7cfc00", lemonchiffon: "fffacd", lightblue: "add8e6", lightcoral: "f08080", lightcyan: "e0ffff", lightgoldenrodyellow: "fafad2", lightgrey: "d3d3d3", lightgreen: "90ee90", lightpink: "ffb6c1", lightsalmon: "ffa07a", lightseagreen: "20b2aa", lightskyblue: "87cefa", lightslateblue: "8470ff", lightslategray: "778899", lightsteelblue: "b0c4de", lightyellow: "ffffe0", lime: "00ff00", limegreen: "32cd32", linen: "faf0e6", magenta: "ff00ff", maroon: "800000", mediumaquamarine: "66cdaa", mediumblue: "0000cd", mediumorchid: "ba55d3", mediumpurple: "9370d8", mediumseagreen: "3cb371", mediumslateblue: "7b68ee", mediumspringgreen: "00fa9a", mediumturquoise: "48d1cc", mediumvioletred: "c71585", midnightblue: "191970", mintcream: "f5fffa", mistyrose: "ffe4e1", moccasin: "ffe4b5", navajowhite: "ffdead", navy: "000080", oldlace: "fdf5e6", olive: "808000", olivedrab: "6b8e23", orange: "ffa500", orangered: "ff4500", orchid: "da70d6", palegoldenrod: "eee8aa", palegreen: "98fb98", paleturquoise: "afeeee", palevioletred: "d87093", papayawhip: "ffefd5", peachpuff: "ffdab9", peru: "cd853f", pink: "ffc0cb", plum: "dda0dd", powderblue: "b0e0e6", purple: "800080", red: "ff0000", rosybrown: "bc8f8f", royalblue: "4169e1", saddlebrown: "8b4513", salmon: "fa8072", sandybrown: "f4a460", seagreen: "2e8b57", seashell: "fff5ee", sienna: "a0522d", silver: "c0c0c0", skyblue: "87ceeb", slateblue: "6a5acd", slategray: "708090", snow: "fffafa", springgreen: "00ff7f", steelblue: "4682b4", tan: "d2b48c", teal: "008080", thistle: "d8bfd8", tomato: "ff6347", turquoise: "40e0d0", violet: "ee82ee", violetred: "d02090", wheat: "f5deb3", white: "ffffff", whitesmoke: "f5f5f5", yellow: "ffff00", yellowgreen: "9acd32" }[t2 = (t2 = t2.replace(/ /g, "")).toLowerCase()] || t2;
  for (var r = [{ re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/, example: ["rgb(123, 234, 45)", "rgb(255,234,245)"], process: function(t3) {
    return [parseInt(t3[1]), parseInt(t3[2]), parseInt(t3[3])];
  } }, { re: /^(\w{2})(\w{2})(\w{2})$/, example: ["#00ff00", "336699"], process: function(t3) {
    return [parseInt(t3[1], 16), parseInt(t3[2], 16), parseInt(t3[3], 16)];
  } }, { re: /^(\w{1})(\w{1})(\w{1})$/, example: ["#fb0", "f0f"], process: function(t3) {
    return [parseInt(t3[1] + t3[1], 16), parseInt(t3[2] + t3[2], 16), parseInt(t3[3] + t3[3], 16)];
  } }], n2 = 0; n2 < r.length; n2++) {
    var i2 = r[n2].re, a2 = r[n2].process, o2 = i2.exec(t2);
    o2 && (e = a2(o2), this.r = e[0], this.g = e[1], this.b = e[2], this.ok = true);
  }
  this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r, this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g, this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b, this.toRGB = function() {
    return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
  }, this.toHex = function() {
    var t3 = this.r.toString(16), e2 = this.g.toString(16), r2 = this.b.toString(16);
    return 1 == t3.length && (t3 = "0" + t3), 1 == e2.length && (e2 = "0" + e2), 1 == r2.length && (r2 = "0" + r2), "#" + t3 + e2 + r2;
  };
}
/**
 * @license
 * Joseph Myers does not specify a particular license for his work.
 *
 * Author: Joseph Myers
 * Accessed from: http://www.myersdaily.org/joseph/javascript/md5.js
 *
 * Modified by: Owen Leong
 */
function d(t2, e) {
  var r = t2[0], n2 = t2[1], i2 = t2[2], a2 = t2[3];
  r = g(r, n2, i2, a2, e[0], 7, -680876936), a2 = g(a2, r, n2, i2, e[1], 12, -389564586), i2 = g(i2, a2, r, n2, e[2], 17, 606105819), n2 = g(n2, i2, a2, r, e[3], 22, -1044525330), r = g(r, n2, i2, a2, e[4], 7, -176418897), a2 = g(a2, r, n2, i2, e[5], 12, 1200080426), i2 = g(i2, a2, r, n2, e[6], 17, -1473231341), n2 = g(n2, i2, a2, r, e[7], 22, -45705983), r = g(r, n2, i2, a2, e[8], 7, 1770035416), a2 = g(a2, r, n2, i2, e[9], 12, -1958414417), i2 = g(i2, a2, r, n2, e[10], 17, -42063), n2 = g(n2, i2, a2, r, e[11], 22, -1990404162), r = g(r, n2, i2, a2, e[12], 7, 1804603682), a2 = g(a2, r, n2, i2, e[13], 12, -40341101), i2 = g(i2, a2, r, n2, e[14], 17, -1502002290), r = m(r, n2 = g(n2, i2, a2, r, e[15], 22, 1236535329), i2, a2, e[1], 5, -165796510), a2 = m(a2, r, n2, i2, e[6], 9, -1069501632), i2 = m(i2, a2, r, n2, e[11], 14, 643717713), n2 = m(n2, i2, a2, r, e[0], 20, -373897302), r = m(r, n2, i2, a2, e[5], 5, -701558691), a2 = m(a2, r, n2, i2, e[10], 9, 38016083), i2 = m(i2, a2, r, n2, e[15], 14, -660478335), n2 = m(n2, i2, a2, r, e[4], 20, -405537848), r = m(r, n2, i2, a2, e[9], 5, 568446438), a2 = m(a2, r, n2, i2, e[14], 9, -1019803690), i2 = m(i2, a2, r, n2, e[3], 14, -187363961), n2 = m(n2, i2, a2, r, e[8], 20, 1163531501), r = m(r, n2, i2, a2, e[13], 5, -1444681467), a2 = m(a2, r, n2, i2, e[2], 9, -51403784), i2 = m(i2, a2, r, n2, e[7], 14, 1735328473), r = v(r, n2 = m(n2, i2, a2, r, e[12], 20, -1926607734), i2, a2, e[5], 4, -378558), a2 = v(a2, r, n2, i2, e[8], 11, -2022574463), i2 = v(i2, a2, r, n2, e[11], 16, 1839030562), n2 = v(n2, i2, a2, r, e[14], 23, -35309556), r = v(r, n2, i2, a2, e[1], 4, -1530992060), a2 = v(a2, r, n2, i2, e[4], 11, 1272893353), i2 = v(i2, a2, r, n2, e[7], 16, -155497632), n2 = v(n2, i2, a2, r, e[10], 23, -1094730640), r = v(r, n2, i2, a2, e[13], 4, 681279174), a2 = v(a2, r, n2, i2, e[0], 11, -358537222), i2 = v(i2, a2, r, n2, e[3], 16, -722521979), n2 = v(n2, i2, a2, r, e[6], 23, 76029189), r = v(r, n2, i2, a2, e[9], 4, -640364487), a2 = v(a2, r, n2, i2, e[12], 11, -421815835), i2 = v(i2, a2, r, n2, e[15], 16, 530742520), r = b(r, n2 = v(n2, i2, a2, r, e[2], 23, -995338651), i2, a2, e[0], 6, -198630844), a2 = b(a2, r, n2, i2, e[7], 10, 1126891415), i2 = b(i2, a2, r, n2, e[14], 15, -1416354905), n2 = b(n2, i2, a2, r, e[5], 21, -57434055), r = b(r, n2, i2, a2, e[12], 6, 1700485571), a2 = b(a2, r, n2, i2, e[3], 10, -1894986606), i2 = b(i2, a2, r, n2, e[10], 15, -1051523), n2 = b(n2, i2, a2, r, e[1], 21, -2054922799), r = b(r, n2, i2, a2, e[8], 6, 1873313359), a2 = b(a2, r, n2, i2, e[15], 10, -30611744), i2 = b(i2, a2, r, n2, e[6], 15, -1560198380), n2 = b(n2, i2, a2, r, e[13], 21, 1309151649), r = b(r, n2, i2, a2, e[4], 6, -145523070), a2 = b(a2, r, n2, i2, e[11], 10, -1120210379), i2 = b(i2, a2, r, n2, e[2], 15, 718787259), n2 = b(n2, i2, a2, r, e[9], 21, -343485551), t2[0] = _(r, t2[0]), t2[1] = _(n2, t2[1]), t2[2] = _(i2, t2[2]), t2[3] = _(a2, t2[3]);
}
function p(t2, e, r, n2, i2, a2) {
  return e = _(_(e, t2), _(n2, a2)), _(e << i2 | e >>> 32 - i2, r);
}
function g(t2, e, r, n2, i2, a2, o2) {
  return p(e & r | ~e & n2, t2, e, i2, a2, o2);
}
function m(t2, e, r, n2, i2, a2, o2) {
  return p(e & n2 | r & ~n2, t2, e, i2, a2, o2);
}
function v(t2, e, r, n2, i2, a2, o2) {
  return p(e ^ r ^ n2, t2, e, i2, a2, o2);
}
function b(t2, e, r, n2, i2, a2, o2) {
  return p(r ^ (e | ~n2), t2, e, i2, a2, o2);
}
function y(t2) {
  var e, r = t2.length, n2 = [1732584193, -271733879, -1732584194, 271733878];
  for (e = 64; e <= t2.length; e += 64) d(n2, w(t2.substring(e - 64, e)));
  t2 = t2.substring(e - 64);
  var i2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (e = 0; e < t2.length; e++) i2[e >> 2] |= t2.charCodeAt(e) << (e % 4 << 3);
  if (i2[e >> 2] |= 128 << (e % 4 << 3), e > 55) for (d(n2, i2), e = 0; e < 16; e++) i2[e] = 0;
  return i2[14] = 8 * r, d(n2, i2), n2;
}
function w(t2) {
  var e, r = [];
  for (e = 0; e < 64; e += 4) r[e >> 2] = t2.charCodeAt(e) + (t2.charCodeAt(e + 1) << 8) + (t2.charCodeAt(e + 2) << 16) + (t2.charCodeAt(e + 3) << 24);
  return r;
}
u = n.atob.bind(n), h = n.btoa.bind(n);
var N = "0123456789abcdef".split("");
function L(t2) {
  for (var e = "", r = 0; r < 4; r++) e += N[t2 >> 8 * r + 4 & 15] + N[t2 >> 8 * r & 15];
  return e;
}
function A(t2) {
  return String.fromCharCode((255 & t2) >> 0, (65280 & t2) >> 8, (16711680 & t2) >> 16, (4278190080 & t2) >> 24);
}
function x(t2) {
  return y(t2).map(A).join("");
}
var S = "5d41402abc4b2a76b9719d911017c592" != function(t2) {
  for (var e = 0; e < t2.length; e++) t2[e] = L(t2[e]);
  return t2.join("");
}(y("hello"));
function _(t2, e) {
  if (S) {
    var r = (65535 & t2) + (65535 & e);
    return (t2 >> 16) + (e >> 16) + (r >> 16) << 16 | 65535 & r;
  }
  return t2 + e & 4294967295;
}
/**
 * @license
 * FPDF is released under a permissive license: there is no usage restriction.
 * You may embed it freely in your application (commercial or not), with or
 * without modifications.
 *
 * Reference: http://www.fpdf.org/en/script/script37.php
 */
function P(t2, e) {
  var r, n2, i2, a2;
  if (t2 !== r) {
    for (var o2 = (i2 = t2, a2 = 1 + (256 / t2.length >> 0), new Array(a2 + 1).join(i2)), s2 = [], c2 = 0; c2 < 256; c2++) s2[c2] = c2;
    var u2 = 0;
    for (c2 = 0; c2 < 256; c2++) {
      var h2 = s2[c2];
      u2 = (u2 + h2 + o2.charCodeAt(c2)) % 256, s2[c2] = s2[u2], s2[u2] = h2;
    }
    r = t2, n2 = s2;
  } else s2 = n2;
  var l2 = e.length, f2 = 0, d2 = 0, p2 = "";
  for (c2 = 0; c2 < l2; c2++) d2 = (d2 + (h2 = s2[f2 = (f2 + 1) % 256])) % 256, s2[f2] = s2[d2], s2[d2] = h2, o2 = s2[(s2[f2] + s2[d2]) % 256], p2 += String.fromCharCode(e.charCodeAt(c2) ^ o2);
  return p2;
}
/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 * Author: Owen Leong (@owenl131)
 * Date: 15 Oct 2020
 * References:
 * https://www.cs.cmu.edu/~dst/Adobe/Gallery/anon21jul01-pdf-encryption.txt
 * https://github.com/foliojs/pdfkit/blob/master/lib/security.js
 * http://www.fpdf.org/en/script/script37.php
 */
var k = { print: 4, modify: 8, copy: 16, "annot-forms": 32 };
function I(t2, e, r, n2) {
  this.v = 1, this.r = 2;
  var i2 = 192;
  t2.forEach(function(t3) {
    if (void 0 !== k.perm) throw new Error("Invalid permission: " + t3);
    i2 += k[t3];
  }), this.padding = "(¿N^NuAd\0NVÿú\b..\0¶Ðh>/\f©þdSiz";
  var a2 = (e + this.padding).substr(0, 32), o2 = (r + this.padding).substr(0, 32);
  this.O = this.processOwnerPassword(a2, o2), this.P = -(1 + (255 ^ i2)), this.encryptionKey = x(a2 + this.O + this.lsbFirstWord(this.P) + this.hexToBytes(n2)).substr(0, 5), this.U = P(this.encryptionKey, this.padding);
}
function F(t2) {
  if (/[^\u0000-\u00ff]/.test(t2)) throw new Error("Invalid PDF Name Object: " + t2 + ", Only accept ASCII characters.");
  for (var e = "", r = t2.length, n2 = 0; n2 < r; n2++) {
    var i2 = t2.charCodeAt(n2);
    if (i2 < 33 || 35 === i2 || 37 === i2 || 40 === i2 || 41 === i2 || 47 === i2 || 60 === i2 || 62 === i2 || 91 === i2 || 93 === i2 || 123 === i2 || 125 === i2 || i2 > 126) e += "#" + ("0" + i2.toString(16)).slice(-2);
    else e += t2[n2];
  }
  return e;
}
function C(e) {
  if ("object" !== _typeof(e)) throw new Error("Invalid Context passed to initialize PubSub (jsPDF-module)");
  var r = {};
  this.subscribe = function(t2, e2, n2) {
    if (n2 = n2 || false, "string" != typeof t2 || "function" != typeof e2 || "boolean" != typeof n2) throw new Error("Invalid arguments passed to PubSub.subscribe (jsPDF-module)");
    r.hasOwnProperty(t2) || (r[t2] = {});
    var i2 = Math.random().toString(35);
    return r[t2][i2] = [e2, !!n2], i2;
  }, this.unsubscribe = function(t2) {
    for (var e2 in r) if (r[e2][t2]) return delete r[e2][t2], 0 === Object.keys(r[e2]).length && delete r[e2], true;
    return false;
  }, this.publish = function(t2) {
    if (r.hasOwnProperty(t2)) {
      var i2 = Array.prototype.slice.call(arguments, 1), o2 = [];
      for (var s2 in r[t2]) {
        var c2 = r[t2][s2];
        try {
          c2[0].apply(e, i2);
        } catch (t3) {
          n.console && a.error("jsPDF PubSub Error", t3.message, t3);
        }
        c2[1] && o2.push(s2);
      }
      o2.length && o2.forEach(this.unsubscribe);
    }
  }, this.getTopics = function() {
    return r;
  };
}
function j(t2) {
  if (!(this instanceof j)) return new j(t2);
  var e = "opacity,stroke-opacity".split(",");
  for (var r in t2) t2.hasOwnProperty(r) && e.indexOf(r) >= 0 && (this[r] = t2[r]);
  this.id = "", this.objectNumber = -1;
}
function O(t2, e) {
  this.gState = t2, this.matrix = e, this.id = "", this.objectNumber = -1;
}
function B(t2, e, r, n2, i2) {
  if (!(this instanceof B)) return new B(t2, e, r, n2, i2);
  this.type = "axial" === t2 ? 2 : 3, this.coords = e, this.colors = r, O.call(this, n2, i2);
}
function M(t2, e, r, n2, i2) {
  if (!(this instanceof M)) return new M(t2, e, r, n2, i2);
  this.boundingBox = t2, this.xStep = e, this.yStep = r, this.stream = "", this.cloneIndex = 0, O.call(this, n2, i2);
}
function E(e) {
  var r, i2 = "string" == typeof arguments[0] ? arguments[0] : "p", o2 = arguments[1], s2 = arguments[2], c2 = arguments[3], u2 = [], d2 = 1, p2 = 16, g2 = "S", m2 = null;
  "object" === _typeof(e = e || {}) && (i2 = e.orientation, o2 = e.unit || o2, s2 = e.format || s2, c2 = e.compress || e.compressPdf || c2, null !== (m2 = e.encryption || null) && (m2.userPassword = m2.userPassword || "", m2.ownerPassword = m2.ownerPassword || "", m2.userPermissions = m2.userPermissions || []), d2 = "number" == typeof e.userUnit ? Math.abs(e.userUnit) : 1, void 0 !== e.precision && (r = e.precision), void 0 !== e.floatPrecision && (p2 = e.floatPrecision), g2 = e.defaultPathOperation || "S"), u2 = e.filters || (true === c2 ? ["FlateEncode"] : u2), o2 = o2 || "mm", i2 = ("" + (i2 || "P")).toLowerCase();
  var v2 = e.putOnlyUsedFonts || false, b2 = {}, y2 = { internal: {}, __private__: {} };
  y2.__private__.PubSub = C;
  var w2 = "1.3", N2 = y2.__private__.getPdfVersion = function() {
    return w2;
  };
  y2.__private__.setPdfVersion = function(t2) {
    w2 = t2;
  };
  var L2 = { a0: [2383.94, 3370.39], a1: [1683.78, 2383.94], a2: [1190.55, 1683.78], a3: [841.89, 1190.55], a4: [595.28, 841.89], a5: [419.53, 595.28], a6: [297.64, 419.53], a7: [209.76, 297.64], a8: [147.4, 209.76], a9: [104.88, 147.4], a10: [73.7, 104.88], b0: [2834.65, 4008.19], b1: [2004.09, 2834.65], b2: [1417.32, 2004.09], b3: [1000.63, 1417.32], b4: [708.66, 1000.63], b5: [498.9, 708.66], b6: [354.33, 498.9], b7: [249.45, 354.33], b8: [175.75, 249.45], b9: [124.72, 175.75], b10: [87.87, 124.72], c0: [2599.37, 3676.54], c1: [1836.85, 2599.37], c2: [1298.27, 1836.85], c3: [918.43, 1298.27], c4: [649.13, 918.43], c5: [459.21, 649.13], c6: [323.15, 459.21], c7: [229.61, 323.15], c8: [161.57, 229.61], c9: [113.39, 161.57], c10: [79.37, 113.39], dl: [311.81, 623.62], letter: [612, 792], "government-letter": [576, 756], legal: [612, 1008], "junior-legal": [576, 360], ledger: [1224, 792], tabloid: [792, 1224], "credit-card": [153, 243] };
  y2.__private__.getPageFormats = function() {
    return L2;
  };
  var A2 = y2.__private__.getPageFormat = function(t2) {
    return L2[t2];
  };
  s2 = s2 || "a4";
  var x2 = { COMPAT: "compat", ADVANCED: "advanced" }, S2 = x2.COMPAT;
  function _2() {
    this.saveGraphicsState(), lt2(new Vt2(_t2, 0, 0, -_t2, 0, Rr() * _t2).toString() + " cm"), this.setFontSize(this.getFontSize() / _t2), g2 = "n", S2 = x2.ADVANCED;
  }
  function P2() {
    this.restoreGraphicsState(), g2 = "S", S2 = x2.COMPAT;
  }
  var k2 = y2.__private__.combineFontStyleAndFontWeight = function(t2, e2) {
    if ("bold" == t2 && "normal" == e2 || "bold" == t2 && 400 == e2 || "normal" == t2 && "italic" == e2 || "bold" == t2 && "italic" == e2) throw new Error("Invalid Combination of fontweight and fontstyle");
    return e2 && (t2 = 400 == e2 || "normal" === e2 ? "italic" === t2 ? "italic" : "normal" : 700 != e2 && "bold" !== e2 || "normal" !== t2 ? (700 == e2 ? "bold" : e2) + "" + t2 : "bold"), t2;
  };
  y2.advancedAPI = function(t2) {
    var e2 = S2 === x2.COMPAT;
    return e2 && _2.call(this), "function" != typeof t2 || (t2(this), e2 && P2.call(this)), this;
  }, y2.compatAPI = function(t2) {
    var e2 = S2 === x2.ADVANCED;
    return e2 && P2.call(this), "function" != typeof t2 || (t2(this), e2 && _2.call(this)), this;
  }, y2.isAdvancedAPI = function() {
    return S2 === x2.ADVANCED;
  };
  var O2, q2 = function(t2) {
    if (S2 !== x2.ADVANCED) throw new Error(t2 + " is only available in 'advanced' API mode. You need to call advancedAPI() first.");
  }, D2 = y2.roundToPrecision = y2.__private__.roundToPrecision = function(t2, e2) {
    var n2 = r || e2;
    if (isNaN(t2) || isNaN(n2)) throw new Error("Invalid argument passed to jsPDF.roundToPrecision");
    return t2.toFixed(n2).replace(/0+$/, "");
  };
  O2 = y2.hpf = y2.__private__.hpf = "number" == typeof p2 ? function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.hpf");
    return D2(t2, p2);
  } : "smart" === p2 ? function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.hpf");
    return D2(t2, t2 > -1 && t2 < 1 ? 16 : 5);
  } : function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.hpf");
    return D2(t2, 16);
  };
  var R2 = y2.f2 = y2.__private__.f2 = function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.f2");
    return D2(t2, 2);
  }, T2 = y2.__private__.f3 = function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.f3");
    return D2(t2, 3);
  }, U2 = y2.scale = y2.__private__.scale = function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.scale");
    return S2 === x2.COMPAT ? t2 * _t2 : S2 === x2.ADVANCED ? t2 : void 0;
  }, z2 = function(t2) {
    return S2 === x2.COMPAT ? Rr() - t2 : S2 === x2.ADVANCED ? t2 : void 0;
  }, H2 = function(t2) {
    return U2(z2(t2));
  };
  y2.__private__.setPrecision = y2.setPrecision = function(t2) {
    "number" == typeof parseInt(t2, 10) && (r = parseInt(t2, 10));
  };
  var W2, V2 = "00000000000000000000000000000000", G2 = y2.__private__.getFileId = function() {
    return V2;
  }, Y2 = y2.__private__.setFileId = function(t2) {
    return V2 = void 0 !== t2 && /^[a-fA-F0-9]{32}$/.test(t2) ? t2.toUpperCase() : V2.split("").map(function() {
      return "ABCDEF0123456789".charAt(Math.floor(16 * Math.random()));
    }).join(""), null !== m2 && (Ye = new I(m2.userPermissions, m2.userPassword, m2.ownerPassword, V2)), V2;
  };
  y2.setFileId = function(t2) {
    return Y2(t2), this;
  }, y2.getFileId = function() {
    return G2();
  };
  var J2 = y2.__private__.convertDateToPDFDate = function(t2) {
    var e2 = t2.getTimezoneOffset(), r2 = e2 < 0 ? "+" : "-", n2 = Math.floor(Math.abs(e2 / 60)), i3 = Math.abs(e2 % 60), a2 = [r2, Q2(n2), "'", Q2(i3), "'"].join("");
    return ["D:", t2.getFullYear(), Q2(t2.getMonth() + 1), Q2(t2.getDate()), Q2(t2.getHours()), Q2(t2.getMinutes()), Q2(t2.getSeconds()), a2].join("");
  }, X2 = y2.__private__.convertPDFDateToDate = function(t2) {
    var e2 = parseInt(t2.substr(2, 4), 10), r2 = parseInt(t2.substr(6, 2), 10) - 1, n2 = parseInt(t2.substr(8, 2), 10), i3 = parseInt(t2.substr(10, 2), 10), a2 = parseInt(t2.substr(12, 2), 10), o3 = parseInt(t2.substr(14, 2), 10);
    return new Date(e2, r2, n2, i3, a2, o3, 0);
  }, K2 = y2.__private__.setCreationDate = function(t2) {
    var e2;
    if (void 0 === t2 && (t2 = /* @__PURE__ */ new Date()), t2 instanceof Date) e2 = J2(t2);
    else {
      if (!/^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|-0[0-9]|-1[0-1])'(0[0-9]|[1-5][0-9])'?$/.test(t2)) throw new Error("Invalid argument passed to jsPDF.setCreationDate");
      e2 = t2;
    }
    return W2 = e2;
  }, Z2 = y2.__private__.getCreationDate = function(t2) {
    var e2 = W2;
    return "jsDate" === t2 && (e2 = X2(W2)), e2;
  };
  y2.setCreationDate = function(t2) {
    return K2(t2), this;
  }, y2.getCreationDate = function(t2) {
    return Z2(t2);
  };
  var $2, Q2 = y2.__private__.padd2 = function(t2) {
    return ("0" + parseInt(t2)).slice(-2);
  }, tt2 = y2.__private__.padd2Hex = function(t2) {
    return ("00" + (t2 = t2.toString())).substr(t2.length);
  }, et2 = 0, rt2 = [], nt2 = [], it2 = 0, at2 = [], ot2 = [], st2 = false, ct2 = nt2, ut2 = function() {
    et2 = 0, it2 = 0, nt2 = [], rt2 = [], at2 = [], Qt2 = Kt2(), te2 = Kt2();
  };
  y2.__private__.setCustomOutputDestination = function(t2) {
    st2 = true, ct2 = t2;
  };
  var ht2 = function(t2) {
    st2 || (ct2 = t2);
  };
  y2.__private__.resetCustomOutputDestination = function() {
    st2 = false, ct2 = nt2;
  };
  var lt2 = y2.__private__.out = function(t2) {
    return t2 = t2.toString(), it2 += t2.length + 1, ct2.push(t2), ct2;
  }, ft2 = y2.__private__.write = function(t2) {
    return lt2(1 === arguments.length ? t2.toString() : Array.prototype.join.call(arguments, " "));
  }, dt2 = y2.__private__.getArrayBuffer = function(t2) {
    for (var e2 = t2.length, r2 = new ArrayBuffer(e2), n2 = new Uint8Array(r2); e2--; ) n2[e2] = t2.charCodeAt(e2);
    return r2;
  }, pt2 = [["Helvetica", "helvetica", "normal", "WinAnsiEncoding"], ["Helvetica-Bold", "helvetica", "bold", "WinAnsiEncoding"], ["Helvetica-Oblique", "helvetica", "italic", "WinAnsiEncoding"], ["Helvetica-BoldOblique", "helvetica", "bolditalic", "WinAnsiEncoding"], ["Courier", "courier", "normal", "WinAnsiEncoding"], ["Courier-Bold", "courier", "bold", "WinAnsiEncoding"], ["Courier-Oblique", "courier", "italic", "WinAnsiEncoding"], ["Courier-BoldOblique", "courier", "bolditalic", "WinAnsiEncoding"], ["Times-Roman", "times", "normal", "WinAnsiEncoding"], ["Times-Bold", "times", "bold", "WinAnsiEncoding"], ["Times-Italic", "times", "italic", "WinAnsiEncoding"], ["Times-BoldItalic", "times", "bolditalic", "WinAnsiEncoding"], ["ZapfDingbats", "zapfdingbats", "normal", null], ["Symbol", "symbol", "normal", null]];
  y2.__private__.getStandardFonts = function() {
    return pt2;
  };
  var gt2 = e.fontSize || 16;
  y2.__private__.setFontSize = y2.setFontSize = function(t2) {
    return gt2 = S2 === x2.ADVANCED ? t2 / _t2 : t2, this;
  };
  var mt2, vt2 = y2.__private__.getFontSize = y2.getFontSize = function() {
    return S2 === x2.COMPAT ? gt2 : gt2 * _t2;
  }, bt2 = e.R2L || false;
  y2.__private__.setR2L = y2.setR2L = function(t2) {
    return bt2 = t2, this;
  }, y2.__private__.getR2L = y2.getR2L = function() {
    return bt2;
  };
  var yt2, wt2 = y2.__private__.setZoomMode = function(t2) {
    var e2 = [void 0, null, "fullwidth", "fullheight", "fullpage", "original"];
    if (/^(?:\d+\.\d*|\d*\.\d+|\d+)%$/.test(t2)) mt2 = t2;
    else if (isNaN(t2)) {
      if (-1 === e2.indexOf(t2)) throw new Error('zoom must be Integer (e.g. 2), a percentage Value (e.g. 300%) or fullwidth, fullheight, fullpage, original. "' + t2 + '" is not recognized.');
      mt2 = t2;
    } else mt2 = parseInt(t2, 10);
  };
  y2.__private__.getZoomMode = function() {
    return mt2;
  };
  var Nt2, Lt2 = y2.__private__.setPageMode = function(t2) {
    if (-1 == [void 0, null, "UseNone", "UseOutlines", "UseThumbs", "FullScreen"].indexOf(t2)) throw new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "' + t2 + '" is not recognized.');
    yt2 = t2;
  };
  y2.__private__.getPageMode = function() {
    return yt2;
  };
  var At2 = y2.__private__.setLayoutMode = function(t2) {
    if (-1 == [void 0, null, "continuous", "single", "twoleft", "tworight", "two"].indexOf(t2)) throw new Error('Layout mode must be one of continuous, single, twoleft, tworight. "' + t2 + '" is not recognized.');
    Nt2 = t2;
  };
  y2.__private__.getLayoutMode = function() {
    return Nt2;
  }, y2.__private__.setDisplayMode = y2.setDisplayMode = function(t2, e2, r2) {
    return wt2(t2), At2(e2), Lt2(r2), this;
  };
  var xt2 = { title: "", subject: "", author: "", keywords: "", creator: "" };
  y2.__private__.getDocumentProperty = function(t2) {
    if (-1 === Object.keys(xt2).indexOf(t2)) throw new Error("Invalid argument passed to jsPDF.getDocumentProperty");
    return xt2[t2];
  }, y2.__private__.getDocumentProperties = function() {
    return xt2;
  }, y2.__private__.setDocumentProperties = y2.setProperties = y2.setDocumentProperties = function(t2) {
    for (var e2 in xt2) xt2.hasOwnProperty(e2) && t2[e2] && (xt2[e2] = t2[e2]);
    return this;
  }, y2.__private__.setDocumentProperty = function(t2, e2) {
    if (-1 === Object.keys(xt2).indexOf(t2)) throw new Error("Invalid arguments passed to jsPDF.setDocumentProperty");
    return xt2[t2] = e2;
  };
  var St, _t2, Pt2, kt2, It2, Ft2 = {}, Ct2 = {}, jt2 = [], Ot2 = {}, Bt2 = {}, Mt2 = {}, Et2 = {}, qt2 = null, Dt2 = 0, Rt2 = [], Tt2 = new C(y2), Ut2 = e.hotfixes || [], zt2 = {}, Ht2 = {}, Wt2 = [], Vt2 = function t2(e2, r2, n2, i3, a2, o3) {
    if (!(this instanceof t2)) return new t2(e2, r2, n2, i3, a2, o3);
    isNaN(e2) && (e2 = 1), isNaN(r2) && (r2 = 0), isNaN(n2) && (n2 = 0), isNaN(i3) && (i3 = 1), isNaN(a2) && (a2 = 0), isNaN(o3) && (o3 = 0), this._matrix = [e2, r2, n2, i3, a2, o3];
  };
  Object.defineProperty(Vt2.prototype, "sx", { get: function() {
    return this._matrix[0];
  }, set: function(t2) {
    this._matrix[0] = t2;
  } }), Object.defineProperty(Vt2.prototype, "shy", { get: function() {
    return this._matrix[1];
  }, set: function(t2) {
    this._matrix[1] = t2;
  } }), Object.defineProperty(Vt2.prototype, "shx", { get: function() {
    return this._matrix[2];
  }, set: function(t2) {
    this._matrix[2] = t2;
  } }), Object.defineProperty(Vt2.prototype, "sy", { get: function() {
    return this._matrix[3];
  }, set: function(t2) {
    this._matrix[3] = t2;
  } }), Object.defineProperty(Vt2.prototype, "tx", { get: function() {
    return this._matrix[4];
  }, set: function(t2) {
    this._matrix[4] = t2;
  } }), Object.defineProperty(Vt2.prototype, "ty", { get: function() {
    return this._matrix[5];
  }, set: function(t2) {
    this._matrix[5] = t2;
  } }), Object.defineProperty(Vt2.prototype, "a", { get: function() {
    return this._matrix[0];
  }, set: function(t2) {
    this._matrix[0] = t2;
  } }), Object.defineProperty(Vt2.prototype, "b", { get: function() {
    return this._matrix[1];
  }, set: function(t2) {
    this._matrix[1] = t2;
  } }), Object.defineProperty(Vt2.prototype, "c", { get: function() {
    return this._matrix[2];
  }, set: function(t2) {
    this._matrix[2] = t2;
  } }), Object.defineProperty(Vt2.prototype, "d", { get: function() {
    return this._matrix[3];
  }, set: function(t2) {
    this._matrix[3] = t2;
  } }), Object.defineProperty(Vt2.prototype, "e", { get: function() {
    return this._matrix[4];
  }, set: function(t2) {
    this._matrix[4] = t2;
  } }), Object.defineProperty(Vt2.prototype, "f", { get: function() {
    return this._matrix[5];
  }, set: function(t2) {
    this._matrix[5] = t2;
  } }), Object.defineProperty(Vt2.prototype, "rotation", { get: function() {
    return Math.atan2(this.shx, this.sx);
  } }), Object.defineProperty(Vt2.prototype, "scaleX", { get: function() {
    return this.decompose().scale.sx;
  } }), Object.defineProperty(Vt2.prototype, "scaleY", { get: function() {
    return this.decompose().scale.sy;
  } }), Object.defineProperty(Vt2.prototype, "isIdentity", { get: function() {
    return 1 === this.sx && (0 === this.shy && (0 === this.shx && (1 === this.sy && (0 === this.tx && 0 === this.ty))));
  } }), Vt2.prototype.join = function(t2) {
    return [this.sx, this.shy, this.shx, this.sy, this.tx, this.ty].map(O2).join(t2);
  }, Vt2.prototype.multiply = function(t2) {
    var e2 = t2.sx * this.sx + t2.shy * this.shx, r2 = t2.sx * this.shy + t2.shy * this.sy, n2 = t2.shx * this.sx + t2.sy * this.shx, i3 = t2.shx * this.shy + t2.sy * this.sy, a2 = t2.tx * this.sx + t2.ty * this.shx + this.tx, o3 = t2.tx * this.shy + t2.ty * this.sy + this.ty;
    return new Vt2(e2, r2, n2, i3, a2, o3);
  }, Vt2.prototype.decompose = function() {
    var t2 = this.sx, e2 = this.shy, r2 = this.shx, n2 = this.sy, i3 = this.tx, a2 = this.ty, o3 = Math.sqrt(t2 * t2 + e2 * e2), s3 = (t2 /= o3) * r2 + (e2 /= o3) * n2;
    r2 -= t2 * s3, n2 -= e2 * s3;
    var c3 = Math.sqrt(r2 * r2 + n2 * n2);
    return s3 /= c3, t2 * (n2 /= c3) < e2 * (r2 /= c3) && (t2 = -t2, e2 = -e2, s3 = -s3, o3 = -o3), { scale: new Vt2(o3, 0, 0, c3, 0, 0), translate: new Vt2(1, 0, 0, 1, i3, a2), rotate: new Vt2(t2, e2, -e2, t2, 0, 0), skew: new Vt2(1, 0, s3, 1, 0, 0) };
  }, Vt2.prototype.toString = function(t2) {
    return this.join(" ");
  }, Vt2.prototype.inversed = function() {
    var t2 = this.sx, e2 = this.shy, r2 = this.shx, n2 = this.sy, i3 = this.tx, a2 = this.ty, o3 = 1 / (t2 * n2 - e2 * r2), s3 = n2 * o3, c3 = -e2 * o3, u3 = -r2 * o3, h2 = t2 * o3;
    return new Vt2(s3, c3, u3, h2, -s3 * i3 - u3 * a2, -c3 * i3 - h2 * a2);
  }, Vt2.prototype.applyToPoint = function(t2) {
    var e2 = t2.x * this.sx + t2.y * this.shx + this.tx, r2 = t2.x * this.shy + t2.y * this.sy + this.ty;
    return new Cr(e2, r2);
  }, Vt2.prototype.applyToRectangle = function(t2) {
    var e2 = this.applyToPoint(t2), r2 = this.applyToPoint(new Cr(t2.x + t2.w, t2.y + t2.h));
    return new jr(e2.x, e2.y, r2.x - e2.x, r2.y - e2.y);
  }, Vt2.prototype.clone = function() {
    var t2 = this.sx, e2 = this.shy, r2 = this.shx, n2 = this.sy, i3 = this.tx, a2 = this.ty;
    return new Vt2(t2, e2, r2, n2, i3, a2);
  }, y2.Matrix = Vt2;
  var Gt2 = y2.matrixMult = function(t2, e2) {
    return e2.multiply(t2);
  }, Yt2 = new Vt2(1, 0, 0, 1, 0, 0);
  y2.unitMatrix = y2.identityMatrix = Yt2;
  var Jt2 = function(t2, e2) {
    if (!Bt2[t2]) {
      var r2 = (e2 instanceof B ? "Sh" : "P") + (Object.keys(Ot2).length + 1).toString(10);
      e2.id = r2, Bt2[t2] = r2, Ot2[r2] = e2, Tt2.publish("addPattern", e2);
    }
  };
  y2.ShadingPattern = B, y2.TilingPattern = M, y2.addShadingPattern = function(t2, e2) {
    return q2("addShadingPattern()"), Jt2(t2, e2), this;
  }, y2.beginTilingPattern = function(t2) {
    q2("beginTilingPattern()"), Br(t2.boundingBox[0], t2.boundingBox[1], t2.boundingBox[2] - t2.boundingBox[0], t2.boundingBox[3] - t2.boundingBox[1], t2.matrix);
  }, y2.endTilingPattern = function(t2, e2) {
    q2("endTilingPattern()"), e2.stream = ot2[$2].join("\n"), Jt2(t2, e2), Tt2.publish("endTilingPattern", e2), Wt2.pop().restore();
  };
  var Xt2 = y2.__private__.newObject = function() {
    var t2 = Kt2();
    return Zt2(t2, true), t2;
  }, Kt2 = y2.__private__.newObjectDeferred = function() {
    return et2++, rt2[et2] = function() {
      return it2;
    }, et2;
  }, Zt2 = function(t2, e2) {
    return e2 = "boolean" == typeof e2 && e2, rt2[t2] = it2, e2 && lt2(t2 + " 0 obj"), t2;
  }, $t2 = y2.__private__.newAdditionalObject = function() {
    var t2 = { objId: Kt2(), content: "" };
    return at2.push(t2), t2;
  }, Qt2 = Kt2(), te2 = Kt2(), ee2 = y2.__private__.decodeColorString = function(t2) {
    var e2 = t2.split(" ");
    if (2 !== e2.length || "g" !== e2[1] && "G" !== e2[1]) {
      if (5 === e2.length && ("k" === e2[4] || "K" === e2[4])) {
        e2 = [(1 - e2[0]) * (1 - e2[3]), (1 - e2[1]) * (1 - e2[3]), (1 - e2[2]) * (1 - e2[3]), "r"];
      }
    } else {
      var r2 = parseFloat(e2[0]);
      e2 = [r2, r2, r2, "r"];
    }
    for (var n2 = "#", i3 = 0; i3 < 3; i3++) n2 += ("0" + Math.floor(255 * parseFloat(e2[i3])).toString(16)).slice(-2);
    return n2;
  }, re2 = y2.__private__.encodeColorString = function(e2) {
    var r2;
    "string" == typeof e2 && (e2 = { ch1: e2 });
    var n2 = e2.ch1, i3 = e2.ch2, a2 = e2.ch3, o3 = e2.ch4, s3 = "draw" === e2.pdfColorType ? ["G", "RG", "K"] : ["g", "rg", "k"];
    if ("string" == typeof n2 && "#" !== n2.charAt(0)) {
      var c3 = new f(n2);
      if (c3.ok) n2 = c3.toHex();
      else if (!/^\d*\.?\d*$/.test(n2)) throw new Error('Invalid color "' + n2 + '" passed to jsPDF.encodeColorString.');
    }
    if ("string" == typeof n2 && /^#[0-9A-Fa-f]{3}$/.test(n2) && (n2 = "#" + n2[1] + n2[1] + n2[2] + n2[2] + n2[3] + n2[3]), "string" == typeof n2 && /^#[0-9A-Fa-f]{6}$/.test(n2)) {
      var u3 = parseInt(n2.substr(1), 16);
      n2 = u3 >> 16 & 255, i3 = u3 >> 8 & 255, a2 = 255 & u3;
    }
    if (void 0 === i3 || void 0 === o3 && n2 === i3 && i3 === a2) if ("string" == typeof n2) r2 = n2 + " " + s3[0];
    else switch (e2.precision) {
      case 2:
        r2 = R2(n2 / 255) + " " + s3[0];
        break;
      case 3:
      default:
        r2 = T2(n2 / 255) + " " + s3[0];
    }
    else if (void 0 === o3 || "object" === _typeof(o3)) {
      if (o3 && !isNaN(o3.a) && 0 === o3.a) return r2 = ["1.", "1.", "1.", s3[1]].join(" ");
      if ("string" == typeof n2) r2 = [n2, i3, a2, s3[1]].join(" ");
      else switch (e2.precision) {
        case 2:
          r2 = [R2(n2 / 255), R2(i3 / 255), R2(a2 / 255), s3[1]].join(" ");
          break;
        default:
        case 3:
          r2 = [T2(n2 / 255), T2(i3 / 255), T2(a2 / 255), s3[1]].join(" ");
      }
    } else if ("string" == typeof n2) r2 = [n2, i3, a2, o3, s3[2]].join(" ");
    else switch (e2.precision) {
      case 2:
        r2 = [R2(n2), R2(i3), R2(a2), R2(o3), s3[2]].join(" ");
        break;
      case 3:
      default:
        r2 = [T2(n2), T2(i3), T2(a2), T2(o3), s3[2]].join(" ");
    }
    return r2;
  }, ne2 = y2.__private__.getFilters = function() {
    return u2;
  }, ie2 = y2.__private__.putStream = function(t2) {
    var e2 = (t2 = t2 || {}).data || "", r2 = t2.filters || ne2(), n2 = t2.alreadyAppliedFilters || [], i3 = t2.addLength1 || false, a2 = e2.length, o3 = t2.objectId, s3 = function(t3) {
      return t3;
    };
    if (null !== m2 && void 0 === o3) throw new Error("ObjectId must be passed to putStream for file encryption");
    null !== m2 && (s3 = Ye.encryptor(o3, 0));
    var c3 = {};
    true === r2 && (r2 = ["FlateEncode"]);
    var u3 = t2.additionalKeyValues || [], h2 = (c3 = void 0 !== E.API.processDataByFilters ? E.API.processDataByFilters(e2, r2) : { data: e2, reverseChain: [] }).reverseChain + (Array.isArray(n2) ? n2.join(" ") : n2.toString());
    if (0 !== c3.data.length && (u3.push({ key: "Length", value: c3.data.length }), true === i3 && u3.push({ key: "Length1", value: a2 })), 0 != h2.length) if (h2.split("/").length - 1 == 1) u3.push({ key: "Filter", value: h2 });
    else {
      u3.push({ key: "Filter", value: "[" + h2 + "]" });
      for (var l2 = 0; l2 < u3.length; l2 += 1) if ("DecodeParms" === u3[l2].key) {
        for (var f2 = [], d3 = 0; d3 < c3.reverseChain.split("/").length - 1; d3 += 1) f2.push("null");
        f2.push(u3[l2].value), u3[l2].value = "[" + f2.join(" ") + "]";
      }
    }
    lt2("<<");
    for (var p3 = 0; p3 < u3.length; p3++) lt2("/" + u3[p3].key + " " + u3[p3].value);
    lt2(">>"), 0 !== c3.data.length && (lt2("stream"), lt2(s3(c3.data)), lt2("endstream"));
  }, ae2 = y2.__private__.putPage = function(t2) {
    var e2 = t2.number, r2 = t2.data, n2 = t2.objId, i3 = t2.contentsObjId;
    Zt2(n2, true), lt2("<</Type /Page"), lt2("/Parent " + t2.rootDictionaryObjId + " 0 R"), lt2("/Resources " + t2.resourceDictionaryObjId + " 0 R"), lt2("/MediaBox [" + parseFloat(O2(t2.mediaBox.bottomLeftX)) + " " + parseFloat(O2(t2.mediaBox.bottomLeftY)) + " " + O2(t2.mediaBox.topRightX) + " " + O2(t2.mediaBox.topRightY) + "]"), null !== t2.cropBox && lt2("/CropBox [" + O2(t2.cropBox.bottomLeftX) + " " + O2(t2.cropBox.bottomLeftY) + " " + O2(t2.cropBox.topRightX) + " " + O2(t2.cropBox.topRightY) + "]"), null !== t2.bleedBox && lt2("/BleedBox [" + O2(t2.bleedBox.bottomLeftX) + " " + O2(t2.bleedBox.bottomLeftY) + " " + O2(t2.bleedBox.topRightX) + " " + O2(t2.bleedBox.topRightY) + "]"), null !== t2.trimBox && lt2("/TrimBox [" + O2(t2.trimBox.bottomLeftX) + " " + O2(t2.trimBox.bottomLeftY) + " " + O2(t2.trimBox.topRightX) + " " + O2(t2.trimBox.topRightY) + "]"), null !== t2.artBox && lt2("/ArtBox [" + O2(t2.artBox.bottomLeftX) + " " + O2(t2.artBox.bottomLeftY) + " " + O2(t2.artBox.topRightX) + " " + O2(t2.artBox.topRightY) + "]"), "number" == typeof t2.userUnit && 1 !== t2.userUnit && lt2("/UserUnit " + t2.userUnit), Tt2.publish("putPage", { objId: n2, pageContext: Rt2[e2], pageNumber: e2, page: r2 }), lt2("/Contents " + i3 + " 0 R"), lt2(">>"), lt2("endobj");
    var a2 = r2.join("\n");
    return S2 === x2.ADVANCED && (a2 += "\nQ"), Zt2(i3, true), ie2({ data: a2, filters: ne2(), objectId: i3 }), lt2("endobj"), n2;
  }, oe2 = y2.__private__.putPages = function() {
    var t2, e2, r2 = [];
    for (t2 = 1; t2 <= Dt2; t2++) Rt2[t2].objId = Kt2(), Rt2[t2].contentsObjId = Kt2();
    for (t2 = 1; t2 <= Dt2; t2++) r2.push(ae2({ number: t2, data: ot2[t2], objId: Rt2[t2].objId, contentsObjId: Rt2[t2].contentsObjId, mediaBox: Rt2[t2].mediaBox, cropBox: Rt2[t2].cropBox, bleedBox: Rt2[t2].bleedBox, trimBox: Rt2[t2].trimBox, artBox: Rt2[t2].artBox, userUnit: Rt2[t2].userUnit, rootDictionaryObjId: Qt2, resourceDictionaryObjId: te2 }));
    Zt2(Qt2, true), lt2("<</Type /Pages");
    var n2 = "/Kids [";
    for (e2 = 0; e2 < Dt2; e2++) n2 += r2[e2] + " 0 R ";
    lt2(n2 + "]"), lt2("/Count " + Dt2), lt2(">>"), lt2("endobj"), Tt2.publish("postPutPages");
  }, se2 = function(t2) {
    Tt2.publish("putFont", { font: t2, out: lt2, newObject: Xt2, putStream: ie2 }), true !== t2.isAlreadyPutted && (t2.objectNumber = Xt2(), lt2("<<"), lt2("/Type /Font"), lt2("/BaseFont /" + F(t2.postScriptName)), lt2("/Subtype /Type1"), "string" == typeof t2.encoding && lt2("/Encoding /" + t2.encoding), lt2("/FirstChar 32"), lt2("/LastChar 255"), lt2(">>"), lt2("endobj"));
  }, ce2 = function() {
    for (var t2 in Ft2) Ft2.hasOwnProperty(t2) && (false === v2 || true === v2 && b2.hasOwnProperty(t2)) && se2(Ft2[t2]);
  }, ue2 = function(t2) {
    t2.objectNumber = Xt2();
    var e2 = [];
    e2.push({ key: "Type", value: "/XObject" }), e2.push({ key: "Subtype", value: "/Form" }), e2.push({ key: "BBox", value: "[" + [O2(t2.x), O2(t2.y), O2(t2.x + t2.width), O2(t2.y + t2.height)].join(" ") + "]" }), e2.push({ key: "Matrix", value: "[" + t2.matrix.toString() + "]" });
    var r2 = t2.pages[1].join("\n");
    ie2({ data: r2, additionalKeyValues: e2, objectId: t2.objectNumber }), lt2("endobj");
  }, he2 = function() {
    for (var t2 in zt2) zt2.hasOwnProperty(t2) && ue2(zt2[t2]);
  }, le2 = function(t2, e2) {
    var r2, n2 = [], i3 = 1 / (e2 - 1);
    for (r2 = 0; r2 < 1; r2 += i3) n2.push(r2);
    if (n2.push(1), 0 != t2[0].offset) {
      var a2 = { offset: 0, color: t2[0].color };
      t2.unshift(a2);
    }
    if (1 != t2[t2.length - 1].offset) {
      var o3 = { offset: 1, color: t2[t2.length - 1].color };
      t2.push(o3);
    }
    for (var s3 = "", c3 = 0, u3 = 0; u3 < n2.length; u3++) {
      for (r2 = n2[u3]; r2 > t2[c3 + 1].offset; ) c3++;
      var h2 = t2[c3].offset, l2 = (r2 - h2) / (t2[c3 + 1].offset - h2), f2 = t2[c3].color, d3 = t2[c3 + 1].color;
      s3 += tt2(Math.round((1 - l2) * f2[0] + l2 * d3[0]).toString(16)) + tt2(Math.round((1 - l2) * f2[1] + l2 * d3[1]).toString(16)) + tt2(Math.round((1 - l2) * f2[2] + l2 * d3[2]).toString(16));
    }
    return s3.trim();
  }, fe2 = function(t2, e2) {
    e2 || (e2 = 21);
    var r2 = Xt2(), n2 = le2(t2.colors, e2), i3 = [];
    i3.push({ key: "FunctionType", value: "0" }), i3.push({ key: "Domain", value: "[0.0 1.0]" }), i3.push({ key: "Size", value: "[" + e2 + "]" }), i3.push({ key: "BitsPerSample", value: "8" }), i3.push({ key: "Range", value: "[0.0 1.0 0.0 1.0 0.0 1.0]" }), i3.push({ key: "Decode", value: "[0.0 1.0 0.0 1.0 0.0 1.0]" }), ie2({ data: n2, additionalKeyValues: i3, alreadyAppliedFilters: ["/ASCIIHexDecode"], objectId: r2 }), lt2("endobj"), t2.objectNumber = Xt2(), lt2("<< /ShadingType " + t2.type), lt2("/ColorSpace /DeviceRGB");
    var a2 = "/Coords [" + O2(parseFloat(t2.coords[0])) + " " + O2(parseFloat(t2.coords[1])) + " ";
    2 === t2.type ? a2 += O2(parseFloat(t2.coords[2])) + " " + O2(parseFloat(t2.coords[3])) : a2 += O2(parseFloat(t2.coords[2])) + " " + O2(parseFloat(t2.coords[3])) + " " + O2(parseFloat(t2.coords[4])) + " " + O2(parseFloat(t2.coords[5])), lt2(a2 += "]"), t2.matrix && lt2("/Matrix [" + t2.matrix.toString() + "]"), lt2("/Function " + r2 + " 0 R"), lt2("/Extend [true true]"), lt2(">>"), lt2("endobj");
  }, de2 = function(t2, e2) {
    var r2 = Kt2(), n2 = Xt2();
    e2.push({ resourcesOid: r2, objectOid: n2 }), t2.objectNumber = n2;
    var i3 = [];
    i3.push({ key: "Type", value: "/Pattern" }), i3.push({ key: "PatternType", value: "1" }), i3.push({ key: "PaintType", value: "1" }), i3.push({ key: "TilingType", value: "1" }), i3.push({ key: "BBox", value: "[" + t2.boundingBox.map(O2).join(" ") + "]" }), i3.push({ key: "XStep", value: O2(t2.xStep) }), i3.push({ key: "YStep", value: O2(t2.yStep) }), i3.push({ key: "Resources", value: r2 + " 0 R" }), t2.matrix && i3.push({ key: "Matrix", value: "[" + t2.matrix.toString() + "]" }), ie2({ data: t2.stream, additionalKeyValues: i3, objectId: t2.objectNumber }), lt2("endobj");
  }, pe2 = function(t2) {
    var e2;
    for (e2 in Ot2) Ot2.hasOwnProperty(e2) && (Ot2[e2] instanceof B ? fe2(Ot2[e2]) : Ot2[e2] instanceof M && de2(Ot2[e2], t2));
  }, ge2 = function(t2) {
    for (var e2 in t2.objectNumber = Xt2(), lt2("<<"), t2) switch (e2) {
      case "opacity":
        lt2("/ca " + R2(t2[e2]));
        break;
      case "stroke-opacity":
        lt2("/CA " + R2(t2[e2]));
    }
    lt2(">>"), lt2("endobj");
  }, me2 = function() {
    var t2;
    for (t2 in Mt2) Mt2.hasOwnProperty(t2) && ge2(Mt2[t2]);
  }, ve2 = function() {
    for (var t2 in lt2("/XObject <<"), zt2) zt2.hasOwnProperty(t2) && zt2[t2].objectNumber >= 0 && lt2("/" + t2 + " " + zt2[t2].objectNumber + " 0 R");
    Tt2.publish("putXobjectDict"), lt2(">>");
  }, be2 = function() {
    Ye.oid = Xt2(), lt2("<<"), lt2("/Filter /Standard"), lt2("/V " + Ye.v), lt2("/R " + Ye.r), lt2("/U <" + Ye.toHexString(Ye.U) + ">"), lt2("/O <" + Ye.toHexString(Ye.O) + ">"), lt2("/P " + Ye.P), lt2(">>"), lt2("endobj");
  }, ye2 = function() {
    for (var t2 in lt2("/Font <<"), Ft2) Ft2.hasOwnProperty(t2) && (false === v2 || true === v2 && b2.hasOwnProperty(t2)) && lt2("/" + t2 + " " + Ft2[t2].objectNumber + " 0 R");
    lt2(">>");
  }, we2 = function() {
    if (Object.keys(Ot2).length > 0) {
      for (var t2 in lt2("/Shading <<"), Ot2) Ot2.hasOwnProperty(t2) && Ot2[t2] instanceof B && Ot2[t2].objectNumber >= 0 && lt2("/" + t2 + " " + Ot2[t2].objectNumber + " 0 R");
      Tt2.publish("putShadingPatternDict"), lt2(">>");
    }
  }, Ne2 = function(t2) {
    if (Object.keys(Ot2).length > 0) {
      for (var e2 in lt2("/Pattern <<"), Ot2) Ot2.hasOwnProperty(e2) && Ot2[e2] instanceof y2.TilingPattern && Ot2[e2].objectNumber >= 0 && Ot2[e2].objectNumber < t2 && lt2("/" + e2 + " " + Ot2[e2].objectNumber + " 0 R");
      Tt2.publish("putTilingPatternDict"), lt2(">>");
    }
  }, Le2 = function() {
    if (Object.keys(Mt2).length > 0) {
      var t2;
      for (t2 in lt2("/ExtGState <<"), Mt2) Mt2.hasOwnProperty(t2) && Mt2[t2].objectNumber >= 0 && lt2("/" + t2 + " " + Mt2[t2].objectNumber + " 0 R");
      Tt2.publish("putGStateDict"), lt2(">>");
    }
  }, Ae = function(t2) {
    Zt2(t2.resourcesOid, true), lt2("<<"), lt2("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]"), ye2(), we2(), Ne2(t2.objectOid), Le2(), ve2(), lt2(">>"), lt2("endobj");
  }, xe = function() {
    var t2 = [];
    ce2(), me2(), he2(), pe2(t2), Tt2.publish("putResources"), t2.forEach(Ae), Ae({ resourcesOid: te2, objectOid: Number.MAX_SAFE_INTEGER }), Tt2.publish("postPutResources");
  }, Se = function() {
    Tt2.publish("putAdditionalObjects");
    for (var t2 = 0; t2 < at2.length; t2++) {
      var e2 = at2[t2];
      Zt2(e2.objId, true), lt2(e2.content), lt2("endobj");
    }
    Tt2.publish("postPutAdditionalObjects");
  }, _e = function(t2) {
    Ct2[t2.fontName] = Ct2[t2.fontName] || {}, Ct2[t2.fontName][t2.fontStyle] = t2.id;
  }, Pe = function(t2, e2, r2, n2, i3) {
    var a2 = { id: "F" + (Object.keys(Ft2).length + 1).toString(10), postScriptName: t2, fontName: e2, fontStyle: r2, encoding: n2, isStandardFont: i3 || false, metadata: {} };
    return Tt2.publish("addFont", { font: a2, instance: this }), Ft2[a2.id] = a2, _e(a2), a2.id;
  }, ke = function(t2) {
    for (var e2 = 0, r2 = pt2.length; e2 < r2; e2++) {
      var n2 = Pe.call(this, t2[e2][0], t2[e2][1], t2[e2][2], pt2[e2][3], true);
      false === v2 && (b2[n2] = true);
      var i3 = t2[e2][0].split("-");
      _e({ id: n2, fontName: i3[0], fontStyle: i3[1] || "" });
    }
    Tt2.publish("addFonts", { fonts: Ft2, dictionary: Ct2 });
  }, Ie = function(t2) {
    return t2.foo = function() {
      try {
        return t2.apply(this, arguments);
      } catch (t3) {
        var e2 = t3.stack || "";
        ~e2.indexOf(" at ") && (e2 = e2.split(" at ")[1]);
        var r2 = "Error in function " + e2.split("\n")[0].split("<")[0] + ": " + t3.message;
        if (!n.console) throw new Error(r2);
        n.console.error(r2, t3), n.alert && alert(r2);
      }
    }, t2.foo.bar = t2, t2.foo;
  }, Fe = function(t2, e2) {
    var r2, n2, i3, a2, o3, s3, c3, u3, h2;
    if (i3 = (e2 = e2 || {}).sourceEncoding || "Unicode", o3 = e2.outputEncoding, (e2.autoencode || o3) && Ft2[St].metadata && Ft2[St].metadata[i3] && Ft2[St].metadata[i3].encoding && (a2 = Ft2[St].metadata[i3].encoding, !o3 && Ft2[St].encoding && (o3 = Ft2[St].encoding), !o3 && a2.codePages && (o3 = a2.codePages[0]), "string" == typeof o3 && (o3 = a2[o3]), o3)) {
      for (c3 = false, s3 = [], r2 = 0, n2 = t2.length; r2 < n2; r2++) (u3 = o3[t2.charCodeAt(r2)]) ? s3.push(String.fromCharCode(u3)) : s3.push(t2[r2]), s3[r2].charCodeAt(0) >> 8 && (c3 = true);
      t2 = s3.join("");
    }
    for (r2 = t2.length; void 0 === c3 && 0 !== r2; ) t2.charCodeAt(r2 - 1) >> 8 && (c3 = true), r2--;
    if (!c3) return t2;
    for (s3 = e2.noBOM ? [] : [254, 255], r2 = 0, n2 = t2.length; r2 < n2; r2++) {
      if ((h2 = (u3 = t2.charCodeAt(r2)) >> 8) >> 8) throw new Error("Character at position " + r2 + " of string '" + t2 + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
      s3.push(h2), s3.push(u3 - (h2 << 8));
    }
    return String.fromCharCode.apply(void 0, s3);
  }, Ce = y2.__private__.pdfEscape = y2.pdfEscape = function(t2, e2) {
    return Fe(t2, e2).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  }, je = y2.__private__.beginPage = function(t2) {
    ot2[++Dt2] = [], Rt2[Dt2] = { objId: 0, contentsObjId: 0, userUnit: Number(d2), artBox: null, bleedBox: null, cropBox: null, trimBox: null, mediaBox: { bottomLeftX: 0, bottomLeftY: 0, topRightX: Number(t2[0]), topRightY: Number(t2[1]) } }, Me(Dt2), ht2(ot2[$2]);
  }, Oe = function(t2, e2) {
    var r2, n2, o3;
    switch (i2 = e2 || i2, "string" == typeof t2 && (r2 = A2(t2.toLowerCase()), Array.isArray(r2) && (n2 = r2[0], o3 = r2[1])), Array.isArray(t2) && (n2 = t2[0] * _t2, o3 = t2[1] * _t2), isNaN(n2) && (n2 = s2[0], o3 = s2[1]), (n2 > 14400 || o3 > 14400) && (a.warn("A page in a PDF can not be wider or taller than 14400 userUnit. jsPDF limits the width/height to 14400"), n2 = Math.min(14400, n2), o3 = Math.min(14400, o3)), s2 = [n2, o3], i2.substr(0, 1)) {
      case "l":
        o3 > n2 && (s2 = [o3, n2]);
        break;
      case "p":
        n2 > o3 && (s2 = [o3, n2]);
    }
    je(s2), pr(fr), lt2(Lr), 0 !== kr && lt2(kr + " J"), 0 !== Ir && lt2(Ir + " j"), Tt2.publish("addPage", { pageNumber: Dt2 });
  }, Be = function(t2) {
    t2 > 0 && t2 <= Dt2 && (ot2.splice(t2, 1), Rt2.splice(t2, 1), Dt2--, $2 > Dt2 && ($2 = Dt2), this.setPage($2));
  }, Me = function(t2) {
    t2 > 0 && t2 <= Dt2 && ($2 = t2);
  }, Ee = y2.__private__.getNumberOfPages = y2.getNumberOfPages = function() {
    return ot2.length - 1;
  }, qe = function(t2, e2, r2) {
    var n2, i3 = void 0;
    return r2 = r2 || {}, t2 = void 0 !== t2 ? t2 : Ft2[St].fontName, e2 = void 0 !== e2 ? e2 : Ft2[St].fontStyle, n2 = t2.toLowerCase(), void 0 !== Ct2[n2] && void 0 !== Ct2[n2][e2] ? i3 = Ct2[n2][e2] : void 0 !== Ct2[t2] && void 0 !== Ct2[t2][e2] ? i3 = Ct2[t2][e2] : false === r2.disableWarning && a.warn("Unable to look up font label for font '" + t2 + "', '" + e2 + "'. Refer to getFontList() for available fonts."), i3 || r2.noFallback || null == (i3 = Ct2.times[e2]) && (i3 = Ct2.times.normal), i3;
  }, De = y2.__private__.putInfo = function() {
    var t2 = Xt2(), e2 = function(t3) {
      return t3;
    };
    for (var r2 in null !== m2 && (e2 = Ye.encryptor(t2, 0)), lt2("<<"), lt2("/Producer (" + Ce(e2("jsPDF " + E.version)) + ")"), xt2) xt2.hasOwnProperty(r2) && xt2[r2] && lt2("/" + r2.substr(0, 1).toUpperCase() + r2.substr(1) + " (" + Ce(e2(xt2[r2])) + ")");
    lt2("/CreationDate (" + Ce(e2(W2)) + ")"), lt2(">>"), lt2("endobj");
  }, Re = y2.__private__.putCatalog = function(t2) {
    var e2 = (t2 = t2 || {}).rootDictionaryObjId || Qt2;
    switch (Xt2(), lt2("<<"), lt2("/Type /Catalog"), lt2("/Pages " + e2 + " 0 R"), mt2 || (mt2 = "fullwidth"), mt2) {
      case "fullwidth":
        lt2("/OpenAction [3 0 R /FitH null]");
        break;
      case "fullheight":
        lt2("/OpenAction [3 0 R /FitV null]");
        break;
      case "fullpage":
        lt2("/OpenAction [3 0 R /Fit]");
        break;
      case "original":
        lt2("/OpenAction [3 0 R /XYZ null null 1]");
        break;
      default:
        var r2 = "" + mt2;
        "%" === r2.substr(r2.length - 1) && (mt2 = parseInt(mt2) / 100), "number" == typeof mt2 && lt2("/OpenAction [3 0 R /XYZ null null " + R2(mt2) + "]");
    }
    switch (Nt2 || (Nt2 = "continuous"), Nt2) {
      case "continuous":
        lt2("/PageLayout /OneColumn");
        break;
      case "single":
        lt2("/PageLayout /SinglePage");
        break;
      case "two":
      case "twoleft":
        lt2("/PageLayout /TwoColumnLeft");
        break;
      case "tworight":
        lt2("/PageLayout /TwoColumnRight");
    }
    yt2 && lt2("/PageMode /" + yt2), Tt2.publish("putCatalog"), lt2(">>"), lt2("endobj");
  }, Te = y2.__private__.putTrailer = function() {
    lt2("trailer"), lt2("<<"), lt2("/Size " + (et2 + 1)), lt2("/Root " + et2 + " 0 R"), lt2("/Info " + (et2 - 1) + " 0 R"), null !== m2 && lt2("/Encrypt " + Ye.oid + " 0 R"), lt2("/ID [ <" + V2 + "> <" + V2 + "> ]"), lt2(">>");
  }, Ue = y2.__private__.putHeader = function() {
    lt2("%PDF-" + w2), lt2("%ºß¬à");
  }, ze = y2.__private__.putXRef = function() {
    var t2 = "0000000000";
    lt2("xref"), lt2("0 " + (et2 + 1)), lt2("0000000000 65535 f ");
    for (var e2 = 1; e2 <= et2; e2++) {
      "function" == typeof rt2[e2] ? lt2((t2 + rt2[e2]()).slice(-10) + " 00000 n ") : void 0 !== rt2[e2] ? lt2((t2 + rt2[e2]).slice(-10) + " 00000 n ") : lt2("0000000000 00000 n ");
    }
  }, He = y2.__private__.buildDocument = function() {
    ut2(), ht2(nt2), Tt2.publish("buildDocument"), Ue(), oe2(), Se(), xe(), null !== m2 && be2(), De(), Re();
    var t2 = it2;
    return ze(), Te(), lt2("startxref"), lt2("" + t2), lt2("%%EOF"), ht2(ot2[$2]), nt2.join("\n");
  }, We = y2.__private__.getBlob = function(t2) {
    return new Blob([dt2(t2)], { type: "application/pdf" });
  }, Ve = y2.output = y2.__private__.output = Ie(function(t2, e2) {
    switch ("string" == typeof (e2 = e2 || {}) ? e2 = { filename: e2 } : e2.filename = e2.filename || "generated.pdf", t2) {
      case void 0:
        return He();
      case "save":
        y2.save(e2.filename);
        break;
      case "arraybuffer":
        return dt2(He());
      case "blob":
        return We(He());
      case "bloburi":
      case "bloburl":
        if (void 0 !== n.URL && "function" == typeof n.URL.createObjectURL) return n.URL && n.URL.createObjectURL(We(He())) || void 0;
        a.warn("bloburl is not supported by your system, because URL.createObjectURL is not supported by your browser.");
        break;
      case "datauristring":
      case "dataurlstring":
        var r2 = "", i3 = He();
        try {
          r2 = h(i3);
        } catch (t3) {
          r2 = h(unescape(encodeURIComponent(i3)));
        }
        return "data:application/pdf;filename=" + e2.filename + ";base64," + r2;
      case "pdfobjectnewwindow":
        if ("[object Window]" === Object.prototype.toString.call(n)) {
          var o3 = "https://cdnjs.cloudflare.com/ajax/libs/pdfobject/2.1.1/pdfobject.min.js", s3 = ' integrity="sha512-4ze/a9/4jqu+tX9dfOqJYSvyYd5M6qum/3HpCLr+/Jqf0whc37VUbkpNGHR7/8pSnCFw47T1fmIpwBV7UySh3g==" crossorigin="anonymous"';
          e2.pdfObjectUrl && (o3 = e2.pdfObjectUrl, s3 = "");
          var c3 = '<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><script src="' + o3 + '"' + s3 + '><\/script><script >PDFObject.embed("' + this.output("dataurlstring") + '", ' + JSON.stringify(e2) + ");<\/script></body></html>", u3 = n.open();
          return null !== u3 && u3.document.write(c3), u3;
        }
        throw new Error("The option pdfobjectnewwindow just works in a browser-environment.");
      case "pdfjsnewwindow":
        if ("[object Window]" === Object.prototype.toString.call(n)) {
          var l2 = '<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><iframe id="pdfViewer" src="' + (e2.pdfJsUrl || "examples/PDF.js/web/viewer.html") + "?file=&downloadName=" + e2.filename + '" width="500px" height="400px" /></body></html>', f2 = n.open();
          if (null !== f2) {
            f2.document.write(l2);
            var d3 = this;
            f2.document.documentElement.querySelector("#pdfViewer").onload = function() {
              f2.document.title = e2.filename, f2.document.documentElement.querySelector("#pdfViewer").contentWindow.PDFViewerApplication.open(d3.output("bloburl"));
            };
          }
          return f2;
        }
        throw new Error("The option pdfjsnewwindow just works in a browser-environment.");
      case "dataurlnewwindow":
        if ("[object Window]" !== Object.prototype.toString.call(n)) throw new Error("The option dataurlnewwindow just works in a browser-environment.");
        var p3 = '<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><iframe src="' + this.output("datauristring", e2) + '"></iframe></body></html>', g3 = n.open();
        if (null !== g3 && (g3.document.write(p3), g3.document.title = e2.filename), g3 || "undefined" == typeof safari) return g3;
        break;
      case "datauri":
      case "dataurl":
        return n.document.location.href = this.output("datauristring", e2);
      default:
        return null;
    }
  }), Ge = function(t2) {
    return true === Array.isArray(Ut2) && Ut2.indexOf(t2) > -1;
  };
  switch (o2) {
    case "pt":
      _t2 = 1;
      break;
    case "mm":
      _t2 = 72 / 25.4;
      break;
    case "cm":
      _t2 = 72 / 2.54;
      break;
    case "in":
      _t2 = 72;
      break;
    case "px":
      _t2 = 1 == Ge("px_scaling") ? 0.75 : 96 / 72;
      break;
    case "pc":
    case "em":
      _t2 = 12;
      break;
    case "ex":
      _t2 = 6;
      break;
    default:
      if ("number" != typeof o2) throw new Error("Invalid unit: " + o2);
      _t2 = o2;
  }
  var Ye = null;
  K2(), Y2();
  var Je = function(t2) {
    return null !== m2 ? Ye.encryptor(t2, 0) : function(t3) {
      return t3;
    };
  }, Xe = y2.__private__.getPageInfo = y2.getPageInfo = function(t2) {
    if (isNaN(t2) || t2 % 1 != 0) throw new Error("Invalid argument passed to jsPDF.getPageInfo");
    return { objId: Rt2[t2].objId, pageNumber: t2, pageContext: Rt2[t2] };
  }, Ke = y2.__private__.getPageInfoByObjId = function(t2) {
    if (isNaN(t2) || t2 % 1 != 0) throw new Error("Invalid argument passed to jsPDF.getPageInfoByObjId");
    for (var e2 in Rt2) if (Rt2[e2].objId === t2) break;
    return Xe(e2);
  }, Ze = y2.__private__.getCurrentPageInfo = y2.getCurrentPageInfo = function() {
    return { objId: Rt2[$2].objId, pageNumber: $2, pageContext: Rt2[$2] };
  };
  y2.addPage = function() {
    return Oe.apply(this, arguments), this;
  }, y2.setPage = function() {
    return Me.apply(this, arguments), ht2.call(this, ot2[$2]), this;
  }, y2.insertPage = function(t2) {
    return this.addPage(), this.movePage($2, t2), this;
  }, y2.movePage = function(t2, e2) {
    var r2, n2;
    if (t2 > e2) {
      r2 = ot2[t2], n2 = Rt2[t2];
      for (var i3 = t2; i3 > e2; i3--) ot2[i3] = ot2[i3 - 1], Rt2[i3] = Rt2[i3 - 1];
      ot2[e2] = r2, Rt2[e2] = n2, this.setPage(e2);
    } else if (t2 < e2) {
      r2 = ot2[t2], n2 = Rt2[t2];
      for (var a2 = t2; a2 < e2; a2++) ot2[a2] = ot2[a2 + 1], Rt2[a2] = Rt2[a2 + 1];
      ot2[e2] = r2, Rt2[e2] = n2, this.setPage(e2);
    }
    return this;
  }, y2.deletePage = function() {
    return Be.apply(this, arguments), this;
  }, y2.__private__.text = y2.text = function(e2, r2, n2, i3, a2) {
    var o3, s3, c3, u3, h2, l2, f2, d3, p3, g3 = (i3 = i3 || {}).scope || this;
    if ("number" == typeof e2 && "number" == typeof r2 && ("string" == typeof n2 || Array.isArray(n2))) {
      var m3 = n2;
      n2 = r2, r2 = e2, e2 = m3;
    }
    if (arguments[3] instanceof Vt2 == false ? (c3 = arguments[4], u3 = arguments[5], "object" === _typeof(f2 = arguments[3]) && null !== f2 || ("string" == typeof c3 && (u3 = c3, c3 = null), "string" == typeof f2 && (u3 = f2, f2 = null), "number" == typeof f2 && (c3 = f2, f2 = null), i3 = { flags: f2, angle: c3, align: u3 })) : (q2("The transform parameter of text() with a Matrix value"), p3 = a2), isNaN(r2) || isNaN(n2) || null == e2) throw new Error("Invalid arguments passed to jsPDF.text");
    if (0 === e2.length) return g3;
    var v3 = "", y3 = false, w3 = "number" == typeof i3.lineHeightFactor ? i3.lineHeightFactor : lr, N3 = g3.internal.scaleFactor;
    function L3(t2) {
      return t2 = t2.split("	").join(Array(i3.TabLen || 9).join(" ")), Ce(t2, f2);
    }
    function A3(t2) {
      for (var e3, r3 = t2.concat(), n3 = [], i4 = r3.length; i4--; ) "string" == typeof (e3 = r3.shift()) ? n3.push(e3) : Array.isArray(t2) && (1 === e3.length || void 0 === e3[1] && void 0 === e3[2]) ? n3.push(e3[0]) : n3.push([e3[0], e3[1], e3[2]]);
      return n3;
    }
    function _3(t2, e3) {
      var r3;
      if ("string" == typeof t2) r3 = e3(t2)[0];
      else if (Array.isArray(t2)) {
        for (var n3, i4, a3 = t2.concat(), o4 = [], s4 = a3.length; s4--; ) "string" == typeof (n3 = a3.shift()) ? o4.push(e3(n3)[0]) : Array.isArray(n3) && "string" == typeof n3[0] && (i4 = e3(n3[0], n3[1], n3[2]), o4.push([i4[0], i4[1], i4[2]]));
        r3 = o4;
      }
      return r3;
    }
    var P3 = false, k3 = true;
    if ("string" == typeof e2) P3 = true;
    else if (Array.isArray(e2)) {
      var I2 = e2.concat();
      s3 = [];
      for (var F2, C2 = I2.length; C2--; ) ("string" != typeof (F2 = I2.shift()) || Array.isArray(F2) && "string" != typeof F2[0]) && (k3 = false);
      P3 = k3;
    }
    if (false === P3) throw new Error('Type of text must be string or Array. "' + e2 + '" is not recognized.');
    "string" == typeof e2 && (e2 = e2.match(/[\r?\n]/) ? e2.split(/\r\n|\r|\n/g) : [e2]);
    var j2 = gt2 / g3.internal.scaleFactor, B2 = j2 * (w3 - 1);
    switch (i3.baseline) {
      case "bottom":
        n2 -= B2;
        break;
      case "top":
        n2 += j2 - B2;
        break;
      case "hanging":
        n2 += j2 - 2 * B2;
        break;
      case "middle":
        n2 += j2 / 2 - B2;
    }
    if ((l2 = i3.maxWidth || 0) > 0 && ("string" == typeof e2 ? e2 = g3.splitTextToSize(e2, l2) : "[object Array]" === Object.prototype.toString.call(e2) && (e2 = e2.reduce(function(t2, e3) {
      return t2.concat(g3.splitTextToSize(e3, l2));
    }, []))), o3 = { text: e2, x: r2, y: n2, options: i3, mutex: { pdfEscape: Ce, activeFontKey: St, fonts: Ft2, activeFontSize: gt2 } }, Tt2.publish("preProcessText", o3), e2 = o3.text, c3 = (i3 = o3.options).angle, p3 instanceof Vt2 == false && c3 && "number" == typeof c3) {
      c3 *= Math.PI / 180, 0 === i3.rotationDirection && (c3 = -c3), S2 === x2.ADVANCED && (c3 = -c3);
      var M2 = Math.cos(c3), E2 = Math.sin(c3);
      p3 = new Vt2(M2, E2, -E2, M2, 0, 0);
    } else c3 && c3 instanceof Vt2 && (p3 = c3);
    S2 !== x2.ADVANCED || p3 || (p3 = Yt2), void 0 !== (h2 = i3.charSpace || _r) && (v3 += O2(U2(h2)) + " Tc\n", this.setCharSpace(this.getCharSpace() || 0)), void 0 !== (d3 = i3.horizontalScale) && (v3 += O2(100 * d3) + " Tz\n");
    i3.lang;
    var D3 = -1, R3 = void 0 !== i3.renderingMode ? i3.renderingMode : i3.stroke, T3 = g3.internal.getCurrentPageInfo().pageContext;
    switch (R3) {
      case 0:
      case false:
      case "fill":
        D3 = 0;
        break;
      case 1:
      case true:
      case "stroke":
        D3 = 1;
        break;
      case 2:
      case "fillThenStroke":
        D3 = 2;
        break;
      case 3:
      case "invisible":
        D3 = 3;
        break;
      case 4:
      case "fillAndAddForClipping":
        D3 = 4;
        break;
      case 5:
      case "strokeAndAddPathForClipping":
        D3 = 5;
        break;
      case 6:
      case "fillThenStrokeAndAddToPathForClipping":
        D3 = 6;
        break;
      case 7:
      case "addToPathForClipping":
        D3 = 7;
    }
    var z3 = void 0 !== T3.usedRenderingMode ? T3.usedRenderingMode : -1;
    -1 !== D3 ? v3 += D3 + " Tr\n" : -1 !== z3 && (v3 += "0 Tr\n"), -1 !== D3 && (T3.usedRenderingMode = D3), u3 = i3.align || "left";
    var H3, W3 = gt2 * w3, V3 = g3.internal.pageSize.getWidth(), G3 = Ft2[St];
    h2 = i3.charSpace || _r, l2 = i3.maxWidth || 0, f2 = Object.assign({ autoencode: true, noBOM: true }, i3.flags);
    var Y3 = [];
    if ("[object Array]" === Object.prototype.toString.call(e2)) {
      var J3;
      s3 = A3(e2), "left" !== u3 && (H3 = s3.map(function(t2) {
        return g3.getStringUnitWidth(t2, { font: G3, charSpace: h2, fontSize: gt2, doKerning: false }) * gt2 / N3;
      }));
      var X3, K3 = 0;
      if ("right" === u3) {
        r2 -= H3[0], e2 = [], C2 = s3.length;
        for (var Z3 = 0; Z3 < C2; Z3++) 0 === Z3 ? (X3 = br(r2), J3 = yr(n2)) : (X3 = U2(K3 - H3[Z3]), J3 = -W3), e2.push([s3[Z3], X3, J3]), K3 = H3[Z3];
      } else if ("center" === u3) {
        r2 -= H3[0] / 2, e2 = [], C2 = s3.length;
        for (var $3 = 0; $3 < C2; $3++) 0 === $3 ? (X3 = br(r2), J3 = yr(n2)) : (X3 = U2((K3 - H3[$3]) / 2), J3 = -W3), e2.push([s3[$3], X3, J3]), K3 = H3[$3];
      } else if ("left" === u3) {
        e2 = [], C2 = s3.length;
        for (var Q3 = 0; Q3 < C2; Q3++) e2.push(s3[Q3]);
      } else {
        if ("justify" !== u3) throw new Error('Unrecognized alignment option, use "left", "center", "right" or "justify".');
        e2 = [], C2 = s3.length, l2 = 0 !== l2 ? l2 : V3;
        for (var tt3 = 0; tt3 < C2; tt3++) J3 = 0 === tt3 ? yr(n2) : -W3, X3 = 0 === tt3 ? br(r2) : 0, tt3 < C2 - 1 ? Y3.push(O2(U2((l2 - H3[tt3]) / (s3[tt3].split(" ").length - 1)))) : Y3.push(0), e2.push([s3[tt3], X3, J3]);
      }
    }
    var et3 = "boolean" == typeof i3.R2L ? i3.R2L : bt2;
    true === et3 && (e2 = _3(e2, function(t2, e3, r3) {
      return [t2.split("").reverse().join(""), e3, r3];
    })), o3 = { text: e2, x: r2, y: n2, options: i3, mutex: { pdfEscape: Ce, activeFontKey: St, fonts: Ft2, activeFontSize: gt2 } }, Tt2.publish("postProcessText", o3), e2 = o3.text, y3 = o3.mutex.isHex || false;
    var rt3 = Ft2[St].encoding;
    "WinAnsiEncoding" !== rt3 && "StandardEncoding" !== rt3 || (e2 = _3(e2, function(t2, e3, r3) {
      return [L3(t2), e3, r3];
    })), s3 = A3(e2), e2 = [];
    for (var nt3, it3, at3, ot3 = 0, st3 = 1, ct3 = Array.isArray(s3[0]) ? st3 : ot3, ut3 = "", ht3 = function(t2, e3, r3) {
      var n3 = "";
      return r3 instanceof Vt2 ? (r3 = "number" == typeof i3.angle ? Gt2(r3, new Vt2(1, 0, 0, 1, t2, e3)) : Gt2(new Vt2(1, 0, 0, 1, t2, e3), r3), S2 === x2.ADVANCED && (r3 = Gt2(new Vt2(1, 0, 0, -1, 0, 0), r3)), n3 = r3.join(" ") + " Tm\n") : n3 = O2(t2) + " " + O2(e3) + " Td\n", n3;
    }, ft3 = 0; ft3 < s3.length; ft3++) {
      switch (ut3 = "", ct3) {
        case st3:
          at3 = (y3 ? "<" : "(") + s3[ft3][0] + (y3 ? ">" : ")"), nt3 = parseFloat(s3[ft3][1]), it3 = parseFloat(s3[ft3][2]);
          break;
        case ot3:
          at3 = (y3 ? "<" : "(") + s3[ft3] + (y3 ? ">" : ")"), nt3 = br(r2), it3 = yr(n2);
      }
      void 0 !== Y3 && void 0 !== Y3[ft3] && (ut3 = Y3[ft3] + " Tw\n"), 0 === ft3 ? e2.push(ut3 + ht3(nt3, it3, p3) + at3) : ct3 === ot3 ? e2.push(ut3 + at3) : ct3 === st3 && e2.push(ut3 + ht3(nt3, it3, p3) + at3);
    }
    e2 = ct3 === ot3 ? e2.join(" Tj\nT* ") : e2.join(" Tj\n"), e2 += " Tj\n";
    var dt3 = "BT\n/";
    return dt3 += St + " " + gt2 + " Tf\n", dt3 += O2(gt2 * w3) + " TL\n", dt3 += xr + "\n", dt3 += v3, dt3 += e2, lt2(dt3 += "ET"), b2[St] = true, g3;
  };
  var $e = y2.__private__.clip = y2.clip = function(t2) {
    return lt2("evenodd" === t2 ? "W*" : "W"), this;
  };
  y2.clipEvenOdd = function() {
    return $e("evenodd");
  }, y2.__private__.discardPath = y2.discardPath = function() {
    return lt2("n"), this;
  };
  var Qe = y2.__private__.isValidStyle = function(t2) {
    var e2 = false;
    return -1 !== [void 0, null, "S", "D", "F", "DF", "FD", "f", "f*", "B", "B*", "n"].indexOf(t2) && (e2 = true), e2;
  };
  y2.__private__.setDefaultPathOperation = y2.setDefaultPathOperation = function(t2) {
    return Qe(t2) && (g2 = t2), this;
  };
  var tr = y2.__private__.getStyle = y2.getStyle = function(t2) {
    var e2 = g2;
    switch (t2) {
      case "D":
      case "S":
        e2 = "S";
        break;
      case "F":
        e2 = "f";
        break;
      case "FD":
      case "DF":
        e2 = "B";
        break;
      case "f":
      case "f*":
      case "B":
      case "B*":
        e2 = t2;
    }
    return e2;
  }, er = y2.close = function() {
    return lt2("h"), this;
  };
  y2.stroke = function() {
    return lt2("S"), this;
  }, y2.fill = function(t2) {
    return rr("f", t2), this;
  }, y2.fillEvenOdd = function(t2) {
    return rr("f*", t2), this;
  }, y2.fillStroke = function(t2) {
    return rr("B", t2), this;
  }, y2.fillStrokeEvenOdd = function(t2) {
    return rr("B*", t2), this;
  };
  var rr = function(e2, r2) {
    "object" === _typeof(r2) ? ar(r2, e2) : lt2(e2);
  }, nr = function(t2) {
    null === t2 || S2 === x2.ADVANCED && void 0 === t2 || (t2 = tr(t2), lt2(t2));
  };
  function ir(t2, e2, r2, n2, i3) {
    var a2 = new M(e2 || this.boundingBox, r2 || this.xStep, n2 || this.yStep, this.gState, i3 || this.matrix);
    a2.stream = this.stream;
    var o3 = t2 + "$$" + this.cloneIndex++ + "$$";
    return Jt2(o3, a2), a2;
  }
  var ar = function(t2, e2) {
    var r2 = Bt2[t2.key], n2 = Ot2[r2];
    if (n2 instanceof B) lt2("q"), lt2(or(e2)), n2.gState && y2.setGState(n2.gState), lt2(t2.matrix.toString() + " cm"), lt2("/" + r2 + " sh"), lt2("Q");
    else if (n2 instanceof M) {
      var i3 = new Vt2(1, 0, 0, -1, 0, Rr());
      t2.matrix && (i3 = i3.multiply(t2.matrix || Yt2), r2 = ir.call(n2, t2.key, t2.boundingBox, t2.xStep, t2.yStep, i3).id), lt2("q"), lt2("/Pattern cs"), lt2("/" + r2 + " scn"), n2.gState && y2.setGState(n2.gState), lt2(e2), lt2("Q");
    }
  }, or = function(t2) {
    switch (t2) {
      case "f":
      case "F":
        return "W n";
      case "f*":
        return "W* n";
      case "B":
        return "W S";
      case "B*":
        return "W* S";
      case "S":
        return "W S";
      case "n":
        return "W n";
    }
  }, sr = y2.moveTo = function(t2, e2) {
    return lt2(O2(U2(t2)) + " " + O2(H2(e2)) + " m"), this;
  }, cr = y2.lineTo = function(t2, e2) {
    return lt2(O2(U2(t2)) + " " + O2(H2(e2)) + " l"), this;
  }, ur = y2.curveTo = function(t2, e2, r2, n2, i3, a2) {
    return lt2([O2(U2(t2)), O2(H2(e2)), O2(U2(r2)), O2(H2(n2)), O2(U2(i3)), O2(H2(a2)), "c"].join(" ")), this;
  };
  y2.__private__.line = y2.line = function(t2, e2, r2, n2, i3) {
    if (isNaN(t2) || isNaN(e2) || isNaN(r2) || isNaN(n2) || !Qe(i3)) throw new Error("Invalid arguments passed to jsPDF.line");
    return S2 === x2.COMPAT ? this.lines([[r2 - t2, n2 - e2]], t2, e2, [1, 1], i3 || "S") : this.lines([[r2 - t2, n2 - e2]], t2, e2, [1, 1]).stroke();
  }, y2.__private__.lines = y2.lines = function(t2, e2, r2, n2, i3, a2) {
    var o3, s3, c3, u3, h2, l2, f2, d3, p3, g3, m3, v3;
    if ("number" == typeof t2 && (v3 = r2, r2 = e2, e2 = t2, t2 = v3), n2 = n2 || [1, 1], a2 = a2 || false, isNaN(e2) || isNaN(r2) || !Array.isArray(t2) || !Array.isArray(n2) || !Qe(i3) || "boolean" != typeof a2) throw new Error("Invalid arguments passed to jsPDF.lines");
    for (sr(e2, r2), o3 = n2[0], s3 = n2[1], u3 = t2.length, g3 = e2, m3 = r2, c3 = 0; c3 < u3; c3++) 2 === (h2 = t2[c3]).length ? (g3 = h2[0] * o3 + g3, m3 = h2[1] * s3 + m3, cr(g3, m3)) : (l2 = h2[0] * o3 + g3, f2 = h2[1] * s3 + m3, d3 = h2[2] * o3 + g3, p3 = h2[3] * s3 + m3, g3 = h2[4] * o3 + g3, m3 = h2[5] * s3 + m3, ur(l2, f2, d3, p3, g3, m3));
    return a2 && er(), nr(i3), this;
  }, y2.path = function(t2) {
    for (var e2 = 0; e2 < t2.length; e2++) {
      var r2 = t2[e2], n2 = r2.c;
      switch (r2.op) {
        case "m":
          sr(n2[0], n2[1]);
          break;
        case "l":
          cr(n2[0], n2[1]);
          break;
        case "c":
          ur.apply(this, n2);
          break;
        case "h":
          er();
      }
    }
    return this;
  }, y2.__private__.rect = y2.rect = function(t2, e2, r2, n2, i3) {
    if (isNaN(t2) || isNaN(e2) || isNaN(r2) || isNaN(n2) || !Qe(i3)) throw new Error("Invalid arguments passed to jsPDF.rect");
    return S2 === x2.COMPAT && (n2 = -n2), lt2([O2(U2(t2)), O2(H2(e2)), O2(U2(r2)), O2(U2(n2)), "re"].join(" ")), nr(i3), this;
  }, y2.__private__.triangle = y2.triangle = function(t2, e2, r2, n2, i3, a2, o3) {
    if (isNaN(t2) || isNaN(e2) || isNaN(r2) || isNaN(n2) || isNaN(i3) || isNaN(a2) || !Qe(o3)) throw new Error("Invalid arguments passed to jsPDF.triangle");
    return this.lines([[r2 - t2, n2 - e2], [i3 - r2, a2 - n2], [t2 - i3, e2 - a2]], t2, e2, [1, 1], o3, true), this;
  }, y2.__private__.roundedRect = y2.roundedRect = function(t2, e2, r2, n2, i3, a2, o3) {
    if (isNaN(t2) || isNaN(e2) || isNaN(r2) || isNaN(n2) || isNaN(i3) || isNaN(a2) || !Qe(o3)) throw new Error("Invalid arguments passed to jsPDF.roundedRect");
    var s3 = 4 / 3 * (Math.SQRT2 - 1);
    return i3 = Math.min(i3, 0.5 * r2), a2 = Math.min(a2, 0.5 * n2), this.lines([[r2 - 2 * i3, 0], [i3 * s3, 0, i3, a2 - a2 * s3, i3, a2], [0, n2 - 2 * a2], [0, a2 * s3, -i3 * s3, a2, -i3, a2], [2 * i3 - r2, 0], [-i3 * s3, 0, -i3, -a2 * s3, -i3, -a2], [0, 2 * a2 - n2], [0, -a2 * s3, i3 * s3, -a2, i3, -a2]], t2 + i3, e2, [1, 1], o3, true), this;
  }, y2.__private__.ellipse = y2.ellipse = function(t2, e2, r2, n2, i3) {
    if (isNaN(t2) || isNaN(e2) || isNaN(r2) || isNaN(n2) || !Qe(i3)) throw new Error("Invalid arguments passed to jsPDF.ellipse");
    var a2 = 4 / 3 * (Math.SQRT2 - 1) * r2, o3 = 4 / 3 * (Math.SQRT2 - 1) * n2;
    return sr(t2 + r2, e2), ur(t2 + r2, e2 - o3, t2 + a2, e2 - n2, t2, e2 - n2), ur(t2 - a2, e2 - n2, t2 - r2, e2 - o3, t2 - r2, e2), ur(t2 - r2, e2 + o3, t2 - a2, e2 + n2, t2, e2 + n2), ur(t2 + a2, e2 + n2, t2 + r2, e2 + o3, t2 + r2, e2), nr(i3), this;
  }, y2.__private__.circle = y2.circle = function(t2, e2, r2, n2) {
    if (isNaN(t2) || isNaN(e2) || isNaN(r2) || !Qe(n2)) throw new Error("Invalid arguments passed to jsPDF.circle");
    return this.ellipse(t2, e2, r2, r2, n2);
  }, y2.setFont = function(t2, e2, r2) {
    return r2 && (e2 = k2(e2, r2)), St = qe(t2, e2, { disableWarning: false }), this;
  };
  var hr = y2.__private__.getFont = y2.getFont = function() {
    return Ft2[qe.apply(y2, arguments)];
  };
  y2.__private__.getFontList = y2.getFontList = function() {
    var t2, e2, r2 = {};
    for (t2 in Ct2) if (Ct2.hasOwnProperty(t2)) for (e2 in r2[t2] = [], Ct2[t2]) Ct2[t2].hasOwnProperty(e2) && r2[t2].push(e2);
    return r2;
  }, y2.addFont = function(t2, e2, r2, n2, i3) {
    var a2 = ["StandardEncoding", "MacRomanEncoding", "Identity-H", "WinAnsiEncoding"];
    return arguments[3] && -1 !== a2.indexOf(arguments[3]) ? i3 = arguments[3] : arguments[3] && -1 == a2.indexOf(arguments[3]) && (r2 = k2(r2, n2)), i3 = i3 || "Identity-H", Pe.call(this, t2, e2, r2, i3);
  };
  var lr, fr = e.lineWidth || 0.200025, dr = y2.__private__.getLineWidth = y2.getLineWidth = function() {
    return fr;
  }, pr = y2.__private__.setLineWidth = y2.setLineWidth = function(t2) {
    return fr = t2, lt2(O2(U2(t2)) + " w"), this;
  };
  y2.__private__.setLineDash = E.API.setLineDash = E.API.setLineDashPattern = function(t2, e2) {
    if (t2 = t2 || [], e2 = e2 || 0, isNaN(e2) || !Array.isArray(t2)) throw new Error("Invalid arguments passed to jsPDF.setLineDash");
    return t2 = t2.map(function(t3) {
      return O2(U2(t3));
    }).join(" "), e2 = O2(U2(e2)), lt2("[" + t2 + "] " + e2 + " d"), this;
  };
  var gr = y2.__private__.getLineHeight = y2.getLineHeight = function() {
    return gt2 * lr;
  };
  y2.__private__.getLineHeight = y2.getLineHeight = function() {
    return gt2 * lr;
  };
  var mr = y2.__private__.setLineHeightFactor = y2.setLineHeightFactor = function(t2) {
    return "number" == typeof (t2 = t2 || 1.15) && (lr = t2), this;
  }, vr = y2.__private__.getLineHeightFactor = y2.getLineHeightFactor = function() {
    return lr;
  };
  mr(e.lineHeight);
  var br = y2.__private__.getHorizontalCoordinate = function(t2) {
    return U2(t2);
  }, yr = y2.__private__.getVerticalCoordinate = function(t2) {
    return S2 === x2.ADVANCED ? t2 : Rt2[$2].mediaBox.topRightY - Rt2[$2].mediaBox.bottomLeftY - U2(t2);
  }, wr = y2.__private__.getHorizontalCoordinateString = y2.getHorizontalCoordinateString = function(t2) {
    return O2(br(t2));
  }, Nr = y2.__private__.getVerticalCoordinateString = y2.getVerticalCoordinateString = function(t2) {
    return O2(yr(t2));
  }, Lr = e.strokeColor || "0 G";
  y2.__private__.getStrokeColor = y2.getDrawColor = function() {
    return ee2(Lr);
  }, y2.__private__.setStrokeColor = y2.setDrawColor = function(t2, e2, r2, n2) {
    return Lr = re2({ ch1: t2, ch2: e2, ch3: r2, ch4: n2, pdfColorType: "draw", precision: 2 }), lt2(Lr), this;
  };
  var Ar = e.fillColor || "0 g";
  y2.__private__.getFillColor = y2.getFillColor = function() {
    return ee2(Ar);
  }, y2.__private__.setFillColor = y2.setFillColor = function(t2, e2, r2, n2) {
    return Ar = re2({ ch1: t2, ch2: e2, ch3: r2, ch4: n2, pdfColorType: "fill", precision: 2 }), lt2(Ar), this;
  };
  var xr = e.textColor || "0 g", Sr = y2.__private__.getTextColor = y2.getTextColor = function() {
    return ee2(xr);
  };
  y2.__private__.setTextColor = y2.setTextColor = function(t2, e2, r2, n2) {
    return xr = re2({ ch1: t2, ch2: e2, ch3: r2, ch4: n2, pdfColorType: "text", precision: 3 }), this;
  };
  var _r = e.charSpace, Pr = y2.__private__.getCharSpace = y2.getCharSpace = function() {
    return parseFloat(_r || 0);
  };
  y2.__private__.setCharSpace = y2.setCharSpace = function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.setCharSpace");
    return _r = t2, this;
  };
  var kr = 0;
  y2.CapJoinStyles = { 0: 0, butt: 0, but: 0, miter: 0, 1: 1, round: 1, rounded: 1, circle: 1, 2: 2, projecting: 2, project: 2, square: 2, bevel: 2 }, y2.__private__.setLineCap = y2.setLineCap = function(t2) {
    var e2 = y2.CapJoinStyles[t2];
    if (void 0 === e2) throw new Error("Line cap style of '" + t2 + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
    return kr = e2, lt2(e2 + " J"), this;
  };
  var Ir = 0;
  y2.__private__.setLineJoin = y2.setLineJoin = function(t2) {
    var e2 = y2.CapJoinStyles[t2];
    if (void 0 === e2) throw new Error("Line join style of '" + t2 + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
    return Ir = e2, lt2(e2 + " j"), this;
  }, y2.__private__.setLineMiterLimit = y2.__private__.setMiterLimit = y2.setLineMiterLimit = y2.setMiterLimit = function(t2) {
    if (t2 = t2 || 0, isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.setLineMiterLimit");
    return lt2(O2(U2(t2)) + " M"), this;
  }, y2.GState = j, y2.setGState = function(t2) {
    (t2 = "string" == typeof t2 ? Mt2[Et2[t2]] : Fr(null, t2)).equals(qt2) || (lt2("/" + t2.id + " gs"), qt2 = t2);
  };
  var Fr = function(t2, e2) {
    if (!t2 || !Et2[t2]) {
      var r2 = false;
      for (var n2 in Mt2) if (Mt2.hasOwnProperty(n2) && Mt2[n2].equals(e2)) {
        r2 = true;
        break;
      }
      if (r2) e2 = Mt2[n2];
      else {
        var i3 = "GS" + (Object.keys(Mt2).length + 1).toString(10);
        Mt2[i3] = e2, e2.id = i3;
      }
      return t2 && (Et2[t2] = e2.id), Tt2.publish("addGState", e2), e2;
    }
  };
  y2.addGState = function(t2, e2) {
    return Fr(t2, e2), this;
  }, y2.saveGraphicsState = function() {
    return lt2("q"), jt2.push({ key: St, size: gt2, color: xr }), this;
  }, y2.restoreGraphicsState = function() {
    lt2("Q");
    var t2 = jt2.pop();
    return St = t2.key, gt2 = t2.size, xr = t2.color, qt2 = null, this;
  }, y2.setCurrentTransformationMatrix = function(t2) {
    return lt2(t2.toString() + " cm"), this;
  }, y2.comment = function(t2) {
    return lt2("#" + t2), this;
  };
  var Cr = function(t2, e2) {
    var r2 = t2 || 0;
    Object.defineProperty(this, "x", { enumerable: true, get: function() {
      return r2;
    }, set: function(t3) {
      isNaN(t3) || (r2 = parseFloat(t3));
    } });
    var n2 = e2 || 0;
    Object.defineProperty(this, "y", { enumerable: true, get: function() {
      return n2;
    }, set: function(t3) {
      isNaN(t3) || (n2 = parseFloat(t3));
    } });
    var i3 = "pt";
    return Object.defineProperty(this, "type", { enumerable: true, get: function() {
      return i3;
    }, set: function(t3) {
      i3 = t3.toString();
    } }), this;
  }, jr = function(t2, e2, r2, n2) {
    Cr.call(this, t2, e2), this.type = "rect";
    var i3 = r2 || 0;
    Object.defineProperty(this, "w", { enumerable: true, get: function() {
      return i3;
    }, set: function(t3) {
      isNaN(t3) || (i3 = parseFloat(t3));
    } });
    var a2 = n2 || 0;
    return Object.defineProperty(this, "h", { enumerable: true, get: function() {
      return a2;
    }, set: function(t3) {
      isNaN(t3) || (a2 = parseFloat(t3));
    } }), this;
  }, Or = function() {
    this.page = Dt2, this.currentPage = $2, this.pages = ot2.slice(0), this.pagesContext = Rt2.slice(0), this.x = Pt2, this.y = kt2, this.matrix = It2, this.width = qr($2), this.height = Rr($2), this.outputDestination = ct2, this.id = "", this.objectNumber = -1;
  };
  Or.prototype.restore = function() {
    Dt2 = this.page, $2 = this.currentPage, Rt2 = this.pagesContext, ot2 = this.pages, Pt2 = this.x, kt2 = this.y, It2 = this.matrix, Dr($2, this.width), Tr($2, this.height), ct2 = this.outputDestination;
  };
  var Br = function(t2, e2, r2, n2, i3) {
    Wt2.push(new Or()), Dt2 = $2 = 0, ot2 = [], Pt2 = t2, kt2 = e2, It2 = i3, je([r2, n2]);
  }, Mr = function(t2) {
    if (Ht2[t2]) Wt2.pop().restore();
    else {
      var e2 = new Or(), r2 = "Xo" + (Object.keys(zt2).length + 1).toString(10);
      e2.id = r2, Ht2[t2] = r2, zt2[r2] = e2, Tt2.publish("addFormObject", e2), Wt2.pop().restore();
    }
  };
  for (var Er in y2.beginFormObject = function(t2, e2, r2, n2, i3) {
    return Br(t2, e2, r2, n2, i3), this;
  }, y2.endFormObject = function(t2) {
    return Mr(t2), this;
  }, y2.doFormObject = function(t2, e2) {
    var r2 = zt2[Ht2[t2]];
    return lt2("q"), lt2(e2.toString() + " cm"), lt2("/" + r2.id + " Do"), lt2("Q"), this;
  }, y2.getFormObject = function(t2) {
    var e2 = zt2[Ht2[t2]];
    return { x: e2.x, y: e2.y, width: e2.width, height: e2.height, matrix: e2.matrix };
  }, y2.save = function(t2, e2) {
    return t2 = t2 || "generated.pdf", (e2 = e2 || {}).returnPromise = e2.returnPromise || false, false === e2.returnPromise ? (l(We(He()), t2), "function" == typeof l.unload && n.setTimeout && setTimeout(l.unload, 911), this) : new Promise(function(e3, r2) {
      try {
        var i3 = l(We(He()), t2);
        "function" == typeof l.unload && n.setTimeout && setTimeout(l.unload, 911), e3(i3);
      } catch (t3) {
        r2(t3.message);
      }
    });
  }, E.API) E.API.hasOwnProperty(Er) && ("events" === Er && E.API.events.length ? function(t2, e2) {
    var r2, n2, i3;
    for (i3 = e2.length - 1; -1 !== i3; i3--) r2 = e2[i3][0], n2 = e2[i3][1], t2.subscribe.apply(t2, [r2].concat("function" == typeof n2 ? [n2] : n2));
  }(Tt2, E.API.events) : y2[Er] = E.API[Er]);
  var qr = y2.getPageWidth = function(t2) {
    return (Rt2[t2 = t2 || $2].mediaBox.topRightX - Rt2[t2].mediaBox.bottomLeftX) / _t2;
  }, Dr = y2.setPageWidth = function(t2, e2) {
    Rt2[t2].mediaBox.topRightX = e2 * _t2 + Rt2[t2].mediaBox.bottomLeftX;
  }, Rr = y2.getPageHeight = function(t2) {
    return (Rt2[t2 = t2 || $2].mediaBox.topRightY - Rt2[t2].mediaBox.bottomLeftY) / _t2;
  }, Tr = y2.setPageHeight = function(t2, e2) {
    Rt2[t2].mediaBox.topRightY = e2 * _t2 + Rt2[t2].mediaBox.bottomLeftY;
  };
  return y2.internal = { pdfEscape: Ce, getStyle: tr, getFont: hr, getFontSize: vt2, getCharSpace: Pr, getTextColor: Sr, getLineHeight: gr, getLineHeightFactor: vr, getLineWidth: dr, write: ft2, getHorizontalCoordinate: br, getVerticalCoordinate: yr, getCoordinateString: wr, getVerticalCoordinateString: Nr, collections: {}, newObject: Xt2, newAdditionalObject: $t2, newObjectDeferred: Kt2, newObjectDeferredBegin: Zt2, getFilters: ne2, putStream: ie2, events: Tt2, scaleFactor: _t2, pageSize: { getWidth: function() {
    return qr($2);
  }, setWidth: function(t2) {
    Dr($2, t2);
  }, getHeight: function() {
    return Rr($2);
  }, setHeight: function(t2) {
    Tr($2, t2);
  } }, encryptionOptions: m2, encryption: Ye, getEncryptor: Je, output: Ve, getNumberOfPages: Ee, pages: ot2, out: lt2, f2: R2, f3: T2, getPageInfo: Xe, getPageInfoByObjId: Ke, getCurrentPageInfo: Ze, getPDFVersion: N2, Point: Cr, Rectangle: jr, Matrix: Vt2, hasHotfix: Ge }, Object.defineProperty(y2.internal.pageSize, "width", { get: function() {
    return qr($2);
  }, set: function(t2) {
    Dr($2, t2);
  }, enumerable: true, configurable: true }), Object.defineProperty(y2.internal.pageSize, "height", { get: function() {
    return Rr($2);
  }, set: function(t2) {
    Tr($2, t2);
  }, enumerable: true, configurable: true }), ke.call(y2, pt2), St = "F1", Oe(s2, i2), Tt2.publish("initialized"), y2;
}
I.prototype.lsbFirstWord = function(t2) {
  return String.fromCharCode(t2 >> 0 & 255, t2 >> 8 & 255, t2 >> 16 & 255, t2 >> 24 & 255);
}, I.prototype.toHexString = function(t2) {
  return t2.split("").map(function(t3) {
    return ("0" + (255 & t3.charCodeAt(0)).toString(16)).slice(-2);
  }).join("");
}, I.prototype.hexToBytes = function(t2) {
  for (var e = [], r = 0; r < t2.length; r += 2) e.push(String.fromCharCode(parseInt(t2.substr(r, 2), 16)));
  return e.join("");
}, I.prototype.processOwnerPassword = function(t2, e) {
  return P(x(e).substr(0, 5), t2);
}, I.prototype.encryptor = function(t2, e) {
  var r = x(this.encryptionKey + String.fromCharCode(255 & t2, t2 >> 8 & 255, t2 >> 16 & 255, 255 & e, e >> 8 & 255)).substr(0, 10);
  return function(t3) {
    return P(r, t3);
  };
}, j.prototype.equals = function(e) {
  var r, n2 = "id,objectNumber,equals";
  if (!e || _typeof(e) !== _typeof(this)) return false;
  var i2 = 0;
  for (r in this) if (!(n2.indexOf(r) >= 0)) {
    if (this.hasOwnProperty(r) && !e.hasOwnProperty(r)) return false;
    if (this[r] !== e[r]) return false;
    i2++;
  }
  for (r in e) e.hasOwnProperty(r) && n2.indexOf(r) < 0 && i2--;
  return 0 === i2;
}, E.API = { events: [] }, E.version = "2.5.1";
var q = E.API, D = 1, R = function(t2) {
  return t2.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}, T = function(t2) {
  return t2.replace(/\\\\/g, "\\").replace(/\\\(/g, "(").replace(/\\\)/g, ")");
}, U = function(t2) {
  return t2.toFixed(2);
}, z = function(t2) {
  return t2.toFixed(5);
};
q.__acroform__ = {};
var H = function(t2, e) {
  t2.prototype = Object.create(e.prototype), t2.prototype.constructor = t2;
}, W = function(t2) {
  return t2 * D;
}, V = function(t2) {
  var e = new ut(), r = At.internal.getHeight(t2) || 0, n2 = At.internal.getWidth(t2) || 0;
  return e.BBox = [0, 0, Number(U(n2)), Number(U(r))], e;
}, G = q.__acroform__.setBit = function(t2, e) {
  if (t2 = t2 || 0, e = e || 0, isNaN(t2) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBit");
  return t2 |= 1 << e;
}, Y = q.__acroform__.clearBit = function(t2, e) {
  if (t2 = t2 || 0, e = e || 0, isNaN(t2) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBit");
  return t2 &= ~(1 << e);
}, J = q.__acroform__.getBit = function(t2, e) {
  if (isNaN(t2) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBit");
  return 0 == (t2 & 1 << e) ? 0 : 1;
}, X = q.__acroform__.getBitForPdf = function(t2, e) {
  if (isNaN(t2) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBitForPdf");
  return J(t2, e - 1);
}, K = q.__acroform__.setBitForPdf = function(t2, e) {
  if (isNaN(t2) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBitForPdf");
  return G(t2, e - 1);
}, Z = q.__acroform__.clearBitForPdf = function(t2, e) {
  if (isNaN(t2) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBitForPdf");
  return Y(t2, e - 1);
}, $$1 = q.__acroform__.calculateCoordinates = function(t2, e) {
  var r = e.internal.getHorizontalCoordinate, n2 = e.internal.getVerticalCoordinate, i2 = t2[0], a2 = t2[1], o2 = t2[2], s2 = t2[3], c2 = {};
  return c2.lowerLeft_X = r(i2) || 0, c2.lowerLeft_Y = n2(a2 + s2) || 0, c2.upperRight_X = r(i2 + o2) || 0, c2.upperRight_Y = n2(a2) || 0, [Number(U(c2.lowerLeft_X)), Number(U(c2.lowerLeft_Y)), Number(U(c2.upperRight_X)), Number(U(c2.upperRight_Y))];
}, Q = function(t2) {
  if (t2.appearanceStreamContent) return t2.appearanceStreamContent;
  if (t2.V || t2.DV) {
    var e = [], r = t2._V || t2.DV, n2 = tt(t2, r), i2 = t2.scope.internal.getFont(t2.fontName, t2.fontStyle).id;
    e.push("/Tx BMC"), e.push("q"), e.push("BT"), e.push(t2.scope.__private__.encodeColorString(t2.color)), e.push("/" + i2 + " " + U(n2.fontSize) + " Tf"), e.push("1 0 0 1 0 0 Tm"), e.push(n2.text), e.push("ET"), e.push("Q"), e.push("EMC");
    var a2 = V(t2);
    return a2.scope = t2.scope, a2.stream = e.join("\n"), a2;
  }
}, tt = function(t2, e) {
  var r = 0 === t2.fontSize ? t2.maxFontSize : t2.fontSize, n2 = { text: "", fontSize: "" }, i2 = (e = ")" == (e = "(" == e.substr(0, 1) ? e.substr(1) : e).substr(e.length - 1) ? e.substr(0, e.length - 1) : e).split(" ");
  i2 = t2.multiline ? i2.map(function(t3) {
    return t3.split("\n");
  }) : i2.map(function(t3) {
    return [t3];
  });
  var a2 = r, o2 = At.internal.getHeight(t2) || 0;
  o2 = o2 < 0 ? -o2 : o2;
  var s2 = At.internal.getWidth(t2) || 0;
  s2 = s2 < 0 ? -s2 : s2;
  var c2 = function(e2, r2, n3) {
    if (e2 + 1 < i2.length) {
      var a3 = r2 + " " + i2[e2 + 1][0];
      return et(a3, t2, n3).width <= s2 - 4;
    }
    return false;
  };
  a2++;
  t: for (; a2 > 0; ) {
    e = "", a2--;
    var u2, h2, l2 = et("3", t2, a2).height, f2 = t2.multiline ? o2 - a2 : (o2 - l2) / 2, d2 = f2 += 2, p2 = 0, g2 = 0, m2 = 0;
    if (a2 <= 0) {
      e = "(...) Tj\n", e += "% Width of Text: " + et(e, t2, a2 = 12).width + ", FieldWidth:" + s2 + "\n";
      break;
    }
    for (var v2 = "", b2 = 0, y2 = 0; y2 < i2.length; y2++) if (i2.hasOwnProperty(y2)) {
      var w2 = false;
      if (1 !== i2[y2].length && m2 !== i2[y2].length - 1) {
        if ((l2 + 2) * (b2 + 2) + 2 > o2) continue t;
        v2 += i2[y2][m2], w2 = true, g2 = y2, y2--;
      } else {
        v2 = " " == (v2 += i2[y2][m2] + " ").substr(v2.length - 1) ? v2.substr(0, v2.length - 1) : v2;
        var N2 = parseInt(y2), L2 = c2(N2, v2, a2), A2 = y2 >= i2.length - 1;
        if (L2 && !A2) {
          v2 += " ", m2 = 0;
          continue;
        }
        if (L2 || A2) {
          if (A2) g2 = N2;
          else if (t2.multiline && (l2 + 2) * (b2 + 2) + 2 > o2) continue t;
        } else {
          if (!t2.multiline) continue t;
          if ((l2 + 2) * (b2 + 2) + 2 > o2) continue t;
          g2 = N2;
        }
      }
      for (var x2 = "", S2 = p2; S2 <= g2; S2++) {
        var _2 = i2[S2];
        if (t2.multiline) {
          if (S2 === g2) {
            x2 += _2[m2] + " ", m2 = (m2 + 1) % _2.length;
            continue;
          }
          if (S2 === p2) {
            x2 += _2[_2.length - 1] + " ";
            continue;
          }
        }
        x2 += _2[0] + " ";
      }
      switch (x2 = " " == x2.substr(x2.length - 1) ? x2.substr(0, x2.length - 1) : x2, h2 = et(x2, t2, a2).width, t2.textAlign) {
        case "right":
          u2 = s2 - h2 - 2;
          break;
        case "center":
          u2 = (s2 - h2) / 2;
          break;
        case "left":
        default:
          u2 = 2;
      }
      e += U(u2) + " " + U(d2) + " Td\n", e += "(" + R(x2) + ") Tj\n", e += -U(u2) + " 0 Td\n", d2 = -(a2 + 2), h2 = 0, p2 = w2 ? g2 : g2 + 1, b2++, v2 = "";
    }
    break;
  }
  return n2.text = e, n2.fontSize = a2, n2;
}, et = function(t2, e, r) {
  var n2 = e.scope.internal.getFont(e.fontName, e.fontStyle), i2 = e.scope.getStringUnitWidth(t2, { font: n2, fontSize: parseFloat(r), charSpace: 0 }) * parseFloat(r);
  return { height: e.scope.getStringUnitWidth("3", { font: n2, fontSize: parseFloat(r), charSpace: 0 }) * parseFloat(r) * 1.5, width: i2 };
}, rt = { fields: [], xForms: [], acroFormDictionaryRoot: null, printedOut: false, internal: null, isInitialized: false }, nt = function(t2, e) {
  var r = { type: "reference", object: t2 };
  void 0 === e.internal.getPageInfo(t2.page).pageContext.annotations.find(function(t3) {
    return t3.type === r.type && t3.object === r.object;
  }) && e.internal.getPageInfo(t2.page).pageContext.annotations.push(r);
}, it = function(e, r) {
  for (var n2 in e) if (e.hasOwnProperty(n2)) {
    var i2 = n2, a2 = e[n2];
    r.internal.newObjectDeferredBegin(a2.objId, true), "object" === _typeof(a2) && "function" == typeof a2.putStream && a2.putStream(), delete e[i2];
  }
}, at = function(e, r) {
  if (r.scope = e, void 0 !== e.internal && (void 0 === e.internal.acroformPlugin || false === e.internal.acroformPlugin.isInitialized)) {
    if (lt.FieldNum = 0, e.internal.acroformPlugin = JSON.parse(JSON.stringify(rt)), e.internal.acroformPlugin.acroFormDictionaryRoot) throw new Error("Exception while creating AcroformDictionary");
    D = e.internal.scaleFactor, e.internal.acroformPlugin.acroFormDictionaryRoot = new ht(), e.internal.acroformPlugin.acroFormDictionaryRoot.scope = e, e.internal.acroformPlugin.acroFormDictionaryRoot._eventID = e.internal.events.subscribe("postPutResources", function() {
      !function(t2) {
        t2.internal.events.unsubscribe(t2.internal.acroformPlugin.acroFormDictionaryRoot._eventID), delete t2.internal.acroformPlugin.acroFormDictionaryRoot._eventID, t2.internal.acroformPlugin.printedOut = true;
      }(e);
    }), e.internal.events.subscribe("buildDocument", function() {
      !function(t2) {
        t2.internal.acroformPlugin.acroFormDictionaryRoot.objId = void 0;
        var e2 = t2.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
        for (var r2 in e2) if (e2.hasOwnProperty(r2)) {
          var n2 = e2[r2];
          n2.objId = void 0, n2.hasAnnotation && nt(n2, t2);
        }
      }(e);
    }), e.internal.events.subscribe("putCatalog", function() {
      !function(t2) {
        if (void 0 === t2.internal.acroformPlugin.acroFormDictionaryRoot) throw new Error("putCatalogCallback: Root missing.");
        t2.internal.write("/AcroForm " + t2.internal.acroformPlugin.acroFormDictionaryRoot.objId + " 0 R");
      }(e);
    }), e.internal.events.subscribe("postPutPages", function(r2) {
      !function(e2, r3) {
        var n2 = !e2;
        for (var i2 in e2 || (r3.internal.newObjectDeferredBegin(r3.internal.acroformPlugin.acroFormDictionaryRoot.objId, true), r3.internal.acroformPlugin.acroFormDictionaryRoot.putStream()), e2 = e2 || r3.internal.acroformPlugin.acroFormDictionaryRoot.Kids) if (e2.hasOwnProperty(i2)) {
          var a2 = e2[i2], o2 = [], s2 = a2.Rect;
          if (a2.Rect && (a2.Rect = $$1(a2.Rect, r3)), r3.internal.newObjectDeferredBegin(a2.objId, true), a2.DA = At.createDefaultAppearanceStream(a2), "object" === _typeof(a2) && "function" == typeof a2.getKeyValueListForStream && (o2 = a2.getKeyValueListForStream()), a2.Rect = s2, a2.hasAppearanceStream && !a2.appearanceStreamContent) {
            var c2 = Q(a2);
            o2.push({ key: "AP", value: "<</N " + c2 + ">>" }), r3.internal.acroformPlugin.xForms.push(c2);
          }
          if (a2.appearanceStreamContent) {
            var u2 = "";
            for (var h2 in a2.appearanceStreamContent) if (a2.appearanceStreamContent.hasOwnProperty(h2)) {
              var l2 = a2.appearanceStreamContent[h2];
              if (u2 += "/" + h2 + " ", u2 += "<<", Object.keys(l2).length >= 1 || Array.isArray(l2)) {
                for (var i2 in l2) if (l2.hasOwnProperty(i2)) {
                  var f2 = l2[i2];
                  "function" == typeof f2 && (f2 = f2.call(r3, a2)), u2 += "/" + i2 + " " + f2 + " ", r3.internal.acroformPlugin.xForms.indexOf(f2) >= 0 || r3.internal.acroformPlugin.xForms.push(f2);
                }
              } else "function" == typeof (f2 = l2) && (f2 = f2.call(r3, a2)), u2 += "/" + i2 + " " + f2, r3.internal.acroformPlugin.xForms.indexOf(f2) >= 0 || r3.internal.acroformPlugin.xForms.push(f2);
              u2 += ">>";
            }
            o2.push({ key: "AP", value: "<<\n" + u2 + ">>" });
          }
          r3.internal.putStream({ additionalKeyValues: o2, objectId: a2.objId }), r3.internal.out("endobj");
        }
        n2 && it(r3.internal.acroformPlugin.xForms, r3);
      }(r2, e);
    }), e.internal.acroformPlugin.isInitialized = true;
  }
}, ot = q.__acroform__.arrayToPdfArray = function(e, r, n2) {
  var i2 = function(t2) {
    return t2;
  };
  if (Array.isArray(e)) {
    for (var a2 = "[", o2 = 0; o2 < e.length; o2++) switch (0 !== o2 && (a2 += " "), _typeof(e[o2])) {
      case "boolean":
      case "number":
      case "object":
        a2 += e[o2].toString();
        break;
      case "string":
        "/" !== e[o2].substr(0, 1) ? (void 0 !== r && n2 && (i2 = n2.internal.getEncryptor(r)), a2 += "(" + R(i2(e[o2].toString())) + ")") : a2 += e[o2].toString();
    }
    return a2 += "]";
  }
  throw new Error("Invalid argument passed to jsPDF.__acroform__.arrayToPdfArray");
};
var st = function(t2, e, r) {
  var n2 = function(t3) {
    return t3;
  };
  return void 0 !== e && r && (n2 = r.internal.getEncryptor(e)), (t2 = t2 || "").toString(), t2 = "(" + R(n2(t2)) + ")";
}, ct = function() {
  this._objId = void 0, this._scope = void 0, Object.defineProperty(this, "objId", { get: function() {
    if (void 0 === this._objId) {
      if (void 0 === this.scope) return;
      this._objId = this.scope.internal.newObjectDeferred();
    }
    return this._objId;
  }, set: function(t2) {
    this._objId = t2;
  } }), Object.defineProperty(this, "scope", { value: this._scope, writable: true });
};
ct.prototype.toString = function() {
  return this.objId + " 0 R";
}, ct.prototype.putStream = function() {
  var t2 = this.getKeyValueListForStream();
  this.scope.internal.putStream({ data: this.stream, additionalKeyValues: t2, objectId: this.objId }), this.scope.internal.out("endobj");
}, ct.prototype.getKeyValueListForStream = function() {
  var t2 = [], e = Object.getOwnPropertyNames(this).filter(function(t3) {
    return "content" != t3 && "appearanceStreamContent" != t3 && "scope" != t3 && "objId" != t3 && "_" != t3.substring(0, 1);
  });
  for (var r in e) if (false === Object.getOwnPropertyDescriptor(this, e[r]).configurable) {
    var n2 = e[r], i2 = this[n2];
    i2 && (Array.isArray(i2) ? t2.push({ key: n2, value: ot(i2, this.objId, this.scope) }) : i2 instanceof ct ? (i2.scope = this.scope, t2.push({ key: n2, value: i2.objId + " 0 R" })) : "function" != typeof i2 && t2.push({ key: n2, value: i2 }));
  }
  return t2;
};
var ut = function() {
  ct.call(this), Object.defineProperty(this, "Type", { value: "/XObject", configurable: false, writable: true }), Object.defineProperty(this, "Subtype", { value: "/Form", configurable: false, writable: true }), Object.defineProperty(this, "FormType", { value: 1, configurable: false, writable: true });
  var t2, e = [];
  Object.defineProperty(this, "BBox", { configurable: false, get: function() {
    return e;
  }, set: function(t3) {
    e = t3;
  } }), Object.defineProperty(this, "Resources", { value: "2 0 R", configurable: false, writable: true }), Object.defineProperty(this, "stream", { enumerable: false, configurable: true, set: function(e2) {
    t2 = e2.trim();
  }, get: function() {
    return t2 || null;
  } });
};
H(ut, ct);
var ht = function() {
  ct.call(this);
  var t2, e = [];
  Object.defineProperty(this, "Kids", { enumerable: false, configurable: true, get: function() {
    return e.length > 0 ? e : void 0;
  } }), Object.defineProperty(this, "Fields", { enumerable: false, configurable: false, get: function() {
    return e;
  } }), Object.defineProperty(this, "DA", { enumerable: false, configurable: false, get: function() {
    if (t2) {
      var e2 = function(t3) {
        return t3;
      };
      return this.scope && (e2 = this.scope.internal.getEncryptor(this.objId)), "(" + R(e2(t2)) + ")";
    }
  }, set: function(e2) {
    t2 = e2;
  } });
};
H(ht, ct);
var lt = function t() {
  ct.call(this);
  var e = 4;
  Object.defineProperty(this, "F", { enumerable: false, configurable: false, get: function() {
    return e;
  }, set: function(t2) {
    if (isNaN(t2)) throw new Error('Invalid value "' + t2 + '" for attribute F supplied.');
    e = t2;
  } }), Object.defineProperty(this, "showWhenPrinted", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(e, 3));
  }, set: function(t2) {
    true === Boolean(t2) ? this.F = K(e, 3) : this.F = Z(e, 3);
  } });
  var r = 0;
  Object.defineProperty(this, "Ff", { enumerable: false, configurable: false, get: function() {
    return r;
  }, set: function(t2) {
    if (isNaN(t2)) throw new Error('Invalid value "' + t2 + '" for attribute Ff supplied.');
    r = t2;
  } });
  var n2 = [];
  Object.defineProperty(this, "Rect", { enumerable: false, configurable: false, get: function() {
    if (0 !== n2.length) return n2;
  }, set: function(t2) {
    n2 = void 0 !== t2 ? t2 : [];
  } }), Object.defineProperty(this, "x", { enumerable: true, configurable: true, get: function() {
    return !n2 || isNaN(n2[0]) ? 0 : n2[0];
  }, set: function(t2) {
    n2[0] = t2;
  } }), Object.defineProperty(this, "y", { enumerable: true, configurable: true, get: function() {
    return !n2 || isNaN(n2[1]) ? 0 : n2[1];
  }, set: function(t2) {
    n2[1] = t2;
  } }), Object.defineProperty(this, "width", { enumerable: true, configurable: true, get: function() {
    return !n2 || isNaN(n2[2]) ? 0 : n2[2];
  }, set: function(t2) {
    n2[2] = t2;
  } }), Object.defineProperty(this, "height", { enumerable: true, configurable: true, get: function() {
    return !n2 || isNaN(n2[3]) ? 0 : n2[3];
  }, set: function(t2) {
    n2[3] = t2;
  } });
  var i2 = "";
  Object.defineProperty(this, "FT", { enumerable: true, configurable: false, get: function() {
    return i2;
  }, set: function(t2) {
    switch (t2) {
      case "/Btn":
      case "/Tx":
      case "/Ch":
      case "/Sig":
        i2 = t2;
        break;
      default:
        throw new Error('Invalid value "' + t2 + '" for attribute FT supplied.');
    }
  } });
  var a2 = null;
  Object.defineProperty(this, "T", { enumerable: true, configurable: false, get: function() {
    if (!a2 || a2.length < 1) {
      if (this instanceof yt) return;
      a2 = "FieldObject" + t.FieldNum++;
    }
    var e2 = function(t2) {
      return t2;
    };
    return this.scope && (e2 = this.scope.internal.getEncryptor(this.objId)), "(" + R(e2(a2)) + ")";
  }, set: function(t2) {
    a2 = t2.toString();
  } }), Object.defineProperty(this, "fieldName", { configurable: true, enumerable: true, get: function() {
    return a2;
  }, set: function(t2) {
    a2 = t2;
  } });
  var o2 = "helvetica";
  Object.defineProperty(this, "fontName", { enumerable: true, configurable: true, get: function() {
    return o2;
  }, set: function(t2) {
    o2 = t2;
  } });
  var s2 = "normal";
  Object.defineProperty(this, "fontStyle", { enumerable: true, configurable: true, get: function() {
    return s2;
  }, set: function(t2) {
    s2 = t2;
  } });
  var c2 = 0;
  Object.defineProperty(this, "fontSize", { enumerable: true, configurable: true, get: function() {
    return c2;
  }, set: function(t2) {
    c2 = t2;
  } });
  var u2 = void 0;
  Object.defineProperty(this, "maxFontSize", { enumerable: true, configurable: true, get: function() {
    return void 0 === u2 ? 50 / D : u2;
  }, set: function(t2) {
    u2 = t2;
  } });
  var h2 = "black";
  Object.defineProperty(this, "color", { enumerable: true, configurable: true, get: function() {
    return h2;
  }, set: function(t2) {
    h2 = t2;
  } });
  var l2 = "/F1 0 Tf 0 g";
  Object.defineProperty(this, "DA", { enumerable: true, configurable: false, get: function() {
    if (!(!l2 || this instanceof yt || this instanceof Nt)) return st(l2, this.objId, this.scope);
  }, set: function(t2) {
    t2 = t2.toString(), l2 = t2;
  } });
  var f2 = null;
  Object.defineProperty(this, "DV", { enumerable: false, configurable: false, get: function() {
    if (f2) return this instanceof mt == false ? st(f2, this.objId, this.scope) : f2;
  }, set: function(t2) {
    t2 = t2.toString(), f2 = this instanceof mt == false ? "(" === t2.substr(0, 1) ? T(t2.substr(1, t2.length - 2)) : T(t2) : t2;
  } }), Object.defineProperty(this, "defaultValue", { enumerable: true, configurable: true, get: function() {
    return this instanceof mt == true ? T(f2.substr(1, f2.length - 1)) : f2;
  }, set: function(t2) {
    t2 = t2.toString(), f2 = this instanceof mt == true ? "/" + t2 : t2;
  } });
  var d2 = null;
  Object.defineProperty(this, "_V", { enumerable: false, configurable: false, get: function() {
    if (d2) return d2;
  }, set: function(t2) {
    this.V = t2;
  } }), Object.defineProperty(this, "V", { enumerable: false, configurable: false, get: function() {
    if (d2) return this instanceof mt == false ? st(d2, this.objId, this.scope) : d2;
  }, set: function(t2) {
    t2 = t2.toString(), d2 = this instanceof mt == false ? "(" === t2.substr(0, 1) ? T(t2.substr(1, t2.length - 2)) : T(t2) : t2;
  } }), Object.defineProperty(this, "value", { enumerable: true, configurable: true, get: function() {
    return this instanceof mt == true ? T(d2.substr(1, d2.length - 1)) : d2;
  }, set: function(t2) {
    t2 = t2.toString(), d2 = this instanceof mt == true ? "/" + t2 : t2;
  } }), Object.defineProperty(this, "hasAnnotation", { enumerable: true, configurable: true, get: function() {
    return this.Rect;
  } }), Object.defineProperty(this, "Type", { enumerable: true, configurable: false, get: function() {
    return this.hasAnnotation ? "/Annot" : null;
  } }), Object.defineProperty(this, "Subtype", { enumerable: true, configurable: false, get: function() {
    return this.hasAnnotation ? "/Widget" : null;
  } });
  var p2, g2 = false;
  Object.defineProperty(this, "hasAppearanceStream", { enumerable: true, configurable: true, get: function() {
    return g2;
  }, set: function(t2) {
    t2 = Boolean(t2), g2 = t2;
  } }), Object.defineProperty(this, "page", { enumerable: true, configurable: true, get: function() {
    if (p2) return p2;
  }, set: function(t2) {
    p2 = t2;
  } }), Object.defineProperty(this, "readOnly", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 1));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = K(this.Ff, 1) : this.Ff = Z(this.Ff, 1);
  } }), Object.defineProperty(this, "required", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 2));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = K(this.Ff, 2) : this.Ff = Z(this.Ff, 2);
  } }), Object.defineProperty(this, "noExport", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 3));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = K(this.Ff, 3) : this.Ff = Z(this.Ff, 3);
  } });
  var m2 = null;
  Object.defineProperty(this, "Q", { enumerable: true, configurable: false, get: function() {
    if (null !== m2) return m2;
  }, set: function(t2) {
    if (-1 === [0, 1, 2].indexOf(t2)) throw new Error('Invalid value "' + t2 + '" for attribute Q supplied.');
    m2 = t2;
  } }), Object.defineProperty(this, "textAlign", { get: function() {
    var t2;
    switch (m2) {
      case 0:
      default:
        t2 = "left";
        break;
      case 1:
        t2 = "center";
        break;
      case 2:
        t2 = "right";
    }
    return t2;
  }, configurable: true, enumerable: true, set: function(t2) {
    switch (t2) {
      case "right":
      case 2:
        m2 = 2;
        break;
      case "center":
      case 1:
        m2 = 1;
        break;
      case "left":
      case 0:
      default:
        m2 = 0;
    }
  } });
};
H(lt, ct);
var ft = function() {
  lt.call(this), this.FT = "/Ch", this.V = "()", this.fontName = "zapfdingbats";
  var t2 = 0;
  Object.defineProperty(this, "TI", { enumerable: true, configurable: false, get: function() {
    return t2;
  }, set: function(e2) {
    t2 = e2;
  } }), Object.defineProperty(this, "topIndex", { enumerable: true, configurable: true, get: function() {
    return t2;
  }, set: function(e2) {
    t2 = e2;
  } });
  var e = [];
  Object.defineProperty(this, "Opt", { enumerable: true, configurable: false, get: function() {
    return ot(e, this.objId, this.scope);
  }, set: function(t3) {
    var r, n2;
    n2 = [], "string" == typeof (r = t3) && (n2 = function(t4, e2, r2) {
      r2 || (r2 = 1);
      for (var n3, i2 = []; n3 = e2.exec(t4); ) i2.push(n3[r2]);
      return i2;
    }(r, /\((.*?)\)/g)), e = n2;
  } }), this.getOptions = function() {
    return e;
  }, this.setOptions = function(t3) {
    e = t3, this.sort && e.sort();
  }, this.addOption = function(t3) {
    t3 = (t3 = t3 || "").toString(), e.push(t3), this.sort && e.sort();
  }, this.removeOption = function(t3, r) {
    for (r = r || false, t3 = (t3 = t3 || "").toString(); -1 !== e.indexOf(t3) && (e.splice(e.indexOf(t3), 1), false !== r); ) ;
  }, Object.defineProperty(this, "combo", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 18));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = K(this.Ff, 18) : this.Ff = Z(this.Ff, 18);
  } }), Object.defineProperty(this, "edit", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 19));
  }, set: function(t3) {
    true === this.combo && (true === Boolean(t3) ? this.Ff = K(this.Ff, 19) : this.Ff = Z(this.Ff, 19));
  } }), Object.defineProperty(this, "sort", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 20));
  }, set: function(t3) {
    true === Boolean(t3) ? (this.Ff = K(this.Ff, 20), e.sort()) : this.Ff = Z(this.Ff, 20);
  } }), Object.defineProperty(this, "multiSelect", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 22));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = K(this.Ff, 22) : this.Ff = Z(this.Ff, 22);
  } }), Object.defineProperty(this, "doNotSpellCheck", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 23));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = K(this.Ff, 23) : this.Ff = Z(this.Ff, 23);
  } }), Object.defineProperty(this, "commitOnSelChange", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 27));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = K(this.Ff, 27) : this.Ff = Z(this.Ff, 27);
  } }), this.hasAppearanceStream = false;
};
H(ft, lt);
var dt = function() {
  ft.call(this), this.fontName = "helvetica", this.combo = false;
};
H(dt, ft);
var pt = function() {
  dt.call(this), this.combo = true;
};
H(pt, dt);
var gt = function() {
  pt.call(this), this.edit = true;
};
H(gt, pt);
var mt = function() {
  lt.call(this), this.FT = "/Btn", Object.defineProperty(this, "noToggleToOff", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 15));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = K(this.Ff, 15) : this.Ff = Z(this.Ff, 15);
  } }), Object.defineProperty(this, "radio", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 16));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = K(this.Ff, 16) : this.Ff = Z(this.Ff, 16);
  } }), Object.defineProperty(this, "pushButton", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 17));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = K(this.Ff, 17) : this.Ff = Z(this.Ff, 17);
  } }), Object.defineProperty(this, "radioIsUnison", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 26));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = K(this.Ff, 26) : this.Ff = Z(this.Ff, 26);
  } });
  var e, r = {};
  Object.defineProperty(this, "MK", { enumerable: false, configurable: false, get: function() {
    var t2 = function(t3) {
      return t3;
    };
    if (this.scope && (t2 = this.scope.internal.getEncryptor(this.objId)), 0 !== Object.keys(r).length) {
      var e2, n2 = [];
      for (e2 in n2.push("<<"), r) n2.push("/" + e2 + " (" + R(t2(r[e2])) + ")");
      return n2.push(">>"), n2.join("\n");
    }
  }, set: function(e2) {
    "object" === _typeof(e2) && (r = e2);
  } }), Object.defineProperty(this, "caption", { enumerable: true, configurable: true, get: function() {
    return r.CA || "";
  }, set: function(t2) {
    "string" == typeof t2 && (r.CA = t2);
  } }), Object.defineProperty(this, "AS", { enumerable: false, configurable: false, get: function() {
    return e;
  }, set: function(t2) {
    e = t2;
  } }), Object.defineProperty(this, "appearanceState", { enumerable: true, configurable: true, get: function() {
    return e.substr(1, e.length - 1);
  }, set: function(t2) {
    e = "/" + t2;
  } });
};
H(mt, lt);
var vt = function() {
  mt.call(this), this.pushButton = true;
};
H(vt, mt);
var bt = function() {
  mt.call(this), this.radio = true, this.pushButton = false;
  var t2 = [];
  Object.defineProperty(this, "Kids", { enumerable: true, configurable: false, get: function() {
    return t2;
  }, set: function(e) {
    t2 = void 0 !== e ? e : [];
  } });
};
H(bt, mt);
var yt = function() {
  var e, r;
  lt.call(this), Object.defineProperty(this, "Parent", { enumerable: false, configurable: false, get: function() {
    return e;
  }, set: function(t2) {
    e = t2;
  } }), Object.defineProperty(this, "optionName", { enumerable: false, configurable: true, get: function() {
    return r;
  }, set: function(t2) {
    r = t2;
  } });
  var n2, i2 = {};
  Object.defineProperty(this, "MK", { enumerable: false, configurable: false, get: function() {
    var t2 = function(t3) {
      return t3;
    };
    this.scope && (t2 = this.scope.internal.getEncryptor(this.objId));
    var e2, r2 = [];
    for (e2 in r2.push("<<"), i2) r2.push("/" + e2 + " (" + R(t2(i2[e2])) + ")");
    return r2.push(">>"), r2.join("\n");
  }, set: function(e2) {
    "object" === _typeof(e2) && (i2 = e2);
  } }), Object.defineProperty(this, "caption", { enumerable: true, configurable: true, get: function() {
    return i2.CA || "";
  }, set: function(t2) {
    "string" == typeof t2 && (i2.CA = t2);
  } }), Object.defineProperty(this, "AS", { enumerable: false, configurable: false, get: function() {
    return n2;
  }, set: function(t2) {
    n2 = t2;
  } }), Object.defineProperty(this, "appearanceState", { enumerable: true, configurable: true, get: function() {
    return n2.substr(1, n2.length - 1);
  }, set: function(t2) {
    n2 = "/" + t2;
  } }), this.caption = "l", this.appearanceState = "Off", this._AppearanceType = At.RadioButton.Circle, this.appearanceStreamContent = this._AppearanceType.createAppearanceStream(this.optionName);
};
H(yt, lt), bt.prototype.setAppearance = function(t2) {
  if (!("createAppearanceStream" in t2) || !("getCA" in t2)) throw new Error("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");
  for (var e in this.Kids) if (this.Kids.hasOwnProperty(e)) {
    var r = this.Kids[e];
    r.appearanceStreamContent = t2.createAppearanceStream(r.optionName), r.caption = t2.getCA();
  }
}, bt.prototype.createOption = function(t2) {
  var e = new yt();
  return e.Parent = this, e.optionName = t2, this.Kids.push(e), xt.call(this.scope, e), e;
};
var wt = function() {
  mt.call(this), this.fontName = "zapfdingbats", this.caption = "3", this.appearanceState = "On", this.value = "On", this.textAlign = "center", this.appearanceStreamContent = At.CheckBox.createAppearanceStream();
};
H(wt, mt);
var Nt = function() {
  lt.call(this), this.FT = "/Tx", Object.defineProperty(this, "multiline", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 13));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = K(this.Ff, 13) : this.Ff = Z(this.Ff, 13);
  } }), Object.defineProperty(this, "fileSelect", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 21));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = K(this.Ff, 21) : this.Ff = Z(this.Ff, 21);
  } }), Object.defineProperty(this, "doNotSpellCheck", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 23));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = K(this.Ff, 23) : this.Ff = Z(this.Ff, 23);
  } }), Object.defineProperty(this, "doNotScroll", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 24));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = K(this.Ff, 24) : this.Ff = Z(this.Ff, 24);
  } }), Object.defineProperty(this, "comb", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 25));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = K(this.Ff, 25) : this.Ff = Z(this.Ff, 25);
  } }), Object.defineProperty(this, "richText", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 26));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = K(this.Ff, 26) : this.Ff = Z(this.Ff, 26);
  } });
  var t2 = null;
  Object.defineProperty(this, "MaxLen", { enumerable: true, configurable: false, get: function() {
    return t2;
  }, set: function(e) {
    t2 = e;
  } }), Object.defineProperty(this, "maxLength", { enumerable: true, configurable: true, get: function() {
    return t2;
  }, set: function(e) {
    Number.isInteger(e) && (t2 = e);
  } }), Object.defineProperty(this, "hasAppearanceStream", { enumerable: true, configurable: true, get: function() {
    return this.V || this.DV;
  } });
};
H(Nt, lt);
var Lt = function() {
  Nt.call(this), Object.defineProperty(this, "password", { enumerable: true, configurable: true, get: function() {
    return Boolean(X(this.Ff, 14));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = K(this.Ff, 14) : this.Ff = Z(this.Ff, 14);
  } }), this.password = true;
};
H(Lt, Nt);
var At = { CheckBox: { createAppearanceStream: function() {
  return { N: { On: At.CheckBox.YesNormal }, D: { On: At.CheckBox.YesPushDown, Off: At.CheckBox.OffPushDown } };
}, YesPushDown: function(t2) {
  var e = V(t2);
  e.scope = t2.scope;
  var r = [], n2 = t2.scope.internal.getFont(t2.fontName, t2.fontStyle).id, i2 = t2.scope.__private__.encodeColorString(t2.color), a2 = tt(t2, t2.caption);
  return r.push("0.749023 g"), r.push("0 0 " + U(At.internal.getWidth(t2)) + " " + U(At.internal.getHeight(t2)) + " re"), r.push("f"), r.push("BMC"), r.push("q"), r.push("0 0 1 rg"), r.push("/" + n2 + " " + U(a2.fontSize) + " Tf " + i2), r.push("BT"), r.push(a2.text), r.push("ET"), r.push("Q"), r.push("EMC"), e.stream = r.join("\n"), e;
}, YesNormal: function(t2) {
  var e = V(t2);
  e.scope = t2.scope;
  var r = t2.scope.internal.getFont(t2.fontName, t2.fontStyle).id, n2 = t2.scope.__private__.encodeColorString(t2.color), i2 = [], a2 = At.internal.getHeight(t2), o2 = At.internal.getWidth(t2), s2 = tt(t2, t2.caption);
  return i2.push("1 g"), i2.push("0 0 " + U(o2) + " " + U(a2) + " re"), i2.push("f"), i2.push("q"), i2.push("0 0 1 rg"), i2.push("0 0 " + U(o2 - 1) + " " + U(a2 - 1) + " re"), i2.push("W"), i2.push("n"), i2.push("0 g"), i2.push("BT"), i2.push("/" + r + " " + U(s2.fontSize) + " Tf " + n2), i2.push(s2.text), i2.push("ET"), i2.push("Q"), e.stream = i2.join("\n"), e;
}, OffPushDown: function(t2) {
  var e = V(t2);
  e.scope = t2.scope;
  var r = [];
  return r.push("0.749023 g"), r.push("0 0 " + U(At.internal.getWidth(t2)) + " " + U(At.internal.getHeight(t2)) + " re"), r.push("f"), e.stream = r.join("\n"), e;
} }, RadioButton: { Circle: { createAppearanceStream: function(t2) {
  var e = { D: { Off: At.RadioButton.Circle.OffPushDown }, N: {} };
  return e.N[t2] = At.RadioButton.Circle.YesNormal, e.D[t2] = At.RadioButton.Circle.YesPushDown, e;
}, getCA: function() {
  return "l";
}, YesNormal: function(t2) {
  var e = V(t2);
  e.scope = t2.scope;
  var r = [], n2 = At.internal.getWidth(t2) <= At.internal.getHeight(t2) ? At.internal.getWidth(t2) / 4 : At.internal.getHeight(t2) / 4;
  n2 = Number((0.9 * n2).toFixed(5));
  var i2 = At.internal.Bezier_C, a2 = Number((n2 * i2).toFixed(5));
  return r.push("q"), r.push("1 0 0 1 " + z(At.internal.getWidth(t2) / 2) + " " + z(At.internal.getHeight(t2) / 2) + " cm"), r.push(n2 + " 0 m"), r.push(n2 + " " + a2 + " " + a2 + " " + n2 + " 0 " + n2 + " c"), r.push("-" + a2 + " " + n2 + " -" + n2 + " " + a2 + " -" + n2 + " 0 c"), r.push("-" + n2 + " -" + a2 + " -" + a2 + " -" + n2 + " 0 -" + n2 + " c"), r.push(a2 + " -" + n2 + " " + n2 + " -" + a2 + " " + n2 + " 0 c"), r.push("f"), r.push("Q"), e.stream = r.join("\n"), e;
}, YesPushDown: function(t2) {
  var e = V(t2);
  e.scope = t2.scope;
  var r = [], n2 = At.internal.getWidth(t2) <= At.internal.getHeight(t2) ? At.internal.getWidth(t2) / 4 : At.internal.getHeight(t2) / 4;
  n2 = Number((0.9 * n2).toFixed(5));
  var i2 = Number((2 * n2).toFixed(5)), a2 = Number((i2 * At.internal.Bezier_C).toFixed(5)), o2 = Number((n2 * At.internal.Bezier_C).toFixed(5));
  return r.push("0.749023 g"), r.push("q"), r.push("1 0 0 1 " + z(At.internal.getWidth(t2) / 2) + " " + z(At.internal.getHeight(t2) / 2) + " cm"), r.push(i2 + " 0 m"), r.push(i2 + " " + a2 + " " + a2 + " " + i2 + " 0 " + i2 + " c"), r.push("-" + a2 + " " + i2 + " -" + i2 + " " + a2 + " -" + i2 + " 0 c"), r.push("-" + i2 + " -" + a2 + " -" + a2 + " -" + i2 + " 0 -" + i2 + " c"), r.push(a2 + " -" + i2 + " " + i2 + " -" + a2 + " " + i2 + " 0 c"), r.push("f"), r.push("Q"), r.push("0 g"), r.push("q"), r.push("1 0 0 1 " + z(At.internal.getWidth(t2) / 2) + " " + z(At.internal.getHeight(t2) / 2) + " cm"), r.push(n2 + " 0 m"), r.push(n2 + " " + o2 + " " + o2 + " " + n2 + " 0 " + n2 + " c"), r.push("-" + o2 + " " + n2 + " -" + n2 + " " + o2 + " -" + n2 + " 0 c"), r.push("-" + n2 + " -" + o2 + " -" + o2 + " -" + n2 + " 0 -" + n2 + " c"), r.push(o2 + " -" + n2 + " " + n2 + " -" + o2 + " " + n2 + " 0 c"), r.push("f"), r.push("Q"), e.stream = r.join("\n"), e;
}, OffPushDown: function(t2) {
  var e = V(t2);
  e.scope = t2.scope;
  var r = [], n2 = At.internal.getWidth(t2) <= At.internal.getHeight(t2) ? At.internal.getWidth(t2) / 4 : At.internal.getHeight(t2) / 4;
  n2 = Number((0.9 * n2).toFixed(5));
  var i2 = Number((2 * n2).toFixed(5)), a2 = Number((i2 * At.internal.Bezier_C).toFixed(5));
  return r.push("0.749023 g"), r.push("q"), r.push("1 0 0 1 " + z(At.internal.getWidth(t2) / 2) + " " + z(At.internal.getHeight(t2) / 2) + " cm"), r.push(i2 + " 0 m"), r.push(i2 + " " + a2 + " " + a2 + " " + i2 + " 0 " + i2 + " c"), r.push("-" + a2 + " " + i2 + " -" + i2 + " " + a2 + " -" + i2 + " 0 c"), r.push("-" + i2 + " -" + a2 + " -" + a2 + " -" + i2 + " 0 -" + i2 + " c"), r.push(a2 + " -" + i2 + " " + i2 + " -" + a2 + " " + i2 + " 0 c"), r.push("f"), r.push("Q"), e.stream = r.join("\n"), e;
} }, Cross: { createAppearanceStream: function(t2) {
  var e = { D: { Off: At.RadioButton.Cross.OffPushDown }, N: {} };
  return e.N[t2] = At.RadioButton.Cross.YesNormal, e.D[t2] = At.RadioButton.Cross.YesPushDown, e;
}, getCA: function() {
  return "8";
}, YesNormal: function(t2) {
  var e = V(t2);
  e.scope = t2.scope;
  var r = [], n2 = At.internal.calculateCross(t2);
  return r.push("q"), r.push("1 1 " + U(At.internal.getWidth(t2) - 2) + " " + U(At.internal.getHeight(t2) - 2) + " re"), r.push("W"), r.push("n"), r.push(U(n2.x1.x) + " " + U(n2.x1.y) + " m"), r.push(U(n2.x2.x) + " " + U(n2.x2.y) + " l"), r.push(U(n2.x4.x) + " " + U(n2.x4.y) + " m"), r.push(U(n2.x3.x) + " " + U(n2.x3.y) + " l"), r.push("s"), r.push("Q"), e.stream = r.join("\n"), e;
}, YesPushDown: function(t2) {
  var e = V(t2);
  e.scope = t2.scope;
  var r = At.internal.calculateCross(t2), n2 = [];
  return n2.push("0.749023 g"), n2.push("0 0 " + U(At.internal.getWidth(t2)) + " " + U(At.internal.getHeight(t2)) + " re"), n2.push("f"), n2.push("q"), n2.push("1 1 " + U(At.internal.getWidth(t2) - 2) + " " + U(At.internal.getHeight(t2) - 2) + " re"), n2.push("W"), n2.push("n"), n2.push(U(r.x1.x) + " " + U(r.x1.y) + " m"), n2.push(U(r.x2.x) + " " + U(r.x2.y) + " l"), n2.push(U(r.x4.x) + " " + U(r.x4.y) + " m"), n2.push(U(r.x3.x) + " " + U(r.x3.y) + " l"), n2.push("s"), n2.push("Q"), e.stream = n2.join("\n"), e;
}, OffPushDown: function(t2) {
  var e = V(t2);
  e.scope = t2.scope;
  var r = [];
  return r.push("0.749023 g"), r.push("0 0 " + U(At.internal.getWidth(t2)) + " " + U(At.internal.getHeight(t2)) + " re"), r.push("f"), e.stream = r.join("\n"), e;
} } }, createDefaultAppearanceStream: function(t2) {
  var e = t2.scope.internal.getFont(t2.fontName, t2.fontStyle).id, r = t2.scope.__private__.encodeColorString(t2.color);
  return "/" + e + " " + t2.fontSize + " Tf " + r;
} };
At.internal = { Bezier_C: 0.551915024494, calculateCross: function(t2) {
  var e = At.internal.getWidth(t2), r = At.internal.getHeight(t2), n2 = Math.min(e, r);
  return { x1: { x: (e - n2) / 2, y: (r - n2) / 2 + n2 }, x2: { x: (e - n2) / 2 + n2, y: (r - n2) / 2 }, x3: { x: (e - n2) / 2, y: (r - n2) / 2 }, x4: { x: (e - n2) / 2 + n2, y: (r - n2) / 2 + n2 } };
} }, At.internal.getWidth = function(e) {
  var r = 0;
  return "object" === _typeof(e) && (r = W(e.Rect[2])), r;
}, At.internal.getHeight = function(e) {
  var r = 0;
  return "object" === _typeof(e) && (r = W(e.Rect[3])), r;
};
var xt = q.addField = function(t2) {
  if (at(this, t2), !(t2 instanceof lt)) throw new Error("Invalid argument passed to jsPDF.addField.");
  var e;
  return (e = t2).scope.internal.acroformPlugin.printedOut && (e.scope.internal.acroformPlugin.printedOut = false, e.scope.internal.acroformPlugin.acroFormDictionaryRoot = null), e.scope.internal.acroformPlugin.acroFormDictionaryRoot.Fields.push(e), t2.page = t2.scope.internal.getCurrentPageInfo().pageNumber, this;
};
q.AcroFormChoiceField = ft, q.AcroFormListBox = dt, q.AcroFormComboBox = pt, q.AcroFormEditBox = gt, q.AcroFormButton = mt, q.AcroFormPushButton = vt, q.AcroFormRadioButton = bt, q.AcroFormCheckBox = wt, q.AcroFormTextField = Nt, q.AcroFormPasswordField = Lt, q.AcroFormAppearance = At, q.AcroForm = { ChoiceField: ft, ListBox: dt, ComboBox: pt, EditBox: gt, Button: mt, PushButton: vt, RadioButton: bt, CheckBox: wt, TextField: Nt, PasswordField: Lt, Appearance: At }, E.AcroForm = { ChoiceField: ft, ListBox: dt, ComboBox: pt, EditBox: gt, Button: mt, PushButton: vt, RadioButton: bt, CheckBox: wt, TextField: Nt, PasswordField: Lt, Appearance: At };
function _t(t2) {
  return t2.reduce(function(t3, e, r) {
    return t3[e] = r, t3;
  }, {});
}
!function(e) {
  e.__addimage__ = {};
  var r = "UNKNOWN", n2 = { PNG: [[137, 80, 78, 71]], TIFF: [[77, 77, 0, 42], [73, 73, 42, 0]], JPEG: [[255, 216, 255, 224, void 0, void 0, 74, 70, 73, 70, 0], [255, 216, 255, 225, void 0, void 0, 69, 120, 105, 102, 0, 0], [255, 216, 255, 219], [255, 216, 255, 238]], JPEG2000: [[0, 0, 0, 12, 106, 80, 32, 32]], GIF87a: [[71, 73, 70, 56, 55, 97]], GIF89a: [[71, 73, 70, 56, 57, 97]], WEBP: [[82, 73, 70, 70, void 0, void 0, void 0, void 0, 87, 69, 66, 80]], BMP: [[66, 77], [66, 65], [67, 73], [67, 80], [73, 67], [80, 84]] }, i2 = e.__addimage__.getImageFileTypeByImageData = function(t2, e2) {
    var i3, a3, o3, s3, c3, u2 = r;
    if ("RGBA" === (e2 = e2 || r) || void 0 !== t2.data && t2.data instanceof Uint8ClampedArray && "height" in t2 && "width" in t2) return "RGBA";
    if (x2(t2)) for (c3 in n2) for (o3 = n2[c3], i3 = 0; i3 < o3.length; i3 += 1) {
      for (s3 = true, a3 = 0; a3 < o3[i3].length; a3 += 1) if (void 0 !== o3[i3][a3] && o3[i3][a3] !== t2[a3]) {
        s3 = false;
        break;
      }
      if (true === s3) {
        u2 = c3;
        break;
      }
    }
    else for (c3 in n2) for (o3 = n2[c3], i3 = 0; i3 < o3.length; i3 += 1) {
      for (s3 = true, a3 = 0; a3 < o3[i3].length; a3 += 1) if (void 0 !== o3[i3][a3] && o3[i3][a3] !== t2.charCodeAt(a3)) {
        s3 = false;
        break;
      }
      if (true === s3) {
        u2 = c3;
        break;
      }
    }
    return u2 === r && e2 !== r && (u2 = e2), u2;
  }, a2 = function t2(e2) {
    for (var r2 = this.internal.write, n3 = this.internal.putStream, i3 = (0, this.internal.getFilters)(); -1 !== i3.indexOf("FlateEncode"); ) i3.splice(i3.indexOf("FlateEncode"), 1);
    e2.objectId = this.internal.newObject();
    var a3 = [];
    if (a3.push({ key: "Type", value: "/XObject" }), a3.push({ key: "Subtype", value: "/Image" }), a3.push({ key: "Width", value: e2.width }), a3.push({ key: "Height", value: e2.height }), e2.colorSpace === b2.INDEXED ? a3.push({ key: "ColorSpace", value: "[/Indexed /DeviceRGB " + (e2.palette.length / 3 - 1) + " " + ("sMask" in e2 && void 0 !== e2.sMask ? e2.objectId + 2 : e2.objectId + 1) + " 0 R]" }) : (a3.push({ key: "ColorSpace", value: "/" + e2.colorSpace }), e2.colorSpace === b2.DEVICE_CMYK && a3.push({ key: "Decode", value: "[1 0 1 0 1 0 1 0]" })), a3.push({ key: "BitsPerComponent", value: e2.bitsPerComponent }), "decodeParameters" in e2 && void 0 !== e2.decodeParameters && a3.push({ key: "DecodeParms", value: "<<" + e2.decodeParameters + ">>" }), "transparency" in e2 && Array.isArray(e2.transparency)) {
      for (var o3 = "", s3 = 0, c3 = e2.transparency.length; s3 < c3; s3++) o3 += e2.transparency[s3] + " " + e2.transparency[s3] + " ";
      a3.push({ key: "Mask", value: "[" + o3 + "]" });
    }
    void 0 !== e2.sMask && a3.push({ key: "SMask", value: e2.objectId + 1 + " 0 R" });
    var u2 = void 0 !== e2.filter ? ["/" + e2.filter] : void 0;
    if (n3({ data: e2.data, additionalKeyValues: a3, alreadyAppliedFilters: u2, objectId: e2.objectId }), r2("endobj"), "sMask" in e2 && void 0 !== e2.sMask) {
      var h3 = "/Predictor " + e2.predictor + " /Colors 1 /BitsPerComponent " + e2.bitsPerComponent + " /Columns " + e2.width, l3 = { width: e2.width, height: e2.height, colorSpace: "DeviceGray", bitsPerComponent: e2.bitsPerComponent, decodeParameters: h3, data: e2.sMask };
      "filter" in e2 && (l3.filter = e2.filter), t2.call(this, l3);
    }
    if (e2.colorSpace === b2.INDEXED) {
      var f3 = this.internal.newObject();
      n3({ data: _2(new Uint8Array(e2.palette)), objectId: f3 }), r2("endobj");
    }
  }, o2 = function() {
    var t2 = this.internal.collections.addImage_images;
    for (var e2 in t2) a2.call(this, t2[e2]);
  }, s2 = function() {
    var t2, e2 = this.internal.collections.addImage_images, r2 = this.internal.write;
    for (var n3 in e2) r2("/I" + (t2 = e2[n3]).index, t2.objectId, "0", "R");
  }, c2 = function() {
    this.internal.collections.addImage_images || (this.internal.collections.addImage_images = {}, this.internal.events.subscribe("putResources", o2), this.internal.events.subscribe("putXobjectDict", s2));
  }, h2 = function() {
    var t2 = this.internal.collections.addImage_images;
    return c2.call(this), t2;
  }, l2 = function() {
    return Object.keys(this.internal.collections.addImage_images).length;
  }, f2 = function(t2) {
    return "function" == typeof e["process" + t2.toUpperCase()];
  }, d2 = function(e2) {
    return "object" === _typeof(e2) && 1 === e2.nodeType;
  }, p2 = function(t2, r2) {
    if ("IMG" === t2.nodeName && t2.hasAttribute("src")) {
      var n3 = "" + t2.getAttribute("src");
      if (0 === n3.indexOf("data:image/")) return u(unescape(n3).split("base64,").pop());
      var i3 = e.loadFile(n3, true);
      if (void 0 !== i3) return i3;
    }
    if ("CANVAS" === t2.nodeName) {
      if (0 === t2.width || 0 === t2.height) throw new Error("Given canvas must have data. Canvas width: " + t2.width + ", height: " + t2.height);
      var a3;
      switch (r2) {
        case "PNG":
          a3 = "image/png";
          break;
        case "WEBP":
          a3 = "image/webp";
          break;
        case "JPEG":
        case "JPG":
        default:
          a3 = "image/jpeg";
      }
      return u(t2.toDataURL(a3, 1).split("base64,").pop());
    }
  }, g2 = function(t2) {
    var e2 = this.internal.collections.addImage_images;
    if (e2) {
      for (var r2 in e2) if (t2 === e2[r2].alias) return e2[r2];
    }
  }, m2 = function(t2, e2, r2) {
    return t2 || e2 || (t2 = -96, e2 = -96), t2 < 0 && (t2 = -1 * r2.width * 72 / t2 / this.internal.scaleFactor), e2 < 0 && (e2 = -1 * r2.height * 72 / e2 / this.internal.scaleFactor), 0 === t2 && (t2 = e2 * r2.width / r2.height), 0 === e2 && (e2 = t2 * r2.height / r2.width), [t2, e2];
  }, v2 = function(t2, e2, r2, n3, i3, a3) {
    var o3 = m2.call(this, r2, n3, i3), s3 = this.internal.getCoordinateString, c3 = this.internal.getVerticalCoordinateString, u2 = h2.call(this);
    if (r2 = o3[0], n3 = o3[1], u2[i3.index] = i3, a3) {
      a3 *= Math.PI / 180;
      var l3 = Math.cos(a3), f3 = Math.sin(a3), d3 = function(t3) {
        return t3.toFixed(4);
      }, p3 = [d3(l3), d3(f3), d3(-1 * f3), d3(l3), 0, 0, "cm"];
    }
    this.internal.write("q"), a3 ? (this.internal.write([1, "0", "0", 1, s3(t2), c3(e2 + n3), "cm"].join(" ")), this.internal.write(p3.join(" ")), this.internal.write([s3(r2), "0", "0", s3(n3), "0", "0", "cm"].join(" "))) : this.internal.write([s3(r2), "0", "0", s3(n3), s3(t2), c3(e2 + n3), "cm"].join(" ")), this.isAdvancedAPI() && this.internal.write([1, 0, 0, -1, 0, 0, "cm"].join(" ")), this.internal.write("/I" + i3.index + " Do"), this.internal.write("Q");
  }, b2 = e.color_spaces = { DEVICE_RGB: "DeviceRGB", DEVICE_GRAY: "DeviceGray", DEVICE_CMYK: "DeviceCMYK", CAL_GREY: "CalGray", CAL_RGB: "CalRGB", LAB: "Lab", ICC_BASED: "ICCBased", INDEXED: "Indexed", PATTERN: "Pattern", SEPARATION: "Separation", DEVICE_N: "DeviceN" };
  e.decode = { DCT_DECODE: "DCTDecode", FLATE_DECODE: "FlateDecode", LZW_DECODE: "LZWDecode", JPX_DECODE: "JPXDecode", JBIG2_DECODE: "JBIG2Decode", ASCII85_DECODE: "ASCII85Decode", ASCII_HEX_DECODE: "ASCIIHexDecode", RUN_LENGTH_DECODE: "RunLengthDecode", CCITT_FAX_DECODE: "CCITTFaxDecode" };
  var y2 = e.image_compression = { NONE: "NONE", FAST: "FAST", MEDIUM: "MEDIUM", SLOW: "SLOW" }, w2 = e.__addimage__.sHashCode = function(t2) {
    var e2, r2, n3 = 0;
    if ("string" == typeof t2) for (r2 = t2.length, e2 = 0; e2 < r2; e2++) n3 = (n3 << 5) - n3 + t2.charCodeAt(e2), n3 |= 0;
    else if (x2(t2)) for (r2 = t2.byteLength / 2, e2 = 0; e2 < r2; e2++) n3 = (n3 << 5) - n3 + t2[e2], n3 |= 0;
    return n3;
  }, N2 = e.__addimage__.validateStringAsBase64 = function(t2) {
    (t2 = t2 || "").toString().trim();
    var e2 = true;
    return 0 === t2.length && (e2 = false), t2.length % 4 != 0 && (e2 = false), false === /^[A-Za-z0-9+/]+$/.test(t2.substr(0, t2.length - 2)) && (e2 = false), false === /^[A-Za-z0-9/][A-Za-z0-9+/]|[A-Za-z0-9+/]=|==$/.test(t2.substr(-2)) && (e2 = false), e2;
  }, L2 = e.__addimage__.extractImageFromDataUrl = function(t2) {
    var e2 = (t2 = t2 || "").split("base64,"), r2 = null;
    if (2 === e2.length) {
      var n3 = /^data:(\w*\/\w*);*(charset=(?!charset=)[\w=-]*)*;*$/.exec(e2[0]);
      Array.isArray(n3) && (r2 = { mimeType: n3[1], charset: n3[2], data: e2[1] });
    }
    return r2;
  }, A2 = e.__addimage__.supportsArrayBuffer = function() {
    return "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array;
  };
  e.__addimage__.isArrayBuffer = function(t2) {
    return A2() && t2 instanceof ArrayBuffer;
  };
  var x2 = e.__addimage__.isArrayBufferView = function(t2) {
    return A2() && "undefined" != typeof Uint32Array && (t2 instanceof Int8Array || t2 instanceof Uint8Array || "undefined" != typeof Uint8ClampedArray && t2 instanceof Uint8ClampedArray || t2 instanceof Int16Array || t2 instanceof Uint16Array || t2 instanceof Int32Array || t2 instanceof Uint32Array || t2 instanceof Float32Array || t2 instanceof Float64Array);
  }, S2 = e.__addimage__.binaryStringToUint8Array = function(t2) {
    for (var e2 = t2.length, r2 = new Uint8Array(e2), n3 = 0; n3 < e2; n3++) r2[n3] = t2.charCodeAt(n3);
    return r2;
  }, _2 = e.__addimage__.arrayBufferToBinaryString = function(t2) {
    for (var e2 = "", r2 = x2(t2) ? t2 : new Uint8Array(t2), n3 = 0; n3 < r2.length; n3 += 8192) e2 += String.fromCharCode.apply(null, r2.subarray(n3, n3 + 8192));
    return e2;
  };
  e.addImage = function() {
    var e2, n3, i3, a3, o3, s3, u2, h3, l3;
    if ("number" == typeof arguments[1] ? (n3 = r, i3 = arguments[1], a3 = arguments[2], o3 = arguments[3], s3 = arguments[4], u2 = arguments[5], h3 = arguments[6], l3 = arguments[7]) : (n3 = arguments[1], i3 = arguments[2], a3 = arguments[3], o3 = arguments[4], s3 = arguments[5], u2 = arguments[6], h3 = arguments[7], l3 = arguments[8]), "object" === _typeof(e2 = arguments[0]) && !d2(e2) && "imageData" in e2) {
      var f3 = e2;
      e2 = f3.imageData, n3 = f3.format || n3 || r, i3 = f3.x || i3 || 0, a3 = f3.y || a3 || 0, o3 = f3.w || f3.width || o3, s3 = f3.h || f3.height || s3, u2 = f3.alias || u2, h3 = f3.compression || h3, l3 = f3.rotation || f3.angle || l3;
    }
    var p3 = this.internal.getFilters();
    if (void 0 === h3 && -1 !== p3.indexOf("FlateEncode") && (h3 = "SLOW"), isNaN(i3) || isNaN(a3)) throw new Error("Invalid coordinates passed to jsPDF.addImage");
    c2.call(this);
    var g3 = P2.call(this, e2, n3, u2, h3);
    return v2.call(this, i3, a3, o3, s3, g3, l3), this;
  };
  var P2 = function(t2, n3, a3, o3) {
    var s3, c3, u2;
    if ("string" == typeof t2 && i2(t2) === r) {
      t2 = unescape(t2);
      var h3 = k2(t2, false);
      ("" !== h3 || void 0 !== (h3 = e.loadFile(t2, true))) && (t2 = h3);
    }
    if (d2(t2) && (t2 = p2(t2, n3)), n3 = i2(t2, n3), !f2(n3)) throw new Error("addImage does not support files of type '" + n3 + "', please ensure that a plugin for '" + n3 + "' support is added.");
    if ((null == (u2 = a3) || 0 === u2.length) && (a3 = function(t3) {
      return "string" == typeof t3 || x2(t3) ? w2(t3) : x2(t3.data) ? w2(t3.data) : null;
    }(t2)), (s3 = g2.call(this, a3)) || (A2() && (t2 instanceof Uint8Array || "RGBA" === n3 || (c3 = t2, t2 = S2(t2))), s3 = this["process" + n3.toUpperCase()](t2, l2.call(this), a3, function(t3) {
      return t3 && "string" == typeof t3 && (t3 = t3.toUpperCase()), t3 in e.image_compression ? t3 : y2.NONE;
    }(o3), c3)), !s3) throw new Error("An unknown error occurred whilst processing the image.");
    return s3;
  }, k2 = e.__addimage__.convertBase64ToBinaryString = function(t2, e2) {
    var r2;
    e2 = "boolean" != typeof e2 || e2;
    var n3, i3 = "";
    if ("string" == typeof t2) {
      n3 = null !== (r2 = L2(t2)) ? r2.data : t2;
      try {
        i3 = u(n3);
      } catch (t3) {
        if (e2) throw N2(n3) ? new Error("atob-Error in jsPDF.convertBase64ToBinaryString " + t3.message) : new Error("Supplied Data is not a valid base64-String jsPDF.convertBase64ToBinaryString ");
      }
    }
    return i3;
  };
  e.getImageProperties = function(t2) {
    var n3, a3, o3 = "";
    if (d2(t2) && (t2 = p2(t2)), "string" == typeof t2 && i2(t2) === r && ("" === (o3 = k2(t2, false)) && (o3 = e.loadFile(t2) || ""), t2 = o3), a3 = i2(t2), !f2(a3)) throw new Error("addImage does not support files of type '" + a3 + "', please ensure that a plugin for '" + a3 + "' support is added.");
    if (!A2() || t2 instanceof Uint8Array || (t2 = S2(t2)), !(n3 = this["process" + a3.toUpperCase()](t2))) throw new Error("An unknown error occurred whilst processing the image");
    return n3.fileType = a3, n3;
  };
}(E.API), /**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e = function(t3) {
    if (void 0 !== t3 && "" != t3) return true;
  };
  E.API.events.push(["addPage", function(t3) {
    this.internal.getPageInfo(t3.pageNumber).pageContext.annotations = [];
  }]), t2.events.push(["putPage", function(t3) {
    for (var r, n2, i2, a2 = this.internal.getCoordinateString, o2 = this.internal.getVerticalCoordinateString, s2 = this.internal.getPageInfoByObjId(t3.objId), c2 = t3.pageContext.annotations, u2 = false, h2 = 0; h2 < c2.length && !u2; h2++) switch ((r = c2[h2]).type) {
      case "link":
        (e(r.options.url) || e(r.options.pageNumber)) && (u2 = true);
        break;
      case "reference":
      case "text":
      case "freetext":
        u2 = true;
    }
    if (0 != u2) {
      this.internal.write("/Annots [");
      for (var l2 = 0; l2 < c2.length; l2++) {
        r = c2[l2];
        var f2 = this.internal.pdfEscape, d2 = this.internal.getEncryptor(t3.objId);
        switch (r.type) {
          case "reference":
            this.internal.write(" " + r.object.objId + " 0 R ");
            break;
          case "text":
            var p2 = this.internal.newAdditionalObject(), g2 = this.internal.newAdditionalObject(), m2 = this.internal.getEncryptor(p2.objId), v2 = r.title || "Note";
            i2 = "<</Type /Annot /Subtype /Text " + (n2 = "/Rect [" + a2(r.bounds.x) + " " + o2(r.bounds.y + r.bounds.h) + " " + a2(r.bounds.x + r.bounds.w) + " " + o2(r.bounds.y) + "] ") + "/Contents (" + f2(m2(r.contents)) + ")", i2 += " /Popup " + g2.objId + " 0 R", i2 += " /P " + s2.objId + " 0 R", i2 += " /T (" + f2(m2(v2)) + ") >>", p2.content = i2;
            var b2 = p2.objId + " 0 R";
            i2 = "<</Type /Annot /Subtype /Popup " + (n2 = "/Rect [" + a2(r.bounds.x + 30) + " " + o2(r.bounds.y + r.bounds.h) + " " + a2(r.bounds.x + r.bounds.w + 30) + " " + o2(r.bounds.y) + "] ") + " /Parent " + b2, r.open && (i2 += " /Open true"), i2 += " >>", g2.content = i2, this.internal.write(p2.objId, "0 R", g2.objId, "0 R");
            break;
          case "freetext":
            n2 = "/Rect [" + a2(r.bounds.x) + " " + o2(r.bounds.y) + " " + a2(r.bounds.x + r.bounds.w) + " " + o2(r.bounds.y + r.bounds.h) + "] ";
            var y2 = r.color || "#000000";
            i2 = "<</Type /Annot /Subtype /FreeText " + n2 + "/Contents (" + f2(d2(r.contents)) + ")", i2 += " /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#" + y2 + ")", i2 += " /Border [0 0 0]", i2 += " >>", this.internal.write(i2);
            break;
          case "link":
            if (r.options.name) {
              var w2 = this.annotations._nameMap[r.options.name];
              r.options.pageNumber = w2.page, r.options.top = w2.y;
            } else r.options.top || (r.options.top = 0);
            if (n2 = "/Rect [" + r.finalBounds.x + " " + r.finalBounds.y + " " + r.finalBounds.w + " " + r.finalBounds.h + "] ", i2 = "", r.options.url) i2 = "<</Type /Annot /Subtype /Link " + n2 + "/Border [0 0 0] /A <</S /URI /URI (" + f2(d2(r.options.url)) + ") >>";
            else if (r.options.pageNumber) {
              switch (i2 = "<</Type /Annot /Subtype /Link " + n2 + "/Border [0 0 0] /Dest [" + this.internal.getPageInfo(r.options.pageNumber).objId + " 0 R", r.options.magFactor = r.options.magFactor || "XYZ", r.options.magFactor) {
                case "Fit":
                  i2 += " /Fit]";
                  break;
                case "FitH":
                  i2 += " /FitH " + r.options.top + "]";
                  break;
                case "FitV":
                  r.options.left = r.options.left || 0, i2 += " /FitV " + r.options.left + "]";
                  break;
                case "XYZ":
                default:
                  var N2 = o2(r.options.top);
                  r.options.left = r.options.left || 0, void 0 === r.options.zoom && (r.options.zoom = 0), i2 += " /XYZ " + r.options.left + " " + N2 + " " + r.options.zoom + "]";
              }
            }
            "" != i2 && (i2 += " >>", this.internal.write(i2));
        }
      }
      this.internal.write("]");
    }
  }]), t2.createAnnotation = function(t3) {
    var e2 = this.internal.getCurrentPageInfo();
    switch (t3.type) {
      case "link":
        this.link(t3.bounds.x, t3.bounds.y, t3.bounds.w, t3.bounds.h, t3);
        break;
      case "text":
      case "freetext":
        e2.pageContext.annotations.push(t3);
    }
  }, t2.link = function(t3, e2, r, n2, i2) {
    var a2 = this.internal.getCurrentPageInfo(), o2 = this.internal.getCoordinateString, s2 = this.internal.getVerticalCoordinateString;
    a2.pageContext.annotations.push({ finalBounds: { x: o2(t3), y: s2(e2), w: o2(t3 + r), h: s2(e2 + n2) }, options: i2, type: "link" });
  }, t2.textWithLink = function(t3, e2, r, n2) {
    var i2, a2, o2 = this.getTextWidth(t3), s2 = this.internal.getLineHeight() / this.internal.scaleFactor;
    if (void 0 !== n2.maxWidth) {
      a2 = n2.maxWidth;
      var c2 = this.splitTextToSize(t3, a2).length;
      i2 = Math.ceil(s2 * c2);
    } else a2 = o2, i2 = s2;
    return this.text(t3, e2, r, n2), r += 0.2 * s2, "center" === n2.align && (e2 -= o2 / 2), "right" === n2.align && (e2 -= o2), this.link(e2, r - s2, a2, i2, n2), o2;
  }, t2.getTextWidth = function(t3) {
    var e2 = this.internal.getFontSize();
    return this.getStringUnitWidth(t3) * e2 / this.internal.scaleFactor;
  };
}(E.API), /**
 * @license
 * Copyright (c) 2017 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e = { 1569: [65152], 1570: [65153, 65154], 1571: [65155, 65156], 1572: [65157, 65158], 1573: [65159, 65160], 1574: [65161, 65162, 65163, 65164], 1575: [65165, 65166], 1576: [65167, 65168, 65169, 65170], 1577: [65171, 65172], 1578: [65173, 65174, 65175, 65176], 1579: [65177, 65178, 65179, 65180], 1580: [65181, 65182, 65183, 65184], 1581: [65185, 65186, 65187, 65188], 1582: [65189, 65190, 65191, 65192], 1583: [65193, 65194], 1584: [65195, 65196], 1585: [65197, 65198], 1586: [65199, 65200], 1587: [65201, 65202, 65203, 65204], 1588: [65205, 65206, 65207, 65208], 1589: [65209, 65210, 65211, 65212], 1590: [65213, 65214, 65215, 65216], 1591: [65217, 65218, 65219, 65220], 1592: [65221, 65222, 65223, 65224], 1593: [65225, 65226, 65227, 65228], 1594: [65229, 65230, 65231, 65232], 1601: [65233, 65234, 65235, 65236], 1602: [65237, 65238, 65239, 65240], 1603: [65241, 65242, 65243, 65244], 1604: [65245, 65246, 65247, 65248], 1605: [65249, 65250, 65251, 65252], 1606: [65253, 65254, 65255, 65256], 1607: [65257, 65258, 65259, 65260], 1608: [65261, 65262], 1609: [65263, 65264, 64488, 64489], 1610: [65265, 65266, 65267, 65268], 1649: [64336, 64337], 1655: [64477], 1657: [64358, 64359, 64360, 64361], 1658: [64350, 64351, 64352, 64353], 1659: [64338, 64339, 64340, 64341], 1662: [64342, 64343, 64344, 64345], 1663: [64354, 64355, 64356, 64357], 1664: [64346, 64347, 64348, 64349], 1667: [64374, 64375, 64376, 64377], 1668: [64370, 64371, 64372, 64373], 1670: [64378, 64379, 64380, 64381], 1671: [64382, 64383, 64384, 64385], 1672: [64392, 64393], 1676: [64388, 64389], 1677: [64386, 64387], 1678: [64390, 64391], 1681: [64396, 64397], 1688: [64394, 64395], 1700: [64362, 64363, 64364, 64365], 1702: [64366, 64367, 64368, 64369], 1705: [64398, 64399, 64400, 64401], 1709: [64467, 64468, 64469, 64470], 1711: [64402, 64403, 64404, 64405], 1713: [64410, 64411, 64412, 64413], 1715: [64406, 64407, 64408, 64409], 1722: [64414, 64415], 1723: [64416, 64417, 64418, 64419], 1726: [64426, 64427, 64428, 64429], 1728: [64420, 64421], 1729: [64422, 64423, 64424, 64425], 1733: [64480, 64481], 1734: [64473, 64474], 1735: [64471, 64472], 1736: [64475, 64476], 1737: [64482, 64483], 1739: [64478, 64479], 1740: [64508, 64509, 64510, 64511], 1744: [64484, 64485, 64486, 64487], 1746: [64430, 64431], 1747: [64432, 64433] }, r = { 65247: { 65154: 65269, 65156: 65271, 65160: 65273, 65166: 65275 }, 65248: { 65154: 65270, 65156: 65272, 65160: 65274, 65166: 65276 }, 65165: { 65247: { 65248: { 65258: 65010 } } }, 1617: { 1612: 64606, 1613: 64607, 1614: 64608, 1615: 64609, 1616: 64610 } }, n2 = { 1612: 64606, 1613: 64607, 1614: 64608, 1615: 64609, 1616: 64610 }, i2 = [1570, 1571, 1573, 1575];
  t2.__arabicParser__ = {};
  var a2 = t2.__arabicParser__.isInArabicSubstitutionA = function(t3) {
    return void 0 !== e[t3.charCodeAt(0)];
  }, o2 = t2.__arabicParser__.isArabicLetter = function(t3) {
    return "string" == typeof t3 && /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/.test(t3);
  }, s2 = t2.__arabicParser__.isArabicEndLetter = function(t3) {
    return o2(t3) && a2(t3) && e[t3.charCodeAt(0)].length <= 2;
  }, c2 = t2.__arabicParser__.isArabicAlfLetter = function(t3) {
    return o2(t3) && i2.indexOf(t3.charCodeAt(0)) >= 0;
  };
  t2.__arabicParser__.arabicLetterHasIsolatedForm = function(t3) {
    return o2(t3) && a2(t3) && e[t3.charCodeAt(0)].length >= 1;
  };
  var u2 = t2.__arabicParser__.arabicLetterHasFinalForm = function(t3) {
    return o2(t3) && a2(t3) && e[t3.charCodeAt(0)].length >= 2;
  };
  t2.__arabicParser__.arabicLetterHasInitialForm = function(t3) {
    return o2(t3) && a2(t3) && e[t3.charCodeAt(0)].length >= 3;
  };
  var h2 = t2.__arabicParser__.arabicLetterHasMedialForm = function(t3) {
    return o2(t3) && a2(t3) && 4 == e[t3.charCodeAt(0)].length;
  }, l2 = t2.__arabicParser__.resolveLigatures = function(t3) {
    var e2 = 0, n3 = r, i3 = "", a3 = 0;
    for (e2 = 0; e2 < t3.length; e2 += 1) void 0 !== n3[t3.charCodeAt(e2)] ? (a3++, "number" == typeof (n3 = n3[t3.charCodeAt(e2)]) && (i3 += String.fromCharCode(n3), n3 = r, a3 = 0), e2 === t3.length - 1 && (n3 = r, i3 += t3.charAt(e2 - (a3 - 1)), e2 -= a3 - 1, a3 = 0)) : (n3 = r, i3 += t3.charAt(e2 - a3), e2 -= a3, a3 = 0);
    return i3;
  };
  t2.__arabicParser__.isArabicDiacritic = function(t3) {
    return void 0 !== t3 && void 0 !== n2[t3.charCodeAt(0)];
  };
  var f2 = t2.__arabicParser__.getCorrectForm = function(t3, e2, r2) {
    return o2(t3) ? false === a2(t3) ? -1 : !u2(t3) || !o2(e2) && !o2(r2) || !o2(r2) && s2(e2) || s2(t3) && !o2(e2) || s2(t3) && c2(e2) || s2(t3) && s2(e2) ? 0 : h2(t3) && o2(e2) && !s2(e2) && o2(r2) && u2(r2) ? 3 : s2(t3) || !o2(r2) ? 1 : 2 : -1;
  }, d2 = function(t3) {
    var r2 = 0, n3 = 0, i3 = 0, a3 = "", s3 = "", c3 = "", u3 = (t3 = t3 || "").split("\\s+"), h3 = [];
    for (r2 = 0; r2 < u3.length; r2 += 1) {
      for (h3.push(""), n3 = 0; n3 < u3[r2].length; n3 += 1) a3 = u3[r2][n3], s3 = u3[r2][n3 - 1], c3 = u3[r2][n3 + 1], o2(a3) ? (i3 = f2(a3, s3, c3), h3[r2] += -1 !== i3 ? String.fromCharCode(e[a3.charCodeAt(0)][i3]) : a3) : h3[r2] += a3;
      h3[r2] = l2(h3[r2]);
    }
    return h3.join(" ");
  }, p2 = t2.__arabicParser__.processArabic = t2.processArabic = function() {
    var t3, e2 = "string" == typeof arguments[0] ? arguments[0] : arguments[0].text, r2 = [];
    if (Array.isArray(e2)) {
      var n3 = 0;
      for (r2 = [], n3 = 0; n3 < e2.length; n3 += 1) Array.isArray(e2[n3]) ? r2.push([d2(e2[n3][0]), e2[n3][1], e2[n3][2]]) : r2.push([d2(e2[n3])]);
      t3 = r2;
    } else t3 = d2(e2);
    return "string" == typeof arguments[0] ? t3 : (arguments[0].text = t3, arguments[0]);
  };
  t2.events.push(["preProcessText", p2]);
}(E.API), E.API.autoPrint = function(t2) {
  var e;
  switch ((t2 = t2 || {}).variant = t2.variant || "non-conform", t2.variant) {
    case "javascript":
      this.addJS("print({});");
      break;
    case "non-conform":
    default:
      this.internal.events.subscribe("postPutResources", function() {
        e = this.internal.newObject(), this.internal.out("<<"), this.internal.out("/S /Named"), this.internal.out("/Type /Action"), this.internal.out("/N /Print"), this.internal.out(">>"), this.internal.out("endobj");
      }), this.internal.events.subscribe("putCatalog", function() {
        this.internal.out("/OpenAction " + e + " 0 R");
      });
  }
  return this;
}, /**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e = function() {
    var t3 = void 0;
    Object.defineProperty(this, "pdf", { get: function() {
      return t3;
    }, set: function(e3) {
      t3 = e3;
    } });
    var e2 = 150;
    Object.defineProperty(this, "width", { get: function() {
      return e2;
    }, set: function(t4) {
      e2 = isNaN(t4) || false === Number.isInteger(t4) || t4 < 0 ? 150 : t4, this.getContext("2d").pageWrapXEnabled && (this.getContext("2d").pageWrapX = e2 + 1);
    } });
    var r = 300;
    Object.defineProperty(this, "height", { get: function() {
      return r;
    }, set: function(t4) {
      r = isNaN(t4) || false === Number.isInteger(t4) || t4 < 0 ? 300 : t4, this.getContext("2d").pageWrapYEnabled && (this.getContext("2d").pageWrapY = r + 1);
    } });
    var n2 = [];
    Object.defineProperty(this, "childNodes", { get: function() {
      return n2;
    }, set: function(t4) {
      n2 = t4;
    } });
    var i2 = {};
    Object.defineProperty(this, "style", { get: function() {
      return i2;
    }, set: function(t4) {
      i2 = t4;
    } }), Object.defineProperty(this, "parentNode", {});
  };
  e.prototype.getContext = function(t3, e2) {
    var r;
    if ("2d" !== (t3 = t3 || "2d")) return null;
    for (r in e2) this.pdf.context2d.hasOwnProperty(r) && (this.pdf.context2d[r] = e2[r]);
    return this.pdf.context2d._canvas = this, this.pdf.context2d;
  }, e.prototype.toDataURL = function() {
    throw new Error("toDataURL is not implemented.");
  }, t2.events.push(["initialized", function() {
    this.canvas = new e(), this.canvas.pdf = this;
  }]);
}(E.API), function(e) {
  var r = { left: 0, top: 0, bottom: 0, right: 0 }, n2 = false, i2 = function() {
    void 0 === this.internal.__cell__ && (this.internal.__cell__ = {}, this.internal.__cell__.padding = 3, this.internal.__cell__.headerFunction = void 0, this.internal.__cell__.margins = Object.assign({}, r), this.internal.__cell__.margins.width = this.getPageWidth(), a2.call(this));
  }, a2 = function() {
    this.internal.__cell__.lastCell = new o2(), this.internal.__cell__.pages = 1;
  }, o2 = function() {
    var t2 = arguments[0];
    Object.defineProperty(this, "x", { enumerable: true, get: function() {
      return t2;
    }, set: function(e3) {
      t2 = e3;
    } });
    var e2 = arguments[1];
    Object.defineProperty(this, "y", { enumerable: true, get: function() {
      return e2;
    }, set: function(t3) {
      e2 = t3;
    } });
    var r2 = arguments[2];
    Object.defineProperty(this, "width", { enumerable: true, get: function() {
      return r2;
    }, set: function(t3) {
      r2 = t3;
    } });
    var n3 = arguments[3];
    Object.defineProperty(this, "height", { enumerable: true, get: function() {
      return n3;
    }, set: function(t3) {
      n3 = t3;
    } });
    var i3 = arguments[4];
    Object.defineProperty(this, "text", { enumerable: true, get: function() {
      return i3;
    }, set: function(t3) {
      i3 = t3;
    } });
    var a3 = arguments[5];
    Object.defineProperty(this, "lineNumber", { enumerable: true, get: function() {
      return a3;
    }, set: function(t3) {
      a3 = t3;
    } });
    var o3 = arguments[6];
    return Object.defineProperty(this, "align", { enumerable: true, get: function() {
      return o3;
    }, set: function(t3) {
      o3 = t3;
    } }), this;
  };
  o2.prototype.clone = function() {
    return new o2(this.x, this.y, this.width, this.height, this.text, this.lineNumber, this.align);
  }, o2.prototype.toArray = function() {
    return [this.x, this.y, this.width, this.height, this.text, this.lineNumber, this.align];
  }, e.setHeaderFunction = function(t2) {
    return i2.call(this), this.internal.__cell__.headerFunction = "function" == typeof t2 ? t2 : void 0, this;
  }, e.getTextDimensions = function(t2, e2) {
    i2.call(this);
    var r2 = (e2 = e2 || {}).fontSize || this.getFontSize(), n3 = e2.font || this.getFont(), a3 = e2.scaleFactor || this.internal.scaleFactor, o3 = 0, s3 = 0, c3 = 0, u2 = this;
    if (!Array.isArray(t2) && "string" != typeof t2) {
      if ("number" != typeof t2) throw new Error("getTextDimensions expects text-parameter to be of type String or type Number or an Array of Strings.");
      t2 = String(t2);
    }
    var h2 = e2.maxWidth;
    h2 > 0 ? "string" == typeof t2 ? t2 = this.splitTextToSize(t2, h2) : "[object Array]" === Object.prototype.toString.call(t2) && (t2 = t2.reduce(function(t3, e3) {
      return t3.concat(u2.splitTextToSize(e3, h2));
    }, [])) : t2 = Array.isArray(t2) ? t2 : [t2];
    for (var l2 = 0; l2 < t2.length; l2++) o3 < (c3 = this.getStringUnitWidth(t2[l2], { font: n3 }) * r2) && (o3 = c3);
    return 0 !== o3 && (s3 = t2.length), { w: o3 /= a3, h: Math.max((s3 * r2 * this.getLineHeightFactor() - r2 * (this.getLineHeightFactor() - 1)) / a3, 0) };
  }, e.cellAddPage = function() {
    i2.call(this), this.addPage();
    var t2 = this.internal.__cell__.margins || r;
    return this.internal.__cell__.lastCell = new o2(t2.left, t2.top, void 0, void 0), this.internal.__cell__.pages += 1, this;
  };
  var s2 = e.cell = function() {
    var t2;
    t2 = arguments[0] instanceof o2 ? arguments[0] : new o2(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]), i2.call(this);
    var e2 = this.internal.__cell__.lastCell, a3 = this.internal.__cell__.padding, s3 = this.internal.__cell__.margins || r, c3 = this.internal.__cell__.tableHeaderRow, u2 = this.internal.__cell__.printHeaders;
    return void 0 !== e2.lineNumber && (e2.lineNumber === t2.lineNumber ? (t2.x = (e2.x || 0) + (e2.width || 0), t2.y = e2.y || 0) : e2.y + e2.height + t2.height + s3.bottom > this.getPageHeight() ? (this.cellAddPage(), t2.y = s3.top, u2 && c3 && (this.printHeaderRow(t2.lineNumber, true), t2.y += c3[0].height)) : t2.y = e2.y + e2.height || t2.y), void 0 !== t2.text[0] && (this.rect(t2.x, t2.y, t2.width, t2.height, true === n2 ? "FD" : void 0), "right" === t2.align ? this.text(t2.text, t2.x + t2.width - a3, t2.y + a3, { align: "right", baseline: "top" }) : "center" === t2.align ? this.text(t2.text, t2.x + t2.width / 2, t2.y + a3, { align: "center", baseline: "top", maxWidth: t2.width - a3 - a3 }) : this.text(t2.text, t2.x + a3, t2.y + a3, { align: "left", baseline: "top", maxWidth: t2.width - a3 - a3 })), this.internal.__cell__.lastCell = t2, this;
  };
  e.table = function(e2, n3, u2, h2, l2) {
    if (i2.call(this), !u2) throw new Error("No data for PDF table.");
    var f2, d2, p2, g2, m2 = [], v2 = [], b2 = [], y2 = {}, w2 = {}, N2 = [], L2 = [], A2 = (l2 = l2 || {}).autoSize || false, x2 = false !== l2.printHeaders, S2 = l2.css && void 0 !== l2.css["font-size"] ? 16 * l2.css["font-size"] : l2.fontSize || 12, _2 = l2.margins || Object.assign({ width: this.getPageWidth() }, r), P2 = "number" == typeof l2.padding ? l2.padding : 3, k2 = l2.headerBackgroundColor || "#c8c8c8", I2 = l2.headerTextColor || "#000";
    if (a2.call(this), this.internal.__cell__.printHeaders = x2, this.internal.__cell__.margins = _2, this.internal.__cell__.table_font_size = S2, this.internal.__cell__.padding = P2, this.internal.__cell__.headerBackgroundColor = k2, this.internal.__cell__.headerTextColor = I2, this.setFontSize(S2), null == h2) v2 = m2 = Object.keys(u2[0]), b2 = m2.map(function() {
      return "left";
    });
    else if (Array.isArray(h2) && "object" === _typeof(h2[0])) for (m2 = h2.map(function(t2) {
      return t2.name;
    }), v2 = h2.map(function(t2) {
      return t2.prompt || t2.name || "";
    }), b2 = h2.map(function(t2) {
      return t2.align || "left";
    }), f2 = 0; f2 < h2.length; f2 += 1) w2[h2[f2].name] = h2[f2].width * (19.049976 / 25.4);
    else Array.isArray(h2) && "string" == typeof h2[0] && (v2 = m2 = h2, b2 = m2.map(function() {
      return "left";
    }));
    if (A2 || Array.isArray(h2) && "string" == typeof h2[0]) for (f2 = 0; f2 < m2.length; f2 += 1) {
      for (y2[g2 = m2[f2]] = u2.map(function(t2) {
        return t2[g2];
      }), this.setFont(void 0, "bold"), N2.push(this.getTextDimensions(v2[f2], { fontSize: this.internal.__cell__.table_font_size, scaleFactor: this.internal.scaleFactor }).w), d2 = y2[g2], this.setFont(void 0, "normal"), p2 = 0; p2 < d2.length; p2 += 1) N2.push(this.getTextDimensions(d2[p2], { fontSize: this.internal.__cell__.table_font_size, scaleFactor: this.internal.scaleFactor }).w);
      w2[g2] = Math.max.apply(null, N2) + P2 + P2, N2 = [];
    }
    if (x2) {
      var F2 = {};
      for (f2 = 0; f2 < m2.length; f2 += 1) F2[m2[f2]] = {}, F2[m2[f2]].text = v2[f2], F2[m2[f2]].align = b2[f2];
      var C2 = c2.call(this, F2, w2);
      L2 = m2.map(function(t2) {
        return new o2(e2, n3, w2[t2], C2, F2[t2].text, void 0, F2[t2].align);
      }), this.setTableHeaderRow(L2), this.printHeaderRow(1, false);
    }
    var j2 = h2.reduce(function(t2, e3) {
      return t2[e3.name] = e3.align, t2;
    }, {});
    for (f2 = 0; f2 < u2.length; f2 += 1) {
      "rowStart" in l2 && l2.rowStart instanceof Function && l2.rowStart({ row: f2, data: u2[f2] }, this);
      var O2 = c2.call(this, u2[f2], w2);
      for (p2 = 0; p2 < m2.length; p2 += 1) {
        var B2 = u2[f2][m2[p2]];
        "cellStart" in l2 && l2.cellStart instanceof Function && l2.cellStart({ row: f2, col: p2, data: B2 }, this), s2.call(this, new o2(e2, n3, w2[m2[p2]], O2, B2, f2 + 2, j2[m2[p2]]));
      }
    }
    return this.internal.__cell__.table_x = e2, this.internal.__cell__.table_y = n3, this;
  };
  var c2 = function(t2, e2) {
    var r2 = this.internal.__cell__.padding, n3 = this.internal.__cell__.table_font_size, i3 = this.internal.scaleFactor;
    return Object.keys(t2).map(function(n4) {
      var i4 = t2[n4];
      return this.splitTextToSize(i4.hasOwnProperty("text") ? i4.text : i4, e2[n4] - r2 - r2);
    }, this).map(function(t3) {
      return this.getLineHeightFactor() * t3.length * n3 / i3 + r2 + r2;
    }, this).reduce(function(t3, e3) {
      return Math.max(t3, e3);
    }, 0);
  };
  e.setTableHeaderRow = function(t2) {
    i2.call(this), this.internal.__cell__.tableHeaderRow = t2;
  }, e.printHeaderRow = function(t2, e2) {
    if (i2.call(this), !this.internal.__cell__.tableHeaderRow) throw new Error("Property tableHeaderRow does not exist.");
    var r2;
    if (n2 = true, "function" == typeof this.internal.__cell__.headerFunction) {
      var a3 = this.internal.__cell__.headerFunction(this, this.internal.__cell__.pages);
      this.internal.__cell__.lastCell = new o2(a3[0], a3[1], a3[2], a3[3], void 0, -1);
    }
    this.setFont(void 0, "bold");
    for (var c3 = [], u2 = 0; u2 < this.internal.__cell__.tableHeaderRow.length; u2 += 1) {
      r2 = this.internal.__cell__.tableHeaderRow[u2].clone(), e2 && (r2.y = this.internal.__cell__.margins.top || 0, c3.push(r2)), r2.lineNumber = t2;
      var h2 = this.getTextColor();
      this.setTextColor(this.internal.__cell__.headerTextColor), this.setFillColor(this.internal.__cell__.headerBackgroundColor), s2.call(this, r2), this.setTextColor(h2);
    }
    c3.length > 0 && this.setTableHeaderRow(c3), this.setFont(void 0, "normal"), n2 = false;
  };
}(E.API);
var Pt = { italic: ["italic", "oblique", "normal"], oblique: ["oblique", "italic", "normal"], normal: ["normal", "oblique", "italic"] }, kt = ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded"], It = _t(kt), Ft = [100, 200, 300, 400, 500, 600, 700, 800, 900], Ct = _t(Ft);
function jt(t2) {
  var e = t2.family.replace(/"|'/g, "").toLowerCase(), r = function(t3) {
    return Pt[t3 = t3 || "normal"] ? t3 : "normal";
  }(t2.style), n2 = function(t3) {
    if (!t3) return 400;
    if ("number" == typeof t3) return t3 >= 100 && t3 <= 900 && t3 % 100 == 0 ? t3 : 400;
    if (/^\d00$/.test(t3)) return parseInt(t3);
    switch (t3) {
      case "bold":
        return 700;
      case "normal":
      default:
        return 400;
    }
  }(t2.weight), i2 = function(t3) {
    return "number" == typeof It[t3 = t3 || "normal"] ? t3 : "normal";
  }(t2.stretch);
  return { family: e, style: r, weight: n2, stretch: i2, src: t2.src || [], ref: t2.ref || { name: e, style: [i2, r, n2].join(" ") } };
}
function Ot(t2, e, r, n2) {
  var i2;
  for (i2 = r; i2 >= 0 && i2 < e.length; i2 += n2) if (t2[e[i2]]) return t2[e[i2]];
  for (i2 = r; i2 >= 0 && i2 < e.length; i2 -= n2) if (t2[e[i2]]) return t2[e[i2]];
}
var Bt = { "sans-serif": "helvetica", fixed: "courier", monospace: "courier", terminal: "courier", cursive: "times", fantasy: "times", serif: "times" }, Mt = { caption: "times", icon: "times", menu: "times", "message-box": "times", "small-caption": "times", "status-bar": "times" };
function Et(t2) {
  return [t2.stretch, t2.style, t2.weight, t2.family].join(" ");
}
function qt(t2, e, r) {
  for (var n2 = (r = r || {}).defaultFontFamily || "times", i2 = Object.assign({}, Bt, r.genericFontFamilies || {}), a2 = null, o2 = null, s2 = 0; s2 < e.length; ++s2) if (i2[(a2 = jt(e[s2])).family] && (a2.family = i2[a2.family]), t2.hasOwnProperty(a2.family)) {
    o2 = t2[a2.family];
    break;
  }
  if (!(o2 = o2 || t2[n2])) throw new Error("Could not find a font-family for the rule '" + Et(a2) + "' and default family '" + n2 + "'.");
  if (o2 = function(t3, e2) {
    if (e2[t3]) return e2[t3];
    var r2 = It[t3], n3 = r2 <= It.normal ? -1 : 1, i3 = Ot(e2, kt, r2, n3);
    if (!i3) throw new Error("Could not find a matching font-stretch value for " + t3);
    return i3;
  }(a2.stretch, o2), o2 = function(t3, e2) {
    if (e2[t3]) return e2[t3];
    for (var r2 = Pt[t3], n3 = 0; n3 < r2.length; ++n3) if (e2[r2[n3]]) return e2[r2[n3]];
    throw new Error("Could not find a matching font-style for " + t3);
  }(a2.style, o2), !(o2 = function(t3, e2) {
    if (e2[t3]) return e2[t3];
    if (400 === t3 && e2[500]) return e2[500];
    if (500 === t3 && e2[400]) return e2[400];
    var r2 = Ct[t3], n3 = Ot(e2, Ft, r2, t3 < 400 ? -1 : 1);
    if (!n3) throw new Error("Could not find a matching font-weight for value " + t3);
    return n3;
  }(a2.weight, o2))) throw new Error("Failed to resolve a font for the rule '" + Et(a2) + "'.");
  return o2;
}
function Dt(t2) {
  return t2.trimLeft();
}
function Rt(t2, e) {
  for (var r = 0; r < t2.length; ) {
    if (t2.charAt(r) === e) return [t2.substring(0, r), t2.substring(r + 1)];
    r += 1;
  }
  return null;
}
function Tt(t2) {
  var e = t2.match(/^(-[a-z_]|[a-z_])[a-z0-9_-]*/i);
  return null === e ? null : [e[0], t2.substring(e[0].length)];
}
var Ut, zt, Ht, Wt = ["times"];
!function(e) {
  var r, n2, i2, o2, s2, c2, u2, h2, l2, d2 = function(t2) {
    return t2 = t2 || {}, this.isStrokeTransparent = t2.isStrokeTransparent || false, this.strokeOpacity = t2.strokeOpacity || 1, this.strokeStyle = t2.strokeStyle || "#000000", this.fillStyle = t2.fillStyle || "#000000", this.isFillTransparent = t2.isFillTransparent || false, this.fillOpacity = t2.fillOpacity || 1, this.font = t2.font || "10px sans-serif", this.textBaseline = t2.textBaseline || "alphabetic", this.textAlign = t2.textAlign || "left", this.lineWidth = t2.lineWidth || 1, this.lineJoin = t2.lineJoin || "miter", this.lineCap = t2.lineCap || "butt", this.path = t2.path || [], this.transform = void 0 !== t2.transform ? t2.transform.clone() : new h2(), this.globalCompositeOperation = t2.globalCompositeOperation || "normal", this.globalAlpha = t2.globalAlpha || 1, this.clip_path = t2.clip_path || [], this.currentPoint = t2.currentPoint || new c2(), this.miterLimit = t2.miterLimit || 10, this.lastPoint = t2.lastPoint || new c2(), this.lineDashOffset = t2.lineDashOffset || 0, this.lineDash = t2.lineDash || [], this.margin = t2.margin || [0, 0, 0, 0], this.prevPageLastElemOffset = t2.prevPageLastElemOffset || 0, this.ignoreClearRect = "boolean" != typeof t2.ignoreClearRect || t2.ignoreClearRect, this;
  };
  e.events.push(["initialized", function() {
    this.context2d = new p2(this), r = this.internal.f2, n2 = this.internal.getCoordinateString, i2 = this.internal.getVerticalCoordinateString, o2 = this.internal.getHorizontalCoordinate, s2 = this.internal.getVerticalCoordinate, c2 = this.internal.Point, u2 = this.internal.Rectangle, h2 = this.internal.Matrix, l2 = new d2();
  }]);
  var p2 = function(t2) {
    Object.defineProperty(this, "canvas", { get: function() {
      return { parentNode: false, style: false };
    } });
    var e2 = t2;
    Object.defineProperty(this, "pdf", { get: function() {
      return e2;
    } });
    var r2 = false;
    Object.defineProperty(this, "pageWrapXEnabled", { get: function() {
      return r2;
    }, set: function(t3) {
      r2 = Boolean(t3);
    } });
    var n3 = false;
    Object.defineProperty(this, "pageWrapYEnabled", { get: function() {
      return n3;
    }, set: function(t3) {
      n3 = Boolean(t3);
    } });
    var i3 = 0;
    Object.defineProperty(this, "posX", { get: function() {
      return i3;
    }, set: function(t3) {
      isNaN(t3) || (i3 = t3);
    } });
    var a2 = 0;
    Object.defineProperty(this, "posY", { get: function() {
      return a2;
    }, set: function(t3) {
      isNaN(t3) || (a2 = t3);
    } }), Object.defineProperty(this, "margin", { get: function() {
      return l2.margin;
    }, set: function(t3) {
      var e3;
      "number" == typeof t3 ? e3 = [t3, t3, t3, t3] : ((e3 = new Array(4))[0] = t3[0], e3[1] = t3.length >= 2 ? t3[1] : e3[0], e3[2] = t3.length >= 3 ? t3[2] : e3[0], e3[3] = t3.length >= 4 ? t3[3] : e3[1]), l2.margin = e3;
    } });
    var o3 = false;
    Object.defineProperty(this, "autoPaging", { get: function() {
      return o3;
    }, set: function(t3) {
      o3 = t3;
    } });
    var s3 = 0;
    Object.defineProperty(this, "lastBreak", { get: function() {
      return s3;
    }, set: function(t3) {
      s3 = t3;
    } });
    var c3 = [];
    Object.defineProperty(this, "pageBreaks", { get: function() {
      return c3;
    }, set: function(t3) {
      c3 = t3;
    } }), Object.defineProperty(this, "ctx", { get: function() {
      return l2;
    }, set: function(t3) {
      t3 instanceof d2 && (l2 = t3);
    } }), Object.defineProperty(this, "path", { get: function() {
      return l2.path;
    }, set: function(t3) {
      l2.path = t3;
    } });
    var u3 = [];
    Object.defineProperty(this, "ctxStack", { get: function() {
      return u3;
    }, set: function(t3) {
      u3 = t3;
    } }), Object.defineProperty(this, "fillStyle", { get: function() {
      return this.ctx.fillStyle;
    }, set: function(t3) {
      var e3;
      e3 = g2(t3), this.ctx.fillStyle = e3.style, this.ctx.isFillTransparent = 0 === e3.a, this.ctx.fillOpacity = e3.a, this.pdf.setFillColor(e3.r, e3.g, e3.b, { a: e3.a }), this.pdf.setTextColor(e3.r, e3.g, e3.b, { a: e3.a });
    } }), Object.defineProperty(this, "strokeStyle", { get: function() {
      return this.ctx.strokeStyle;
    }, set: function(t3) {
      var e3 = g2(t3);
      this.ctx.strokeStyle = e3.style, this.ctx.isStrokeTransparent = 0 === e3.a, this.ctx.strokeOpacity = e3.a, 0 === e3.a ? this.pdf.setDrawColor(255, 255, 255) : (e3.a, this.pdf.setDrawColor(e3.r, e3.g, e3.b));
    } }), Object.defineProperty(this, "lineCap", { get: function() {
      return this.ctx.lineCap;
    }, set: function(t3) {
      -1 !== ["butt", "round", "square"].indexOf(t3) && (this.ctx.lineCap = t3, this.pdf.setLineCap(t3));
    } }), Object.defineProperty(this, "lineWidth", { get: function() {
      return this.ctx.lineWidth;
    }, set: function(t3) {
      isNaN(t3) || (this.ctx.lineWidth = t3, this.pdf.setLineWidth(t3));
    } }), Object.defineProperty(this, "lineJoin", { get: function() {
      return this.ctx.lineJoin;
    }, set: function(t3) {
      -1 !== ["bevel", "round", "miter"].indexOf(t3) && (this.ctx.lineJoin = t3, this.pdf.setLineJoin(t3));
    } }), Object.defineProperty(this, "miterLimit", { get: function() {
      return this.ctx.miterLimit;
    }, set: function(t3) {
      isNaN(t3) || (this.ctx.miterLimit = t3, this.pdf.setMiterLimit(t3));
    } }), Object.defineProperty(this, "textBaseline", { get: function() {
      return this.ctx.textBaseline;
    }, set: function(t3) {
      this.ctx.textBaseline = t3;
    } }), Object.defineProperty(this, "textAlign", { get: function() {
      return this.ctx.textAlign;
    }, set: function(t3) {
      -1 !== ["right", "end", "center", "left", "start"].indexOf(t3) && (this.ctx.textAlign = t3);
    } });
    var h3 = null;
    function f2(t3, e3) {
      if (null === h3) {
        var r3 = function(t4) {
          var e4 = [];
          return Object.keys(t4).forEach(function(r4) {
            t4[r4].forEach(function(t5) {
              var n4 = null;
              switch (t5) {
                case "bold":
                  n4 = { family: r4, weight: "bold" };
                  break;
                case "italic":
                  n4 = { family: r4, style: "italic" };
                  break;
                case "bolditalic":
                  n4 = { family: r4, weight: "bold", style: "italic" };
                  break;
                case "":
                case "normal":
                  n4 = { family: r4 };
              }
              null !== n4 && (n4.ref = { name: r4, style: t5 }, e4.push(n4));
            });
          }), e4;
        }(t3.getFontList());
        h3 = function(t4) {
          for (var e4 = {}, r4 = 0; r4 < t4.length; ++r4) {
            var n4 = jt(t4[r4]), i4 = n4.family, a3 = n4.stretch, o4 = n4.style, s4 = n4.weight;
            e4[i4] = e4[i4] || {}, e4[i4][a3] = e4[i4][a3] || {}, e4[i4][a3][o4] = e4[i4][a3][o4] || {}, e4[i4][a3][o4][s4] = n4;
          }
          return e4;
        }(r3.concat(e3));
      }
      return h3;
    }
    var p3 = null;
    Object.defineProperty(this, "fontFaces", { get: function() {
      return p3;
    }, set: function(t3) {
      h3 = null, p3 = t3;
    } }), Object.defineProperty(this, "font", { get: function() {
      return this.ctx.font;
    }, set: function(t3) {
      var e3;
      if (this.ctx.font = t3, null !== (e3 = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-_,\"\'\sa-z]+?)\s*$/i.exec(t3))) {
        var r3 = e3[1], n4 = (e3[2], e3[3]), i4 = e3[4], a3 = (e3[5], e3[6]), o4 = /^([.\d]+)((?:%|in|[cem]m|ex|p[ctx]))$/i.exec(i4)[2];
        i4 = "px" === o4 ? Math.floor(parseFloat(i4) * this.pdf.internal.scaleFactor) : "em" === o4 ? Math.floor(parseFloat(i4) * this.pdf.getFontSize()) : Math.floor(parseFloat(i4) * this.pdf.internal.scaleFactor), this.pdf.setFontSize(i4);
        var s4 = function(t4) {
          var e4, r4, n5 = [], i5 = t4.trim();
          if ("" === i5) return Wt;
          if (i5 in Mt) return [Mt[i5]];
          for (; "" !== i5; ) {
            switch (r4 = null, e4 = (i5 = Dt(i5)).charAt(0)) {
              case '"':
              case "'":
                r4 = Rt(i5.substring(1), e4);
                break;
              default:
                r4 = Tt(i5);
            }
            if (null === r4) return Wt;
            if (n5.push(r4[0]), "" !== (i5 = Dt(r4[1])) && "," !== i5.charAt(0)) return Wt;
            i5 = i5.replace(/^,/, "");
          }
          return n5;
        }(a3);
        if (this.fontFaces) {
          var c4 = qt(f2(this.pdf, this.fontFaces), s4.map(function(t4) {
            return { family: t4, stretch: "normal", weight: n4, style: r3 };
          }));
          this.pdf.setFont(c4.ref.name, c4.ref.style);
        } else {
          var u4 = "";
          ("bold" === n4 || parseInt(n4, 10) >= 700 || "bold" === r3) && (u4 = "bold"), "italic" === r3 && (u4 += "italic"), 0 === u4.length && (u4 = "normal");
          for (var h4 = "", l3 = { arial: "Helvetica", Arial: "Helvetica", verdana: "Helvetica", Verdana: "Helvetica", helvetica: "Helvetica", Helvetica: "Helvetica", "sans-serif": "Helvetica", fixed: "Courier", monospace: "Courier", terminal: "Courier", cursive: "Times", fantasy: "Times", serif: "Times" }, d3 = 0; d3 < s4.length; d3++) {
            if (void 0 !== this.pdf.internal.getFont(s4[d3], u4, { noFallback: true, disableWarning: true })) {
              h4 = s4[d3];
              break;
            }
            if ("bolditalic" === u4 && void 0 !== this.pdf.internal.getFont(s4[d3], "bold", { noFallback: true, disableWarning: true })) h4 = s4[d3], u4 = "bold";
            else if (void 0 !== this.pdf.internal.getFont(s4[d3], "normal", { noFallback: true, disableWarning: true })) {
              h4 = s4[d3], u4 = "normal";
              break;
            }
          }
          if ("" === h4) {
            for (var p4 = 0; p4 < s4.length; p4++) if (l3[s4[p4]]) {
              h4 = l3[s4[p4]];
              break;
            }
          }
          h4 = "" === h4 ? "Times" : h4, this.pdf.setFont(h4, u4);
        }
      }
    } }), Object.defineProperty(this, "globalCompositeOperation", { get: function() {
      return this.ctx.globalCompositeOperation;
    }, set: function(t3) {
      this.ctx.globalCompositeOperation = t3;
    } }), Object.defineProperty(this, "globalAlpha", { get: function() {
      return this.ctx.globalAlpha;
    }, set: function(t3) {
      this.ctx.globalAlpha = t3;
    } }), Object.defineProperty(this, "lineDashOffset", { get: function() {
      return this.ctx.lineDashOffset;
    }, set: function(t3) {
      this.ctx.lineDashOffset = t3, T2.call(this);
    } }), Object.defineProperty(this, "lineDash", { get: function() {
      return this.ctx.lineDash;
    }, set: function(t3) {
      this.ctx.lineDash = t3, T2.call(this);
    } }), Object.defineProperty(this, "ignoreClearRect", { get: function() {
      return this.ctx.ignoreClearRect;
    }, set: function(t3) {
      this.ctx.ignoreClearRect = Boolean(t3);
    } });
  };
  p2.prototype.setLineDash = function(t2) {
    this.lineDash = t2;
  }, p2.prototype.getLineDash = function() {
    return this.lineDash.length % 2 ? this.lineDash.concat(this.lineDash) : this.lineDash.slice();
  }, p2.prototype.fill = function() {
    A2.call(this, "fill", false);
  }, p2.prototype.stroke = function() {
    A2.call(this, "stroke", false);
  }, p2.prototype.beginPath = function() {
    this.path = [{ type: "begin" }];
  }, p2.prototype.moveTo = function(t2, e2) {
    if (isNaN(t2) || isNaN(e2)) throw a.error("jsPDF.context2d.moveTo: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.moveTo");
    var r2 = this.ctx.transform.applyToPoint(new c2(t2, e2));
    this.path.push({ type: "mt", x: r2.x, y: r2.y }), this.ctx.lastPoint = new c2(t2, e2);
  }, p2.prototype.closePath = function() {
    var e2 = new c2(0, 0), r2 = 0;
    for (r2 = this.path.length - 1; -1 !== r2; r2--) if ("begin" === this.path[r2].type && "object" === _typeof(this.path[r2 + 1]) && "number" == typeof this.path[r2 + 1].x) {
      e2 = new c2(this.path[r2 + 1].x, this.path[r2 + 1].y);
      break;
    }
    this.path.push({ type: "close" }), this.ctx.lastPoint = new c2(e2.x, e2.y);
  }, p2.prototype.lineTo = function(t2, e2) {
    if (isNaN(t2) || isNaN(e2)) throw a.error("jsPDF.context2d.lineTo: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.lineTo");
    var r2 = this.ctx.transform.applyToPoint(new c2(t2, e2));
    this.path.push({ type: "lt", x: r2.x, y: r2.y }), this.ctx.lastPoint = new c2(r2.x, r2.y);
  }, p2.prototype.clip = function() {
    this.ctx.clip_path = JSON.parse(JSON.stringify(this.path)), A2.call(this, null, true);
  }, p2.prototype.quadraticCurveTo = function(t2, e2, r2, n3) {
    if (isNaN(r2) || isNaN(n3) || isNaN(t2) || isNaN(e2)) throw a.error("jsPDF.context2d.quadraticCurveTo: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.quadraticCurveTo");
    var i3 = this.ctx.transform.applyToPoint(new c2(r2, n3)), o3 = this.ctx.transform.applyToPoint(new c2(t2, e2));
    this.path.push({ type: "qct", x1: o3.x, y1: o3.y, x: i3.x, y: i3.y }), this.ctx.lastPoint = new c2(i3.x, i3.y);
  }, p2.prototype.bezierCurveTo = function(t2, e2, r2, n3, i3, o3) {
    if (isNaN(i3) || isNaN(o3) || isNaN(t2) || isNaN(e2) || isNaN(r2) || isNaN(n3)) throw a.error("jsPDF.context2d.bezierCurveTo: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo");
    var s3 = this.ctx.transform.applyToPoint(new c2(i3, o3)), u3 = this.ctx.transform.applyToPoint(new c2(t2, e2)), h3 = this.ctx.transform.applyToPoint(new c2(r2, n3));
    this.path.push({ type: "bct", x1: u3.x, y1: u3.y, x2: h3.x, y2: h3.y, x: s3.x, y: s3.y }), this.ctx.lastPoint = new c2(s3.x, s3.y);
  }, p2.prototype.arc = function(t2, e2, r2, n3, i3, o3) {
    if (isNaN(t2) || isNaN(e2) || isNaN(r2) || isNaN(n3) || isNaN(i3)) throw a.error("jsPDF.context2d.arc: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.arc");
    if (o3 = Boolean(o3), !this.ctx.transform.isIdentity) {
      var s3 = this.ctx.transform.applyToPoint(new c2(t2, e2));
      t2 = s3.x, e2 = s3.y;
      var u3 = this.ctx.transform.applyToPoint(new c2(0, r2)), h3 = this.ctx.transform.applyToPoint(new c2(0, 0));
      r2 = Math.sqrt(Math.pow(u3.x - h3.x, 2) + Math.pow(u3.y - h3.y, 2));
    }
    Math.abs(i3 - n3) >= 2 * Math.PI && (n3 = 0, i3 = 2 * Math.PI), this.path.push({ type: "arc", x: t2, y: e2, radius: r2, startAngle: n3, endAngle: i3, counterclockwise: o3 });
  }, p2.prototype.arcTo = function(t2, e2, r2, n3, i3) {
    throw new Error("arcTo not implemented.");
  }, p2.prototype.rect = function(t2, e2, r2, n3) {
    if (isNaN(t2) || isNaN(e2) || isNaN(r2) || isNaN(n3)) throw a.error("jsPDF.context2d.rect: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.rect");
    this.moveTo(t2, e2), this.lineTo(t2 + r2, e2), this.lineTo(t2 + r2, e2 + n3), this.lineTo(t2, e2 + n3), this.lineTo(t2, e2), this.lineTo(t2 + r2, e2), this.lineTo(t2, e2);
  }, p2.prototype.fillRect = function(t2, e2, r2, n3) {
    if (isNaN(t2) || isNaN(e2) || isNaN(r2) || isNaN(n3)) throw a.error("jsPDF.context2d.fillRect: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.fillRect");
    if (!m2.call(this)) {
      var i3 = {};
      "butt" !== this.lineCap && (i3.lineCap = this.lineCap, this.lineCap = "butt"), "miter" !== this.lineJoin && (i3.lineJoin = this.lineJoin, this.lineJoin = "miter"), this.beginPath(), this.rect(t2, e2, r2, n3), this.fill(), i3.hasOwnProperty("lineCap") && (this.lineCap = i3.lineCap), i3.hasOwnProperty("lineJoin") && (this.lineJoin = i3.lineJoin);
    }
  }, p2.prototype.strokeRect = function(t2, e2, r2, n3) {
    if (isNaN(t2) || isNaN(e2) || isNaN(r2) || isNaN(n3)) throw a.error("jsPDF.context2d.strokeRect: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.strokeRect");
    v2.call(this) || (this.beginPath(), this.rect(t2, e2, r2, n3), this.stroke());
  }, p2.prototype.clearRect = function(t2, e2, r2, n3) {
    if (isNaN(t2) || isNaN(e2) || isNaN(r2) || isNaN(n3)) throw a.error("jsPDF.context2d.clearRect: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.clearRect");
    this.ignoreClearRect || (this.fillStyle = "#ffffff", this.fillRect(t2, e2, r2, n3));
  }, p2.prototype.save = function(t2) {
    t2 = "boolean" != typeof t2 || t2;
    for (var e2 = this.pdf.internal.getCurrentPageInfo().pageNumber, r2 = 0; r2 < this.pdf.internal.getNumberOfPages(); r2++) this.pdf.setPage(r2 + 1), this.pdf.internal.out("q");
    if (this.pdf.setPage(e2), t2) {
      this.ctx.fontSize = this.pdf.internal.getFontSize();
      var n3 = new d2(this.ctx);
      this.ctxStack.push(this.ctx), this.ctx = n3;
    }
  }, p2.prototype.restore = function(t2) {
    t2 = "boolean" != typeof t2 || t2;
    for (var e2 = this.pdf.internal.getCurrentPageInfo().pageNumber, r2 = 0; r2 < this.pdf.internal.getNumberOfPages(); r2++) this.pdf.setPage(r2 + 1), this.pdf.internal.out("Q");
    this.pdf.setPage(e2), t2 && 0 !== this.ctxStack.length && (this.ctx = this.ctxStack.pop(), this.fillStyle = this.ctx.fillStyle, this.strokeStyle = this.ctx.strokeStyle, this.font = this.ctx.font, this.lineCap = this.ctx.lineCap, this.lineWidth = this.ctx.lineWidth, this.lineJoin = this.ctx.lineJoin, this.lineDash = this.ctx.lineDash, this.lineDashOffset = this.ctx.lineDashOffset);
  }, p2.prototype.toDataURL = function() {
    throw new Error("toDataUrl not implemented.");
  };
  var g2 = function(t2) {
    var e2, r2, n3, i3;
    if (true === t2.isCanvasGradient && (t2 = t2.getColor()), !t2) return { r: 0, g: 0, b: 0, a: 0, style: t2 };
    if (/transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/.test(t2)) e2 = 0, r2 = 0, n3 = 0, i3 = 0;
    else {
      var a2 = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(t2);
      if (null !== a2) e2 = parseInt(a2[1]), r2 = parseInt(a2[2]), n3 = parseInt(a2[3]), i3 = 1;
      else if (null !== (a2 = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/.exec(t2))) e2 = parseInt(a2[1]), r2 = parseInt(a2[2]), n3 = parseInt(a2[3]), i3 = parseFloat(a2[4]);
      else {
        if (i3 = 1, "string" == typeof t2 && "#" !== t2.charAt(0)) {
          var o3 = new f(t2);
          t2 = o3.ok ? o3.toHex() : "#000000";
        }
        4 === t2.length ? (e2 = t2.substring(1, 2), e2 += e2, r2 = t2.substring(2, 3), r2 += r2, n3 = t2.substring(3, 4), n3 += n3) : (e2 = t2.substring(1, 3), r2 = t2.substring(3, 5), n3 = t2.substring(5, 7)), e2 = parseInt(e2, 16), r2 = parseInt(r2, 16), n3 = parseInt(n3, 16);
      }
    }
    return { r: e2, g: r2, b: n3, a: i3, style: t2 };
  }, m2 = function() {
    return this.ctx.isFillTransparent || 0 == this.globalAlpha;
  }, v2 = function() {
    return Boolean(this.ctx.isStrokeTransparent || 0 == this.globalAlpha);
  };
  p2.prototype.fillText = function(t2, e2, r2, n3) {
    if (isNaN(e2) || isNaN(r2) || "string" != typeof t2) throw a.error("jsPDF.context2d.fillText: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.fillText");
    if (n3 = isNaN(n3) ? void 0 : n3, !m2.call(this)) {
      var i3 = q2(this.ctx.transform.rotation), o3 = this.ctx.transform.scaleX;
      C2.call(this, { text: t2, x: e2, y: r2, scale: o3, angle: i3, align: this.textAlign, maxWidth: n3 });
    }
  }, p2.prototype.strokeText = function(t2, e2, r2, n3) {
    if (isNaN(e2) || isNaN(r2) || "string" != typeof t2) throw a.error("jsPDF.context2d.strokeText: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.strokeText");
    if (!v2.call(this)) {
      n3 = isNaN(n3) ? void 0 : n3;
      var i3 = q2(this.ctx.transform.rotation), o3 = this.ctx.transform.scaleX;
      C2.call(this, { text: t2, x: e2, y: r2, scale: o3, renderingMode: "stroke", angle: i3, align: this.textAlign, maxWidth: n3 });
    }
  }, p2.prototype.measureText = function(t2) {
    if ("string" != typeof t2) throw a.error("jsPDF.context2d.measureText: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.measureText");
    var e2 = this.pdf, r2 = this.pdf.internal.scaleFactor, n3 = e2.internal.getFontSize(), i3 = e2.getStringUnitWidth(t2) * n3 / e2.internal.scaleFactor, o3 = function(t3) {
      var e3 = (t3 = t3 || {}).width || 0;
      return Object.defineProperty(this, "width", { get: function() {
        return e3;
      } }), this;
    };
    return new o3({ width: i3 *= Math.round(96 * r2 / 72 * 1e4) / 1e4 });
  }, p2.prototype.scale = function(t2, e2) {
    if (isNaN(t2) || isNaN(e2)) throw a.error("jsPDF.context2d.scale: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.scale");
    var r2 = new h2(t2, 0, 0, e2, 0, 0);
    this.ctx.transform = this.ctx.transform.multiply(r2);
  }, p2.prototype.rotate = function(t2) {
    if (isNaN(t2)) throw a.error("jsPDF.context2d.rotate: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.rotate");
    var e2 = new h2(Math.cos(t2), Math.sin(t2), -Math.sin(t2), Math.cos(t2), 0, 0);
    this.ctx.transform = this.ctx.transform.multiply(e2);
  }, p2.prototype.translate = function(t2, e2) {
    if (isNaN(t2) || isNaN(e2)) throw a.error("jsPDF.context2d.translate: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.translate");
    var r2 = new h2(1, 0, 0, 1, t2, e2);
    this.ctx.transform = this.ctx.transform.multiply(r2);
  }, p2.prototype.transform = function(t2, e2, r2, n3, i3, o3) {
    if (isNaN(t2) || isNaN(e2) || isNaN(r2) || isNaN(n3) || isNaN(i3) || isNaN(o3)) throw a.error("jsPDF.context2d.transform: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.transform");
    var s3 = new h2(t2, e2, r2, n3, i3, o3);
    this.ctx.transform = this.ctx.transform.multiply(s3);
  }, p2.prototype.setTransform = function(t2, e2, r2, n3, i3, a2) {
    t2 = isNaN(t2) ? 1 : t2, e2 = isNaN(e2) ? 0 : e2, r2 = isNaN(r2) ? 0 : r2, n3 = isNaN(n3) ? 1 : n3, i3 = isNaN(i3) ? 0 : i3, a2 = isNaN(a2) ? 0 : a2, this.ctx.transform = new h2(t2, e2, r2, n3, i3, a2);
  };
  var b2 = function() {
    return this.margin[0] > 0 || this.margin[1] > 0 || this.margin[2] > 0 || this.margin[3] > 0;
  };
  p2.prototype.drawImage = function(t2, e2, r2, n3, i3, a2, o3, s3, c3) {
    var l3 = this.pdf.getImageProperties(t2), f2 = 1, d3 = 1, p3 = 1, g3 = 1;
    void 0 !== n3 && void 0 !== s3 && (p3 = s3 / n3, g3 = c3 / i3, f2 = l3.width / n3 * s3 / n3, d3 = l3.height / i3 * c3 / i3), void 0 === a2 && (a2 = e2, o3 = r2, e2 = 0, r2 = 0), void 0 !== n3 && void 0 === s3 && (s3 = n3, c3 = i3), void 0 === n3 && void 0 === s3 && (s3 = l3.width, c3 = l3.height);
    for (var m3, v3 = this.ctx.transform.decompose(), w3 = q2(v3.rotate.shx), A3 = new h2(), S3 = (A3 = (A3 = (A3 = A3.multiply(v3.translate)).multiply(v3.skew)).multiply(v3.scale)).applyToRectangle(new u2(a2 - e2 * p3, o3 - r2 * g3, n3 * f2, i3 * d3)), _3 = y2.call(this, S3), P3 = [], k3 = 0; k3 < _3.length; k3 += 1) -1 === P3.indexOf(_3[k3]) && P3.push(_3[k3]);
    if (L2(P3), this.autoPaging) for (var I3 = P3[0], F3 = P3[P3.length - 1], C3 = I3; C3 < F3 + 1; C3++) {
      this.pdf.setPage(C3);
      var j3 = this.pdf.internal.pageSize.width - this.margin[3] - this.margin[1], O3 = 1 === C3 ? this.posY + this.margin[0] : this.margin[0], B3 = this.pdf.internal.pageSize.height - this.posY - this.margin[0] - this.margin[2], M3 = this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2], E3 = 1 === C3 ? 0 : B3 + (C3 - 2) * M3;
      if (0 !== this.ctx.clip_path.length) {
        var D3 = this.path;
        m3 = JSON.parse(JSON.stringify(this.ctx.clip_path)), this.path = N2(m3, this.posX + this.margin[3], -E3 + O3 + this.ctx.prevPageLastElemOffset), x2.call(this, "fill", true), this.path = D3;
      }
      var R3 = JSON.parse(JSON.stringify(S3));
      R3 = N2([R3], this.posX + this.margin[3], -E3 + O3 + this.ctx.prevPageLastElemOffset)[0];
      var T3 = (C3 > I3 || C3 < F3) && b2.call(this);
      T3 && (this.pdf.saveGraphicsState(), this.pdf.rect(this.margin[3], this.margin[0], j3, M3, null).clip().discardPath()), this.pdf.addImage(t2, "JPEG", R3.x, R3.y, R3.w, R3.h, null, null, w3), T3 && this.pdf.restoreGraphicsState();
    }
    else this.pdf.addImage(t2, "JPEG", S3.x, S3.y, S3.w, S3.h, null, null, w3);
  };
  var y2 = function(t2, e2, r2) {
    var n3 = [];
    e2 = e2 || this.pdf.internal.pageSize.width, r2 = r2 || this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2];
    var i3 = this.posY + this.ctx.prevPageLastElemOffset;
    switch (t2.type) {
      default:
      case "mt":
      case "lt":
        n3.push(Math.floor((t2.y + i3) / r2) + 1);
        break;
      case "arc":
        n3.push(Math.floor((t2.y + i3 - t2.radius) / r2) + 1), n3.push(Math.floor((t2.y + i3 + t2.radius) / r2) + 1);
        break;
      case "qct":
        var a2 = D2(this.ctx.lastPoint.x, this.ctx.lastPoint.y, t2.x1, t2.y1, t2.x, t2.y);
        n3.push(Math.floor((a2.y + i3) / r2) + 1), n3.push(Math.floor((a2.y + a2.h + i3) / r2) + 1);
        break;
      case "bct":
        var o3 = R2(this.ctx.lastPoint.x, this.ctx.lastPoint.y, t2.x1, t2.y1, t2.x2, t2.y2, t2.x, t2.y);
        n3.push(Math.floor((o3.y + i3) / r2) + 1), n3.push(Math.floor((o3.y + o3.h + i3) / r2) + 1);
        break;
      case "rect":
        n3.push(Math.floor((t2.y + i3) / r2) + 1), n3.push(Math.floor((t2.y + t2.h + i3) / r2) + 1);
    }
    for (var s3 = 0; s3 < n3.length; s3 += 1) for (; this.pdf.internal.getNumberOfPages() < n3[s3]; ) w2.call(this);
    return n3;
  }, w2 = function() {
    var t2 = this.fillStyle, e2 = this.strokeStyle, r2 = this.font, n3 = this.lineCap, i3 = this.lineWidth, a2 = this.lineJoin;
    this.pdf.addPage(), this.fillStyle = t2, this.strokeStyle = e2, this.font = r2, this.lineCap = n3, this.lineWidth = i3, this.lineJoin = a2;
  }, N2 = function(t2, e2, r2) {
    for (var n3 = 0; n3 < t2.length; n3++) switch (t2[n3].type) {
      case "bct":
        t2[n3].x2 += e2, t2[n3].y2 += r2;
      case "qct":
        t2[n3].x1 += e2, t2[n3].y1 += r2;
      case "mt":
      case "lt":
      case "arc":
      default:
        t2[n3].x += e2, t2[n3].y += r2;
    }
    return t2;
  }, L2 = function(t2) {
    return t2.sort(function(t3, e2) {
      return t3 - e2;
    });
  }, A2 = function(t2, e2) {
    for (var r2, n3, i3 = this.fillStyle, a2 = this.strokeStyle, o3 = this.lineCap, s3 = this.lineWidth, c3 = Math.abs(s3 * this.ctx.transform.scaleX), u3 = this.lineJoin, h3 = JSON.parse(JSON.stringify(this.path)), l3 = JSON.parse(JSON.stringify(this.path)), f2 = [], d3 = 0; d3 < l3.length; d3++) if (void 0 !== l3[d3].x) for (var p3 = y2.call(this, l3[d3]), g3 = 0; g3 < p3.length; g3 += 1) -1 === f2.indexOf(p3[g3]) && f2.push(p3[g3]);
    for (var m3 = 0; m3 < f2.length; m3++) for (; this.pdf.internal.getNumberOfPages() < f2[m3]; ) w2.call(this);
    if (L2(f2), this.autoPaging) for (var v3 = f2[0], A3 = f2[f2.length - 1], S3 = v3; S3 < A3 + 1; S3++) {
      this.pdf.setPage(S3), this.fillStyle = i3, this.strokeStyle = a2, this.lineCap = o3, this.lineWidth = c3, this.lineJoin = u3;
      var _3 = this.pdf.internal.pageSize.width - this.margin[3] - this.margin[1], P3 = 1 === S3 ? this.posY + this.margin[0] : this.margin[0], k3 = this.pdf.internal.pageSize.height - this.posY - this.margin[0] - this.margin[2], I3 = this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2], F3 = 1 === S3 ? 0 : k3 + (S3 - 2) * I3;
      if (0 !== this.ctx.clip_path.length) {
        var C3 = this.path;
        r2 = JSON.parse(JSON.stringify(this.ctx.clip_path)), this.path = N2(r2, this.posX + this.margin[3], -F3 + P3 + this.ctx.prevPageLastElemOffset), x2.call(this, t2, true), this.path = C3;
      }
      if (n3 = JSON.parse(JSON.stringify(h3)), this.path = N2(n3, this.posX + this.margin[3], -F3 + P3 + this.ctx.prevPageLastElemOffset), false === e2 || 0 === S3) {
        var j3 = (S3 > v3 || S3 < A3) && b2.call(this);
        j3 && (this.pdf.saveGraphicsState(), this.pdf.rect(this.margin[3], this.margin[0], _3, I3, null).clip().discardPath()), x2.call(this, t2, e2), j3 && this.pdf.restoreGraphicsState();
      }
      this.lineWidth = s3;
    }
    else this.lineWidth = c3, x2.call(this, t2, e2), this.lineWidth = s3;
    this.path = h3;
  }, x2 = function(t2, e2) {
    if (("stroke" !== t2 || e2 || !v2.call(this)) && ("stroke" === t2 || e2 || !m2.call(this))) {
      for (var r2, n3, i3 = [], a2 = this.path, o3 = 0; o3 < a2.length; o3++) {
        var s3 = a2[o3];
        switch (s3.type) {
          case "begin":
            i3.push({ begin: true });
            break;
          case "close":
            i3.push({ close: true });
            break;
          case "mt":
            i3.push({ start: s3, deltas: [], abs: [] });
            break;
          case "lt":
            var c3 = i3.length;
            if (a2[o3 - 1] && !isNaN(a2[o3 - 1].x) && (r2 = [s3.x - a2[o3 - 1].x, s3.y - a2[o3 - 1].y], c3 > 0)) {
              for (; c3 >= 0; c3--) if (true !== i3[c3 - 1].close && true !== i3[c3 - 1].begin) {
                i3[c3 - 1].deltas.push(r2), i3[c3 - 1].abs.push(s3);
                break;
              }
            }
            break;
          case "bct":
            r2 = [s3.x1 - a2[o3 - 1].x, s3.y1 - a2[o3 - 1].y, s3.x2 - a2[o3 - 1].x, s3.y2 - a2[o3 - 1].y, s3.x - a2[o3 - 1].x, s3.y - a2[o3 - 1].y], i3[i3.length - 1].deltas.push(r2);
            break;
          case "qct":
            var u3 = a2[o3 - 1].x + 2 / 3 * (s3.x1 - a2[o3 - 1].x), h3 = a2[o3 - 1].y + 2 / 3 * (s3.y1 - a2[o3 - 1].y), l3 = s3.x + 2 / 3 * (s3.x1 - s3.x), f2 = s3.y + 2 / 3 * (s3.y1 - s3.y), d3 = s3.x, p3 = s3.y;
            r2 = [u3 - a2[o3 - 1].x, h3 - a2[o3 - 1].y, l3 - a2[o3 - 1].x, f2 - a2[o3 - 1].y, d3 - a2[o3 - 1].x, p3 - a2[o3 - 1].y], i3[i3.length - 1].deltas.push(r2);
            break;
          case "arc":
            i3.push({ deltas: [], abs: [], arc: true }), Array.isArray(i3[i3.length - 1].abs) && i3[i3.length - 1].abs.push(s3);
        }
      }
      n3 = e2 ? null : "stroke" === t2 ? "stroke" : "fill";
      for (var g3 = false, b3 = 0; b3 < i3.length; b3++) if (i3[b3].arc) for (var y3 = i3[b3].abs, w3 = 0; w3 < y3.length; w3++) {
        var N3 = y3[w3];
        "arc" === N3.type ? P2.call(this, N3.x, N3.y, N3.radius, N3.startAngle, N3.endAngle, N3.counterclockwise, void 0, e2, !g3) : j2.call(this, N3.x, N3.y), g3 = true;
      }
      else if (true === i3[b3].close) this.pdf.internal.out("h"), g3 = false;
      else if (true !== i3[b3].begin) {
        var L3 = i3[b3].start.x, A3 = i3[b3].start.y;
        O2.call(this, i3[b3].deltas, L3, A3), g3 = true;
      }
      n3 && k2.call(this, n3), e2 && I2.call(this);
    }
  }, S2 = function(t2) {
    var e2 = this.pdf.internal.getFontSize() / this.pdf.internal.scaleFactor, r2 = e2 * (this.pdf.internal.getLineHeightFactor() - 1);
    switch (this.ctx.textBaseline) {
      case "bottom":
        return t2 - r2;
      case "top":
        return t2 + e2 - r2;
      case "hanging":
        return t2 + e2 - 2 * r2;
      case "middle":
        return t2 + e2 / 2 - r2;
      case "ideographic":
        return t2;
      case "alphabetic":
      default:
        return t2;
    }
  }, _2 = function(t2) {
    return t2 + this.pdf.internal.getFontSize() / this.pdf.internal.scaleFactor * (this.pdf.internal.getLineHeightFactor() - 1);
  };
  p2.prototype.createLinearGradient = function() {
    var t2 = function() {
    };
    return t2.colorStops = [], t2.addColorStop = function(t3, e2) {
      this.colorStops.push([t3, e2]);
    }, t2.getColor = function() {
      return 0 === this.colorStops.length ? "#000000" : this.colorStops[0][1];
    }, t2.isCanvasGradient = true, t2;
  }, p2.prototype.createPattern = function() {
    return this.createLinearGradient();
  }, p2.prototype.createRadialGradient = function() {
    return this.createLinearGradient();
  };
  var P2 = function(t2, e2, r2, n3, i3, a2, o3, s3, c3) {
    for (var u3 = M2.call(this, r2, n3, i3, a2), h3 = 0; h3 < u3.length; h3++) {
      var l3 = u3[h3];
      0 === h3 && (c3 ? F2.call(this, l3.x1 + t2, l3.y1 + e2) : j2.call(this, l3.x1 + t2, l3.y1 + e2)), B2.call(this, t2, e2, l3.x2, l3.y2, l3.x3, l3.y3, l3.x4, l3.y4);
    }
    s3 ? I2.call(this) : k2.call(this, o3);
  }, k2 = function(t2) {
    switch (t2) {
      case "stroke":
        this.pdf.internal.out("S");
        break;
      case "fill":
        this.pdf.internal.out("f");
    }
  }, I2 = function() {
    this.pdf.clip(), this.pdf.discardPath();
  }, F2 = function(t2, e2) {
    this.pdf.internal.out(n2(t2) + " " + i2(e2) + " m");
  }, C2 = function(t2) {
    var e2;
    switch (t2.align) {
      case "right":
      case "end":
        e2 = "right";
        break;
      case "center":
        e2 = "center";
        break;
      case "left":
      case "start":
      default:
        e2 = "left";
    }
    var r2 = this.pdf.getTextDimensions(t2.text), n3 = S2.call(this, t2.y), i3 = _2.call(this, n3) - r2.h, a2 = this.ctx.transform.applyToPoint(new c2(t2.x, n3)), o3 = this.ctx.transform.decompose(), s3 = new h2();
    s3 = (s3 = (s3 = s3.multiply(o3.translate)).multiply(o3.skew)).multiply(o3.scale);
    for (var l3, f2, d3, p3 = this.ctx.transform.applyToRectangle(new u2(t2.x, n3, r2.w, r2.h)), g3 = s3.applyToRectangle(new u2(t2.x, i3, r2.w, r2.h)), m3 = y2.call(this, g3), v3 = [], w3 = 0; w3 < m3.length; w3 += 1) -1 === v3.indexOf(m3[w3]) && v3.push(m3[w3]);
    if (L2(v3), this.autoPaging) for (var A3 = v3[0], P3 = v3[v3.length - 1], k3 = A3; k3 < P3 + 1; k3++) {
      this.pdf.setPage(k3);
      var I3 = 1 === k3 ? this.posY + this.margin[0] : this.margin[0], F3 = this.pdf.internal.pageSize.height - this.posY - this.margin[0] - this.margin[2], C3 = this.pdf.internal.pageSize.height - this.margin[2], j3 = C3 - this.margin[0], O3 = this.pdf.internal.pageSize.width - this.margin[1], B3 = O3 - this.margin[3], M3 = 1 === k3 ? 0 : F3 + (k3 - 2) * j3;
      if (0 !== this.ctx.clip_path.length) {
        var E3 = this.path;
        l3 = JSON.parse(JSON.stringify(this.ctx.clip_path)), this.path = N2(l3, this.posX + this.margin[3], -1 * M3 + I3), x2.call(this, "fill", true), this.path = E3;
      }
      var q3 = N2([JSON.parse(JSON.stringify(g3))], this.posX + this.margin[3], -M3 + I3 + this.ctx.prevPageLastElemOffset)[0];
      t2.scale >= 0.01 && (f2 = this.pdf.internal.getFontSize(), this.pdf.setFontSize(f2 * t2.scale), d3 = this.lineWidth, this.lineWidth = d3 * t2.scale);
      var D3 = "text" !== this.autoPaging;
      if (D3 || q3.y + q3.h <= C3) {
        if (D3 || q3.y >= I3 && q3.x <= O3) {
          var R3 = D3 ? t2.text : this.pdf.splitTextToSize(t2.text, t2.maxWidth || O3 - q3.x)[0], T3 = N2([JSON.parse(JSON.stringify(p3))], this.posX + this.margin[3], -M3 + I3 + this.ctx.prevPageLastElemOffset)[0], U2 = D3 && (k3 > A3 || k3 < P3) && b2.call(this);
          U2 && (this.pdf.saveGraphicsState(), this.pdf.rect(this.margin[3], this.margin[0], B3, j3, null).clip().discardPath()), this.pdf.text(R3, T3.x, T3.y, { angle: t2.angle, align: e2, renderingMode: t2.renderingMode }), U2 && this.pdf.restoreGraphicsState();
        }
      } else q3.y < C3 && (this.ctx.prevPageLastElemOffset += C3 - q3.y);
      t2.scale >= 0.01 && (this.pdf.setFontSize(f2), this.lineWidth = d3);
    }
    else t2.scale >= 0.01 && (f2 = this.pdf.internal.getFontSize(), this.pdf.setFontSize(f2 * t2.scale), d3 = this.lineWidth, this.lineWidth = d3 * t2.scale), this.pdf.text(t2.text, a2.x + this.posX, a2.y + this.posY, { angle: t2.angle, align: e2, renderingMode: t2.renderingMode, maxWidth: t2.maxWidth }), t2.scale >= 0.01 && (this.pdf.setFontSize(f2), this.lineWidth = d3);
  }, j2 = function(t2, e2, r2, a2) {
    r2 = r2 || 0, a2 = a2 || 0, this.pdf.internal.out(n2(t2 + r2) + " " + i2(e2 + a2) + " l");
  }, O2 = function(t2, e2, r2) {
    return this.pdf.lines(t2, e2, r2, null, null);
  }, B2 = function(t2, e2, n3, i3, a2, c3, u3, h3) {
    this.pdf.internal.out([r(o2(n3 + t2)), r(s2(i3 + e2)), r(o2(a2 + t2)), r(s2(c3 + e2)), r(o2(u3 + t2)), r(s2(h3 + e2)), "c"].join(" "));
  }, M2 = function(t2, e2, r2, n3) {
    for (var i3 = 2 * Math.PI, a2 = Math.PI / 2; e2 > r2; ) e2 -= i3;
    var o3 = Math.abs(r2 - e2);
    o3 < i3 && n3 && (o3 = i3 - o3);
    for (var s3 = [], c3 = n3 ? -1 : 1, u3 = e2; o3 > 1e-5; ) {
      var h3 = u3 + c3 * Math.min(o3, a2);
      s3.push(E2.call(this, t2, u3, h3)), o3 -= Math.abs(h3 - u3), u3 = h3;
    }
    return s3;
  }, E2 = function(t2, e2, r2) {
    var n3 = (r2 - e2) / 2, i3 = t2 * Math.cos(n3), a2 = t2 * Math.sin(n3), o3 = i3, s3 = -a2, c3 = o3 * o3 + s3 * s3, u3 = c3 + o3 * i3 + s3 * a2, h3 = 4 / 3 * (Math.sqrt(2 * c3 * u3) - u3) / (o3 * a2 - s3 * i3), l3 = o3 - h3 * s3, f2 = s3 + h3 * o3, d3 = l3, p3 = -f2, g3 = n3 + e2, m3 = Math.cos(g3), v3 = Math.sin(g3);
    return { x1: t2 * Math.cos(e2), y1: t2 * Math.sin(e2), x2: l3 * m3 - f2 * v3, y2: l3 * v3 + f2 * m3, x3: d3 * m3 - p3 * v3, y3: d3 * v3 + p3 * m3, x4: t2 * Math.cos(r2), y4: t2 * Math.sin(r2) };
  }, q2 = function(t2) {
    return 180 * t2 / Math.PI;
  }, D2 = function(t2, e2, r2, n3, i3, a2) {
    var o3 = t2 + 0.5 * (r2 - t2), s3 = e2 + 0.5 * (n3 - e2), c3 = i3 + 0.5 * (r2 - i3), h3 = a2 + 0.5 * (n3 - a2), l3 = Math.min(t2, i3, o3, c3), f2 = Math.max(t2, i3, o3, c3), d3 = Math.min(e2, a2, s3, h3), p3 = Math.max(e2, a2, s3, h3);
    return new u2(l3, d3, f2 - l3, p3 - d3);
  }, R2 = function(t2, e2, r2, n3, i3, a2, o3, s3) {
    var c3, h3, l3, f2, d3, p3, g3, m3, v3, b3, y3, w3, N3, L3, A3 = r2 - t2, x3 = n3 - e2, S3 = i3 - r2, _3 = a2 - n3, P3 = o3 - i3, k3 = s3 - a2;
    for (h3 = 0; h3 < 41; h3++) v3 = (g3 = (l3 = t2 + (c3 = h3 / 40) * A3) + c3 * ((d3 = r2 + c3 * S3) - l3)) + c3 * (d3 + c3 * (i3 + c3 * P3 - d3) - g3), b3 = (m3 = (f2 = e2 + c3 * x3) + c3 * ((p3 = n3 + c3 * _3) - f2)) + c3 * (p3 + c3 * (a2 + c3 * k3 - p3) - m3), 0 == h3 ? (y3 = v3, w3 = b3, N3 = v3, L3 = b3) : (y3 = Math.min(y3, v3), w3 = Math.min(w3, b3), N3 = Math.max(N3, v3), L3 = Math.max(L3, b3));
    return new u2(Math.round(y3), Math.round(w3), Math.round(N3 - y3), Math.round(L3 - w3));
  }, T2 = function() {
    if (this.prevLineDash || this.ctx.lineDash.length || this.ctx.lineDashOffset) {
      var t2, e2, r2 = (t2 = this.ctx.lineDash, e2 = this.ctx.lineDashOffset, JSON.stringify({ lineDash: t2, lineDashOffset: e2 }));
      this.prevLineDash !== r2 && (this.pdf.setLineDash(this.ctx.lineDash, this.ctx.lineDashOffset), this.prevLineDash = r2);
    }
  };
}(E.API), /**
 * @license
 * jsPDF filters PlugIn
 * Copyright (c) 2014 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var r = function(t3) {
    var e, r2, n3, i3, a3, o2, s2, c2, u2, h2;
    for (r2 = [], n3 = 0, i3 = (t3 += e = "\0\0\0\0".slice(t3.length % 4 || 4)).length; i3 > n3; n3 += 4) 0 !== (a3 = (t3.charCodeAt(n3) << 24) + (t3.charCodeAt(n3 + 1) << 16) + (t3.charCodeAt(n3 + 2) << 8) + t3.charCodeAt(n3 + 3)) ? (o2 = (a3 = ((a3 = ((a3 = ((a3 = (a3 - (h2 = a3 % 85)) / 85) - (u2 = a3 % 85)) / 85) - (c2 = a3 % 85)) / 85) - (s2 = a3 % 85)) / 85) % 85, r2.push(o2 + 33, s2 + 33, c2 + 33, u2 + 33, h2 + 33)) : r2.push(122);
    return function(t4, e2) {
      for (var r3 = e2; r3 > 0; r3--) t4.pop();
    }(r2, e.length), String.fromCharCode.apply(String, r2) + "~>";
  }, n2 = function(t3) {
    var e, r2, n3, i3, a3, o2 = String, s2 = "length", c2 = 255, u2 = "charCodeAt", h2 = "slice", l2 = "replace";
    for (t3[h2](-2), t3 = t3[h2](0, -2)[l2](/\s/g, "")[l2]("z", "!!!!!"), n3 = [], i3 = 0, a3 = (t3 += e = "uuuuu"[h2](t3[s2] % 5 || 5))[s2]; a3 > i3; i3 += 5) r2 = 52200625 * (t3[u2](i3) - 33) + 614125 * (t3[u2](i3 + 1) - 33) + 7225 * (t3[u2](i3 + 2) - 33) + 85 * (t3[u2](i3 + 3) - 33) + (t3[u2](i3 + 4) - 33), n3.push(c2 & r2 >> 24, c2 & r2 >> 16, c2 & r2 >> 8, c2 & r2);
    return function(t4, e2) {
      for (var r3 = e2; r3 > 0; r3--) t4.pop();
    }(n3, e[s2]), o2.fromCharCode.apply(o2, n3);
  }, i2 = function(t3) {
    var e = new RegExp(/^([0-9A-Fa-f]{2})+$/);
    if (-1 !== (t3 = t3.replace(/\s/g, "")).indexOf(">") && (t3 = t3.substr(0, t3.indexOf(">"))), t3.length % 2 && (t3 += "0"), false === e.test(t3)) return "";
    for (var r2 = "", n3 = 0; n3 < t3.length; n3 += 2) r2 += String.fromCharCode("0x" + (t3[n3] + t3[n3 + 1]));
    return r2;
  }, a2 = function(t3) {
    for (var r2 = new Uint8Array(t3.length), n3 = t3.length; n3--; ) r2[n3] = t3.charCodeAt(n3);
    return t3 = (r2 = zlibSync(r2)).reduce(function(t4, e) {
      return t4 + String.fromCharCode(e);
    }, "");
  };
  t2.processDataByFilters = function(t3, e) {
    var o2 = 0, s2 = t3 || "", c2 = [];
    for ("string" == typeof (e = e || []) && (e = [e]), o2 = 0; o2 < e.length; o2 += 1) switch (e[o2]) {
      case "ASCII85Decode":
      case "/ASCII85Decode":
        s2 = n2(s2), c2.push("/ASCII85Encode");
        break;
      case "ASCII85Encode":
      case "/ASCII85Encode":
        s2 = r(s2), c2.push("/ASCII85Decode");
        break;
      case "ASCIIHexDecode":
      case "/ASCIIHexDecode":
        s2 = i2(s2), c2.push("/ASCIIHexEncode");
        break;
      case "ASCIIHexEncode":
      case "/ASCIIHexEncode":
        s2 = s2.split("").map(function(t4) {
          return ("0" + t4.charCodeAt().toString(16)).slice(-2);
        }).join("") + ">", c2.push("/ASCIIHexDecode");
        break;
      case "FlateEncode":
      case "/FlateEncode":
        s2 = a2(s2), c2.push("/FlateDecode");
        break;
      default:
        throw new Error('The filter: "' + e[o2] + '" is not implemented');
    }
    return { data: s2, reverseChain: c2.reverse().join(" ") };
  };
}(E.API), /**
 * @license
 * jsPDF fileloading PlugIn
 * Copyright (c) 2018 Aras Abbasi (aras.abbasi@gmail.com)
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  t2.loadFile = function(t3, e, r) {
    return function(t4, e2, r2) {
      e2 = false !== e2, r2 = "function" == typeof r2 ? r2 : function() {
      };
      var n2 = void 0;
      try {
        n2 = function(t5, e3, r3) {
          var n3 = new XMLHttpRequest(), i2 = 0, a2 = function(t6) {
            var e4 = t6.length, r4 = [], n4 = String.fromCharCode;
            for (i2 = 0; i2 < e4; i2 += 1) r4.push(n4(255 & t6.charCodeAt(i2)));
            return r4.join("");
          };
          if (n3.open("GET", t5, !e3), n3.overrideMimeType("text/plain; charset=x-user-defined"), false === e3 && (n3.onload = function() {
            200 === n3.status ? r3(a2(this.responseText)) : r3(void 0);
          }), n3.send(null), e3 && 200 === n3.status) return a2(n3.responseText);
        }(t4, e2, r2);
      } catch (t5) {
      }
      return n2;
    }(t3, e, r);
  }, t2.loadImageFile = t2.loadFile;
}(E.API), function(e) {
  function r() {
    return (n.html2canvas ? Promise.resolve(n.html2canvas) : import("./html2canvas.esm-Dtsxr8dG.js")).catch(function(t2) {
      return Promise.reject(new Error("Could not load html2canvas: " + t2));
    }).then(function(t2) {
      return t2.default ? t2.default : t2;
    });
  }
  function i2() {
    return (n.DOMPurify ? Promise.resolve(n.DOMPurify) : import("./purify.es-CeScs5jQ.js")).catch(function(t2) {
      return Promise.reject(new Error("Could not load dompurify: " + t2));
    }).then(function(t2) {
      return t2.default ? t2.default : t2;
    });
  }
  var a2 = function(e2) {
    var r2 = _typeof(e2);
    return "undefined" === r2 ? "undefined" : "string" === r2 || e2 instanceof String ? "string" : "number" === r2 || e2 instanceof Number ? "number" : "function" === r2 || e2 instanceof Function ? "function" : e2 && e2.constructor === Array ? "array" : e2 && 1 === e2.nodeType ? "element" : "object" === r2 ? "object" : "unknown";
  }, o2 = function(t2, e2) {
    var r2 = document.createElement(t2);
    for (var n2 in e2.className && (r2.className = e2.className), e2.innerHTML && e2.dompurify && (r2.innerHTML = e2.dompurify.sanitize(e2.innerHTML)), e2.style) r2.style[n2] = e2.style[n2];
    return r2;
  }, s2 = function t2(e2) {
    var r2 = Object.assign(t2.convert(Promise.resolve()), JSON.parse(JSON.stringify(t2.template))), n2 = t2.convert(Promise.resolve(), r2);
    return n2 = (n2 = n2.setProgress(1, t2, 1, [t2])).set(e2);
  };
  (s2.prototype = Object.create(Promise.prototype)).constructor = s2, s2.convert = function(t2, e2) {
    return t2.__proto__ = e2 || s2.prototype, t2;
  }, s2.template = { prop: { src: null, container: null, overlay: null, canvas: null, img: null, pdf: null, pageSize: null, callback: function() {
  } }, progress: { val: 0, state: null, n: 0, stack: [] }, opt: { filename: "file.pdf", margin: [0, 0, 0, 0], enableLinks: true, x: 0, y: 0, html2canvas: {}, jsPDF: {}, backgroundColor: "transparent" } }, s2.prototype.from = function(t2, e2) {
    return this.then(function() {
      switch (e2 = e2 || function(t3) {
        switch (a2(t3)) {
          case "string":
            return "string";
          case "element":
            return "canvas" === t3.nodeName.toLowerCase() ? "canvas" : "element";
          default:
            return "unknown";
        }
      }(t2)) {
        case "string":
          return this.then(i2).then(function(e3) {
            return this.set({ src: o2("div", { innerHTML: t2, dompurify: e3 }) });
          });
        case "element":
          return this.set({ src: t2 });
        case "canvas":
          return this.set({ canvas: t2 });
        case "img":
          return this.set({ img: t2 });
        default:
          return this.error("Unknown source type.");
      }
    });
  }, s2.prototype.to = function(t2) {
    switch (t2) {
      case "container":
        return this.toContainer();
      case "canvas":
        return this.toCanvas();
      case "img":
        return this.toImg();
      case "pdf":
        return this.toPdf();
      default:
        return this.error("Invalid target.");
    }
  }, s2.prototype.toContainer = function() {
    return this.thenList([function() {
      return this.prop.src || this.error("Cannot duplicate - no source HTML.");
    }, function() {
      return this.prop.pageSize || this.setPageSize();
    }]).then(function() {
      var t2 = { position: "relative", display: "inline-block", width: ("number" != typeof this.opt.width || isNaN(this.opt.width) || "number" != typeof this.opt.windowWidth || isNaN(this.opt.windowWidth) ? Math.max(this.prop.src.clientWidth, this.prop.src.scrollWidth, this.prop.src.offsetWidth) : this.opt.windowWidth) + "px", left: 0, right: 0, top: 0, margin: "auto", backgroundColor: this.opt.backgroundColor }, e2 = function t3(e3, r2) {
        for (var n2 = 3 === e3.nodeType ? document.createTextNode(e3.nodeValue) : e3.cloneNode(false), i3 = e3.firstChild; i3; i3 = i3.nextSibling) true !== r2 && 1 === i3.nodeType && "SCRIPT" === i3.nodeName || n2.appendChild(t3(i3, r2));
        return 1 === e3.nodeType && ("CANVAS" === e3.nodeName ? (n2.width = e3.width, n2.height = e3.height, n2.getContext("2d").drawImage(e3, 0, 0)) : "TEXTAREA" !== e3.nodeName && "SELECT" !== e3.nodeName || (n2.value = e3.value), n2.addEventListener("load", function() {
          n2.scrollTop = e3.scrollTop, n2.scrollLeft = e3.scrollLeft;
        }, true)), n2;
      }(this.prop.src, this.opt.html2canvas.javascriptEnabled);
      "BODY" === e2.tagName && (t2.height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) + "px"), this.prop.overlay = o2("div", { className: "html2pdf__overlay", style: { position: "fixed", overflow: "hidden", zIndex: 1e3, left: "-100000px", right: 0, bottom: 0, top: 0 } }), this.prop.container = o2("div", { className: "html2pdf__container", style: t2 }), this.prop.container.appendChild(e2), this.prop.container.firstChild.appendChild(o2("div", { style: { clear: "both", border: "0 none transparent", margin: 0, padding: 0, height: 0 } })), this.prop.container.style.float = "none", this.prop.overlay.appendChild(this.prop.container), document.body.appendChild(this.prop.overlay), this.prop.container.firstChild.style.position = "relative", this.prop.container.height = Math.max(this.prop.container.firstChild.clientHeight, this.prop.container.firstChild.scrollHeight, this.prop.container.firstChild.offsetHeight) + "px";
    });
  }, s2.prototype.toCanvas = function() {
    var t2 = [function() {
      return document.body.contains(this.prop.container) || this.toContainer();
    }];
    return this.thenList(t2).then(r).then(function(t3) {
      var e2 = Object.assign({}, this.opt.html2canvas);
      return delete e2.onrendered, t3(this.prop.container, e2);
    }).then(function(t3) {
      (this.opt.html2canvas.onrendered || function() {
      })(t3), this.prop.canvas = t3, document.body.removeChild(this.prop.overlay);
    });
  }, s2.prototype.toContext2d = function() {
    var t2 = [function() {
      return document.body.contains(this.prop.container) || this.toContainer();
    }];
    return this.thenList(t2).then(r).then(function(t3) {
      var e2 = this.opt.jsPDF, r2 = this.opt.fontFaces, n2 = "number" != typeof this.opt.width || isNaN(this.opt.width) || "number" != typeof this.opt.windowWidth || isNaN(this.opt.windowWidth) ? 1 : this.opt.width / this.opt.windowWidth, i3 = Object.assign({ async: true, allowTaint: true, scale: n2, scrollX: this.opt.scrollX || 0, scrollY: this.opt.scrollY || 0, backgroundColor: "#ffffff", imageTimeout: 15e3, logging: true, proxy: null, removeContainer: true, foreignObjectRendering: false, useCORS: false }, this.opt.html2canvas);
      if (delete i3.onrendered, e2.context2d.autoPaging = void 0 === this.opt.autoPaging || this.opt.autoPaging, e2.context2d.posX = this.opt.x, e2.context2d.posY = this.opt.y, e2.context2d.margin = this.opt.margin, e2.context2d.fontFaces = r2, r2) for (var a3 = 0; a3 < r2.length; ++a3) {
        var o3 = r2[a3], s3 = o3.src.find(function(t4) {
          return "truetype" === t4.format;
        });
        s3 && e2.addFont(s3.url, o3.ref.name, o3.ref.style);
      }
      return i3.windowHeight = i3.windowHeight || 0, i3.windowHeight = 0 == i3.windowHeight ? Math.max(this.prop.container.clientHeight, this.prop.container.scrollHeight, this.prop.container.offsetHeight) : i3.windowHeight, e2.context2d.save(true), t3(this.prop.container, i3);
    }).then(function(t3) {
      this.opt.jsPDF.context2d.restore(true), (this.opt.html2canvas.onrendered || function() {
      })(t3), this.prop.canvas = t3, document.body.removeChild(this.prop.overlay);
    });
  }, s2.prototype.toImg = function() {
    return this.thenList([function() {
      return this.prop.canvas || this.toCanvas();
    }]).then(function() {
      var t2 = this.prop.canvas.toDataURL("image/" + this.opt.image.type, this.opt.image.quality);
      this.prop.img = document.createElement("img"), this.prop.img.src = t2;
    });
  }, s2.prototype.toPdf = function() {
    return this.thenList([function() {
      return this.toContext2d();
    }]).then(function() {
      this.prop.pdf = this.prop.pdf || this.opt.jsPDF;
    });
  }, s2.prototype.output = function(t2, e2, r2) {
    return "img" === (r2 = r2 || "pdf").toLowerCase() || "image" === r2.toLowerCase() ? this.outputImg(t2, e2) : this.outputPdf(t2, e2);
  }, s2.prototype.outputPdf = function(t2, e2) {
    return this.thenList([function() {
      return this.prop.pdf || this.toPdf();
    }]).then(function() {
      return this.prop.pdf.output(t2, e2);
    });
  }, s2.prototype.outputImg = function(t2) {
    return this.thenList([function() {
      return this.prop.img || this.toImg();
    }]).then(function() {
      switch (t2) {
        case void 0:
        case "img":
          return this.prop.img;
        case "datauristring":
        case "dataurlstring":
          return this.prop.img.src;
        case "datauri":
        case "dataurl":
          return document.location.href = this.prop.img.src;
        default:
          throw 'Image output type "' + t2 + '" is not supported.';
      }
    });
  }, s2.prototype.save = function(t2) {
    return this.thenList([function() {
      return this.prop.pdf || this.toPdf();
    }]).set(t2 ? { filename: t2 } : null).then(function() {
      this.prop.pdf.save(this.opt.filename);
    });
  }, s2.prototype.doCallback = function() {
    return this.thenList([function() {
      return this.prop.pdf || this.toPdf();
    }]).then(function() {
      this.prop.callback(this.prop.pdf);
    });
  }, s2.prototype.set = function(t2) {
    if ("object" !== a2(t2)) return this;
    var e2 = Object.keys(t2 || {}).map(function(e3) {
      if (e3 in s2.template.prop) return function() {
        this.prop[e3] = t2[e3];
      };
      switch (e3) {
        case "margin":
          return this.setMargin.bind(this, t2.margin);
        case "jsPDF":
          return function() {
            return this.opt.jsPDF = t2.jsPDF, this.setPageSize();
          };
        case "pageSize":
          return this.setPageSize.bind(this, t2.pageSize);
        default:
          return function() {
            this.opt[e3] = t2[e3];
          };
      }
    }, this);
    return this.then(function() {
      return this.thenList(e2);
    });
  }, s2.prototype.get = function(t2, e2) {
    return this.then(function() {
      var r2 = t2 in s2.template.prop ? this.prop[t2] : this.opt[t2];
      return e2 ? e2(r2) : r2;
    });
  }, s2.prototype.setMargin = function(t2) {
    return this.then(function() {
      switch (a2(t2)) {
        case "number":
          t2 = [t2, t2, t2, t2];
        case "array":
          if (2 === t2.length && (t2 = [t2[0], t2[1], t2[0], t2[1]]), 4 === t2.length) break;
        default:
          return this.error("Invalid margin array.");
      }
      this.opt.margin = t2;
    }).then(this.setPageSize);
  }, s2.prototype.setPageSize = function(t2) {
    function e2(t3, e3) {
      return Math.floor(t3 * e3 / 72 * 96);
    }
    return this.then(function() {
      (t2 = t2 || E.getPageSize(this.opt.jsPDF)).hasOwnProperty("inner") || (t2.inner = { width: t2.width - this.opt.margin[1] - this.opt.margin[3], height: t2.height - this.opt.margin[0] - this.opt.margin[2] }, t2.inner.px = { width: e2(t2.inner.width, t2.k), height: e2(t2.inner.height, t2.k) }, t2.inner.ratio = t2.inner.height / t2.inner.width), this.prop.pageSize = t2;
    });
  }, s2.prototype.setProgress = function(t2, e2, r2, n2) {
    return null != t2 && (this.progress.val = t2), null != e2 && (this.progress.state = e2), null != r2 && (this.progress.n = r2), null != n2 && (this.progress.stack = n2), this.progress.ratio = this.progress.val / this.progress.state, this;
  }, s2.prototype.updateProgress = function(t2, e2, r2, n2) {
    return this.setProgress(t2 ? this.progress.val + t2 : null, e2 || null, r2 ? this.progress.n + r2 : null, n2 ? this.progress.stack.concat(n2) : null);
  }, s2.prototype.then = function(t2, e2) {
    var r2 = this;
    return this.thenCore(t2, e2, function(t3, e3) {
      return r2.updateProgress(null, null, 1, [t3]), Promise.prototype.then.call(this, function(e4) {
        return r2.updateProgress(null, t3), e4;
      }).then(t3, e3).then(function(t4) {
        return r2.updateProgress(1), t4;
      });
    });
  }, s2.prototype.thenCore = function(t2, e2, r2) {
    r2 = r2 || Promise.prototype.then;
    t2 && (t2 = t2.bind(this)), e2 && (e2 = e2.bind(this));
    var n2 = -1 !== Promise.toString().indexOf("[native code]") && "Promise" === Promise.name ? this : s2.convert(Object.assign({}, this), Promise.prototype), i3 = r2.call(n2, t2, e2);
    return s2.convert(i3, this.__proto__);
  }, s2.prototype.thenExternal = function(t2, e2) {
    return Promise.prototype.then.call(this, t2, e2);
  }, s2.prototype.thenList = function(t2) {
    var e2 = this;
    return t2.forEach(function(t3) {
      e2 = e2.thenCore(t3);
    }), e2;
  }, s2.prototype.catch = function(t2) {
    t2 && (t2 = t2.bind(this));
    var e2 = Promise.prototype.catch.call(this, t2);
    return s2.convert(e2, this);
  }, s2.prototype.catchExternal = function(t2) {
    return Promise.prototype.catch.call(this, t2);
  }, s2.prototype.error = function(t2) {
    return this.then(function() {
      throw new Error(t2);
    });
  }, s2.prototype.using = s2.prototype.set, s2.prototype.saveAs = s2.prototype.save, s2.prototype.export = s2.prototype.output, s2.prototype.run = s2.prototype.then, E.getPageSize = function(e2, r2, n2) {
    if ("object" === _typeof(e2)) {
      var i3 = e2;
      e2 = i3.orientation, r2 = i3.unit || r2, n2 = i3.format || n2;
    }
    r2 = r2 || "mm", n2 = n2 || "a4", e2 = ("" + (e2 || "P")).toLowerCase();
    var a3, o3 = ("" + n2).toLowerCase(), s3 = { a0: [2383.94, 3370.39], a1: [1683.78, 2383.94], a2: [1190.55, 1683.78], a3: [841.89, 1190.55], a4: [595.28, 841.89], a5: [419.53, 595.28], a6: [297.64, 419.53], a7: [209.76, 297.64], a8: [147.4, 209.76], a9: [104.88, 147.4], a10: [73.7, 104.88], b0: [2834.65, 4008.19], b1: [2004.09, 2834.65], b2: [1417.32, 2004.09], b3: [1000.63, 1417.32], b4: [708.66, 1000.63], b5: [498.9, 708.66], b6: [354.33, 498.9], b7: [249.45, 354.33], b8: [175.75, 249.45], b9: [124.72, 175.75], b10: [87.87, 124.72], c0: [2599.37, 3676.54], c1: [1836.85, 2599.37], c2: [1298.27, 1836.85], c3: [918.43, 1298.27], c4: [649.13, 918.43], c5: [459.21, 649.13], c6: [323.15, 459.21], c7: [229.61, 323.15], c8: [161.57, 229.61], c9: [113.39, 161.57], c10: [79.37, 113.39], dl: [311.81, 623.62], letter: [612, 792], "government-letter": [576, 756], legal: [612, 1008], "junior-legal": [576, 360], ledger: [1224, 792], tabloid: [792, 1224], "credit-card": [153, 243] };
    switch (r2) {
      case "pt":
        a3 = 1;
        break;
      case "mm":
        a3 = 72 / 25.4;
        break;
      case "cm":
        a3 = 72 / 2.54;
        break;
      case "in":
        a3 = 72;
        break;
      case "px":
        a3 = 0.75;
        break;
      case "pc":
      case "em":
        a3 = 12;
        break;
      case "ex":
        a3 = 6;
        break;
      default:
        throw "Invalid unit: " + r2;
    }
    var c2, u2 = 0, h2 = 0;
    if (s3.hasOwnProperty(o3)) u2 = s3[o3][1] / a3, h2 = s3[o3][0] / a3;
    else try {
      u2 = n2[1], h2 = n2[0];
    } catch (t2) {
      throw new Error("Invalid format: " + n2);
    }
    if ("p" === e2 || "portrait" === e2) e2 = "p", h2 > u2 && (c2 = h2, h2 = u2, u2 = c2);
    else {
      if ("l" !== e2 && "landscape" !== e2) throw "Invalid orientation: " + e2;
      e2 = "l", u2 > h2 && (c2 = h2, h2 = u2, u2 = c2);
    }
    return { width: h2, height: u2, unit: r2, k: a3, orientation: e2 };
  }, e.html = function(t2, e2) {
    (e2 = e2 || {}).callback = e2.callback || function() {
    }, e2.html2canvas = e2.html2canvas || {}, e2.html2canvas.canvas = e2.html2canvas.canvas || this.canvas, e2.jsPDF = e2.jsPDF || this, e2.fontFaces = e2.fontFaces ? e2.fontFaces.map(jt) : null;
    var r2 = new s2(e2);
    return e2.worker ? r2 : r2.from(t2).doCallback();
  };
}(E.API), E.API.addJS = function(t2) {
  return Ht = t2, this.internal.events.subscribe("postPutResources", function() {
    Ut = this.internal.newObject(), this.internal.out("<<"), this.internal.out("/Names [(EmbeddedJS) " + (Ut + 1) + " 0 R]"), this.internal.out(">>"), this.internal.out("endobj"), zt = this.internal.newObject(), this.internal.out("<<"), this.internal.out("/S /JavaScript"), this.internal.out("/JS (" + Ht + ")"), this.internal.out(">>"), this.internal.out("endobj");
  }), this.internal.events.subscribe("putCatalog", function() {
    void 0 !== Ut && void 0 !== zt && this.internal.out("/Names <</JavaScript " + Ut + " 0 R>>");
  }), this;
}, /**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e;
  t2.events.push(["postPutResources", function() {
    var t3 = this, r = /^(\d+) 0 obj$/;
    if (this.outline.root.children.length > 0) for (var n2 = t3.outline.render().split(/\r\n/), i2 = 0; i2 < n2.length; i2++) {
      var a2 = n2[i2], o2 = r.exec(a2);
      if (null != o2) {
        var s2 = o2[1];
        t3.internal.newObjectDeferredBegin(s2, false);
      }
      t3.internal.write(a2);
    }
    if (this.outline.createNamedDestinations) {
      var c2 = this.internal.pages.length, u2 = [];
      for (i2 = 0; i2 < c2; i2++) {
        var h2 = t3.internal.newObject();
        u2.push(h2);
        var l2 = t3.internal.getPageInfo(i2 + 1);
        t3.internal.write("<< /D[" + l2.objId + " 0 R /XYZ null null null]>> endobj");
      }
      var f2 = t3.internal.newObject();
      t3.internal.write("<< /Names [ ");
      for (i2 = 0; i2 < u2.length; i2++) t3.internal.write("(page_" + (i2 + 1) + ")" + u2[i2] + " 0 R");
      t3.internal.write(" ] >>", "endobj"), e = t3.internal.newObject(), t3.internal.write("<< /Dests " + f2 + " 0 R"), t3.internal.write(">>", "endobj");
    }
  }]), t2.events.push(["putCatalog", function() {
    this.outline.root.children.length > 0 && (this.internal.write("/Outlines", this.outline.makeRef(this.outline.root)), this.outline.createNamedDestinations && this.internal.write("/Names " + e + " 0 R"));
  }]), t2.events.push(["initialized", function() {
    var t3 = this;
    t3.outline = { createNamedDestinations: false, root: { children: [] } }, t3.outline.add = function(t4, e2, r) {
      var n2 = { title: e2, options: r, children: [] };
      return null == t4 && (t4 = this.root), t4.children.push(n2), n2;
    }, t3.outline.render = function() {
      return this.ctx = {}, this.ctx.val = "", this.ctx.pdf = t3, this.genIds_r(this.root), this.renderRoot(this.root), this.renderItems(this.root), this.ctx.val;
    }, t3.outline.genIds_r = function(e2) {
      e2.id = t3.internal.newObjectDeferred();
      for (var r = 0; r < e2.children.length; r++) this.genIds_r(e2.children[r]);
    }, t3.outline.renderRoot = function(t4) {
      this.objStart(t4), this.line("/Type /Outlines"), t4.children.length > 0 && (this.line("/First " + this.makeRef(t4.children[0])), this.line("/Last " + this.makeRef(t4.children[t4.children.length - 1]))), this.line("/Count " + this.count_r({ count: 0 }, t4)), this.objEnd();
    }, t3.outline.renderItems = function(e2) {
      for (var r = this.ctx.pdf.internal.getVerticalCoordinateString, n2 = 0; n2 < e2.children.length; n2++) {
        var i2 = e2.children[n2];
        this.objStart(i2), this.line("/Title " + this.makeString(i2.title)), this.line("/Parent " + this.makeRef(e2)), n2 > 0 && this.line("/Prev " + this.makeRef(e2.children[n2 - 1])), n2 < e2.children.length - 1 && this.line("/Next " + this.makeRef(e2.children[n2 + 1])), i2.children.length > 0 && (this.line("/First " + this.makeRef(i2.children[0])), this.line("/Last " + this.makeRef(i2.children[i2.children.length - 1])));
        var a2 = this.count = this.count_r({ count: 0 }, i2);
        if (a2 > 0 && this.line("/Count " + a2), i2.options && i2.options.pageNumber) {
          var o2 = t3.internal.getPageInfo(i2.options.pageNumber);
          this.line("/Dest [" + o2.objId + " 0 R /XYZ 0 " + r(0) + " 0]");
        }
        this.objEnd();
      }
      for (var s2 = 0; s2 < e2.children.length; s2++) this.renderItems(e2.children[s2]);
    }, t3.outline.line = function(t4) {
      this.ctx.val += t4 + "\r\n";
    }, t3.outline.makeRef = function(t4) {
      return t4.id + " 0 R";
    }, t3.outline.makeString = function(e2) {
      return "(" + t3.internal.pdfEscape(e2) + ")";
    }, t3.outline.objStart = function(t4) {
      this.ctx.val += "\r\n" + t4.id + " 0 obj\r\n<<\r\n";
    }, t3.outline.objEnd = function() {
      this.ctx.val += ">> \r\nendobj\r\n";
    }, t3.outline.count_r = function(t4, e2) {
      for (var r = 0; r < e2.children.length; r++) t4.count++, this.count_r(t4, e2.children[r]);
      return t4.count;
    };
  }]);
}(E.API), /**
 * @license
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e = [192, 193, 194, 195, 196, 197, 198, 199];
  t2.processJPEG = function(t3, r, n2, i2, a2, o2) {
    var s2, c2 = this.decode.DCT_DECODE, u2 = null;
    if ("string" == typeof t3 || this.__addimage__.isArrayBuffer(t3) || this.__addimage__.isArrayBufferView(t3)) {
      switch (t3 = a2 || t3, t3 = this.__addimage__.isArrayBuffer(t3) ? new Uint8Array(t3) : t3, (s2 = function(t4) {
        for (var r2, n3 = 256 * t4.charCodeAt(4) + t4.charCodeAt(5), i3 = t4.length, a3 = { width: 0, height: 0, numcomponents: 1 }, o3 = 4; o3 < i3; o3 += 2) {
          if (o3 += n3, -1 !== e.indexOf(t4.charCodeAt(o3 + 1))) {
            r2 = 256 * t4.charCodeAt(o3 + 5) + t4.charCodeAt(o3 + 6), a3 = { width: 256 * t4.charCodeAt(o3 + 7) + t4.charCodeAt(o3 + 8), height: r2, numcomponents: t4.charCodeAt(o3 + 9) };
            break;
          }
          n3 = 256 * t4.charCodeAt(o3 + 2) + t4.charCodeAt(o3 + 3);
        }
        return a3;
      }(t3 = this.__addimage__.isArrayBufferView(t3) ? this.__addimage__.arrayBufferToBinaryString(t3) : t3)).numcomponents) {
        case 1:
          o2 = this.color_spaces.DEVICE_GRAY;
          break;
        case 4:
          o2 = this.color_spaces.DEVICE_CMYK;
          break;
        case 3:
          o2 = this.color_spaces.DEVICE_RGB;
      }
      u2 = { data: t3, width: s2.width, height: s2.height, colorSpace: o2, bitsPerComponent: 8, filter: c2, index: r, alias: n2 };
    }
    return u2;
  };
}(E.API);
var Vt, Gt, Yt, Jt, Xt, Kt = function() {
  var t2, e, i2;
  function a2(t3) {
    var e2, r, n2, i3, a3, o3, s2, c2, u2, h2, l2, f2, d2, p2;
    for (this.data = t3, this.pos = 8, this.palette = [], this.imgData = [], this.transparency = {}, this.animation = null, this.text = {}, o3 = null; ; ) {
      switch (e2 = this.readUInt32(), u2 = function() {
        var t4, e3;
        for (e3 = [], t4 = 0; t4 < 4; ++t4) e3.push(String.fromCharCode(this.data[this.pos++]));
        return e3;
      }.call(this).join("")) {
        case "IHDR":
          this.width = this.readUInt32(), this.height = this.readUInt32(), this.bits = this.data[this.pos++], this.colorType = this.data[this.pos++], this.compressionMethod = this.data[this.pos++], this.filterMethod = this.data[this.pos++], this.interlaceMethod = this.data[this.pos++];
          break;
        case "acTL":
          this.animation = { numFrames: this.readUInt32(), numPlays: this.readUInt32() || 1 / 0, frames: [] };
          break;
        case "PLTE":
          this.palette = this.read(e2);
          break;
        case "fcTL":
          o3 && this.animation.frames.push(o3), this.pos += 4, o3 = { width: this.readUInt32(), height: this.readUInt32(), xOffset: this.readUInt32(), yOffset: this.readUInt32() }, a3 = this.readUInt16(), i3 = this.readUInt16() || 100, o3.delay = 1e3 * a3 / i3, o3.disposeOp = this.data[this.pos++], o3.blendOp = this.data[this.pos++], o3.data = [];
          break;
        case "IDAT":
        case "fdAT":
          for ("fdAT" === u2 && (this.pos += 4, e2 -= 4), t3 = (null != o3 ? o3.data : void 0) || this.imgData, f2 = 0; 0 <= e2 ? f2 < e2 : f2 > e2; 0 <= e2 ? ++f2 : --f2) t3.push(this.data[this.pos++]);
          break;
        case "tRNS":
          switch (this.transparency = {}, this.colorType) {
            case 3:
              if (n2 = this.palette.length / 3, this.transparency.indexed = this.read(e2), this.transparency.indexed.length > n2) throw new Error("More transparent colors than palette size");
              if ((h2 = n2 - this.transparency.indexed.length) > 0) for (d2 = 0; 0 <= h2 ? d2 < h2 : d2 > h2; 0 <= h2 ? ++d2 : --d2) this.transparency.indexed.push(255);
              break;
            case 0:
              this.transparency.grayscale = this.read(e2)[0];
              break;
            case 2:
              this.transparency.rgb = this.read(e2);
          }
          break;
        case "tEXt":
          s2 = (l2 = this.read(e2)).indexOf(0), c2 = String.fromCharCode.apply(String, l2.slice(0, s2)), this.text[c2] = String.fromCharCode.apply(String, l2.slice(s2 + 1));
          break;
        case "IEND":
          return o3 && this.animation.frames.push(o3), this.colors = function() {
            switch (this.colorType) {
              case 0:
              case 3:
              case 4:
                return 1;
              case 2:
              case 6:
                return 3;
            }
          }.call(this), this.hasAlphaChannel = 4 === (p2 = this.colorType) || 6 === p2, r = this.colors + (this.hasAlphaChannel ? 1 : 0), this.pixelBitlength = this.bits * r, this.colorSpace = function() {
            switch (this.colors) {
              case 1:
                return "DeviceGray";
              case 3:
                return "DeviceRGB";
            }
          }.call(this), void (this.imgData = new Uint8Array(this.imgData));
        default:
          this.pos += e2;
      }
      if (this.pos += 4, this.pos > this.data.length) throw new Error("Incomplete or corrupt PNG file");
    }
  }
  a2.prototype.read = function(t3) {
    var e2, r;
    for (r = [], e2 = 0; 0 <= t3 ? e2 < t3 : e2 > t3; 0 <= t3 ? ++e2 : --e2) r.push(this.data[this.pos++]);
    return r;
  }, a2.prototype.readUInt32 = function() {
    return this.data[this.pos++] << 24 | this.data[this.pos++] << 16 | this.data[this.pos++] << 8 | this.data[this.pos++];
  }, a2.prototype.readUInt16 = function() {
    return this.data[this.pos++] << 8 | this.data[this.pos++];
  }, a2.prototype.decodePixels = function(t3) {
    var e2 = this.pixelBitlength / 8, n2 = new Uint8Array(this.width * this.height * e2), i3 = 0, a3 = this;
    if (null == t3 && (t3 = this.imgData), 0 === t3.length) return new Uint8Array(0);
    function o3(r, o4, s2, c2) {
      var u2, h2, l2, f2, d2, p2, g2, m2, v2, b2, y2, w2, N2, L2, A2, x2, S2, _2, P2, k2, I2, F2 = Math.ceil((a3.width - r) / s2), C2 = Math.ceil((a3.height - o4) / c2), j2 = a3.width == F2 && a3.height == C2;
      for (L2 = e2 * F2, w2 = j2 ? n2 : new Uint8Array(L2 * C2), p2 = t3.length, N2 = 0, h2 = 0; N2 < C2 && i3 < p2; ) {
        switch (t3[i3++]) {
          case 0:
            for (f2 = S2 = 0; S2 < L2; f2 = S2 += 1) w2[h2++] = t3[i3++];
            break;
          case 1:
            for (f2 = _2 = 0; _2 < L2; f2 = _2 += 1) u2 = t3[i3++], d2 = f2 < e2 ? 0 : w2[h2 - e2], w2[h2++] = (u2 + d2) % 256;
            break;
          case 2:
            for (f2 = P2 = 0; P2 < L2; f2 = P2 += 1) u2 = t3[i3++], l2 = (f2 - f2 % e2) / e2, A2 = N2 && w2[(N2 - 1) * L2 + l2 * e2 + f2 % e2], w2[h2++] = (A2 + u2) % 256;
            break;
          case 3:
            for (f2 = k2 = 0; k2 < L2; f2 = k2 += 1) u2 = t3[i3++], l2 = (f2 - f2 % e2) / e2, d2 = f2 < e2 ? 0 : w2[h2 - e2], A2 = N2 && w2[(N2 - 1) * L2 + l2 * e2 + f2 % e2], w2[h2++] = (u2 + Math.floor((d2 + A2) / 2)) % 256;
            break;
          case 4:
            for (f2 = I2 = 0; I2 < L2; f2 = I2 += 1) u2 = t3[i3++], l2 = (f2 - f2 % e2) / e2, d2 = f2 < e2 ? 0 : w2[h2 - e2], 0 === N2 ? A2 = x2 = 0 : (A2 = w2[(N2 - 1) * L2 + l2 * e2 + f2 % e2], x2 = l2 && w2[(N2 - 1) * L2 + (l2 - 1) * e2 + f2 % e2]), g2 = d2 + A2 - x2, m2 = Math.abs(g2 - d2), b2 = Math.abs(g2 - A2), y2 = Math.abs(g2 - x2), v2 = m2 <= b2 && m2 <= y2 ? d2 : b2 <= y2 ? A2 : x2, w2[h2++] = (u2 + v2) % 256;
            break;
          default:
            throw new Error("Invalid filter algorithm: " + t3[i3 - 1]);
        }
        if (!j2) {
          var O2 = ((o4 + N2 * c2) * a3.width + r) * e2, B2 = N2 * L2;
          for (f2 = 0; f2 < F2; f2 += 1) {
            for (var M2 = 0; M2 < e2; M2 += 1) n2[O2++] = w2[B2++];
            O2 += (s2 - 1) * e2;
          }
        }
        N2++;
      }
    }
    return t3 = unzlibSync(t3), 1 == a3.interlaceMethod ? (o3(0, 0, 8, 8), o3(4, 0, 8, 8), o3(0, 4, 4, 8), o3(2, 0, 4, 4), o3(0, 2, 2, 4), o3(1, 0, 2, 2), o3(0, 1, 1, 2)) : o3(0, 0, 1, 1), n2;
  }, a2.prototype.decodePalette = function() {
    var t3, e2, r, n2, i3, a3, o3, s2, c2;
    for (r = this.palette, a3 = this.transparency.indexed || [], i3 = new Uint8Array((a3.length || 0) + r.length), n2 = 0, t3 = 0, e2 = o3 = 0, s2 = r.length; o3 < s2; e2 = o3 += 3) i3[n2++] = r[e2], i3[n2++] = r[e2 + 1], i3[n2++] = r[e2 + 2], i3[n2++] = null != (c2 = a3[t3++]) ? c2 : 255;
    return i3;
  }, a2.prototype.copyToImageData = function(t3, e2) {
    var r, n2, i3, a3, o3, s2, c2, u2, h2, l2, f2;
    if (n2 = this.colors, h2 = null, r = this.hasAlphaChannel, this.palette.length && (h2 = null != (f2 = this._decodedPalette) ? f2 : this._decodedPalette = this.decodePalette(), n2 = 4, r = true), u2 = (i3 = t3.data || t3).length, o3 = h2 || e2, a3 = s2 = 0, 1 === n2) for (; a3 < u2; ) c2 = h2 ? 4 * e2[a3 / 4] : s2, l2 = o3[c2++], i3[a3++] = l2, i3[a3++] = l2, i3[a3++] = l2, i3[a3++] = r ? o3[c2++] : 255, s2 = c2;
    else for (; a3 < u2; ) c2 = h2 ? 4 * e2[a3 / 4] : s2, i3[a3++] = o3[c2++], i3[a3++] = o3[c2++], i3[a3++] = o3[c2++], i3[a3++] = r ? o3[c2++] : 255, s2 = c2;
  }, a2.prototype.decode = function() {
    var t3;
    return t3 = new Uint8Array(this.width * this.height * 4), this.copyToImageData(t3, this.decodePixels()), t3;
  };
  var o2 = function() {
    if ("[object Window]" === Object.prototype.toString.call(n)) {
      try {
        e = n.document.createElement("canvas"), i2 = e.getContext("2d");
      } catch (t3) {
        return false;
      }
      return true;
    }
    return false;
  };
  return o2(), t2 = function(t3) {
    var r;
    if (true === o2()) return i2.width = t3.width, i2.height = t3.height, i2.clearRect(0, 0, t3.width, t3.height), i2.putImageData(t3, 0, 0), (r = new Image()).src = e.toDataURL(), r;
    throw new Error("This method requires a Browser with Canvas-capability.");
  }, a2.prototype.decodeFrames = function(e2) {
    var r, n2, i3, a3, o3, s2, c2, u2;
    if (this.animation) {
      for (u2 = [], n2 = o3 = 0, s2 = (c2 = this.animation.frames).length; o3 < s2; n2 = ++o3) r = c2[n2], i3 = e2.createImageData(r.width, r.height), a3 = this.decodePixels(new Uint8Array(r.data)), this.copyToImageData(i3, a3), r.imageData = i3, u2.push(r.image = t2(i3));
      return u2;
    }
  }, a2.prototype.renderFrame = function(t3, e2) {
    var r, n2, i3;
    return r = (n2 = this.animation.frames)[e2], i3 = n2[e2 - 1], 0 === e2 && t3.clearRect(0, 0, this.width, this.height), 1 === (null != i3 ? i3.disposeOp : void 0) ? t3.clearRect(i3.xOffset, i3.yOffset, i3.width, i3.height) : 2 === (null != i3 ? i3.disposeOp : void 0) && t3.putImageData(i3.imageData, i3.xOffset, i3.yOffset), 0 === r.blendOp && t3.clearRect(r.xOffset, r.yOffset, r.width, r.height), t3.drawImage(r.image, r.xOffset, r.yOffset);
  }, a2.prototype.animate = function(t3) {
    var e2, r, n2, i3, a3, o3, s2 = this;
    return r = 0, o3 = this.animation, i3 = o3.numFrames, n2 = o3.frames, a3 = o3.numPlays, (e2 = function() {
      var o4, c2;
      if (o4 = r++ % i3, c2 = n2[o4], s2.renderFrame(t3, o4), i3 > 1 && r / i3 < a3) return s2.animation._timeout = setTimeout(e2, c2.delay);
    })();
  }, a2.prototype.stopAnimation = function() {
    var t3;
    return clearTimeout(null != (t3 = this.animation) ? t3._timeout : void 0);
  }, a2.prototype.render = function(t3) {
    var e2, r;
    return t3._png && t3._png.stopAnimation(), t3._png = this, t3.width = this.width, t3.height = this.height, e2 = t3.getContext("2d"), this.animation ? (this.decodeFrames(e2), this.animate(e2)) : (r = e2.createImageData(this.width, this.height), this.copyToImageData(r, this.decodePixels()), e2.putImageData(r, 0, 0));
  }, a2;
}();
/**
 * @license
 *
 * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
/**
 * @license
 * (c) Dean McNamee <dean@gmail.com>, 2013.
 *
 * https://github.com/deanm/omggif
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * omggif is a JavaScript implementation of a GIF 89a encoder and decoder,
 * including animation and compression.  It does not rely on any specific
 * underlying system, so should run in the browser, Node, or Plask.
 */
function Zt(t2) {
  var e = 0;
  if (71 !== t2[e++] || 73 !== t2[e++] || 70 !== t2[e++] || 56 !== t2[e++] || 56 != (t2[e++] + 1 & 253) || 97 !== t2[e++]) throw new Error("Invalid GIF 87a/89a header.");
  var r = t2[e++] | t2[e++] << 8, n2 = t2[e++] | t2[e++] << 8, i2 = t2[e++], a2 = i2 >> 7, o2 = 1 << (7 & i2) + 1;
  t2[e++];
  t2[e++];
  var s2 = null, c2 = null;
  a2 && (s2 = e, c2 = o2, e += 3 * o2);
  var u2 = true, h2 = [], l2 = 0, f2 = null, d2 = 0, p2 = null;
  for (this.width = r, this.height = n2; u2 && e < t2.length; ) switch (t2[e++]) {
    case 33:
      switch (t2[e++]) {
        case 255:
          if (11 !== t2[e] || 78 == t2[e + 1] && 69 == t2[e + 2] && 84 == t2[e + 3] && 83 == t2[e + 4] && 67 == t2[e + 5] && 65 == t2[e + 6] && 80 == t2[e + 7] && 69 == t2[e + 8] && 50 == t2[e + 9] && 46 == t2[e + 10] && 48 == t2[e + 11] && 3 == t2[e + 12] && 1 == t2[e + 13] && 0 == t2[e + 16]) e += 14, p2 = t2[e++] | t2[e++] << 8, e++;
          else for (e += 12; ; ) {
            if (!((P2 = t2[e++]) >= 0)) throw Error("Invalid block size");
            if (0 === P2) break;
            e += P2;
          }
          break;
        case 249:
          if (4 !== t2[e++] || 0 !== t2[e + 4]) throw new Error("Invalid graphics extension block.");
          var g2 = t2[e++];
          l2 = t2[e++] | t2[e++] << 8, f2 = t2[e++], 0 == (1 & g2) && (f2 = null), d2 = g2 >> 2 & 7, e++;
          break;
        case 254:
          for (; ; ) {
            if (!((P2 = t2[e++]) >= 0)) throw Error("Invalid block size");
            if (0 === P2) break;
            e += P2;
          }
          break;
        default:
          throw new Error("Unknown graphic control label: 0x" + t2[e - 1].toString(16));
      }
      break;
    case 44:
      var m2 = t2[e++] | t2[e++] << 8, v2 = t2[e++] | t2[e++] << 8, b2 = t2[e++] | t2[e++] << 8, y2 = t2[e++] | t2[e++] << 8, w2 = t2[e++], N2 = w2 >> 6 & 1, L2 = 1 << (7 & w2) + 1, A2 = s2, x2 = c2, S2 = false;
      if (w2 >> 7) {
        S2 = true;
        A2 = e, x2 = L2, e += 3 * L2;
      }
      var _2 = e;
      for (e++; ; ) {
        var P2;
        if (!((P2 = t2[e++]) >= 0)) throw Error("Invalid block size");
        if (0 === P2) break;
        e += P2;
      }
      h2.push({ x: m2, y: v2, width: b2, height: y2, has_local_palette: S2, palette_offset: A2, palette_size: x2, data_offset: _2, data_length: e - _2, transparent_index: f2, interlaced: !!N2, delay: l2, disposal: d2 });
      break;
    case 59:
      u2 = false;
      break;
    default:
      throw new Error("Unknown gif block: 0x" + t2[e - 1].toString(16));
  }
  this.numFrames = function() {
    return h2.length;
  }, this.loopCount = function() {
    return p2;
  }, this.frameInfo = function(t3) {
    if (t3 < 0 || t3 >= h2.length) throw new Error("Frame index out of range.");
    return h2[t3];
  }, this.decodeAndBlitFrameBGRA = function(e2, n3) {
    var i3 = this.frameInfo(e2), a3 = i3.width * i3.height, o3 = new Uint8Array(a3);
    $t(t2, i3.data_offset, o3, a3);
    var s3 = i3.palette_offset, c3 = i3.transparent_index;
    null === c3 && (c3 = 256);
    var u3 = i3.width, h3 = r - u3, l3 = u3, f3 = 4 * (i3.y * r + i3.x), d3 = 4 * ((i3.y + i3.height) * r + i3.x), p3 = f3, g3 = 4 * h3;
    true === i3.interlaced && (g3 += 4 * r * 7);
    for (var m3 = 8, v3 = 0, b3 = o3.length; v3 < b3; ++v3) {
      var y3 = o3[v3];
      if (0 === l3 && (l3 = u3, (p3 += g3) >= d3 && (g3 = 4 * h3 + 4 * r * (m3 - 1), p3 = f3 + (u3 + h3) * (m3 << 1), m3 >>= 1)), y3 === c3) p3 += 4;
      else {
        var w3 = t2[s3 + 3 * y3], N3 = t2[s3 + 3 * y3 + 1], L3 = t2[s3 + 3 * y3 + 2];
        n3[p3++] = L3, n3[p3++] = N3, n3[p3++] = w3, n3[p3++] = 255;
      }
      --l3;
    }
  }, this.decodeAndBlitFrameRGBA = function(e2, n3) {
    var i3 = this.frameInfo(e2), a3 = i3.width * i3.height, o3 = new Uint8Array(a3);
    $t(t2, i3.data_offset, o3, a3);
    var s3 = i3.palette_offset, c3 = i3.transparent_index;
    null === c3 && (c3 = 256);
    var u3 = i3.width, h3 = r - u3, l3 = u3, f3 = 4 * (i3.y * r + i3.x), d3 = 4 * ((i3.y + i3.height) * r + i3.x), p3 = f3, g3 = 4 * h3;
    true === i3.interlaced && (g3 += 4 * r * 7);
    for (var m3 = 8, v3 = 0, b3 = o3.length; v3 < b3; ++v3) {
      var y3 = o3[v3];
      if (0 === l3 && (l3 = u3, (p3 += g3) >= d3 && (g3 = 4 * h3 + 4 * r * (m3 - 1), p3 = f3 + (u3 + h3) * (m3 << 1), m3 >>= 1)), y3 === c3) p3 += 4;
      else {
        var w3 = t2[s3 + 3 * y3], N3 = t2[s3 + 3 * y3 + 1], L3 = t2[s3 + 3 * y3 + 2];
        n3[p3++] = w3, n3[p3++] = N3, n3[p3++] = L3, n3[p3++] = 255;
      }
      --l3;
    }
  };
}
function $t(t2, e, r, n2) {
  for (var i2 = t2[e++], o2 = 1 << i2, s2 = o2 + 1, c2 = s2 + 1, u2 = i2 + 1, h2 = (1 << u2) - 1, l2 = 0, f2 = 0, d2 = 0, p2 = t2[e++], g2 = new Int32Array(4096), m2 = null; ; ) {
    for (; l2 < 16 && 0 !== p2; ) f2 |= t2[e++] << l2, l2 += 8, 1 === p2 ? p2 = t2[e++] : --p2;
    if (l2 < u2) break;
    var v2 = f2 & h2;
    if (f2 >>= u2, l2 -= u2, v2 !== o2) {
      if (v2 === s2) break;
      for (var b2 = v2 < c2 ? v2 : m2, y2 = 0, w2 = b2; w2 > o2; ) w2 = g2[w2] >> 8, ++y2;
      var N2 = w2;
      if (d2 + y2 + (b2 !== v2 ? 1 : 0) > n2) return void a.log("Warning, gif stream longer than expected.");
      r[d2++] = N2;
      var L2 = d2 += y2;
      for (b2 !== v2 && (r[d2++] = N2), w2 = b2; y2--; ) w2 = g2[w2], r[--L2] = 255 & w2, w2 >>= 8;
      null !== m2 && c2 < 4096 && (g2[c2++] = m2 << 8 | N2, c2 >= h2 + 1 && u2 < 12 && (++u2, h2 = h2 << 1 | 1)), m2 = v2;
    } else c2 = s2 + 1, h2 = (1 << (u2 = i2 + 1)) - 1, m2 = null;
  }
  return d2 !== n2 && a.log("Warning, gif stream shorter than expected."), r;
}
/**
 * @license
  Copyright (c) 2008, Adobe Systems Incorporated
  All rights reserved.

  Redistribution and use in source and binary forms, with or without 
  modification, are permitted provided that the following conditions are
  met:

  * Redistributions of source code must retain the above copyright notice, 
    this list of conditions and the following disclaimer.
  
  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the 
    documentation and/or other materials provided with the distribution.
  
  * Neither the name of Adobe Systems Incorporated nor the names of its 
    contributors may be used to endorse or promote products derived from 
    this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR 
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function Qt(t2) {
  var e, r, n2, i2, a2, o2 = Math.floor, s2 = new Array(64), c2 = new Array(64), u2 = new Array(64), h2 = new Array(64), l2 = new Array(65535), f2 = new Array(65535), d2 = new Array(64), p2 = new Array(64), g2 = [], m2 = 0, v2 = 7, b2 = new Array(64), y2 = new Array(64), w2 = new Array(64), N2 = new Array(256), L2 = new Array(2048), A2 = [0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63], x2 = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], S2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], _2 = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125], P2 = [1, 2, 3, 0, 4, 17, 5, 18, 33, 49, 65, 6, 19, 81, 97, 7, 34, 113, 20, 50, 129, 145, 161, 8, 35, 66, 177, 193, 21, 82, 209, 240, 36, 51, 98, 114, 130, 9, 10, 22, 23, 24, 25, 26, 37, 38, 39, 40, 41, 42, 52, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250], k2 = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], I2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], F2 = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119], C2 = [0, 1, 2, 3, 17, 4, 5, 33, 49, 6, 18, 65, 81, 7, 97, 113, 19, 34, 50, 129, 8, 20, 66, 145, 161, 177, 193, 9, 35, 51, 82, 240, 21, 98, 114, 209, 10, 22, 36, 52, 225, 37, 241, 23, 24, 25, 26, 38, 39, 40, 41, 42, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 226, 227, 228, 229, 230, 231, 232, 233, 234, 242, 243, 244, 245, 246, 247, 248, 249, 250];
  function j2(t3, e2) {
    for (var r2 = 0, n3 = 0, i3 = new Array(), a3 = 1; a3 <= 16; a3++) {
      for (var o3 = 1; o3 <= t3[a3]; o3++) i3[e2[n3]] = [], i3[e2[n3]][0] = r2, i3[e2[n3]][1] = a3, n3++, r2++;
      r2 *= 2;
    }
    return i3;
  }
  function O2(t3) {
    for (var e2 = t3[0], r2 = t3[1] - 1; r2 >= 0; ) e2 & 1 << r2 && (m2 |= 1 << v2), r2--, --v2 < 0 && (255 == m2 ? (B2(255), B2(0)) : B2(m2), v2 = 7, m2 = 0);
  }
  function B2(t3) {
    g2.push(t3);
  }
  function M2(t3) {
    B2(t3 >> 8 & 255), B2(255 & t3);
  }
  function E2(t3, e2, r2, n3, i3) {
    for (var a3, o3 = i3[0], s3 = i3[240], c3 = function(t4, e3) {
      var r3, n4, i4, a4, o4, s4, c4, u4, h4, l3, f3 = 0;
      for (h4 = 0; h4 < 8; ++h4) {
        r3 = t4[f3], n4 = t4[f3 + 1], i4 = t4[f3 + 2], a4 = t4[f3 + 3], o4 = t4[f3 + 4], s4 = t4[f3 + 5], c4 = t4[f3 + 6];
        var p3 = r3 + (u4 = t4[f3 + 7]), g4 = r3 - u4, m4 = n4 + c4, v4 = n4 - c4, b4 = i4 + s4, y4 = i4 - s4, w4 = a4 + o4, N3 = a4 - o4, L3 = p3 + w4, A3 = p3 - w4, x3 = m4 + b4, S3 = m4 - b4;
        t4[f3] = L3 + x3, t4[f3 + 4] = L3 - x3;
        var _3 = 0.707106781 * (S3 + A3);
        t4[f3 + 2] = A3 + _3, t4[f3 + 6] = A3 - _3;
        var P3 = 0.382683433 * ((L3 = N3 + y4) - (S3 = v4 + g4)), k3 = 0.5411961 * L3 + P3, I3 = 1.306562965 * S3 + P3, F3 = 0.707106781 * (x3 = y4 + v4), C3 = g4 + F3, j3 = g4 - F3;
        t4[f3 + 5] = j3 + k3, t4[f3 + 3] = j3 - k3, t4[f3 + 1] = C3 + I3, t4[f3 + 7] = C3 - I3, f3 += 8;
      }
      for (f3 = 0, h4 = 0; h4 < 8; ++h4) {
        r3 = t4[f3], n4 = t4[f3 + 8], i4 = t4[f3 + 16], a4 = t4[f3 + 24], o4 = t4[f3 + 32], s4 = t4[f3 + 40], c4 = t4[f3 + 48];
        var O3 = r3 + (u4 = t4[f3 + 56]), B3 = r3 - u4, M3 = n4 + c4, E3 = n4 - c4, q3 = i4 + s4, D2 = i4 - s4, R2 = a4 + o4, T2 = a4 - o4, U2 = O3 + R2, z2 = O3 - R2, H2 = M3 + q3, W2 = M3 - q3;
        t4[f3] = U2 + H2, t4[f3 + 32] = U2 - H2;
        var V2 = 0.707106781 * (W2 + z2);
        t4[f3 + 16] = z2 + V2, t4[f3 + 48] = z2 - V2;
        var G2 = 0.382683433 * ((U2 = T2 + D2) - (W2 = E3 + B3)), Y2 = 0.5411961 * U2 + G2, J2 = 1.306562965 * W2 + G2, X2 = 0.707106781 * (H2 = D2 + E3), K2 = B3 + X2, Z2 = B3 - X2;
        t4[f3 + 40] = Z2 + Y2, t4[f3 + 24] = Z2 - Y2, t4[f3 + 8] = K2 + J2, t4[f3 + 56] = K2 - J2, f3++;
      }
      for (h4 = 0; h4 < 64; ++h4) l3 = t4[h4] * e3[h4], d2[h4] = l3 > 0 ? l3 + 0.5 | 0 : l3 - 0.5 | 0;
      return d2;
    }(t3, e2), u3 = 0; u3 < 64; ++u3) p2[A2[u3]] = c3[u3];
    var h3 = p2[0] - r2;
    r2 = p2[0], 0 == h3 ? O2(n3[0]) : (O2(n3[f2[a3 = 32767 + h3]]), O2(l2[a3]));
    for (var g3 = 63; g3 > 0 && 0 == p2[g3]; ) g3--;
    if (0 == g3) return O2(o3), r2;
    for (var m3, v3 = 1; v3 <= g3; ) {
      for (var b3 = v3; 0 == p2[v3] && v3 <= g3; ) ++v3;
      var y3 = v3 - b3;
      if (y3 >= 16) {
        m3 = y3 >> 4;
        for (var w3 = 1; w3 <= m3; ++w3) O2(s3);
        y3 &= 15;
      }
      a3 = 32767 + p2[v3], O2(i3[(y3 << 4) + f2[a3]]), O2(l2[a3]), v3++;
    }
    return 63 != g3 && O2(o3), r2;
  }
  function q2(t3) {
    (t3 = Math.min(Math.max(t3, 1), 100), a2 != t3) && (!function(t4) {
      for (var e2 = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99], r2 = 0; r2 < 64; r2++) {
        var n3 = o2((e2[r2] * t4 + 50) / 100);
        n3 = Math.min(Math.max(n3, 1), 255), s2[A2[r2]] = n3;
      }
      for (var i3 = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99], a3 = 0; a3 < 64; a3++) {
        var l3 = o2((i3[a3] * t4 + 50) / 100);
        l3 = Math.min(Math.max(l3, 1), 255), c2[A2[a3]] = l3;
      }
      for (var f3 = [1, 1.387039845, 1.306562965, 1.175875602, 1, 0.785694958, 0.5411961, 0.275899379], d3 = 0, p3 = 0; p3 < 8; p3++) for (var g3 = 0; g3 < 8; g3++) u2[d3] = 1 / (s2[A2[d3]] * f3[p3] * f3[g3] * 8), h2[d3] = 1 / (c2[A2[d3]] * f3[p3] * f3[g3] * 8), d3++;
    }(t3 < 50 ? Math.floor(5e3 / t3) : Math.floor(200 - 2 * t3)), a2 = t3);
  }
  this.encode = function(t3, a3) {
    a3 && q2(a3), g2 = new Array(), m2 = 0, v2 = 7, M2(65496), M2(65504), M2(16), B2(74), B2(70), B2(73), B2(70), B2(0), B2(1), B2(1), B2(0), M2(1), M2(1), B2(0), B2(0), function() {
      M2(65499), M2(132), B2(0);
      for (var t4 = 0; t4 < 64; t4++) B2(s2[t4]);
      B2(1);
      for (var e2 = 0; e2 < 64; e2++) B2(c2[e2]);
    }(), function(t4, e2) {
      M2(65472), M2(17), B2(8), M2(e2), M2(t4), B2(3), B2(1), B2(17), B2(0), B2(2), B2(17), B2(1), B2(3), B2(17), B2(1);
    }(t3.width, t3.height), function() {
      M2(65476), M2(418), B2(0);
      for (var t4 = 0; t4 < 16; t4++) B2(x2[t4 + 1]);
      for (var e2 = 0; e2 <= 11; e2++) B2(S2[e2]);
      B2(16);
      for (var r2 = 0; r2 < 16; r2++) B2(_2[r2 + 1]);
      for (var n3 = 0; n3 <= 161; n3++) B2(P2[n3]);
      B2(1);
      for (var i3 = 0; i3 < 16; i3++) B2(k2[i3 + 1]);
      for (var a4 = 0; a4 <= 11; a4++) B2(I2[a4]);
      B2(17);
      for (var o4 = 0; o4 < 16; o4++) B2(F2[o4 + 1]);
      for (var s3 = 0; s3 <= 161; s3++) B2(C2[s3]);
    }(), M2(65498), M2(12), B2(3), B2(1), B2(0), B2(2), B2(17), B2(3), B2(17), B2(0), B2(63), B2(0);
    var o3 = 0, l3 = 0, f3 = 0;
    m2 = 0, v2 = 7, this.encode.displayName = "_encode_";
    for (var d3, p3, N3, A3, j3, D2, R2, T2, U2, z2 = t3.data, H2 = t3.width, W2 = t3.height, V2 = 4 * H2, G2 = 0; G2 < W2; ) {
      for (d3 = 0; d3 < V2; ) {
        for (j3 = V2 * G2 + d3, R2 = -1, T2 = 0, U2 = 0; U2 < 64; U2++) D2 = j3 + (T2 = U2 >> 3) * V2 + (R2 = 4 * (7 & U2)), G2 + T2 >= W2 && (D2 -= V2 * (G2 + 1 + T2 - W2)), d3 + R2 >= V2 && (D2 -= d3 + R2 - V2 + 4), p3 = z2[D2++], N3 = z2[D2++], A3 = z2[D2++], b2[U2] = (L2[p3] + L2[N3 + 256 >> 0] + L2[A3 + 512 >> 0] >> 16) - 128, y2[U2] = (L2[p3 + 768 >> 0] + L2[N3 + 1024 >> 0] + L2[A3 + 1280 >> 0] >> 16) - 128, w2[U2] = (L2[p3 + 1280 >> 0] + L2[N3 + 1536 >> 0] + L2[A3 + 1792 >> 0] >> 16) - 128;
        o3 = E2(b2, u2, o3, e, n2), l3 = E2(y2, h2, l3, r, i2), f3 = E2(w2, h2, f3, r, i2), d3 += 32;
      }
      G2 += 8;
    }
    if (v2 >= 0) {
      var Y2 = [];
      Y2[1] = v2 + 1, Y2[0] = (1 << v2 + 1) - 1, O2(Y2);
    }
    return M2(65497), new Uint8Array(g2);
  }, t2 = t2 || 50, function() {
    for (var t3 = String.fromCharCode, e2 = 0; e2 < 256; e2++) N2[e2] = t3(e2);
  }(), e = j2(x2, S2), r = j2(k2, I2), n2 = j2(_2, P2), i2 = j2(F2, C2), function() {
    for (var t3 = 1, e2 = 2, r2 = 1; r2 <= 15; r2++) {
      for (var n3 = t3; n3 < e2; n3++) f2[32767 + n3] = r2, l2[32767 + n3] = [], l2[32767 + n3][1] = r2, l2[32767 + n3][0] = n3;
      for (var i3 = -(e2 - 1); i3 <= -t3; i3++) f2[32767 + i3] = r2, l2[32767 + i3] = [], l2[32767 + i3][1] = r2, l2[32767 + i3][0] = e2 - 1 + i3;
      t3 <<= 1, e2 <<= 1;
    }
  }(), function() {
    for (var t3 = 0; t3 < 256; t3++) L2[t3] = 19595 * t3, L2[t3 + 256 >> 0] = 38470 * t3, L2[t3 + 512 >> 0] = 7471 * t3 + 32768, L2[t3 + 768 >> 0] = -11059 * t3, L2[t3 + 1024 >> 0] = -21709 * t3, L2[t3 + 1280 >> 0] = 32768 * t3 + 8421375, L2[t3 + 1536 >> 0] = -27439 * t3, L2[t3 + 1792 >> 0] = -5329 * t3;
  }(), q2(t2);
}
/**
 * @license
 * Copyright (c) 2017 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function te(t2, e) {
  if (this.pos = 0, this.buffer = t2, this.datav = new DataView(t2.buffer), this.is_with_alpha = !!e, this.bottom_up = true, this.flag = String.fromCharCode(this.buffer[0]) + String.fromCharCode(this.buffer[1]), this.pos += 2, -1 === ["BM", "BA", "CI", "CP", "IC", "PT"].indexOf(this.flag)) throw new Error("Invalid BMP File");
  this.parseHeader(), this.parseBGR();
}
function ee(t2) {
  function e(t3) {
    if (!t3) throw Error("assert :P");
  }
  function r(t3, e2, r2) {
    for (var n3 = 0; 4 > n3; n3++) if (t3[e2 + n3] != r2.charCodeAt(n3)) return true;
    return false;
  }
  function n2(t3, e2, r2, n3, i3) {
    for (var a3 = 0; a3 < i3; a3++) t3[e2 + a3] = r2[n3 + a3];
  }
  function i2(t3, e2, r2, n3) {
    for (var i3 = 0; i3 < n3; i3++) t3[e2 + i3] = r2;
  }
  function a2(t3) {
    return new Int32Array(t3);
  }
  function o2(t3, e2) {
    for (var r2 = [], n3 = 0; n3 < t3; n3++) r2.push(new e2());
    return r2;
  }
  function s2(t3, e2) {
    var r2 = [];
    return function t4(r3, n3, i3) {
      for (var a3 = i3[n3], o3 = 0; o3 < a3 && (r3.push(i3.length > n3 + 1 ? [] : new e2()), !(i3.length < n3 + 1)); o3++) t4(r3[o3], n3 + 1, i3);
    }(r2, 0, t3), r2;
  }
  var c2 = function() {
    var t3 = this;
    function c3(t4, e2) {
      for (var r2 = 1 << e2 - 1 >>> 0; t4 & r2; ) r2 >>>= 1;
      return r2 ? (t4 & r2 - 1) + r2 : t4;
    }
    function u3(t4, r2, n3, i3, a3) {
      e(!(i3 % n3));
      do {
        t4[r2 + (i3 -= n3)] = a3;
      } while (0 < i3);
    }
    function h3(t4, r2, n3, i3, o3) {
      if (e(2328 >= o3), 512 >= o3) var s3 = a2(512);
      else if (null == (s3 = a2(o3))) return 0;
      return function(t5, r3, n4, i4, o4, s4) {
        var h4, f4, d4 = r3, p4 = 1 << n4, g4 = a2(16), m4 = a2(16);
        for (e(0 != o4), e(null != i4), e(null != t5), e(0 < n4), f4 = 0; f4 < o4; ++f4) {
          if (15 < i4[f4]) return 0;
          ++g4[i4[f4]];
        }
        if (g4[0] == o4) return 0;
        for (m4[1] = 0, h4 = 1; 15 > h4; ++h4) {
          if (g4[h4] > 1 << h4) return 0;
          m4[h4 + 1] = m4[h4] + g4[h4];
        }
        for (f4 = 0; f4 < o4; ++f4) h4 = i4[f4], 0 < i4[f4] && (s4[m4[h4]++] = f4);
        if (1 == m4[15]) return (i4 = new l3()).g = 0, i4.value = s4[0], u3(t5, d4, 1, p4, i4), p4;
        var v4, b4 = -1, y4 = p4 - 1, w4 = 0, N4 = 1, L4 = 1, A4 = 1 << n4;
        for (f4 = 0, h4 = 1, o4 = 2; h4 <= n4; ++h4, o4 <<= 1) {
          if (N4 += L4 <<= 1, 0 > (L4 -= g4[h4])) return 0;
          for (; 0 < g4[h4]; --g4[h4]) (i4 = new l3()).g = h4, i4.value = s4[f4++], u3(t5, d4 + w4, o4, A4, i4), w4 = c3(w4, h4);
        }
        for (h4 = n4 + 1, o4 = 2; 15 >= h4; ++h4, o4 <<= 1) {
          if (N4 += L4 <<= 1, 0 > (L4 -= g4[h4])) return 0;
          for (; 0 < g4[h4]; --g4[h4]) {
            if (i4 = new l3(), (w4 & y4) != b4) {
              for (d4 += A4, v4 = 1 << (b4 = h4) - n4; 15 > b4 && !(0 >= (v4 -= g4[b4])); ) ++b4, v4 <<= 1;
              p4 += A4 = 1 << (v4 = b4 - n4), t5[r3 + (b4 = w4 & y4)].g = v4 + n4, t5[r3 + b4].value = d4 - r3 - b4;
            }
            i4.g = h4 - n4, i4.value = s4[f4++], u3(t5, d4 + (w4 >> n4), o4, A4, i4), w4 = c3(w4, h4);
          }
        }
        return N4 != 2 * m4[15] - 1 ? 0 : p4;
      }(t4, r2, n3, i3, o3, s3);
    }
    function l3() {
      this.value = this.g = 0;
    }
    function f3() {
      this.value = this.g = 0;
    }
    function d3() {
      this.G = o2(5, l3), this.H = a2(5), this.jc = this.Qb = this.qb = this.nd = 0, this.pd = o2(Dr, f3);
    }
    function p3(t4, r2, n3, i3) {
      e(null != t4), e(null != r2), e(2147483648 > i3), t4.Ca = 254, t4.I = 0, t4.b = -8, t4.Ka = 0, t4.oa = r2, t4.pa = n3, t4.Jd = r2, t4.Yc = n3 + i3, t4.Zc = 4 <= i3 ? n3 + i3 - 4 + 1 : n3, _2(t4);
    }
    function g3(t4, e2) {
      for (var r2 = 0; 0 < e2--; ) r2 |= k2(t4, 128) << e2;
      return r2;
    }
    function m3(t4, e2) {
      var r2 = g3(t4, e2);
      return P2(t4) ? -r2 : r2;
    }
    function v3(t4, r2, n3, i3) {
      var a3, o3 = 0;
      for (e(null != t4), e(null != r2), e(4294967288 > i3), t4.Sb = i3, t4.Ra = 0, t4.u = 0, t4.h = 0, 4 < i3 && (i3 = 4), a3 = 0; a3 < i3; ++a3) o3 += r2[n3 + a3] << 8 * a3;
      t4.Ra = o3, t4.bb = i3, t4.oa = r2, t4.pa = n3;
    }
    function b3(t4) {
      for (; 8 <= t4.u && t4.bb < t4.Sb; ) t4.Ra >>>= 8, t4.Ra += t4.oa[t4.pa + t4.bb] << Ur - 8 >>> 0, ++t4.bb, t4.u -= 8;
      A3(t4) && (t4.h = 1, t4.u = 0);
    }
    function y3(t4, r2) {
      if (e(0 <= r2), !t4.h && r2 <= Tr) {
        var n3 = L3(t4) & Rr[r2];
        return t4.u += r2, b3(t4), n3;
      }
      return t4.h = 1, t4.u = 0;
    }
    function w3() {
      this.b = this.Ca = this.I = 0, this.oa = [], this.pa = 0, this.Jd = [], this.Yc = 0, this.Zc = [], this.Ka = 0;
    }
    function N3() {
      this.Ra = 0, this.oa = [], this.h = this.u = this.bb = this.Sb = this.pa = 0;
    }
    function L3(t4) {
      return t4.Ra >>> (t4.u & Ur - 1) >>> 0;
    }
    function A3(t4) {
      return e(t4.bb <= t4.Sb), t4.h || t4.bb == t4.Sb && t4.u > Ur;
    }
    function x2(t4, e2) {
      t4.u = e2, t4.h = A3(t4);
    }
    function S2(t4) {
      t4.u >= zr && (e(t4.u >= zr), b3(t4));
    }
    function _2(t4) {
      e(null != t4 && null != t4.oa), t4.pa < t4.Zc ? (t4.I = (t4.oa[t4.pa++] | t4.I << 8) >>> 0, t4.b += 8) : (e(null != t4 && null != t4.oa), t4.pa < t4.Yc ? (t4.b += 8, t4.I = t4.oa[t4.pa++] | t4.I << 8) : t4.Ka ? t4.b = 0 : (t4.I <<= 8, t4.b += 8, t4.Ka = 1));
    }
    function P2(t4) {
      return g3(t4, 1);
    }
    function k2(t4, e2) {
      var r2 = t4.Ca;
      0 > t4.b && _2(t4);
      var n3 = t4.b, i3 = r2 * e2 >>> 8, a3 = (t4.I >>> n3 > i3) + 0;
      for (a3 ? (r2 -= i3, t4.I -= i3 + 1 << n3 >>> 0) : r2 = i3 + 1, n3 = r2, i3 = 0; 256 <= n3; ) i3 += 8, n3 >>= 8;
      return n3 = 7 ^ i3 + Hr[n3], t4.b -= n3, t4.Ca = (r2 << n3) - 1, a3;
    }
    function I2(t4, e2, r2) {
      t4[e2 + 0] = r2 >> 24 & 255, t4[e2 + 1] = r2 >> 16 & 255, t4[e2 + 2] = r2 >> 8 & 255, t4[e2 + 3] = r2 >> 0 & 255;
    }
    function F2(t4, e2) {
      return t4[e2 + 0] << 0 | t4[e2 + 1] << 8;
    }
    function C2(t4, e2) {
      return F2(t4, e2) | t4[e2 + 2] << 16;
    }
    function j2(t4, e2) {
      return F2(t4, e2) | F2(t4, e2 + 2) << 16;
    }
    function O2(t4, r2) {
      var n3 = 1 << r2;
      return e(null != t4), e(0 < r2), t4.X = a2(n3), null == t4.X ? 0 : (t4.Mb = 32 - r2, t4.Xa = r2, 1);
    }
    function B2(t4, r2) {
      e(null != t4), e(null != r2), e(t4.Xa == r2.Xa), n2(r2.X, 0, t4.X, 0, 1 << r2.Xa);
    }
    function M2() {
      this.X = [], this.Xa = this.Mb = 0;
    }
    function E2(t4, r2, n3, i3) {
      e(null != n3), e(null != i3);
      var a3 = n3[0], o3 = i3[0];
      return 0 == a3 && (a3 = (t4 * o3 + r2 / 2) / r2), 0 == o3 && (o3 = (r2 * a3 + t4 / 2) / t4), 0 >= a3 || 0 >= o3 ? 0 : (n3[0] = a3, i3[0] = o3, 1);
    }
    function q2(t4, e2) {
      return t4 + (1 << e2) - 1 >>> e2;
    }
    function D2(t4, e2) {
      return ((4278255360 & t4) + (4278255360 & e2) >>> 0 & 4278255360) + ((16711935 & t4) + (16711935 & e2) >>> 0 & 16711935) >>> 0;
    }
    function R2(e2, r2) {
      t3[r2] = function(r3, n3, i3, a3, o3, s3, c4) {
        var u4;
        for (u4 = 0; u4 < o3; ++u4) {
          var h4 = t3[e2](s3[c4 + u4 - 1], i3, a3 + u4);
          s3[c4 + u4] = D2(r3[n3 + u4], h4);
        }
      };
    }
    function T2() {
      this.ud = this.hd = this.jd = 0;
    }
    function U2(t4, e2) {
      return ((4278124286 & (t4 ^ e2)) >>> 1) + (t4 & e2) >>> 0;
    }
    function z2(t4) {
      return 0 <= t4 && 256 > t4 ? t4 : 0 > t4 ? 0 : 255 < t4 ? 255 : void 0;
    }
    function H2(t4, e2) {
      return z2(t4 + (t4 - e2 + 0.5 >> 1));
    }
    function W2(t4, e2, r2) {
      return Math.abs(e2 - r2) - Math.abs(t4 - r2);
    }
    function V2(t4, e2, r2, n3, i3, a3, o3) {
      for (n3 = a3[o3 - 1], r2 = 0; r2 < i3; ++r2) a3[o3 + r2] = n3 = D2(t4[e2 + r2], n3);
    }
    function G2(t4, e2, r2, n3, i3) {
      var a3;
      for (a3 = 0; a3 < r2; ++a3) {
        var o3 = t4[e2 + a3], s3 = o3 >> 8 & 255, c4 = 16711935 & (c4 = (c4 = 16711935 & o3) + ((s3 << 16) + s3));
        n3[i3 + a3] = (4278255360 & o3) + c4 >>> 0;
      }
    }
    function Y2(t4, e2) {
      e2.jd = t4 >> 0 & 255, e2.hd = t4 >> 8 & 255, e2.ud = t4 >> 16 & 255;
    }
    function J2(t4, e2, r2, n3, i3, a3) {
      var o3;
      for (o3 = 0; o3 < n3; ++o3) {
        var s3 = e2[r2 + o3], c4 = s3 >>> 8, u4 = s3, h4 = 255 & (h4 = (h4 = s3 >>> 16) + ((t4.jd << 24 >> 24) * (c4 << 24 >> 24) >>> 5));
        u4 = 255 & (u4 = (u4 = u4 + ((t4.hd << 24 >> 24) * (c4 << 24 >> 24) >>> 5)) + ((t4.ud << 24 >> 24) * (h4 << 24 >> 24) >>> 5));
        i3[a3 + o3] = (4278255360 & s3) + (h4 << 16) + u4;
      }
    }
    function X2(e2, r2, n3, i3, a3) {
      t3[r2] = function(t4, e3, r3, n4, o3, s3, c4, u4, h4) {
        for (n4 = c4; n4 < u4; ++n4) for (c4 = 0; c4 < h4; ++c4) o3[s3++] = a3(r3[i3(t4[e3++])]);
      }, t3[e2] = function(e3, r3, o3, s3, c4, u4, h4) {
        var l4 = 8 >> e3.b, f4 = e3.Ea, d4 = e3.K[0], p4 = e3.w;
        if (8 > l4) for (e3 = (1 << e3.b) - 1, p4 = (1 << l4) - 1; r3 < o3; ++r3) {
          var g4, m4 = 0;
          for (g4 = 0; g4 < f4; ++g4) g4 & e3 || (m4 = i3(s3[c4++])), u4[h4++] = a3(d4[m4 & p4]), m4 >>= l4;
        }
        else t3["VP8LMapColor" + n3](s3, c4, d4, p4, u4, h4, r3, o3, f4);
      };
    }
    function K2(t4, e2, r2, n3, i3) {
      for (r2 = e2 + r2; e2 < r2; ) {
        var a3 = t4[e2++];
        n3[i3++] = a3 >> 16 & 255, n3[i3++] = a3 >> 8 & 255, n3[i3++] = a3 >> 0 & 255;
      }
    }
    function Z2(t4, e2, r2, n3, i3) {
      for (r2 = e2 + r2; e2 < r2; ) {
        var a3 = t4[e2++];
        n3[i3++] = a3 >> 16 & 255, n3[i3++] = a3 >> 8 & 255, n3[i3++] = a3 >> 0 & 255, n3[i3++] = a3 >> 24 & 255;
      }
    }
    function $2(t4, e2, r2, n3, i3) {
      for (r2 = e2 + r2; e2 < r2; ) {
        var a3 = (o3 = t4[e2++]) >> 16 & 240 | o3 >> 12 & 15, o3 = o3 >> 0 & 240 | o3 >> 28 & 15;
        n3[i3++] = a3, n3[i3++] = o3;
      }
    }
    function Q2(t4, e2, r2, n3, i3) {
      for (r2 = e2 + r2; e2 < r2; ) {
        var a3 = (o3 = t4[e2++]) >> 16 & 248 | o3 >> 13 & 7, o3 = o3 >> 5 & 224 | o3 >> 3 & 31;
        n3[i3++] = a3, n3[i3++] = o3;
      }
    }
    function tt2(t4, e2, r2, n3, i3) {
      for (r2 = e2 + r2; e2 < r2; ) {
        var a3 = t4[e2++];
        n3[i3++] = a3 >> 0 & 255, n3[i3++] = a3 >> 8 & 255, n3[i3++] = a3 >> 16 & 255;
      }
    }
    function et2(t4, e2, r2, i3, a3, o3) {
      if (0 == o3) for (r2 = e2 + r2; e2 < r2; ) I2(i3, ((o3 = t4[e2++])[0] >> 24 | o3[1] >> 8 & 65280 | o3[2] << 8 & 16711680 | o3[3] << 24) >>> 0), a3 += 32;
      else n2(i3, a3, t4, e2, r2);
    }
    function rt2(e2, r2) {
      t3[r2][0] = t3[e2 + "0"], t3[r2][1] = t3[e2 + "1"], t3[r2][2] = t3[e2 + "2"], t3[r2][3] = t3[e2 + "3"], t3[r2][4] = t3[e2 + "4"], t3[r2][5] = t3[e2 + "5"], t3[r2][6] = t3[e2 + "6"], t3[r2][7] = t3[e2 + "7"], t3[r2][8] = t3[e2 + "8"], t3[r2][9] = t3[e2 + "9"], t3[r2][10] = t3[e2 + "10"], t3[r2][11] = t3[e2 + "11"], t3[r2][12] = t3[e2 + "12"], t3[r2][13] = t3[e2 + "13"], t3[r2][14] = t3[e2 + "0"], t3[r2][15] = t3[e2 + "0"];
    }
    function nt2(t4) {
      return t4 == Hn || t4 == Wn || t4 == Vn || t4 == Gn;
    }
    function it2() {
      this.eb = [], this.size = this.A = this.fb = 0;
    }
    function at2() {
      this.y = [], this.f = [], this.ea = [], this.F = [], this.Tc = this.Ed = this.Cd = this.Fd = this.lb = this.Db = this.Ab = this.fa = this.J = this.W = this.N = this.O = 0;
    }
    function ot2() {
      this.Rd = this.height = this.width = this.S = 0, this.f = {}, this.f.RGBA = new it2(), this.f.kb = new at2(), this.sd = null;
    }
    function st2() {
      this.width = [0], this.height = [0], this.Pd = [0], this.Qd = [0], this.format = [0];
    }
    function ct2() {
      this.Id = this.fd = this.Md = this.hb = this.ib = this.da = this.bd = this.cd = this.j = this.v = this.Da = this.Sd = this.ob = 0;
    }
    function ut2(t4) {
      return alert("todo:WebPSamplerProcessPlane"), t4.T;
    }
    function ht2(t4, e2) {
      var r2 = t4.T, i3 = e2.ba.f.RGBA, a3 = i3.eb, o3 = i3.fb + t4.ka * i3.A, s3 = vi[e2.ba.S], c4 = t4.y, u4 = t4.O, h4 = t4.f, l4 = t4.N, f4 = t4.ea, d4 = t4.W, p4 = e2.cc, g4 = e2.dc, m4 = e2.Mc, v4 = e2.Nc, b4 = t4.ka, y4 = t4.ka + t4.T, w4 = t4.U, N4 = w4 + 1 >> 1;
      for (0 == b4 ? s3(c4, u4, null, null, h4, l4, f4, d4, h4, l4, f4, d4, a3, o3, null, null, w4) : (s3(e2.ec, e2.fc, c4, u4, p4, g4, m4, v4, h4, l4, f4, d4, a3, o3 - i3.A, a3, o3, w4), ++r2); b4 + 2 < y4; b4 += 2) p4 = h4, g4 = l4, m4 = f4, v4 = d4, l4 += t4.Rc, d4 += t4.Rc, o3 += 2 * i3.A, s3(c4, (u4 += 2 * t4.fa) - t4.fa, c4, u4, p4, g4, m4, v4, h4, l4, f4, d4, a3, o3 - i3.A, a3, o3, w4);
      return u4 += t4.fa, t4.j + y4 < t4.o ? (n2(e2.ec, e2.fc, c4, u4, w4), n2(e2.cc, e2.dc, h4, l4, N4), n2(e2.Mc, e2.Nc, f4, d4, N4), r2--) : 1 & y4 || s3(c4, u4, null, null, h4, l4, f4, d4, h4, l4, f4, d4, a3, o3 + i3.A, null, null, w4), r2;
    }
    function lt2(t4, r2, n3) {
      var i3 = t4.F, a3 = [t4.J];
      if (null != i3) {
        var o3 = t4.U, s3 = r2.ba.S, c4 = s3 == Tn || s3 == Vn;
        r2 = r2.ba.f.RGBA;
        var u4 = [0], h4 = t4.ka;
        u4[0] = t4.T, t4.Kb && (0 == h4 ? --u4[0] : (--h4, a3[0] -= t4.width), t4.j + t4.ka + t4.T == t4.o && (u4[0] = t4.o - t4.j - h4));
        var l4 = r2.eb;
        h4 = r2.fb + h4 * r2.A;
        t4 = Sn(i3, a3[0], t4.width, o3, u4, l4, h4 + (c4 ? 0 : 3), r2.A), e(n3 == u4), t4 && nt2(s3) && An(l4, h4, c4, o3, u4, r2.A);
      }
      return 0;
    }
    function ft2(t4) {
      var e2 = t4.ma, r2 = e2.ba.S, n3 = 11 > r2, i3 = r2 == qn || r2 == Rn || r2 == Tn || r2 == Un || 12 == r2 || nt2(r2);
      if (e2.memory = null, e2.Ib = null, e2.Jb = null, e2.Nd = null, !Mr(e2.Oa, t4, i3 ? 11 : 12)) return 0;
      if (i3 && nt2(r2) && br(), t4.da) alert("todo:use_scaling");
      else {
        if (n3) {
          if (e2.Ib = ut2, t4.Kb) {
            if (r2 = t4.U + 1 >> 1, e2.memory = a2(t4.U + 2 * r2), null == e2.memory) return 0;
            e2.ec = e2.memory, e2.fc = 0, e2.cc = e2.ec, e2.dc = e2.fc + t4.U, e2.Mc = e2.cc, e2.Nc = e2.dc + r2, e2.Ib = ht2, br();
          }
        } else alert("todo:EmitYUV");
        i3 && (e2.Jb = lt2, n3 && mr());
      }
      if (n3 && !Ci) {
        for (t4 = 0; 256 > t4; ++t4) ji[t4] = 89858 * (t4 - 128) + _i >> Si, Mi[t4] = -22014 * (t4 - 128) + _i, Bi[t4] = -45773 * (t4 - 128), Oi[t4] = 113618 * (t4 - 128) + _i >> Si;
        for (t4 = Pi; t4 < ki; ++t4) e2 = 76283 * (t4 - 16) + _i >> Si, Ei[t4 - Pi] = Vt2(e2, 255), qi[t4 - Pi] = Vt2(e2 + 8 >> 4, 15);
        Ci = 1;
      }
      return 1;
    }
    function dt2(t4) {
      var r2 = t4.ma, n3 = t4.U, i3 = t4.T;
      return e(!(1 & t4.ka)), 0 >= n3 || 0 >= i3 ? 0 : (n3 = r2.Ib(t4, r2), null != r2.Jb && r2.Jb(t4, r2, n3), r2.Dc += n3, 1);
    }
    function pt2(t4) {
      t4.ma.memory = null;
    }
    function gt2(t4, e2, r2, n3) {
      return 47 != y3(t4, 8) ? 0 : (e2[0] = y3(t4, 14) + 1, r2[0] = y3(t4, 14) + 1, n3[0] = y3(t4, 1), 0 != y3(t4, 3) ? 0 : !t4.h);
    }
    function mt2(t4, e2) {
      if (4 > t4) return t4 + 1;
      var r2 = t4 - 2 >> 1;
      return (2 + (1 & t4) << r2) + y3(e2, r2) + 1;
    }
    function vt2(t4, e2) {
      return 120 < e2 ? e2 - 120 : 1 <= (r2 = ((r2 = $n[e2 - 1]) >> 4) * t4 + (8 - (15 & r2))) ? r2 : 1;
      var r2;
    }
    function bt2(t4, e2, r2) {
      var n3 = L3(r2), i3 = t4[e2 += 255 & n3].g - 8;
      return 0 < i3 && (x2(r2, r2.u + 8), n3 = L3(r2), e2 += t4[e2].value, e2 += n3 & (1 << i3) - 1), x2(r2, r2.u + t4[e2].g), t4[e2].value;
    }
    function yt2(t4, r2, n3) {
      return n3.g += t4.g, n3.value += t4.value << r2 >>> 0, e(8 >= n3.g), t4.g;
    }
    function wt2(t4, r2, n3) {
      var i3 = t4.xc;
      return e((r2 = 0 == i3 ? 0 : t4.vc[t4.md * (n3 >> i3) + (r2 >> i3)]) < t4.Wb), t4.Ya[r2];
    }
    function Nt2(t4, r2, i3, a3) {
      var o3 = t4.ab, s3 = t4.c * r2, c4 = t4.C;
      r2 = c4 + r2;
      var u4 = i3, h4 = a3;
      for (a3 = t4.Ta, i3 = t4.Ua; 0 < o3--; ) {
        var l4 = t4.gc[o3], f4 = c4, d4 = r2, p4 = u4, g4 = h4, m4 = (h4 = a3, u4 = i3, l4.Ea);
        switch (e(f4 < d4), e(d4 <= l4.nc), l4.hc) {
          case 2:
            Gr(p4, g4, (d4 - f4) * m4, h4, u4);
            break;
          case 0:
            var v4 = f4, b4 = d4, y4 = h4, w4 = u4, N4 = (_3 = l4).Ea;
            0 == v4 && (Wr(p4, g4, null, null, 1, y4, w4), V2(p4, g4 + 1, 0, 0, N4 - 1, y4, w4 + 1), g4 += N4, w4 += N4, ++v4);
            for (var L4 = 1 << _3.b, A4 = L4 - 1, x3 = q2(N4, _3.b), S3 = _3.K, _3 = _3.w + (v4 >> _3.b) * x3; v4 < b4; ) {
              var P3 = S3, k3 = _3, I3 = 1;
              for (Vr(p4, g4, y4, w4 - N4, 1, y4, w4); I3 < N4; ) {
                var F3 = (I3 & ~A4) + L4;
                F3 > N4 && (F3 = N4), (0, Zr[P3[k3++] >> 8 & 15])(p4, g4 + +I3, y4, w4 + I3 - N4, F3 - I3, y4, w4 + I3), I3 = F3;
              }
              g4 += N4, w4 += N4, ++v4 & A4 || (_3 += x3);
            }
            d4 != l4.nc && n2(h4, u4 - m4, h4, u4 + (d4 - f4 - 1) * m4, m4);
            break;
          case 1:
            for (m4 = p4, b4 = g4, N4 = (p4 = l4.Ea) - (w4 = p4 & ~(y4 = (g4 = 1 << l4.b) - 1)), v4 = q2(p4, l4.b), L4 = l4.K, l4 = l4.w + (f4 >> l4.b) * v4; f4 < d4; ) {
              for (A4 = L4, x3 = l4, S3 = new T2(), _3 = b4 + w4, P3 = b4 + p4; b4 < _3; ) Y2(A4[x3++], S3), $r(S3, m4, b4, g4, h4, u4), b4 += g4, u4 += g4;
              b4 < P3 && (Y2(A4[x3++], S3), $r(S3, m4, b4, N4, h4, u4), b4 += N4, u4 += N4), ++f4 & y4 || (l4 += v4);
            }
            break;
          case 3:
            if (p4 == h4 && g4 == u4 && 0 < l4.b) {
              for (b4 = h4, p4 = m4 = u4 + (d4 - f4) * m4 - (w4 = (d4 - f4) * q2(l4.Ea, l4.b)), g4 = h4, y4 = u4, v4 = [], w4 = (N4 = w4) - 1; 0 <= w4; --w4) v4[w4] = g4[y4 + w4];
              for (w4 = N4 - 1; 0 <= w4; --w4) b4[p4 + w4] = v4[w4];
              Yr(l4, f4, d4, h4, m4, h4, u4);
            } else Yr(l4, f4, d4, p4, g4, h4, u4);
        }
        u4 = a3, h4 = i3;
      }
      h4 != i3 && n2(a3, i3, u4, h4, s3);
    }
    function Lt2(t4, r2) {
      var n3 = t4.V, i3 = t4.Ba + t4.c * t4.C, a3 = r2 - t4.C;
      if (e(r2 <= t4.l.o), e(16 >= a3), 0 < a3) {
        var o3 = t4.l, s3 = t4.Ta, c4 = t4.Ua, u4 = o3.width;
        if (Nt2(t4, a3, n3, i3), a3 = c4 = [c4], e((n3 = t4.C) < (i3 = r2)), e(o3.v < o3.va), i3 > o3.o && (i3 = o3.o), n3 < o3.j) {
          var h4 = o3.j - n3;
          n3 = o3.j;
          a3[0] += h4 * u4;
        }
        if (n3 >= i3 ? n3 = 0 : (a3[0] += 4 * o3.v, o3.ka = n3 - o3.j, o3.U = o3.va - o3.v, o3.T = i3 - n3, n3 = 1), n3) {
          if (c4 = c4[0], 11 > (n3 = t4.ca).S) {
            var l4 = n3.f.RGBA, f4 = (i3 = n3.S, a3 = o3.U, o3 = o3.T, h4 = l4.eb, l4.A), d4 = o3;
            for (l4 = l4.fb + t4.Ma * l4.A; 0 < d4--; ) {
              var p4 = s3, g4 = c4, m4 = a3, v4 = h4, b4 = l4;
              switch (i3) {
                case En:
                  Qr(p4, g4, m4, v4, b4);
                  break;
                case qn:
                  tn(p4, g4, m4, v4, b4);
                  break;
                case Hn:
                  tn(p4, g4, m4, v4, b4), An(v4, b4, 0, m4, 1, 0);
                  break;
                case Dn:
                  nn(p4, g4, m4, v4, b4);
                  break;
                case Rn:
                  et2(p4, g4, m4, v4, b4, 1);
                  break;
                case Wn:
                  et2(p4, g4, m4, v4, b4, 1), An(v4, b4, 0, m4, 1, 0);
                  break;
                case Tn:
                  et2(p4, g4, m4, v4, b4, 0);
                  break;
                case Vn:
                  et2(p4, g4, m4, v4, b4, 0), An(v4, b4, 1, m4, 1, 0);
                  break;
                case Un:
                  en(p4, g4, m4, v4, b4);
                  break;
                case Gn:
                  en(p4, g4, m4, v4, b4), xn(v4, b4, m4, 1, 0);
                  break;
                case zn:
                  rn(p4, g4, m4, v4, b4);
                  break;
                default:
                  e(0);
              }
              c4 += u4, l4 += f4;
            }
            t4.Ma += o3;
          } else alert("todo:EmitRescaledRowsYUVA");
          e(t4.Ma <= n3.height);
        }
      }
      t4.C = r2, e(t4.C <= t4.i);
    }
    function At2(t4) {
      var e2;
      if (0 < t4.ua) return 0;
      for (e2 = 0; e2 < t4.Wb; ++e2) {
        var r2 = t4.Ya[e2].G, n3 = t4.Ya[e2].H;
        if (0 < r2[1][n3[1] + 0].g || 0 < r2[2][n3[2] + 0].g || 0 < r2[3][n3[3] + 0].g) return 0;
      }
      return 1;
    }
    function xt2(t4, r2, n3, i3, a3, o3) {
      if (0 != t4.Z) {
        var s3 = t4.qd, c4 = t4.rd;
        for (e(null != mi[t4.Z]); r2 < n3; ++r2) mi[t4.Z](s3, c4, i3, a3, i3, a3, o3), s3 = i3, c4 = a3, a3 += o3;
        t4.qd = s3, t4.rd = c4;
      }
    }
    function St(t4, r2) {
      var n3 = t4.l.ma, i3 = 0 == n3.Z || 1 == n3.Z ? t4.l.j : t4.C;
      i3 = t4.C < i3 ? i3 : t4.C;
      if (e(r2 <= t4.l.o), r2 > i3) {
        var a3 = t4.l.width, o3 = n3.ca, s3 = n3.tb + a3 * i3, c4 = t4.V, u4 = t4.Ba + t4.c * i3, h4 = t4.gc;
        e(1 == t4.ab), e(3 == h4[0].hc), Xr(h4[0], i3, r2, c4, u4, o3, s3), xt2(n3, i3, r2, o3, s3, a3);
      }
      t4.C = t4.Ma = r2;
    }
    function _t2(t4, r2, n3, i3, a3, o3, s3) {
      var c4 = t4.$ / i3, u4 = t4.$ % i3, h4 = t4.m, l4 = t4.s, f4 = n3 + t4.$, d4 = f4;
      a3 = n3 + i3 * a3;
      var p4 = n3 + i3 * o3, g4 = 280 + l4.ua, m4 = t4.Pb ? c4 : 16777216, v4 = 0 < l4.ua ? l4.Wa : null, b4 = l4.wc, y4 = f4 < p4 ? wt2(l4, u4, c4) : null;
      e(t4.C < o3), e(p4 <= a3);
      var w4 = false;
      t: for (; ; ) {
        for (; w4 || f4 < p4; ) {
          var N4 = 0;
          if (c4 >= m4) {
            var _3 = f4 - n3;
            e((m4 = t4).Pb), m4.wd = m4.m, m4.xd = _3, 0 < m4.s.ua && B2(m4.s.Wa, m4.s.vb), m4 = c4 + ti;
          }
          if (u4 & b4 || (y4 = wt2(l4, u4, c4)), e(null != y4), y4.Qb && (r2[f4] = y4.qb, w4 = true), !w4) if (S2(h4), y4.jc) {
            N4 = h4, _3 = r2;
            var P3 = f4, k3 = y4.pd[L3(N4) & Dr - 1];
            e(y4.jc), 256 > k3.g ? (x2(N4, N4.u + k3.g), _3[P3] = k3.value, N4 = 0) : (x2(N4, N4.u + k3.g - 256), e(256 <= k3.value), N4 = k3.value), 0 == N4 && (w4 = true);
          } else N4 = bt2(y4.G[0], y4.H[0], h4);
          if (h4.h) break;
          if (w4 || 256 > N4) {
            if (!w4) if (y4.nd) r2[f4] = (y4.qb | N4 << 8) >>> 0;
            else {
              if (S2(h4), w4 = bt2(y4.G[1], y4.H[1], h4), S2(h4), _3 = bt2(y4.G[2], y4.H[2], h4), P3 = bt2(y4.G[3], y4.H[3], h4), h4.h) break;
              r2[f4] = (P3 << 24 | w4 << 16 | N4 << 8 | _3) >>> 0;
            }
            if (w4 = false, ++f4, ++u4 >= i3 && (u4 = 0, ++c4, null != s3 && c4 <= o3 && !(c4 % 16) && s3(t4, c4), null != v4)) for (; d4 < f4; ) N4 = r2[d4++], v4.X[(506832829 * N4 & 4294967295) >>> v4.Mb] = N4;
          } else if (280 > N4) {
            if (N4 = mt2(N4 - 256, h4), _3 = bt2(y4.G[4], y4.H[4], h4), S2(h4), _3 = vt2(i3, _3 = mt2(_3, h4)), h4.h) break;
            if (f4 - n3 < _3 || a3 - f4 < N4) break t;
            for (P3 = 0; P3 < N4; ++P3) r2[f4 + P3] = r2[f4 + P3 - _3];
            for (f4 += N4, u4 += N4; u4 >= i3; ) u4 -= i3, ++c4, null != s3 && c4 <= o3 && !(c4 % 16) && s3(t4, c4);
            if (e(f4 <= a3), u4 & b4 && (y4 = wt2(l4, u4, c4)), null != v4) for (; d4 < f4; ) N4 = r2[d4++], v4.X[(506832829 * N4 & 4294967295) >>> v4.Mb] = N4;
          } else {
            if (!(N4 < g4)) break t;
            for (w4 = N4 - 280, e(null != v4); d4 < f4; ) N4 = r2[d4++], v4.X[(506832829 * N4 & 4294967295) >>> v4.Mb] = N4;
            N4 = f4, e(!(w4 >>> (_3 = v4).Xa)), r2[N4] = _3.X[w4], w4 = true;
          }
          w4 || e(h4.h == A3(h4));
        }
        if (t4.Pb && h4.h && f4 < a3) e(t4.m.h), t4.a = 5, t4.m = t4.wd, t4.$ = t4.xd, 0 < t4.s.ua && B2(t4.s.vb, t4.s.Wa);
        else {
          if (h4.h) break t;
          null != s3 && s3(t4, c4 > o3 ? o3 : c4), t4.a = 0, t4.$ = f4 - n3;
        }
        return 1;
      }
      return t4.a = 3, 0;
    }
    function Pt2(t4) {
      e(null != t4), t4.vc = null, t4.yc = null, t4.Ya = null;
      var r2 = t4.Wa;
      null != r2 && (r2.X = null), t4.vb = null, e(null != t4);
    }
    function kt2() {
      var e2 = new or();
      return null == e2 ? null : (e2.a = 0, e2.xb = gi, rt2("Predictor", "VP8LPredictors"), rt2("Predictor", "VP8LPredictors_C"), rt2("PredictorAdd", "VP8LPredictorsAdd"), rt2("PredictorAdd", "VP8LPredictorsAdd_C"), Gr = G2, $r = J2, Qr = K2, tn = Z2, en = $2, rn = Q2, nn = tt2, t3.VP8LMapColor32b = Jr, t3.VP8LMapColor8b = Kr, e2);
    }
    function It2(t4, r2, n3, s3, c4) {
      var u4 = 1, f4 = [t4], p4 = [r2], g4 = s3.m, m4 = s3.s, v4 = null, b4 = 0;
      t: for (; ; ) {
        if (n3) for (; u4 && y3(g4, 1); ) {
          var w4 = f4, N4 = p4, A4 = s3, _3 = 1, P3 = A4.m, k3 = A4.gc[A4.ab], I3 = y3(P3, 2);
          if (A4.Oc & 1 << I3) u4 = 0;
          else {
            switch (A4.Oc |= 1 << I3, k3.hc = I3, k3.Ea = w4[0], k3.nc = N4[0], k3.K = [null], ++A4.ab, e(4 >= A4.ab), I3) {
              case 0:
              case 1:
                k3.b = y3(P3, 3) + 2, _3 = It2(q2(k3.Ea, k3.b), q2(k3.nc, k3.b), 0, A4, k3.K), k3.K = k3.K[0];
                break;
              case 3:
                var F3, C3 = y3(P3, 8) + 1, j3 = 16 < C3 ? 0 : 4 < C3 ? 1 : 2 < C3 ? 2 : 3;
                if (w4[0] = q2(k3.Ea, j3), k3.b = j3, F3 = _3 = It2(C3, 1, 0, A4, k3.K)) {
                  var B3, M3 = C3, E3 = k3, R3 = 1 << (8 >> E3.b), T3 = a2(R3);
                  if (null == T3) F3 = 0;
                  else {
                    var U3 = E3.K[0], z3 = E3.w;
                    for (T3[0] = E3.K[0][0], B3 = 1; B3 < 1 * M3; ++B3) T3[B3] = D2(U3[z3 + B3], T3[B3 - 1]);
                    for (; B3 < 4 * R3; ++B3) T3[B3] = 0;
                    E3.K[0] = null, E3.K[0] = T3, F3 = 1;
                  }
                }
                _3 = F3;
                break;
              case 2:
                break;
              default:
                e(0);
            }
            u4 = _3;
          }
        }
        if (f4 = f4[0], p4 = p4[0], u4 && y3(g4, 1) && !(u4 = 1 <= (b4 = y3(g4, 4)) && 11 >= b4)) {
          s3.a = 3;
          break t;
        }
        var H3;
        if (H3 = u4) e: {
          var W3, V3, G3, Y3 = s3, J3 = f4, X3 = p4, K3 = b4, Z3 = n3, $3 = Y3.m, Q3 = Y3.s, tt3 = [null], et3 = 1, rt3 = 0, nt3 = Qn[K3];
          r: for (; ; ) {
            if (Z3 && y3($3, 1)) {
              var it3 = y3($3, 3) + 2, at3 = q2(J3, it3), ot3 = q2(X3, it3), st3 = at3 * ot3;
              if (!It2(at3, ot3, 0, Y3, tt3)) break r;
              for (tt3 = tt3[0], Q3.xc = it3, W3 = 0; W3 < st3; ++W3) {
                var ct3 = tt3[W3] >> 8 & 65535;
                tt3[W3] = ct3, ct3 >= et3 && (et3 = ct3 + 1);
              }
            }
            if ($3.h) break r;
            for (V3 = 0; 5 > V3; ++V3) {
              var ut3 = Xn[V3];
              !V3 && 0 < K3 && (ut3 += 1 << K3), rt3 < ut3 && (rt3 = ut3);
            }
            var ht3 = o2(et3 * nt3, l3), lt3 = et3, ft3 = o2(lt3, d3);
            if (null == ft3) var dt3 = null;
            else e(65536 >= lt3), dt3 = ft3;
            var pt3 = a2(rt3);
            if (null == dt3 || null == pt3 || null == ht3) {
              Y3.a = 1;
              break r;
            }
            var gt3 = ht3;
            for (W3 = G3 = 0; W3 < et3; ++W3) {
              var mt3 = dt3[W3], vt3 = mt3.G, bt3 = mt3.H, wt3 = 0, Nt3 = 1, Lt3 = 0;
              for (V3 = 0; 5 > V3; ++V3) {
                ut3 = Xn[V3], vt3[V3] = gt3, bt3[V3] = G3, !V3 && 0 < K3 && (ut3 += 1 << K3);
                n: {
                  var At3, xt3 = ut3, St2 = Y3, kt3 = pt3, Ft3 = gt3, Ct3 = G3, jt3 = 0, Ot3 = St2.m, Bt3 = y3(Ot3, 1);
                  if (i2(kt3, 0, 0, xt3), Bt3) {
                    var Mt3 = y3(Ot3, 1) + 1, Et3 = y3(Ot3, 1), qt3 = y3(Ot3, 0 == Et3 ? 1 : 8);
                    kt3[qt3] = 1, 2 == Mt3 && (kt3[qt3 = y3(Ot3, 8)] = 1);
                    var Dt3 = 1;
                  } else {
                    var Rt3 = a2(19), Tt3 = y3(Ot3, 4) + 4;
                    if (19 < Tt3) {
                      St2.a = 3;
                      var Ut3 = 0;
                      break n;
                    }
                    for (At3 = 0; At3 < Tt3; ++At3) Rt3[Zn[At3]] = y3(Ot3, 3);
                    var zt3 = void 0, Ht3 = void 0, Wt3 = St2, Vt3 = Rt3, Gt3 = xt3, Yt3 = kt3, Jt3 = 0, Xt3 = Wt3.m, Kt3 = 8, Zt3 = o2(128, l3);
                    i: for (; h3(Zt3, 0, 7, Vt3, 19); ) {
                      if (y3(Xt3, 1)) {
                        var $t3 = 2 + 2 * y3(Xt3, 3);
                        if ((zt3 = 2 + y3(Xt3, $t3)) > Gt3) break i;
                      } else zt3 = Gt3;
                      for (Ht3 = 0; Ht3 < Gt3 && zt3--; ) {
                        S2(Xt3);
                        var Qt3 = Zt3[0 + (127 & L3(Xt3))];
                        x2(Xt3, Xt3.u + Qt3.g);
                        var te3 = Qt3.value;
                        if (16 > te3) Yt3[Ht3++] = te3, 0 != te3 && (Kt3 = te3);
                        else {
                          var ee3 = 16 == te3, re3 = te3 - 16, ne3 = Jn[re3], ie3 = y3(Xt3, Yn[re3]) + ne3;
                          if (Ht3 + ie3 > Gt3) break i;
                          for (var ae3 = ee3 ? Kt3 : 0; 0 < ie3--; ) Yt3[Ht3++] = ae3;
                        }
                      }
                      Jt3 = 1;
                      break i;
                    }
                    Jt3 || (Wt3.a = 3), Dt3 = Jt3;
                  }
                  (Dt3 = Dt3 && !Ot3.h) && (jt3 = h3(Ft3, Ct3, 8, kt3, xt3)), Dt3 && 0 != jt3 ? Ut3 = jt3 : (St2.a = 3, Ut3 = 0);
                }
                if (0 == Ut3) break r;
                if (Nt3 && 1 == Kn[V3] && (Nt3 = 0 == gt3[G3].g), wt3 += gt3[G3].g, G3 += Ut3, 3 >= V3) {
                  var oe3, se3 = pt3[0];
                  for (oe3 = 1; oe3 < ut3; ++oe3) pt3[oe3] > se3 && (se3 = pt3[oe3]);
                  Lt3 += se3;
                }
              }
              if (mt3.nd = Nt3, mt3.Qb = 0, Nt3 && (mt3.qb = (vt3[3][bt3[3] + 0].value << 24 | vt3[1][bt3[1] + 0].value << 16 | vt3[2][bt3[2] + 0].value) >>> 0, 0 == wt3 && 256 > vt3[0][bt3[0] + 0].value && (mt3.Qb = 1, mt3.qb += vt3[0][bt3[0] + 0].value << 8)), mt3.jc = !mt3.Qb && 6 > Lt3, mt3.jc) {
                var ce3, ue3 = mt3;
                for (ce3 = 0; ce3 < Dr; ++ce3) {
                  var he3 = ce3, le3 = ue3.pd[he3], fe3 = ue3.G[0][ue3.H[0] + he3];
                  256 <= fe3.value ? (le3.g = fe3.g + 256, le3.value = fe3.value) : (le3.g = 0, le3.value = 0, he3 >>= yt2(fe3, 8, le3), he3 >>= yt2(ue3.G[1][ue3.H[1] + he3], 16, le3), he3 >>= yt2(ue3.G[2][ue3.H[2] + he3], 0, le3), yt2(ue3.G[3][ue3.H[3] + he3], 24, le3));
                }
              }
            }
            Q3.vc = tt3, Q3.Wb = et3, Q3.Ya = dt3, Q3.yc = ht3, H3 = 1;
            break e;
          }
          H3 = 0;
        }
        if (!(u4 = H3)) {
          s3.a = 3;
          break t;
        }
        if (0 < b4) {
          if (m4.ua = 1 << b4, !O2(m4.Wa, b4)) {
            s3.a = 1, u4 = 0;
            break t;
          }
        } else m4.ua = 0;
        var de3 = s3, pe3 = f4, ge3 = p4, me3 = de3.s, ve3 = me3.xc;
        if (de3.c = pe3, de3.i = ge3, me3.md = q2(pe3, ve3), me3.wc = 0 == ve3 ? -1 : (1 << ve3) - 1, n3) {
          s3.xb = pi;
          break t;
        }
        if (null == (v4 = a2(f4 * p4))) {
          s3.a = 1, u4 = 0;
          break t;
        }
        u4 = (u4 = _t2(s3, v4, 0, f4, p4, p4, null)) && !g4.h;
        break t;
      }
      return u4 ? (null != c4 ? c4[0] = v4 : (e(null == v4), e(n3)), s3.$ = 0, n3 || Pt2(m4)) : Pt2(m4), u4;
    }
    function Ft2(t4, r2) {
      var n3 = t4.c * t4.i, i3 = n3 + r2 + 16 * r2;
      return e(t4.c <= r2), t4.V = a2(i3), null == t4.V ? (t4.Ta = null, t4.Ua = 0, t4.a = 1, 0) : (t4.Ta = t4.V, t4.Ua = t4.Ba + n3 + r2, 1);
    }
    function Ct2(t4, r2) {
      var n3 = t4.C, i3 = r2 - n3, a3 = t4.V, o3 = t4.Ba + t4.c * n3;
      for (e(r2 <= t4.l.o); 0 < i3; ) {
        var s3 = 16 < i3 ? 16 : i3, c4 = t4.l.ma, u4 = t4.l.width, h4 = u4 * s3, l4 = c4.ca, f4 = c4.tb + u4 * n3, d4 = t4.Ta, p4 = t4.Ua;
        Nt2(t4, s3, a3, o3), _n(d4, p4, l4, f4, h4), xt2(c4, n3, n3 + s3, l4, f4, u4), i3 -= s3, a3 += s3 * t4.c, n3 += s3;
      }
      e(n3 == r2), t4.C = t4.Ma = r2;
    }
    function jt2() {
      this.ub = this.yd = this.td = this.Rb = 0;
    }
    function Ot2() {
      this.Kd = this.Ld = this.Ud = this.Td = this.i = this.c = 0;
    }
    function Bt2() {
      this.Fb = this.Bb = this.Cb = 0, this.Zb = a2(4), this.Lb = a2(4);
    }
    function Mt2() {
      this.Yb = function() {
        var t4 = [];
        return function t5(e2, r2, n3) {
          for (var i3 = n3[r2], a3 = 0; a3 < i3 && (e2.push(n3.length > r2 + 1 ? [] : 0), !(n3.length < r2 + 1)); a3++) t5(e2[a3], r2 + 1, n3);
        }(t4, 0, [3, 11]), t4;
      }();
    }
    function Et2() {
      this.jb = a2(3), this.Wc = s2([4, 8], Mt2), this.Xc = s2([4, 17], Mt2);
    }
    function qt2() {
      this.Pc = this.wb = this.Tb = this.zd = 0, this.vd = new a2(4), this.od = new a2(4);
    }
    function Dt2() {
      this.ld = this.La = this.dd = this.tc = 0;
    }
    function Rt2() {
      this.Na = this.la = 0;
    }
    function Tt2() {
      this.Sc = [0, 0], this.Eb = [0, 0], this.Qc = [0, 0], this.ia = this.lc = 0;
    }
    function Ut2() {
      this.ad = a2(384), this.Za = 0, this.Ob = a2(16), this.$b = this.Ad = this.ia = this.Gc = this.Hc = this.Dd = 0;
    }
    function zt2() {
      this.uc = this.M = this.Nb = 0, this.wa = Array(new Dt2()), this.Y = 0, this.ya = Array(new Ut2()), this.aa = 0, this.l = new Gt2();
    }
    function Ht2() {
      this.y = a2(16), this.f = a2(8), this.ea = a2(8);
    }
    function Wt2() {
      this.cb = this.a = 0, this.sc = "", this.m = new w3(), this.Od = new jt2(), this.Kc = new Ot2(), this.ed = new qt2(), this.Qa = new Bt2(), this.Ic = this.$c = this.Aa = 0, this.D = new zt2(), this.Xb = this.Va = this.Hb = this.zb = this.yb = this.Ub = this.za = 0, this.Jc = o2(8, w3), this.ia = 0, this.pb = o2(4, Tt2), this.Pa = new Et2(), this.Bd = this.kc = 0, this.Ac = [], this.Bc = 0, this.zc = [0, 0, 0, 0], this.Gd = Array(new Ht2()), this.Hd = 0, this.rb = Array(new Rt2()), this.sb = 0, this.wa = Array(new Dt2()), this.Y = 0, this.oc = [], this.pc = 0, this.sa = [], this.ta = 0, this.qa = [], this.ra = 0, this.Ha = [], this.B = this.R = this.Ia = 0, this.Ec = [], this.M = this.ja = this.Vb = this.Fc = 0, this.ya = Array(new Ut2()), this.L = this.aa = 0, this.gd = s2([4, 2], Dt2), this.ga = null, this.Fa = [], this.Cc = this.qc = this.P = 0, this.Gb = [], this.Uc = 0, this.mb = [], this.nb = 0, this.rc = [], this.Ga = this.Vc = 0;
    }
    function Vt2(t4, e2) {
      return 0 > t4 ? 0 : t4 > e2 ? e2 : t4;
    }
    function Gt2() {
      this.T = this.U = this.ka = this.height = this.width = 0, this.y = [], this.f = [], this.ea = [], this.Rc = this.fa = this.W = this.N = this.O = 0, this.ma = "void", this.put = "VP8IoPutHook", this.ac = "VP8IoSetupHook", this.bc = "VP8IoTeardownHook", this.ha = this.Kb = 0, this.data = [], this.hb = this.ib = this.da = this.o = this.j = this.va = this.v = this.Da = this.ob = this.w = 0, this.F = [], this.J = 0;
    }
    function Yt2() {
      var t4 = new Wt2();
      return null != t4 && (t4.a = 0, t4.sc = "OK", t4.cb = 0, t4.Xb = 0, ni || (ni = Zt2)), t4;
    }
    function Jt2(t4, e2, r2) {
      return 0 == t4.a && (t4.a = e2, t4.sc = r2, t4.cb = 0), 0;
    }
    function Xt2(t4, e2, r2) {
      return 3 <= r2 && 157 == t4[e2 + 0] && 1 == t4[e2 + 1] && 42 == t4[e2 + 2];
    }
    function Kt2(t4, r2) {
      if (null == t4) return 0;
      if (t4.a = 0, t4.sc = "OK", null == r2) return Jt2(t4, 2, "null VP8Io passed to VP8GetHeaders()");
      var n3 = r2.data, a3 = r2.w, o3 = r2.ha;
      if (4 > o3) return Jt2(t4, 7, "Truncated header.");
      var s3 = n3[a3 + 0] | n3[a3 + 1] << 8 | n3[a3 + 2] << 16, c4 = t4.Od;
      if (c4.Rb = !(1 & s3), c4.td = s3 >> 1 & 7, c4.yd = s3 >> 4 & 1, c4.ub = s3 >> 5, 3 < c4.td) return Jt2(t4, 3, "Incorrect keyframe parameters.");
      if (!c4.yd) return Jt2(t4, 4, "Frame not displayable.");
      a3 += 3, o3 -= 3;
      var u4 = t4.Kc;
      if (c4.Rb) {
        if (7 > o3) return Jt2(t4, 7, "cannot parse picture header");
        if (!Xt2(n3, a3, o3)) return Jt2(t4, 3, "Bad code word");
        u4.c = 16383 & (n3[a3 + 4] << 8 | n3[a3 + 3]), u4.Td = n3[a3 + 4] >> 6, u4.i = 16383 & (n3[a3 + 6] << 8 | n3[a3 + 5]), u4.Ud = n3[a3 + 6] >> 6, a3 += 7, o3 -= 7, t4.za = u4.c + 15 >> 4, t4.Ub = u4.i + 15 >> 4, r2.width = u4.c, r2.height = u4.i, r2.Da = 0, r2.j = 0, r2.v = 0, r2.va = r2.width, r2.o = r2.height, r2.da = 0, r2.ib = r2.width, r2.hb = r2.height, r2.U = r2.width, r2.T = r2.height, i2((s3 = t4.Pa).jb, 0, 255, s3.jb.length), e(null != (s3 = t4.Qa)), s3.Cb = 0, s3.Bb = 0, s3.Fb = 1, i2(s3.Zb, 0, 0, s3.Zb.length), i2(s3.Lb, 0, 0, s3.Lb);
      }
      if (c4.ub > o3) return Jt2(t4, 7, "bad partition length");
      p3(s3 = t4.m, n3, a3, c4.ub), a3 += c4.ub, o3 -= c4.ub, c4.Rb && (u4.Ld = P2(s3), u4.Kd = P2(s3)), u4 = t4.Qa;
      var h4, l4 = t4.Pa;
      if (e(null != s3), e(null != u4), u4.Cb = P2(s3), u4.Cb) {
        if (u4.Bb = P2(s3), P2(s3)) {
          for (u4.Fb = P2(s3), h4 = 0; 4 > h4; ++h4) u4.Zb[h4] = P2(s3) ? m3(s3, 7) : 0;
          for (h4 = 0; 4 > h4; ++h4) u4.Lb[h4] = P2(s3) ? m3(s3, 6) : 0;
        }
        if (u4.Bb) for (h4 = 0; 3 > h4; ++h4) l4.jb[h4] = P2(s3) ? g3(s3, 8) : 255;
      } else u4.Bb = 0;
      if (s3.Ka) return Jt2(t4, 3, "cannot parse segment header");
      if ((u4 = t4.ed).zd = P2(s3), u4.Tb = g3(s3, 6), u4.wb = g3(s3, 3), u4.Pc = P2(s3), u4.Pc && P2(s3)) {
        for (l4 = 0; 4 > l4; ++l4) P2(s3) && (u4.vd[l4] = m3(s3, 6));
        for (l4 = 0; 4 > l4; ++l4) P2(s3) && (u4.od[l4] = m3(s3, 6));
      }
      if (t4.L = 0 == u4.Tb ? 0 : u4.zd ? 1 : 2, s3.Ka) return Jt2(t4, 3, "cannot parse filter header");
      var f4 = o3;
      if (o3 = h4 = a3, a3 = h4 + f4, u4 = f4, t4.Xb = (1 << g3(t4.m, 2)) - 1, f4 < 3 * (l4 = t4.Xb)) n3 = 7;
      else {
        for (h4 += 3 * l4, u4 -= 3 * l4, f4 = 0; f4 < l4; ++f4) {
          var d4 = n3[o3 + 0] | n3[o3 + 1] << 8 | n3[o3 + 2] << 16;
          d4 > u4 && (d4 = u4), p3(t4.Jc[+f4], n3, h4, d4), h4 += d4, u4 -= d4, o3 += 3;
        }
        p3(t4.Jc[+l4], n3, h4, u4), n3 = h4 < a3 ? 0 : 5;
      }
      if (0 != n3) return Jt2(t4, n3, "cannot parse partitions");
      for (n3 = g3(h4 = t4.m, 7), o3 = P2(h4) ? m3(h4, 4) : 0, a3 = P2(h4) ? m3(h4, 4) : 0, u4 = P2(h4) ? m3(h4, 4) : 0, l4 = P2(h4) ? m3(h4, 4) : 0, h4 = P2(h4) ? m3(h4, 4) : 0, f4 = t4.Qa, d4 = 0; 4 > d4; ++d4) {
        if (f4.Cb) {
          var v4 = f4.Zb[d4];
          f4.Fb || (v4 += n3);
        } else {
          if (0 < d4) {
            t4.pb[d4] = t4.pb[0];
            continue;
          }
          v4 = n3;
        }
        var b4 = t4.pb[d4];
        b4.Sc[0] = ei[Vt2(v4 + o3, 127)], b4.Sc[1] = ri[Vt2(v4 + 0, 127)], b4.Eb[0] = 2 * ei[Vt2(v4 + a3, 127)], b4.Eb[1] = 101581 * ri[Vt2(v4 + u4, 127)] >> 16, 8 > b4.Eb[1] && (b4.Eb[1] = 8), b4.Qc[0] = ei[Vt2(v4 + l4, 117)], b4.Qc[1] = ri[Vt2(v4 + h4, 127)], b4.lc = v4 + h4;
      }
      if (!c4.Rb) return Jt2(t4, 4, "Not a key frame.");
      for (P2(s3), c4 = t4.Pa, n3 = 0; 4 > n3; ++n3) {
        for (o3 = 0; 8 > o3; ++o3) for (a3 = 0; 3 > a3; ++a3) for (u4 = 0; 11 > u4; ++u4) l4 = k2(s3, ui[n3][o3][a3][u4]) ? g3(s3, 8) : si[n3][o3][a3][u4], c4.Wc[n3][o3].Yb[a3][u4] = l4;
        for (o3 = 0; 17 > o3; ++o3) c4.Xc[n3][o3] = c4.Wc[n3][hi[o3]];
      }
      return t4.kc = P2(s3), t4.kc && (t4.Bd = g3(s3, 8)), t4.cb = 1;
    }
    function Zt2(t4, e2, r2, n3, i3, a3, o3) {
      var s3 = e2[i3].Yb[r2];
      for (r2 = 0; 16 > i3; ++i3) {
        if (!k2(t4, s3[r2 + 0])) return i3;
        for (; !k2(t4, s3[r2 + 1]); ) if (s3 = e2[++i3].Yb[0], r2 = 0, 16 == i3) return 16;
        var c4 = e2[i3 + 1].Yb;
        if (k2(t4, s3[r2 + 2])) {
          var u4 = t4, h4 = 0;
          if (k2(u4, (f4 = s3)[(l4 = r2) + 3])) if (k2(u4, f4[l4 + 6])) {
            for (s3 = 0, l4 = 2 * (h4 = k2(u4, f4[l4 + 8])) + (f4 = k2(u4, f4[l4 + 9 + h4])), h4 = 0, f4 = ii[l4]; f4[s3]; ++s3) h4 += h4 + k2(u4, f4[s3]);
            h4 += 3 + (8 << l4);
          } else k2(u4, f4[l4 + 7]) ? (h4 = 7 + 2 * k2(u4, 165), h4 += k2(u4, 145)) : h4 = 5 + k2(u4, 159);
          else h4 = k2(u4, f4[l4 + 4]) ? 3 + k2(u4, f4[l4 + 5]) : 2;
          s3 = c4[2];
        } else h4 = 1, s3 = c4[1];
        c4 = o3 + ai[i3], 0 > (u4 = t4).b && _2(u4);
        var l4, f4 = u4.b, d4 = (l4 = u4.Ca >> 1) - (u4.I >> f4) >> 31;
        --u4.b, u4.Ca += d4, u4.Ca |= 1, u4.I -= (l4 + 1 & d4) << f4, a3[c4] = ((h4 ^ d4) - d4) * n3[(0 < i3) + 0];
      }
      return 16;
    }
    function $t2(t4) {
      var e2 = t4.rb[t4.sb - 1];
      e2.la = 0, e2.Na = 0, i2(t4.zc, 0, 0, t4.zc.length), t4.ja = 0;
    }
    function Qt2(t4, r2) {
      if (null == t4) return 0;
      if (null == r2) return Jt2(t4, 2, "NULL VP8Io parameter in VP8Decode().");
      if (!t4.cb && !Kt2(t4, r2)) return 0;
      if (e(t4.cb), null == r2.ac || r2.ac(r2)) {
        r2.ob && (t4.L = 0);
        var s3 = Ri[t4.L];
        if (2 == t4.L ? (t4.yb = 0, t4.zb = 0) : (t4.yb = r2.v - s3 >> 4, t4.zb = r2.j - s3 >> 4, 0 > t4.yb && (t4.yb = 0), 0 > t4.zb && (t4.zb = 0)), t4.Va = r2.o + 15 + s3 >> 4, t4.Hb = r2.va + 15 + s3 >> 4, t4.Hb > t4.za && (t4.Hb = t4.za), t4.Va > t4.Ub && (t4.Va = t4.Ub), 0 < t4.L) {
          var c4 = t4.ed;
          for (s3 = 0; 4 > s3; ++s3) {
            var u4;
            if (t4.Qa.Cb) {
              var h4 = t4.Qa.Lb[s3];
              t4.Qa.Fb || (h4 += c4.Tb);
            } else h4 = c4.Tb;
            for (u4 = 0; 1 >= u4; ++u4) {
              var l4 = t4.gd[s3][u4], f4 = h4;
              if (c4.Pc && (f4 += c4.vd[0], u4 && (f4 += c4.od[0])), 0 < (f4 = 0 > f4 ? 0 : 63 < f4 ? 63 : f4)) {
                var d4 = f4;
                0 < c4.wb && ((d4 = 4 < c4.wb ? d4 >> 2 : d4 >> 1) > 9 - c4.wb && (d4 = 9 - c4.wb)), 1 > d4 && (d4 = 1), l4.dd = d4, l4.tc = 2 * f4 + d4, l4.ld = 40 <= f4 ? 2 : 15 <= f4 ? 1 : 0;
              } else l4.tc = 0;
              l4.La = u4;
            }
          }
        }
        s3 = 0;
      } else Jt2(t4, 6, "Frame setup failed"), s3 = t4.a;
      if (s3 = 0 == s3) {
        if (s3) {
          t4.$c = 0, 0 < t4.Aa || (t4.Ic = Ui);
          t: {
            s3 = t4.Ic;
            c4 = 4 * (d4 = t4.za);
            var p4 = 32 * d4, g4 = d4 + 1, m4 = 0 < t4.L ? d4 * (0 < t4.Aa ? 2 : 1) : 0, v4 = (2 == t4.Aa ? 2 : 1) * d4;
            if ((l4 = c4 + 832 + (u4 = 3 * (16 * s3 + Ri[t4.L]) / 2 * p4) + (h4 = null != t4.Fa && 0 < t4.Fa.length ? t4.Kc.c * t4.Kc.i : 0)) != l4) s3 = 0;
            else {
              if (l4 > t4.Vb) {
                if (t4.Vb = 0, t4.Ec = a2(l4), t4.Fc = 0, null == t4.Ec) {
                  s3 = Jt2(t4, 1, "no memory during frame initialization.");
                  break t;
                }
                t4.Vb = l4;
              }
              l4 = t4.Ec, f4 = t4.Fc, t4.Ac = l4, t4.Bc = f4, f4 += c4, t4.Gd = o2(p4, Ht2), t4.Hd = 0, t4.rb = o2(g4 + 1, Rt2), t4.sb = 1, t4.wa = m4 ? o2(m4, Dt2) : null, t4.Y = 0, t4.D.Nb = 0, t4.D.wa = t4.wa, t4.D.Y = t4.Y, 0 < t4.Aa && (t4.D.Y += d4), e(true), t4.oc = l4, t4.pc = f4, f4 += 832, t4.ya = o2(v4, Ut2), t4.aa = 0, t4.D.ya = t4.ya, t4.D.aa = t4.aa, 2 == t4.Aa && (t4.D.aa += d4), t4.R = 16 * d4, t4.B = 8 * d4, d4 = (p4 = Ri[t4.L]) * t4.R, p4 = p4 / 2 * t4.B, t4.sa = l4, t4.ta = f4 + d4, t4.qa = t4.sa, t4.ra = t4.ta + 16 * s3 * t4.R + p4, t4.Ha = t4.qa, t4.Ia = t4.ra + 8 * s3 * t4.B + p4, t4.$c = 0, f4 += u4, t4.mb = h4 ? l4 : null, t4.nb = h4 ? f4 : null, e(f4 + h4 <= t4.Fc + t4.Vb), $t2(t4), i2(t4.Ac, t4.Bc, 0, c4), s3 = 1;
            }
          }
          if (s3) {
            if (r2.ka = 0, r2.y = t4.sa, r2.O = t4.ta, r2.f = t4.qa, r2.N = t4.ra, r2.ea = t4.Ha, r2.Vd = t4.Ia, r2.fa = t4.R, r2.Rc = t4.B, r2.F = null, r2.J = 0, !Cn) {
              for (s3 = -255; 255 >= s3; ++s3) Pn[255 + s3] = 0 > s3 ? -s3 : s3;
              for (s3 = -1020; 1020 >= s3; ++s3) kn[1020 + s3] = -128 > s3 ? -128 : 127 < s3 ? 127 : s3;
              for (s3 = -112; 112 >= s3; ++s3) In[112 + s3] = -16 > s3 ? -16 : 15 < s3 ? 15 : s3;
              for (s3 = -255; 510 >= s3; ++s3) Fn[255 + s3] = 0 > s3 ? 0 : 255 < s3 ? 255 : s3;
              Cn = 1;
            }
            an = ue2, on = ae2, cn = oe2, un = se2, hn = ce2, sn = ie2, ln2 = Je, fn = Xe, dn = $e, pn = Qe, gn = Ke, mn = Ze, vn = tr, bn = er, yn = ze, wn = He, Nn = We, Ln = Ve, fi[0] = xe, fi[1] = le2, fi[2] = Le2, fi[3] = Ae, fi[4] = Se, fi[5] = Pe, fi[6] = _e, fi[7] = ke, fi[8] = Fe, fi[9] = Ie, li[0] = ve2, li[1] = de2, li[2] = pe2, li[3] = ge2, li[4] = be2, li[5] = ye2, li[6] = we2, di[0] = Be, di[1] = fe2, di[2] = Ce, di[3] = je, di[4] = Ee, di[5] = Me, di[6] = qe, s3 = 1;
          } else s3 = 0;
        }
        s3 && (s3 = function(t5, r3) {
          for (t5.M = 0; t5.M < t5.Va; ++t5.M) {
            var o3, s4 = t5.Jc[t5.M & t5.Xb], c5 = t5.m, u5 = t5;
            for (o3 = 0; o3 < u5.za; ++o3) {
              var h5 = c5, l5 = u5, f5 = l5.Ac, d5 = l5.Bc + 4 * o3, p5 = l5.zc, g5 = l5.ya[l5.aa + o3];
              if (l5.Qa.Bb ? g5.$b = k2(h5, l5.Pa.jb[0]) ? 2 + k2(h5, l5.Pa.jb[2]) : k2(h5, l5.Pa.jb[1]) : g5.$b = 0, l5.kc && (g5.Ad = k2(h5, l5.Bd)), g5.Za = !k2(h5, 145) + 0, g5.Za) {
                var m5 = g5.Ob, v5 = 0;
                for (l5 = 0; 4 > l5; ++l5) {
                  var b4, y4 = p5[0 + l5];
                  for (b4 = 0; 4 > b4; ++b4) {
                    y4 = ci[f5[d5 + b4]][y4];
                    for (var w4 = oi[k2(h5, y4[0])]; 0 < w4; ) w4 = oi[2 * w4 + k2(h5, y4[w4])];
                    y4 = -w4, f5[d5 + b4] = y4;
                  }
                  n2(m5, v5, f5, d5, 4), v5 += 4, p5[0 + l5] = y4;
                }
              } else y4 = k2(h5, 156) ? k2(h5, 128) ? 1 : 3 : k2(h5, 163) ? 2 : 0, g5.Ob[0] = y4, i2(f5, d5, y4, 4), i2(p5, 0, y4, 4);
              g5.Dd = k2(h5, 142) ? k2(h5, 114) ? k2(h5, 183) ? 1 : 3 : 2 : 0;
            }
            if (u5.m.Ka) return Jt2(t5, 7, "Premature end-of-partition0 encountered.");
            for (; t5.ja < t5.za; ++t5.ja) {
              if (u5 = s4, h5 = (c5 = t5).rb[c5.sb - 1], f5 = c5.rb[c5.sb + c5.ja], o3 = c5.ya[c5.aa + c5.ja], d5 = c5.kc ? o3.Ad : 0) h5.la = f5.la = 0, o3.Za || (h5.Na = f5.Na = 0), o3.Hc = 0, o3.Gc = 0, o3.ia = 0;
              else {
                var N4, L4;
                h5 = f5, f5 = u5, d5 = c5.Pa.Xc, p5 = c5.ya[c5.aa + c5.ja], g5 = c5.pb[p5.$b];
                if (l5 = p5.ad, m5 = 0, v5 = c5.rb[c5.sb - 1], y4 = b4 = 0, i2(l5, m5, 0, 384), p5.Za) var A4 = 0, x3 = d5[3];
                else {
                  w4 = a2(16);
                  var S3 = h5.Na + v5.Na;
                  if (S3 = ni(f5, d5[1], S3, g5.Eb, 0, w4, 0), h5.Na = v5.Na = (0 < S3) + 0, 1 < S3) an(w4, 0, l5, m5);
                  else {
                    var _3 = w4[0] + 3 >> 3;
                    for (w4 = 0; 256 > w4; w4 += 16) l5[m5 + w4] = _3;
                  }
                  A4 = 1, x3 = d5[0];
                }
                var P3 = 15 & h5.la, I3 = 15 & v5.la;
                for (w4 = 0; 4 > w4; ++w4) {
                  var F3 = 1 & I3;
                  for (_3 = L4 = 0; 4 > _3; ++_3) P3 = P3 >> 1 | (F3 = (S3 = ni(f5, x3, S3 = F3 + (1 & P3), g5.Sc, A4, l5, m5)) > A4) << 7, L4 = L4 << 2 | (3 < S3 ? 3 : 1 < S3 ? 2 : 0 != l5[m5 + 0]), m5 += 16;
                  P3 >>= 4, I3 = I3 >> 1 | F3 << 7, b4 = (b4 << 8 | L4) >>> 0;
                }
                for (x3 = P3, A4 = I3 >> 4, N4 = 0; 4 > N4; N4 += 2) {
                  for (L4 = 0, P3 = h5.la >> 4 + N4, I3 = v5.la >> 4 + N4, w4 = 0; 2 > w4; ++w4) {
                    for (F3 = 1 & I3, _3 = 0; 2 > _3; ++_3) S3 = F3 + (1 & P3), P3 = P3 >> 1 | (F3 = 0 < (S3 = ni(f5, d5[2], S3, g5.Qc, 0, l5, m5))) << 3, L4 = L4 << 2 | (3 < S3 ? 3 : 1 < S3 ? 2 : 0 != l5[m5 + 0]), m5 += 16;
                    P3 >>= 2, I3 = I3 >> 1 | F3 << 5;
                  }
                  y4 |= L4 << 4 * N4, x3 |= P3 << 4 << N4, A4 |= (240 & I3) << N4;
                }
                h5.la = x3, v5.la = A4, p5.Hc = b4, p5.Gc = y4, p5.ia = 43690 & y4 ? 0 : g5.ia, d5 = !(b4 | y4);
              }
              if (0 < c5.L && (c5.wa[c5.Y + c5.ja] = c5.gd[o3.$b][o3.Za], c5.wa[c5.Y + c5.ja].La |= !d5), u5.Ka) return Jt2(t5, 7, "Premature end-of-file encountered.");
            }
            if ($t2(t5), c5 = r3, u5 = 1, o3 = (s4 = t5).D, h5 = 0 < s4.L && s4.M >= s4.zb && s4.M <= s4.Va, 0 == s4.Aa) t: {
              if (o3.M = s4.M, o3.uc = h5, Or(s4, o3), u5 = 1, o3 = (L4 = s4.D).Nb, h5 = (y4 = Ri[s4.L]) * s4.R, f5 = y4 / 2 * s4.B, w4 = 16 * o3 * s4.R, _3 = 8 * o3 * s4.B, d5 = s4.sa, p5 = s4.ta - h5 + w4, g5 = s4.qa, l5 = s4.ra - f5 + _3, m5 = s4.Ha, v5 = s4.Ia - f5 + _3, I3 = 0 == (P3 = L4.M), b4 = P3 >= s4.Va - 1, 2 == s4.Aa && Or(s4, L4), L4.uc) for (F3 = (S3 = s4).D.M, e(S3.D.uc), L4 = S3.yb; L4 < S3.Hb; ++L4) {
                A4 = L4, x3 = F3;
                var C3 = (j3 = (U3 = S3).D).Nb;
                N4 = U3.R;
                var j3 = j3.wa[j3.Y + A4], O3 = U3.sa, B3 = U3.ta + 16 * C3 * N4 + 16 * A4, M3 = j3.dd, E3 = j3.tc;
                if (0 != E3) if (e(3 <= E3), 1 == U3.L) 0 < A4 && wn(O3, B3, N4, E3 + 4), j3.La && Ln(O3, B3, N4, E3), 0 < x3 && yn(O3, B3, N4, E3 + 4), j3.La && Nn(O3, B3, N4, E3);
                else {
                  var q3 = U3.B, D3 = U3.qa, R3 = U3.ra + 8 * C3 * q3 + 8 * A4, T3 = U3.Ha, U3 = U3.Ia + 8 * C3 * q3 + 8 * A4;
                  C3 = j3.ld;
                  0 < A4 && (fn(O3, B3, N4, E3 + 4, M3, C3), pn(D3, R3, T3, U3, q3, E3 + 4, M3, C3)), j3.La && (mn(O3, B3, N4, E3, M3, C3), bn(D3, R3, T3, U3, q3, E3, M3, C3)), 0 < x3 && (ln2(O3, B3, N4, E3 + 4, M3, C3), dn(D3, R3, T3, U3, q3, E3 + 4, M3, C3)), j3.La && (gn(O3, B3, N4, E3, M3, C3), vn(D3, R3, T3, U3, q3, E3, M3, C3));
                }
              }
              if (s4.ia && alert("todo:DitherRow"), null != c5.put) {
                if (L4 = 16 * P3, P3 = 16 * (P3 + 1), I3 ? (c5.y = s4.sa, c5.O = s4.ta + w4, c5.f = s4.qa, c5.N = s4.ra + _3, c5.ea = s4.Ha, c5.W = s4.Ia + _3) : (L4 -= y4, c5.y = d5, c5.O = p5, c5.f = g5, c5.N = l5, c5.ea = m5, c5.W = v5), b4 || (P3 -= y4), P3 > c5.o && (P3 = c5.o), c5.F = null, c5.J = null, null != s4.Fa && 0 < s4.Fa.length && L4 < P3 && (c5.J = lr(s4, c5, L4, P3 - L4), c5.F = s4.mb, null == c5.F && 0 == c5.F.length)) {
                  u5 = Jt2(s4, 3, "Could not decode alpha data.");
                  break t;
                }
                L4 < c5.j && (y4 = c5.j - L4, L4 = c5.j, e(!(1 & y4)), c5.O += s4.R * y4, c5.N += s4.B * (y4 >> 1), c5.W += s4.B * (y4 >> 1), null != c5.F && (c5.J += c5.width * y4)), L4 < P3 && (c5.O += c5.v, c5.N += c5.v >> 1, c5.W += c5.v >> 1, null != c5.F && (c5.J += c5.v), c5.ka = L4 - c5.j, c5.U = c5.va - c5.v, c5.T = P3 - L4, u5 = c5.put(c5));
              }
              o3 + 1 != s4.Ic || b4 || (n2(s4.sa, s4.ta - h5, d5, p5 + 16 * s4.R, h5), n2(s4.qa, s4.ra - f5, g5, l5 + 8 * s4.B, f5), n2(s4.Ha, s4.Ia - f5, m5, v5 + 8 * s4.B, f5));
            }
            if (!u5) return Jt2(t5, 6, "Output aborted.");
          }
          return 1;
        }(t4, r2)), null != r2.bc && r2.bc(r2), s3 &= 1;
      }
      return s3 ? (t4.cb = 0, s3) : 0;
    }
    function te2(t4, e2, r2, n3, i3) {
      i3 = t4[e2 + r2 + 32 * n3] + (i3 >> 3), t4[e2 + r2 + 32 * n3] = -256 & i3 ? 0 > i3 ? 0 : 255 : i3;
    }
    function ee2(t4, e2, r2, n3, i3, a3) {
      te2(t4, e2, 0, r2, n3 + i3), te2(t4, e2, 1, r2, n3 + a3), te2(t4, e2, 2, r2, n3 - a3), te2(t4, e2, 3, r2, n3 - i3);
    }
    function re2(t4) {
      return (20091 * t4 >> 16) + t4;
    }
    function ne2(t4, e2, r2, n3) {
      var i3, o3 = 0, s3 = a2(16);
      for (i3 = 0; 4 > i3; ++i3) {
        var c4 = t4[e2 + 0] + t4[e2 + 8], u4 = t4[e2 + 0] - t4[e2 + 8], h4 = (35468 * t4[e2 + 4] >> 16) - re2(t4[e2 + 12]), l4 = re2(t4[e2 + 4]) + (35468 * t4[e2 + 12] >> 16);
        s3[o3 + 0] = c4 + l4, s3[o3 + 1] = u4 + h4, s3[o3 + 2] = u4 - h4, s3[o3 + 3] = c4 - l4, o3 += 4, e2++;
      }
      for (i3 = o3 = 0; 4 > i3; ++i3) c4 = (t4 = s3[o3 + 0] + 4) + s3[o3 + 8], u4 = t4 - s3[o3 + 8], h4 = (35468 * s3[o3 + 4] >> 16) - re2(s3[o3 + 12]), te2(r2, n3, 0, 0, c4 + (l4 = re2(s3[o3 + 4]) + (35468 * s3[o3 + 12] >> 16))), te2(r2, n3, 1, 0, u4 + h4), te2(r2, n3, 2, 0, u4 - h4), te2(r2, n3, 3, 0, c4 - l4), o3++, n3 += 32;
    }
    function ie2(t4, e2, r2, n3) {
      var i3 = t4[e2 + 0] + 4, a3 = 35468 * t4[e2 + 4] >> 16, o3 = re2(t4[e2 + 4]), s3 = 35468 * t4[e2 + 1] >> 16;
      ee2(r2, n3, 0, i3 + o3, t4 = re2(t4[e2 + 1]), s3), ee2(r2, n3, 1, i3 + a3, t4, s3), ee2(r2, n3, 2, i3 - a3, t4, s3), ee2(r2, n3, 3, i3 - o3, t4, s3);
    }
    function ae2(t4, e2, r2, n3, i3) {
      ne2(t4, e2, r2, n3), i3 && ne2(t4, e2 + 16, r2, n3 + 4);
    }
    function oe2(t4, e2, r2, n3) {
      on(t4, e2 + 0, r2, n3, 1), on(t4, e2 + 32, r2, n3 + 128, 1);
    }
    function se2(t4, e2, r2, n3) {
      var i3;
      for (t4 = t4[e2 + 0] + 4, i3 = 0; 4 > i3; ++i3) for (e2 = 0; 4 > e2; ++e2) te2(r2, n3, e2, i3, t4);
    }
    function ce2(t4, e2, r2, n3) {
      t4[e2 + 0] && un(t4, e2 + 0, r2, n3), t4[e2 + 16] && un(t4, e2 + 16, r2, n3 + 4), t4[e2 + 32] && un(t4, e2 + 32, r2, n3 + 128), t4[e2 + 48] && un(t4, e2 + 48, r2, n3 + 128 + 4);
    }
    function ue2(t4, e2, r2, n3) {
      var i3, o3 = a2(16);
      for (i3 = 0; 4 > i3; ++i3) {
        var s3 = t4[e2 + 0 + i3] + t4[e2 + 12 + i3], c4 = t4[e2 + 4 + i3] + t4[e2 + 8 + i3], u4 = t4[e2 + 4 + i3] - t4[e2 + 8 + i3], h4 = t4[e2 + 0 + i3] - t4[e2 + 12 + i3];
        o3[0 + i3] = s3 + c4, o3[8 + i3] = s3 - c4, o3[4 + i3] = h4 + u4, o3[12 + i3] = h4 - u4;
      }
      for (i3 = 0; 4 > i3; ++i3) s3 = (t4 = o3[0 + 4 * i3] + 3) + o3[3 + 4 * i3], c4 = o3[1 + 4 * i3] + o3[2 + 4 * i3], u4 = o3[1 + 4 * i3] - o3[2 + 4 * i3], h4 = t4 - o3[3 + 4 * i3], r2[n3 + 0] = s3 + c4 >> 3, r2[n3 + 16] = h4 + u4 >> 3, r2[n3 + 32] = s3 - c4 >> 3, r2[n3 + 48] = h4 - u4 >> 3, n3 += 64;
    }
    function he2(t4, e2, r2) {
      var n3, i3 = e2 - 32, a3 = Bn, o3 = 255 - t4[i3 - 1];
      for (n3 = 0; n3 < r2; ++n3) {
        var s3, c4 = a3, u4 = o3 + t4[e2 - 1];
        for (s3 = 0; s3 < r2; ++s3) t4[e2 + s3] = c4[u4 + t4[i3 + s3]];
        e2 += 32;
      }
    }
    function le2(t4, e2) {
      he2(t4, e2, 4);
    }
    function fe2(t4, e2) {
      he2(t4, e2, 8);
    }
    function de2(t4, e2) {
      he2(t4, e2, 16);
    }
    function pe2(t4, e2) {
      var r2;
      for (r2 = 0; 16 > r2; ++r2) n2(t4, e2 + 32 * r2, t4, e2 - 32, 16);
    }
    function ge2(t4, e2) {
      var r2;
      for (r2 = 16; 0 < r2; --r2) i2(t4, e2, t4[e2 - 1], 16), e2 += 32;
    }
    function me2(t4, e2, r2) {
      var n3;
      for (n3 = 0; 16 > n3; ++n3) i2(e2, r2 + 32 * n3, t4, 16);
    }
    function ve2(t4, e2) {
      var r2, n3 = 16;
      for (r2 = 0; 16 > r2; ++r2) n3 += t4[e2 - 1 + 32 * r2] + t4[e2 + r2 - 32];
      me2(n3 >> 5, t4, e2);
    }
    function be2(t4, e2) {
      var r2, n3 = 8;
      for (r2 = 0; 16 > r2; ++r2) n3 += t4[e2 - 1 + 32 * r2];
      me2(n3 >> 4, t4, e2);
    }
    function ye2(t4, e2) {
      var r2, n3 = 8;
      for (r2 = 0; 16 > r2; ++r2) n3 += t4[e2 + r2 - 32];
      me2(n3 >> 4, t4, e2);
    }
    function we2(t4, e2) {
      me2(128, t4, e2);
    }
    function Ne2(t4, e2, r2) {
      return t4 + 2 * e2 + r2 + 2 >> 2;
    }
    function Le2(t4, e2) {
      var r2, i3 = e2 - 32;
      i3 = new Uint8Array([Ne2(t4[i3 - 1], t4[i3 + 0], t4[i3 + 1]), Ne2(t4[i3 + 0], t4[i3 + 1], t4[i3 + 2]), Ne2(t4[i3 + 1], t4[i3 + 2], t4[i3 + 3]), Ne2(t4[i3 + 2], t4[i3 + 3], t4[i3 + 4])]);
      for (r2 = 0; 4 > r2; ++r2) n2(t4, e2 + 32 * r2, i3, 0, i3.length);
    }
    function Ae(t4, e2) {
      var r2 = t4[e2 - 1], n3 = t4[e2 - 1 + 32], i3 = t4[e2 - 1 + 64], a3 = t4[e2 - 1 + 96];
      I2(t4, e2 + 0, 16843009 * Ne2(t4[e2 - 1 - 32], r2, n3)), I2(t4, e2 + 32, 16843009 * Ne2(r2, n3, i3)), I2(t4, e2 + 64, 16843009 * Ne2(n3, i3, a3)), I2(t4, e2 + 96, 16843009 * Ne2(i3, a3, a3));
    }
    function xe(t4, e2) {
      var r2, n3 = 4;
      for (r2 = 0; 4 > r2; ++r2) n3 += t4[e2 + r2 - 32] + t4[e2 - 1 + 32 * r2];
      for (n3 >>= 3, r2 = 0; 4 > r2; ++r2) i2(t4, e2 + 32 * r2, n3, 4);
    }
    function Se(t4, e2) {
      var r2 = t4[e2 - 1 + 0], n3 = t4[e2 - 1 + 32], i3 = t4[e2 - 1 + 64], a3 = t4[e2 - 1 - 32], o3 = t4[e2 + 0 - 32], s3 = t4[e2 + 1 - 32], c4 = t4[e2 + 2 - 32], u4 = t4[e2 + 3 - 32];
      t4[e2 + 0 + 96] = Ne2(n3, i3, t4[e2 - 1 + 96]), t4[e2 + 1 + 96] = t4[e2 + 0 + 64] = Ne2(r2, n3, i3), t4[e2 + 2 + 96] = t4[e2 + 1 + 64] = t4[e2 + 0 + 32] = Ne2(a3, r2, n3), t4[e2 + 3 + 96] = t4[e2 + 2 + 64] = t4[e2 + 1 + 32] = t4[e2 + 0 + 0] = Ne2(o3, a3, r2), t4[e2 + 3 + 64] = t4[e2 + 2 + 32] = t4[e2 + 1 + 0] = Ne2(s3, o3, a3), t4[e2 + 3 + 32] = t4[e2 + 2 + 0] = Ne2(c4, s3, o3), t4[e2 + 3 + 0] = Ne2(u4, c4, s3);
    }
    function _e(t4, e2) {
      var r2 = t4[e2 + 1 - 32], n3 = t4[e2 + 2 - 32], i3 = t4[e2 + 3 - 32], a3 = t4[e2 + 4 - 32], o3 = t4[e2 + 5 - 32], s3 = t4[e2 + 6 - 32], c4 = t4[e2 + 7 - 32];
      t4[e2 + 0 + 0] = Ne2(t4[e2 + 0 - 32], r2, n3), t4[e2 + 1 + 0] = t4[e2 + 0 + 32] = Ne2(r2, n3, i3), t4[e2 + 2 + 0] = t4[e2 + 1 + 32] = t4[e2 + 0 + 64] = Ne2(n3, i3, a3), t4[e2 + 3 + 0] = t4[e2 + 2 + 32] = t4[e2 + 1 + 64] = t4[e2 + 0 + 96] = Ne2(i3, a3, o3), t4[e2 + 3 + 32] = t4[e2 + 2 + 64] = t4[e2 + 1 + 96] = Ne2(a3, o3, s3), t4[e2 + 3 + 64] = t4[e2 + 2 + 96] = Ne2(o3, s3, c4), t4[e2 + 3 + 96] = Ne2(s3, c4, c4);
    }
    function Pe(t4, e2) {
      var r2 = t4[e2 - 1 + 0], n3 = t4[e2 - 1 + 32], i3 = t4[e2 - 1 + 64], a3 = t4[e2 - 1 - 32], o3 = t4[e2 + 0 - 32], s3 = t4[e2 + 1 - 32], c4 = t4[e2 + 2 - 32], u4 = t4[e2 + 3 - 32];
      t4[e2 + 0 + 0] = t4[e2 + 1 + 64] = a3 + o3 + 1 >> 1, t4[e2 + 1 + 0] = t4[e2 + 2 + 64] = o3 + s3 + 1 >> 1, t4[e2 + 2 + 0] = t4[e2 + 3 + 64] = s3 + c4 + 1 >> 1, t4[e2 + 3 + 0] = c4 + u4 + 1 >> 1, t4[e2 + 0 + 96] = Ne2(i3, n3, r2), t4[e2 + 0 + 64] = Ne2(n3, r2, a3), t4[e2 + 0 + 32] = t4[e2 + 1 + 96] = Ne2(r2, a3, o3), t4[e2 + 1 + 32] = t4[e2 + 2 + 96] = Ne2(a3, o3, s3), t4[e2 + 2 + 32] = t4[e2 + 3 + 96] = Ne2(o3, s3, c4), t4[e2 + 3 + 32] = Ne2(s3, c4, u4);
    }
    function ke(t4, e2) {
      var r2 = t4[e2 + 0 - 32], n3 = t4[e2 + 1 - 32], i3 = t4[e2 + 2 - 32], a3 = t4[e2 + 3 - 32], o3 = t4[e2 + 4 - 32], s3 = t4[e2 + 5 - 32], c4 = t4[e2 + 6 - 32], u4 = t4[e2 + 7 - 32];
      t4[e2 + 0 + 0] = r2 + n3 + 1 >> 1, t4[e2 + 1 + 0] = t4[e2 + 0 + 64] = n3 + i3 + 1 >> 1, t4[e2 + 2 + 0] = t4[e2 + 1 + 64] = i3 + a3 + 1 >> 1, t4[e2 + 3 + 0] = t4[e2 + 2 + 64] = a3 + o3 + 1 >> 1, t4[e2 + 0 + 32] = Ne2(r2, n3, i3), t4[e2 + 1 + 32] = t4[e2 + 0 + 96] = Ne2(n3, i3, a3), t4[e2 + 2 + 32] = t4[e2 + 1 + 96] = Ne2(i3, a3, o3), t4[e2 + 3 + 32] = t4[e2 + 2 + 96] = Ne2(a3, o3, s3), t4[e2 + 3 + 64] = Ne2(o3, s3, c4), t4[e2 + 3 + 96] = Ne2(s3, c4, u4);
    }
    function Ie(t4, e2) {
      var r2 = t4[e2 - 1 + 0], n3 = t4[e2 - 1 + 32], i3 = t4[e2 - 1 + 64], a3 = t4[e2 - 1 + 96];
      t4[e2 + 0 + 0] = r2 + n3 + 1 >> 1, t4[e2 + 2 + 0] = t4[e2 + 0 + 32] = n3 + i3 + 1 >> 1, t4[e2 + 2 + 32] = t4[e2 + 0 + 64] = i3 + a3 + 1 >> 1, t4[e2 + 1 + 0] = Ne2(r2, n3, i3), t4[e2 + 3 + 0] = t4[e2 + 1 + 32] = Ne2(n3, i3, a3), t4[e2 + 3 + 32] = t4[e2 + 1 + 64] = Ne2(i3, a3, a3), t4[e2 + 3 + 64] = t4[e2 + 2 + 64] = t4[e2 + 0 + 96] = t4[e2 + 1 + 96] = t4[e2 + 2 + 96] = t4[e2 + 3 + 96] = a3;
    }
    function Fe(t4, e2) {
      var r2 = t4[e2 - 1 + 0], n3 = t4[e2 - 1 + 32], i3 = t4[e2 - 1 + 64], a3 = t4[e2 - 1 + 96], o3 = t4[e2 - 1 - 32], s3 = t4[e2 + 0 - 32], c4 = t4[e2 + 1 - 32], u4 = t4[e2 + 2 - 32];
      t4[e2 + 0 + 0] = t4[e2 + 2 + 32] = r2 + o3 + 1 >> 1, t4[e2 + 0 + 32] = t4[e2 + 2 + 64] = n3 + r2 + 1 >> 1, t4[e2 + 0 + 64] = t4[e2 + 2 + 96] = i3 + n3 + 1 >> 1, t4[e2 + 0 + 96] = a3 + i3 + 1 >> 1, t4[e2 + 3 + 0] = Ne2(s3, c4, u4), t4[e2 + 2 + 0] = Ne2(o3, s3, c4), t4[e2 + 1 + 0] = t4[e2 + 3 + 32] = Ne2(r2, o3, s3), t4[e2 + 1 + 32] = t4[e2 + 3 + 64] = Ne2(n3, r2, o3), t4[e2 + 1 + 64] = t4[e2 + 3 + 96] = Ne2(i3, n3, r2), t4[e2 + 1 + 96] = Ne2(a3, i3, n3);
    }
    function Ce(t4, e2) {
      var r2;
      for (r2 = 0; 8 > r2; ++r2) n2(t4, e2 + 32 * r2, t4, e2 - 32, 8);
    }
    function je(t4, e2) {
      var r2;
      for (r2 = 0; 8 > r2; ++r2) i2(t4, e2, t4[e2 - 1], 8), e2 += 32;
    }
    function Oe(t4, e2, r2) {
      var n3;
      for (n3 = 0; 8 > n3; ++n3) i2(e2, r2 + 32 * n3, t4, 8);
    }
    function Be(t4, e2) {
      var r2, n3 = 8;
      for (r2 = 0; 8 > r2; ++r2) n3 += t4[e2 + r2 - 32] + t4[e2 - 1 + 32 * r2];
      Oe(n3 >> 4, t4, e2);
    }
    function Me(t4, e2) {
      var r2, n3 = 4;
      for (r2 = 0; 8 > r2; ++r2) n3 += t4[e2 + r2 - 32];
      Oe(n3 >> 3, t4, e2);
    }
    function Ee(t4, e2) {
      var r2, n3 = 4;
      for (r2 = 0; 8 > r2; ++r2) n3 += t4[e2 - 1 + 32 * r2];
      Oe(n3 >> 3, t4, e2);
    }
    function qe(t4, e2) {
      Oe(128, t4, e2);
    }
    function De(t4, e2, r2) {
      var n3 = t4[e2 - r2], i3 = t4[e2 + 0], a3 = 3 * (i3 - n3) + jn[1020 + t4[e2 - 2 * r2] - t4[e2 + r2]], o3 = On[112 + (a3 + 4 >> 3)];
      t4[e2 - r2] = Bn[255 + n3 + On[112 + (a3 + 3 >> 3)]], t4[e2 + 0] = Bn[255 + i3 - o3];
    }
    function Re(t4, e2, r2, n3) {
      var i3 = t4[e2 + 0], a3 = t4[e2 + r2];
      return Mn[255 + t4[e2 - 2 * r2] - t4[e2 - r2]] > n3 || Mn[255 + a3 - i3] > n3;
    }
    function Te(t4, e2, r2, n3) {
      return 4 * Mn[255 + t4[e2 - r2] - t4[e2 + 0]] + Mn[255 + t4[e2 - 2 * r2] - t4[e2 + r2]] <= n3;
    }
    function Ue(t4, e2, r2, n3, i3) {
      var a3 = t4[e2 - 3 * r2], o3 = t4[e2 - 2 * r2], s3 = t4[e2 - r2], c4 = t4[e2 + 0], u4 = t4[e2 + r2], h4 = t4[e2 + 2 * r2], l4 = t4[e2 + 3 * r2];
      return 4 * Mn[255 + s3 - c4] + Mn[255 + o3 - u4] > n3 ? 0 : Mn[255 + t4[e2 - 4 * r2] - a3] <= i3 && Mn[255 + a3 - o3] <= i3 && Mn[255 + o3 - s3] <= i3 && Mn[255 + l4 - h4] <= i3 && Mn[255 + h4 - u4] <= i3 && Mn[255 + u4 - c4] <= i3;
    }
    function ze(t4, e2, r2, n3) {
      var i3 = 2 * n3 + 1;
      for (n3 = 0; 16 > n3; ++n3) Te(t4, e2 + n3, r2, i3) && De(t4, e2 + n3, r2);
    }
    function He(t4, e2, r2, n3) {
      var i3 = 2 * n3 + 1;
      for (n3 = 0; 16 > n3; ++n3) Te(t4, e2 + n3 * r2, 1, i3) && De(t4, e2 + n3 * r2, 1);
    }
    function We(t4, e2, r2, n3) {
      var i3;
      for (i3 = 3; 0 < i3; --i3) ze(t4, e2 += 4 * r2, r2, n3);
    }
    function Ve(t4, e2, r2, n3) {
      var i3;
      for (i3 = 3; 0 < i3; --i3) He(t4, e2 += 4, r2, n3);
    }
    function Ge(t4, e2, r2, n3, i3, a3, o3, s3) {
      for (a3 = 2 * a3 + 1; 0 < i3--; ) {
        if (Ue(t4, e2, r2, a3, o3)) if (Re(t4, e2, r2, s3)) De(t4, e2, r2);
        else {
          var c4 = t4, u4 = e2, h4 = r2, l4 = c4[u4 - 2 * h4], f4 = c4[u4 - h4], d4 = c4[u4 + 0], p4 = c4[u4 + h4], g4 = c4[u4 + 2 * h4], m4 = 27 * (b4 = jn[1020 + 3 * (d4 - f4) + jn[1020 + l4 - p4]]) + 63 >> 7, v4 = 18 * b4 + 63 >> 7, b4 = 9 * b4 + 63 >> 7;
          c4[u4 - 3 * h4] = Bn[255 + c4[u4 - 3 * h4] + b4], c4[u4 - 2 * h4] = Bn[255 + l4 + v4], c4[u4 - h4] = Bn[255 + f4 + m4], c4[u4 + 0] = Bn[255 + d4 - m4], c4[u4 + h4] = Bn[255 + p4 - v4], c4[u4 + 2 * h4] = Bn[255 + g4 - b4];
        }
        e2 += n3;
      }
    }
    function Ye(t4, e2, r2, n3, i3, a3, o3, s3) {
      for (a3 = 2 * a3 + 1; 0 < i3--; ) {
        if (Ue(t4, e2, r2, a3, o3)) if (Re(t4, e2, r2, s3)) De(t4, e2, r2);
        else {
          var c4 = t4, u4 = e2, h4 = r2, l4 = c4[u4 - h4], f4 = c4[u4 + 0], d4 = c4[u4 + h4], p4 = On[112 + ((g4 = 3 * (f4 - l4)) + 4 >> 3)], g4 = On[112 + (g4 + 3 >> 3)], m4 = p4 + 1 >> 1;
          c4[u4 - 2 * h4] = Bn[255 + c4[u4 - 2 * h4] + m4], c4[u4 - h4] = Bn[255 + l4 + g4], c4[u4 + 0] = Bn[255 + f4 - p4], c4[u4 + h4] = Bn[255 + d4 - m4];
        }
        e2 += n3;
      }
    }
    function Je(t4, e2, r2, n3, i3, a3) {
      Ge(t4, e2, r2, 1, 16, n3, i3, a3);
    }
    function Xe(t4, e2, r2, n3, i3, a3) {
      Ge(t4, e2, 1, r2, 16, n3, i3, a3);
    }
    function Ke(t4, e2, r2, n3, i3, a3) {
      var o3;
      for (o3 = 3; 0 < o3; --o3) Ye(t4, e2 += 4 * r2, r2, 1, 16, n3, i3, a3);
    }
    function Ze(t4, e2, r2, n3, i3, a3) {
      var o3;
      for (o3 = 3; 0 < o3; --o3) Ye(t4, e2 += 4, 1, r2, 16, n3, i3, a3);
    }
    function $e(t4, e2, r2, n3, i3, a3, o3, s3) {
      Ge(t4, e2, i3, 1, 8, a3, o3, s3), Ge(r2, n3, i3, 1, 8, a3, o3, s3);
    }
    function Qe(t4, e2, r2, n3, i3, a3, o3, s3) {
      Ge(t4, e2, 1, i3, 8, a3, o3, s3), Ge(r2, n3, 1, i3, 8, a3, o3, s3);
    }
    function tr(t4, e2, r2, n3, i3, a3, o3, s3) {
      Ye(t4, e2 + 4 * i3, i3, 1, 8, a3, o3, s3), Ye(r2, n3 + 4 * i3, i3, 1, 8, a3, o3, s3);
    }
    function er(t4, e2, r2, n3, i3, a3, o3, s3) {
      Ye(t4, e2 + 4, 1, i3, 8, a3, o3, s3), Ye(r2, n3 + 4, 1, i3, 8, a3, o3, s3);
    }
    function rr() {
      this.ba = new ot2(), this.ec = [], this.cc = [], this.Mc = [], this.Dc = this.Nc = this.dc = this.fc = 0, this.Oa = new ct2(), this.memory = 0, this.Ib = "OutputFunc", this.Jb = "OutputAlphaFunc", this.Nd = "OutputRowFunc";
    }
    function nr() {
      this.data = [], this.offset = this.kd = this.ha = this.w = 0, this.na = [], this.xa = this.gb = this.Ja = this.Sa = this.P = 0;
    }
    function ir() {
      this.nc = this.Ea = this.b = this.hc = 0, this.K = [], this.w = 0;
    }
    function ar() {
      this.ua = 0, this.Wa = new M2(), this.vb = new M2(), this.md = this.xc = this.wc = 0, this.vc = [], this.Wb = 0, this.Ya = new d3(), this.yc = new l3();
    }
    function or() {
      this.xb = this.a = 0, this.l = new Gt2(), this.ca = new ot2(), this.V = [], this.Ba = 0, this.Ta = [], this.Ua = 0, this.m = new N3(), this.Pb = 0, this.wd = new N3(), this.Ma = this.$ = this.C = this.i = this.c = this.xd = 0, this.s = new ar(), this.ab = 0, this.gc = o2(4, ir), this.Oc = 0;
    }
    function sr() {
      this.Lc = this.Z = this.$a = this.i = this.c = 0, this.l = new Gt2(), this.ic = 0, this.ca = [], this.tb = 0, this.qd = null, this.rd = 0;
    }
    function cr(t4, e2, r2, n3, i3, a3, o3) {
      for (t4 = null == t4 ? 0 : t4[e2 + 0], e2 = 0; e2 < o3; ++e2) i3[a3 + e2] = t4 + r2[n3 + e2] & 255, t4 = i3[a3 + e2];
    }
    function ur(t4, e2, r2, n3, i3, a3, o3) {
      var s3;
      if (null == t4) cr(null, null, r2, n3, i3, a3, o3);
      else for (s3 = 0; s3 < o3; ++s3) i3[a3 + s3] = t4[e2 + s3] + r2[n3 + s3] & 255;
    }
    function hr(t4, e2, r2, n3, i3, a3, o3) {
      if (null == t4) cr(null, null, r2, n3, i3, a3, o3);
      else {
        var s3, c4 = t4[e2 + 0], u4 = c4, h4 = c4;
        for (s3 = 0; s3 < o3; ++s3) u4 = h4 + (c4 = t4[e2 + s3]) - u4, h4 = r2[n3 + s3] + (-256 & u4 ? 0 > u4 ? 0 : 255 : u4) & 255, u4 = c4, i3[a3 + s3] = h4;
      }
    }
    function lr(t4, r2, i3, o3) {
      var s3 = r2.width, c4 = r2.o;
      if (e(null != t4 && null != r2), 0 > i3 || 0 >= o3 || i3 + o3 > c4) return null;
      if (!t4.Cc) {
        if (null == t4.ga) {
          var u4;
          if (t4.ga = new sr(), (u4 = null == t4.ga) || (u4 = r2.width * r2.o, e(0 == t4.Gb.length), t4.Gb = a2(u4), t4.Uc = 0, null == t4.Gb ? u4 = 0 : (t4.mb = t4.Gb, t4.nb = t4.Uc, t4.rc = null, u4 = 1), u4 = !u4), !u4) {
            u4 = t4.ga;
            var h4 = t4.Fa, l4 = t4.P, f4 = t4.qc, d4 = t4.mb, p4 = t4.nb, g4 = l4 + 1, m4 = f4 - 1, b4 = u4.l;
            if (e(null != h4 && null != d4 && null != r2), mi[0] = null, mi[1] = cr, mi[2] = ur, mi[3] = hr, u4.ca = d4, u4.tb = p4, u4.c = r2.width, u4.i = r2.height, e(0 < u4.c && 0 < u4.i), 1 >= f4) r2 = 0;
            else if (u4.$a = h4[l4 + 0] >> 0 & 3, u4.Z = h4[l4 + 0] >> 2 & 3, u4.Lc = h4[l4 + 0] >> 4 & 3, l4 = h4[l4 + 0] >> 6 & 3, 0 > u4.$a || 1 < u4.$a || 4 <= u4.Z || 1 < u4.Lc || l4) r2 = 0;
            else if (b4.put = dt2, b4.ac = ft2, b4.bc = pt2, b4.ma = u4, b4.width = r2.width, b4.height = r2.height, b4.Da = r2.Da, b4.v = r2.v, b4.va = r2.va, b4.j = r2.j, b4.o = r2.o, u4.$a) t: {
              e(1 == u4.$a), r2 = kt2();
              e: for (; ; ) {
                if (null == r2) {
                  r2 = 0;
                  break t;
                }
                if (e(null != u4), u4.mc = r2, r2.c = u4.c, r2.i = u4.i, r2.l = u4.l, r2.l.ma = u4, r2.l.width = u4.c, r2.l.height = u4.i, r2.a = 0, v3(r2.m, h4, g4, m4), !It2(u4.c, u4.i, 1, r2, null)) break e;
                if (1 == r2.ab && 3 == r2.gc[0].hc && At2(r2.s) ? (u4.ic = 1, h4 = r2.c * r2.i, r2.Ta = null, r2.Ua = 0, r2.V = a2(h4), r2.Ba = 0, null == r2.V ? (r2.a = 1, r2 = 0) : r2 = 1) : (u4.ic = 0, r2 = Ft2(r2, u4.c)), !r2) break e;
                r2 = 1;
                break t;
              }
              u4.mc = null, r2 = 0;
            }
            else r2 = m4 >= u4.c * u4.i;
            u4 = !r2;
          }
          if (u4) return null;
          1 != t4.ga.Lc ? t4.Ga = 0 : o3 = c4 - i3;
        }
        e(null != t4.ga), e(i3 + o3 <= c4);
        t: {
          if (r2 = (h4 = t4.ga).c, c4 = h4.l.o, 0 == h4.$a) {
            if (g4 = t4.rc, m4 = t4.Vc, b4 = t4.Fa, l4 = t4.P + 1 + i3 * r2, f4 = t4.mb, d4 = t4.nb + i3 * r2, e(l4 <= t4.P + t4.qc), 0 != h4.Z) for (e(null != mi[h4.Z]), u4 = 0; u4 < o3; ++u4) mi[h4.Z](g4, m4, b4, l4, f4, d4, r2), g4 = f4, m4 = d4, d4 += r2, l4 += r2;
            else for (u4 = 0; u4 < o3; ++u4) n2(f4, d4, b4, l4, r2), g4 = f4, m4 = d4, d4 += r2, l4 += r2;
            t4.rc = g4, t4.Vc = m4;
          } else {
            if (e(null != h4.mc), r2 = i3 + o3, e(null != (u4 = h4.mc)), e(r2 <= u4.i), u4.C >= r2) r2 = 1;
            else if (h4.ic || mr(), h4.ic) {
              h4 = u4.V, g4 = u4.Ba, m4 = u4.c;
              var y4 = u4.i, w4 = (b4 = 1, l4 = u4.$ / m4, f4 = u4.$ % m4, d4 = u4.m, p4 = u4.s, u4.$), N4 = m4 * y4, L4 = m4 * r2, x3 = p4.wc, _3 = w4 < L4 ? wt2(p4, f4, l4) : null;
              e(w4 <= N4), e(r2 <= y4), e(At2(p4));
              e: for (; ; ) {
                for (; !d4.h && w4 < L4; ) {
                  if (f4 & x3 || (_3 = wt2(p4, f4, l4)), e(null != _3), S2(d4), 256 > (y4 = bt2(_3.G[0], _3.H[0], d4))) h4[g4 + w4] = y4, ++w4, ++f4 >= m4 && (f4 = 0, ++l4 <= r2 && !(l4 % 16) && St(u4, l4));
                  else {
                    if (!(280 > y4)) {
                      b4 = 0;
                      break e;
                    }
                    y4 = mt2(y4 - 256, d4);
                    var P3, k3 = bt2(_3.G[4], _3.H[4], d4);
                    if (S2(d4), !(w4 >= (k3 = vt2(m4, k3 = mt2(k3, d4))) && N4 - w4 >= y4)) {
                      b4 = 0;
                      break e;
                    }
                    for (P3 = 0; P3 < y4; ++P3) h4[g4 + w4 + P3] = h4[g4 + w4 + P3 - k3];
                    for (w4 += y4, f4 += y4; f4 >= m4; ) f4 -= m4, ++l4 <= r2 && !(l4 % 16) && St(u4, l4);
                    w4 < L4 && f4 & x3 && (_3 = wt2(p4, f4, l4));
                  }
                  e(d4.h == A3(d4));
                }
                St(u4, l4 > r2 ? r2 : l4);
                break e;
              }
              !b4 || d4.h && w4 < N4 ? (b4 = 0, u4.a = d4.h ? 5 : 3) : u4.$ = w4, r2 = b4;
            } else r2 = _t2(u4, u4.V, u4.Ba, u4.c, u4.i, r2, Ct2);
            if (!r2) {
              o3 = 0;
              break t;
            }
          }
          i3 + o3 >= c4 && (t4.Cc = 1), o3 = 1;
        }
        if (!o3) return null;
        if (t4.Cc && (null != (o3 = t4.ga) && (o3.mc = null), t4.ga = null, 0 < t4.Ga)) return alert("todo:WebPDequantizeLevels"), null;
      }
      return t4.nb + i3 * s3;
    }
    function fr(t4, e2, r2, n3, i3, a3) {
      for (; 0 < i3--; ) {
        var o3, s3 = t4, c4 = e2 + (r2 ? 1 : 0), u4 = t4, h4 = e2 + (r2 ? 0 : 3);
        for (o3 = 0; o3 < n3; ++o3) {
          var l4 = u4[h4 + 4 * o3];
          255 != l4 && (l4 *= 32897, s3[c4 + 4 * o3 + 0] = s3[c4 + 4 * o3 + 0] * l4 >> 23, s3[c4 + 4 * o3 + 1] = s3[c4 + 4 * o3 + 1] * l4 >> 23, s3[c4 + 4 * o3 + 2] = s3[c4 + 4 * o3 + 2] * l4 >> 23);
        }
        e2 += a3;
      }
    }
    function dr(t4, e2, r2, n3, i3) {
      for (; 0 < n3--; ) {
        var a3;
        for (a3 = 0; a3 < r2; ++a3) {
          var o3 = t4[e2 + 2 * a3 + 0], s3 = 15 & (u4 = t4[e2 + 2 * a3 + 1]), c4 = 4369 * s3, u4 = (240 & u4 | u4 >> 4) * c4 >> 16;
          t4[e2 + 2 * a3 + 0] = (240 & o3 | o3 >> 4) * c4 >> 16 & 240 | (15 & o3 | o3 << 4) * c4 >> 16 >> 4 & 15, t4[e2 + 2 * a3 + 1] = 240 & u4 | s3;
        }
        e2 += i3;
      }
    }
    function pr(t4, e2, r2, n3, i3, a3, o3, s3) {
      var c4, u4, h4 = 255;
      for (u4 = 0; u4 < i3; ++u4) {
        for (c4 = 0; c4 < n3; ++c4) {
          var l4 = t4[e2 + c4];
          a3[o3 + 4 * c4] = l4, h4 &= l4;
        }
        e2 += r2, o3 += s3;
      }
      return 255 != h4;
    }
    function gr(t4, e2, r2, n3, i3) {
      var a3;
      for (a3 = 0; a3 < i3; ++a3) r2[n3 + a3] = t4[e2 + a3] >> 8;
    }
    function mr() {
      An = fr, xn = dr, Sn = pr, _n = gr;
    }
    function vr(r2, n3, i3) {
      t3[r2] = function(t4, r3, a3, o3, s3, c4, u4, h4, l4, f4, d4, p4, g4, m4, v4, b4, y4) {
        var w4, N4 = y4 - 1 >> 1, L4 = s3[c4 + 0] | u4[h4 + 0] << 16, A4 = l4[f4 + 0] | d4[p4 + 0] << 16;
        e(null != t4);
        var x3 = 3 * L4 + A4 + 131074 >> 2;
        for (n3(t4[r3 + 0], 255 & x3, x3 >> 16, g4, m4), null != a3 && (x3 = 3 * A4 + L4 + 131074 >> 2, n3(a3[o3 + 0], 255 & x3, x3 >> 16, v4, b4)), w4 = 1; w4 <= N4; ++w4) {
          var S3 = s3[c4 + w4] | u4[h4 + w4] << 16, _3 = l4[f4 + w4] | d4[p4 + w4] << 16, P3 = L4 + S3 + A4 + _3 + 524296, k3 = P3 + 2 * (S3 + A4) >> 3;
          x3 = k3 + L4 >> 1, L4 = (P3 = P3 + 2 * (L4 + _3) >> 3) + S3 >> 1, n3(t4[r3 + 2 * w4 - 1], 255 & x3, x3 >> 16, g4, m4 + (2 * w4 - 1) * i3), n3(t4[r3 + 2 * w4 - 0], 255 & L4, L4 >> 16, g4, m4 + (2 * w4 - 0) * i3), null != a3 && (x3 = P3 + A4 >> 1, L4 = k3 + _3 >> 1, n3(a3[o3 + 2 * w4 - 1], 255 & x3, x3 >> 16, v4, b4 + (2 * w4 - 1) * i3), n3(a3[o3 + 2 * w4 + 0], 255 & L4, L4 >> 16, v4, b4 + (2 * w4 + 0) * i3)), L4 = S3, A4 = _3;
        }
        1 & y4 || (x3 = 3 * L4 + A4 + 131074 >> 2, n3(t4[r3 + y4 - 1], 255 & x3, x3 >> 16, g4, m4 + (y4 - 1) * i3), null != a3 && (x3 = 3 * A4 + L4 + 131074 >> 2, n3(a3[o3 + y4 - 1], 255 & x3, x3 >> 16, v4, b4 + (y4 - 1) * i3)));
      };
    }
    function br() {
      vi[En] = bi, vi[qn] = wi, vi[Dn] = yi, vi[Rn] = Ni, vi[Tn] = Li, vi[Un] = Ai, vi[zn] = xi, vi[Hn] = wi, vi[Wn] = Ni, vi[Vn] = Li, vi[Gn] = Ai;
    }
    function yr(t4) {
      return t4 & ~Fi ? 0 > t4 ? 0 : 255 : t4 >> Ii;
    }
    function wr(t4, e2) {
      return yr((19077 * t4 >> 8) + (26149 * e2 >> 8) - 14234);
    }
    function Nr(t4, e2, r2) {
      return yr((19077 * t4 >> 8) - (6419 * e2 >> 8) - (13320 * r2 >> 8) + 8708);
    }
    function Lr(t4, e2) {
      return yr((19077 * t4 >> 8) + (33050 * e2 >> 8) - 17685);
    }
    function Ar(t4, e2, r2, n3, i3) {
      n3[i3 + 0] = wr(t4, r2), n3[i3 + 1] = Nr(t4, e2, r2), n3[i3 + 2] = Lr(t4, e2);
    }
    function xr(t4, e2, r2, n3, i3) {
      n3[i3 + 0] = Lr(t4, e2), n3[i3 + 1] = Nr(t4, e2, r2), n3[i3 + 2] = wr(t4, r2);
    }
    function Sr(t4, e2, r2, n3, i3) {
      var a3 = Nr(t4, e2, r2);
      e2 = a3 << 3 & 224 | Lr(t4, e2) >> 3, n3[i3 + 0] = 248 & wr(t4, r2) | a3 >> 5, n3[i3 + 1] = e2;
    }
    function _r(t4, e2, r2, n3, i3) {
      var a3 = 240 & Lr(t4, e2) | 15;
      n3[i3 + 0] = 240 & wr(t4, r2) | Nr(t4, e2, r2) >> 4, n3[i3 + 1] = a3;
    }
    function Pr(t4, e2, r2, n3, i3) {
      n3[i3 + 0] = 255, Ar(t4, e2, r2, n3, i3 + 1);
    }
    function kr(t4, e2, r2, n3, i3) {
      xr(t4, e2, r2, n3, i3), n3[i3 + 3] = 255;
    }
    function Ir(t4, e2, r2, n3, i3) {
      Ar(t4, e2, r2, n3, i3), n3[i3 + 3] = 255;
    }
    function Vt2(t4, e2) {
      return 0 > t4 ? 0 : t4 > e2 ? e2 : t4;
    }
    function Fr(e2, r2, n3) {
      t3[e2] = function(t4, e3, i3, a3, o3, s3, c4, u4, h4) {
        for (var l4 = u4 + (-2 & h4) * n3; u4 != l4; ) r2(t4[e3 + 0], i3[a3 + 0], o3[s3 + 0], c4, u4), r2(t4[e3 + 1], i3[a3 + 0], o3[s3 + 0], c4, u4 + n3), e3 += 2, ++a3, ++s3, u4 += 2 * n3;
        1 & h4 && r2(t4[e3 + 0], i3[a3 + 0], o3[s3 + 0], c4, u4);
      };
    }
    function Cr(t4, e2, r2) {
      return 0 == r2 ? 0 == t4 ? 0 == e2 ? 6 : 5 : 0 == e2 ? 4 : 0 : r2;
    }
    function jr(t4, e2, r2, n3, i3) {
      switch (t4 >>> 30) {
        case 3:
          on(e2, r2, n3, i3, 0);
          break;
        case 2:
          sn(e2, r2, n3, i3);
          break;
        case 1:
          un(e2, r2, n3, i3);
      }
    }
    function Or(t4, e2) {
      var r2, a3, o3 = e2.M, s3 = e2.Nb, c4 = t4.oc, u4 = t4.pc + 40, h4 = t4.oc, l4 = t4.pc + 584, f4 = t4.oc, d4 = t4.pc + 600;
      for (r2 = 0; 16 > r2; ++r2) c4[u4 + 32 * r2 - 1] = 129;
      for (r2 = 0; 8 > r2; ++r2) h4[l4 + 32 * r2 - 1] = 129, f4[d4 + 32 * r2 - 1] = 129;
      for (0 < o3 ? c4[u4 - 1 - 32] = h4[l4 - 1 - 32] = f4[d4 - 1 - 32] = 129 : (i2(c4, u4 - 32 - 1, 127, 21), i2(h4, l4 - 32 - 1, 127, 9), i2(f4, d4 - 32 - 1, 127, 9)), a3 = 0; a3 < t4.za; ++a3) {
        var p4 = e2.ya[e2.aa + a3];
        if (0 < a3) {
          for (r2 = -1; 16 > r2; ++r2) n2(c4, u4 + 32 * r2 - 4, c4, u4 + 32 * r2 + 12, 4);
          for (r2 = -1; 8 > r2; ++r2) n2(h4, l4 + 32 * r2 - 4, h4, l4 + 32 * r2 + 4, 4), n2(f4, d4 + 32 * r2 - 4, f4, d4 + 32 * r2 + 4, 4);
        }
        var g4 = t4.Gd, m4 = t4.Hd + a3, v4 = p4.ad, b4 = p4.Hc;
        if (0 < o3 && (n2(c4, u4 - 32, g4[m4].y, 0, 16), n2(h4, l4 - 32, g4[m4].f, 0, 8), n2(f4, d4 - 32, g4[m4].ea, 0, 8)), p4.Za) {
          var y4 = c4, w4 = u4 - 32 + 16;
          for (0 < o3 && (a3 >= t4.za - 1 ? i2(y4, w4, g4[m4].y[15], 4) : n2(y4, w4, g4[m4 + 1].y, 0, 4)), r2 = 0; 4 > r2; r2++) y4[w4 + 128 + r2] = y4[w4 + 256 + r2] = y4[w4 + 384 + r2] = y4[w4 + 0 + r2];
          for (r2 = 0; 16 > r2; ++r2, b4 <<= 2) y4 = c4, w4 = u4 + Di[r2], fi[p4.Ob[r2]](y4, w4), jr(b4, v4, 16 * +r2, y4, w4);
        } else if (y4 = Cr(a3, o3, p4.Ob[0]), li[y4](c4, u4), 0 != b4) for (r2 = 0; 16 > r2; ++r2, b4 <<= 2) jr(b4, v4, 16 * +r2, c4, u4 + Di[r2]);
        for (r2 = p4.Gc, y4 = Cr(a3, o3, p4.Dd), di[y4](h4, l4), di[y4](f4, d4), b4 = v4, y4 = h4, w4 = l4, 255 & (p4 = r2 >> 0) && (170 & p4 ? cn(b4, 256, y4, w4) : hn(b4, 256, y4, w4)), p4 = f4, b4 = d4, 255 & (r2 >>= 8) && (170 & r2 ? cn(v4, 320, p4, b4) : hn(v4, 320, p4, b4)), o3 < t4.Ub - 1 && (n2(g4[m4].y, 0, c4, u4 + 480, 16), n2(g4[m4].f, 0, h4, l4 + 224, 8), n2(g4[m4].ea, 0, f4, d4 + 224, 8)), r2 = 8 * s3 * t4.B, g4 = t4.sa, m4 = t4.ta + 16 * a3 + 16 * s3 * t4.R, v4 = t4.qa, p4 = t4.ra + 8 * a3 + r2, b4 = t4.Ha, y4 = t4.Ia + 8 * a3 + r2, r2 = 0; 16 > r2; ++r2) n2(g4, m4 + r2 * t4.R, c4, u4 + 32 * r2, 16);
        for (r2 = 0; 8 > r2; ++r2) n2(v4, p4 + r2 * t4.B, h4, l4 + 32 * r2, 8), n2(b4, y4 + r2 * t4.B, f4, d4 + 32 * r2, 8);
      }
    }
    function Br(t4, n3, i3, a3, o3, s3, c4, u4, h4) {
      var l4 = [0], f4 = [0], d4 = 0, p4 = null != h4 ? h4.kd : 0, g4 = null != h4 ? h4 : new nr();
      if (null == t4 || 12 > i3) return 7;
      g4.data = t4, g4.w = n3, g4.ha = i3, n3 = [n3], i3 = [i3], g4.gb = [g4.gb];
      t: {
        var m4 = n3, b4 = i3, y4 = g4.gb;
        if (e(null != t4), e(null != b4), e(null != y4), y4[0] = 0, 12 <= b4[0] && !r(t4, m4[0], "RIFF")) {
          if (r(t4, m4[0] + 8, "WEBP")) {
            y4 = 3;
            break t;
          }
          var w4 = j2(t4, m4[0] + 4);
          if (12 > w4 || 4294967286 < w4) {
            y4 = 3;
            break t;
          }
          if (p4 && w4 > b4[0] - 8) {
            y4 = 7;
            break t;
          }
          y4[0] = w4, m4[0] += 12, b4[0] -= 12;
        }
        y4 = 0;
      }
      if (0 != y4) return y4;
      for (w4 = 0 < g4.gb[0], i3 = i3[0]; ; ) {
        t: {
          var L4 = t4;
          b4 = n3, y4 = i3;
          var A4 = l4, x3 = f4, S3 = m4 = [0];
          if ((k3 = d4 = [d4])[0] = 0, 8 > y4[0]) y4 = 7;
          else {
            if (!r(L4, b4[0], "VP8X")) {
              if (10 != j2(L4, b4[0] + 4)) {
                y4 = 3;
                break t;
              }
              if (18 > y4[0]) {
                y4 = 7;
                break t;
              }
              var _3 = j2(L4, b4[0] + 8), P3 = 1 + C2(L4, b4[0] + 12);
              if (2147483648 <= P3 * (L4 = 1 + C2(L4, b4[0] + 15))) {
                y4 = 3;
                break t;
              }
              null != S3 && (S3[0] = _3), null != A4 && (A4[0] = P3), null != x3 && (x3[0] = L4), b4[0] += 18, y4[0] -= 18, k3[0] = 1;
            }
            y4 = 0;
          }
        }
        if (d4 = d4[0], m4 = m4[0], 0 != y4) return y4;
        if (b4 = !!(2 & m4), !w4 && d4) return 3;
        if (null != s3 && (s3[0] = !!(16 & m4)), null != c4 && (c4[0] = b4), null != u4 && (u4[0] = 0), c4 = l4[0], m4 = f4[0], d4 && b4 && null == h4) {
          y4 = 0;
          break;
        }
        if (4 > i3) {
          y4 = 7;
          break;
        }
        if (w4 && d4 || !w4 && !d4 && !r(t4, n3[0], "ALPH")) {
          i3 = [i3], g4.na = [g4.na], g4.P = [g4.P], g4.Sa = [g4.Sa];
          t: {
            _3 = t4, y4 = n3, w4 = i3;
            var k3 = g4.gb;
            A4 = g4.na, x3 = g4.P, S3 = g4.Sa;
            P3 = 22, e(null != _3), e(null != w4), L4 = y4[0];
            var I3 = w4[0];
            for (e(null != A4), e(null != S3), A4[0] = null, x3[0] = null, S3[0] = 0; ; ) {
              if (y4[0] = L4, w4[0] = I3, 8 > I3) {
                y4 = 7;
                break t;
              }
              var F3 = j2(_3, L4 + 4);
              if (4294967286 < F3) {
                y4 = 3;
                break t;
              }
              var O3 = 8 + F3 + 1 & -2;
              if (P3 += O3, 0 < k3 && P3 > k3) {
                y4 = 3;
                break t;
              }
              if (!r(_3, L4, "VP8 ") || !r(_3, L4, "VP8L")) {
                y4 = 0;
                break t;
              }
              if (I3[0] < O3) {
                y4 = 7;
                break t;
              }
              r(_3, L4, "ALPH") || (A4[0] = _3, x3[0] = L4 + 8, S3[0] = F3), L4 += O3, I3 -= O3;
            }
          }
          if (i3 = i3[0], g4.na = g4.na[0], g4.P = g4.P[0], g4.Sa = g4.Sa[0], 0 != y4) break;
        }
        i3 = [i3], g4.Ja = [g4.Ja], g4.xa = [g4.xa];
        t: if (k3 = t4, y4 = n3, w4 = i3, A4 = g4.gb[0], x3 = g4.Ja, S3 = g4.xa, _3 = y4[0], L4 = !r(k3, _3, "VP8 "), P3 = !r(k3, _3, "VP8L"), e(null != k3), e(null != w4), e(null != x3), e(null != S3), 8 > w4[0]) y4 = 7;
        else {
          if (L4 || P3) {
            if (k3 = j2(k3, _3 + 4), 12 <= A4 && k3 > A4 - 12) {
              y4 = 3;
              break t;
            }
            if (p4 && k3 > w4[0] - 8) {
              y4 = 7;
              break t;
            }
            x3[0] = k3, y4[0] += 8, w4[0] -= 8, S3[0] = P3;
          } else S3[0] = 5 <= w4[0] && 47 == k3[_3 + 0] && !(k3[_3 + 4] >> 5), x3[0] = w4[0];
          y4 = 0;
        }
        if (i3 = i3[0], g4.Ja = g4.Ja[0], g4.xa = g4.xa[0], n3 = n3[0], 0 != y4) break;
        if (4294967286 < g4.Ja) return 3;
        if (null == u4 || b4 || (u4[0] = g4.xa ? 2 : 1), c4 = [c4], m4 = [m4], g4.xa) {
          if (5 > i3) {
            y4 = 7;
            break;
          }
          u4 = c4, p4 = m4, b4 = s3, null == t4 || 5 > i3 ? t4 = 0 : 5 <= i3 && 47 == t4[n3 + 0] && !(t4[n3 + 4] >> 5) ? (w4 = [0], k3 = [0], A4 = [0], v3(x3 = new N3(), t4, n3, i3), gt2(x3, w4, k3, A4) ? (null != u4 && (u4[0] = w4[0]), null != p4 && (p4[0] = k3[0]), null != b4 && (b4[0] = A4[0]), t4 = 1) : t4 = 0) : t4 = 0;
        } else {
          if (10 > i3) {
            y4 = 7;
            break;
          }
          u4 = m4, null == t4 || 10 > i3 || !Xt2(t4, n3 + 3, i3 - 3) ? t4 = 0 : (p4 = t4[n3 + 0] | t4[n3 + 1] << 8 | t4[n3 + 2] << 16, b4 = 16383 & (t4[n3 + 7] << 8 | t4[n3 + 6]), t4 = 16383 & (t4[n3 + 9] << 8 | t4[n3 + 8]), 1 & p4 || 3 < (p4 >> 1 & 7) || !(p4 >> 4 & 1) || p4 >> 5 >= g4.Ja || !b4 || !t4 ? t4 = 0 : (c4 && (c4[0] = b4), u4 && (u4[0] = t4), t4 = 1));
        }
        if (!t4) return 3;
        if (c4 = c4[0], m4 = m4[0], d4 && (l4[0] != c4 || f4[0] != m4)) return 3;
        null != h4 && (h4[0] = g4, h4.offset = n3 - h4.w, e(4294967286 > n3 - h4.w), e(h4.offset == h4.ha - i3));
        break;
      }
      return 0 == y4 || 7 == y4 && d4 && null == h4 ? (null != s3 && (s3[0] |= null != g4.na && 0 < g4.na.length), null != a3 && (a3[0] = c4), null != o3 && (o3[0] = m4), 0) : y4;
    }
    function Mr(t4, e2, r2) {
      var n3 = e2.width, i3 = e2.height, a3 = 0, o3 = 0, s3 = n3, c4 = i3;
      if (e2.Da = null != t4 && 0 < t4.Da, e2.Da && (s3 = t4.cd, c4 = t4.bd, a3 = t4.v, o3 = t4.j, 11 > r2 || (a3 &= -2, o3 &= -2), 0 > a3 || 0 > o3 || 0 >= s3 || 0 >= c4 || a3 + s3 > n3 || o3 + c4 > i3)) return 0;
      if (e2.v = a3, e2.j = o3, e2.va = a3 + s3, e2.o = o3 + c4, e2.U = s3, e2.T = c4, e2.da = null != t4 && 0 < t4.da, e2.da) {
        if (!E2(s3, c4, r2 = [t4.ib], a3 = [t4.hb])) return 0;
        e2.ib = r2[0], e2.hb = a3[0];
      }
      return e2.ob = null != t4 && t4.ob, e2.Kb = null == t4 || !t4.Sd, e2.da && (e2.ob = e2.ib < 3 * n3 / 4 && e2.hb < 3 * i3 / 4, e2.Kb = 0), 1;
    }
    function Er(t4) {
      if (null == t4) return 2;
      if (11 > t4.S) {
        var e2 = t4.f.RGBA;
        e2.fb += (t4.height - 1) * e2.A, e2.A = -e2.A;
      } else e2 = t4.f.kb, t4 = t4.height, e2.O += (t4 - 1) * e2.fa, e2.fa = -e2.fa, e2.N += (t4 - 1 >> 1) * e2.Ab, e2.Ab = -e2.Ab, e2.W += (t4 - 1 >> 1) * e2.Db, e2.Db = -e2.Db, null != e2.F && (e2.J += (t4 - 1) * e2.lb, e2.lb = -e2.lb);
      return 0;
    }
    function qr(t4, e2, r2, n3) {
      if (null == n3 || 0 >= t4 || 0 >= e2) return 2;
      if (null != r2) {
        if (r2.Da) {
          var i3 = r2.cd, o3 = r2.bd, s3 = -2 & r2.v, c4 = -2 & r2.j;
          if (0 > s3 || 0 > c4 || 0 >= i3 || 0 >= o3 || s3 + i3 > t4 || c4 + o3 > e2) return 2;
          t4 = i3, e2 = o3;
        }
        if (r2.da) {
          if (!E2(t4, e2, i3 = [r2.ib], o3 = [r2.hb])) return 2;
          t4 = i3[0], e2 = o3[0];
        }
      }
      n3.width = t4, n3.height = e2;
      t: {
        var u4 = n3.width, h4 = n3.height;
        if (t4 = n3.S, 0 >= u4 || 0 >= h4 || !(t4 >= En && 13 > t4)) t4 = 2;
        else {
          if (0 >= n3.Rd && null == n3.sd) {
            s3 = o3 = i3 = e2 = 0;
            var l4 = (c4 = u4 * zi[t4]) * h4;
            if (11 > t4 || (o3 = (h4 + 1) / 2 * (e2 = (u4 + 1) / 2), 12 == t4 && (s3 = (i3 = u4) * h4)), null == (h4 = a2(l4 + 2 * o3 + s3))) {
              t4 = 1;
              break t;
            }
            n3.sd = h4, 11 > t4 ? ((u4 = n3.f.RGBA).eb = h4, u4.fb = 0, u4.A = c4, u4.size = l4) : ((u4 = n3.f.kb).y = h4, u4.O = 0, u4.fa = c4, u4.Fd = l4, u4.f = h4, u4.N = 0 + l4, u4.Ab = e2, u4.Cd = o3, u4.ea = h4, u4.W = 0 + l4 + o3, u4.Db = e2, u4.Ed = o3, 12 == t4 && (u4.F = h4, u4.J = 0 + l4 + 2 * o3), u4.Tc = s3, u4.lb = i3);
          }
          if (e2 = 1, i3 = n3.S, o3 = n3.width, s3 = n3.height, i3 >= En && 13 > i3) if (11 > i3) t4 = n3.f.RGBA, e2 &= (c4 = Math.abs(t4.A)) * (s3 - 1) + o3 <= t4.size, e2 &= c4 >= o3 * zi[i3], e2 &= null != t4.eb;
          else {
            t4 = n3.f.kb, c4 = (o3 + 1) / 2, l4 = (s3 + 1) / 2, u4 = Math.abs(t4.fa);
            h4 = Math.abs(t4.Ab);
            var f4 = Math.abs(t4.Db), d4 = Math.abs(t4.lb), p4 = d4 * (s3 - 1) + o3;
            e2 &= u4 * (s3 - 1) + o3 <= t4.Fd, e2 &= h4 * (l4 - 1) + c4 <= t4.Cd, e2 = (e2 &= f4 * (l4 - 1) + c4 <= t4.Ed) & u4 >= o3 & h4 >= c4 & f4 >= c4, e2 &= null != t4.y, e2 &= null != t4.f, e2 &= null != t4.ea, 12 == i3 && (e2 &= d4 >= o3, e2 &= p4 <= t4.Tc, e2 &= null != t4.F);
          }
          else e2 = 0;
          t4 = e2 ? 0 : 2;
        }
      }
      return 0 != t4 || null != r2 && r2.fd && (t4 = Er(n3)), t4;
    }
    var Dr = 64, Rr = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535, 131071, 262143, 524287, 1048575, 2097151, 4194303, 8388607, 16777215], Tr = 24, Ur = 32, zr = 8, Hr = [0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7];
    R2("Predictor0", "PredictorAdd0"), t3.Predictor0 = function() {
      return 4278190080;
    }, t3.Predictor1 = function(t4) {
      return t4;
    }, t3.Predictor2 = function(t4, e2, r2) {
      return e2[r2 + 0];
    }, t3.Predictor3 = function(t4, e2, r2) {
      return e2[r2 + 1];
    }, t3.Predictor4 = function(t4, e2, r2) {
      return e2[r2 - 1];
    }, t3.Predictor5 = function(t4, e2, r2) {
      return U2(U2(t4, e2[r2 + 1]), e2[r2 + 0]);
    }, t3.Predictor6 = function(t4, e2, r2) {
      return U2(t4, e2[r2 - 1]);
    }, t3.Predictor7 = function(t4, e2, r2) {
      return U2(t4, e2[r2 + 0]);
    }, t3.Predictor8 = function(t4, e2, r2) {
      return U2(e2[r2 - 1], e2[r2 + 0]);
    }, t3.Predictor9 = function(t4, e2, r2) {
      return U2(e2[r2 + 0], e2[r2 + 1]);
    }, t3.Predictor10 = function(t4, e2, r2) {
      return U2(U2(t4, e2[r2 - 1]), U2(e2[r2 + 0], e2[r2 + 1]));
    }, t3.Predictor11 = function(t4, e2, r2) {
      var n3 = e2[r2 + 0];
      return 0 >= W2(n3 >> 24 & 255, t4 >> 24 & 255, (e2 = e2[r2 - 1]) >> 24 & 255) + W2(n3 >> 16 & 255, t4 >> 16 & 255, e2 >> 16 & 255) + W2(n3 >> 8 & 255, t4 >> 8 & 255, e2 >> 8 & 255) + W2(255 & n3, 255 & t4, 255 & e2) ? n3 : t4;
    }, t3.Predictor12 = function(t4, e2, r2) {
      var n3 = e2[r2 + 0];
      return (z2((t4 >> 24 & 255) + (n3 >> 24 & 255) - ((e2 = e2[r2 - 1]) >> 24 & 255)) << 24 | z2((t4 >> 16 & 255) + (n3 >> 16 & 255) - (e2 >> 16 & 255)) << 16 | z2((t4 >> 8 & 255) + (n3 >> 8 & 255) - (e2 >> 8 & 255)) << 8 | z2((255 & t4) + (255 & n3) - (255 & e2))) >>> 0;
    }, t3.Predictor13 = function(t4, e2, r2) {
      var n3 = e2[r2 - 1];
      return (H2((t4 = U2(t4, e2[r2 + 0])) >> 24 & 255, n3 >> 24 & 255) << 24 | H2(t4 >> 16 & 255, n3 >> 16 & 255) << 16 | H2(t4 >> 8 & 255, n3 >> 8 & 255) << 8 | H2(t4 >> 0 & 255, n3 >> 0 & 255)) >>> 0;
    };
    var Wr = t3.PredictorAdd0;
    t3.PredictorAdd1 = V2, R2("Predictor2", "PredictorAdd2"), R2("Predictor3", "PredictorAdd3"), R2("Predictor4", "PredictorAdd4"), R2("Predictor5", "PredictorAdd5"), R2("Predictor6", "PredictorAdd6"), R2("Predictor7", "PredictorAdd7"), R2("Predictor8", "PredictorAdd8"), R2("Predictor9", "PredictorAdd9"), R2("Predictor10", "PredictorAdd10"), R2("Predictor11", "PredictorAdd11"), R2("Predictor12", "PredictorAdd12"), R2("Predictor13", "PredictorAdd13");
    var Vr = t3.PredictorAdd2;
    X2("ColorIndexInverseTransform", "MapARGB", "32b", function(t4) {
      return t4 >> 8 & 255;
    }, function(t4) {
      return t4;
    }), X2("VP8LColorIndexInverseTransformAlpha", "MapAlpha", "8b", function(t4) {
      return t4;
    }, function(t4) {
      return t4 >> 8 & 255;
    });
    var Gr, Yr = t3.ColorIndexInverseTransform, Jr = t3.MapARGB, Xr = t3.VP8LColorIndexInverseTransformAlpha, Kr = t3.MapAlpha, Zr = t3.VP8LPredictorsAdd = [];
    Zr.length = 16, (t3.VP8LPredictors = []).length = 16, (t3.VP8LPredictorsAdd_C = []).length = 16, (t3.VP8LPredictors_C = []).length = 16;
    var $r, Qr, tn, en, rn, nn, an, on, sn, cn, un, hn, ln2, fn, dn, pn, gn, mn, vn, bn, yn, wn, Nn, Ln, An, xn, Sn, _n, Pn = a2(511), kn = a2(2041), In = a2(225), Fn = a2(767), Cn = 0, jn = kn, On = In, Bn = Fn, Mn = Pn, En = 0, qn = 1, Dn = 2, Rn = 3, Tn = 4, Un = 5, zn = 6, Hn = 7, Wn = 8, Vn = 9, Gn = 10, Yn = [2, 3, 7], Jn = [3, 3, 11], Xn = [280, 256, 256, 256, 40], Kn = [0, 1, 1, 1, 0], Zn = [17, 18, 0, 1, 2, 3, 4, 5, 16, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], $n = [24, 7, 23, 25, 40, 6, 39, 41, 22, 26, 38, 42, 56, 5, 55, 57, 21, 27, 54, 58, 37, 43, 72, 4, 71, 73, 20, 28, 53, 59, 70, 74, 36, 44, 88, 69, 75, 52, 60, 3, 87, 89, 19, 29, 86, 90, 35, 45, 68, 76, 85, 91, 51, 61, 104, 2, 103, 105, 18, 30, 102, 106, 34, 46, 84, 92, 67, 77, 101, 107, 50, 62, 120, 1, 119, 121, 83, 93, 17, 31, 100, 108, 66, 78, 118, 122, 33, 47, 117, 123, 49, 63, 99, 109, 82, 94, 0, 116, 124, 65, 79, 16, 32, 98, 110, 48, 115, 125, 81, 95, 64, 114, 126, 97, 111, 80, 113, 127, 96, 112], Qn = [2954, 2956, 2958, 2962, 2970, 2986, 3018, 3082, 3212, 3468, 3980, 5004], ti = 8, ei = [4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 17, 18, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 25, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 93, 95, 96, 98, 100, 101, 102, 104, 106, 108, 110, 112, 114, 116, 118, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140, 143, 145, 148, 151, 154, 157], ri = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 119, 122, 125, 128, 131, 134, 137, 140, 143, 146, 149, 152, 155, 158, 161, 164, 167, 170, 173, 177, 181, 185, 189, 193, 197, 201, 205, 209, 213, 217, 221, 225, 229, 234, 239, 245, 249, 254, 259, 264, 269, 274, 279, 284], ni = null, ii = [[173, 148, 140, 0], [176, 155, 140, 135, 0], [180, 157, 141, 134, 130, 0], [254, 254, 243, 230, 196, 177, 153, 140, 133, 130, 129, 0]], ai = [0, 1, 4, 8, 5, 2, 3, 6, 9, 12, 13, 10, 7, 11, 14, 15], oi = [-0, 1, -1, 2, -2, 3, 4, 6, -3, 5, -4, -5, -6, 7, -7, 8, -8, -9], si = [[[[128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128], [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128], [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]], [[253, 136, 254, 255, 228, 219, 128, 128, 128, 128, 128], [189, 129, 242, 255, 227, 213, 255, 219, 128, 128, 128], [106, 126, 227, 252, 214, 209, 255, 255, 128, 128, 128]], [[1, 98, 248, 255, 236, 226, 255, 255, 128, 128, 128], [181, 133, 238, 254, 221, 234, 255, 154, 128, 128, 128], [78, 134, 202, 247, 198, 180, 255, 219, 128, 128, 128]], [[1, 185, 249, 255, 243, 255, 128, 128, 128, 128, 128], [184, 150, 247, 255, 236, 224, 128, 128, 128, 128, 128], [77, 110, 216, 255, 236, 230, 128, 128, 128, 128, 128]], [[1, 101, 251, 255, 241, 255, 128, 128, 128, 128, 128], [170, 139, 241, 252, 236, 209, 255, 255, 128, 128, 128], [37, 116, 196, 243, 228, 255, 255, 255, 128, 128, 128]], [[1, 204, 254, 255, 245, 255, 128, 128, 128, 128, 128], [207, 160, 250, 255, 238, 128, 128, 128, 128, 128, 128], [102, 103, 231, 255, 211, 171, 128, 128, 128, 128, 128]], [[1, 152, 252, 255, 240, 255, 128, 128, 128, 128, 128], [177, 135, 243, 255, 234, 225, 128, 128, 128, 128, 128], [80, 129, 211, 255, 194, 224, 128, 128, 128, 128, 128]], [[1, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128], [246, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128], [255, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]]], [[[198, 35, 237, 223, 193, 187, 162, 160, 145, 155, 62], [131, 45, 198, 221, 172, 176, 220, 157, 252, 221, 1], [68, 47, 146, 208, 149, 167, 221, 162, 255, 223, 128]], [[1, 149, 241, 255, 221, 224, 255, 255, 128, 128, 128], [184, 141, 234, 253, 222, 220, 255, 199, 128, 128, 128], [81, 99, 181, 242, 176, 190, 249, 202, 255, 255, 128]], [[1, 129, 232, 253, 214, 197, 242, 196, 255, 255, 128], [99, 121, 210, 250, 201, 198, 255, 202, 128, 128, 128], [23, 91, 163, 242, 170, 187, 247, 210, 255, 255, 128]], [[1, 200, 246, 255, 234, 255, 128, 128, 128, 128, 128], [109, 178, 241, 255, 231, 245, 255, 255, 128, 128, 128], [44, 130, 201, 253, 205, 192, 255, 255, 128, 128, 128]], [[1, 132, 239, 251, 219, 209, 255, 165, 128, 128, 128], [94, 136, 225, 251, 218, 190, 255, 255, 128, 128, 128], [22, 100, 174, 245, 186, 161, 255, 199, 128, 128, 128]], [[1, 182, 249, 255, 232, 235, 128, 128, 128, 128, 128], [124, 143, 241, 255, 227, 234, 128, 128, 128, 128, 128], [35, 77, 181, 251, 193, 211, 255, 205, 128, 128, 128]], [[1, 157, 247, 255, 236, 231, 255, 255, 128, 128, 128], [121, 141, 235, 255, 225, 227, 255, 255, 128, 128, 128], [45, 99, 188, 251, 195, 217, 255, 224, 128, 128, 128]], [[1, 1, 251, 255, 213, 255, 128, 128, 128, 128, 128], [203, 1, 248, 255, 255, 128, 128, 128, 128, 128, 128], [137, 1, 177, 255, 224, 255, 128, 128, 128, 128, 128]]], [[[253, 9, 248, 251, 207, 208, 255, 192, 128, 128, 128], [175, 13, 224, 243, 193, 185, 249, 198, 255, 255, 128], [73, 17, 171, 221, 161, 179, 236, 167, 255, 234, 128]], [[1, 95, 247, 253, 212, 183, 255, 255, 128, 128, 128], [239, 90, 244, 250, 211, 209, 255, 255, 128, 128, 128], [155, 77, 195, 248, 188, 195, 255, 255, 128, 128, 128]], [[1, 24, 239, 251, 218, 219, 255, 205, 128, 128, 128], [201, 51, 219, 255, 196, 186, 128, 128, 128, 128, 128], [69, 46, 190, 239, 201, 218, 255, 228, 128, 128, 128]], [[1, 191, 251, 255, 255, 128, 128, 128, 128, 128, 128], [223, 165, 249, 255, 213, 255, 128, 128, 128, 128, 128], [141, 124, 248, 255, 255, 128, 128, 128, 128, 128, 128]], [[1, 16, 248, 255, 255, 128, 128, 128, 128, 128, 128], [190, 36, 230, 255, 236, 255, 128, 128, 128, 128, 128], [149, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128]], [[1, 226, 255, 128, 128, 128, 128, 128, 128, 128, 128], [247, 192, 255, 128, 128, 128, 128, 128, 128, 128, 128], [240, 128, 255, 128, 128, 128, 128, 128, 128, 128, 128]], [[1, 134, 252, 255, 255, 128, 128, 128, 128, 128, 128], [213, 62, 250, 255, 255, 128, 128, 128, 128, 128, 128], [55, 93, 255, 128, 128, 128, 128, 128, 128, 128, 128]], [[128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128], [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128], [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]]], [[[202, 24, 213, 235, 186, 191, 220, 160, 240, 175, 255], [126, 38, 182, 232, 169, 184, 228, 174, 255, 187, 128], [61, 46, 138, 219, 151, 178, 240, 170, 255, 216, 128]], [[1, 112, 230, 250, 199, 191, 247, 159, 255, 255, 128], [166, 109, 228, 252, 211, 215, 255, 174, 128, 128, 128], [39, 77, 162, 232, 172, 180, 245, 178, 255, 255, 128]], [[1, 52, 220, 246, 198, 199, 249, 220, 255, 255, 128], [124, 74, 191, 243, 183, 193, 250, 221, 255, 255, 128], [24, 71, 130, 219, 154, 170, 243, 182, 255, 255, 128]], [[1, 182, 225, 249, 219, 240, 255, 224, 128, 128, 128], [149, 150, 226, 252, 216, 205, 255, 171, 128, 128, 128], [28, 108, 170, 242, 183, 194, 254, 223, 255, 255, 128]], [[1, 81, 230, 252, 204, 203, 255, 192, 128, 128, 128], [123, 102, 209, 247, 188, 196, 255, 233, 128, 128, 128], [20, 95, 153, 243, 164, 173, 255, 203, 128, 128, 128]], [[1, 222, 248, 255, 216, 213, 128, 128, 128, 128, 128], [168, 175, 246, 252, 235, 205, 255, 255, 128, 128, 128], [47, 116, 215, 255, 211, 212, 255, 255, 128, 128, 128]], [[1, 121, 236, 253, 212, 214, 255, 255, 128, 128, 128], [141, 84, 213, 252, 201, 202, 255, 219, 128, 128, 128], [42, 80, 160, 240, 162, 185, 255, 205, 128, 128, 128]], [[1, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128], [244, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128], [238, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128]]]], ci = [[[231, 120, 48, 89, 115, 113, 120, 152, 112], [152, 179, 64, 126, 170, 118, 46, 70, 95], [175, 69, 143, 80, 85, 82, 72, 155, 103], [56, 58, 10, 171, 218, 189, 17, 13, 152], [114, 26, 17, 163, 44, 195, 21, 10, 173], [121, 24, 80, 195, 26, 62, 44, 64, 85], [144, 71, 10, 38, 171, 213, 144, 34, 26], [170, 46, 55, 19, 136, 160, 33, 206, 71], [63, 20, 8, 114, 114, 208, 12, 9, 226], [81, 40, 11, 96, 182, 84, 29, 16, 36]], [[134, 183, 89, 137, 98, 101, 106, 165, 148], [72, 187, 100, 130, 157, 111, 32, 75, 80], [66, 102, 167, 99, 74, 62, 40, 234, 128], [41, 53, 9, 178, 241, 141, 26, 8, 107], [74, 43, 26, 146, 73, 166, 49, 23, 157], [65, 38, 105, 160, 51, 52, 31, 115, 128], [104, 79, 12, 27, 217, 255, 87, 17, 7], [87, 68, 71, 44, 114, 51, 15, 186, 23], [47, 41, 14, 110, 182, 183, 21, 17, 194], [66, 45, 25, 102, 197, 189, 23, 18, 22]], [[88, 88, 147, 150, 42, 46, 45, 196, 205], [43, 97, 183, 117, 85, 38, 35, 179, 61], [39, 53, 200, 87, 26, 21, 43, 232, 171], [56, 34, 51, 104, 114, 102, 29, 93, 77], [39, 28, 85, 171, 58, 165, 90, 98, 64], [34, 22, 116, 206, 23, 34, 43, 166, 73], [107, 54, 32, 26, 51, 1, 81, 43, 31], [68, 25, 106, 22, 64, 171, 36, 225, 114], [34, 19, 21, 102, 132, 188, 16, 76, 124], [62, 18, 78, 95, 85, 57, 50, 48, 51]], [[193, 101, 35, 159, 215, 111, 89, 46, 111], [60, 148, 31, 172, 219, 228, 21, 18, 111], [112, 113, 77, 85, 179, 255, 38, 120, 114], [40, 42, 1, 196, 245, 209, 10, 25, 109], [88, 43, 29, 140, 166, 213, 37, 43, 154], [61, 63, 30, 155, 67, 45, 68, 1, 209], [100, 80, 8, 43, 154, 1, 51, 26, 71], [142, 78, 78, 16, 255, 128, 34, 197, 171], [41, 40, 5, 102, 211, 183, 4, 1, 221], [51, 50, 17, 168, 209, 192, 23, 25, 82]], [[138, 31, 36, 171, 27, 166, 38, 44, 229], [67, 87, 58, 169, 82, 115, 26, 59, 179], [63, 59, 90, 180, 59, 166, 93, 73, 154], [40, 40, 21, 116, 143, 209, 34, 39, 175], [47, 15, 16, 183, 34, 223, 49, 45, 183], [46, 17, 33, 183, 6, 98, 15, 32, 183], [57, 46, 22, 24, 128, 1, 54, 17, 37], [65, 32, 73, 115, 28, 128, 23, 128, 205], [40, 3, 9, 115, 51, 192, 18, 6, 223], [87, 37, 9, 115, 59, 77, 64, 21, 47]], [[104, 55, 44, 218, 9, 54, 53, 130, 226], [64, 90, 70, 205, 40, 41, 23, 26, 57], [54, 57, 112, 184, 5, 41, 38, 166, 213], [30, 34, 26, 133, 152, 116, 10, 32, 134], [39, 19, 53, 221, 26, 114, 32, 73, 255], [31, 9, 65, 234, 2, 15, 1, 118, 73], [75, 32, 12, 51, 192, 255, 160, 43, 51], [88, 31, 35, 67, 102, 85, 55, 186, 85], [56, 21, 23, 111, 59, 205, 45, 37, 192], [55, 38, 70, 124, 73, 102, 1, 34, 98]], [[125, 98, 42, 88, 104, 85, 117, 175, 82], [95, 84, 53, 89, 128, 100, 113, 101, 45], [75, 79, 123, 47, 51, 128, 81, 171, 1], [57, 17, 5, 71, 102, 57, 53, 41, 49], [38, 33, 13, 121, 57, 73, 26, 1, 85], [41, 10, 67, 138, 77, 110, 90, 47, 114], [115, 21, 2, 10, 102, 255, 166, 23, 6], [101, 29, 16, 10, 85, 128, 101, 196, 26], [57, 18, 10, 102, 102, 213, 34, 20, 43], [117, 20, 15, 36, 163, 128, 68, 1, 26]], [[102, 61, 71, 37, 34, 53, 31, 243, 192], [69, 60, 71, 38, 73, 119, 28, 222, 37], [68, 45, 128, 34, 1, 47, 11, 245, 171], [62, 17, 19, 70, 146, 85, 55, 62, 70], [37, 43, 37, 154, 100, 163, 85, 160, 1], [63, 9, 92, 136, 28, 64, 32, 201, 85], [75, 15, 9, 9, 64, 255, 184, 119, 16], [86, 6, 28, 5, 64, 255, 25, 248, 1], [56, 8, 17, 132, 137, 255, 55, 116, 128], [58, 15, 20, 82, 135, 57, 26, 121, 40]], [[164, 50, 31, 137, 154, 133, 25, 35, 218], [51, 103, 44, 131, 131, 123, 31, 6, 158], [86, 40, 64, 135, 148, 224, 45, 183, 128], [22, 26, 17, 131, 240, 154, 14, 1, 209], [45, 16, 21, 91, 64, 222, 7, 1, 197], [56, 21, 39, 155, 60, 138, 23, 102, 213], [83, 12, 13, 54, 192, 255, 68, 47, 28], [85, 26, 85, 85, 128, 128, 32, 146, 171], [18, 11, 7, 63, 144, 171, 4, 4, 246], [35, 27, 10, 146, 174, 171, 12, 26, 128]], [[190, 80, 35, 99, 180, 80, 126, 54, 45], [85, 126, 47, 87, 176, 51, 41, 20, 32], [101, 75, 128, 139, 118, 146, 116, 128, 85], [56, 41, 15, 176, 236, 85, 37, 9, 62], [71, 30, 17, 119, 118, 255, 17, 18, 138], [101, 38, 60, 138, 55, 70, 43, 26, 142], [146, 36, 19, 30, 171, 255, 97, 27, 20], [138, 45, 61, 62, 219, 1, 81, 188, 64], [32, 41, 20, 117, 151, 142, 20, 21, 163], [112, 19, 12, 61, 195, 128, 48, 4, 24]]], ui = [[[[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[176, 246, 255, 255, 255, 255, 255, 255, 255, 255, 255], [223, 241, 252, 255, 255, 255, 255, 255, 255, 255, 255], [249, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 244, 252, 255, 255, 255, 255, 255, 255, 255, 255], [234, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 246, 254, 255, 255, 255, 255, 255, 255, 255, 255], [239, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 248, 254, 255, 255, 255, 255, 255, 255, 255, 255], [251, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [251, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 254, 253, 255, 254, 255, 255, 255, 255, 255, 255], [250, 255, 254, 255, 254, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]]], [[[217, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [225, 252, 241, 253, 255, 255, 254, 255, 255, 255, 255], [234, 250, 241, 250, 253, 255, 253, 254, 255, 255, 255]], [[255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [223, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [238, 253, 254, 254, 255, 255, 255, 255, 255, 255, 255]], [[255, 248, 254, 255, 255, 255, 255, 255, 255, 255, 255], [249, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 253, 255, 255, 255, 255, 255, 255, 255, 255, 255], [247, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [252, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 254, 253, 255, 255, 255, 255, 255, 255, 255, 255], [250, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]]], [[[186, 251, 250, 255, 255, 255, 255, 255, 255, 255, 255], [234, 251, 244, 254, 255, 255, 255, 255, 255, 255, 255], [251, 251, 243, 253, 254, 255, 254, 255, 255, 255, 255]], [[255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [236, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [251, 253, 253, 254, 254, 255, 255, 255, 255, 255, 255]], [[255, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]]], [[[248, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [250, 254, 252, 254, 255, 255, 255, 255, 255, 255, 255], [248, 254, 249, 253, 255, 255, 255, 255, 255, 255, 255]], [[255, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255], [246, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255], [252, 254, 251, 254, 254, 255, 255, 255, 255, 255, 255]], [[255, 254, 252, 255, 255, 255, 255, 255, 255, 255, 255], [248, 254, 253, 255, 255, 255, 255, 255, 255, 255, 255], [253, 255, 254, 254, 255, 255, 255, 255, 255, 255, 255]], [[255, 251, 254, 255, 255, 255, 255, 255, 255, 255, 255], [245, 251, 254, 255, 255, 255, 255, 255, 255, 255, 255], [253, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 251, 253, 255, 255, 255, 255, 255, 255, 255, 255], [252, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 252, 255, 255, 255, 255, 255, 255, 255, 255, 255], [249, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 253, 255, 255, 255, 255, 255, 255, 255, 255], [250, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]]]], hi = [0, 1, 2, 3, 6, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 7, 0], li = [], fi = [], di = [], pi = 1, gi = 2, mi = [], vi = [];
    vr("UpsampleRgbLinePair", Ar, 3), vr("UpsampleBgrLinePair", xr, 3), vr("UpsampleRgbaLinePair", Ir, 4), vr("UpsampleBgraLinePair", kr, 4), vr("UpsampleArgbLinePair", Pr, 4), vr("UpsampleRgba4444LinePair", _r, 2), vr("UpsampleRgb565LinePair", Sr, 2);
    var bi = t3.UpsampleRgbLinePair, yi = t3.UpsampleBgrLinePair, wi = t3.UpsampleRgbaLinePair, Ni = t3.UpsampleBgraLinePair, Li = t3.UpsampleArgbLinePair, Ai = t3.UpsampleRgba4444LinePair, xi = t3.UpsampleRgb565LinePair, Si = 16, _i = 1 << Si - 1, Pi = -227, ki = 482, Ii = 6, Fi = (256 << Ii) - 1, Ci = 0, ji = a2(256), Oi = a2(256), Bi = a2(256), Mi = a2(256), Ei = a2(ki - Pi), qi = a2(ki - Pi);
    Fr("YuvToRgbRow", Ar, 3), Fr("YuvToBgrRow", xr, 3), Fr("YuvToRgbaRow", Ir, 4), Fr("YuvToBgraRow", kr, 4), Fr("YuvToArgbRow", Pr, 4), Fr("YuvToRgba4444Row", _r, 2), Fr("YuvToRgb565Row", Sr, 2);
    var Di = [0, 4, 8, 12, 128, 132, 136, 140, 256, 260, 264, 268, 384, 388, 392, 396], Ri = [0, 2, 8], Ti = [8, 7, 6, 4, 4, 2, 2, 2, 1, 1, 1, 1], Ui = 1;
    this.WebPDecodeRGBA = function(t4, r2, n3, i3, a3) {
      var o3 = qn, s3 = new rr(), c4 = new ot2();
      s3.ba = c4, c4.S = o3, c4.width = [c4.width], c4.height = [c4.height];
      var u4 = c4.width, h4 = c4.height, l4 = new st2();
      if (null == l4 || null == t4) var f4 = 2;
      else e(null != l4), f4 = Br(t4, r2, n3, l4.width, l4.height, l4.Pd, l4.Qd, l4.format, null);
      if (0 != f4 ? u4 = 0 : (null != u4 && (u4[0] = l4.width[0]), null != h4 && (h4[0] = l4.height[0]), u4 = 1), u4) {
        c4.width = c4.width[0], c4.height = c4.height[0], null != i3 && (i3[0] = c4.width), null != a3 && (a3[0] = c4.height);
        t: {
          if (i3 = new Gt2(), (a3 = new nr()).data = t4, a3.w = r2, a3.ha = n3, a3.kd = 1, r2 = [0], e(null != a3), (0 == (t4 = Br(a3.data, a3.w, a3.ha, null, null, null, r2, null, a3)) || 7 == t4) && r2[0] && (t4 = 4), 0 == (r2 = t4)) {
            if (e(null != s3), i3.data = a3.data, i3.w = a3.w + a3.offset, i3.ha = a3.ha - a3.offset, i3.put = dt2, i3.ac = ft2, i3.bc = pt2, i3.ma = s3, a3.xa) {
              if (null == (t4 = kt2())) {
                s3 = 1;
                break t;
              }
              if (function(t5, r3) {
                var n4 = [0], i4 = [0], a4 = [0];
                e: for (; ; ) {
                  if (null == t5) return 0;
                  if (null == r3) return t5.a = 2, 0;
                  if (t5.l = r3, t5.a = 0, v3(t5.m, r3.data, r3.w, r3.ha), !gt2(t5.m, n4, i4, a4)) {
                    t5.a = 3;
                    break e;
                  }
                  if (t5.xb = gi, r3.width = n4[0], r3.height = i4[0], !It2(n4[0], i4[0], 1, t5, null)) break e;
                  return 1;
                }
                return e(0 != t5.a), 0;
              }(t4, i3)) {
                if (i3 = 0 == (r2 = qr(i3.width, i3.height, s3.Oa, s3.ba))) {
                  e: {
                    i3 = t4;
                    r: for (; ; ) {
                      if (null == i3) {
                        i3 = 0;
                        break e;
                      }
                      if (e(null != i3.s.yc), e(null != i3.s.Ya), e(0 < i3.s.Wb), e(null != (n3 = i3.l)), e(null != (a3 = n3.ma)), 0 != i3.xb) {
                        if (i3.ca = a3.ba, i3.tb = a3.tb, e(null != i3.ca), !Mr(a3.Oa, n3, Rn)) {
                          i3.a = 2;
                          break r;
                        }
                        if (!Ft2(i3, n3.width)) break r;
                        if (n3.da) break r;
                        if ((n3.da || nt2(i3.ca.S)) && mr(), 11 > i3.ca.S || (alert("todo:WebPInitConvertARGBToYUV"), null != i3.ca.f.kb.F && mr()), i3.Pb && 0 < i3.s.ua && null == i3.s.vb.X && !O2(i3.s.vb, i3.s.Wa.Xa)) {
                          i3.a = 1;
                          break r;
                        }
                        i3.xb = 0;
                      }
                      if (!_t2(i3, i3.V, i3.Ba, i3.c, i3.i, n3.o, Lt2)) break r;
                      a3.Dc = i3.Ma, i3 = 1;
                      break e;
                    }
                    e(0 != i3.a), i3 = 0;
                  }
                  i3 = !i3;
                }
                i3 && (r2 = t4.a);
              } else r2 = t4.a;
            } else {
              if (null == (t4 = new Yt2())) {
                s3 = 1;
                break t;
              }
              if (t4.Fa = a3.na, t4.P = a3.P, t4.qc = a3.Sa, Kt2(t4, i3)) {
                if (0 == (r2 = qr(i3.width, i3.height, s3.Oa, s3.ba))) {
                  if (t4.Aa = 0, n3 = s3.Oa, e(null != (a3 = t4)), null != n3) {
                    if (0 < (u4 = 0 > (u4 = n3.Md) ? 0 : 100 < u4 ? 255 : 255 * u4 / 100)) {
                      for (h4 = l4 = 0; 4 > h4; ++h4) 12 > (f4 = a3.pb[h4]).lc && (f4.ia = u4 * Ti[0 > f4.lc ? 0 : f4.lc] >> 3), l4 |= f4.ia;
                      l4 && (alert("todo:VP8InitRandom"), a3.ia = 1);
                    }
                    a3.Ga = n3.Id, 100 < a3.Ga ? a3.Ga = 100 : 0 > a3.Ga && (a3.Ga = 0);
                  }
                  Qt2(t4, i3) || (r2 = t4.a);
                }
              } else r2 = t4.a;
            }
            0 == r2 && null != s3.Oa && s3.Oa.fd && (r2 = Er(s3.ba));
          }
          s3 = r2;
        }
        o3 = 0 != s3 ? null : 11 > o3 ? c4.f.RGBA.eb : c4.f.kb.y;
      } else o3 = null;
      return o3;
    };
    var zi = [3, 4, 3, 4, 4, 2, 2, 4, 4, 4, 2, 1, 1];
  };
  function u2(t3, e2) {
    for (var r2 = "", n3 = 0; n3 < 4; n3++) r2 += String.fromCharCode(t3[e2++]);
    return r2;
  }
  function h2(t3, e2) {
    return (t3[e2 + 0] << 0 | t3[e2 + 1] << 8 | t3[e2 + 2] << 16) >>> 0;
  }
  function l2(t3, e2) {
    return (t3[e2 + 0] << 0 | t3[e2 + 1] << 8 | t3[e2 + 2] << 16 | t3[e2 + 3] << 24) >>> 0;
  }
  new c2();
  var f2 = [0], d2 = [0], p2 = [], g2 = new c2(), m2 = t2, v2 = function(t3, e2) {
    var r2 = {}, n3 = 0, i3 = false, a3 = 0, o3 = 0;
    if (r2.frames = [], !/** @license
       * Copyright (c) 2017 Dominik Homberger
      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
      The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      https://webpjs.appspot.com
      WebPRiffParser dominikhlbg@gmail.com
      */
    function(t4, e3, r3, n4) {
      for (var i4 = 0; i4 < n4; i4++) if (t4[e3 + i4] != r3.charCodeAt(i4)) return true;
      return false;
    }(t3, e2, "RIFF", 4)) {
      var s3, c3;
      l2(t3, e2 += 4);
      for (e2 += 8; e2 < t3.length; ) {
        var f3 = u2(t3, e2), d3 = l2(t3, e2 += 4);
        e2 += 4;
        var p3 = d3 + (1 & d3);
        switch (f3) {
          case "VP8 ":
          case "VP8L":
            void 0 === r2.frames[n3] && (r2.frames[n3] = {});
            (v3 = r2.frames[n3]).src_off = i3 ? o3 : e2 - 8, v3.src_size = a3 + d3 + 8, n3++, i3 && (i3 = false, a3 = 0, o3 = 0);
            break;
          case "VP8X":
            (v3 = r2.header = {}).feature_flags = t3[e2];
            var g3 = e2 + 4;
            v3.canvas_width = 1 + h2(t3, g3);
            g3 += 3;
            v3.canvas_height = 1 + h2(t3, g3);
            g3 += 3;
            break;
          case "ALPH":
            i3 = true, a3 = p3 + 8, o3 = e2 - 8;
            break;
          case "ANIM":
            (v3 = r2.header).bgcolor = l2(t3, e2);
            g3 = e2 + 4;
            v3.loop_count = (s3 = t3)[(c3 = g3) + 0] << 0 | s3[c3 + 1] << 8;
            g3 += 2;
            break;
          case "ANMF":
            var m3, v3;
            (v3 = r2.frames[n3] = {}).offset_x = 2 * h2(t3, e2), e2 += 3, v3.offset_y = 2 * h2(t3, e2), e2 += 3, v3.width = 1 + h2(t3, e2), e2 += 3, v3.height = 1 + h2(t3, e2), e2 += 3, v3.duration = h2(t3, e2), e2 += 3, m3 = t3[e2++], v3.dispose = 1 & m3, v3.blend = m3 >> 1 & 1;
        }
        "ANMF" != f3 && (e2 += p3);
      }
      return r2;
    }
  }(m2, 0);
  v2.response = m2, v2.rgbaoutput = true, v2.dataurl = false;
  var b2 = v2.header ? v2.header : null, y2 = v2.frames ? v2.frames : null;
  if (b2) {
    b2.loop_counter = b2.loop_count, f2 = [b2.canvas_height], d2 = [b2.canvas_width];
    for (var w2 = 0; w2 < y2.length && 0 != y2[w2].blend; w2++) ;
  }
  var N2 = y2[0], L2 = g2.WebPDecodeRGBA(m2, N2.src_off, N2.src_size, d2, f2);
  N2.rgba = L2, N2.imgwidth = d2[0], N2.imgheight = f2[0];
  for (var A2 = 0; A2 < d2[0] * f2[0] * 4; A2++) p2[A2] = L2[A2];
  return this.width = d2, this.height = f2, this.data = p2, this;
}
!function(t2) {
  var r = function() {
    return "function" == typeof zlibSync;
  }, n2 = function(r2, n3, a3, h3) {
    var l3 = 4, f3 = s2;
    switch (h3) {
      case t2.image_compression.FAST:
        l3 = 1, f3 = o2;
        break;
      case t2.image_compression.MEDIUM:
        l3 = 6, f3 = c2;
        break;
      case t2.image_compression.SLOW:
        l3 = 9, f3 = u2;
    }
    r2 = i2(r2, n3, a3, f3);
    var d2 = zlibSync(r2, { level: l3 });
    return t2.__addimage__.arrayBufferToBinaryString(d2);
  }, i2 = function(t3, e, r2, n3) {
    for (var i3, a3, o3, s3 = t3.length / e, c3 = new Uint8Array(t3.length + s3), u3 = l2(), h3 = 0; h3 < s3; h3 += 1) {
      if (o3 = h3 * e, i3 = t3.subarray(o3, o3 + e), n3) c3.set(n3(i3, r2, a3), o3 + h3);
      else {
        for (var d2, p2 = u3.length, g2 = []; d2 < p2; d2 += 1) g2[d2] = u3[d2](i3, r2, a3);
        var m2 = f2(g2.concat());
        c3.set(g2[m2], o3 + h3);
      }
      a3 = i3;
    }
    return c3;
  }, a2 = function(t3) {
    var e = Array.apply([], t3);
    return e.unshift(0), e;
  }, o2 = function(t3, e) {
    var r2, n3 = [], i3 = t3.length;
    n3[0] = 1;
    for (var a3 = 0; a3 < i3; a3 += 1) r2 = t3[a3 - e] || 0, n3[a3 + 1] = t3[a3] - r2 + 256 & 255;
    return n3;
  }, s2 = function(t3, e, r2) {
    var n3, i3 = [], a3 = t3.length;
    i3[0] = 2;
    for (var o3 = 0; o3 < a3; o3 += 1) n3 = r2 && r2[o3] || 0, i3[o3 + 1] = t3[o3] - n3 + 256 & 255;
    return i3;
  }, c2 = function(t3, e, r2) {
    var n3, i3, a3 = [], o3 = t3.length;
    a3[0] = 3;
    for (var s3 = 0; s3 < o3; s3 += 1) n3 = t3[s3 - e] || 0, i3 = r2 && r2[s3] || 0, a3[s3 + 1] = t3[s3] + 256 - (n3 + i3 >>> 1) & 255;
    return a3;
  }, u2 = function(t3, e, r2) {
    var n3, i3, a3, o3, s3 = [], c3 = t3.length;
    s3[0] = 4;
    for (var u3 = 0; u3 < c3; u3 += 1) n3 = t3[u3 - e] || 0, i3 = r2 && r2[u3] || 0, a3 = r2 && r2[u3 - e] || 0, o3 = h2(n3, i3, a3), s3[u3 + 1] = t3[u3] - o3 + 256 & 255;
    return s3;
  }, h2 = function(t3, e, r2) {
    if (t3 === e && e === r2) return t3;
    var n3 = Math.abs(e - r2), i3 = Math.abs(t3 - r2), a3 = Math.abs(t3 + e - r2 - r2);
    return n3 <= i3 && n3 <= a3 ? t3 : i3 <= a3 ? e : r2;
  }, l2 = function() {
    return [a2, o2, s2, c2, u2];
  }, f2 = function(t3) {
    var e = t3.map(function(t4) {
      return t4.reduce(function(t5, e2) {
        return t5 + Math.abs(e2);
      }, 0);
    });
    return e.indexOf(Math.min.apply(null, e));
  };
  t2.processPNG = function(e, i3, a3, o3) {
    var s3, c3, u3, h3, l3, f3, d2, p2, g2, m2, v2, b2, y2, w2, N2, L2 = this.decode.FLATE_DECODE, A2 = "";
    if (this.__addimage__.isArrayBuffer(e) && (e = new Uint8Array(e)), this.__addimage__.isArrayBufferView(e)) {
      if (e = (u3 = new Kt(e)).imgData, c3 = u3.bits, s3 = u3.colorSpace, l3 = u3.colors, -1 !== [4, 6].indexOf(u3.colorType)) {
        if (8 === u3.bits) {
          g2 = (p2 = 32 == u3.pixelBitlength ? new Uint32Array(u3.decodePixels().buffer) : 16 == u3.pixelBitlength ? new Uint16Array(u3.decodePixels().buffer) : new Uint8Array(u3.decodePixels().buffer)).length, v2 = new Uint8Array(g2 * u3.colors), m2 = new Uint8Array(g2);
          var x2, S2 = u3.pixelBitlength - u3.bits;
          for (w2 = 0, N2 = 0; w2 < g2; w2++) {
            for (y2 = p2[w2], x2 = 0; x2 < S2; ) v2[N2++] = y2 >>> x2 & 255, x2 += u3.bits;
            m2[w2] = y2 >>> x2 & 255;
          }
        }
        if (16 === u3.bits) {
          g2 = (p2 = new Uint32Array(u3.decodePixels().buffer)).length, v2 = new Uint8Array(g2 * (32 / u3.pixelBitlength) * u3.colors), m2 = new Uint8Array(g2 * (32 / u3.pixelBitlength)), b2 = u3.colors > 1, w2 = 0, N2 = 0;
          for (var _2 = 0; w2 < g2; ) y2 = p2[w2++], v2[N2++] = y2 >>> 0 & 255, b2 && (v2[N2++] = y2 >>> 16 & 255, y2 = p2[w2++], v2[N2++] = y2 >>> 0 & 255), m2[_2++] = y2 >>> 16 & 255;
          c3 = 8;
        }
        o3 !== t2.image_compression.NONE && r() ? (e = n2(v2, u3.width * u3.colors, u3.colors, o3), d2 = n2(m2, u3.width, 1, o3)) : (e = v2, d2 = m2, L2 = void 0);
      }
      if (3 === u3.colorType && (s3 = this.color_spaces.INDEXED, f3 = u3.palette, u3.transparency.indexed)) {
        var P2 = u3.transparency.indexed, k2 = 0;
        for (w2 = 0, g2 = P2.length; w2 < g2; ++w2) k2 += P2[w2];
        if ((k2 /= 255) === g2 - 1 && -1 !== P2.indexOf(0)) h3 = [P2.indexOf(0)];
        else if (k2 !== g2) {
          for (p2 = u3.decodePixels(), m2 = new Uint8Array(p2.length), w2 = 0, g2 = p2.length; w2 < g2; w2++) m2[w2] = P2[p2[w2]];
          d2 = n2(m2, u3.width, 1);
        }
      }
      var I2 = function(e2) {
        var r2;
        switch (e2) {
          case t2.image_compression.FAST:
            r2 = 11;
            break;
          case t2.image_compression.MEDIUM:
            r2 = 13;
            break;
          case t2.image_compression.SLOW:
            r2 = 14;
            break;
          default:
            r2 = 12;
        }
        return r2;
      }(o3);
      return L2 === this.decode.FLATE_DECODE && (A2 = "/Predictor " + I2 + " "), A2 += "/Colors " + l3 + " /BitsPerComponent " + c3 + " /Columns " + u3.width, (this.__addimage__.isArrayBuffer(e) || this.__addimage__.isArrayBufferView(e)) && (e = this.__addimage__.arrayBufferToBinaryString(e)), (d2 && this.__addimage__.isArrayBuffer(d2) || this.__addimage__.isArrayBufferView(d2)) && (d2 = this.__addimage__.arrayBufferToBinaryString(d2)), { alias: a3, data: e, index: i3, filter: L2, decodeParameters: A2, transparency: h3, palette: f3, sMask: d2, predictor: I2, width: u3.width, height: u3.height, bitsPerComponent: c3, colorSpace: s3 };
    }
  };
}(E.API), function(t2) {
  t2.processGIF89A = function(e, r, n2, i2) {
    var a2 = new Zt(e), o2 = a2.width, s2 = a2.height, c2 = [];
    a2.decodeAndBlitFrameRGBA(0, c2);
    var u2 = { data: c2, width: o2, height: s2 }, h2 = new Qt(100).encode(u2, 100);
    return t2.processJPEG.call(this, h2, r, n2, i2);
  }, t2.processGIF87A = t2.processGIF89A;
}(E.API), te.prototype.parseHeader = function() {
  if (this.fileSize = this.datav.getUint32(this.pos, true), this.pos += 4, this.reserved = this.datav.getUint32(this.pos, true), this.pos += 4, this.offset = this.datav.getUint32(this.pos, true), this.pos += 4, this.headerSize = this.datav.getUint32(this.pos, true), this.pos += 4, this.width = this.datav.getUint32(this.pos, true), this.pos += 4, this.height = this.datav.getInt32(this.pos, true), this.pos += 4, this.planes = this.datav.getUint16(this.pos, true), this.pos += 2, this.bitPP = this.datav.getUint16(this.pos, true), this.pos += 2, this.compress = this.datav.getUint32(this.pos, true), this.pos += 4, this.rawSize = this.datav.getUint32(this.pos, true), this.pos += 4, this.hr = this.datav.getUint32(this.pos, true), this.pos += 4, this.vr = this.datav.getUint32(this.pos, true), this.pos += 4, this.colors = this.datav.getUint32(this.pos, true), this.pos += 4, this.importantColors = this.datav.getUint32(this.pos, true), this.pos += 4, 16 === this.bitPP && this.is_with_alpha && (this.bitPP = 15), this.bitPP < 15) {
    var t2 = 0 === this.colors ? 1 << this.bitPP : this.colors;
    this.palette = new Array(t2);
    for (var e = 0; e < t2; e++) {
      var r = this.datav.getUint8(this.pos++, true), n2 = this.datav.getUint8(this.pos++, true), i2 = this.datav.getUint8(this.pos++, true), a2 = this.datav.getUint8(this.pos++, true);
      this.palette[e] = { red: i2, green: n2, blue: r, quad: a2 };
    }
  }
  this.height < 0 && (this.height *= -1, this.bottom_up = false);
}, te.prototype.parseBGR = function() {
  this.pos = this.offset;
  try {
    var t2 = "bit" + this.bitPP, e = this.width * this.height * 4;
    this.data = new Uint8Array(e), this[t2]();
  } catch (t3) {
    a.log("bit decode error:" + t3);
  }
}, te.prototype.bit1 = function() {
  var t2, e = Math.ceil(this.width / 8), r = e % 4;
  for (t2 = this.height - 1; t2 >= 0; t2--) {
    for (var n2 = this.bottom_up ? t2 : this.height - 1 - t2, i2 = 0; i2 < e; i2++) for (var a2 = this.datav.getUint8(this.pos++, true), o2 = n2 * this.width * 4 + 8 * i2 * 4, s2 = 0; s2 < 8 && 8 * i2 + s2 < this.width; s2++) {
      var c2 = this.palette[a2 >> 7 - s2 & 1];
      this.data[o2 + 4 * s2] = c2.blue, this.data[o2 + 4 * s2 + 1] = c2.green, this.data[o2 + 4 * s2 + 2] = c2.red, this.data[o2 + 4 * s2 + 3] = 255;
    }
    0 !== r && (this.pos += 4 - r);
  }
}, te.prototype.bit4 = function() {
  for (var t2 = Math.ceil(this.width / 2), e = t2 % 4, r = this.height - 1; r >= 0; r--) {
    for (var n2 = this.bottom_up ? r : this.height - 1 - r, i2 = 0; i2 < t2; i2++) {
      var a2 = this.datav.getUint8(this.pos++, true), o2 = n2 * this.width * 4 + 2 * i2 * 4, s2 = a2 >> 4, c2 = 15 & a2, u2 = this.palette[s2];
      if (this.data[o2] = u2.blue, this.data[o2 + 1] = u2.green, this.data[o2 + 2] = u2.red, this.data[o2 + 3] = 255, 2 * i2 + 1 >= this.width) break;
      u2 = this.palette[c2], this.data[o2 + 4] = u2.blue, this.data[o2 + 4 + 1] = u2.green, this.data[o2 + 4 + 2] = u2.red, this.data[o2 + 4 + 3] = 255;
    }
    0 !== e && (this.pos += 4 - e);
  }
}, te.prototype.bit8 = function() {
  for (var t2 = this.width % 4, e = this.height - 1; e >= 0; e--) {
    for (var r = this.bottom_up ? e : this.height - 1 - e, n2 = 0; n2 < this.width; n2++) {
      var i2 = this.datav.getUint8(this.pos++, true), a2 = r * this.width * 4 + 4 * n2;
      if (i2 < this.palette.length) {
        var o2 = this.palette[i2];
        this.data[a2] = o2.red, this.data[a2 + 1] = o2.green, this.data[a2 + 2] = o2.blue, this.data[a2 + 3] = 255;
      } else this.data[a2] = 255, this.data[a2 + 1] = 255, this.data[a2 + 2] = 255, this.data[a2 + 3] = 255;
    }
    0 !== t2 && (this.pos += 4 - t2);
  }
}, te.prototype.bit15 = function() {
  for (var t2 = this.width % 3, e = parseInt("11111", 2), r = this.height - 1; r >= 0; r--) {
    for (var n2 = this.bottom_up ? r : this.height - 1 - r, i2 = 0; i2 < this.width; i2++) {
      var a2 = this.datav.getUint16(this.pos, true);
      this.pos += 2;
      var o2 = (a2 & e) / e * 255 | 0, s2 = (a2 >> 5 & e) / e * 255 | 0, c2 = (a2 >> 10 & e) / e * 255 | 0, u2 = a2 >> 15 ? 255 : 0, h2 = n2 * this.width * 4 + 4 * i2;
      this.data[h2] = c2, this.data[h2 + 1] = s2, this.data[h2 + 2] = o2, this.data[h2 + 3] = u2;
    }
    this.pos += t2;
  }
}, te.prototype.bit16 = function() {
  for (var t2 = this.width % 3, e = parseInt("11111", 2), r = parseInt("111111", 2), n2 = this.height - 1; n2 >= 0; n2--) {
    for (var i2 = this.bottom_up ? n2 : this.height - 1 - n2, a2 = 0; a2 < this.width; a2++) {
      var o2 = this.datav.getUint16(this.pos, true);
      this.pos += 2;
      var s2 = (o2 & e) / e * 255 | 0, c2 = (o2 >> 5 & r) / r * 255 | 0, u2 = (o2 >> 11) / e * 255 | 0, h2 = i2 * this.width * 4 + 4 * a2;
      this.data[h2] = u2, this.data[h2 + 1] = c2, this.data[h2 + 2] = s2, this.data[h2 + 3] = 255;
    }
    this.pos += t2;
  }
}, te.prototype.bit24 = function() {
  for (var t2 = this.height - 1; t2 >= 0; t2--) {
    for (var e = this.bottom_up ? t2 : this.height - 1 - t2, r = 0; r < this.width; r++) {
      var n2 = this.datav.getUint8(this.pos++, true), i2 = this.datav.getUint8(this.pos++, true), a2 = this.datav.getUint8(this.pos++, true), o2 = e * this.width * 4 + 4 * r;
      this.data[o2] = a2, this.data[o2 + 1] = i2, this.data[o2 + 2] = n2, this.data[o2 + 3] = 255;
    }
    this.pos += this.width % 4;
  }
}, te.prototype.bit32 = function() {
  for (var t2 = this.height - 1; t2 >= 0; t2--) for (var e = this.bottom_up ? t2 : this.height - 1 - t2, r = 0; r < this.width; r++) {
    var n2 = this.datav.getUint8(this.pos++, true), i2 = this.datav.getUint8(this.pos++, true), a2 = this.datav.getUint8(this.pos++, true), o2 = this.datav.getUint8(this.pos++, true), s2 = e * this.width * 4 + 4 * r;
    this.data[s2] = a2, this.data[s2 + 1] = i2, this.data[s2 + 2] = n2, this.data[s2 + 3] = o2;
  }
}, te.prototype.getData = function() {
  return this.data;
}, /**
 * @license
 * Copyright (c) 2018 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  t2.processBMP = function(e, r, n2, i2) {
    var a2 = new te(e, false), o2 = a2.width, s2 = a2.height, c2 = { data: a2.getData(), width: o2, height: s2 }, u2 = new Qt(100).encode(c2, 100);
    return t2.processJPEG.call(this, u2, r, n2, i2);
  };
}(E.API), ee.prototype.getData = function() {
  return this.data;
}, /**
 * @license
 * Copyright (c) 2019 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  t2.processWEBP = function(e, r, n2, i2) {
    var a2 = new ee(e), o2 = a2.width, s2 = a2.height, c2 = { data: a2.getData(), width: o2, height: s2 }, u2 = new Qt(100).encode(c2, 100);
    return t2.processJPEG.call(this, u2, r, n2, i2);
  };
}(E.API), E.API.processRGBA = function(t2, e, r) {
  for (var n2 = t2.data, i2 = n2.length, a2 = new Uint8Array(i2 / 4 * 3), o2 = new Uint8Array(i2 / 4), s2 = 0, c2 = 0, u2 = 0; u2 < i2; u2 += 4) {
    var h2 = n2[u2], l2 = n2[u2 + 1], f2 = n2[u2 + 2], d2 = n2[u2 + 3];
    a2[s2++] = h2, a2[s2++] = l2, a2[s2++] = f2, o2[c2++] = d2;
  }
  var p2 = this.__addimage__.arrayBufferToBinaryString(a2);
  return { alpha: this.__addimage__.arrayBufferToBinaryString(o2), data: p2, index: e, alias: r, colorSpace: "DeviceRGB", bitsPerComponent: 8, width: t2.width, height: t2.height };
}, E.API.setLanguage = function(t2) {
  return void 0 === this.internal.languageSettings && (this.internal.languageSettings = {}, this.internal.languageSettings.isSubscribed = false), void 0 !== { af: "Afrikaans", sq: "Albanian", ar: "Arabic (Standard)", "ar-DZ": "Arabic (Algeria)", "ar-BH": "Arabic (Bahrain)", "ar-EG": "Arabic (Egypt)", "ar-IQ": "Arabic (Iraq)", "ar-JO": "Arabic (Jordan)", "ar-KW": "Arabic (Kuwait)", "ar-LB": "Arabic (Lebanon)", "ar-LY": "Arabic (Libya)", "ar-MA": "Arabic (Morocco)", "ar-OM": "Arabic (Oman)", "ar-QA": "Arabic (Qatar)", "ar-SA": "Arabic (Saudi Arabia)", "ar-SY": "Arabic (Syria)", "ar-TN": "Arabic (Tunisia)", "ar-AE": "Arabic (U.A.E.)", "ar-YE": "Arabic (Yemen)", an: "Aragonese", hy: "Armenian", as: "Assamese", ast: "Asturian", az: "Azerbaijani", eu: "Basque", be: "Belarusian", bn: "Bengali", bs: "Bosnian", br: "Breton", bg: "Bulgarian", my: "Burmese", ca: "Catalan", ch: "Chamorro", ce: "Chechen", zh: "Chinese", "zh-HK": "Chinese (Hong Kong)", "zh-CN": "Chinese (PRC)", "zh-SG": "Chinese (Singapore)", "zh-TW": "Chinese (Taiwan)", cv: "Chuvash", co: "Corsican", cr: "Cree", hr: "Croatian", cs: "Czech", da: "Danish", nl: "Dutch (Standard)", "nl-BE": "Dutch (Belgian)", en: "English", "en-AU": "English (Australia)", "en-BZ": "English (Belize)", "en-CA": "English (Canada)", "en-IE": "English (Ireland)", "en-JM": "English (Jamaica)", "en-NZ": "English (New Zealand)", "en-PH": "English (Philippines)", "en-ZA": "English (South Africa)", "en-TT": "English (Trinidad & Tobago)", "en-GB": "English (United Kingdom)", "en-US": "English (United States)", "en-ZW": "English (Zimbabwe)", eo: "Esperanto", et: "Estonian", fo: "Faeroese", fj: "Fijian", fi: "Finnish", fr: "French (Standard)", "fr-BE": "French (Belgium)", "fr-CA": "French (Canada)", "fr-FR": "French (France)", "fr-LU": "French (Luxembourg)", "fr-MC": "French (Monaco)", "fr-CH": "French (Switzerland)", fy: "Frisian", fur: "Friulian", gd: "Gaelic (Scots)", "gd-IE": "Gaelic (Irish)", gl: "Galacian", ka: "Georgian", de: "German (Standard)", "de-AT": "German (Austria)", "de-DE": "German (Germany)", "de-LI": "German (Liechtenstein)", "de-LU": "German (Luxembourg)", "de-CH": "German (Switzerland)", el: "Greek", gu: "Gujurati", ht: "Haitian", he: "Hebrew", hi: "Hindi", hu: "Hungarian", is: "Icelandic", id: "Indonesian", iu: "Inuktitut", ga: "Irish", it: "Italian (Standard)", "it-CH": "Italian (Switzerland)", ja: "Japanese", kn: "Kannada", ks: "Kashmiri", kk: "Kazakh", km: "Khmer", ky: "Kirghiz", tlh: "Klingon", ko: "Korean", "ko-KP": "Korean (North Korea)", "ko-KR": "Korean (South Korea)", la: "Latin", lv: "Latvian", lt: "Lithuanian", lb: "Luxembourgish", mk: "North Macedonia", ms: "Malay", ml: "Malayalam", mt: "Maltese", mi: "Maori", mr: "Marathi", mo: "Moldavian", nv: "Navajo", ng: "Ndonga", ne: "Nepali", no: "Norwegian", nb: "Norwegian (Bokmal)", nn: "Norwegian (Nynorsk)", oc: "Occitan", or: "Oriya", om: "Oromo", fa: "Persian", "fa-IR": "Persian/Iran", pl: "Polish", pt: "Portuguese", "pt-BR": "Portuguese (Brazil)", pa: "Punjabi", "pa-IN": "Punjabi (India)", "pa-PK": "Punjabi (Pakistan)", qu: "Quechua", rm: "Rhaeto-Romanic", ro: "Romanian", "ro-MO": "Romanian (Moldavia)", ru: "Russian", "ru-MO": "Russian (Moldavia)", sz: "Sami (Lappish)", sg: "Sango", sa: "Sanskrit", sc: "Sardinian", sd: "Sindhi", si: "Singhalese", sr: "Serbian", sk: "Slovak", sl: "Slovenian", so: "Somani", sb: "Sorbian", es: "Spanish", "es-AR": "Spanish (Argentina)", "es-BO": "Spanish (Bolivia)", "es-CL": "Spanish (Chile)", "es-CO": "Spanish (Colombia)", "es-CR": "Spanish (Costa Rica)", "es-DO": "Spanish (Dominican Republic)", "es-EC": "Spanish (Ecuador)", "es-SV": "Spanish (El Salvador)", "es-GT": "Spanish (Guatemala)", "es-HN": "Spanish (Honduras)", "es-MX": "Spanish (Mexico)", "es-NI": "Spanish (Nicaragua)", "es-PA": "Spanish (Panama)", "es-PY": "Spanish (Paraguay)", "es-PE": "Spanish (Peru)", "es-PR": "Spanish (Puerto Rico)", "es-ES": "Spanish (Spain)", "es-UY": "Spanish (Uruguay)", "es-VE": "Spanish (Venezuela)", sx: "Sutu", sw: "Swahili", sv: "Swedish", "sv-FI": "Swedish (Finland)", "sv-SV": "Swedish (Sweden)", ta: "Tamil", tt: "Tatar", te: "Teluga", th: "Thai", tig: "Tigre", ts: "Tsonga", tn: "Tswana", tr: "Turkish", tk: "Turkmen", uk: "Ukrainian", hsb: "Upper Sorbian", ur: "Urdu", ve: "Venda", vi: "Vietnamese", vo: "Volapuk", wa: "Walloon", cy: "Welsh", xh: "Xhosa", ji: "Yiddish", zu: "Zulu" }[t2] && (this.internal.languageSettings.languageCode = t2, false === this.internal.languageSettings.isSubscribed && (this.internal.events.subscribe("putCatalog", function() {
    this.internal.write("/Lang (" + this.internal.languageSettings.languageCode + ")");
  }), this.internal.languageSettings.isSubscribed = true)), this;
}, Vt = E.API, Gt = Vt.getCharWidthsArray = function(e, r) {
  var n2, i2, a2 = (r = r || {}).font || this.internal.getFont(), o2 = r.fontSize || this.internal.getFontSize(), s2 = r.charSpace || this.internal.getCharSpace(), c2 = r.widths ? r.widths : a2.metadata.Unicode.widths, u2 = c2.fof ? c2.fof : 1, h2 = r.kerning ? r.kerning : a2.metadata.Unicode.kerning, l2 = h2.fof ? h2.fof : 1, f2 = false !== r.doKerning, d2 = 0, p2 = e.length, g2 = 0, m2 = c2[0] || u2, v2 = [];
  for (n2 = 0; n2 < p2; n2++) i2 = e.charCodeAt(n2), "function" == typeof a2.metadata.widthOfString ? v2.push((a2.metadata.widthOfGlyph(a2.metadata.characterToGlyph(i2)) + s2 * (1e3 / o2) || 0) / 1e3) : (d2 = f2 && "object" === _typeof(h2[i2]) && !isNaN(parseInt(h2[i2][g2], 10)) ? h2[i2][g2] / l2 : 0, v2.push((c2[i2] || m2) / u2 + d2)), g2 = i2;
  return v2;
}, Yt = Vt.getStringUnitWidth = function(t2, e) {
  var r = (e = e || {}).fontSize || this.internal.getFontSize(), n2 = e.font || this.internal.getFont(), i2 = e.charSpace || this.internal.getCharSpace();
  return Vt.processArabic && (t2 = Vt.processArabic(t2)), "function" == typeof n2.metadata.widthOfString ? n2.metadata.widthOfString(t2, r, i2) / r : Gt.apply(this, arguments).reduce(function(t3, e2) {
    return t3 + e2;
  }, 0);
}, Jt = function(t2, e, r, n2) {
  for (var i2 = [], a2 = 0, o2 = t2.length, s2 = 0; a2 !== o2 && s2 + e[a2] < r; ) s2 += e[a2], a2++;
  i2.push(t2.slice(0, a2));
  var c2 = a2;
  for (s2 = 0; a2 !== o2; ) s2 + e[a2] > n2 && (i2.push(t2.slice(c2, a2)), s2 = 0, c2 = a2), s2 += e[a2], a2++;
  return c2 !== a2 && i2.push(t2.slice(c2, a2)), i2;
}, Xt = function(t2, e, r) {
  r || (r = {});
  var n2, i2, a2, o2, s2, c2, u2, h2 = [], l2 = [h2], f2 = r.textIndent || 0, d2 = 0, p2 = 0, g2 = t2.split(" "), m2 = Gt.apply(this, [" ", r])[0];
  if (c2 = -1 === r.lineIndent ? g2[0].length + 2 : r.lineIndent || 0) {
    var v2 = Array(c2).join(" "), b2 = [];
    g2.map(function(t3) {
      (t3 = t3.split(/\s*\n/)).length > 1 ? b2 = b2.concat(t3.map(function(t4, e2) {
        return (e2 && t4.length ? "\n" : "") + t4;
      })) : b2.push(t3[0]);
    }), g2 = b2, c2 = Yt.apply(this, [v2, r]);
  }
  for (a2 = 0, o2 = g2.length; a2 < o2; a2++) {
    var y2 = 0;
    if (n2 = g2[a2], c2 && "\n" == n2[0] && (n2 = n2.substr(1), y2 = 1), f2 + d2 + (p2 = (i2 = Gt.apply(this, [n2, r])).reduce(function(t3, e2) {
      return t3 + e2;
    }, 0)) > e || y2) {
      if (p2 > e) {
        for (s2 = Jt.apply(this, [n2, i2, e - (f2 + d2), e]), h2.push(s2.shift()), h2 = [s2.pop()]; s2.length; ) l2.push([s2.shift()]);
        p2 = i2.slice(n2.length - (h2[0] ? h2[0].length : 0)).reduce(function(t3, e2) {
          return t3 + e2;
        }, 0);
      } else h2 = [n2];
      l2.push(h2), f2 = p2 + c2, d2 = m2;
    } else h2.push(n2), f2 += d2 + p2, d2 = m2;
  }
  return u2 = c2 ? function(t3, e2) {
    return (e2 ? v2 : "") + t3.join(" ");
  } : function(t3) {
    return t3.join(" ");
  }, l2.map(u2);
}, Vt.splitTextToSize = function(t2, e, r) {
  var n2, i2 = (r = r || {}).fontSize || this.internal.getFontSize(), a2 = function(t3) {
    if (t3.widths && t3.kerning) return { widths: t3.widths, kerning: t3.kerning };
    var e2 = this.internal.getFont(t3.fontName, t3.fontStyle);
    return e2.metadata.Unicode ? { widths: e2.metadata.Unicode.widths || { 0: 1 }, kerning: e2.metadata.Unicode.kerning || {} } : { font: e2.metadata, fontSize: this.internal.getFontSize(), charSpace: this.internal.getCharSpace() };
  }.call(this, r);
  n2 = Array.isArray(t2) ? t2 : String(t2).split(/\r?\n/);
  var o2 = 1 * this.internal.scaleFactor * e / i2;
  a2.textIndent = r.textIndent ? 1 * r.textIndent * this.internal.scaleFactor / i2 : 0, a2.lineIndent = r.lineIndent;
  var s2, c2, u2 = [];
  for (s2 = 0, c2 = n2.length; s2 < c2; s2++) u2 = u2.concat(Xt.apply(this, [n2[s2], o2, a2]));
  return u2;
}, function(e) {
  e.__fontmetrics__ = e.__fontmetrics__ || {};
  for (var r = "klmnopqrstuvwxyz", n2 = {}, i2 = {}, a2 = 0; a2 < r.length; a2++) n2[r[a2]] = "0123456789abcdef"[a2], i2["0123456789abcdef"[a2]] = r[a2];
  var o2 = function(t2) {
    return "0x" + parseInt(t2, 10).toString(16);
  }, s2 = e.__fontmetrics__.compress = function(e2) {
    var r2, n3, a3, c3, u3 = ["{"];
    for (var h3 in e2) {
      if (r2 = e2[h3], isNaN(parseInt(h3, 10)) ? n3 = "'" + h3 + "'" : (h3 = parseInt(h3, 10), n3 = (n3 = o2(h3).slice(2)).slice(0, -1) + i2[n3.slice(-1)]), "number" == typeof r2) r2 < 0 ? (a3 = o2(r2).slice(3), c3 = "-") : (a3 = o2(r2).slice(2), c3 = ""), a3 = c3 + a3.slice(0, -1) + i2[a3.slice(-1)];
      else {
        if ("object" !== _typeof(r2)) throw new Error("Don't know what to do with value type " + _typeof(r2) + ".");
        a3 = s2(r2);
      }
      u3.push(n3 + a3);
    }
    return u3.push("}"), u3.join("");
  }, c2 = e.__fontmetrics__.uncompress = function(t2) {
    if ("string" != typeof t2) throw new Error("Invalid argument passed to uncompress.");
    for (var e2, r2, i3, a3, o3 = {}, s3 = 1, c3 = o3, u3 = [], h3 = "", l3 = "", f2 = t2.length - 1, d2 = 1; d2 < f2; d2 += 1) "'" == (a3 = t2[d2]) ? e2 ? (i3 = e2.join(""), e2 = void 0) : e2 = [] : e2 ? e2.push(a3) : "{" == a3 ? (u3.push([c3, i3]), c3 = {}, i3 = void 0) : "}" == a3 ? ((r2 = u3.pop())[0][r2[1]] = c3, i3 = void 0, c3 = r2[0]) : "-" == a3 ? s3 = -1 : void 0 === i3 ? n2.hasOwnProperty(a3) ? (h3 += n2[a3], i3 = parseInt(h3, 16) * s3, s3 = 1, h3 = "") : h3 += a3 : n2.hasOwnProperty(a3) ? (l3 += n2[a3], c3[i3] = parseInt(l3, 16) * s3, s3 = 1, i3 = void 0, l3 = "") : l3 += a3;
    return o3;
  }, u2 = { codePages: ["WinAnsiEncoding"], WinAnsiEncoding: c2("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}") }, h2 = { Unicode: { Courier: u2, "Courier-Bold": u2, "Courier-BoldOblique": u2, "Courier-Oblique": u2, Helvetica: u2, "Helvetica-Bold": u2, "Helvetica-BoldOblique": u2, "Helvetica-Oblique": u2, "Times-Roman": u2, "Times-Bold": u2, "Times-BoldItalic": u2, "Times-Italic": u2 } }, l2 = { Unicode: { "Courier-Oblique": c2("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"), "Times-BoldItalic": c2("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"), "Helvetica-Bold": c2("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"), Courier: c2("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"), "Courier-BoldOblique": c2("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"), "Times-Bold": c2("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}"), Symbol: c2("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}"), Helvetica: c2("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"), "Helvetica-BoldOblique": c2("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"), ZapfDingbats: c2("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}"), "Courier-Bold": c2("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"), "Times-Italic": c2("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"), "Times-Roman": c2("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"), "Helvetica-Oblique": c2("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}") } };
  e.events.push(["addFont", function(t2) {
    var e2 = t2.font, r2 = l2.Unicode[e2.postScriptName];
    r2 && (e2.metadata.Unicode = {}, e2.metadata.Unicode.widths = r2.widths, e2.metadata.Unicode.kerning = r2.kerning);
    var n3 = h2.Unicode[e2.postScriptName];
    n3 && (e2.metadata.Unicode.encoding = n3, e2.encoding = n3.codePages[0]);
  }]);
}(E.API), /**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e = function(t3) {
    for (var e2 = t3.length, r = new Uint8Array(e2), n2 = 0; n2 < e2; n2++) r[n2] = t3.charCodeAt(n2);
    return r;
  };
  t2.API.events.push(["addFont", function(r) {
    var n2 = void 0, i2 = r.font, a2 = r.instance;
    if (!i2.isStandardFont) {
      if (void 0 === a2) throw new Error("Font does not exist in vFS, import fonts or remove declaration doc.addFont('" + i2.postScriptName + "').");
      if ("string" != typeof (n2 = false === a2.existsFileInVFS(i2.postScriptName) ? a2.loadFile(i2.postScriptName) : a2.getFileFromVFS(i2.postScriptName))) throw new Error("Font is not stored as string-data in vFS, import fonts or remove declaration doc.addFont('" + i2.postScriptName + "').");
      !function(r2, n3) {
        n3 = /^\x00\x01\x00\x00/.test(n3) ? e(n3) : e(u(n3)), r2.metadata = t2.API.TTFFont.open(n3), r2.metadata.Unicode = r2.metadata.Unicode || { encoding: {}, kerning: {}, widths: [] }, r2.metadata.glyIdsUsed = [0];
      }(i2, n2);
    }
  }]);
}(E), /** @license
 * Copyright (c) 2012 Willow Systems Corporation, https://github.com/willowsystems
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
function(t2) {
  function e() {
    return (n.canvg ? Promise.resolve(n.canvg) : import("./index.es-D_pw2myT.js")).catch(function(t3) {
      return Promise.reject(new Error("Could not load canvg: " + t3));
    }).then(function(t3) {
      return t3.default ? t3.default : t3;
    });
  }
  E.API.addSvgAsImage = function(t3, r, n2, i2, o2, s2, c2, u2) {
    if (isNaN(r) || isNaN(n2)) throw a.error("jsPDF.addSvgAsImage: Invalid coordinates", arguments), new Error("Invalid coordinates passed to jsPDF.addSvgAsImage");
    if (isNaN(i2) || isNaN(o2)) throw a.error("jsPDF.addSvgAsImage: Invalid measurements", arguments), new Error("Invalid measurements (width and/or height) passed to jsPDF.addSvgAsImage");
    var h2 = document.createElement("canvas");
    h2.width = i2, h2.height = o2;
    var l2 = h2.getContext("2d");
    l2.fillStyle = "#fff", l2.fillRect(0, 0, h2.width, h2.height);
    var f2 = { ignoreMouse: true, ignoreAnimation: true, ignoreDimensions: true }, d2 = this;
    return e().then(function(e2) {
      return e2.fromString(l2, t3, f2);
    }, function() {
      return Promise.reject(new Error("Could not load canvg."));
    }).then(function(t4) {
      return t4.render(f2);
    }).then(function() {
      d2.addImage(h2.toDataURL("image/jpeg", 1), r, n2, i2, o2, c2, u2);
    });
  };
}(), E.API.putTotalPages = function(t2) {
  var e, r = 0;
  parseInt(this.internal.getFont().id.substr(1), 10) < 15 ? (e = new RegExp(t2, "g"), r = this.internal.getNumberOfPages()) : (e = new RegExp(this.pdfEscape16(t2, this.internal.getFont()), "g"), r = this.pdfEscape16(this.internal.getNumberOfPages() + "", this.internal.getFont()));
  for (var n2 = 1; n2 <= this.internal.getNumberOfPages(); n2++) for (var i2 = 0; i2 < this.internal.pages[n2].length; i2++) this.internal.pages[n2][i2] = this.internal.pages[n2][i2].replace(e, r);
  return this;
}, E.API.viewerPreferences = function(e, r) {
  var n2;
  e = e || {}, r = r || false;
  var i2, a2, o2, s2 = { HideToolbar: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 }, HideMenubar: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 }, HideWindowUI: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 }, FitWindow: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 }, CenterWindow: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 }, DisplayDocTitle: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.4 }, NonFullScreenPageMode: { defaultValue: "UseNone", value: "UseNone", type: "name", explicitSet: false, valueSet: ["UseNone", "UseOutlines", "UseThumbs", "UseOC"], pdfVersion: 1.3 }, Direction: { defaultValue: "L2R", value: "L2R", type: "name", explicitSet: false, valueSet: ["L2R", "R2L"], pdfVersion: 1.3 }, ViewArea: { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 }, ViewClip: { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 }, PrintArea: { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 }, PrintClip: { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 }, PrintScaling: { defaultValue: "AppDefault", value: "AppDefault", type: "name", explicitSet: false, valueSet: ["AppDefault", "None"], pdfVersion: 1.6 }, Duplex: { defaultValue: "", value: "none", type: "name", explicitSet: false, valueSet: ["Simplex", "DuplexFlipShortEdge", "DuplexFlipLongEdge", "none"], pdfVersion: 1.7 }, PickTrayByPDFSize: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.7 }, PrintPageRange: { defaultValue: "", value: "", type: "array", explicitSet: false, valueSet: null, pdfVersion: 1.7 }, NumCopies: { defaultValue: 1, value: 1, type: "integer", explicitSet: false, valueSet: null, pdfVersion: 1.7 } }, c2 = Object.keys(s2), u2 = [], h2 = 0, l2 = 0, f2 = 0;
  function d2(t2, e2) {
    var r2, n3 = false;
    for (r2 = 0; r2 < t2.length; r2 += 1) t2[r2] === e2 && (n3 = true);
    return n3;
  }
  if (void 0 === this.internal.viewerpreferences && (this.internal.viewerpreferences = {}, this.internal.viewerpreferences.configuration = JSON.parse(JSON.stringify(s2)), this.internal.viewerpreferences.isSubscribed = false), n2 = this.internal.viewerpreferences.configuration, "reset" === e || true === r) {
    var p2 = c2.length;
    for (f2 = 0; f2 < p2; f2 += 1) n2[c2[f2]].value = n2[c2[f2]].defaultValue, n2[c2[f2]].explicitSet = false;
  }
  if ("object" === _typeof(e)) {
    for (a2 in e) if (o2 = e[a2], d2(c2, a2) && void 0 !== o2) {
      if ("boolean" === n2[a2].type && "boolean" == typeof o2) n2[a2].value = o2;
      else if ("name" === n2[a2].type && d2(n2[a2].valueSet, o2)) n2[a2].value = o2;
      else if ("integer" === n2[a2].type && Number.isInteger(o2)) n2[a2].value = o2;
      else if ("array" === n2[a2].type) {
        for (h2 = 0; h2 < o2.length; h2 += 1) if (i2 = true, 1 === o2[h2].length && "number" == typeof o2[h2][0]) u2.push(String(o2[h2] - 1));
        else if (o2[h2].length > 1) {
          for (l2 = 0; l2 < o2[h2].length; l2 += 1) "number" != typeof o2[h2][l2] && (i2 = false);
          true === i2 && u2.push([o2[h2][0] - 1, o2[h2][1] - 1].join(" "));
        }
        n2[a2].value = "[" + u2.join(" ") + "]";
      } else n2[a2].value = n2[a2].defaultValue;
      n2[a2].explicitSet = true;
    }
  }
  return false === this.internal.viewerpreferences.isSubscribed && (this.internal.events.subscribe("putCatalog", function() {
    var t2, e2 = [];
    for (t2 in n2) true === n2[t2].explicitSet && ("name" === n2[t2].type ? e2.push("/" + t2 + " /" + n2[t2].value) : e2.push("/" + t2 + " " + n2[t2].value));
    0 !== e2.length && this.internal.write("/ViewerPreferences\n<<\n" + e2.join("\n") + "\n>>");
  }), this.internal.viewerpreferences.isSubscribed = true), this.internal.viewerpreferences.configuration = n2, this;
}, /** ====================================================================
 * @license
 * jsPDF XMP metadata plugin
 * Copyright (c) 2016 Jussi Utunen, u-jussi@suomi24.fi
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
function(t2) {
  var e = function() {
    var t3 = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:jspdf="' + this.internal.__metadata__.namespaceuri + '"><jspdf:metadata>', e2 = unescape(encodeURIComponent('<x:xmpmeta xmlns:x="adobe:ns:meta/">')), r2 = unescape(encodeURIComponent(t3)), n2 = unescape(encodeURIComponent(this.internal.__metadata__.metadata)), i2 = unescape(encodeURIComponent("</jspdf:metadata></rdf:Description></rdf:RDF>")), a2 = unescape(encodeURIComponent("</x:xmpmeta>")), o2 = r2.length + n2.length + i2.length + e2.length + a2.length;
    this.internal.__metadata__.metadata_object_number = this.internal.newObject(), this.internal.write("<< /Type /Metadata /Subtype /XML /Length " + o2 + " >>"), this.internal.write("stream"), this.internal.write(e2 + r2 + n2 + i2 + a2), this.internal.write("endstream"), this.internal.write("endobj");
  }, r = function() {
    this.internal.__metadata__.metadata_object_number && this.internal.write("/Metadata " + this.internal.__metadata__.metadata_object_number + " 0 R");
  };
  t2.addMetadata = function(t3, n2) {
    return void 0 === this.internal.__metadata__ && (this.internal.__metadata__ = { metadata: t3, namespaceuri: n2 || "http://jspdf.default.namespaceuri/" }, this.internal.events.subscribe("putCatalog", r), this.internal.events.subscribe("postPutResources", e)), this;
  };
}(E.API), function(t2) {
  var e = t2.API, r = e.pdfEscape16 = function(t3, e2) {
    for (var r2, n3 = e2.metadata.Unicode.widths, i3 = ["", "0", "00", "000", "0000"], a2 = [""], o2 = 0, s2 = t3.length; o2 < s2; ++o2) {
      if (r2 = e2.metadata.characterToGlyph(t3.charCodeAt(o2)), e2.metadata.glyIdsUsed.push(r2), e2.metadata.toUnicode[r2] = t3.charCodeAt(o2), -1 == n3.indexOf(r2) && (n3.push(r2), n3.push([parseInt(e2.metadata.widthOfGlyph(r2), 10)])), "0" == r2) return a2.join("");
      r2 = r2.toString(16), a2.push(i3[4 - r2.length], r2);
    }
    return a2.join("");
  }, n2 = function(t3) {
    var e2, r2, n3, i3, a2, o2, s2;
    for (a2 = "/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000><ffff>\nendcodespacerange", n3 = [], o2 = 0, s2 = (r2 = Object.keys(t3).sort(function(t4, e3) {
      return t4 - e3;
    })).length; o2 < s2; o2++) e2 = r2[o2], n3.length >= 100 && (a2 += "\n" + n3.length + " beginbfchar\n" + n3.join("\n") + "\nendbfchar", n3 = []), void 0 !== t3[e2] && null !== t3[e2] && "function" == typeof t3[e2].toString && (i3 = ("0000" + t3[e2].toString(16)).slice(-4), e2 = ("0000" + (+e2).toString(16)).slice(-4), n3.push("<" + e2 + "><" + i3 + ">"));
    return n3.length && (a2 += "\n" + n3.length + " beginbfchar\n" + n3.join("\n") + "\nendbfchar\n"), a2 += "endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend";
  };
  e.events.push(["putFont", function(e2) {
    !function(e3) {
      var r2 = e3.font, i3 = e3.out, a2 = e3.newObject, o2 = e3.putStream;
      if (r2.metadata instanceof t2.API.TTFFont && "Identity-H" === r2.encoding) {
        for (var s2 = r2.metadata.Unicode.widths, c2 = r2.metadata.subset.encode(r2.metadata.glyIdsUsed, 1), u2 = "", h2 = 0; h2 < c2.length; h2++) u2 += String.fromCharCode(c2[h2]);
        var l2 = a2();
        o2({ data: u2, addLength1: true, objectId: l2 }), i3("endobj");
        var f2 = a2();
        o2({ data: n2(r2.metadata.toUnicode), addLength1: true, objectId: f2 }), i3("endobj");
        var d2 = a2();
        i3("<<"), i3("/Type /FontDescriptor"), i3("/FontName /" + F(r2.fontName)), i3("/FontFile2 " + l2 + " 0 R"), i3("/FontBBox " + t2.API.PDFObject.convert(r2.metadata.bbox)), i3("/Flags " + r2.metadata.flags), i3("/StemV " + r2.metadata.stemV), i3("/ItalicAngle " + r2.metadata.italicAngle), i3("/Ascent " + r2.metadata.ascender), i3("/Descent " + r2.metadata.decender), i3("/CapHeight " + r2.metadata.capHeight), i3(">>"), i3("endobj");
        var p2 = a2();
        i3("<<"), i3("/Type /Font"), i3("/BaseFont /" + F(r2.fontName)), i3("/FontDescriptor " + d2 + " 0 R"), i3("/W " + t2.API.PDFObject.convert(s2)), i3("/CIDToGIDMap /Identity"), i3("/DW 1000"), i3("/Subtype /CIDFontType2"), i3("/CIDSystemInfo"), i3("<<"), i3("/Supplement 0"), i3("/Registry (Adobe)"), i3("/Ordering (" + r2.encoding + ")"), i3(">>"), i3(">>"), i3("endobj"), r2.objectNumber = a2(), i3("<<"), i3("/Type /Font"), i3("/Subtype /Type0"), i3("/ToUnicode " + f2 + " 0 R"), i3("/BaseFont /" + F(r2.fontName)), i3("/Encoding /" + r2.encoding), i3("/DescendantFonts [" + p2 + " 0 R]"), i3(">>"), i3("endobj"), r2.isAlreadyPutted = true;
      }
    }(e2);
  }]);
  e.events.push(["putFont", function(e2) {
    !function(e3) {
      var r2 = e3.font, i3 = e3.out, a2 = e3.newObject, o2 = e3.putStream;
      if (r2.metadata instanceof t2.API.TTFFont && "WinAnsiEncoding" === r2.encoding) {
        for (var s2 = r2.metadata.rawData, c2 = "", u2 = 0; u2 < s2.length; u2++) c2 += String.fromCharCode(s2[u2]);
        var h2 = a2();
        o2({ data: c2, addLength1: true, objectId: h2 }), i3("endobj");
        var l2 = a2();
        o2({ data: n2(r2.metadata.toUnicode), addLength1: true, objectId: l2 }), i3("endobj");
        var f2 = a2();
        i3("<<"), i3("/Descent " + r2.metadata.decender), i3("/CapHeight " + r2.metadata.capHeight), i3("/StemV " + r2.metadata.stemV), i3("/Type /FontDescriptor"), i3("/FontFile2 " + h2 + " 0 R"), i3("/Flags 96"), i3("/FontBBox " + t2.API.PDFObject.convert(r2.metadata.bbox)), i3("/FontName /" + F(r2.fontName)), i3("/ItalicAngle " + r2.metadata.italicAngle), i3("/Ascent " + r2.metadata.ascender), i3(">>"), i3("endobj"), r2.objectNumber = a2();
        for (var d2 = 0; d2 < r2.metadata.hmtx.widths.length; d2++) r2.metadata.hmtx.widths[d2] = parseInt(r2.metadata.hmtx.widths[d2] * (1e3 / r2.metadata.head.unitsPerEm));
        i3("<</Subtype/TrueType/Type/Font/ToUnicode " + l2 + " 0 R/BaseFont/" + F(r2.fontName) + "/FontDescriptor " + f2 + " 0 R/Encoding/" + r2.encoding + " /FirstChar 29 /LastChar 255 /Widths " + t2.API.PDFObject.convert(r2.metadata.hmtx.widths) + ">>"), i3("endobj"), r2.isAlreadyPutted = true;
      }
    }(e2);
  }]);
  var i2 = function(t3) {
    var e2, n3 = t3.text || "", i3 = t3.x, a2 = t3.y, o2 = t3.options || {}, s2 = t3.mutex || {}, c2 = s2.pdfEscape, u2 = s2.activeFontKey, h2 = s2.fonts, l2 = u2, f2 = "", d2 = 0, p2 = "", g2 = h2[l2].encoding;
    if ("Identity-H" !== h2[l2].encoding) return { text: n3, x: i3, y: a2, options: o2, mutex: s2 };
    for (p2 = n3, l2 = u2, Array.isArray(n3) && (p2 = n3[0]), d2 = 0; d2 < p2.length; d2 += 1) h2[l2].metadata.hasOwnProperty("cmap") && (e2 = h2[l2].metadata.cmap.unicode.codeMap[p2[d2].charCodeAt(0)]), e2 || p2[d2].charCodeAt(0) < 256 && h2[l2].metadata.hasOwnProperty("Unicode") ? f2 += p2[d2] : f2 += "";
    var m2 = "";
    return parseInt(l2.slice(1)) < 14 || "WinAnsiEncoding" === g2 ? m2 = c2(f2, l2).split("").map(function(t4) {
      return t4.charCodeAt(0).toString(16);
    }).join("") : "Identity-H" === g2 && (m2 = r(f2, h2[l2])), s2.isHex = true, { text: m2, x: i3, y: a2, options: o2, mutex: s2 };
  };
  e.events.push(["postProcessText", function(t3) {
    var e2 = t3.text || "", r2 = [], n3 = { text: e2, x: t3.x, y: t3.y, options: t3.options, mutex: t3.mutex };
    if (Array.isArray(e2)) {
      var a2 = 0;
      for (a2 = 0; a2 < e2.length; a2 += 1) Array.isArray(e2[a2]) && 3 === e2[a2].length ? r2.push([i2(Object.assign({}, n3, { text: e2[a2][0] })).text, e2[a2][1], e2[a2][2]]) : r2.push(i2(Object.assign({}, n3, { text: e2[a2] })).text);
      t3.text = r2;
    } else t3.text = i2(Object.assign({}, n3, { text: e2 })).text;
  }]);
}(E), /**
 * @license
 * jsPDF virtual FileSystem functionality
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e = function() {
    return void 0 === this.internal.vFS && (this.internal.vFS = {}), true;
  };
  t2.existsFileInVFS = function(t3) {
    return e.call(this), void 0 !== this.internal.vFS[t3];
  }, t2.addFileToVFS = function(t3, r) {
    return e.call(this), this.internal.vFS[t3] = r, this;
  }, t2.getFileFromVFS = function(t3) {
    return e.call(this), void 0 !== this.internal.vFS[t3] ? this.internal.vFS[t3] : null;
  };
}(E.API), /**
 * @license
 * Unicode Bidi Engine based on the work of Alex Shensis (@asthensis)
 * MIT License
 */
function(t2) {
  t2.__bidiEngine__ = t2.prototype.__bidiEngine__ = function(t3) {
    var r2, n2, i2, a2, o2, s2, c2, u2 = e, h2 = [[0, 3, 0, 1, 0, 0, 0], [0, 3, 0, 1, 2, 2, 0], [0, 3, 0, 17, 2, 0, 1], [0, 3, 5, 5, 4, 1, 0], [0, 3, 21, 21, 4, 0, 1], [0, 3, 5, 5, 4, 2, 0]], l2 = [[2, 0, 1, 1, 0, 1, 0], [2, 0, 1, 1, 0, 2, 0], [2, 0, 2, 1, 3, 2, 0], [2, 0, 2, 33, 3, 1, 1]], f2 = { L: 0, R: 1, EN: 2, AN: 3, N: 4, B: 5, S: 6 }, d2 = { 0: 0, 5: 1, 6: 2, 7: 3, 32: 4, 251: 5, 254: 6, 255: 7 }, p2 = ["(", ")", "(", "<", ">", "<", "[", "]", "[", "{", "}", "{", "«", "»", "«", "‹", "›", "‹", "⁅", "⁆", "⁅", "⁽", "⁾", "⁽", "₍", "₎", "₍", "≤", "≥", "≤", "〈", "〉", "〈", "﹙", "﹚", "﹙", "﹛", "﹜", "﹛", "﹝", "﹞", "﹝", "﹤", "﹥", "﹤"], g2 = new RegExp(/^([1-4|9]|1[0-9]|2[0-9]|3[0168]|4[04589]|5[012]|7[78]|159|16[0-9]|17[0-2]|21[569]|22[03489]|250)$/), m2 = false, v2 = 0;
    this.__bidiEngine__ = {};
    var b2 = function(t4) {
      var e2 = t4.charCodeAt(), r3 = e2 >> 8, n3 = d2[r3];
      return void 0 !== n3 ? u2[256 * n3 + (255 & e2)] : 252 === r3 || 253 === r3 ? "AL" : g2.test(r3) ? "L" : 8 === r3 ? "R" : "N";
    }, y2 = function(t4) {
      for (var e2, r3 = 0; r3 < t4.length; r3++) {
        if ("L" === (e2 = b2(t4.charAt(r3)))) return false;
        if ("R" === e2) return true;
      }
      return false;
    }, w2 = function(t4, e2, o3, s3) {
      var c3, u3, h3, l3, f3 = e2[s3];
      switch (f3) {
        case "L":
        case "R":
          m2 = false;
          break;
        case "N":
        case "AN":
          break;
        case "EN":
          m2 && (f3 = "AN");
          break;
        case "AL":
          m2 = true, f3 = "R";
          break;
        case "WS":
          f3 = "N";
          break;
        case "CS":
          s3 < 1 || s3 + 1 >= e2.length || "EN" !== (c3 = o3[s3 - 1]) && "AN" !== c3 || "EN" !== (u3 = e2[s3 + 1]) && "AN" !== u3 ? f3 = "N" : m2 && (u3 = "AN"), f3 = u3 === c3 ? u3 : "N";
          break;
        case "ES":
          f3 = "EN" === (c3 = s3 > 0 ? o3[s3 - 1] : "B") && s3 + 1 < e2.length && "EN" === e2[s3 + 1] ? "EN" : "N";
          break;
        case "ET":
          if (s3 > 0 && "EN" === o3[s3 - 1]) {
            f3 = "EN";
            break;
          }
          if (m2) {
            f3 = "N";
            break;
          }
          for (h3 = s3 + 1, l3 = e2.length; h3 < l3 && "ET" === e2[h3]; ) h3++;
          f3 = h3 < l3 && "EN" === e2[h3] ? "EN" : "N";
          break;
        case "NSM":
          if (i2 && !a2) {
            for (l3 = e2.length, h3 = s3 + 1; h3 < l3 && "NSM" === e2[h3]; ) h3++;
            if (h3 < l3) {
              var d3 = t4[s3], p3 = d3 >= 1425 && d3 <= 2303 || 64286 === d3;
              if (c3 = e2[h3], p3 && ("R" === c3 || "AL" === c3)) {
                f3 = "R";
                break;
              }
            }
          }
          f3 = s3 < 1 || "B" === (c3 = e2[s3 - 1]) ? "N" : o3[s3 - 1];
          break;
        case "B":
          m2 = false, r2 = true, f3 = v2;
          break;
        case "S":
          n2 = true, f3 = "N";
          break;
        case "LRE":
        case "RLE":
        case "LRO":
        case "RLO":
        case "PDF":
          m2 = false;
          break;
        case "BN":
          f3 = "N";
      }
      return f3;
    }, N2 = function(t4, e2, r3) {
      var n3 = t4.split("");
      return r3 && L2(n3, r3, { hiLevel: v2 }), n3.reverse(), e2 && e2.reverse(), n3.join("");
    }, L2 = function(t4, e2, i3) {
      var a3, o3, s3, c3, u3, d3 = -1, p3 = t4.length, g3 = 0, y3 = [], N3 = v2 ? l2 : h2, L3 = [];
      for (m2 = false, r2 = false, n2 = false, o3 = 0; o3 < p3; o3++) L3[o3] = b2(t4[o3]);
      for (s3 = 0; s3 < p3; s3++) {
        if (u3 = g3, y3[s3] = w2(t4, L3, y3, s3), a3 = 240 & (g3 = N3[u3][f2[y3[s3]]]), g3 &= 15, e2[s3] = c3 = N3[g3][5], a3 > 0) if (16 === a3) {
          for (o3 = d3; o3 < s3; o3++) e2[o3] = 1;
          d3 = -1;
        } else d3 = -1;
        if (N3[g3][6]) -1 === d3 && (d3 = s3);
        else if (d3 > -1) {
          for (o3 = d3; o3 < s3; o3++) e2[o3] = c3;
          d3 = -1;
        }
        "B" === L3[s3] && (e2[s3] = 0), i3.hiLevel |= c3;
      }
      n2 && function(t5, e3, r3) {
        for (var n3 = 0; n3 < r3; n3++) if ("S" === t5[n3]) {
          e3[n3] = v2;
          for (var i4 = n3 - 1; i4 >= 0 && "WS" === t5[i4]; i4--) e3[i4] = v2;
        }
      }(L3, e2, p3);
    }, A2 = function(t4, e2, n3, i3, a3) {
      if (!(a3.hiLevel < t4)) {
        if (1 === t4 && 1 === v2 && !r2) return e2.reverse(), void (n3 && n3.reverse());
        for (var o3, s3, c3, u3, h3 = e2.length, l3 = 0; l3 < h3; ) {
          if (i3[l3] >= t4) {
            for (c3 = l3 + 1; c3 < h3 && i3[c3] >= t4; ) c3++;
            for (u3 = l3, s3 = c3 - 1; u3 < s3; u3++, s3--) o3 = e2[u3], e2[u3] = e2[s3], e2[s3] = o3, n3 && (o3 = n3[u3], n3[u3] = n3[s3], n3[s3] = o3);
            l3 = c3;
          }
          l3++;
        }
      }
    }, x2 = function(t4, e2, r3) {
      var n3 = t4.split(""), i3 = { hiLevel: v2 };
      return r3 || (r3 = []), L2(n3, r3, i3), function(t5, e3, r4) {
        if (0 !== r4.hiLevel && c2) for (var n4, i4 = 0; i4 < t5.length; i4++) 1 === e3[i4] && (n4 = p2.indexOf(t5[i4])) >= 0 && (t5[i4] = p2[n4 + 1]);
      }(n3, r3, i3), A2(2, n3, e2, r3, i3), A2(1, n3, e2, r3, i3), n3.join("");
    };
    return this.__bidiEngine__.doBidiReorder = function(t4, e2, r3) {
      if (function(t5, e3) {
        if (e3) for (var r4 = 0; r4 < t5.length; r4++) e3[r4] = r4;
        void 0 === a2 && (a2 = y2(t5)), void 0 === s2 && (s2 = y2(t5));
      }(t4, e2), i2 || !o2 || s2) if (i2 && o2 && a2 ^ s2) v2 = a2 ? 1 : 0, t4 = N2(t4, e2, r3);
      else if (!i2 && o2 && s2) v2 = a2 ? 1 : 0, t4 = x2(t4, e2, r3), t4 = N2(t4, e2);
      else if (!i2 || a2 || o2 || s2) {
        if (i2 && !o2 && a2 ^ s2) t4 = N2(t4, e2), a2 ? (v2 = 0, t4 = x2(t4, e2, r3)) : (v2 = 1, t4 = x2(t4, e2, r3), t4 = N2(t4, e2));
        else if (i2 && a2 && !o2 && s2) v2 = 1, t4 = x2(t4, e2, r3), t4 = N2(t4, e2);
        else if (!i2 && !o2 && a2 ^ s2) {
          var n3 = c2;
          a2 ? (v2 = 1, t4 = x2(t4, e2, r3), v2 = 0, c2 = false, t4 = x2(t4, e2, r3), c2 = n3) : (v2 = 0, t4 = x2(t4, e2, r3), t4 = N2(t4, e2), v2 = 1, c2 = false, t4 = x2(t4, e2, r3), c2 = n3, t4 = N2(t4, e2));
        }
      } else v2 = 0, t4 = x2(t4, e2, r3);
      else v2 = a2 ? 1 : 0, t4 = x2(t4, e2, r3);
      return t4;
    }, this.__bidiEngine__.setOptions = function(t4) {
      t4 && (i2 = t4.isInputVisual, o2 = t4.isOutputVisual, a2 = t4.isInputRtl, s2 = t4.isOutputRtl, c2 = t4.isSymmetricSwapping);
    }, this.__bidiEngine__.setOptions(t3), this.__bidiEngine__;
  };
  var e = ["BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "S", "B", "S", "WS", "B", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "B", "B", "B", "S", "WS", "N", "N", "ET", "ET", "ET", "N", "N", "N", "N", "N", "ES", "CS", "ES", "CS", "CS", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "CS", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "BN", "BN", "BN", "BN", "BN", "BN", "B", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "CS", "N", "ET", "ET", "ET", "ET", "N", "N", "N", "N", "L", "N", "N", "BN", "N", "N", "ET", "ET", "EN", "EN", "N", "L", "N", "N", "N", "EN", "L", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "L", "L", "L", "L", "L", "L", "L", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "L", "N", "N", "N", "N", "N", "ET", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "R", "NSM", "R", "NSM", "NSM", "R", "NSM", "NSM", "R", "NSM", "N", "N", "N", "N", "N", "N", "N", "N", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "N", "N", "N", "N", "N", "R", "R", "R", "R", "R", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "AN", "AN", "AN", "AN", "AN", "AN", "N", "N", "AL", "ET", "ET", "AL", "CS", "AL", "N", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AL", "AL", "N", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AN", "AN", "AN", "AN", "AN", "AN", "AN", "AN", "AN", "AN", "ET", "AN", "AN", "AL", "AL", "AL", "NSM", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AN", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AL", "AL", "NSM", "NSM", "N", "NSM", "NSM", "NSM", "NSM", "AL", "AL", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "N", "AL", "AL", "NSM", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "N", "N", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AL", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "R", "R", "N", "N", "N", "N", "R", "N", "N", "N", "N", "N", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "BN", "BN", "BN", "L", "R", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "WS", "B", "LRE", "RLE", "PDF", "LRO", "RLO", "CS", "ET", "ET", "ET", "ET", "ET", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "CS", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "WS", "BN", "BN", "BN", "BN", "BN", "N", "LRI", "RLI", "FSI", "PDI", "BN", "BN", "BN", "BN", "BN", "BN", "EN", "L", "N", "N", "EN", "EN", "EN", "EN", "EN", "EN", "ES", "ES", "N", "N", "N", "L", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "ES", "ES", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "R", "NSM", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "ES", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "N", "R", "R", "R", "R", "R", "N", "R", "N", "R", "R", "N", "R", "R", "N", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "CS", "N", "CS", "N", "N", "CS", "N", "N", "N", "N", "N", "N", "N", "N", "N", "ET", "N", "N", "ES", "ES", "N", "N", "N", "N", "N", "ET", "ET", "N", "N", "N", "N", "N", "AL", "AL", "AL", "AL", "AL", "N", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "N", "N", "BN", "N", "N", "N", "ET", "ET", "ET", "N", "N", "N", "N", "N", "ES", "CS", "ES", "CS", "CS", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "CS", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "L", "L", "L", "L", "L", "L", "N", "N", "L", "L", "L", "L", "L", "L", "N", "N", "L", "L", "L", "L", "L", "L", "N", "N", "L", "L", "L", "N", "N", "N", "ET", "ET", "N", "N", "N", "ET", "ET", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N"], r = new t2.__bidiEngine__({ isInputVisual: true });
  t2.API.events.push(["postProcessText", function(t3) {
    var e2 = t3.text, n2 = (t3.x, t3.y, t3.options || {}), i2 = (t3.mutex, n2.lang, []);
    if (n2.isInputVisual = "boolean" != typeof n2.isInputVisual || n2.isInputVisual, r.setOptions(n2), "[object Array]" === Object.prototype.toString.call(e2)) {
      var a2 = 0;
      for (i2 = [], a2 = 0; a2 < e2.length; a2 += 1) "[object Array]" === Object.prototype.toString.call(e2[a2]) ? i2.push([r.doBidiReorder(e2[a2][0]), e2[a2][1], e2[a2][2]]) : i2.push([r.doBidiReorder(e2[a2])]);
      t3.text = i2;
    } else t3.text = r.doBidiReorder(e2);
    r.setOptions({ isInputVisual: true });
  }]);
}(E), E.API.TTFFont = function() {
  function t2(t3) {
    var e;
    if (this.rawData = t3, e = this.contents = new ne(t3), this.contents.pos = 4, "ttcf" === e.readString(4)) throw new Error("TTCF not supported.");
    e.pos = 0, this.parse(), this.subset = new Le(this), this.registerTTF();
  }
  return t2.open = function(e) {
    return new t2(e);
  }, t2.prototype.parse = function() {
    return this.directory = new ie(this.contents), this.head = new se(this), this.name = new pe(this), this.cmap = new ue(this), this.toUnicode = {}, this.hhea = new he(this), this.maxp = new ge(this), this.hmtx = new me(this), this.post = new fe(this), this.os2 = new le(this), this.loca = new Ne(this), this.glyf = new be(this), this.ascender = this.os2.exists && this.os2.ascender || this.hhea.ascender, this.decender = this.os2.exists && this.os2.decender || this.hhea.decender, this.lineGap = this.os2.exists && this.os2.lineGap || this.hhea.lineGap, this.bbox = [this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax];
  }, t2.prototype.registerTTF = function() {
    var t3, e, r, n2, i2;
    if (this.scaleFactor = 1e3 / this.head.unitsPerEm, this.bbox = function() {
      var e2, r2, n3, i3;
      for (i3 = [], e2 = 0, r2 = (n3 = this.bbox).length; e2 < r2; e2++) t3 = n3[e2], i3.push(Math.round(t3 * this.scaleFactor));
      return i3;
    }.call(this), this.stemV = 0, this.post.exists ? (r = 255 & (n2 = this.post.italic_angle), 0 != (32768 & (e = n2 >> 16)) && (e = -(1 + (65535 ^ e))), this.italicAngle = +(e + "." + r)) : this.italicAngle = 0, this.ascender = Math.round(this.ascender * this.scaleFactor), this.decender = Math.round(this.decender * this.scaleFactor), this.lineGap = Math.round(this.lineGap * this.scaleFactor), this.capHeight = this.os2.exists && this.os2.capHeight || this.ascender, this.xHeight = this.os2.exists && this.os2.xHeight || 0, this.familyClass = (this.os2.exists && this.os2.familyClass || 0) >> 8, this.isSerif = 1 === (i2 = this.familyClass) || 2 === i2 || 3 === i2 || 4 === i2 || 5 === i2 || 7 === i2, this.isScript = 10 === this.familyClass, this.flags = 0, this.post.isFixedPitch && (this.flags |= 1), this.isSerif && (this.flags |= 2), this.isScript && (this.flags |= 8), 0 !== this.italicAngle && (this.flags |= 64), this.flags |= 32, !this.cmap.unicode) throw new Error("No unicode cmap for font");
  }, t2.prototype.characterToGlyph = function(t3) {
    var e;
    return (null != (e = this.cmap.unicode) ? e.codeMap[t3] : void 0) || 0;
  }, t2.prototype.widthOfGlyph = function(t3) {
    var e;
    return e = 1e3 / this.head.unitsPerEm, this.hmtx.forGlyph(t3).advance * e;
  }, t2.prototype.widthOfString = function(t3, e, r) {
    var n2, i2, a2, o2;
    for (a2 = 0, i2 = 0, o2 = (t3 = "" + t3).length; 0 <= o2 ? i2 < o2 : i2 > o2; i2 = 0 <= o2 ? ++i2 : --i2) n2 = t3.charCodeAt(i2), a2 += this.widthOfGlyph(this.characterToGlyph(n2)) + r * (1e3 / e) || 0;
    return a2 * (e / 1e3);
  }, t2.prototype.lineHeight = function(t3, e) {
    var r;
    return null == e && (e = false), r = e ? this.lineGap : 0, (this.ascender + r - this.decender) / 1e3 * t3;
  }, t2;
}();
var re, ne = function() {
  function t2(t3) {
    this.data = null != t3 ? t3 : [], this.pos = 0, this.length = this.data.length;
  }
  return t2.prototype.readByte = function() {
    return this.data[this.pos++];
  }, t2.prototype.writeByte = function(t3) {
    return this.data[this.pos++] = t3;
  }, t2.prototype.readUInt32 = function() {
    return 16777216 * this.readByte() + (this.readByte() << 16) + (this.readByte() << 8) + this.readByte();
  }, t2.prototype.writeUInt32 = function(t3) {
    return this.writeByte(t3 >>> 24 & 255), this.writeByte(t3 >> 16 & 255), this.writeByte(t3 >> 8 & 255), this.writeByte(255 & t3);
  }, t2.prototype.readInt32 = function() {
    var t3;
    return (t3 = this.readUInt32()) >= 2147483648 ? t3 - 4294967296 : t3;
  }, t2.prototype.writeInt32 = function(t3) {
    return t3 < 0 && (t3 += 4294967296), this.writeUInt32(t3);
  }, t2.prototype.readUInt16 = function() {
    return this.readByte() << 8 | this.readByte();
  }, t2.prototype.writeUInt16 = function(t3) {
    return this.writeByte(t3 >> 8 & 255), this.writeByte(255 & t3);
  }, t2.prototype.readInt16 = function() {
    var t3;
    return (t3 = this.readUInt16()) >= 32768 ? t3 - 65536 : t3;
  }, t2.prototype.writeInt16 = function(t3) {
    return t3 < 0 && (t3 += 65536), this.writeUInt16(t3);
  }, t2.prototype.readString = function(t3) {
    var e, r;
    for (r = [], e = 0; 0 <= t3 ? e < t3 : e > t3; e = 0 <= t3 ? ++e : --e) r[e] = String.fromCharCode(this.readByte());
    return r.join("");
  }, t2.prototype.writeString = function(t3) {
    var e, r, n2;
    for (n2 = [], e = 0, r = t3.length; 0 <= r ? e < r : e > r; e = 0 <= r ? ++e : --e) n2.push(this.writeByte(t3.charCodeAt(e)));
    return n2;
  }, t2.prototype.readShort = function() {
    return this.readInt16();
  }, t2.prototype.writeShort = function(t3) {
    return this.writeInt16(t3);
  }, t2.prototype.readLongLong = function() {
    var t3, e, r, n2, i2, a2, o2, s2;
    return t3 = this.readByte(), e = this.readByte(), r = this.readByte(), n2 = this.readByte(), i2 = this.readByte(), a2 = this.readByte(), o2 = this.readByte(), s2 = this.readByte(), 128 & t3 ? -1 * (72057594037927940 * (255 ^ t3) + 281474976710656 * (255 ^ e) + 1099511627776 * (255 ^ r) + 4294967296 * (255 ^ n2) + 16777216 * (255 ^ i2) + 65536 * (255 ^ a2) + 256 * (255 ^ o2) + (255 ^ s2) + 1) : 72057594037927940 * t3 + 281474976710656 * e + 1099511627776 * r + 4294967296 * n2 + 16777216 * i2 + 65536 * a2 + 256 * o2 + s2;
  }, t2.prototype.writeLongLong = function(t3) {
    var e, r;
    return e = Math.floor(t3 / 4294967296), r = 4294967295 & t3, this.writeByte(e >> 24 & 255), this.writeByte(e >> 16 & 255), this.writeByte(e >> 8 & 255), this.writeByte(255 & e), this.writeByte(r >> 24 & 255), this.writeByte(r >> 16 & 255), this.writeByte(r >> 8 & 255), this.writeByte(255 & r);
  }, t2.prototype.readInt = function() {
    return this.readInt32();
  }, t2.prototype.writeInt = function(t3) {
    return this.writeInt32(t3);
  }, t2.prototype.read = function(t3) {
    var e, r;
    for (e = [], r = 0; 0 <= t3 ? r < t3 : r > t3; r = 0 <= t3 ? ++r : --r) e.push(this.readByte());
    return e;
  }, t2.prototype.write = function(t3) {
    var e, r, n2, i2;
    for (i2 = [], r = 0, n2 = t3.length; r < n2; r++) e = t3[r], i2.push(this.writeByte(e));
    return i2;
  }, t2;
}(), ie = function() {
  var t2;
  function e(t3) {
    var e2, r, n2;
    for (this.scalarType = t3.readInt(), this.tableCount = t3.readShort(), this.searchRange = t3.readShort(), this.entrySelector = t3.readShort(), this.rangeShift = t3.readShort(), this.tables = {}, r = 0, n2 = this.tableCount; 0 <= n2 ? r < n2 : r > n2; r = 0 <= n2 ? ++r : --r) e2 = { tag: t3.readString(4), checksum: t3.readInt(), offset: t3.readInt(), length: t3.readInt() }, this.tables[e2.tag] = e2;
  }
  return e.prototype.encode = function(e2) {
    var r, n2, i2, a2, o2, s2, c2, u2, h2, l2, f2, d2, p2;
    for (p2 in f2 = Object.keys(e2).length, s2 = Math.log(2), h2 = 16 * Math.floor(Math.log(f2) / s2), a2 = Math.floor(h2 / s2), u2 = 16 * f2 - h2, (n2 = new ne()).writeInt(this.scalarType), n2.writeShort(f2), n2.writeShort(h2), n2.writeShort(a2), n2.writeShort(u2), i2 = 16 * f2, c2 = n2.pos + i2, o2 = null, d2 = [], e2) for (l2 = e2[p2], n2.writeString(p2), n2.writeInt(t2(l2)), n2.writeInt(c2), n2.writeInt(l2.length), d2 = d2.concat(l2), "head" === p2 && (o2 = c2), c2 += l2.length; c2 % 4; ) d2.push(0), c2++;
    return n2.write(d2), r = 2981146554 - t2(n2.data), n2.pos = o2 + 8, n2.writeUInt32(r), n2.data;
  }, t2 = function(t3) {
    var e2, r, n2, i2;
    for (t3 = ve.call(t3); t3.length % 4; ) t3.push(0);
    for (n2 = new ne(t3), r = 0, e2 = 0, i2 = t3.length; e2 < i2; e2 = e2 += 4) r += n2.readUInt32();
    return 4294967295 & r;
  }, e;
}(), ae = {}.hasOwnProperty, oe = function(t2, e) {
  for (var r in e) ae.call(e, r) && (t2[r] = e[r]);
  function n2() {
    this.constructor = t2;
  }
  return n2.prototype = e.prototype, t2.prototype = new n2(), t2.__super__ = e.prototype, t2;
};
re = function() {
  function t2(t3) {
    var e;
    this.file = t3, e = this.file.directory.tables[this.tag], this.exists = !!e, e && (this.offset = e.offset, this.length = e.length, this.parse(this.file.contents));
  }
  return t2.prototype.parse = function() {
  }, t2.prototype.encode = function() {
  }, t2.prototype.raw = function() {
    return this.exists ? (this.file.contents.pos = this.offset, this.file.contents.read(this.length)) : null;
  }, t2;
}();
var se = function(t2) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return oe(e, re), e.prototype.tag = "head", e.prototype.parse = function(t3) {
    return t3.pos = this.offset, this.version = t3.readInt(), this.revision = t3.readInt(), this.checkSumAdjustment = t3.readInt(), this.magicNumber = t3.readInt(), this.flags = t3.readShort(), this.unitsPerEm = t3.readShort(), this.created = t3.readLongLong(), this.modified = t3.readLongLong(), this.xMin = t3.readShort(), this.yMin = t3.readShort(), this.xMax = t3.readShort(), this.yMax = t3.readShort(), this.macStyle = t3.readShort(), this.lowestRecPPEM = t3.readShort(), this.fontDirectionHint = t3.readShort(), this.indexToLocFormat = t3.readShort(), this.glyphDataFormat = t3.readShort();
  }, e.prototype.encode = function(t3) {
    var e2;
    return (e2 = new ne()).writeInt(this.version), e2.writeInt(this.revision), e2.writeInt(this.checkSumAdjustment), e2.writeInt(this.magicNumber), e2.writeShort(this.flags), e2.writeShort(this.unitsPerEm), e2.writeLongLong(this.created), e2.writeLongLong(this.modified), e2.writeShort(this.xMin), e2.writeShort(this.yMin), e2.writeShort(this.xMax), e2.writeShort(this.yMax), e2.writeShort(this.macStyle), e2.writeShort(this.lowestRecPPEM), e2.writeShort(this.fontDirectionHint), e2.writeShort(t3), e2.writeShort(this.glyphDataFormat), e2.data;
  }, e;
}(), ce = function() {
  function t2(t3, e) {
    var r, n2, i2, a2, o2, s2, c2, u2, h2, l2, f2, d2, p2, g2, m2, v2, b2;
    switch (this.platformID = t3.readUInt16(), this.encodingID = t3.readShort(), this.offset = e + t3.readInt(), h2 = t3.pos, t3.pos = this.offset, this.format = t3.readUInt16(), this.length = t3.readUInt16(), this.language = t3.readUInt16(), this.isUnicode = 3 === this.platformID && 1 === this.encodingID && 4 === this.format || 0 === this.platformID && 4 === this.format, this.codeMap = {}, this.format) {
      case 0:
        for (s2 = 0; s2 < 256; ++s2) this.codeMap[s2] = t3.readByte();
        break;
      case 4:
        for (f2 = t3.readUInt16(), l2 = f2 / 2, t3.pos += 6, i2 = function() {
          var e2, r2;
          for (r2 = [], s2 = e2 = 0; 0 <= l2 ? e2 < l2 : e2 > l2; s2 = 0 <= l2 ? ++e2 : --e2) r2.push(t3.readUInt16());
          return r2;
        }(), t3.pos += 2, p2 = function() {
          var e2, r2;
          for (r2 = [], s2 = e2 = 0; 0 <= l2 ? e2 < l2 : e2 > l2; s2 = 0 <= l2 ? ++e2 : --e2) r2.push(t3.readUInt16());
          return r2;
        }(), c2 = function() {
          var e2, r2;
          for (r2 = [], s2 = e2 = 0; 0 <= l2 ? e2 < l2 : e2 > l2; s2 = 0 <= l2 ? ++e2 : --e2) r2.push(t3.readUInt16());
          return r2;
        }(), u2 = function() {
          var e2, r2;
          for (r2 = [], s2 = e2 = 0; 0 <= l2 ? e2 < l2 : e2 > l2; s2 = 0 <= l2 ? ++e2 : --e2) r2.push(t3.readUInt16());
          return r2;
        }(), n2 = (this.length - t3.pos + this.offset) / 2, o2 = function() {
          var e2, r2;
          for (r2 = [], s2 = e2 = 0; 0 <= n2 ? e2 < n2 : e2 > n2; s2 = 0 <= n2 ? ++e2 : --e2) r2.push(t3.readUInt16());
          return r2;
        }(), s2 = m2 = 0, b2 = i2.length; m2 < b2; s2 = ++m2) for (g2 = i2[s2], r = v2 = d2 = p2[s2]; d2 <= g2 ? v2 <= g2 : v2 >= g2; r = d2 <= g2 ? ++v2 : --v2) 0 === u2[s2] ? a2 = r + c2[s2] : 0 !== (a2 = o2[u2[s2] / 2 + (r - d2) - (l2 - s2)] || 0) && (a2 += c2[s2]), this.codeMap[r] = 65535 & a2;
    }
    t3.pos = h2;
  }
  return t2.encode = function(t3, e) {
    var r, n2, i2, a2, o2, s2, c2, u2, h2, l2, f2, d2, p2, g2, m2, v2, b2, y2, w2, N2, L2, A2, x2, S2, _2, P2, k2, I2, F2, C2, j2, O2, B2, M2, E2, q2, D2, R2, T2, U2, z2, H2, W2, V2, G2, Y2;
    switch (I2 = new ne(), a2 = Object.keys(t3).sort(function(t4, e2) {
      return t4 - e2;
    }), e) {
      case "macroman":
        for (p2 = 0, g2 = function() {
          var t4 = [];
          for (d2 = 0; d2 < 256; ++d2) t4.push(0);
          return t4;
        }(), v2 = { 0: 0 }, i2 = {}, F2 = 0, B2 = a2.length; F2 < B2; F2++) null == v2[W2 = t3[n2 = a2[F2]]] && (v2[W2] = ++p2), i2[n2] = { old: t3[n2], new: v2[t3[n2]] }, g2[n2] = v2[t3[n2]];
        return I2.writeUInt16(1), I2.writeUInt16(0), I2.writeUInt32(12), I2.writeUInt16(0), I2.writeUInt16(262), I2.writeUInt16(0), I2.write(g2), { charMap: i2, subtable: I2.data, maxGlyphID: p2 + 1 };
      case "unicode":
        for (P2 = [], h2 = [], b2 = 0, v2 = {}, r = {}, m2 = c2 = null, C2 = 0, M2 = a2.length; C2 < M2; C2++) null == v2[w2 = t3[n2 = a2[C2]]] && (v2[w2] = ++b2), r[n2] = { old: w2, new: v2[w2] }, o2 = v2[w2] - n2, null != m2 && o2 === c2 || (m2 && h2.push(m2), P2.push(n2), c2 = o2), m2 = n2;
        for (m2 && h2.push(m2), h2.push(65535), P2.push(65535), S2 = 2 * (x2 = P2.length), A2 = 2 * Math.pow(Math.log(x2) / Math.LN2, 2), l2 = Math.log(A2 / 2) / Math.LN2, L2 = 2 * x2 - A2, s2 = [], N2 = [], f2 = [], d2 = j2 = 0, E2 = P2.length; j2 < E2; d2 = ++j2) {
          if (_2 = P2[d2], u2 = h2[d2], 65535 === _2) {
            s2.push(0), N2.push(0);
            break;
          }
          if (_2 - (k2 = r[_2].new) >= 32768) for (s2.push(0), N2.push(2 * (f2.length + x2 - d2)), n2 = O2 = _2; _2 <= u2 ? O2 <= u2 : O2 >= u2; n2 = _2 <= u2 ? ++O2 : --O2) f2.push(r[n2].new);
          else s2.push(k2 - _2), N2.push(0);
        }
        for (I2.writeUInt16(3), I2.writeUInt16(1), I2.writeUInt32(12), I2.writeUInt16(4), I2.writeUInt16(16 + 8 * x2 + 2 * f2.length), I2.writeUInt16(0), I2.writeUInt16(S2), I2.writeUInt16(A2), I2.writeUInt16(l2), I2.writeUInt16(L2), z2 = 0, q2 = h2.length; z2 < q2; z2++) n2 = h2[z2], I2.writeUInt16(n2);
        for (I2.writeUInt16(0), H2 = 0, D2 = P2.length; H2 < D2; H2++) n2 = P2[H2], I2.writeUInt16(n2);
        for (V2 = 0, R2 = s2.length; V2 < R2; V2++) o2 = s2[V2], I2.writeUInt16(o2);
        for (G2 = 0, T2 = N2.length; G2 < T2; G2++) y2 = N2[G2], I2.writeUInt16(y2);
        for (Y2 = 0, U2 = f2.length; Y2 < U2; Y2++) p2 = f2[Y2], I2.writeUInt16(p2);
        return { charMap: r, subtable: I2.data, maxGlyphID: b2 + 1 };
    }
  }, t2;
}(), ue = function(t2) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return oe(e, re), e.prototype.tag = "cmap", e.prototype.parse = function(t3) {
    var e2, r, n2;
    for (t3.pos = this.offset, this.version = t3.readUInt16(), n2 = t3.readUInt16(), this.tables = [], this.unicode = null, r = 0; 0 <= n2 ? r < n2 : r > n2; r = 0 <= n2 ? ++r : --r) e2 = new ce(t3, this.offset), this.tables.push(e2), e2.isUnicode && null == this.unicode && (this.unicode = e2);
    return true;
  }, e.encode = function(t3, e2) {
    var r, n2;
    return null == e2 && (e2 = "macroman"), r = ce.encode(t3, e2), (n2 = new ne()).writeUInt16(0), n2.writeUInt16(1), r.table = n2.data.concat(r.subtable), r;
  }, e;
}(), he = function(t2) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return oe(e, re), e.prototype.tag = "hhea", e.prototype.parse = function(t3) {
    return t3.pos = this.offset, this.version = t3.readInt(), this.ascender = t3.readShort(), this.decender = t3.readShort(), this.lineGap = t3.readShort(), this.advanceWidthMax = t3.readShort(), this.minLeftSideBearing = t3.readShort(), this.minRightSideBearing = t3.readShort(), this.xMaxExtent = t3.readShort(), this.caretSlopeRise = t3.readShort(), this.caretSlopeRun = t3.readShort(), this.caretOffset = t3.readShort(), t3.pos += 8, this.metricDataFormat = t3.readShort(), this.numberOfMetrics = t3.readUInt16();
  }, e;
}(), le = function(t2) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return oe(e, re), e.prototype.tag = "OS/2", e.prototype.parse = function(t3) {
    if (t3.pos = this.offset, this.version = t3.readUInt16(), this.averageCharWidth = t3.readShort(), this.weightClass = t3.readUInt16(), this.widthClass = t3.readUInt16(), this.type = t3.readShort(), this.ySubscriptXSize = t3.readShort(), this.ySubscriptYSize = t3.readShort(), this.ySubscriptXOffset = t3.readShort(), this.ySubscriptYOffset = t3.readShort(), this.ySuperscriptXSize = t3.readShort(), this.ySuperscriptYSize = t3.readShort(), this.ySuperscriptXOffset = t3.readShort(), this.ySuperscriptYOffset = t3.readShort(), this.yStrikeoutSize = t3.readShort(), this.yStrikeoutPosition = t3.readShort(), this.familyClass = t3.readShort(), this.panose = function() {
      var e2, r;
      for (r = [], e2 = 0; e2 < 10; ++e2) r.push(t3.readByte());
      return r;
    }(), this.charRange = function() {
      var e2, r;
      for (r = [], e2 = 0; e2 < 4; ++e2) r.push(t3.readInt());
      return r;
    }(), this.vendorID = t3.readString(4), this.selection = t3.readShort(), this.firstCharIndex = t3.readShort(), this.lastCharIndex = t3.readShort(), this.version > 0 && (this.ascent = t3.readShort(), this.descent = t3.readShort(), this.lineGap = t3.readShort(), this.winAscent = t3.readShort(), this.winDescent = t3.readShort(), this.codePageRange = function() {
      var e2, r;
      for (r = [], e2 = 0; e2 < 2; e2 = ++e2) r.push(t3.readInt());
      return r;
    }(), this.version > 1)) return this.xHeight = t3.readShort(), this.capHeight = t3.readShort(), this.defaultChar = t3.readShort(), this.breakChar = t3.readShort(), this.maxContext = t3.readShort();
  }, e;
}(), fe = function(t2) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return oe(e, re), e.prototype.tag = "post", e.prototype.parse = function(t3) {
    var e2, r, n2;
    switch (t3.pos = this.offset, this.format = t3.readInt(), this.italicAngle = t3.readInt(), this.underlinePosition = t3.readShort(), this.underlineThickness = t3.readShort(), this.isFixedPitch = t3.readInt(), this.minMemType42 = t3.readInt(), this.maxMemType42 = t3.readInt(), this.minMemType1 = t3.readInt(), this.maxMemType1 = t3.readInt(), this.format) {
      case 65536:
        break;
      case 131072:
        var i2;
        for (r = t3.readUInt16(), this.glyphNameIndex = [], i2 = 0; 0 <= r ? i2 < r : i2 > r; i2 = 0 <= r ? ++i2 : --i2) this.glyphNameIndex.push(t3.readUInt16());
        for (this.names = [], n2 = []; t3.pos < this.offset + this.length; ) e2 = t3.readByte(), n2.push(this.names.push(t3.readString(e2)));
        return n2;
      case 151552:
        return r = t3.readUInt16(), this.offsets = t3.read(r);
      case 196608:
        break;
      case 262144:
        return this.map = function() {
          var e3, r2, n3;
          for (n3 = [], i2 = e3 = 0, r2 = this.file.maxp.numGlyphs; 0 <= r2 ? e3 < r2 : e3 > r2; i2 = 0 <= r2 ? ++e3 : --e3) n3.push(t3.readUInt32());
          return n3;
        }.call(this);
    }
  }, e;
}(), de = function(t2, e) {
  this.raw = t2, this.length = t2.length, this.platformID = e.platformID, this.encodingID = e.encodingID, this.languageID = e.languageID;
}, pe = function(t2) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return oe(e, re), e.prototype.tag = "name", e.prototype.parse = function(t3) {
    var e2, r, n2, i2, a2, o2, s2, c2, u2, h2, l2;
    for (t3.pos = this.offset, t3.readShort(), e2 = t3.readShort(), o2 = t3.readShort(), r = [], i2 = 0; 0 <= e2 ? i2 < e2 : i2 > e2; i2 = 0 <= e2 ? ++i2 : --i2) r.push({ platformID: t3.readShort(), encodingID: t3.readShort(), languageID: t3.readShort(), nameID: t3.readShort(), length: t3.readShort(), offset: this.offset + o2 + t3.readShort() });
    for (s2 = {}, i2 = u2 = 0, h2 = r.length; u2 < h2; i2 = ++u2) n2 = r[i2], t3.pos = n2.offset, c2 = t3.readString(n2.length), a2 = new de(c2, n2), null == s2[l2 = n2.nameID] && (s2[l2] = []), s2[n2.nameID].push(a2);
    this.strings = s2, this.copyright = s2[0], this.fontFamily = s2[1], this.fontSubfamily = s2[2], this.uniqueSubfamily = s2[3], this.fontName = s2[4], this.version = s2[5];
    try {
      this.postscriptName = s2[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
    } catch (t4) {
      this.postscriptName = s2[4][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
    }
    return this.trademark = s2[7], this.manufacturer = s2[8], this.designer = s2[9], this.description = s2[10], this.vendorUrl = s2[11], this.designerUrl = s2[12], this.license = s2[13], this.licenseUrl = s2[14], this.preferredFamily = s2[15], this.preferredSubfamily = s2[17], this.compatibleFull = s2[18], this.sampleText = s2[19];
  }, e;
}(), ge = function(t2) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return oe(e, re), e.prototype.tag = "maxp", e.prototype.parse = function(t3) {
    return t3.pos = this.offset, this.version = t3.readInt(), this.numGlyphs = t3.readUInt16(), this.maxPoints = t3.readUInt16(), this.maxContours = t3.readUInt16(), this.maxCompositePoints = t3.readUInt16(), this.maxComponentContours = t3.readUInt16(), this.maxZones = t3.readUInt16(), this.maxTwilightPoints = t3.readUInt16(), this.maxStorage = t3.readUInt16(), this.maxFunctionDefs = t3.readUInt16(), this.maxInstructionDefs = t3.readUInt16(), this.maxStackElements = t3.readUInt16(), this.maxSizeOfInstructions = t3.readUInt16(), this.maxComponentElements = t3.readUInt16(), this.maxComponentDepth = t3.readUInt16();
  }, e;
}(), me = function(t2) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return oe(e, re), e.prototype.tag = "hmtx", e.prototype.parse = function(t3) {
    var e2, r, n2, i2, a2, o2, s2;
    for (t3.pos = this.offset, this.metrics = [], e2 = 0, o2 = this.file.hhea.numberOfMetrics; 0 <= o2 ? e2 < o2 : e2 > o2; e2 = 0 <= o2 ? ++e2 : --e2) this.metrics.push({ advance: t3.readUInt16(), lsb: t3.readInt16() });
    for (n2 = this.file.maxp.numGlyphs - this.file.hhea.numberOfMetrics, this.leftSideBearings = function() {
      var r2, i3;
      for (i3 = [], e2 = r2 = 0; 0 <= n2 ? r2 < n2 : r2 > n2; e2 = 0 <= n2 ? ++r2 : --r2) i3.push(t3.readInt16());
      return i3;
    }(), this.widths = function() {
      var t4, e3, r2, n3;
      for (n3 = [], t4 = 0, e3 = (r2 = this.metrics).length; t4 < e3; t4++) i2 = r2[t4], n3.push(i2.advance);
      return n3;
    }.call(this), r = this.widths[this.widths.length - 1], s2 = [], e2 = a2 = 0; 0 <= n2 ? a2 < n2 : a2 > n2; e2 = 0 <= n2 ? ++a2 : --a2) s2.push(this.widths.push(r));
    return s2;
  }, e.prototype.forGlyph = function(t3) {
    return t3 in this.metrics ? this.metrics[t3] : { advance: this.metrics[this.metrics.length - 1].advance, lsb: this.leftSideBearings[t3 - this.metrics.length] };
  }, e;
}(), ve = [].slice, be = function(t2) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return oe(e, re), e.prototype.tag = "glyf", e.prototype.parse = function() {
    return this.cache = {};
  }, e.prototype.glyphFor = function(t3) {
    var e2, r, n2, i2, a2, o2, s2, c2, u2, h2;
    return t3 in this.cache ? this.cache[t3] : (i2 = this.file.loca, e2 = this.file.contents, r = i2.indexOf(t3), 0 === (n2 = i2.lengthOf(t3)) ? this.cache[t3] = null : (e2.pos = this.offset + r, a2 = (o2 = new ne(e2.read(n2))).readShort(), c2 = o2.readShort(), h2 = o2.readShort(), s2 = o2.readShort(), u2 = o2.readShort(), this.cache[t3] = -1 === a2 ? new we(o2, c2, h2, s2, u2) : new ye(o2, a2, c2, h2, s2, u2), this.cache[t3]));
  }, e.prototype.encode = function(t3, e2, r) {
    var n2, i2, a2, o2, s2;
    for (a2 = [], i2 = [], o2 = 0, s2 = e2.length; o2 < s2; o2++) n2 = t3[e2[o2]], i2.push(a2.length), n2 && (a2 = a2.concat(n2.encode(r)));
    return i2.push(a2.length), { table: a2, offsets: i2 };
  }, e;
}(), ye = function() {
  function t2(t3, e, r, n2, i2, a2) {
    this.raw = t3, this.numberOfContours = e, this.xMin = r, this.yMin = n2, this.xMax = i2, this.yMax = a2, this.compound = false;
  }
  return t2.prototype.encode = function() {
    return this.raw.data;
  }, t2;
}(), we = function() {
  function t2(t3, e, r, n2, i2) {
    var a2, o2;
    for (this.raw = t3, this.xMin = e, this.yMin = r, this.xMax = n2, this.yMax = i2, this.compound = true, this.glyphIDs = [], this.glyphOffsets = [], a2 = this.raw; o2 = a2.readShort(), this.glyphOffsets.push(a2.pos), this.glyphIDs.push(a2.readUInt16()), 32 & o2; ) a2.pos += 1 & o2 ? 4 : 2, 128 & o2 ? a2.pos += 8 : 64 & o2 ? a2.pos += 4 : 8 & o2 && (a2.pos += 2);
  }
  return t2.prototype.encode = function() {
    var t3, e, r;
    for (e = new ne(ve.call(this.raw.data)), t3 = 0, r = this.glyphIDs.length; t3 < r; ++t3) e.pos = this.glyphOffsets[t3];
    return e.data;
  }, t2;
}(), Ne = function(t2) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return oe(e, re), e.prototype.tag = "loca", e.prototype.parse = function(t3) {
    var e2, r;
    return t3.pos = this.offset, e2 = this.file.head.indexToLocFormat, this.offsets = 0 === e2 ? function() {
      var e3, n2;
      for (n2 = [], r = 0, e3 = this.length; r < e3; r += 2) n2.push(2 * t3.readUInt16());
      return n2;
    }.call(this) : function() {
      var e3, n2;
      for (n2 = [], r = 0, e3 = this.length; r < e3; r += 4) n2.push(t3.readUInt32());
      return n2;
    }.call(this);
  }, e.prototype.indexOf = function(t3) {
    return this.offsets[t3];
  }, e.prototype.lengthOf = function(t3) {
    return this.offsets[t3 + 1] - this.offsets[t3];
  }, e.prototype.encode = function(t3, e2) {
    for (var r = new Uint32Array(this.offsets.length), n2 = 0, i2 = 0, a2 = 0; a2 < r.length; ++a2) if (r[a2] = n2, i2 < e2.length && e2[i2] == a2) {
      ++i2, r[a2] = n2;
      var o2 = this.offsets[a2], s2 = this.offsets[a2 + 1] - o2;
      s2 > 0 && (n2 += s2);
    }
    for (var c2 = new Array(4 * r.length), u2 = 0; u2 < r.length; ++u2) c2[4 * u2 + 3] = 255 & r[u2], c2[4 * u2 + 2] = (65280 & r[u2]) >> 8, c2[4 * u2 + 1] = (16711680 & r[u2]) >> 16, c2[4 * u2] = (4278190080 & r[u2]) >> 24;
    return c2;
  }, e;
}(), Le = function() {
  function t2(t3) {
    this.font = t3, this.subset = {}, this.unicodes = {}, this.next = 33;
  }
  return t2.prototype.generateCmap = function() {
    var t3, e, r, n2, i2;
    for (e in n2 = this.font.cmap.tables[0].codeMap, t3 = {}, i2 = this.subset) r = i2[e], t3[e] = n2[r];
    return t3;
  }, t2.prototype.glyphsFor = function(t3) {
    var e, r, n2, i2, a2, o2, s2;
    for (n2 = {}, a2 = 0, o2 = t3.length; a2 < o2; a2++) n2[i2 = t3[a2]] = this.font.glyf.glyphFor(i2);
    for (i2 in e = [], n2) (null != (r = n2[i2]) ? r.compound : void 0) && e.push.apply(e, r.glyphIDs);
    if (e.length > 0) for (i2 in s2 = this.glyphsFor(e)) r = s2[i2], n2[i2] = r;
    return n2;
  }, t2.prototype.encode = function(t3, e) {
    var r, n2, i2, a2, o2, s2, c2, u2, h2, l2, f2, d2, p2, g2, m2;
    for (n2 in r = ue.encode(this.generateCmap(), "unicode"), a2 = this.glyphsFor(t3), f2 = { 0: 0 }, m2 = r.charMap) f2[(s2 = m2[n2]).old] = s2.new;
    for (d2 in l2 = r.maxGlyphID, a2) d2 in f2 || (f2[d2] = l2++);
    return u2 = function(t4) {
      var e2, r2;
      for (e2 in r2 = {}, t4) r2[t4[e2]] = e2;
      return r2;
    }(f2), h2 = Object.keys(u2).sort(function(t4, e2) {
      return t4 - e2;
    }), p2 = function() {
      var t4, e2, r2;
      for (r2 = [], t4 = 0, e2 = h2.length; t4 < e2; t4++) o2 = h2[t4], r2.push(u2[o2]);
      return r2;
    }(), i2 = this.font.glyf.encode(a2, p2, f2), c2 = this.font.loca.encode(i2.offsets, p2), g2 = { cmap: this.font.cmap.raw(), glyf: i2.table, loca: c2, hmtx: this.font.hmtx.raw(), hhea: this.font.hhea.raw(), maxp: this.font.maxp.raw(), post: this.font.post.raw(), name: this.font.name.raw(), head: this.font.head.encode(e) }, this.font.os2.exists && (g2["OS/2"] = this.font.os2.raw()), this.font.directory.encode(g2);
  }, t2;
}();
E.API.PDFObject = function() {
  var t2;
  function e() {
  }
  return t2 = function(t3, e2) {
    return (Array(e2 + 1).join("0") + t3).slice(-e2);
  }, e.convert = function(r) {
    var n2, i2, a2, o2;
    if (Array.isArray(r)) return "[" + function() {
      var t3, i3, a3;
      for (a3 = [], t3 = 0, i3 = r.length; t3 < i3; t3++) n2 = r[t3], a3.push(e.convert(n2));
      return a3;
    }().join(" ") + "]";
    if ("string" == typeof r) return "/" + r;
    if (null != r ? r.isString : void 0) return "(" + r + ")";
    if (r instanceof Date) return "(D:" + t2(r.getUTCFullYear(), 4) + t2(r.getUTCMonth(), 2) + t2(r.getUTCDate(), 2) + t2(r.getUTCHours(), 2) + t2(r.getUTCMinutes(), 2) + t2(r.getUTCSeconds(), 2) + "Z)";
    if ("[object Object]" === {}.toString.call(r)) {
      for (i2 in a2 = ["<<"], r) o2 = r[i2], a2.push("/" + i2 + " " + e.convert(o2));
      return a2.push(">>"), a2.join("\n");
    }
    return "" + r;
  }, e;
}();
window.log = log;
log.level = log.DEBUG;
Hooks.once("init", (app, html, data) => {
  log.i("Initialising");
  CONFIG.debug.hooks = true;
  registerSettings();
});
Hooks.once("ready", (app, html, data) => {
  if (!game.modules.get(MODULE_ID).active) {
    log.w("Module is not active");
    return;
  }
  new WelcomeApplication().render(true, { focus: true });
});
Hooks.on("getJournalSheetHeaderButtons", (app, buttons) => {
  log.d("app", app);
  buttons.unshift({
    label: "Make PDF",
    class: "make-pdf",
    icon: "fas fa-file-pdf",
    onclick: () => {
      Hooks.call("makePDF", app.object.uuid);
    }
  });
  return buttons;
});
Hooks.on("makePDF", (uuid) => {
  const journal = fromUuidSync(uuid);
  const pages = journal.collections.pages.entries();
  let content = '<div id="pdf">';
  for (const page of pages) {
    log.d("page", page);
    content += `<h1 class="title">${page[1].name}</h1>` + page[1].text.content;
  }
  content += "</div>";
  log.d("content", content);
  const pdf = new E("p", "pt", "a4");
  pdf.html(content, {
    callback: function(doc) {
      pdf.save(`${journal.name}.pdf`);
    },
    autoPaging: "text",
    jsPDF: pdf,
    windowWidth: 600,
    width: 600
  });
});
export {
  _typeof as _
};
//# sourceMappingURL=index-DplLuq0a.js.map
