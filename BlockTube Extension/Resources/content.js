(function() {
    const blockedPaths = ['/', '/feed/explore', '/feed/trending', '/feed/subscriptions', '/shorts'];

    function checkAndBlockHomepage() {
        const currentPath = window.location.pathname;
        if (blockedPaths.includes(currentPath)) {
            document.body.innerHTML = '<h1>Access to this YouTube page is blocked</h1>';
            history.pushState(null, '', '/blocked');
        }
    }

    function blockShortsAndSuggestions() {
        // Block Shorts
        const shortsElements = document.querySelectorAll('.shortsLockupViewModelHost');
        shortsElements.forEach(el => el.style.display = 'none');

        // Block suggested videos
        const suggestedVideos = document.querySelectorAll('[section-identifier="related-items"]');
        suggestedVideos.forEach(el => el.style.display = 'none');
    }

    function cancelAutoplay() {
        // Look for the cancel button in the up next section
        const cancelButtons = Array.from(document.querySelectorAll('button')).filter(button => {
            // Check for various button text possibilities
            const buttonText = (button.textContent || '').toLowerCase();
            return buttonText.includes('cancel') ||
                   buttonText.includes('stop') ||
                   buttonText.includes('×') ||
                   button.getAttribute('aria-label')?.toLowerCase().includes('cancel autoplay');
        });

        // Click the first matching cancel button
        if (cancelButtons.length > 0) {
            cancelButtons[0].click();
            console.log('Autoplay cancelled');
        }

        // Also disable autoplay on the video element itself
        const video = document.querySelector('video');
        if (video) {
            video.autoplay = false;
            // Remove the autoplay attribute
            video.removeAttribute('autoplay');
        }
    }

    // Function to handle "Up Next" autoplay countdown
    function handleUpNext() {
        // Look for countdown elements or autoplay overlays
        const countdownElements = document.querySelectorAll('[class*="ytp-autonav-endscreen"]');
        countdownElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    function applyBlockers() {
        console.log("Apply Blockers")
        checkAndBlockHomepage();
        blockShortsAndSuggestions();
        cancelAutoplay();
        handleUpNext();
    }

    // Initial check
    applyBlockers();

    // Listen for changes to the URL and DOM
    const observer = new MutationObserver(function(mutations) {
        if (document.location.pathname !== '/blocked') {
            applyBlockers();
        }
    });

    observer.observe(document, {subtree: true, childList: true});

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', applyBlockers);

    // Reapply blockers periodically to catch any dynamically loaded content
    setInterval(applyBlockers, 1000);
})();
