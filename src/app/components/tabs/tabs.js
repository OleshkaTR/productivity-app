/** @module tabs */

import * as markup from './tabs.hbs';
import {router} from '../../router';
import('./tabs.less');

/**
 * @property {object} tabs - Notifications all of application.
 * @property {method} tabs.init - Initializations a new tab component.
 * @property {method} tabs.render - The render for all tabs.
 * @property {method} tabs.addEventListeners - Events for all of tabs.
 */
export const tabs = {

  init(tabsSetting, tabsCategories, tabsReportRangeDate, tabsReportType, day,
      week, month, tasks, pomodoros) {
    this.container = document.getElementById('main');
    this.tabsSetting = tabsSetting;
    this.tabsCategories = tabsCategories;
    this.tabsReportRangeDate = tabsReportRangeDate;
    this.tabsReportType = tabsReportType;
    this.day = day;
    this.week = week;
    this.month = month;
    this.tasks = tasks;
    this.pomodoros = pomodoros;
    this.render();
    this.day = document.getElementById('day');
    this.week = document.getElementById('week');
    this.month = document.getElementById('month');
    this.failedPomodoros = document.getElementById('failed_pomodoros');
    this.failedTasks = document.getElementById('failed_tasks');
    this.router = router;
    this.addEventListeners();
  },

  render() {
    this.container.insertAdjacentHTML('beforeend', markup({
      tabsSetting: this.tabsSetting, tabsCategories: this.tabsCategories,
      tabsReportRangeDate: this.tabsReportRangeDate,
      tabsReportType: this.tabsReportType, day: this.day, week: this.week,
      month: this.month, tasks: this.tasks, pomodoros: this.pomodoros}));
  },

  addEventListeners() {
    this.container.addEventListener('click', async (e) => {
      e.preventDefault();
      if (e.target.classList.contains('to-settings')) {
        this.router.navigate('settings/pomodoros');
      }
      if (e.target.classList.contains('to-categories')) {
        this.router.navigate('settings/categories');
      }
      if (e.target.classList.contains('day') &&
        this.failedPomodoros.classList.contains('active')) {
        this.router.navigate('reports/day/pomodoros');
      }
      if (e.target.classList.contains('day') &&
        this.failedTasks.classList.contains('active')) {
        this.router.navigate('reports/day/tasks');
      }

      if (e.target.classList.contains('week') &&
        this.failedPomodoros.classList.contains('active')) {
        this.router.navigate('reports/week/pomodoros');
      }
      if (e.target.classList.contains('week') &&
        this.failedTasks.classList.contains('active')) {
        this.router.navigate('reports/week/tasks');
      }
      if (e.target.classList.contains('month') &&
        this.failedPomodoros.classList.contains('active')) {
        this.router.navigate('reports/month/pomodoros');
      }
      if (e.target.classList.contains('month') &&
        this.failedTasks.classList.contains('active')) {
        this.router.navigate('reports/month/tasks');
      }
      if (e.target.classList.contains('failed_pomodoros')) {
        this.router.navigate('reports/day/pomodoros');
      }
      if (e.target.classList.contains('failed_tasks')) {
        this.router.navigate('reports/day/tasks');
      }
    });
  },

};
