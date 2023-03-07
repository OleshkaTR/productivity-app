import('./task.less');
import * as markup from './task.hbs';
import $ from 'jquery';
import('jquery-ui/ui/widgets/tooltip');

global.jQuery = $;
global.$ = $;

/** @class Task */
class Task {
  /**
   * @constructor Create a new instance of Task class
   * @param {string} containerId - Container ID
   * @param {object} item - Item for task
   */
  constructor(containerId, item) {
    this.container = document.getElementById(containerId);
    this.item = item;
    this.render();
  }

  /** @description Render Task in Tasks */
  render() {
    this.container.innerHTML += markup(this.item);

    (function($) {
      $( document ).tooltip({
        classes: {
          'ui-tooltip': 'highlight',
        }});
    }(jQuery));
  }
}

export default Task;
