import { basePath, apiVersion } from './config';

export function makeQuestionApi(token, question) {
    const url = `${basePath}/${apiVersion}/make-question`;

    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify(question)
    }

    return fetch(url, params).then(resp => {
        return resp.json();
    }).then(result => {
        return result;
    }).catch(err => {
        return err.message;
    });
}

export function getQuestionApi(token) {
    const url = `${basePath}/${apiVersion}/get-question`;

    const params = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        }
    }

    return fetch(url, params).then(resp => {
        return resp.json();
    }).then(result => {
        return result;
    }).catch(err => {
        return err.message;
    });
}