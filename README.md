# Screenshot Extension

A simple Chrome extension that allows users to capture screenshots of the current tab, take full-page screenshots, and record the current tab. The extension uses `html2canvas` for capturing the visible portion of the page and supports full-page captures by scrolling.

## Features

- **Window Screenshot**: Capture the visible portion of the current tab.
- **Full Page Screenshot**: Capture an entire webpage by scrolling.
- **Tab Recording**: Record the current tab while the extension is open.
- **Downloadable Images**: Captured images are saved as PNG files.
- **User-Friendly Interface**: Easy-to-use popup with buttons for each screenshot option.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/screenshot-extension.git
   ```

2. **Navigate to the extension directory**:

   ```bash
   cd screenshot-extension
   ```

3. **Load the extension in Chrome**:

   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** by toggling the switch in the top right corner.
   - Click on **Load unpacked** and select the directory where you cloned the extension.

4. **Ensure Dependencies**:

   - Make sure to include the `html2canvas` library in your project. You can download it from [html2canvas GitHub](https://github.com/niklasvh/html2canvas) or include it via CDN in your content script.

## Usage

1. Click on the extension icon in the Chrome toolbar.
2. Choose between **Window Screenshot**, **Full Page Screenshot**, or **Record Tab**.
3. For **Recording**, ensure the extension is open while recording. 
4. The captured screenshot will be downloaded automatically.

## Code Structure

```
screenshot-extension/
├── manifest.json          # Extension metadata
├── popup.html             # HTML for the popup UI
├── popup.js               # JavaScript for the popup logic
├── background.js          # Service Worker
├── content.js             # JavaScript for capturing screenshots and recording
└── html2canvas.min.js     # The html2canvas library
```

## Known Issues

- **Full Page Screenshot**: The full-page screenshot feature is buggy on a few websites, leading to incomplete captures.
- **Tab Recording**: The recording feature only works while the extension is open. If the popup is closed, recording will stop.

## Contributing

Contributions are welcome! If you have suggestions or improvements, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [html2canvas](https://github.com/niklasvh/html2canvas) - For providing the screenshot functionality.

### Instructions for Customization

1. **GitHub Link**: Replace `https://github.com/yourusername/screenshot-extension.git` with the actual URL of your GitHub repository.
2. **License**: Ensure that you have the appropriate license file in the project if you choose to mention it.
3. **Features**: Feel free to expand or modify the features section based on the current functionality of your extension.

This README now reflects the additional features and known issues related to your Chrome extension. If you have any further changes or additions, just let me know!
