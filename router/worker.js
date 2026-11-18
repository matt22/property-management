export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/perfecto' || url.pathname.startsWith('/perfecto/')) {
      return env.PERFECTO.fetch(request);
    }
    // The Acme service is configured after its independent deployment is ready.
    url.pathname = '/perfecto';
    url.search = '';
    return Response.redirect(url.toString(), 302);
  },
};
