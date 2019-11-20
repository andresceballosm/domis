import { urlService } from "./dataUrl";

export const POST = ( values, API) => {
    console.log('values',values)
    console.log('API',urlService + API)
    return fetch(urlService + API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-token': values.token
        },
        body:  JSON.stringify(values),
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('responseJson',responseJson)
        return responseJson;
    })
}

export const GET = ( values, API) => {
    return fetch(urlService + API + values.id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-token': values.token
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
}

export const GETSIMPLE = (values, API) => {
    return fetch(urlService + API, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-token': values.token
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
}

export const DELETE = ( id, API) => {
    console.log('urlService + API + id',urlService + API + id)
    return fetch(urlService + API + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            //'api-token': values.token
        },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
}

export const PUT = ( values, API ) => {
    console.log('urlService + API + id',urlService + API + values.id)
    return fetch(urlService + API + values.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'api-token': values.token
        },
        body:  JSON.stringify(values.order),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
}

