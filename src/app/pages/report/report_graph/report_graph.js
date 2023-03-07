import {reportModel} from '../report.model';
import * as markup from './report_graph.hbs';
import {reportsService} from '../../../services/reports.service';

import('./report_graph.less');
const Highcharts = require('highcharts/highstock');
require('highcharts/modules/map')(Highcharts);

/** @class ReportGraph */
class ReportGraph {
  /**
   * @constructor Create a new instance of ReportGraph class
   * @param {string} containerId - Container ID
   * @param {boolean} tasksReport - Reports for tasks
   * @param {boolean} pomodorosReport - Reports for pomodoros
   * @param {boolean} reportFromDay - Reports during the day
   * @param {boolean} reportFromWeek - Reports during the week
   * @param {boolean} reportFromMonth - Reports during the month
   */
  constructor(containerId, tasksReport, pomodorosReport, reportFromDay,
      reportFromWeek, reportFromMonth) {
    this.container = document.getElementById(containerId);
    this.tasksReport = tasksReport;
    this.pomodorosReport = pomodorosReport;
    this.reportFromDay = reportFromDay;
    this.reportFromWeek = reportFromWeek;
    this.reportFromMonth = reportFromMonth;
    this.render();
  }

  /**
   * @description Sums up all failed pomodoros of tasks
   * @param {array} arr - Array failed tasks
   * @return {number}
   */
  sumFailedPomodoros(arr) {
    let result = 0;
    for (let i = 0; i < arr.length; i++) {
      result += arr[i].failedPomodoros;
    }
    return result;
  }

  /**
   * @description Sums up all completed pomodoros of tasks
   * @param {array} arr - Array completed tasks
   * @return {number}
   */
  sumCompletedPomodoros(arr) {
    let result = 0;
    for (let i = 0; i < arr.length; i++) {
      result += arr[i].completedCount - arr[i].failedPomodoros;
    }
    return result;
  }

  /** @description Render reports on the page */
  async render() {
    this.container.innerHTML = markup({
      tasksReport: this.tasksReport,
      pomodorosReport: this.pomodorosReport,
      reportFromDay: this.reportFromDay,
      reportFromWeek: this.reportFromWeek,
      reportFromMonth: this.reportFromMonth,
    });

    const week = 7;
    const month = 30;
    const doneTasks = await reportModel.getDoneTasks();
    const weekTasks = reportModel.getFilteredTasksOnAWeek(week,
        reportsService.filteredObjDoneTasks.week);
    const monthTasks = reportModel.getFilteredTasksOnAWeek(month,
        reportsService.filteredObjDoneTasks.month);

    function sortDaysInAWeek() {
      const dayOfWeek = new Date().getDay();
      let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      for (let i = dayOfWeek; i < days.length - 1; i++) {
        days = [].concat(days.slice(-1), days.slice(0, -1));
      }
      return days;
    }

    const sortDays = () => {
      const days = [];
      for (let i = 0; i <= month - 1; i++) {
        const res = month - i;
        days.push(res);
      }
      return days.reverse();
    };

    const sum = (arr1, arr2, arr3, arr4) => {
      return arr1.map(function(num, idx) {
        return num + arr2[idx] + arr3[idx] + arr4[idx];
      });
    };

    const highChart = (period) => {
      return Highcharts.chart(this.container, {
        chart: {
          type: 'column',
          backgroundColor: '#2A3F50',
          height: 250,
        },
        title: {
          align: 'left',
          text: ' ',
        },
        accessibility: {
          enable: false,
          announceNewData: {
            enabled: true,
          },
        },
        xAxis: {
          type: 'category',
          lineColor: '#fff',
          lineWidth: 2,
          labels: {
            style: {
              color: '#fff',
            },
          },
        },
        yAxis: {
          lineColor: '#fff',
          lineWidth: 2,
          allowDecimals: false,
          title: {
            text: ' ',
          },
          labels: {
            style: {
              color: '#fff',
            },
          },
        },
        legend: {
          enabled: false,
        },

        tooltip: {
          headerFormat: '',
          pointFormat: '<span style="font-size:12px">{point.name}</span><br>' +
            '<span>Tasks</span>: <b>{point.y}</b><br/>',
        },

        credits: {
          enabled: false,
        },

        series: [
          {
            name: 'Level',
            colorByPoint: true,
            data: [
              {
                name: 'Urgent',
                y: period.urgent.length,
                color: '#F15A4A',
              },
              {
                name: 'High',
                y: period.high.length,
                color: '#FEA741',
              },
              {
                name: 'Middle',
                y: period.middle.length,
                color: '#FDDC43',
              },
              {
                name: 'Low',
                y: period.low.length,
                color: '#1ABC9C',
              },
              {
                name: 'Failed',
                y: period.failed.urgent.length + period.failed.high.length +
                  period.failed.middle.length + period.failed.low.length,
                color: '#8DA5B8',
              },
            ],
          },
        ],
      });
    };

    const otherHighChartForTask = (typeTasks, scale, successful, failed,
        type) => {
      return Highcharts.chart(this.container, {
        chart: {
          type: 'column',
          backgroundColor: '#2A3F50',
          width: 650,
          height: 250,
        },
        title: {
          align: 'left',
          text: ' ',
        },
        accessibility: {
          enable: false,
          announceNewData: {
            enabled: true,
          },
        },
        xAxis: {
          categories: scale,
          lineColor: '#fff',
          lineWidth: 2,
          labels: {
            style: {
              color: '#fff',
            },
          },
        },
        yAxis: {
          lineColor: '#fff',
          lineWidth: 2,
          allowDecimals: false,
          title: {
            text: ' ',
          },
          labels: {
            style: {
              color: '#fff',
            },
          },
        },
        legend: {
          enabled: false,
        },

        tooltip: {
          headerFormat: '',
          pointFormat: `<span style="font-size:12px">{series.name}</span><br>
<span>${type}</span>: <b>{point.y}</b><br/>`,
        },

        credits: {
          enabled: false,
        },

        plotOptions: {
          column: {
            stacking: 'normal',
          },
        },

        series: [{
          name: 'URGENT',
          data: typeTasks.urgent.reverse(),
          stack: successful,
          color: '#F15A4A',
        },
        {
          name: 'HIGH',
          data: typeTasks.high.reverse(),
          stack: successful,
          color: '#FEA741',
        },
        {
          name: 'MIDDLE',
          data: typeTasks.middle.reverse(),
          stack: successful,
          color: '#FDDC43',
        },
        {
          name: 'LOW',
          data: typeTasks.low.reverse(),
          stack: successful,
          color: '#1ABC9C',
        },
        {
          name: 'FAILED',
          data: sum(typeTasks.failed.urgent, typeTasks.failed.high,
              typeTasks.failed.middle, typeTasks.failed.low).reverse(),
          stack: failed,
          color: '#8DA5B8',
        }],
      });
    };

    if (this.tasksReport && this.reportFromDay) {
      highChart(doneTasks.day);
    }

    if (this.tasksReport && this.reportFromWeek) {
      otherHighChartForTask(weekTasks.tasks, sortDaysInAWeek(), 'successful',
          'failed', 'Tasks');
    }

    if (this.tasksReport && this.reportFromMonth) {
      otherHighChartForTask(monthTasks.tasks, sortDays(), 'successful',
          'successful', 'Tasks');
    }

    const sumAllFailedPomodoroOnDay =
      this.sumFailedPomodoros(doneTasks.day.failed.urgent) +
      this.sumFailedPomodoros(doneTasks.day.failed.high) +
      this.sumFailedPomodoros(doneTasks.day.failed.middle) +
      this.sumFailedPomodoros(doneTasks.day.failed.low) +
      this.sumFailedPomodoros(doneTasks.day.urgent) +
      this.sumFailedPomodoros(doneTasks.day.high) +
      this.sumFailedPomodoros(doneTasks.day.middle) +
      this.sumFailedPomodoros(doneTasks.day.low);
    const sumAllUrgentCompletedPomodoroOnTheDay =
      this.sumCompletedPomodoros(doneTasks.day.urgent) +
      this.sumCompletedPomodoros(doneTasks.day.failed.urgent);
    const sumAllHighCompletedPomodoroOnTheDay =
      this.sumCompletedPomodoros(doneTasks.day.high) +
      this.sumCompletedPomodoros(doneTasks.day.failed.high);
    const sumAllMiddleCompletedPomodoroOnTheDay =
      this.sumCompletedPomodoros(doneTasks.day.middle) +
      this.sumCompletedPomodoros(doneTasks.day.failed.middle);
    const sumAllLowCompletedPomodoroOnTheDay =
      this.sumCompletedPomodoros(doneTasks.day.low) +
      this.sumCompletedPomodoros(doneTasks.day.failed.low);

    if (this.pomodorosReport && this.reportFromDay) {
      Highcharts.chart(this.container, {
        chart: {
          type: 'column',
          backgroundColor: '#2A3F50',
          height: 250,
        },
        title: {
          align: 'left',
          text: ' ',
        },
        accessibility: {
          enable: false,
          announceNewData: {
            enabled: true,
          },
        },
        xAxis: {
          type: 'category',
          lineColor: '#fff',
          lineWidth: 2,
          labels: {
            style: {
              color: '#fff',
            },
          },
        },
        yAxis: {
          lineColor: '#fff',
          lineWidth: 2,
          title: {
            text: ' ',
          },
          labels: {
            style: {
              color: '#fff',
            },
          },
        },
        legend: {
          enabled: false,
        },

        tooltip: {
          headerFormat: '',
          pointFormat: '<span style="font-size:12px">{point.name}</span><br>' +
            '<span>Pomodoros</span>: <b>{point.y}</b><br/>',
        },

        credits: {
          enabled: false,
        },

        series: [
          {
            name: 'Level',
            colorByPoint: true,
            data: [
              {
                name: 'Urgent',
                y: sumAllUrgentCompletedPomodoroOnTheDay,
                color: '#F15A4A',
              },
              {
                name: 'High',
                y: sumAllHighCompletedPomodoroOnTheDay,
                color: '#FEA741',
              },
              {
                name: 'Middle',
                y: sumAllMiddleCompletedPomodoroOnTheDay,
                color: '#FDDC43',
              },
              {
                name: 'Low',
                y: sumAllLowCompletedPomodoroOnTheDay,
                color: '#1ABC9C',
              },
              {
                name: 'Failed',
                y: sumAllFailedPomodoroOnDay,
                color: '#8DA5B8',
              },
            ],
          },
        ],
      });
    }
    if (this.pomodorosReport && this.reportFromWeek) {
      otherHighChartForTask(weekTasks.pomodoros, sortDaysInAWeek(),
          'successful', 'failed', 'Pomodoros');
    }

    if (this.pomodorosReport && this.reportFromMonth) {
      otherHighChartForTask(monthTasks.pomodoros, sortDays(), 'successful',
          'successful', 'Pomodoros');
    }
  }
}

export default ReportGraph;
