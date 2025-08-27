import { Router } from 'express';
import db from '../db.ts';
import type { User } from '../types.ts';

const router = Router();

export const getUser = (userId: User['id']) => {
  const byId = db.prepare('SELECT * FROM users WHERE id = @userId');
  return byId.get({ userId });
}

router.get('/', (_req, res) => {
  const listUsers = db.prepare(`SELECT * FROM users`)
  const users = listUsers.all();
  res.json(users);
});

router.post('/new', (req, res) => {
  const data = req.body;
  const cols = Object.keys(data).join(' , ');
  const vals = Object.values(data).join(' , ');
  const insertUser = db.prepare(`INSERT INTO users(@cols) VALUES (@vals)`);
  const { lastInsertRowid: id } = insertUser.run({ cols, vals });
  const user = getUser(id as number);
  res.json(user);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const user = getUser(id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

router.patch('/:id', (req, res) => {
  const userId = req.params.id;
  const patch = req.body;

  const updateCol = db.prepare(`
    UPDATE users SET @col = @val WHERE id = @userId
  `);
  const updateUser = db.transaction((patch) => {
    for (const [col, val] of Object.entries(patch)) {
      updateCol.run(col, val, userId);
    };
  });

  updateUser(Object.entries(patch));
  const updated = getUser(userId);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const deleteUser = db.prepare(`DELETE FROM users WHERE id = @userId`)
  const userId = parseInt(req.params.id);
  const user = getUser(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
  }
  deleteUser.run({ userId });
  res.json(user);
});

export default router;
