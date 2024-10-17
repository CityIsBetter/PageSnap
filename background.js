async function handleCapture(tabId, tabUrl) {
  try {
    // Skip restricted URLs
    if (tabUrl.startsWith('chrome://') || 
        tabUrl.startsWith('edge://') || 
        tabUrl.startsWith('about:')) {
      console.error('Cannot capture screenshots of browser pages');
      return;
    }

    console.log('Capturing tab:', tabId, tabUrl);

    // Inject content script first
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });

    // Then inject html2canvas
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['html2canvas.min.js']
    });

    // Take the screenshot
    const result = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, { action: 'takeFullScreenshot' }, response => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });

    if (result && result.dataUrl) {
      // Generate filename with timestamp and domain
      const urlObj = new URL(tabUrl);
      const domain = urlObj.hostname.replace(/[^a-zA-Z0-9]/g, '-');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `screenshot-${domain}-${timestamp}.png`;

      const downloadId = await chrome.downloads.download({
        filename: filename,
        url: result.dataUrl
      });
      
      console.log('Download started with ID:', downloadId);
    } else {
      throw new Error('No screenshot data received');
    }
  } catch (error) {
    console.error('Capture error:', error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
}

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureTab' && request.tabId) {
    handleCapture(request.tabId, request.tabUrl)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Handler error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
});

// Optional: Handle install/update events
chrome.runtime.onInstalled.addListener(details => {
  console.log('Extension installed/updated:', details.reason);
});