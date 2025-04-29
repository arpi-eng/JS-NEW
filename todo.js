const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const storagePath = path.join(__dirname, 'tasks.json');

async function setupTaskFile() {
  try {
    await fs.access(storagePath);
  } catch {
    await fs.writeFile(storagePath, '[]');
  }
}

async function getTasks() {
  const data = await fs.readFile(storagePath, 'utf8');
  return JSON.parse(data);
}

async function saveTasks(taskList) {
  await fs.writeFile(storagePath, JSON.stringify(taskList, null, 2));
}

function showTasks(taskList) {
  console.log('\n Current Tasks:');
  if (taskList.length === 0) {
    console.log('  No tasks found!\n');
    return;
  }
  taskList.forEach((item, position) => {
    console.log(`${position + 1}. ${item.done ? '[✓]' : '[ ]'} ${item.name}`);
  });
  console.log();
}

function askUser(question) {
  return new Promise((resolve) => {
    interface.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function newTask() {
  const taskName = await askUser(' What needs to be done? ');
  if (!taskName.trim()) {
    console.log('  Task name cannot be empty.');
    return;
  }
  const currentTasks = await getTasks();
  currentTasks.push({ name: taskName, done: false });
  await saveTasks(currentTasks);
  console.log(' Added new task!');
}

async function finishTask() {
  const currentTasks = await getTasks();
  if (currentTasks.length === 0) {
    console.log(' No tasks to mark as done!');
    return;
  }

  showTasks(currentTasks);

  const taskPosition = await askUser(' Which task did you finish? ');
  const index = parseInt(taskPosition) - 1;

  if (!isNaN(index) && index >= 0 && index < currentTasks.length) {
    currentTasks[index].done = true;
    await saveTasks(currentTasks);
    console.log(' Great job completing that task!');
  } else {
    console.log('that task number doesn\'t exist');
  }
}

async function removeTask() {
  const currentTasks = await getTasks();
  if (currentTasks.length === 0) { // we are using length as a bench mark to check the status of the task
    console.log(' No tasks to remove!');
    return;
  }

  showTasks(currentTasks);

  const taskPosition = await askUser('  Which task to remove? ');
  const index = parseInt(taskPosition) - 1;

  if (!isNaN(index) && index >= 0 && index < currentTasks.length) {
    const removed = currentTasks.splice(index, 1);
    await saveTasks(currentTasks);
    console.log(`  Removed task: "${removed[0].name}"`);
  } else {
    console.log(' Oops, that task number doesn\'t exist');
  }
}

async function main() {
  await setupTaskFile();

  while (true) {
    console.log('\n========= TO-DO MENU =========');
    console.log('1. Show Tasks');
    console.log('2. Add New Task');
    console.log('3. Mark Task as Done');
    console.log('4. Remove Task');
    console.log('5. Exit');
    console.log('==============================');

    const choice = await askUser('Choose an option: ');

    switch (choice.trim()) {
      case '1':
        const tasks = await getTasks();
        showTasks(tasks);
        break;
      case '2':
        await newTask();
        break;
      case '3':
        await finishTask();
        break;
      case '4':
        await removeTask();
        break;
      case '5':
        console.log(' Exiting. Have a productive day!');
        interface.close();
        process.exit(0);
      default:
        console.log('Invalid choice. Please try again.');
    }
  }
}

main();



