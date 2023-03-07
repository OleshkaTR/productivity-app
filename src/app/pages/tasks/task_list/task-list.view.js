/** @module taskListView */

import {router} from '../../../router';
import * as markup from './task_list.hbs';
import Tasks from '../tasks/tasks';
import {taskListModel} from './task-list.model';
import {bus} from '../../../eventBus';

import('./task_list.less');

/**
 * @property {object} taskListView - taskList page of application
 * @property {method} taskListModel.init - Add a task to DB
 * @property {method} taskListModel.render - Render on page all of tasks from DB
 * @property {method} taskListModel.show - Show markup of page if dont't have
 any tasks left
 * @property {method} taskListModel.markup - Show markup of page if site first
 time visited
 * @property {method} taskListModel.addEventListeners - Tasks list page event
 listeners
 */
export const taskListView = {
  init(firstVisit, removeMode) {
    this.container = document.getElementById('main');
    this.render(firstVisit, removeMode);
    this.router = router;
  },

  async render(firstVisit, removeMode) {
    if (firstVisit) {
      this.container.innerHTML = this.markup();
      this.addEventListeners();
    } else if (!firstVisit) {
      const tasks = await taskListModel.getTasks();
      const priorityTasks = await taskListModel.getPriorityTasks();
      const completeTasks = await taskListModel.getDoneArrayTasks();
      const isTasksExist = tasks.global.work.length +
        tasks.global.education.length +
        tasks.global.hobby.length +
        tasks.global.sport.length +
        tasks.global.other.length +
        tasks.daily.length;
      if (sessionStorage.getItem('wasTask') && !isTasksExist) {
        sessionStorage.removeItem('wasTask');
        sessionStorage.setItem('emptyArray', 'true');
        document.querySelector('#header-title')
            .innerText = 'Daily Task List';
        document.querySelector('#specific_add').style.display = 'block';
        document.getElementById('icon-trash').style.display = 'inline';
        this.container.innerHTML = this.show();
        return this.addEventListeners();
      }
      this.container.innerHTML = this.markup();
      this.container.innerHTML = markup({
        tasks,
        isTasksExist,
        priorityTasks,
        completeTasks,
      });
      if (isTasksExist) {
        sessionStorage.removeItem('emptyArray');
        new Tasks('tasks', tasks, priorityTasks, removeMode,
            completeTasks);
        document.getElementById('icon-trash').style.display = 'inline';
      }
      document.querySelector('#header-title')
          .innerText = 'Daily Task List';
      document.querySelector('#specific_add')
          .style.display = 'block';
      document.getElementById('icon-trash')
          .style.visibility = 'visible';
      document.getElementById('icon-trash')
          .style.display = 'inline';
      document.getElementById('icon-add')
          .style.display = 'inline';
      this.addEventListeners();
    }
  },

  show() {
    return '<div class="none">' +
      '<h2 class="h-inline white-text">Daily Task List</h2>' +
      '<a><span class="icon-add white-text fs-add add-task"></span></a>' +
      '</div>' +
      '<figure>' +
      '<p><img class="img-addv02" src="/images/tomato-addv02.svg"' +
      ' alt="Tomato settings" /></p>' +
      '<figcaption class="add-text">You don’t have any tasks left.' +
      ' Add new tasks to stay productive.</figcaption>' +
      '</figure>';
  },

  markup() {
    return '<div class="none">' +
      '<h2 class="h-inline white-text">Daily Task List</h2>' +
      '<a><span class="icon-add white-text fs-add add-task"></span></a>' +
      '</div>' +
      '<figure>' +
      '<p><img class="img-add" src="/images/tomato_settings.svg" ' +
      'alt="Tomato settings"/></p>\n' +
      '<figcaption class="first-entrance-text">' +
      'As you visited site for a first time you can check and customize' +
      ' your default application settings' +
      '</figcaption>' +
      '</figure>' +
      '<div class="btns">' +
      '   <button id="skip" class="btn btn-skip">Skip</button>' +
      '   <button id="go_to_settings" class="btn btn-transition">' +
      'Go to settings' +
      '</button>' +
      '</div>';
  },

  addEventListeners() {
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-transition')) {
        this.router.navigate('settings/pomodoros');
      }
      if (e.target.classList.contains('btn-skip')) {
        window.location.reload();
      }
    });

    document.querySelector('.add-task').addEventListener('click', () => {
      bus.post('showModal');
    });
  },
};
