/** @module timerView */

import * as markup from './timer.hbs';
import TaskProgressBar from './task_progress_bar/task_progress_bar';
import TimerCircle from './timer_circle/timer_circle';
import {router} from '../../router';
import $ from 'jquery';

import('./timer.less');

/**
 * @property {object} timerView - timer page of application
 * @property {method} timerView.init - Initialization a new timer page
 component
 * @property {method} timerView.render - Render timer page
 * @property {method} timerView.clearTimerCircleInterval - Clear interval for
 timer page
*/
export const timerView = {
  init(currentTask, startTimerPage, timerWork, valueWork, timerBreak,
      valueShortBreak, finishTask, longBreak, workIteration) {
    this.container = document.getElementById('main');
    this.currentTask = currentTask;
    this.router = router;
    this.timerCircle = null;
    this.render(currentTask, startTimerPage, timerWork, valueWork, timerBreak,
        valueShortBreak, finishTask, longBreak, workIteration);
    return this;
  },

  render(currentTask, startTimerPage, timerWork, valueWork, timerBreak,
      valueShortBreak, finishTask, longBreak, workIteration) {
    this.container.innerHTML = markup(this.currentTask);
    new TaskProgressBar('iteration-timer-pomodoro', this.currentTask);
    this.timerCircle = new TimerCircle('block-circle', currentTask,
        startTimerPage, timerWork, valueWork, timerBreak, valueShortBreak,
        finishTask, longBreak, workIteration);
    document.querySelector('#block-header-title')
        .style.visibility = 'hidden';
    document.querySelector('#icon-trash').style.visibility = 'hidden';
    document.getElementById('icon-add').style.display = 'none';
    $('.block-circle').addClass(`border-circle-${currentTask.categoryId}`);
  },

  clearTimerCircleInterval() {
    this.timerCircle.clearTimerCircleInterval();
  },
};
