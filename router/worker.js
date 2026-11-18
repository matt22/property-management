export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/perfecto' || url.pathname.startsWith('/perfecto/')) {
      return env.PERFECTO.fetch(request);
    }
    if (url.pathname === '/acme' || url.pathname.startsWith('/acme/')) {
      return env.ACME.fetch(request);
    }
    url.pathname = '/perfecto';
    url.search = '';
    return Response.redirect(url.toString(), 302);
  },
};
