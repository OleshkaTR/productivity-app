import {bus} from '../../../eventBus';
import * as markup from './timer_circle.hbs';
import $ from 'jquery';

import('./timer_circle.less');

global.jQuery = $;
global.$ = $;

/** @class TimerCircle */
class TimerCircle {
  /**
   * @constructor Create a new instance of ReportGraph class
   * @param {string} containerId - Container ID
   * @param {boolean|object} currentTask - Selected tasks
   * @param {boolean|object} startTimerPage - State start timer
   * @param {boolean|object} timerWork - State timer work
   * @param {boolean|object} valueWork - Object with work value
   * @param {boolean|object} timerBreak - State timer break
   * @param {boolean|object} valueShortBreak - Object with short break value
   * @param {boolean|object} finishTask - State finish task in the timer
   * @param {boolean|object} longBreak - Object with long break value
   * @param {boolean|object} workIteration - Object with work iteration value
   */
  constructor(containerId, currentTask, startTimerPage, timerWork, valueWork,
      timerBreak, valueShortBreak, finishTask, longBreak, workIteration) {
    this.container = document.getElementById(containerId);
    this.interval = {};
    this.render(this.interval, containerId, currentTask, startTimerPage,
        timerWork, valueWork, timerBreak, valueShortBreak, finishTask,
        longBreak, workIteration);
  }

  /** @description It's for clear interval in the timer page */
  clearTimerCircleInterval() {
    clearInterval(this.interval.update);
  }

  /** @description Render TimerCircle on the page
   * @param {object} interval - Object with interval
   * @param {string} containerId - Container ID
   * @param {boolean|object} currentTask - Selected tasks
   * @param {boolean|object} startTimerPage - State start timer
   * @param {boolean|object} timerWork - State timer work
   * @param {boolean|object} valueWork - Object with work value
   * @param {boolean|object} timerBreak - State timer break
   * @param {boolean|object} valueShortBreak - Object with short break value
   * @param {boolean|object} finishTask - State finish task in the timer
   * @param {boolean|object} longBreak - Object with long break value
   * @param {boolean|object} workIteration - Object with work iteration value
   */
  render(interval, containerId, currentTask, startTimerPage, timerWork,
      valueWork, timerBreak, valueShortBreak, finishTask, longBreak,
      workIteration) {
    this.container.innerHTML = markup();

    (function($) {
      const count = 0;

      const box = {};
      const specificText = () => {
        if (startTimerPage) {
          box.startTimerPage = true;
          return '<h2 class="fz-timer-par m-content content-size">' +
            'Let`s do it!</h2>';
        }
        if (timerWork) {
          box.timerWork = true;
          return `<h2 class="timer-value content-size m-content value_work">
${valueWork}</h2>
                            <p class="fz-timer-par mb-timer-par content-size">
                            min</p>`;
        }
        if (workIteration !== currentTask.completedCount && timerWork &&
          count === 0) {
          return `<p class="fz-timer-par mt-timer-par content-size">Break</p>
                  <h2 class="timer-value content-size m-content 
                  value_short_break">${valueShortBreak}</h2>
                  <p class="fz-timer-par mb-timer-par content-size">min</p>`;
        }
        if (workIteration === currentTask.completedCount && longBreak &&
          count === 0) {
          return `<p class="fz-timer-par mt-timer-par content-size">Break</p>
                  <h2 class="timer-value content-size m-content
                  value_long_break">${longBreak}</h2>
                  <p class="fz-timer-par mb-timer-par content-size">min</p>`;
        }
        if (valueShortBreak) {
          return `<p class="fz-timer-par mt-timer-par content-size">Break</p>
                        <h2 class="timer-value content-size m-content 
                        value_short_break">${valueShortBreak}</h2>
                        <p class="fz-timer-par mb-timer-par content-size">
                        min</p>`;
        }
        if (longBreak) {
          return `<p class="fz-timer-par mt-timer-par content-size">Break</p>
                        <h2 class="timer-value content-size m-content 
                        value_long_break">${longBreak}</h2>
                        <p class="fz-timer-par mb-timer-par content-size">
                        min</p>`;
        }
        if (finishTask) {
          return `<p class="mt-timer-par fs-text-completed content-size">You</p>
                        <p class="fs-text-completed content-size m-content">
                        Completed</p>
                        <p class="mb-timer-par fs-text-completed content-size">
                        Task</p>`;
        }
      };

      $.fn.radialTimer = function(options) {
        const settings = $.extend({
          content: specificText(),
          time: '',
          showFull: false,
          background: this.showFull ? '#8DA5B8' : '#2A3F50',
          renderInterval: 60000,
        }, options);

        return this.html(settings.content);
      };

      const countDown = (timer, value) => {
        if (timer) {
          interval.update = setInterval(() => {
            $(value).each(function() {
              const count = parseInt($(this).html());
              if (count !== 1) {
                return $(this).html(count - 1);
              }
              if (box.timerWork && count === 1 && workIteration !==
                currentTask.completedCount) {
                bus.post('finishPomodoro', 'successful');
                clearInterval(interval.update);
                return countDown(valueShortBreak, '.value_short_break');
              }
              if (box.timerWork && count === 1 && currentTask.estimation ===
                currentTask.completedCount) {
                clearInterval(interval.update);
                return bus.post('finishPomodoro', 'successful');
              }
              if (timer === valueShortBreak && count === 1 || timer ===
                longBreak && count === 1) {
                clearInterval(interval.update);
                $('.progress-band').addClass('new_background');
                return $('.timer_text').radialTimer({
                  content: '<p class="fz-timer-par z-index m-content ' +
                    'content-size">Break is over</p>',
                });
              }
              if (box.timerWork && count === 1 && workIteration ===
                currentTask.completedCount) {
                clearInterval(interval.update);
                $('.timer_text').radialTimer().addClass('z-index')
                    .css({margin: '0 auto'});
                filling(longBreak);
                return countDown(longBreak, '.value_short_break');
              }
            });
          }, 60000);
        }
      };

      const filling = (type) => {
        const res = type === valueWork ? valueWork / 2 : type ===
        valueShortBreak ? valueShortBreak / 2 : type === longBreak ?
          longBreak / 2 : null;
        const allTime = res * 60;
        $('.fill_left').css({animationDuration: `${allTime}s`});
        $('.fill_right').css({
          animationDelay: `${allTime}s`,
          animationDuration: `${allTime}s`,
        });
      };

      if (startTimerPage) {
        $('.fill_background').css({background: 'none'});
        return $('.timer_text').radialTimer().addClass('z-index')
            .css({margin: '0 auto'});
      }
      if (timerWork) {
        $('.timer_text').radialTimer().addClass('z-index')
            .css({margin: '0 auto'});
        countDown(valueWork, '.value_work');
        return filling(valueWork);
      }
      if (valueShortBreak) {
        $('.timer_text').radialTimer().addClass('z-index')
            .css({margin: '0 auto'});
        countDown(valueShortBreak, '.value_short_break');
        return filling(valueShortBreak);
      }
      if (longBreak) {
        $('.timer_text').radialTimer().addClass('z-index')
            .css({margin: '0 auto'});
        filling(longBreak);
        countDown(longBreak, '.value_long_break');
      }
      if (finishTask) {
        $('.fill').removeClass('fill_background');
        $('.progress-band').addClass('new_background');
        return $('.timer_text').radialTimer().addClass('z-index')
            .css({margin: '0 auto'});
      }
    }(jQuery));
  }
}

export default TimerCircle;
