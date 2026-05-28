import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'tasks.json');

function readTasks() {
  try {
    if (!fs.existsSync(filePath)) {
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, '[]');
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Failed to read tasks file:', error);
    return [];
  }
}

function writeTasks(tasks) {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to write tasks file:', error);
    return false;
  }
}

// GET /api/tasks
export async function GET() {
  try {
    const tasks = readTasks();
    // Sort by id descending (newest tasks first)
    const sortedTasks = [...tasks].sort((a, b) => b.id - a.id);
    return NextResponse.json(sortedTasks, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST /api/tasks
export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      return NextResponse.json({ error: 'Valid title is required' }, { status: 400 });
    }

    const tasks = readTasks();
    
    const newTask = {
      id: Date.now(),
      title: body.title.trim(),
      completed: false
    };

    tasks.push(newTask);
    if (!writeTasks(tasks)) {
      throw new Error('Failed to write task to storage');
    }

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
