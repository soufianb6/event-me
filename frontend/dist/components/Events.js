"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = exports.EventsSection = exports.EventCard = exports.EventModal = void 0;
const Icons_js_1 = require("./Icons.js");
const API_URL = import.meta.env.VITE_API_URL || '/api';
const loadEventsData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${API_URL}/events`);
        return response.json();
    }
    catch (e) {
        console.error(e);
    }
});
const EventModal = (event) => {
    const formId = `rsvp-form-${event.ID}`;
    const modalId = `modal-event-${event.id}`;
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
    </dialog>`;
};
exports.EventModal = EventModal;
const EventCard = (e) => {
    var _a;
    const eventDate = new Date(e.date);
    const isPast = eventDate < new Date();
    return `
<article class="event" >
<header>
    ${e.image_url && `<img src=${e.image_url} alt="${e.title} thumbnail" />`}
</header>
    <main>
        <h4>${e.title}</h4>
        <p>${Icons_js_1.Calendar} ${eventDate.toLocaleDateString()}</p>
        <p>Host: ${((_a = e.host) === null || _a === void 0 ? void 0 : _a.name) || `User ${e.host_id}`}</p>

        ${e.description && `<p>${e.description}</p>`}
    </main>
    <footer>
        <span>
            ${e.rsvps.length} 
            ${isPast ? 'went' : 'going'}
        </span>
        ${!isPast ? `
            <button role="button" data-target="modal-event-${e.id}" class="toggle-modal"
            title="RSVP to ${e.title}"
            >
        RSVP
        </button>` : ''}
    </footer>
    ${(0, exports.EventModal)(e)}
</article>
    `;
};
exports.EventCard = EventCard;
const EventsSection = (title, events) => {
    return `
  <section class='events'>
      <h2>${title} events </h2>
          <div role = "group">
              ${events.map((e) => (0, exports.EventCard)(e)).join('') || 'No events'}
      </div>
  </section>`;
};
exports.EventsSection = EventsSection;
// IIFE to asynchronously load the Event data before exporting the component
// https://developer.mozilla.org/en-US/docs/Glossary/IIFE
exports.Events = await (() => __awaiter(void 0, void 0, void 0, function* () {
    const all = yield loadEventsData();
    const past = all.filter((e) => (new Date(e.date) < new Date()));
    const upcoming = all.filter((e) => (new Date(e.date) > new Date()));
    return `
    ${(0, exports.EventsSection)('Upcoming', upcoming)}
    ${(0, exports.EventsSection)('Past', past)}
`;
}))();
