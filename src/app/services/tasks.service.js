import {httpService} from './http.service';
import {TaskStatus} from '../constants/task-status';
import {categoryId} from '../constants/categoryId';
import {priority} from '../constants/priority';
import {bus} from '../eventBus';

/** @class TasksService */
class TasksService {
  /**
   * @constructor Create a new instance of tasks service class
   * @param httpService - httpService
   */
  constructor(httpService) {
    this.httpService = httpService;
    this.countTasks = 0;
  }

  cachedTasks = {
    global: {
      work: [],
      education: [],
      hobby: [],
      sport: [],
      other: [],
    },
    daily: [],
  };

  priorityTasks = {
    urgent: [],
    high: [],
    middle: [],
    low: [],
  };

  removeTask = [];

  doneTask = [];

  /**
   * @description Get task by id from DB
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   * @return {object} - Return task by id
   */
  async getTask(collectionName, id) {
    const tasks = await this.httpService.get(collectionName);
    const findTask = tasks.find((task) => task.id === id);
    return findTask;
  }

  /**
   * @description Get all tasks from DB
   * @param {string} collectionName - Collection name
   * @return {object} - Return object with all tasks
   */
  async getTasks(collectionName) {
    if (!this.cachedTasks.length) {
      const tasks = (await this.httpService.get(collectionName))
          .map((element) => Object.assign({}, element, {
            daily: element.status === TaskStatus.DAILY_LIST,
          }));
      const processedTasks = {
        global: {
          work: tasks.filter((task) => {
            return task.status === TaskStatus.GLOBAL_LIST &&
              task.categoryId === categoryId.work;
          }),
          education: tasks.filter((task) => {
            return task.status === TaskStatus.GLOBAL_LIST &&
              task.categoryId === categoryId.education;
          }),
          hobby: tasks.filter((task) => {
            return task.status === TaskStatus.GLOBAL_LIST &&
              task.categoryId === categoryId.hobby;
          }),
          sport: tasks.filter((task) => {
            return task.status === TaskStatus.GLOBAL_LIST &&
              task.categoryId === categoryId.sport;
          }),
          other: tasks.filter((task) => {
            return task.status === TaskStatus.GLOBAL_LIST &&
              task.categoryId === categoryId.other;
          }),
        },
        daily: tasks.filter((task) => {
          return task.status === TaskStatus.DAILY_LIST;
        }),
      };
      this.cachedTasks = processedTasks;
    }
    return this.cachedTasks;
  }

  /**
   * @description Get all tasks sorted by id from DB
   * @param {string} collectionName - Collection name
   * @return {object} - Return object with all tasks sorted by id
   */
  async getTasksPriority(collectionName) {
    if (!this.priorityTasks.length) {
      const tasks = await this.httpService.get(collectionName);
      const processedPriorityTasks = {
        urgent: tasks.filter((task) => {
          return task.status === TaskStatus.GLOBAL_LIST &&
            task.priority === priority.urgent;
        }),
        high: tasks.filter((task) => {
          return task.status === TaskStatus.GLOBAL_LIST &&
            task.priority === priority.high;
        }),
        middle: tasks.filter((task) => {
          return task.status === TaskStatus.GLOBAL_LIST &&
            task.priority === priority.middle;
        }),
        low: tasks.filter((task) => {
          return task.status === TaskStatus.GLOBAL_LIST &&
            task.priority === priority.low;
        }),
      };
      this.priorityTasks = processedPriorityTasks;
    }
    return this.priorityTasks;
  }

  /**
   * @description Save task in the DB
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   */
  async saveTask(collectionName, id) {
    await this.httpService.put(collectionName, id);
  }

  /**
   * @description Change task status to daily
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   */
  async addTaskToDaily(collectionName, id) {
    const tasks = await this.httpService.get(collectionName);
    const findTask = tasks.find((task) => task.id === id);
    const newDeadLine = new Date();
    findTask.deadlineDate = {
      day: newDeadLine.getDate(),
      month: newDeadLine.toLocaleString('en', {month: 'short'}).toUpperCase(),
      year: newDeadLine.getFullYear(),
    };
    findTask.status = 'DAILY_LIST';
    await this.httpService.put(collectionName, findTask);
    await this.getTasks(collectionName);
  }

  /**
   * @description Change task status to active
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   */
  async changeStatusToActive(collectionName, id) {
    const tasks = await this.httpService.get(collectionName);
    const findTask = tasks.find((task) => task.id === id);
    findTask.status = 'ACTIVE';
    await this.httpService.put(collectionName, findTask);
    await this.getTasks(collectionName);
  }

  /**
   * @description Delete selected task
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   */
  async deleteTask(collectionName, id) {
    await this.httpService.delete(collectionName, id);
    await this.getTasks(collectionName);
  }

  /**
   * @description Add selected task to removeArray
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   */
  async addTaskToRemoveArray(collectionName, id) {
    const tasks = await this.httpService.get(collectionName);
    const findTask = tasks.find((task) => task.id === id);

    if (!this.removeTask.includes(findTask)) {
      this.removeTask.push(findTask);
      this.countTasks = this.removeTask.length;
    }

    bus.post('CountDeleteTasks', this.countTasks);
  }

  /** @description Add all tasks of daily task list to removeArray */
  async addSelectDailyTasks() {
    this.removeTask = [...this.cachedTasks.daily];
    this.countTasks = this.removeTask.length;
    bus.post('CountDeleteTasks', this.countTasks);
  }

  /** @description Deselect all tasks of task list from removeArray */
  async deSelectTAsks() {
    this.removeTask = [];
    this.countTasks = this.removeTask.length;
    bus.post('CountDeleteTasks', this.countTasks);
  }

  /** @description Add all tasks of global task list to removeArray */
  async addSelectGlobalTAsks() {
    this.removeTask = [...this.cachedTasks.global.sport,
      ...this.cachedTasks.global.work, ...this.cachedTasks.global.hobby,
      ...this.cachedTasks.global.education, ...this.cachedTasks.global.other];
    this.countTasks = this.removeTask.length;
    bus.post('CountDeleteTasks', this.countTasks);
  }

  /**
   * @description Deselect all task from removeArray
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   */
  async deleteTaskFromRemoveArray(collectionName, id) {
    const findTaskById = this.removeTask.find((task) => task.id === id);
    const findTaskByIndex = this.removeTask.indexOf(findTaskById);
    let countTasks = 0;

    if (findTaskByIndex > -1) {
      this.removeTask.splice(findTaskByIndex, 1);
      countTasks = this.removeTask.length;
    }
    bus.post('CountDeleteTasks', countTasks);
  }

  /**
   * @description Delete all task in removeArray from DB
   * @param {string} collectionName - Collection name
   */
  async deleteTaskArray(collectionName) {
    for (const task of this.removeTask) {
      await this.httpService.delete(collectionName, task);
      await this.getTasks(collectionName);
    }
    this.removeTask = [];
  }

  /**
   * @description Get task with active status
   * @param {string} collectionName - Collection name
   * @return {string} - Return a task's id
   */
  async getActiveTask(collectionName) {
    const tasks = await this.httpService.get(collectionName);
    const findActiveTask = tasks
        .find((task) => task.status === TaskStatus.ACTIVE);
    return findActiveTask.id;
  }

  /**
   * @description Get task with completed status
   * @param {string} collectionName - Collection name
   * @return {array} - Return an array done tasks
   */
  async getDoneTask(collectionName) {
    const tasks = await this.httpService.get(collectionName);
    const findDoneTask = tasks
        .filter((task) => task.status === TaskStatus.COMPLETED);
    this.doneTask = findDoneTask;
    return this.doneTask;
  }

  /**
   * @description Chenge task's status to completed
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   */
  async changeStatusToCompleted(collectionName, id) {
    const tasks = await this.httpService.get(collectionName);
    const findTask = tasks.find((task) => task.id === id);
    findTask.completeDate = new Date();
    findTask.status = 'COMPLETED';
    await this.httpService.put(collectionName, findTask);
    await this.getTasks(collectionName);
  }

  /**
   * @description Increase a completed count
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   */
  async increaseCountCompletedCount(collectionName, id) {
    const tasks = await this.httpService.get(collectionName);
    const findTask = tasks.find((task) => task.id === id);
    findTask.completedCount++;
    await this.httpService.put(collectionName, findTask);
    await this.getTasks(collectionName);
  }

  /**
   * @description Increase a count failed pomodoros
   * @param {string} collectionName - Collection name
   * @param {string} id - Name selected field
   */
  async increaseCountFailedPomodoros(collectionName, id) {
    const tasks = await this.httpService.get(collectionName);
    const findTask = tasks.find((task) => task.id === id);
    findTask.failedPomodoros++;
    await this.httpService.put(collectionName, findTask);
    await this.getTasks(collectionName);
  }
}

export const tasksService = new TasksService(httpService);
