import db from '../db.ts';
import { Router } from 'express';
import { getUser } from './users.ts';

const router = Router();

const joinHost = (event) => {
  const host = getUser(event.host_id);
  return { ...event, host };
}

const joinRSVPs = (event) => {
  const { id } = event;
  const getRSVPs = db.prepare('SELECT * FROM rsvps WHERE event_id = @id');
  const rsvps = getRSVPs.all({ id });
  return { ...event, rsvps };
}

const getEvent = (eventId) => {
  const byId = db.prepare('SELECT * FROM events WHERE id = @eventId');
  const event = byId.get({ eventId });
  return joinHost(event);
}

router.get('/', (_req, res) => {
  const listEvents = db.prepare(`SELECT * FROM events`);
  const events = listEvents.all();
  res.json(events.map(joinHost).map(joinRSVPs));
});

const insertEvent = db.prepare(`INSERT INTO events VALUES (@id, @title, @description, @image_url, @date, @host_id)`);

router.post('/new', (req, res) => {
  const data = req.body;
  const { lastInsertRowid: id } = insertEvent.run(data);
  const event = getEvent(id);
  res.status(201).json(event);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const event = getEvent(id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
});

router.patch('/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const patch = req.body;

  const updateCol = db.prepare(`
    UPDATE events SET @col = @val WHERE id = @eventId
  `);
  const updateEvent = db.transaction((patch) => {
    for (const [col, val] of Object.entries(patch)) {
      updateCol.run({ col, val, eventId });
    }
  });

  updateEvent(Object.entries(patch));
  const updated = getEvent(eventId);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const deleteEvent = db.prepare(`DELETE FROM events WHERE id = @eventId`);
  const eventId = parseInt(req.params.id);
  const event = getEvent(eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  deleteEvent.run({ eventId });
  res.json(event);
});

router.post('/:id/rsvp', (req, res) => {
  const eventId = parseInt(req.params.id);
  const { name, email } = req.body;

  const getRSVP = db.prepare(`SELECT * FROM rsvps WHERE (event_id = ${eventId} AND email = '${email}')`);
  const insertRSVP = db.prepare(`INSERT INTO rsvps VALUES (@eventId, @name, @email)`);

  let [rsvp] = getRSVP.all({ eventId, email });
  if (rsvp) {
    // This email has already RSVPed
    res.status(200).json({ rsvp });
  } else {
    // New RSVP
    insertRSVP.run({ name, email, eventId });
    rsvp = getRSVP.run({ eventId, email });
    res.status(201).json({ rsvp });
  }
});

export default router;
