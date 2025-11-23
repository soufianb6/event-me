import { Calendar } from './Icons.js';

interface Event{
  
  id: number;
  title: string;
  date: string;
  host_id: number;
  host: {
    name: string;
    id: number;
    email: string;
  };
  description?: string;
  image_url?: string;
  rsvps: {
    id: number;
    name: string;
    email: string;
  }[];
};

const API_URL = import.meta.env.VITE_API_URL;

const loadEventsData = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_URL}/events`);
    return await response.json();
  } catch (e) {
    console.error(e);
    return []; // Return empty array on error
  }
}


export const EventModal = (event:Event) => {
  const formId = `rsvp-form-${event.id}`;
  const modalId = `modal-event-${event.id}`
  return `<dialog id="${modalId}">
      <article>
        <header>
          <button
            aria-label="Close"
            rel="prev"
            data-target="${modalId}"
            class="toggle-modal"
          ></button>
          <h3>RSVP to ${event.title}</h3>
        </header>
        <form id="${formId}" data-modal="${modalId}"
            action="${API_URL}/events/${event.id}/rsvp"
            method="POST"
        >
          <label for="rsvp-name-${event.id}">Name:
            <input type="text" id="rsvp-name-${event.id}" class="rsvp-name" name="name" required />
          </label>
          <label for="rsvp-email-${event.id}">Email:
            <input type="email" id="rsvp-email-${event.id}" class="rsvp-email" name="email" required />
          </label>
        
        </form>
        <footer>
          <button
            role="button"
            class="toggle-modal cancel"
            data-target="${modalId}"
          >Cancel</button>

          <button id="submit-${formId}" role="button" form="${formId}" type="submit">Submit RSVP</button>

        </footer>
      </article>
    </dialog>`
}

export const EventCard = (e:Event) => {
  const eventDate = new Date(e.date);
  const isPast = eventDate < new Date();
  const descriptionField = e.description || '';
  return `
<article class="event" >
<header>
    ${e.image_url && `<img src=${e.image_url} alt="${e.title} thumbnail" />`}
</header>
    <main>
        <h4>${e.title}</h4>
        <p>${Calendar} ${eventDate.toLocaleDateString()}</p>
        <p>Host: ${e.host?.name || `User ${e.host_id}`}</p>

        ${descriptionField}
    </main>
    <footer>
        <span>
            ${e.rsvps?.length || 0} ${isPast ? 'went' : 'going'}
        </span>
        ${!isPast ? `
            <button role="button" data-target="modal-event-${e.id}" class="toggle-modal"
            title="RSVP to ${e.title}"
            >
        RSVP
        </button>`: ''}
    </footer>
    ${EventModal(e)}
</article>
    `
}

export const EventsSection = (title:string, events:Event[]) => {
  return `
  <section class='events'>
      <h2>${title} events </h2>
          <div role = "group">
              ${events.map((e) => EventCard(e)).join('') || 'No events'}
      </div>
  </section>`;
}

// IIFE to asynchronously load the Event data before exporting the component
// https://developer.mozilla.org/en-US/docs/Glossary/IIFE
export const Events = await (async () => {
  const all = await loadEventsData();
  const past = all.filter((e) => (new Date(e.date) < new Date()));
  const upcoming = all.filter((e) => (new Date(e.date) > new Date()));
  return `
    ${EventsSection('Upcoming', upcoming)}
    ${EventsSection('Past', past)}
`})()