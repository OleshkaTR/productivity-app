/** @module timerController */

import {timerView} from './timer.view';
import {bus} from '../../eventBus';
import {taskListModel} from '../tasks/task_list/task-list.model';
import {settingsModel} from '../settings/settings.model';
import {buttons} from '../../components/buttons/buttons';
import {
  navigationArrow,
} from '../../components/navigation_arrow/navigation_arrow';
import {router} from '../../router';
import {tasksService} from '../../services/tasks.service';
import {timerService} from '../../services/timer.service';
import {notification} from '../../components/notification/notification';

/**
 * @property {object} timerController - timer page of application
 * @property {method} taskListController.init - Initialization a new timer page
 component
 * @property {method} timerController.onLoadSubscriptions - Action if reload
 page on the timer page
 * @property {method} timerController.addTaskToDaily - Change status a task to
 daily
 * @property {method} timerController.increaseEstimation - Increase estimation
 * @property {method} timerController.addNewArray - Add new array progress bar
 * @property {method} timerController.displayPlus -Show or hide plus on the page
 * @property {method} timerController.goToWorkTimer - Navigate to state timer
 work
 * @property {method} timerController.startPomodoro - Start work iteration
 * @property {method} timerController.failedPomodoro - Failed pomodoro
 * @property {method} timerController.finishPomodoro - Finish pomodoro
 * @property {method} timerController.finishTask - Navigate to finish task state
 * @property {method} timerController.toReports - Navigate to report page
 */
export const timerController = {
  init(currentTask) {
    this.currentTask = currentTask;
    timerView.init(this.currentTask, true);
    navigationArrow.init(true);
    buttons.init(true);
    this.router = router;
    this.increaseEstimation();
    this.goToWorkTimer();
    this.startPomodoro();
    this.failedPomodoro();
    this.finishPomodoro();
    this.finishTask();
    this.toReports();
    this.onLoadSubscriptions();
    this.addTaskToDaily();
  },

  timerSubscribers: {},
  currentTask: {},

  async onLoadSubscriptions() {
    if (!this.timerSubscribers.refreshPage) {
      this.timerSubscribers.refreshPage = true;
      window.onbeforeunload = async () => {
        await timerService.refreshProgressBarArray('Tasks',
            this.currentTask.id);
      };
    }
  },

  addTaskToDaily() {
    if (!this.timerSubscribers.taskToDaily) {
      this.timerSubscribers.taskToDaily = bus.subscribe('taskToDaily',
          async (id) => {
            await taskListModel.toDaily(id);
            await taskListModel.getTasks('Tasks');
            document.querySelector('#block-header-title')
                .style.visibility = 'visible';
            window.location.reload();
          });
    }
  },

  increaseEstimation() {
    if (!this.timerSubscribers.increaseEstimation) {
      this.timerSubscribers.increaseEstimation = bus
          .subscribe('changeEstimation', async () => {
            await timerService.increaseEstimation('Tasks',
                this.currentTask.id);
            document.querySelector('.add_estimation')
                .insertAdjacentHTML('beforebegin',
                    '<img class="bg-image-pomodoro" ' +
              'src="../../../images/empty-tomato.svg" alt="#">');
            await this.addNewArray();
          });
    }
  },

  async addNewArray() {
    const countPomodoros = document
        .querySelectorAll('.bg-image-pomodoro');
    const arr = [];
    countPomodoros.forEach((el) => arr.push(el.src));
    this.currentTask.progressBar = await timerService
        .updateProgressBarArray('Tasks', this.currentTask.id, arr);
  },

  displayPlus() {
    const maxAmount = 10;
    const countPomodoros = document
        .querySelectorAll('.bg-image-pomodoro');
    if (countPomodoros.length === maxAmount) {
      document.querySelector('.add_estimation').style.display = 'none';
    }
  },

  goToWorkTimer() {
    if (!this.timerSubscribers.goToWorkTimer) {
      this.timerSubscribers.goToWorkTimer = bus
          .subscribe('goToWorkTimer', async () => {
            const workValue = await settingsModel.getValueWorkInput();
            const workIterationValue = await settingsModel
                .getValueIterationInput();
            const shortBreakValue = await settingsModel
                .getValueShortBreakInput();
            const longBreakValue = await settingsModel.getValueLongBreakInput();
            await this.addNewArray();
            if (this.timer) {
              this.timer.clearTimerCircleInterval();
            }
            this.timer = timerView.init(this.currentTask, false, true,
                workValue.value, false, shortBreakValue.value, false,
                longBreakValue.value, workIterationValue.value);
            buttons.init(false, true);
            document.querySelector('.add_estimation').disabled = true;
            this.displayPlus();
          });
    }
  },

  startPomodoro() {
    if (!this.timerSubscribers.startPomodoro) {
      this.timerSubscribers.startPomodoro = bus
          .subscribe('startPomodoro', async () => {
            const workValue = await settingsModel.getValueWorkInput();
            const workIterationValue = await settingsModel
                .getValueIterationInput();
            await this.addNewArray();
            if (this.timer) {
              this.timer.clearTimerCircleInterval();
            }
            this.timer = timerView.init(this.currentTask, false, true,
                workValue.value, false, false, false,
                false, workIterationValue.value);
            buttons.init(false, true);
            document.querySelector('.add_estimation').disabled = true;
            this.displayPlus();
          });
    }
  },

  failedPomodoro() {
    if (!this.timerSubscribers.failedPomodoro) {
      this.timerSubscribers.failedPomodoro = bus.subscribe('failedPomodoro',
          async (kindPomodoro) => {
            const longBreakValue = await settingsModel.getValueLongBreakInput();
            const workIterationValue = await settingsModel
                .getValueIterationInput();
            this.currentTask.progressBar = await timerService
                .updateProgressBarArrayElement('Tasks',
                    this.currentTask.id, kindPomodoro);
            this.currentTask.failedPomodoros = await tasksService
                .increaseCountFailedPomodoros('Tasks',
                    this.currentTask.id);
            this.currentTask.completedCount = await tasksService
                .increaseCountCompletedCount('Tasks',
                    this.currentTask.id);
            const task = await taskListModel.getTask(this.currentTask.id);
            if (task.completedCount === task.estimation) {
              await taskListModel.changeStatusToCompleted(this.currentTask.id);

              if (this.timer) {
                this.timer.clearTimerCircleInterval();
              }

              this.timer = timerView.init(this.currentTask, false, false,
                  false, false, false, true);
              navigationArrow.init(true, true);
              document.querySelector('.add_estimation')
                  .style.display = 'none';
              document.querySelector('header').style.visibility = 'visible';
              return notification.init(false, false, true);
            }

            if (task.completedCount === workIterationValue.value &&
            task.completedCount !== task.estimation) {
              if (this.timer) {
                this.timer.clearTimerCircleInterval();
              }

              this.timer = timerView.init(this.currentTask, false, false,
                  false, false, false, false, longBreakValue.value);
              buttons.init(false, false, false, false,
                  false, true, false);
              document.querySelector('.add_estimation').disabled = false;
              return notification.init(false, false, false,
                  false, false, false, false,
                  false, false, true);
            }

            if (task.completedCount !== workIterationValue.value &&
            task.completedCount !== task.estimation) {
              const shortBreakValue = await settingsModel
                  .getValueShortBreakInput();

              if (this.timer) {
                this.timer.clearTimerCircleInterval();
              }

              this.timer = timerView.init(this.currentTask, false, false, false,
                  true, shortBreakValue.value, false, false);
              buttons.init(false, false, false, false,
                  false, true);
            }
            document.querySelector('.add_estimation').disabled = false;
            this.displayPlus();
          });
    }
  },

  finishPomodoro() {
    if (!this.timerSubscribers.finishPomodoro) {
      this.timerSubscribers.finishPomodoro = bus
          .subscribe('finishPomodoro', async (kindPomodoro) => {
            const longBreakValue = await settingsModel.getValueLongBreakInput();
            const workIterationValue = await settingsModel
                .getValueIterationInput();
            this.currentTask.progressBar = await timerService
                .updateProgressBarArrayElement('Tasks',
                    this.currentTask.id, kindPomodoro);
            this.currentTask.completedCount = await tasksService
                .increaseCountCompletedCount('Tasks', this.currentTask.id);
            const task = await taskListModel.getTask(this.currentTask.id);
            if (task.completedCount === task.estimation) {
              await taskListModel.changeStatusToCompleted(this.currentTask.id);

              if (this.timer) {
                this.timer.clearTimerCircleInterval();
              }

              this.timer = timerView.init(this.currentTask, false, false,
                  false, false, false, true);
              navigationArrow.init(true, true);
              document.querySelector('.add_estimation')
                  .style.display = 'none';
              document.querySelector('header').style.visibility = 'visible';
              return notification.init(false, false, true);
            }

            if (task.completedCount === workIterationValue.value &&
            task.completedCount !== task.estimation) {
              if (this.timer) {
                this.timer.clearTimerCircleInterval();
              }

              this.timer = timerView.init(this.currentTask, false, false,
                  false, false, false, false, longBreakValue.value);
              buttons.init(false, false, false, false,
                  false, true, true);
              document.querySelector('.add_estimation').disabled = false;
              return notification.init(false, false, false,
                  false, false, false, false, false, false, true);
            }

            if (task.completedCount !== workIterationValue.value &&
            task.completedCount !== task.estimation) {
              const shortBreakValue = await settingsModel
                  .getValueShortBreakInput();

              if (this.timer) {
                this.timer.clearTimerCircleInterval();
              }

              this.timer = timerView.init(this.currentTask, false, false, false,
                  true, shortBreakValue.value, false, false);
              buttons.init(false, false, false, false, false,
                  true, true);
            }
            document.querySelector('.add_estimation').disabled = false;
            this.displayPlus();
            return notification.init(false, false, false,
                false, false, false, false, false,
                false, false, true);
          });
    }
  },

  finishTask() {
    if (!this.timerSubscribers.finishTask) {
      this.timerSubscribers.finishTask = bus
          .subscribe('finishTask', async () => {
            await taskListModel.changeStatusToCompleted(this.currentTask.id);
            timerView.init(this.currentTask, false, false, false, false,
                false, true);
            navigationArrow.init(true, true);
            document.querySelector('.add_estimation')
                .style.display = 'none';
            return notification.init(false, false, true);
          });
    }
  },

  toReports() {
    if (!this.timerSubscribers.toReports) {
      this.timerSubscribers.toReports = bus
          .subscribe('toReports', async () => {
            this.router.navigate('reports/day/tasks');
            document.querySelector('#block-header-title')
                .style.visibility = 'visible';
            document.getElementById('icon-list')
                .classList.remove('active');
            document.getElementById('icon-statistics')
                .classList.add('active');
            document.getElementById('icon-settings')
                .classList.remove('active');
            document.getElementById('icon-trash')
                .classList.remove('active');
          });
    }
  },
};
