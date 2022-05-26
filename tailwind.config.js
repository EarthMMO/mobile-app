const plugin = require("tailwindcss/plugin");

module.exports = {
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        "my-shadow-md": {
          elevation: 3,
          shadowColor: `#d3d2f6`,
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 1,
          shadowRadius: 1,
        },
        "my-dark-shadow-md": {
          elevation: 3,
          shadowColor: `#312e81`,
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 1,
          shadowRadius: 1,
        },
      });
    }),
  ],
};
