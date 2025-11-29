#!/usr/bin/env node //Makes file executable (Unix/Mac)

import { Command } from "commander";
import inquirer from "inquirer";
import chalk from 'chalk';
import { addTask } from "./src/taskManager.js";
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
            console.error(chalk.red(` Error: ${error.message}\n`));
        }
    })

program.parse(process.argv);