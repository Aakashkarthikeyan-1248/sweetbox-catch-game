# Sweetbox Catch!

A responsive, no-build HTML/CSS/JavaScript arcade game. The player catches falling objects for 30 seconds.

## Run locally
Open `index.html` in a browser. No installation or build command is needed.

## Deploy on Render (Static Site)
1. Create a GitHub repository and upload all files in this folder, preserving the `assets/` folder.
2. In Render, choose **New + → Static Site** and connect that repository.
3. Set **Build Command** to blank (or `echo "Static site"` if the form requires a command).
4. Set **Publish Directory** to `.` and click **Deploy Static Site**.
5. Render gives you a public `onrender.com` URL.

A `render.yaml` Blueprint file is included too; you can use Render's Blueprint flow to create the static site from the repository.

## Rules
- Sweetbox 🍬: +15
- TV 📺: -5
- Washing machine 🧺: -7
- Fridge 🧊: -8
- ISRO rocket 🚀: -12
- Tank 🛡️: -15
- Win at 45 points before 30 seconds ends.

Edit `ITEMS`, `GAME_SECONDS`, and `WIN_SCORE` near the top of `script.js` to customize the game. The player image is `assets/player-photo.jpg`.
