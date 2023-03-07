/** @module buttons */
import {bus} from '../../eventBus';
import * as markup from './buttons.hbs';

import('./buttons.less');

/**
 * @property {object} buttons - Buttons all of application.
 * @property {method} buttons.init - Initialization a new buttons component.
 * @property {method} buttons.markup -  The markup for all buttons.
 * @property {method} buttons.render - The render for all buttons.
 * @property {method} buttons.addEventListeners - Events for all of buttons.
 */
export const buttons = {

  init(btnStart, btnsPomodoro, btnsSettings, btnCategories, btnsModalsDelete,
      btnStartPomodoro, btnFinishTask) {
    this.btnStart = btnStart;
    this.btnsPomodoro = btnsPomodoro;
    this.btnsSettings = btnsSettings;
    this.btnCategories = btnCategories;
    this.btnsModalsDelete = btnsModalsDelete;
    this.btnStartPomodoro = btnStartPomodoro;
    this.btnFinishTask = btnFinishTask;
    this.container = document.getElementById('main');
    this.render();
    this.addEventListeners();
  },

  markup() {
    return markup({
      btnStart: this.btnStart,
      btnsPomodoro: this.btnsPomodoro,
      btnsSettings: this.btnsSettings,
      btnCategories: this.btnCategories,
      btnsModalsDelete: this.btnsModalsDelete,
      btnStartPomodoro: this.btnStartPomodoro,
      btnFinishTask: this.btnFinishTask,
    });
  },

  render() {
    this.container.insertAdjacentHTML('beforeend', this.markup());
  },

  addEventListeners() {
    if (this.btnsPomodoro) {
      document.querySelector('.btn-warning-timer').addEventListener('click',
          () => {
            bus.post('failedPomodoro', 'failed');
          });
    }
    if (this.btnStart) {
      document.querySelector('.btn-timer').addEventListener('click',
          () => {
            document.querySelector('header').style.visibility = 'hidden';
            document.getElementById('icon-add').style.display = 'none';
            bus.post('goToWorkTimer');
          });
    }
    if (this.btnsPomodoro) {
      document.querySelector('.btn-success-timer').addEventListener('click',
          () => {
            bus.post('finishPomodoro', 'successful');
          });
    }
    if (this.btnsSettings) {
      document.querySelector('.btn-success')
          .addEventListener('click', () => {
            bus.post('sendSettingsData');
          });

      document.querySelector('.btn-primary')
          .addEventListener('click', () => {
            bus.post('toTasks');
          });
    }
    if (this.btnFinishTask) {
      document.querySelector('.btn-finish-task').addEventListener('click',
          () => {
            document.querySelector('header').style.visibility = 'visible';
            document.getElementById('icon-add').style.display = 'inline';
            bus.post('finishTask');
          });
    }
    if (this.btnStartPomodoro) {
      document.querySelector('.btn-start-pomodoro').addEventListener('click',
          () => {
            bus.post('startPomodoro');
          });
    }
  },

};
