## Update project dependencies
 * Update all dependencies "npx npm-check-updates -u"
 * Fix expo problems with "npx expo install --check"
 * Check for common problems. "npx expo-doctor@latest"
 * Delete node_modules dir
 * Update node_modules "npm install"
 * Run application "npm run web"

## Troubleshooting
 * If EAS build fails, run locally "eas build --platform android --profile production --build-logger-level debug"

## Setup new project - Game
* Copy all files from main application
* Create new app.json files
  * Replace project name
  * Replace project images
  * Update android and IOS identifiers
  * Delete eas projectId
  * Run npm install
  * Open Expo dashboard and create new project. Copy eas init commad and execute it localy (npm install --global eas-cli && eas init --id 3313aa32-4e74-4f8e-990c-xxxxxxxxx)