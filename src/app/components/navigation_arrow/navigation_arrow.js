/** @module NavigationArrowModule */

import {tasksService} from '../../services/tasks.service';
import * as markup from './navigation_arrow.hbs';
import {bus} from '../../eventBus';
import {router} from '../../router';

import('./navigation_arrow.less');

/**
 * @property {object} navigationArrow - NavigationArrow all of application.
 * @property {method} buttons.init - Initialization a new navigationArrow
 component.
 * @property {method} buttons.render - The render for all navigationArrow.
 * @property {method} buttons.addEventListeners - Events for all of
 navigationArrow.
 */
export const navigationArrow = {

  init(timerLeftArrow, timerRightArrow, reportArrowLeft) {
    this.timerLeftArrow = timerLeftArrow;
    this.timerRightArrow = timerRightArrow;
    this.reportArrowLeft = reportArrowLeft;
    this.container = document.getElementById('main');
    this.render();
    this.router = router;
  },

  render() {
    this.container.insertAdjacentHTML('beforeend', markup({
      timerLeftArrow: this.timerLeftArrow,
      timerRightArrow: this.timerRightArrow,
      reportArrowLeft: this.reportArrowLeft,
    }));
    this.addEventListeners();
  },

  addEventListeners() {
    this.container.addEventListener('click', async (e) => {
      e.preventDefault();
      if (this.timerRightArrow && !this.reportArrowLeft &&
        e.target.classList.contains('icon-arrow-left')) {
        window.location.reload();
        document.querySelector('#block-header-title')
            .style.visibility = 'visible';
        document.getElementById('icon-trash')
            .style.visibility = 'visible';
        document.getElementById('icon-add').style.display = 'inline';
        document.getElementById('icon-list').classList.add('active');
        document.getElementById('icon-statistics')
            .classList.remove('active');
        document.getElementById('icon-settings')
            .classList.remove('active');
        document.getElementById('icon-trash')
            .classList.remove('active');
      }
      if (this.reportArrowLeft &&
        e.target.classList.contains('icon-arrow-left')) {
        window.location.reload();
        document.getElementById('icon-list').classList.add('active');
        document.getElementById('icon-statistics')
            .classList.remove('active');
        document.getElementById('icon-settings')
            .classList.remove('active');
        document.getElementById('icon-trash')
            .classList.remove('active');
      }
      if (!this.timerRightArrow && !this.reportArrowLeft &&
        e.target.classList.contains('icon-arrow-left')) {
        const idTask = await tasksService.getActiveTask('Tasks');
        bus.post('taskToDaily', idTask);
      }
      if (e.target.classList.contains('icon-arrow-right')) {
        bus.post('toReports');
      }
    });
  },
};
