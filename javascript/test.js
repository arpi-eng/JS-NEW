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
  console.log('\nCurrent Tasks:');
  taskList.forEach((item, position) => {
    console.log(`${position + 1}. ${item.done ? '[✓]' : '[ ]'} ${item.name}`);
  });
  console.log();
}

async function newTask() {
  try {
    const taskName = await askUser('What needs to be done? ');
    const currentTasks = await getTasks();
    currentTasks.push({ name: taskName, done: false });
    await saveTasks(currentTasks);
    console.log('Added new task!');
  } catch (error) {
    console.error('Error adding new task:', error.message);
  }
}

async function finishTask() {
  try {
    const currentTasks = await getTasks();
    showTasks(currentTasks);

    const taskPosition = await askUser('Which task did you finish? ');
    const index = parseInt(taskPosition) - 1;

    if (!isNaN(index) && index >= 0 && index < currentTasks.length) {
      currentTasks[index].done = true;
      await saveTasks(currentTasks);
      console.log('Great job completing that task!');
    } else {
      console.log('Hmm, that task number doesn\'t exist');
    }
  } catch (error) {
    console.error('Error finishing task:', error.message);
  }
}

async function removeTask() {
  try {
    const currentTasks = await getTasks();
    showTasks(currentTasks);

    const taskPosition = await askUser('Which task to remove? ');
    const index = parseInt(taskPosition) - 1;

    if (!isNaN(index) && index >= 0 && index < currentTasks.length) {
      currentTasks.splice(index, 1);
      await saveTasks(currentTasks);
      console.log('Task removed!');
    } else {
      console.log('Oops, that task number doesn\'t exist');
    }
  } catch (error) {
    console.error('Error removing task:', error.message);
  }
}

function askUser(question) {
  return new Promise((resolve, reject) => {
    interface.question(question, (answer) => {
      if (answer.trim() === '') {
        reject(new Error('Input cannot be empty.'));
      } else {
        resolve(answer.trim());
      }
    });
  });
}

// Ensure the readline interface is closed properly
process.on('exit', () => {
  interface.close();
});


