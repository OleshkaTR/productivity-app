import PomodoroGraph from '../pomodoro_graph/pomodoro_graph';
import('./pomodoro_settings_item.less');
import * as markup from './pomodoro_settings_item.hbs';
import {settingsController} from '../settings.controller';
import {documentSubscriptions} from '../../../constants/documentSubscriptions';

/** @class PomodoroSettingsItemComponent */
class PomodoroSettingsItemComponent {
  /**
   * @constructor Create a new instance of PomodoroSettingsItemComponent class
   * @param {string} containerId - Container ID
   * @param {object} option - Object for render options
   */
  constructor(containerId, option) {
    this.option = option;
    this.container = document.getElementById(containerId);
    this.render();
    if (!documentSubscriptions[this.option.id]) {
      this.addEventListeners(this.option);
    }
  }

  /** @description Render PomodoroSettingsItemComponent on the page */
  render() {
    this.container.insertAdjacentHTML('beforeend', markup(this.option));
    this.increase = this.container.querySelector(`#${this.option.id}-increase`);
    this.decrease = this.container.querySelector(`#${this.option.id}-decrease`);
  }

  /**
   * @description Render PomodoroSettingsItemComponent on the page
   * @param {object} option - Object for addEventListeners
   */
  addEventListeners(option) {
    const {id, max, min, step} = option;
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('increase') ||
        e.target.classList.contains('decrease')) {
        const input = e.target.parentElement.querySelector(`#${id}`);
        if (input) {
          if (e.target.classList.contains('increase')) {
            if (this.option.value === max) {
              this.increase.disabled = true;
            } else {
              input.stepUp();
              this.option.value += step;
              this.increase.disabled = false;
              new PomodoroGraph('pomodoro-settings-cycle',
                  settingsController.getSettings());
            }
          } else {
            if (this.option.value === min) {
              this.decrease.disabled = true;
            } else {
              this.option.value -= step;
              input.stepDown();
              this.decrease.disabled = false;
              new PomodoroGraph('pomodoro-settings-cycle',
                  settingsController.getSettings());
            }
          }
        }
      }
    });
    documentSubscriptions[id] = true;
  }
}

export default PomodoroSettingsItemComponent;
