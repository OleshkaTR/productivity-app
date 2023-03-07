import {httpService} from './http.service';
import {TaskStatus} from '../constants/task-status';
import {priority} from '../constants/priority';

/** @class ReportsService */
class ReportsService {
  /**
   * @constructor Create a new instance of report service class
   * @param httpService - httpService
   */
  constructor(httpService) {
    this.httpService = httpService;
  }

  filteredObjDoneTasks = {
    day: {
      urgent: [],
      high: [],
      middle: [],
      low: [],
      failed: {
        urgent: [],
        high: [],
        middle: [],
        low: [],
      },
    },
    week: [],
    month: [],
  };

  /**
   * @description Find out today
   * @param {any} date - Task completed date
   * @return {boolean|boolean} Is it Today?
   */
  isToday = (date) => {
    const today = new Date();
    const someDayInMilliseconds = date?.seconds * 1000;

    return today.setHours(0, 0, 0, 1) <=
      someDayInMilliseconds &&
      someDayInMilliseconds <= today.setHours(23, 59);
  };

  /**
   * @description Find out week
   * @param {any} date - Task completed date
   * @return {boolean|boolean} This week?
   */
  inDateInThisWeek(date) {
    const today = new Date();
    const millisecondsInTheWeek = 604800000;
    const firstDayInWeek = today - millisecondsInTheWeek;
    const CompleteDateInMilliseconds = date?.seconds * 1000;

    return firstDayInWeek <= CompleteDateInMilliseconds &&
      CompleteDateInMilliseconds <= today.setHours(23, 59);
  }

  /**
   * @description Find out month
   * @param {any} date - Task completed date
   * @return {boolean|boolean} This month?
   */
  isDateInThisMonth(date) {
    const today = new Date();
    const millisecondsInThirtyDays = 2592000000;
    const firstDayInTheMonth = today - millisecondsInThirtyDays;
    const CompleteDateInMilliseconds = date?.seconds * 1000;

    return firstDayInTheMonth <= CompleteDateInMilliseconds &&
      CompleteDateInMilliseconds <= today.setHours(23, 59);
  }

  /**
   * @description Calculated successfully tasks
   * @param {number} completedCount - completed count
   * @param {number} failedPomodoro - count failed pomodoro
   * @return {boolean} Is it more completed сount then count failed pomodoro?
   */
  calculateSuccessfullyTasks(completedCount, failedPomodoro) {
    const calc = completedCount - failedPomodoro;
    return calc >= failedPomodoro;
  }

  /**
   * @description Get filtered done tasks in object
   * @param {string} collectionName - The name of the collection with tasks
   * @return {Promise<{week: [], month: [], day: {high: [], middle: [], low: [],
   * failed: {high: [], middle: [], low: [], urgent: []}, urgent: []}}>
   * } Object with done tasks
   */
  async getFilteredDoneTask(collectionName) {
    if (!this.filteredObjDoneTasks.length) {
      const tasks = await this.httpService.get(collectionName);
      const findDoneTaskByPriority = {
        day: {
          urgent: tasks.filter((task) => {
            return task.status === TaskStatus.COMPLETED &&
              this.isToday(task.completeDate) &&
              task.priority === priority.urgent &&
              this.calculateSuccessfullyTasks(task.completedCount,
                  task.failedPomodoros);
          }),
          high: tasks.filter((task) => {
            return task.status === TaskStatus.COMPLETED &&
              this.isToday(task.completeDate) &&
              task.priority === priority.high &&
              this.calculateSuccessfullyTasks(task.completedCount,
                  task.failedPomodoros);
          }),
          middle: tasks.filter((task) => {
            return task.status === TaskStatus.COMPLETED &&
              this.isToday(task.completeDate) &&
              task.priority === priority.middle &&
              this.calculateSuccessfullyTasks(task.completedCount,
                  task.failedPomodoros);
          }),
          low: tasks.filter((task) => {
            return task.status === TaskStatus.COMPLETED &&
              this.isToday(task.completeDate) &&
              task.priority === priority.low &&
              this.calculateSuccessfullyTasks(task.completedCount,
                  task.failedPomodoros);
          }),
          failed: {
            urgent: tasks.filter((task) => {
              return task.status === TaskStatus.COMPLETED &&
                this.isToday(task.completeDate) &&
                task.priority === priority.urgent &&
                this.calculateSuccessfullyTasks(task.completedCount,
                    task.failedPomodoros) === false;
            }),
            high: tasks.filter((task) => {
              return task.status === TaskStatus.COMPLETED &&
                this.isToday(task.completeDate) &&
                task.priority === priority.high &&
                this.calculateSuccessfullyTasks(task.completedCount,
                    task.failedPomodoros) === false;
            }),
            middle: tasks.filter((task) => {
              return task.status === TaskStatus.COMPLETED &&
                this.isToday(task.completeDate) &&
                task.priority === priority.middle &&
                this.calculateSuccessfullyTasks(task.completedCount,
                    task.failedPomodoros) === false;
            }),
            low: tasks.filter((task) => {
              return task.status === TaskStatus.COMPLETED &&
                this.isToday(task.completeDate) &&
                task.priority === priority.low &&
                this.calculateSuccessfullyTasks(task.completedCount,
                    task.failedPomodoros) === false;
            }),
          },
        },
        week: tasks.filter((task) => {
          return task.status === TaskStatus.COMPLETED &&
            this.inDateInThisWeek(task.completeDate);
        }),
        month: tasks.filter((task) => {
          return task.status === TaskStatus.COMPLETED &&
            this.isDateInThisMonth(task.completeDate);
        }),
      };
      this.filteredObjDoneTasks = findDoneTaskByPriority;
    }
    return this.filteredObjDoneTasks;
  }

  secondsOnDay = 86400000;

  /**
   * @description amount successful completed pomodoro
   * @param {array} src
   * @return {number} Amount completed pomodoro
   */
  amount = (src) => {
    let amount = 0;
    src.forEach((task) => {
      amount += task.completedCount - task.failedPomodoros;
    });
    return amount;
  };

  /**
   * @description amount failed pomodoro
   * @param {array} src - Array with tasks
   * @return {number} Amount failed pomodoro
   */
  sumFailedPomodoros(src) {
    let amount = 0;
    src.forEach((task) => {
      amount += task.failedPomodoros;
    });
    return amount;
  }

  /**
   * @description Calculated Tasks
   * @param {number} period - Week or Month
   * @param {array} completedTasksArray - Array with tasks
   * @return {{pomodoros: {high: [], middle: [], low: [], failed: {high: [],
   * middle: [],low: [], urgent: []}, urgent: []}, tasks: {high: [], middle: [],
   * low: [], failed: {high: [], middle: [], low: [], urgent: []}, urgent: []}}}
   */
  calculateTasks = (period, completedTasksArray) => {
    const weekObj = {
      tasks: {
        urgent: [],
        high: [],
        middle: [],
        low: [],
        failed: {
          urgent: [],
          high: [],
          middle: [],
          low: [],
        },
      },
      pomodoros: {
        urgent: [],
        high: [],
        middle: [],
        low: [],
        failed: {
          urgent: [],
          high: [],
          middle: [],
          low: [],
        },
      },
    };

    const monthObj = {
      tasks: {
        urgent: [],
        high: [],
        middle: [],
        low: [],
        failed: {
          urgent: [],
          high: [],
          middle: [],
          low: [],
        },
      },
      pomodoros: {
        urgent: [],
        high: [],
        middle: [],
        low: [],
        failed: {
          urgent: [],
          high: [],
          middle: [],
          low: [],
        },
      },
    };

    for (let i = 0; i <= period - 1; i++) {
      const today = new Date();
      const desiredDate = today - i * this.secondsOnDay;
      const tasksDesiredDate = completedTasksArray.filter((task) => {
        return new Date(task.completeDate.seconds * 1000).getDate() ===
          new Date(desiredDate).getDate();
      });
      const doneTaskObj = {
        urgent: tasksDesiredDate.filter((task) => {
          return task.priority === priority.urgent &&
            this.calculateSuccessfullyTasks(task.completedCount,
                task.failedPomodoros);
        }),
        high: tasksDesiredDate.filter((task) => {
          return task.priority === priority.high &&
            this.calculateSuccessfullyTasks(task.completedCount,
                task.failedPomodoros);
        }),
        middle: tasksDesiredDate.filter((task) => {
          return task.priority === priority.middle &&
            this.calculateSuccessfullyTasks(task.completedCount,
                task.failedPomodoros);
        }),
        low: tasksDesiredDate.filter((task) => {
          return task.priority === priority.low &&
            this.calculateSuccessfullyTasks(task.completedCount,
                task.failedPomodoros);
        }),
        failed: {
          urgent: tasksDesiredDate.filter((task) => {
            return task.priority === priority.urgent &&
              this.calculateSuccessfullyTasks(task.completedCount,
                  task.failedPomodoros) === false;
          }),
          high: tasksDesiredDate.filter((task) => {
            return task.priority === priority.high &&
              this.calculateSuccessfullyTasks(task.completedCount,
                  task.failedPomodoros) === false;
          }),
          middle: tasksDesiredDate.filter((task) => {
            return task.priority === priority.middle &&
              this.calculateSuccessfullyTasks(task.completedCount,
                  task.failedPomodoros) === false;
          }),
          low: tasksDesiredDate.filter((task) => {
            return task.priority === priority.low &&
              this.calculateSuccessfullyTasks(task.completedCount,
                  task.failedPomodoros) === false;
          }),
        },
      };
      if (period === 7) {
        weekObj.tasks.urgent.push(doneTaskObj.urgent.length);
        weekObj.tasks.high.push(doneTaskObj.high.length);
        weekObj.tasks.middle.push(doneTaskObj.middle.length);
        weekObj.tasks.low.push(doneTaskObj.low.length);
        weekObj.tasks.failed.urgent.push(doneTaskObj.failed.urgent.length);
        weekObj.tasks.failed.high.push(doneTaskObj.failed.high.length);
        weekObj.tasks.failed.middle.push(doneTaskObj.failed.middle.length);
        weekObj.tasks.failed.low.push(doneTaskObj.failed.low.length);

        weekObj.pomodoros.urgent.push(this.amount(doneTaskObj.urgent) +
          this.amount(doneTaskObj.failed.urgent));
        weekObj.pomodoros.high.push(this.amount(doneTaskObj.high) +
          this.amount(doneTaskObj.failed.high));
        weekObj.pomodoros.middle.push(this.amount(doneTaskObj.middle) +
          this.amount(doneTaskObj.failed.middle));
        weekObj.pomodoros.low.push(this.amount(doneTaskObj.low) +
          this.amount(doneTaskObj.failed.low));
        weekObj.pomodoros.failed.urgent
            .push(this.sumFailedPomodoros(doneTaskObj.failed.urgent) +
            this.sumFailedPomodoros(doneTaskObj.urgent));
        weekObj.pomodoros.failed.high
            .push(this.sumFailedPomodoros(doneTaskObj.failed.high) +
            this.sumFailedPomodoros(doneTaskObj.high));
        weekObj.pomodoros.failed.middle
            .push(this.sumFailedPomodoros(doneTaskObj.failed.middle) +
            this.sumFailedPomodoros(doneTaskObj.middle));
        weekObj.pomodoros.failed.low
            .push(this.sumFailedPomodoros(doneTaskObj.failed.low) +
            this.sumFailedPomodoros(doneTaskObj.low));
      }
      if (period === 30) {
        monthObj.tasks.urgent.push(doneTaskObj.urgent.length);
        monthObj.tasks.high.push(doneTaskObj.high.length);
        monthObj.tasks.middle.push(doneTaskObj.middle.length);
        monthObj.tasks.low.push(doneTaskObj.low.length);
        monthObj.tasks.failed.urgent.push(doneTaskObj.failed.urgent.length);
        monthObj.tasks.failed.high.push(doneTaskObj.failed.high.length);
        monthObj.tasks.failed.middle.push(doneTaskObj.failed.middle.length);
        monthObj.tasks.failed.low.push(doneTaskObj.failed.low.length);

        monthObj.pomodoros.urgent.push(this.amount(doneTaskObj.urgent) +
          this.amount(doneTaskObj.failed.urgent));
        monthObj.pomodoros.high.push(this.amount(doneTaskObj.high) +
          this.amount(doneTaskObj.failed.high));
        monthObj.pomodoros.middle.push(this.amount(doneTaskObj.middle) +
          this.amount(doneTaskObj.failed.middle));
        monthObj.pomodoros.low.push(this.amount(doneTaskObj.low) +
          this.amount(doneTaskObj.failed.low));
        monthObj.pomodoros.failed.urgent
            .push(this.sumFailedPomodoros(doneTaskObj.failed.urgent) +
            this.sumFailedPomodoros(doneTaskObj.urgent));
        monthObj.pomodoros.failed.high
            .push(this.sumFailedPomodoros(doneTaskObj.failed.high) +
            this.sumFailedPomodoros(doneTaskObj.high));
        monthObj.pomodoros.failed.middle
            .push(this.sumFailedPomodoros(doneTaskObj.failed.middle) +
            this.sumFailedPomodoros(doneTaskObj.middle));
        monthObj.pomodoros.failed.low
            .push(this.sumFailedPomodoros(doneTaskObj.failed.low) +
            this.sumFailedPomodoros(doneTaskObj.low));
      }
    }
    if (period === 7) {
      return weekObj;
    }
    if (period === 30) {
      return monthObj;
    }
  };
}

export const reportsService = new ReportsService(httpService);
