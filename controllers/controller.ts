// Objeto genérico con configuraciones de la aplicación
const APP_CONFIG = {
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
const CAR_TABLE_COLUMNS_TEMPLATE = [
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
const CAR_TABLE_ROW_TEMPLATE = [
    '<tr id="rowCar{{CAR_POS}}">',
    CAR_TABLE_COLUMNS_TEMPLATE,
    '</tr>'
].join('');

// Variables globales para guardar los objetos Car
let cars: Car[] = [];
let car: Car;

// Función original "createCar" del ejercicio
function createCarOriginal(plate:string,brand:string,color:string){
    let car=new Car(plate,color,brand);
    car.addWheel(new Wheel(2,"SEAT"));
    document.body.innerText="CAR: PLATE: " + car.plate 
    + " COLOR: " +car.color + " BRAND: " + brand 
    + " WHEELS: " + JSON.stringify(car.wheels);

    cars.push(car);
}

// Crear un elemento "Car"
function createCar(plate:string,brand:string,color:string){
    car = new Car(plate, color, brand);
}

// Resetear los campos "invalid" (quitar clase y vaciar su "invalid-feedback" asociado)
const resetInvalidField = function(field: HTMLInputElement) {
    field.classList.remove(APP_CONFIG.invalidClass);
    let invalid = <HTMLElement> document.getElementById(field.id + APP_CONFIG.errorFieldSuffix);
    invalid.textContent = '';
}

// Marcar un campo como "invalid" y añadir el mensaje a su "invalid-feedback" asociado
const setInvalidField = function (field: HTMLInputElement, errorMsg: string) {
    field.classList.add(APP_CONFIG.invalidClass);
    let invalid = <HTMLElement> document.getElementById(field.id + APP_CONFIG.errorFieldSuffix);
    invalid.textContent = errorMsg;
};

// Convertir un string a number
function convertStringToNumber(input: string) { 
    if (!input) return NaN;

    if (input.trim().length==0) { 
        return NaN;
    }
    return Number(input);
}

// Validar el formato de la matrícula
function validateCarPlate(carPlate: string): boolean {
     const regexp = new RegExp(APP_CONFIG.carPlateRegExp, 'gi');
    return regexp.test(carPlate);
}

// Validar el diámetro de la rueda
function validateWheelDiameter(wheelDiameter: number): boolean {
    if (isNaN(wheelDiameter)) {
        return false;
    }
    return (wheelDiameter >= APP_CONFIG.wheelDiameterMin && wheelDiameter <= APP_CONFIG.wheelDiameterMax);
}

// Validar los campos del formulario Coche
function validateCar(form: HTMLFormElement): boolean {
    let errorFound: boolean = false;
    let validationObj = {
        plate: { id: "carPlate", msgErrorReq: "Matrícula obligatoria", msgErrorFormato: "Formato incorrecto." },
        brand: { id: "carBrand", msgErrorReq: "Marca obligatoria" },
        color: { id: "carColor", msgErrorReq: "Color obligatorio" }
    };
    let inputPlate: HTMLInputElement = <HTMLInputElement> document.getElementById(validationObj.plate.id);
    let inputBrand: HTMLInputElement = <HTMLInputElement> document.getElementById(validationObj.brand.id);
    let inputColor: HTMLInputElement = <HTMLInputElement> document.getElementById(validationObj.color.id);

    // Validate CarPlate
    if (inputPlate.value.trim().length == 0) {
        errorFound = true;
        setInvalidField(inputPlate, validationObj.plate.msgErrorReq);
    } else if (!validateCarPlate(inputPlate.value)) {
        errorFound = true;
        setInvalidField(inputPlate, validationObj.plate.msgErrorFormato);
    } else {
        resetInvalidField(inputPlate);
    }
    // Validate CarBrand
    if (inputBrand.value.trim().length == 0) {
        errorFound = true;
        setInvalidField(inputBrand, validationObj.brand.msgErrorReq);
    } else {
        resetInvalidField(inputBrand);
    }
    // Validate CarColor
    if (inputColor.value.trim().length == 0) {
        errorFound = true;
        setInvalidField(inputColor, validationObj.color.msgErrorReq);
    } else {
        resetInvalidField(inputColor);
    }

    return !errorFound;
}

// Validar los campos del formulario Ruedas
function validateWheels(form: HTMLFormElement): boolean {
    let errorFound: boolean = false;
    let validationObj = {
        brand: { id: "wheelBrand", msgErrorReq: "Marca obligatoria"},
        diam: { id: "wheelDiameter", msgErrorReq: "Diámetro obligatorio", msgErrorFormato: "Formato incorrecto (entre 0.4 y 2)."  }
    };
    let inputBrand: HTMLInputElement;// = <HTMLInputElement> document.getElementById(validationObj.brand.id);
    let inputDiam: HTMLInputElement;// = <HTMLInputElement> document.getElementById(validationObj.color.id);

    for (let i = 1; i <= APP_CONFIG.numWheels; i++) {
        inputBrand = <HTMLInputElement> document.getElementById(validationObj.brand.id + i.toString());
        inputDiam = <HTMLInputElement> document.getElementById(validationObj.diam.id + i.toString());
        // Validate WheelBrand
        if (inputBrand.value.trim().length == 0) {
            errorFound = true;
            setInvalidField(inputBrand, validationObj.brand.msgErrorReq);
        } else {
            resetInvalidField(inputBrand);
        }
        // Validate WheelDiameter
        if (inputDiam.value.trim().length == 0) {
            errorFound = true;
            setInvalidField(inputDiam, validationObj.diam.msgErrorReq);
        } else if (!validateWheelDiameter(convertStringToNumber(inputDiam.value))) {
            errorFound = true;
            setInvalidField(inputDiam, validationObj.diam.msgErrorFormato);
        } else {
            resetInvalidField(inputDiam);
        }
    }
    
    return !errorFound;
}

// Añadir un coche a la tabla de coches
function addCarToTable(car: Car) {
    const rowPos = cars.length;
    let tbody: HTMLTableElement = <HTMLTableElement> document.getElementById('carsTableBody');
    let carRowColumns = CAR_TABLE_COLUMNS_TEMPLATE;
    carRowColumns = carRowColumns
        .replace('{{CAR_POS}}', rowPos.toString())
        .replace('{{CAR_PLATE}}', car.plate)
        .replace('{{CAR_BRAND}}', car.brand)
        .replace('{{CAR_COLOR}}', car.color);
    for (let i = 1; i <= APP_CONFIG.numWheels; i++) {
        carRowColumns = carRowColumns
            .replace('{{WHEEL' + i.toString() + '_BRAND}}', '')
            .replace('{{WHEEL' + i.toString() + '_DIAMETER}}', '')
        
    }
    let newRow = <HTMLTableRowElement> tbody.insertRow();
    newRow.id = "carRow" + rowPos.toString();
    newRow.innerHTML = carRowColumns;
}

// Añadir en la tabla de coches los datos de las ruedas
function addWheelsToTable(car: Car) {
    const rowPos = cars.length;
    let row: HTMLElement = <HTMLElement> document.getElementById('carRow' + rowPos.toString());
    let carRowColumns = CAR_TABLE_COLUMNS_TEMPLATE;
    carRowColumns = carRowColumns
        .replace('{{CAR_POS}}', rowPos.toString())
        .replace('{{CAR_PLATE}}', car.plate)
        .replace('{{CAR_BRAND}}', car.brand)
        .replace('{{CAR_COLOR}}', car.color);
    for (let i = 1; i <= APP_CONFIG.numWheels; i++) {
        carRowColumns = carRowColumns
            .replace('{{WHEEL' + i.toString() + '_BRAND}}', car.wheels[i-1].brand)
            .replace('{{WHEEL' + i.toString() + '_DIAMETER}}', car.wheels[i-1].diameter.toString())
    }
    row.innerHTML = carRowColumns;
}

// Inicializar los campos "visibles" con los datos del coche añadido
function setupWheelsForm(plate: string, brand: string, color: string) {
    let inputPlate: HTMLInputElement = <HTMLInputElement> document.getElementById('wheelCarPlate');
    let inputBrand: HTMLInputElement = <HTMLInputElement> document.getElementById('wheelCarBrand');
    let inputColor: HTMLInputElement = <HTMLInputElement> document.getElementById('wheelCarColor');
    inputPlate.value = plate;
    inputBrand.value = brand;
    inputColor.value = color;
}

// Cambiar la visualización de un formulario a otro, reseteando el que se oculta
function toggleVisibleForm(form: HTMLFormElement, nextForm: HTMLFormElement) {
    form.classList.add('d-none')
    form.reset();
    nextForm.classList.remove('d-none');
}

// Control de los "submit" (según el formulario que se envía)
function doSubmit(idForm: string): boolean {
    let form: HTMLFormElement;
    let nextForm: HTMLFormElement;
    let btnSubmitCar: HTMLButtonElement = <HTMLButtonElement> document.getElementById('submitCar');
    switch (idForm.toLowerCase()) {
        case 'carform':
            form = <HTMLFormElement> document.getElementById(idForm);
            nextForm = <HTMLFormElement> document.getElementById('wheelsForm');
            if (validateCar(form)) {
                let inputPlate: HTMLInputElement = <HTMLInputElement> document.getElementById('carPlate');
                let inputBrand: HTMLInputElement = <HTMLInputElement> document.getElementById('carBrand');
                let inputColor: HTMLInputElement = <HTMLInputElement> document.getElementById('carColor');

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
            form = <HTMLFormElement> document.getElementById(idForm);
            nextForm = <HTMLFormElement> document.getElementById('carForm');
            if (validateWheels(form)) {
                let inputWheelBrand: HTMLInputElement;
                let inputWheelDiameter: HTMLInputElement
                for (let i = 1; i <= APP_CONFIG.numWheels; i++) {
                    inputWheelBrand = <HTMLInputElement> document.getElementById('wheelBrand' + i.toString());
                    inputWheelDiameter = <HTMLInputElement> document.getElementById('wheelDiameter' + i.toString());
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