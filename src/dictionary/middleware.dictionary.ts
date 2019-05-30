import httpProxy from 'express-http-proxy';

const baseServiceProxy = httpProxy('http://127.0.0.1:3000/', {
    proxyReqPathResolver: () => { return '/teste'; },
});

export const MiddlewareDictionary: any = {
    'teste': baseServiceProxy
}