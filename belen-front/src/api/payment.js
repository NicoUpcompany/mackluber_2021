import { basePath, apiVersion } from './config';

export function MakePaymentApi(data) {
    const url = `${basePath}/${apiVersion}/make-pay`;

    const params = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    };

    return fetch(url, params)
        .then(resp => {
            return resp.json();
        }).then(result => {
            return result;
        }).catch(err => {
            return err.message;
        });
}

export function MakePaymentPaypalApi(data) {
    const url = `${basePath}/${apiVersion}/make-pay-paypal`;

    const params = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    };

    return fetch(url, params)
        .then(resp => {
            return resp.json();
        }).then(result => {
            return result;
        }).catch(err => {
            return err.message;
        });
}

export function getPaymentsApi(token) {
    const url = `${basePath}/${apiVersion}/get-payments`;

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

export function MakeDonationApi(data) {
    const url = `${basePath}/${apiVersion}/make-donation`;

    const params = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    };

    return fetch(url, params)
        .then(resp => {
            return resp.json();
        }).then(result => {
            return result;
        }).catch(err => {
            return err.message;
        });
}

export function MakeDonationPaypalApi(data) {
    const url = `${basePath}/${apiVersion}/make-donation-paypal`;

    const params = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    };

    return fetch(url, params)
        .then(resp => {
            return resp.json();
        }).then(result => {
            return result;
        }).catch(err => {
            return err.message;
        });
}

// export function getTotalAmountApi(token) {
//     const url = `${basePath}/${apiVersion}/get-amount`;

//     const params = {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: token
//         }
//     };

//     return fetch(url, params)
//         .then(resp => {
//             return resp.json();
//         })
//         .then(result => {
//             return result;
//         })
//         .catch(err => {
//             return err.message;
//         });
// }