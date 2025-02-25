 (function() {
     const blockedPaths = ['/'];

     function applyBlockers() {
         console.log("Apply Blockers")
         const currentPath = window.location.pathname;
         if (blockedPaths.includes(currentPath) && !!document.body) {
             document.body.innerHTML = '<h1>Access to this Reddit page is blocked</h1>';
             history.pushState(null, '', '/blocked');
         }
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
