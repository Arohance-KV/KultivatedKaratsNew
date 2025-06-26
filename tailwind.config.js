module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        ringColor: {
          primaryDark: "#A68A7E"
        }
      },
    },
    plugins: [require("tailwindcss-animate")],
    variants: {
    extend: {
      display: ["group-hover", "hover", "focus", "active", "radix-state-open"], // radix
    },
  },
  }
  