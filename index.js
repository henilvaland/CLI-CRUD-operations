#!/usr/bin/env node //Makes file executable (Unix/Mac)

import { Command } from "commander";
import inquirer from "inquirer";
import chalk from 'chalk';
import { addTask, deleteTask, getAllTasks, getTaskById, updateTask } from "./src/taskManager.js";
import { displayTask } from "./src/utils.js";

const program = new Command();

program
    .name('task')
    .description('Advanced CLI task tracker')
    .version('1.0.0')

//node index.js add -t "check the Node js version" -p high;
program
    .command('add')
    .description('Add a new task')
    .option('-t, --title <title>', 'Task title')
    .option('-p, --priority <priority>', 'Priority', 'medium')
    .action(async (options) => {
        try {
            let taskData = { ...options };
            if(!taskData.title){
                const answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Task title: ',
                        validate: (input) => input.trim().length > 0 || 'Title is required'
                    },
                ])
                taskData = { ...taskData, ...answers};
            }
            const task = await addTask(taskData);
            console.log(chalk.green('\n Task added successfully!'));
            displayTask(task,true);
        } catch (error) {
            console.error(chalk.red(` Error in add command: ${error.message}\n`));
        }
    })

//node index.js list
program
    .command('list')
    .description('List all tasks')
    .action(async () => {
        try {
         const tasks = await getAllTasks();
         if(tasks.length === 0){
            console.log(chalk.yellow('\n No tasks found!\n'));
            return;
         }
         tasks.forEach(task => {
            displayTask(task);
         });
        } catch (error) {
            console.error(chalk.red(` Error in get all command: ${error.message}\n`));            
        }
    })

// node index.js delete 1764607402609
program
    .command('delete <taskId')
    .description('Delete a task')
    .action( async (taskId) => {
        try {
            //add delete functionality API call
            const remainingTasks = await deleteTask(taskId);
            console.log(chalk.green('\n Task deleted successfully!\n'));
        } catch (error) {
            console.error(chalk.red(` Error in delete command: ${error.message}\n`));
        }
    })

// node index.js update 1764417188748 -t "Install node Js Vrsn 22" -p average; 
program
    .command('update <taskId>')
    .option('-t, --title <title>', 'Task title')
    .option('-p, --priority <priority>', 'Priority', 'medium')
    .description('Update a task')
    .action(async (taskId, options) => {
        try {
            console.log('in update command');
            const taskData = { ...options };
            if(!taskData.title){
                const answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'Task title: ',
                        validate: (input) => input.trim().length > 0 || 'Title is required'
                    },
                ])
                taskData = { ...taskData, ...answers};
            }
            const updatedTask = await updateTask(taskId, taskData);
            console.log(chalk.green('\n Task updated successfully!'));
            displayTask(updatedTask,true);
        } catch (error) {
            console.error(chalk.red(` Error in update command: ${error.message}\n`));            
        }
    })

// node index.js show 1764417154714
program
    .command('show <taskId')
    .description('Show task details')
    .action( async (taskId) => {
        try {
            const task = await getTaskById(taskId);
            displayTask(task,true);
        } catch (error) {
            console.error(chalk.red(` Error in show command: ${error.message}\n`));
        }
    });

program.parse(process.argv);