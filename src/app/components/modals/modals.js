import {bus} from '../../eventBus';
import * as markup from './modals.hbs';
import {tasksService} from '../../services/tasks.service';
import $ from 'jquery';
import datepickerFactory from 'jquery-datepicker';
import datepickerJAFactory
  from 'jquery-datepicker/i18n/jquery.ui.datepicker-ja';
import('./modals.less');
global.jQuery = $;
global.$ = $;
datepickerFactory($);
datepickerJAFactory($);
/** @class Modals */
class Modals {
  /**
   * @description Create a new instance of header class
   * @param {boolean} [currentTask] - Transferred current task
   * @param {boolean} [isDelete] - Delete mode
   */
  constructor(currentTask, isDelete) {
    this.container = document.getElementById('main');
    this.currentTask = currentTask;
    this.isDelete = isDelete;
    this.render();
    this.modalsWrapper = document.getElementById('modals_wrapper');
    this.title = document.getElementById('title');
    this.description = document.getElementById('description');
    this.deadline = document.getElementById('deadline');
  }

  /** @description Render modals on the page */
  render() {
    this.container.insertAdjacentHTML('beforeend', markup(this));


    $(function() {
      $.datepicker.setDefaults($.datepicker.regional['fr']);

      $('#deadline').datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: new Date($('#hiddendelivdate').val()),
        monthNames: ['Jen', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
          'Sep', 'Oct', 'Now', 'Dec'],
        dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'],
      });
    });

    if (this.currentTask && !this.isDelete) {
      document.querySelector('#title').value = this.currentTask.title;
      document.querySelector('#description').value =
        this.currentTask.description;
      document.querySelector(`#input-${this.currentTask.categoryId}`)
          .checked = true;
      document.querySelector(`#input-${this.currentTask.priority}`)
          .checked = true;
      document.querySelector(`#pomodoro-${this.currentTask.estimation}`)
          .checked = true;

      const date = `${this.currentTask.deadlineDate.year}-
      ${this.currentTask.deadlineDate.month}-
      ${this.currentTask.deadlineDate.day}`;
      const MyDate = new Date(date);
      const MyDateString = MyDate.getFullYear() + '-' +
        ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' +
        ('0' + MyDate.getDate()).slice(-2);
      document.querySelector('#deadline').value = MyDateString;
    }

    this.addEventListeners();
  }

  /**
   * @description modals for create or edit tasks
   * @return {Object} - Body for task
   */
  task() {
    const today = new Date;
    const deadlineFromModals = new Date(this.deadline.value);
    const statusTask = () => {
      if (today.setHours(0, 1) < deadlineFromModals &&
        deadlineFromModals <= today.setHours(23, 59)) {
        return 'DAILY_LIST';
      } else {
        return 'GLOBAL_LIST';
      }
    };
    const idTasks = this.currentTask ?
      this.currentTask.id : new Date().getMilliseconds().toString();
    const selectedCategoryId = document
        .querySelector('input[type=radio][name=radio-group]:checked');
    const selectedPriority = document
        .querySelector('input[type=radio][name=radio]:checked');
    const selectedEstimation = document
        .querySelector('input[type=radio][name=pomodoro]:checked');
    sessionStorage.setItem('wasTask', 'true');

    return {
      id: idTasks,
      categoryId: selectedCategoryId.value,
      title: this.title.value,
      createDate: new Date(),
      description: this.description.value,
      priority: selectedPriority.value,
      estimation: +selectedEstimation.value,
      deadlineDate: {
        day: deadlineFromModals.getDate(),
        month: deadlineFromModals.toLocaleString('en',
            {month: 'short'}).toUpperCase(),
        year: deadlineFromModals.getFullYear(),
      },
      status: statusTask(),
      completedCount: 0,
      failedPomodoros: 0,
      progressBar: [],
    };
  }

  /** @description All event listeners of Modals */
  addEventListeners() {
    document.querySelector('.icon-close').addEventListener('click',
        () => {
          this.modalsWrapper.remove();
        });

    document.querySelector('.icon-check')?.addEventListener('click',
        () => {
          bus.post('addTask', this.task());
          this.modalsWrapper.remove();
        });

    if (this.isDelete === true) {
      document.querySelector('.btn-cancel').addEventListener('click',
          () => {
            this.modalsWrapper.remove();
            document.querySelector('.btns').remove();
          });

      document.querySelector('.btn-warning').addEventListener('click',
          () => {
            this.modalsWrapper.remove();
            document.querySelector('.btns').remove();
            if (tasksService.removeTask.length !== 0) {
              bus.post('deleteArrayTasks');
            } else {
              bus.post('deleteThisTask', this.currentTask);
            }
          });
    }
  }
}

export default Modals;
