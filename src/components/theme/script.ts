export const THEME_STORAGE_KEY = "theme"
export const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)"


export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||((!t||t==="system")&&window.matchMedia("${DARK_MEDIA_QUERY}").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`
