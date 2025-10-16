import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Prevent theme flash: sets dark class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    // Support both legacy 'darkMode' ("true"/"false") and new 'theme' ("dark"/"light") keys
    const storedDarkMode = localStorage.getItem('darkMode');
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDark;
    if (storedDarkMode === 'true') isDark = true;
    else if (storedDarkMode === 'false') isDark = false;
    else if (storedTheme) isDark = storedTheme === 'dark';
    else isDark = systemPrefersDark;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } catch (_) {}
})();`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
