import {documentSubscriptions} from '../../../constants/documentSubscriptions';
import * as markup from './task_progress_bar.hbs';
import {bus} from '../../../eventBus';

import('./task_progress_bar.less');

/** @class TaskProgressBar */
class TaskProgressBar {
  /**
   * @constructor Create a new instance of TaskProgressBar class
   * @param {string} containerId - Container ID
   * @param {object} task - Task for timer
   */
  constructor(containerId, task) {
    this.container = document.getElementById(containerId);
    this.task = task;
    this.render();
    if (!documentSubscriptions[this.task.id]) {
      this.addEventListeners();
    }
  }

  /** @description Render TaskProgressBar on the page */
  render() {
    if (!this.task.progressBar.length) {
      for (let i = 0; i < this.task.estimation; i++) {
        this.container.insertAdjacentHTML('beforeend', markup(this.task));
      }
    } else {
      for (let i = 0; i < this.task.progressBar.length; i++) {
        this.container.insertAdjacentHTML('beforeend',
            `<img class="bg-image-pomodoro"
 src='${this.task.progressBar[i]}' alt="#">`);
      }
    }
    this.container.insertAdjacentHTML('beforeend',
        '<button class="icon-add default-color add_estimation"></button>');
    document.querySelector('.add_estimation').disabled = true;
  }

  /** @description TaskProgressBar event listeners */
  addEventListeners() {
    document.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('add_estimation')) {
        const countPomodoros = document
            .querySelectorAll('.bg-image-pomodoro');
        if (countPomodoros.length === 9) {
          document.querySelector('.add_estimation')
              .style.display = 'none';
        }
        bus.post('changeEstimation', this.task);
      }
    });
    documentSubscriptions[this.task.id] = true;
  }
}

export default TaskProgressBar;
