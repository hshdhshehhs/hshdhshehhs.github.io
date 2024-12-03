document.addEventListener("DOMContentLoaded", function () {
    const iframe = document.getElementById('myIframe');
    const urlParam = getQueryParam('url');
    const storedUrl = localStorage.getItem('iframeSrc');

    if (urlParam) {
        const decodedUrl = decodeURIComponent(urlParam);
        iframe.src = decodedUrl;
        localStorage.setItem('iframeSrc', decodedUrl); 
        history.replaceState(null, '', window.location.pathname); 
        console.log('Iframe URL set from query param:', decodedUrl);
    } 
    else if (storedUrl) {
        iframe.src = storedUrl;
        console.log('Iframe URL set from localStorage:', storedUrl);
    } 
    else {
        iframe.src = 'https://example.com'; 
        console.log('Iframe URL set to default');
    }
});

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function toggleFullscreen() {
    const iframe = document.getElementById('myIframe');
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { 
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { 
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { 
        iframe.msRequestFullscreen();
    }
}

function refreshIframe() {
    const iframe = document.getElementById('myIframe');
    iframe.src = iframe.src;  
    console.log('Iframe refreshed');
}

function openInNewTab() {
    const iframe = document.getElementById('myIframe');
    window.open(iframe.src, '_blank');
    console.log('Iframe source opened in new tab');
}

function activateScript() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3';
    script.async = true;
    script.defer = true;
    script.onload = () => {
        new Crate({
            server: '1271606448878780478',
            channel: '1297604471307763762' 
        });
    };
    document.body.appendChild(script);
    console.log('Script activated');
}

function goToAnotherPage() {
    window.location.href = "/leaderboards.html";
    console.log('Navigated to leaderboards page');
}
