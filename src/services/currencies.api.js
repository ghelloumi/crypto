import {tableToLink} from "../utils";
import {handleErrors} from "./HandleErrors";
import {getToken, headers} from "../constants";

export async function getCryptoCompare(cryptoCurrencies, currency) {
    return fetch(`${process.env.REACT_APP_CRYPTO_COMPARE}?fsyms=${tableToLink(cryptoCurrencies)}&tsyms=${currency}`, {
        method: 'GET',
        headers,
        json: true,
    })
        .then(handleErrors)
        .then(res => res.json());
}

export async function userCreate(credentials) {
    return fetch(`${process.env.REACT_APP_API}users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(credentials),
        json: true,
    })
        .then(handleErrors)
        .then(res => res.json());
}

export async function userLogin(credentials) {
    return fetch(`${process.env.REACT_APP_API}users/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify(credentials),
    })
        .then(handleErrors)
        .then(res => res);
}


export async function userLogin2(credentials) {
    return fetch(`${process.env.REACT_APP_API}users/login2`, {
        method: 'POST',
        headers,
        body: JSON.stringify(credentials),
        json: true,
    })
        .then(handleErrors)
        .then(res => res.json());
}

export async function verifToken() {
    return fetch(`${process.env.REACT_APP_API}users/verif`, {
        method: 'POST',
        headers: {
            ...headers,
            'Authorization': getToken()
        },
        json: true,
    })
        .then(handleErrors)
}

export async function fetchUserData() {
    return fetch(`${process.env.REACT_APP_API}users/fetch`, {
        method: 'GET',
        headers: {
            ...headers,
            'Authorization': getToken()
        },
        json: true,
    })
        .then(handleErrors)
        .then(res => res.json());
}

export async function updateBalance() {
    return fetch(`${process.env.REACT_APP_API}balance`, {
        method: 'GET',
        headers: {
            ...headers,
            'Authorization': getToken()
        },
        json: true,
    })
        .then(handleErrors)
        .then(res => res.json());
}

export function getBalanceUSD() {
    return fetch(`${process.env.REACT_APP_CRYPTO_BALANCE}?fsyms=BTC%2CETH%2CLTC%2CEOS&tsyms=USD`, {
        method: 'GET',
        headers,
        json: true,
    })
        .then(handleErrors)
        .then(res => res.json());
}

export async function withdraw(credentials) {
    return fetch(`${process.env.REACT_APP_API}withdraw`, {
        method: 'POST',
        headers: {
            ...headers,
            'Authorization': getToken()
        },
        body: JSON.stringify(credentials),
        json: true,
    })
        .then(handleErrors)
        .then(res => res.json());
}

export async function exchangeApi(credentials) {
    return fetch(`${process.env.REACT_APP_API}exchange`, {
        method: 'POST',
        headers: {
            ...headers,
            'Authorization': getToken()
        },
        body: JSON.stringify(credentials),
        json: true,
    })
        .then(handleErrors)
        .then(res => res.json());
}