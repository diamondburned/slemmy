const { skeleton } = require("@skeletonlabs/tw-plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    require("path").join(
      require.resolve("@skeletonlabs/skeleton"),
      "../**/*.{html,js,svelte,ts}",
    ),
  ],
  theme: {
    extend: {},
  },
  safelist: [{ pattern: /border-.*-400/ }],
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    skeleton(),
  ],
}
