// We get the URL from the browser
let url = window.location.href

// We split the url into an array of two elements, the first one is our URL without the link
url = url.split('.html')

// With the 'replaceState()' method we replace the previous URL with our current URL
window.history.replaceState(null, null, url[0])