import('./pomodoro_graph.less');
import * as markup from './pomodoro_graph.hbs';

/** @class PomodoroGraph */
class PomodoroGraph {
/**
   * @constructor Create a new instance of ReportGraph class
   * @param {string} containerId - Container ID
   * @param {object} options - Object for render options
   */
  constructor(containerId, options) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.render(this.options);
  }

  /**
   * @description Render PomodoroGraph on the page
   * @param {object} options - Object for render options
   */
  render(options) {
    this.container.innerHTML = markup(this.options);
    this.flexGraph = document.getElementById('flex-graph');
    this.textforCycle = document.getElementById('text-for-cycle');
    const [work, shortBreak, iteration, longBreak] = options;
    const valueWork = work.value;
    const valueShortBreak = shortBreak.value;
    const valueIteration = iteration.value;
    const valueLongBreak = longBreak.value;
    let passedTime = 0;
    const oneHour = 60;
    const amountCycle = 2;
    const denominatorOfWithBlock = 3.4;
    const workGraphBg = '#FFB202';
    const divLongBreakBg = '#B470D0';
    const divShortBreakBg = '#59ABE3';

    function displayTime(id) {
      let text = passedTime + 'min';
      if (passedTime >= oneHour) {
        text = (passedTime / oneHour | 0) + 'h ' + passedTime % oneHour + 'min';
      }
      id.innerText = 'First cycle: ' + text;
    }

    for (let i = 0; i < valueIteration * amountCycle; i++) {
      const workGraph = document.createElement('div');

      workGraph.className = 'work-graph';
      workGraph.style.width = valueWork / denominatorOfWithBlock + '%';
      workGraph.style.height = '10px';
      workGraph.style.background = workGraphBg;

      this.flexGraph.append(workGraph);
      passedTime += valueWork;

      if (i === valueIteration - 1) {
        const divLongBreak = document.createElement('div');

        divLongBreak.className = 'long-break';
        divLongBreak.style.background = divLongBreakBg;
        divLongBreak.style.height = '10px';
        divLongBreak.style.width = valueLongBreak /
          denominatorOfWithBlock + '%';

        this.flexGraph.append(divLongBreak);
        passedTime += valueLongBreak;

        const p = document.createElement('p');

        p.innerText = `First cycle: ${passedTime}`;
        p.id = 'first-cycle-time';
        p.className = 'default-color all-time';
        this.textforCycle.prepend(p);

        const firstCycleTime = document.getElementById('first-cycle-time');

        displayTime(firstCycleTime);
      } else {
        const divShortBreak = document.createElement('div');

        divShortBreak.className = 'short-break';
        divShortBreak.style.background = divShortBreakBg;
        divShortBreak.style.height = '10px';
        divShortBreak.style.width = valueShortBreak /
          denominatorOfWithBlock + '%';

        this.flexGraph.append(divShortBreak);
        passedTime += valueShortBreak;
      }
    }

    let text = passedTime + 'min';
    if (passedTime >= oneHour) {
      text = (passedTime / oneHour | 0) + 'h ' + passedTime % oneHour + 'min';

      const timeAllCycle = document.createElement('p');

      timeAllCycle.innerText = `${text}`;
      timeAllCycle.id = 'all-cycle-time';
      timeAllCycle.className = 'default-color all-time';

      this.textforCycle.append(timeAllCycle);
    }
  }
}

export default PomodoroGraph;
