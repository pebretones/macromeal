# MacroMeal

Calorie tracking + goal-tailored recipe suggestions. One HTML file, runs anywhere.

🌐 **Live:** https://pebretones.github.io/macromeal/

## Features

- **Daily calorie target** computed from the Mifflin-St Jeor formula and adjusted for your goal (cut / maintain / bulk)
- **Local accounts** with PBKDF2 password hashing (120k iterations, SHA-256). Everything stays in your browser; nothing is sent anywhere
- **Meal log** with optional macro tracking (protein / carbs / fat)
- **Recipe suggestions** from Spoonacular, filtered to fit the calories you have left today (uses your own free Spoonacular API key, stored locally)
- **Mobile-friendly** responsive design

## How it works

This is a single static `index.html` deployed via GitHub Pages. There is no backend, no database, no analytics. Your data lives in your browser's `localStorage` and never leaves your device. If you want recipes from Spoonacular, you provide your own free API key (https://spoonacular.com/food-api), which is also stored locally.

Trade-off: accounts are per-device. If you sign up on your phone, you cannot log in from your laptop with that account; you would create a separate one.

## License

MIT
