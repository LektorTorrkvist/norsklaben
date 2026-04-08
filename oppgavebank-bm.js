/* Wrapper for renamed exercise bank. Loads the original mt-v1-bm.js file. */
(function(){
  const script = document.createElement('script');
  script.src = 'mt-v1-bm.js';
  script.async = false;
  const current = document.currentScript;
  if (current && current.parentNode) {
    current.parentNode.insertBefore(script, current.nextSibling);
  } else {
    document.head.appendChild(script);
  }
})();
