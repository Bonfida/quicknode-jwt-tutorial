import { handleOptions, handleRequest } from './handler'

addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method === 'OPTIONS') {
    event.respondWith(handleOptions(request))
  } else if (request.method === 'GET') {
    event.respondWith(handleRequest(request))
  }
})
