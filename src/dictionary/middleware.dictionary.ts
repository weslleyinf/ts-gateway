import httpProxy from 'express-http-proxy';

export const MiddlewareDictionary: any = {
    'product': () => httpProxy('http://localhost:3001/product')
}