/** @module taskListController */
import {taskListView} from './task-list.view';
import {taskListModel} from './task-list.model';
import {bus} from '../../../eventBus';
import {router} from '../../../router';
import Modals from '../../../components/modals/modals';
import {tasksService} from '../../../services/tasks.service';
import {timerController} from '../../timer/timer.controller';
import {buttons} from '../../../components/buttons/buttons';
import {notification} from '../../../components/notification/notification';

/**
 * @property {object} taskListController - taskList page of application.
 * @property {method} taskListController.init - Initialization a new tasks-list
 page component.
 * @property {method} taskListController.skip - Navigate to tasks.
 * @property {method} taskListController.visibleModal -Show a modal on the page.
 * @property {method} taskListController.addTask - Add tasks to DB.
 * @property {method} taskListController.addTaskToDaily - Add selected global
 task to daily task.
 * @property {method} taskListController.editTask - Edit selected tasks.
 * @property {method} taskListController.showModalDeleteTask - Show a modal
 window delete a task.
 * @property {method} taskListController.deleteThisTask - Delete selected task.
 * @property {method} taskListController.removeMode - On or off remove mode.
 * @property {method} taskListController.deleteArrayTasks - Delete an array
 selected tasks.
 * @property {method} taskListController.goToTimer - Navigate to timer page.
 * @property {method} taskListController.selectTaskDaily - Select all a daily
 tasks.
 * @property {method} taskListController.deselectAllTask - Deselect all tasks.
 * @property {method} taskListController.selectTaskGlobal - Select all a global
 tasks.
*/
export const taskListController = {
  init(firstVisit, removeMode) {
    this.router = router;
    taskListView.init(firstVisit, removeMode);
    this.skip();
    this.visibleModal();
    this.addTaskToDaily();
    this.editTask();
    this.showModalDeleteTask();
    this.deleteThisTask();
    this.removeMode();
    this.deleteArrayTasks();
    this.goToTimer();
    this.selectTaskDaily();
    this.deselectAllTask();
    this.selectTaskGlobal();
    this.addTask();
  },

  taskListSubscribers: {},

  skip() {
    if (!this.taskListSubscribers.toTasks) {
      this.taskListSubscribers.toTasks = bus.subscribe('toTasks', () => {
        document.getElementById('icon-list').classList.add('active');
        document.getElementById('icon-statistics')
            .classList.remove('active');
        document.getElementById('icon-settings')
            .classList.remove('active');
        document.getElementById('icon-trash')
            .classList.remove('active');
      });
    }
  },

  visibleModal() {
    if (!this.taskListSubscribers.visibleModal) {
      this.taskListSubscribers.visibleModal = bus.subscribe('showModal', () => {
        new Modals();
      });
    }
  },

  addTask() {
    if (!this.taskListSubscribers.addTusk) {
      this.taskListSubscribers.addTusk = bus.subscribe('addTask',
          async (task) => {
            taskListModel.addTask(task).then((response) => {
              taskListController.init(false);
              if (response) {
                notification.init(false, false, false,
                    false, true);
              } else {
                notification.init(true);
              }
            });
          });
    }
  },

  addTaskToDaily() {
    if (!this.taskListSubscribers.AddTuskToDaily) {
      this.taskListSubscribers.AddTuskToDaily = bus.
          subscribe('AddTuskToDaily', async (id) => {
            taskListModel.toDaily(id).then((response) => {
              taskListController.init(false);
              if (response) {
                notification.init(false, false, false,
                    false, false, false, false, true);
              } else {
                notification.init(false, false, false,
                    false, false, false, false,
                    false, false, false, false, true);
              }
            });
          });
    }
  },

  editTask() {
    if (!this.taskListSubscribers.editTask) {
      this.taskListSubscribers.editTask = bus.subscribe('editTask',
          (task) => {
            new Modals(task);
          });
    }
  },

  showModalDeleteTask() {
    if (!this.taskListSubscribers.showModalDeleteTask) {
      this.taskListSubscribers.showModalDeleteTask = bus.
          subscribe('showModalDeleteTask', (task) => {
            buttons.init(false, false, false, false, true);
            new Modals(task, true);
          });
    }
  },

  deleteThisTask() {
    if (!this.taskListSubscribers.deleteThisTask) {
      this.taskListSubscribers.deleteThisTask = bus.subscribe('deleteThisTask',
          async (task) => {
            taskListModel.deleteTask(task).then((response) => {
              if (response) {
                notification.init(false, false, false,
                    false, false, true);
              } else {
                notification.init(false, true);
              }
              taskListController.init(false);
            });
          });
    }
  },

  removeMode() {
    if (!this.taskListSubscribers.removeMode) {
      this.taskListSubscribers.removeMode = bus.subscribe('removeMode',
          (clicks) => {
            if (tasksService.removeTask.length === 0 && clicks > 1) {
              bus.post('refreshClicks');
              return taskListController.init(false, false);
            }
            if (tasksService.removeTask.length !== 0 && clicks > 1) {
              buttons.init(false, false, false, false, true);
              return new Modals(false, true);
            }
            return taskListController.init(false, true);
          });
    }
  },

  deleteArrayTasks() {
    if (!this.taskListSubscribers.deleteArrayTask) {
      this.taskListSubscribers.deleteArrayTask = bus
          .subscribe('deleteArrayTasks',
              async () => {
                await taskListModel.deleteArrayTasks().then((response) => {
                  document.getElementById('icon-trash').innerHTML = '';
                  taskListController.init(false);
                  if (response) {
                    notification.init(false, false,
                        false, false, false, true);
                  } else {
                    notification.init(false, true);
                  }
                });
              });
    }
  },

  goToTimer() {
    if (!this.taskListSubscribers.goToTimer) {
      this.taskListSubscribers.goToTimer = bus.subscribe('goToTimer',
          async (id) => {
            await taskListModel.getTasks('Tasks');
            this.router.navigate('timer');
            timerController.init(await taskListModel.getTask(id));
            await taskListModel.activeStatus(id);
          });
    }
  },

  selectTaskDaily() {
    if (!this.taskListSubscribers.selectAllDailyTask) {
      this.taskListSubscribers.selectAllDailyTask = bus.
          subscribe('selectAllDailyTask', async () => {
            await tasksService.addSelectDailyTasks();
          });
    }
  },

  deselectAllTask() {
    if (!this.taskListSubscribers.deselectAllTask) {
      this.taskListSubscribers.deselectAllTask = bus.
          subscribe('deselectAllTask', async () => {
            await tasksService.deSelectTAsks();
          });
    }
  },

  selectTaskGlobal() {
    if (!this.taskListSubscribers.selectAllGlobalTask) {
      this.taskListSubscribers.selectAllGlobalTask = bus.
          subscribe('selectAllGlobalTask', async () => {
            await tasksService.addSelectGlobalTAsks();
          });
    }
  },

};
