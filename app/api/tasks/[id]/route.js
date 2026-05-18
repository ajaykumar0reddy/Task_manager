import { NextResponse } from 'next/server';
import db from '@/lib/db';

// PUT /api/tasks/[id]
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const body = await request.json();

    if (body.completed === undefined) {
      return NextResponse.json({ error: 'completed status is required' }, { status: 400 });
    }

    const stmt = db.prepare('UPDATE tasks SET completed = ? WHERE id = ?');
    const info = stmt.run(body.completed ? 1 : 0, id);

    if (info.changes === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(request, { params }) {
  try {
    const id = params.id;

    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
