# zetatrack

Chrome extension that tracks scores in zetamac arithmetic game (default settings) in a provided google sheet.
Requires the addition of a google auth web-app api key in the manifest.

Input google sheet id (44 characters in sheets link) into extension popup and the extension will automatically authenticate and add a row to the sheet at the end of a game.
Each data entry will contain the time (UTC) and score.
