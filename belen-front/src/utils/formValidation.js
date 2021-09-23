export function minLengthValidation(inputData, minLength) {
    const { value } = inputData;

    if(value.trim().length >= minLength) {
        inputData.value = value;
        return true;
    } else {
        inputData.value = value.trim();
        return false;
    }
}

export function numberValidation(inputData, minLength) {
    const { value } = inputData;

    if(isNaN(value)) {
        return false;
    } else {
        return true;
    }
}

export function codeValidation(inputData, minLength) {
    const { value } = inputData;
    
    if(value.trim().length >= minLength) {
        inputData.value = value.toUpperCase();
        return true;
    } else {
        inputData.value = value.trim().toUpperCase();
        return false;
    }
}
export function emailValidation(inputData) {
    // eslint-disable-next-line no-useless-escape
    const emailValid = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const {value} = inputData;

    const resultValidation = emailValid.test(value);
    if(resultValidation) {
        return true;
    } else {
        return false;
    }
}

export function rutValidation(inputData) {
    var value = inputData.value.replace('.','');
    value = value.replace('-','');

    var body = value.slice(0,-1);
    var dv = value.slice(-1).toUpperCase();
    
    inputData.value = body + '-'+ dv

    var rut = inputData.value;
    if (rut.toString().trim() !== '' && rut.toString().indexOf('-') > 0) {
        var characters = [];
        var serie = [2, 3, 4, 5, 6, 7];
        var dig = rut.toString().substr(rut.toString().length - 1, 1);
        rut = rut.toString().substr(0, rut.toString().length - 2);

        for (var i = 0; i < rut.length; i++) {
            characters[i] = parseInt(rut.charAt((rut.length - (i + 1))));
        }

        var summation = 0;
        var k = 0;
        var rest = 0;

        for (var j = 0; j < characters.length; j++) {
            if (k === 6) {
                k = 0;
            }
            summation += parseInt(characters[j]) * parseInt(serie[k]);
            k++;
        }

        rest = summation % 11;
        dv = 11 - rest;

        if (dv === 10) {
            dv = "K";
        }
        else if (dv === 11) {
            dv = 0;
        }

        if (dv.toString().trim().toUpperCase() === dig.toString().trim().toUpperCase())
            return true;
        else
            return false;
    }
    else {
        return false;
    }
}