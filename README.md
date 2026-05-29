# B2D: Bookmark to .desktop File Converter
I hate using my mouse so I wanted to add my bookmarks to my application launcher, so I wrote this program to convert bookmarks to .desktop files.

The published extension can be found at [here](https://chromewebstore.google.com/detail/bookmark-to-desktop/bdobfckegmaghhdhkpibignfnniilnck?hl=en-GB).

## Manual Installation / Run Instructions
- Clone repo: `git clone https://github.com/joshepen/b2b`
- Open chrome extensions page: `chrome://extensions`
- Make sure `Developer mode` is checked on in the top right corner
- Click `Load unpacked` and select the repo folder

## Usage
- Click the extension to open the popup
- Select which bookmarks you would like to convert, or search for them using the search bar
- Click `Download`
- If multiple bookmarks were selected, extract from zip file
- Place .desktop files in `$XDG_DATA_HOME/applications/` (usually `$HOME/.local/share/applications/`)
    - To keep things organized I use a subfolder `bookmarks/`
