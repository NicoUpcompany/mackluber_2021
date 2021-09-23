import { basePath, apiVersion } from './config';

export function getStatsApi(token) {
    const url = `${basePath}/${apiVersion}/stats`;

    const params = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        }
    };

    return fetch(url, params)
        .then(resp => {
            return resp.json();
        })
        .then(result => {
            return result;
        })
        .catch(err => {
            return err.message;
        });
}

export function getTimeApi() {
    const url = `${basePath}/${apiVersion}/time`;

    const params = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };

    return fetch(url, params)
        .then(resp => {
            return resp.json();
        })
        .then(result => {
            return result;
        })
        .catch(err => {
            return err.message;
        });
}