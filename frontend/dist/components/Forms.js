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
exports.setupForms = exports.setupForm = void 0;
const API_URL = import.meta.env.VITE_API_URL;
const setupForm = (form) => {
    if (!form)
        return;
    const eventId = form.id.replace('rsvp-form-', '');
    const url = `${API_URL}/events/${eventId}/rsvp`;
    const btn = document.getElementById(`submit-${form.id}`);
    function sendData(form) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData(form);
            const encoded = new URLSearchParams();
            for (let [key, value] of formData.entries) {
                encoded.append(key, value);
            }
            try {
                const response = yield fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: encoded,
                });
                if (response.status === 201) {
                    form.dataset.submitted = 'success';
                    if (btn) {
                        btn.textContent = "You're going!";
                        btn.setAttribute('disabled', '');
                    }
                }
                else if (response.status === 200) {
                    form.dataset.submitted = 'duplicate';
                    if (btn) {
                        btn.textContent = "You're already going!";
                        btn.setAttribute('disabled', '');
                    }
                }
            }
            catch (e) {
                form.dataset.submitted = 'error';
                console.error(e);
            }
        });
    }
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        sendData(form);
    });
    if (btn) {
        const emailInput = form.querySelector('input.rsvp-email');
        emailInput.addEventListener('input', () => {
            if (btn.textContent !== 'Submit RSVP') {
                btn.removeAttribute('disabled');
                btn.textContent = 'Submit RSVP';
            }
        });
    }
};
exports.setupForm = setupForm;
const setupForms = () => {
    const rsvpForms = document.querySelectorAll('form');
    if (!rsvpForms)
        return;
    for (let form of rsvpForms) {
        (0, exports.setupForm)(form);
    }
};
exports.setupForms = setupForms;
