import { Theme } from './Icons.ts';

type ThemeOption = 'light' | 'dark';

const themeToggleId = 'theme';


const Header = `
<header>
    <hgroup>
        <h1 class=".parkinsans">event me</h1>
        <p>All the events you never knew you needed to attend!</p>
    </hgroup>
    <a href="#" role="toggle" id="${themeToggleId}"  title="Toggle color scheme" >
        ${Theme} 
    </a>
</header>
`;

const toggleDarkMode = () => {
    const doc = document.documentElement;
    const currentTheme = doc.getAttribute('data-theme');
    const nextTheme: ThemeOption = currentTheme === 'dark' ? 'light' : 'dark';
    doc.setAttribute('data-theme', nextTheme);
}

export function setupThemeToggle() {
    const themeToggle = document.getElementById(themeToggleId);
    if (!themeToggle) {
        console.error('Missing theme toggle: no element with id', themeToggleId);
        return;
    }
    themeToggle.addEventListener('click', toggleDarkMode);

}


export default Header
