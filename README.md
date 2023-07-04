![440x280i](https://user-images.githubusercontent.com/88046770/204434602-687036f0-130b-4056-883a-f70c5c38f496.png)


Chrome extension that tracks scores in [zetamac arithmetic game](https://arithmetic.zetamac.com/) (default settings) in a provided google sheet.
Requires the addition of a google auth web-app api key in the manifest.

Input google sheet id (44 characters in sheets link) into extension popup and the extension will automatically authenticate and add a row to the sheet at the end of a game.
Each data entry will contain the time (UTC) and score.

Requires a google OAuth API key in manifest.json
