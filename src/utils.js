import chalk from 'chalk';

export function formatPriority(priority) {
  const priorityMap = {
    high: chalk.red.bold('HIGH'),
    medium: chalk.yellow.bold('MEDIUM'),
    low: chalk.green.bold('LOW')
  };
  return priorityMap[priority] || priority;
}

export function displayTask(task, detailed = false) {
  console.log(chalk.bold.cyan(`\n📋 Task #${task.id.slice(-6)}`));
  console.log(chalk.bold.white(`   ${task.title}`));
  
  if (task.description) {
    console.log(chalk.gray(`   ${task.description}`));
  }
  
  console.log(`   Priority: ${formatPriority(task.priority)}`);
}