const API_URL = import.meta.env.VITE_API_URL;

export const setupForm = (form: HTMLFormElement) => {
    if (!form) return;

    const eventId = form.id.replace('rsvp-form-', '');
    const url = `${API_URL}/events/${eventId}/rsvp`;
    const btn = document.getElementById(`submit-${form.id}`);

    async function sendData(form: HTMLFormElement) {
        const formData = new FormData(form);
        const encoded = new URLSearchParams();
        for (let [key, value] of formData.entries()) {
            encoded.append(key, value.toString());
        }
        try {
            const response = await fetch(url, {
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
            } else if (response.status === 200) {
                form.dataset.submitted = 'duplicate';
                if (btn) {
                    btn.textContent = "You're already going!";
                    btn.setAttribute('disabled', '');
                }
            }
        } catch (e) {
            form.dataset.submitted = 'error';
            console.error(e);
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        sendData(form);
    });

    if (btn) {
        const emailInput = form.querySelector('input');
        if (!emailInput) {
            console.error('No email input found!');
            return;
        }
        emailInput.addEventListener('input', () => {
            if (btn.textContent !== 'Submit RSVP') {
                btn.removeAttribute('disabled');
                btn.textContent = 'Submit RSVP';
            }
        });

    }
};

export const setupForms = () => {
    const rsvpForms = document.querySelectorAll('form');
    if (!rsvpForms) return;
    for (let form of rsvpForms) {
        setupForm(form);
    }
};