/** @module taskListModel */
import {tasksService} from '../../../services/tasks.service';

/**
 * @property {object} taskListModel - taskList page of application
 * @property {method} taskListModel.addTask - Initialization a new taskListModel
 component
 * @property {method} taskListModel.getTask - Get a task by id from DB
 * @property {method} taskListModel.getTasks - Get all of tasks from DB
 * @property {method} taskListModel.getPriorityTasks - Get tasks by priority
 from DB
 * @property {method} taskListModel.toDaily - Add selected global
 task to daily task
 * @property {method} taskListModel.activeStatus -Change status a task to active
 * @property {method} taskListModel.deleteTask - Delete selected task
 * @property {method} taskListModel.addTaskToRemoveArray - Add task to the
 removeArray
 * @property {method} taskListModel.deleteTaskFromRemoveArray - Delete task from
 the removeArray
 * @property {method} taskListModel.deleteArrayTasks - Delete an array selected
 tasks
 * @property {method} taskListModel.getDoneArrayTasks -Get array with done tasks
 * @property {method} taskListModel.changeStatusToCompleted - Change a task
 status to completed
 */
export const taskListModel = {

  async addTask(entity) {
    await tasksService.saveTask('Tasks', entity);
  },

  async getTask(id) {
    return await tasksService.getTask('Tasks', id);
  },

  async getTasks() {
    return await tasksService.getTasks('Tasks');
  },

  async getPriorityTasks() {
    return await tasksService.getTasksPriority('Tasks');
  },

  async toDaily(id) {
    return await tasksService.addTaskToDaily('Tasks', id);
  },

  async activeStatus(id) {
    return await tasksService.changeStatusToActive('Tasks', id);
  },

  async deleteTask(id) {
    await tasksService.deleteTask('Tasks', id);
  },

  async addTaskToRemoveArray(id) {
    await tasksService.addTaskToRemoveArray('Tasks', id);
  },

  async deleteTaskFromRemoveArray(id) {
    await tasksService.deleteTaskFromRemoveArray('Tasks', id);
  },

  async deleteArrayTasks() {
    await tasksService.deleteTaskArray('Tasks');
  },

  async getDoneArrayTasks() {
    return await tasksService.getDoneTask('Tasks');
  },

  async changeStatusToCompleted(id) {
    return await tasksService.changeStatusToCompleted('Tasks', id);
  },
};
