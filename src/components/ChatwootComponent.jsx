import React, { useEffect } from 'react';

const ChatwootComponent = () => {
  useEffect(() => {
    const BASE_URL = "https://chatwoot-production-299c.up.railway.app";
    
    function loadChatwootSDK(d, t) {
      const g = d.createElement(t);
      const s = d.getElementsByTagName(t)[0];
      
      g.src = BASE_URL + "/packs/js/sdk.js";
      g.async = true;
      s.parentNode.insertBefore(g, s);
      
      g.onload = function() {
        window.chatwootSDK.run({
          websiteToken: 'qQDrTj1ue7ZzvTVAHXGtfmaE',
          baseUrl: BASE_URL
        });
      };
    }
    
    loadChatwootSDK(document, "script");

    return () => {
    };
  }, []); 
  
  return null; 
};

export default ChatwootComponent;
