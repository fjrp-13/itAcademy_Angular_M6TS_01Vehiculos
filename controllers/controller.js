"use strict";
// Objeto genérico con configuraciones de la aplicación
var APP_CONFIG = {
    errorFieldSuffix: "Error",
    numWheels: 4,
    wheelDiameterMin: 0.4,
    wheelDiameterMax: 2,
    // carPlateRegExp: /^[0-9]{4}[a-z]{3}$/gi,
    carPlateRegExp: '^[0-9]{4}[a-zA-Z]{3}$',
    // carPlateRegExp: new RegExp('^[0-9]{4}[a-zA-Z]{3}$', 'gi'),
    invalidClass: 'is-invalid'
};
// Template para crear las columnas de la tabla de coches
var CAR_TABLE_COLUMNS_TEMPLATE = [
    '<th>{{CAR_POS}}</th>',
    '<td>{{CAR_PLATE}}</td>',
    '<td>{{CAR_BRAND}}</td>',
    '<td>{{CAR_COLOR}}</td>',
    '<td>{{WHEEL1_BRAND}}</td>',
    '<td class="text-center">{{WHEEL1_DIAMETER}}</td>',
    '<td>{{WHEEL2_BRAND}}</td>',
    '<td class="text-center">{{WHEEL2_DIAMETER}}</td>',
    '<td>{{WHEEL3_BRAND}}</td>',
    '<td class="text-center">{{WHEEL3_DIAMETER}}</td>',
    '<td>{{WHEEL4_BRAND}}</td>',
    '<td class="text-center">{{WHEEL4_DIAMETER}}</td>'
].join('');
// Template para crear las filas de la tabla de coches
var CAR_TABLE_ROW_TEMPLATE = [
    '<tr id="rowCar{{CAR_POS}}">',
    CAR_TABLE_COLUMNS_TEMPLATE,
    '</tr>'
].join('');
// Variables globales para guardar los objetos Car
var cars = [];
var car;
// Función original "createCar" del ejercicio
function createCarOriginal(plate, brand, color) {
    var car = new Car(plate, color, brand);
    car.addWheel(new Wheel(2, "SEAT"));
    document.body.innerText = "CAR: PLATE: " + car.plate
        + " COLOR: " + car.color + " BRAND: " + brand
        + " WHEELS: " + JSON.stringify(car.wheels);
    cars.push(car);
}
// Crear un elemento "Car"
function createCar(plate, brand, color) {
    car = new Car(plate, color, brand);
}
// Resetear los campos "invalid" (quitar clase y vaciar su "invalid-feedback" asociado)
var resetInvalidField = function (field) {
    field.classList.remove(APP_CONFIG.invalidClass);
    var invalid = document.getElementById(field.id + APP_CONFIG.errorFieldSuffix);
    invalid.textContent = '';
};
// Marcar un campo como "invalid" y añadir el mensaje a su "invalid-feedback" asociado
var setInvalidField = function (field, errorMsg) {
    field.classList.add(APP_CONFIG.invalidClass);
    var invalid = document.getElementById(field.id + APP_CONFIG.errorFieldSuffix);
    invalid.textContent = errorMsg;
};
// Convertir un string a number
function convertStringToNumber(input) {
    if (!input)
        return NaN;
    if (input.trim().length == 0) {
        return NaN;
    }
    return Number(input);
}
// Validar el formato de la matrícula
function validateCarPlate(carPlate) {
    var regexp = new RegExp(APP_CONFIG.carPlateRegExp, 'gi');
    return regexp.test(carPlate);
}
// Validar el diámetro de la rueda
function validateWheelDiameter(wheelDiameter) {
    if (isNaN(wheelDiameter)) {
        return false;
    }
    return (wheelDiameter >= APP_CONFIG.wheelDiameterMin && wheelDiameter <= APP_CONFIG.wheelDiameterMax);
}
// Validar los campos del formulario Coche
function validateCar(form) {
    var errorFound = false;
    var validationObj = {
        plate: { id: "carPlate", msgErrorReq: "Matrícula obligatoria", msgErrorFormato: "Formato incorrecto." },
        brand: { id: "carBrand", msgErrorReq: "Marca obligatoria" },
        color: { id: "carColor", msgErrorReq: "Color obligatorio" }
    };
    var inputPlate = document.getElementById(validationObj.plate.id);
    var inputBrand = document.getElementById(validationObj.brand.id);
    var inputColor = document.getElementById(validationObj.color.id);
    // Validate CarPlate
    if (inputPlate.value.trim().length == 0) {
        errorFound = true;
        setInvalidField(inputPlate, validationObj.plate.msgErrorReq);
    }
    else if (!validateCarPlate(inputPlate.value)) {
        errorFound = true;
        setInvalidField(inputPlate, validationObj.plate.msgErrorFormato);
    }
    else {
        resetInvalidField(inputPlate);
    }
    // Validate CarBrand
    if (inputBrand.value.trim().length == 0) {
        errorFound = true;
        setInvalidField(inputBrand, validationObj.brand.msgErrorReq);
    }
    else {
        resetInvalidField(inputBrand);
    }
    // Validate CarColor
    if (inputColor.value.trim().length == 0) {
        errorFound = true;
        setInvalidField(inputColor, validationObj.color.msgErrorReq);
    }
    else {
        resetInvalidField(inputColor);
    }
    return !errorFound;
}
// Validar los campos del formulario Ruedas
function validateWheels(form) {
    var errorFound = false;
    var validationObj = {
        brand: { id: "wheelBrand", msgErrorReq: "Marca obligatoria" },
        diam: { id: "wheelDiameter", msgErrorReq: "Diámetro obligatorio", msgErrorFormato: "Formato incorrecto (entre 0.4 y 2)." }
    };
    var inputBrand; // = <HTMLInputElement> document.getElementById(validationObj.brand.id);
    var inputDiam; // = <HTMLInputElement> document.getElementById(validationObj.color.id);
    for (var i = 1; i <= APP_CONFIG.numWheels; i++) {
        inputBrand = document.getElementById(validationObj.brand.id + i.toString());
        inputDiam = document.getElementById(validationObj.diam.id + i.toString());
        // Validate WheelBrand
        if (inputBrand.value.trim().length == 0) {
            errorFound = true;
            setInvalidField(inputBrand, validationObj.brand.msgErrorReq);
        }
        else {
            resetInvalidField(inputBrand);
        }
        // Validate WheelDiameter
        if (inputDiam.value.trim().length == 0) {
            errorFound = true;
            setInvalidField(inputDiam, validationObj.diam.msgErrorReq);
        }
        else if (!validateWheelDiameter(convertStringToNumber(inputDiam.value))) {
            errorFound = true;
            setInvalidField(inputDiam, validationObj.diam.msgErrorFormato);
        }
        else {
            resetInvalidField(inputDiam);
        }
    }
    return !errorFound;
}
// Añadir un coche a la tabla de coches
function addCarToTable(car) {
    var rowPos = cars.length;
    var tbody = document.getElementById('carsTableBody');
    var carRowColumns = CAR_TABLE_COLUMNS_TEMPLATE;
    carRowColumns = carRowColumns
        .replace('{{CAR_POS}}', rowPos.toString())
        .replace('{{CAR_PLATE}}', car.plate)
        .replace('{{CAR_BRAND}}', car.brand)
        .replace('{{CAR_COLOR}}', car.color);
    for (var i = 1; i <= APP_CONFIG.numWheels; i++) {
        carRowColumns = carRowColumns
            .replace('{{WHEEL' + i.toString() + '_BRAND}}', '')
            .replace('{{WHEEL' + i.toString() + '_DIAMETER}}', '');
    }
    var newRow = tbody.insertRow();
    newRow.id = "carRow" + rowPos.toString();
    newRow.innerHTML = carRowColumns;
}
// Añadir en la tabla de coches los datos de las ruedas
function addWheelsToTable(car) {
    var rowPos = cars.length;
    var row = document.getElementById('carRow' + rowPos.toString());
    var carRowColumns = CAR_TABLE_COLUMNS_TEMPLATE;
    carRowColumns = carRowColumns
        .replace('{{CAR_POS}}', rowPos.toString())
        .replace('{{CAR_PLATE}}', car.plate)
        .replace('{{CAR_BRAND}}', car.brand)
        .replace('{{CAR_COLOR}}', car.color);
    for (var i = 1; i <= APP_CONFIG.numWheels; i++) {
        carRowColumns = carRowColumns
            .replace('{{WHEEL' + i.toString() + '_BRAND}}', car.wheels[i - 1].brand)
            .replace('{{WHEEL' + i.toString() + '_DIAMETER}}', car.wheels[i - 1].diameter.toString());
    }
    row.innerHTML = carRowColumns;
}
// Inicializar los campos "visibles" con los datos del coche añadido
function setupWheelsForm(plate, brand, color) {
    var inputPlate = document.getElementById('wheelCarPlate');
    var inputBrand = document.getElementById('wheelCarBrand');
    var inputColor = document.getElementById('wheelCarColor');
    inputPlate.value = plate;
    inputBrand.value = brand;
    inputColor.value = color;
}
// Cambiar la visualización de un formulario a otro, reseteando el que se oculta
function toggleVisibleForm(form, nextForm) {
    form.classList.add('d-none');
    form.reset();
    nextForm.classList.remove('d-none');
}
// Control de los "submit" (según el formulario que se envía)
function doSubmit(idForm) {
    var form;
    var nextForm;
    var btnSubmitCar = document.getElementById('submitCar');
    switch (idForm.toLowerCase()) {
        case 'carform':
            form = document.getElementById(idForm);
            nextForm = document.getElementById('wheelsForm');
            if (validateCar(form)) {
                var inputPlate = document.getElementById('carPlate');
                var inputBrand = document.getElementById('carBrand');
                var inputColor = document.getElementById('carColor');
                createCar(inputPlate.value, inputBrand.value, inputColor.value);
                cars.push(car);
                addCarToTable(car);
                // Setup WheelsForm
                setupWheelsForm(inputPlate.value, inputBrand.value, inputColor.value);
                // Cambio de formulario
                toggleVisibleForm(form, nextForm);
            }
            break;
        case 'wheelsform':
            form = document.getElementById(idForm);
            nextForm = document.getElementById('carForm');
            if (validateWheels(form)) {
                var inputWheelBrand = void 0;
                var inputWheelDiameter = void 0;
                for (var i = 1; i <= APP_CONFIG.numWheels; i++) {
                    inputWheelBrand = document.getElementById('wheelBrand' + i.toString());
                    inputWheelDiameter = document.getElementById('wheelDiameter' + i.toString());
                    car.addWheel(new Wheel(convertStringToNumber(inputWheelDiameter.value), inputWheelBrand.value));
                    // Reset form fields
                    inputWheelBrand.value = '';
                    inputWheelDiameter.value = '';
                }
                addWheelsToTable(car);
                // Cambio de formulario
                toggleVisibleForm(form, nextForm);
            }
            break;
    }
    return false;
}
