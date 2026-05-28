import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'tasks.json');

function readTasks() {
  try {
    if (!fs.existsSync(filePath)) {
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

// PUT /api/tasks/[id]
export async function PUT(request, { params }) {
  try {
    const id = Number(params.id);
    const body = await request.json();

    if (body.completed === undefined) {
      return NextResponse.json({ error: 'completed status is required' }, { status: 400 });
    }

    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    tasks[taskIndex].completed = !!body.completed;

    if (!writeTasks(tasks)) {
      throw new Error('Failed to update task in storage');
    }

    return NextResponse.json(tasks[taskIndex], { status: 200 });
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(request, { params }) {
  try {
    const id = Number(params.id);

    const tasks = readTasks();
    const taskExists = tasks.some(t => t.id === id);

    if (!taskExists) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const filteredTasks = tasks.filter(t => t.id !== id);

    if (!writeTasks(filteredTasks)) {
      throw new Error('Failed to delete task from storage');
    }

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
