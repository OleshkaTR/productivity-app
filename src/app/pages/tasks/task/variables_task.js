export const variablesTask = [
  {
    id: 1,
    classification: 'hobby-task-violet',
    type: {
      daily: true,
      global: false,
      iconTask: false,
    },
    classFirstBlock: 'day',
    classBlockTitle: 'flex1',
    title: 'Daily Task',
    description: 'I sure, it`s daily task',
    createDate: 'string',
    startDate: 'string',
    deadline: 'string',
    isActive: true,
    estimationTotal: 4,
    estimationUsed: 2,
    priority: 3,
    categoryId: 'daily',
    pomodoroColor: 'pomodoro',
  },
  {
    id: 2,
    classification: 'flex-task-global',
    type: {
      daily: false,
      global: true,
      iconTask: false,
    },
    classFirstBlock: 'day',
    classBlockTitle: 'flex1',
    title: 'Global Task',
    description: 'This is Global Task(I not sure)',
    createDate: 'string',
    startDate: 'string',
    deadline: 'string',
    isActive: true,
    estimationTotal: 4,
    estimationUsed: 3,
    priority: 3,
    categoryId: 'global',
    pomodoroColor: 'pomodoro-orange',
  },
  {
    id: 3,
    classification: 'flex-task-remove',
    type: {
      daily: false,
      global: false,
      iconTask: true,
    },
    classFirstBlock: 'trash-remove-violet',
    classBlockTitle: 'mr-task pl-remove flex1',
    title: 'Remove Task',
    description: 'This task should be remove',
    createDate: 'string',
    startDate: 'string',
    deadline: 'string',
    isActive: true,
    estimationTotal: 4,
    estimationUsed: 1,
    priority: 3,
    categoryId: 'iconTask',
    pomodoroColor: 'pomodoro',
  },

];