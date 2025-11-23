import { Theme as ThemeIcon } from './Icons';

const themeToggleId = 'theme';

const Header = `
<header>
    <hgroup>
        <h1 class=".parkinsans">event me</h1>
        <p>All the events you never knew you needed to attend!</p>
    </hgroup>
    <a href="#" role="toggle" id="${themeToggleId}"  title="Toggle color scheme" >
        ${ThemeIcon} 
    </a>
</header>
`;
type Theme = 'light' | 'dark';
const toggleDarkMode = () => {
    let  newTheme:Theme;
    const doc = document.documentElement;
    const currentTheme = doc.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        newTheme = 'light';
        doc.setAttribute('data-theme', newTheme);
    } else if (currentTheme === 'light') {
        newTheme = 'dark';
        doc.setAttribute('data-theme', newTheme);
    }
}
export function setupThemeToggle() {
    const themeToggle = document.getElementById(themeToggleId);
    themeToggle?.addEventListener('click', toggleDarkMode);

}


export default Header
