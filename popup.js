let mediaRecorder;
let recordedChunks = [];
let timerInterval;
let startTime;

// Helper function to format time
function formatTime(seconds) {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
}

// Capture Window Screenshot
document.getElementById('window-screenshot').addEventListener('click', () => {
    const button = document.getElementById('window-screenshot');
    button.disabled = true;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let tab = tabs[0];
        if (tab.url.startsWith('http') || tab.url.startsWith('https')) {
            chrome.tabs.captureVisibleTab(null, {}, function(dataUrl) {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'window-screenshot.png';
                link.click();
                button.disabled = false; // Enable the button again
            });
        } else {
            alert('Cannot take a screenshot of this page.');
            button.disabled = false; // Enable the button again
        }
    });
});

// Capture Full Page Screenshot
document.getElementById('fullpage-screenshot').addEventListener('click', async () => {
    const button = document.getElementById('fullpage-screenshot');
    button.disabled = true;
    button.textContent = 'Capturing...';
  
    try {
      // Get the active tab first
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
        status: 'complete'
      });
  
      if (!tab?.id || !tab?.url) {
        throw new Error('No valid tab found');
      }
  
      // Send message with tab info and wait for response
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'captureTab',
          tabId: tab.id,
          tabUrl: tab.url
        }, response => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });
  
      if (response?.success) {
        window.close();
      } else {
        throw new Error(response?.error || 'Failed to capture screenshot');
      }
    } catch (error) {
      console.error('Error:', error);
      button.textContent = 'Error! Try Again';
      setTimeout(() => {
        button.disabled = false;
        button.textContent = 'Capture Full Page';
      }, 2000);
    }
  });

// Start recording function
function startRecording(stream) {
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    startTime = Date.now();

    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timer').textContent = formatTime(elapsed);
    }, 1000);

    mediaRecorder.ondataavailable = function(event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = function() {
        clearInterval(timerInterval);
        document.getElementById('timer').textContent = '00:00'; // Reset timer

        const blob = new Blob(recordedChunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tab-recording.mp4';
        link.click();
        URL.revokeObjectURL(url); // Clean up URL
    };

    mediaRecorder.start();
}

// Start tab recording
document.getElementById('start-recording').addEventListener('click', () => {
    chrome.tabCapture.capture({ audio: true, video: true }, (stream) => {
        if (!stream) {
            alert('Unable to capture tab media.');
            return;
        }
        startRecording(stream);
        document.getElementById('start-recording').style.display = 'none';
        document.getElementById('stop-recording').style.display = 'flex';
    });
});

// Stop tab recording
document.getElementById('stop-recording').addEventListener('click', () => {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
    document.getElementById('start-recording').style.display = 'flex';
    document.getElementById('stop-recording').style.display = 'none';
});
