(async function() {
    // Only inject if not already present
    if (window.isScreenshotInitialized) return;
    window.isScreenshotInitialized = true;
  
    async function getFullPageScreenshot() {
      // Store original scroll position and styles
      const originalScrollPos = {
        x: window.scrollX,
        y: window.scrollY
      };
      
      const fixedElements = [];
      document.querySelectorAll('*').forEach(el => {
        const position = window.getComputedStyle(el).position;
        if (position === 'fixed') {
          fixedElements.push({ element: el, originalPosition: position });
          el.style.position = 'absolute';
        }
      });
  
      try {
        const fullHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        );
        const fullWidth = Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth
        );
  
        // Take screenshot
        const screenshot = await html2canvas(document.documentElement, {
          allowTaint: true,
          useCORS: true,
          logging: false,
          width: fullWidth,
          height: fullHeight,
          windowWidth: fullWidth,
          windowHeight: fullHeight,
          scrollX: 0,
          scrollY: 0,
          x: 0,
          y: 0,
          scale: window.devicePixelRatio
        });
  
        return screenshot.toDataURL('image/png');
      } finally {
        // Restore fixed positions
        fixedElements.forEach(({ element, originalPosition }) => {
          element.style.position = originalPosition;
        });
  
        // Restore scroll position
        window.scrollTo(originalScrollPos.x, originalScrollPos.y);
      }
    }
  
    // Listen for messages
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'takeFullScreenshot') {
        getFullPageScreenshot()
          .then(dataUrl => {
            sendResponse({ dataUrl });
          })
          .catch(error => {
            console.error('Screenshot error:', error);
            sendResponse({ error: error.message });
          });
        return true; // Keep the message channel open
      }
    });
  })();
  

  