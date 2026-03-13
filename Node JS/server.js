import http, { get } from 'node:http'
import { getDataFromDB } from './database/db.js'
import { error } from 'node:console';
import { sendJSONResponse } from './utils/sendJSONResponse.js';
import { getDataBy } from './utils/getDataBy.js';
import { getDataByQueryParams } from './utils/getDataByQueryParams.js'
const PORT = 8000;

// http://localhost:8000/
// http://localhost:8000/api

const server = http.createServer(async (req, res) => {    
    const destinations = await getDataFromDB();
    
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    
    const queryObj = Object.fromEntries(urlObj.searchParams);
    
    
    if(req.url.startsWith('/api/continent/') && req.method === 'GET'){
        
        const continent = req.url.split('/').pop()
        
        const filteredData = getDataBy(destinations, 'continent',continent)
        
        sendJSONResponse(res,200,filteredData);
    }

    else if(req.url.startsWith('/api/country/') && req.method === 'GET'){
        
        const country = req.url.split('/').pop()
        
        const filteredData = getDataBy(destinations, 'country', country)
        
        sendJSONResponse(res,200,filteredData);
    }

    else if(urlObj.pathname === '/api' && req.method === 'GET'){
        let filteredData = getDataByQueryParams(destinations, queryObj)
        sendJSONResponse(res,200,filteredData);
    }

    else{
        sendJSONResponse(res,404,{
            error: "Not Found",
            message: "This request route does not exist."
        })
    }
});



server.listen(PORT, () => {
    console.log(` Server running on the port: ${PORT}`);
    console.log("http://localhost:8000");
});
















