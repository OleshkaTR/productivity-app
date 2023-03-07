import {categories} from './pages/settings/categories/categories';
import {settingsController} from './pages/settings/settings.controller';
import ReportController from './pages/report/report.controller';
import {taskListController} from './pages/tasks/task_list/task-list.controller';

/** @class Router */
class Router {
  /** @constructor Create a new instance of router class */
  constructor() {
    this.routes = [];
    this.mode = null;
    this.root = '/';
    history.pushState(null, null, '/');
    this.config = function(options) {
      this.mode = options && options.mode &&
      options.mode === history && (history.pushState) ? 'history' : 'hash';
      this.root = options && options.root ?
        '/' + this.clearSlashes(options.root) + '/' : '/';
    };
  }

  /**
   * @description Get path fragment
   * @return {function} - Fragment without slashes
   */
  getFragment() {
    let fragment = '';
    if (this.mode === 'history') {
      fragment = this.clearSlashes(decodeURI(location.pathname +
        location.search));
      if (this.root !== '/') {
        fragment = fragment.replace(this.root, '');
      }
    } else {
      const match = window.location.href.match(/#(.*)$/);
      if (match) {
        fragment = match[1];
      }
    }
    return this.clearSlashes(fragment);
  }

  /**
   * @description Get out slashes
   * @param {string} path - Current path application
   * @return {string} - Clean application path
   */
  clearSlashes(path) {
    path = path.toString();
    path = path.replace(/\\$/, '');
    path = path.replace(/^\\/, '');
    return path;
  }

  /**
   * @description Get out slashes
   * @param {string|function} re - Current path application
   * @param {any} handler - Handler
   * @return {any} - Clean application path
   */
  add(re, handler) {
    if (typeof re == 'function') {
      handler = re;
      re = '';
    }
    this.routes.push({re: re, handler: handler});
    return this;
  }

  /**
   * @description Get out slashes
   * @param {string|function} f - Fragment path application
   */
  check(f) {
    const fragment = f || this.getFragment();
    for (let i = 0; i < this.routes.length; i++) {
      const match = fragment.match(this.routes[i].re);
      if (match) {
        match.shift();
        this.routes[i].handler.apply({}, match);
      }
    }
  }

  /**
   * @description Path listener
   */
  listen() {
    const self = this;
    let current = self.getFragment();
    const fn = function() {
      if (current !== self.getFragment()) {
        current = self.getFragment();
        self.check(current);
      }
    };
    clearInterval(this.interval);
    this.interval = setInterval(fn, 50);
  }

  /**
   * @description Get out slashes
   * @param {string} path - Path application
   */
  navigate(path) {
    path = path ? path : '';
    if (this.mode === 'history') {
      history.pushState(null, null, this.root +
        this.clearSlashes(path));
    } else {
      window.location.href = window.location.href.replace(/#(.*)$/,
          '') + '#' + path;
    }
  }

  /** @description Checking the first visit */
  firstVisit() {
    if (!sessionStorage.getItem('isNewUser')) {
      sessionStorage.setItem('isNewUser', 'true');
      taskListController.init(true);
    } else {
      taskListController.init(false);
      this.navigate('tasks-list');
    }
  }
}

export const router = new Router();
router.firstVisit();
router.add('settings/categories', () => categories.init());
router.add('settings/pomodoros', () => settingsController.init());
router.add('tasks-list', () => taskListController.init());
router.add('reports/day/tasks',
    () => new ReportController(true, false, true));
router.add('reports/day/pomodoros',
    () => new ReportController(false, true, true));
router.add('reports/week/tasks',
    () => new ReportController(true, false, false,
        true, false));
router.add('reports/week/pomodoros',
    () => new ReportController(false, true, false,
        true, false));
router.add('reports/month/tasks',
    () => new ReportController(true, false, false,
        false, true));
router.add('reports/month/pomodoros',
    () => new ReportController(false, true, false,
        false, true));
router.listen();

