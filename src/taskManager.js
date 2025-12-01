import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/tasks.json')

async function initializeDataFile(){
    const dataDir = path.dirname(DATA_FILE);
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, {recursive: true});
    }

    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    }
}

export async function getAllTasks(){
    await initializeDataFile();
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveTasks(tasks){
    await initializeDataFile();
    await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
}

export async function addTask(taskData){
    console.log('in add Task func')
    const tasks = await getAllTasks();
    const newTask = {
        id: Date.now().toString(),
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        status: 'pending',
        category: taskData.category || 'general',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: taskData.dueDate || null,
        estimatedTime: taskData.estimatedTime || null,
        actualTime: null,
        tags: taskData.tags || [],
        completedAt: null
    }
    tasks.push(newTask);
    await saveTasks(tasks);
    return newTask;
}

export async function getTaskById(taskId){
    const tasks = await getAllTasks();
    return tasks.find(t => t.id == taskId);
}

export async function updateTask(taskId, updates){
    const tasks = await getAllTasks();
    const taskIndex = tasks.findIndex(t => t.id == taskId);

    if(taskIndex === -1){
        return null;
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    await saveTasks(tasks);
    return tasks[taskIndex];
}

export async function deleteTask(taskId){
    const tasks = await getAllTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);

    if(filteredTasks.length === tasks.length){
        return false;
    }

    await saveTasks(filteredTasks);
    return true;
}