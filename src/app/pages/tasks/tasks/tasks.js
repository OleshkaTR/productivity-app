import {bus} from '../../../eventBus';
import Task from '../task/task';
import * as markup from './tasks.hbs';
import {taskListModel} from '../task_list/task-list.model';
import {router} from '../../../router';

import('./tasks.less');
import('../../../components/modals/modals.less');

/** @class Tasks */
class Tasks {
  /**
   * @constructor Create a new instance of Tasks class
   * @param {string} containerId - Container ID
   * @param {array} tasksArray - Array with all of tasks
   * @param {array} priorityArray - Array with all of tasks sorted by priority
   * @param {boolean} removeMode - On or off remove mode
   * @param {array} completeTasksArray - Array with all of completed tasks
   */
  constructor(containerId, tasksArray, priorityArray, removeMode,
      completeTasksArray) {
    this.container = document.getElementById(containerId);
    this.tasksArray = tasksArray;
    this.priorityArray = priorityArray;
    this.removeMode = removeMode;
    this.completeTasksArray = completeTasksArray;
    this.render();
    this.router = router;
    this.globalTaskWrapper = document.getElementById('global-wrapper');
    this.urgentTaskWrapper = document.getElementById('urgent');
    this.hightTaskWrapper = document.getElementById('high');
    this.middleTaskWrapper = document.getElementById('middle');
    this.lowTaskWrapper = document.getElementById('low');
    this.arrow = document.getElementById('arrow');
    this.wrapperGlobalTasks = document
        .getElementById('wrapper-global-tasks');
    this.doTasks = document.getElementById('daily-task');
    this.doneTasks = document.getElementById('daily-task-done');
    this.doTab = document.getElementById('do');
    this.doneTab = document.getElementById('done');
    this.allTasks = document.getElementById('all-tasks');
    this.urgenrTasks = document.getElementById('urgent-tasks');
    this.highTasks = document.getElementById('high-tasks');
    this.middleTasks = document.getElementById('middle-tasks');
    this.lowTasks = document.getElementById('low-tasks');
  }

  /** @description Render tasks in a tasks-list page */
  render() {
    this.tasksArray.removeMode = this.removeMode;
    this.container.innerHTML = markup(this.tasksArray,
        this.priorityArray,
        this.completeTasksArray);

    if (!this.completeTasksArray.length && !this.tasksArray.daily.length) {
      document.getElementById('daily-task')
          .insertAdjacentHTML('beforeend',
              '<div class="text-center">' +
          '<div class="default-color text-task-added">Task added, move it' +
          ' to the top 5 in daily task list</div>' +
          '<span class="icon-arrow_circle default-color fs-icon"></span>' +
          '</div>');
    }
    if (this.completeTasksArray.length &&
      sessionStorage.getItem('wasTask') && !this.tasksArray.daily.length) {
      document.getElementById('daily-task')
          .insertAdjacentHTML('beforeend',
              '<div class="text-center">' +
          '<p class="default-color text-task-added">Excellent,</p>' +
          '<p class="default-color text-task-added">all daily tasks done :)' +
          '</p>' +
          '</div>');
    }

    this.tasksArray.daily.forEach((item) => {
      new Task('daily-task',
          {...item, removeMode: this.removeMode});
    });

    this.tasksArray.global.work.forEach((item) => {
      new Task('global-work',
          {...item, removeMode: this.removeMode});
    });
    this.tasksArray.global.education.forEach((item) => {
      new Task('global-education',
          {...item, removeMode: this.removeMode});
    });
    this.tasksArray.global.hobby.forEach((item) => {
      new Task('global-hobby',
          {...item, removeMode: this.removeMode});
    });
    this.tasksArray.global.sport.forEach((item) => {
      new Task('global-sport',
          {...item, removeMode: this.removeMode});
    });
    this.tasksArray.global.other.forEach((item) => {
      new Task('global-other',
          {...item, removeMode: this.removeMode});
    });


    this.priorityArray.urgent.forEach((item) => {
      new Task('urgent', {...item, removeMode: this.removeMode});
    });
    this.priorityArray.high.forEach((item) => {
      new Task('high', {...item, removeMode: this.removeMode});
    });
    this.priorityArray.middle.forEach((item) => {
      new Task('middle', {...item, removeMode: this.removeMode});
    });
    this.priorityArray.low.forEach((item) => {
      new Task('low', {...item, removeMode: this.removeMode});
    });


    this.completeTasksArray.forEach((item) => {
      new Task('daily-task-done',
          {...item, removeMode: this.removeMode});
    });

    this.addEventListener();
  }

  /** @description Events for all tasks on the tasks-list page */
  addEventListener() {
    this.container.addEventListener('click', async (e) => {
      e.preventDefault();
      if (e.target.classList.contains('icon-global-list-arrow-down')) {
        this.arrow.classList.toggle('active');
        this.wrapperGlobalTasks.classList.toggle('hide');
      }
      if (e.target.classList.contains('all-tasks')) {
        this.globalTaskWrapper.style.display = 'block';
        this.urgentTaskWrapper.style.display = 'none';
        this.hightTaskWrapper.style.display = 'none';
        this.middleTaskWrapper.style.display = 'none';
        this.lowTaskWrapper.style.display = 'none';

        this.allTasks.classList.add('active');
        this.urgenrTasks.classList.remove('active');
        this.highTasks.classList.remove('active');
        this.middleTasks.classList.remove('active');
        this.lowTasks.classList.remove('active');
      }
      if (e.target.classList.contains('urgent-tasks')) {
        this.globalTaskWrapper.style.display = 'none';
        this.urgentTaskWrapper.style.display = 'block';
        this.hightTaskWrapper.style.display = 'none';
        this.middleTaskWrapper.style.display = 'none';
        this.lowTaskWrapper.style.display = 'none';

        this.allTasks.classList.remove('active');
        this.urgenrTasks.classList.add('active');
        this.highTasks.classList.remove('active');
        this.middleTasks.classList.remove('active');
        this.lowTasks.classList.remove('active');
      }
      if (e.target.classList.contains('high-tasks')) {
        this.globalTaskWrapper.style.display = 'none';
        this.urgentTaskWrapper.style.display = 'none';
        this.hightTaskWrapper.style.display = 'block';
        this.middleTaskWrapper.style.display = 'none';
        this.lowTaskWrapper.style.display = 'none';

        this.allTasks.classList.remove('active');
        this.urgenrTasks.classList.remove('active');
        this.highTasks.classList.add('active');
        this.middleTasks.classList.remove('active');
        this.lowTasks.classList.remove('active');
      }
      if (e.target.classList.contains('middle-tasks')) {
        this.globalTaskWrapper.style.display = 'none';
        this.urgentTaskWrapper.style.display = 'none';
        this.hightTaskWrapper.style.display = 'none';
        this.middleTaskWrapper.style.display = 'block';
        this.lowTaskWrapper.style.display = 'none';

        this.allTasks.classList.remove('active');
        this.urgenrTasks.classList.remove('active');
        this.highTasks.classList.remove('active');
        this.middleTasks.classList.add('active');
        this.lowTasks.classList.remove('active');
      }
      if (e.target.classList.contains('low-tasks')) {
        this.globalTaskWrapper.style.display = 'none';
        this.urgentTaskWrapper.style.display = 'none';
        this.hightTaskWrapper.style.display = 'none';
        this.middleTaskWrapper.style.display = 'none';
        this.lowTaskWrapper.style.display = 'block';

        this.allTasks.classList.remove('active');
        this.urgenrTasks.classList.remove('active');
        this.highTasks.classList.remove('active');
        this.middleTasks.classList.remove('active');
        this.lowTasks.classList.add('active');
      }

      const idTask = e.target.parentNode.id;
      if (e.target.classList.contains('icon-arrows-up')) {
        bus.post('AddTuskToDaily', idTask);
      }
      if (e.target.classList.contains('icon-edit')) {
        bus.post('editTask', await taskListModel.getTask(idTask));
      }
      if (e.target.classList.contains('trash')) {
        bus.post('showModalDeleteTask',
            await taskListModel.getTask(idTask));
      }
      if (e.target.classList.contains('block-trash')) {
        await taskListModel.addTaskToRemoveArray(idTask);
        document.getElementById(`icon-trash-${idTask}`)
            .style.display = 'none';
        document.getElementById(`icon-close-${idTask}`)
            .style.display = 'block';
      }
      if (e.target.classList.contains('block-close')) {
        await taskListModel.deleteTaskFromRemoveArray(idTask);
        document.getElementById(`icon-trash-${idTask}`)
            .style.display = 'block';
        document.getElementById(`icon-close-${idTask}`)
            .style.display = 'none';
      }
      if (e.target.classList.contains('on-pomodoro-daily')) {
        bus.post('goToTimer', idTask);
      }
      if (e.target.classList.contains('select-daily')) {
        bus.post('selectAllDailyTask');
        document.querySelectorAll('.trash-daily')
            .forEach((el) => el.style.display = 'none');
        document.querySelectorAll('.close-daily')
            .forEach((el) => el.style.display = 'block');
      }
      if (e.target.classList.contains('deselect-daily')) {
        bus.post('deselectAllTask');
        document.querySelectorAll('.trash-daily')
            .forEach((el) => el.style.display = 'block');
        document.querySelectorAll('.close-daily')
            .forEach((el) => el.style.display = 'none');
      }
      if (e.target.classList.contains('select-global')) {
        bus.post('selectAllGlobalTask');
        document.querySelectorAll('.global-trash')
            .forEach((el) => el.style.display = 'none');
        document.querySelectorAll('.global-close')
            .forEach((el) => el.style.display = 'block');
      }
      if (e.target.classList.contains('deselect-global')) {
        bus.post('deselectAllTask');
        document.querySelectorAll('.global-trash')
            .forEach((el) => el.style.display = 'block');
        document.querySelectorAll('.global-close')
            .forEach((el) => el.style.display = 'none');
      }
      if (e.target.classList.contains('done')) {
        this.doTasks.style.display = 'none';
        this.doneTasks.style.display = 'block';
        this.doTab.classList.remove('active');
        this.doneTab.classList.add('active');
        this.wrapperGlobalTasks.style.display = 'none';
      }
      if (e.target.classList.contains('do')) {
        this.doTasks.style.display = 'block';
        this.doneTasks.style.display = 'none';
        this.doTab.classList.add('active');
        this.doneTab.classList.remove('active');
        this.wrapperGlobalTasks.style.display = 'block';
      }
    });
  }
}

export default Tasks;
