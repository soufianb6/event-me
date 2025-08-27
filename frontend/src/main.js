import './style.css'
import Header, { setupThemeToggle } from './components/Header.js';
import Main from './components/Main.js';
import Footer from './components/Footer.js';
import { setupModals } from './components/Modal.js';
import { setupForms } from './components/Forms.js';


// Quick and dirty - not for production!
const render = (html) => {
  const app = document.querySelector('#app');
  app.innerHTML = html;
  setupThemeToggle();
  setupModals();
  setupForms();
}


render(`
  ${Header}
  ${Main}
  ${Footer}
`);



