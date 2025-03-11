"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const inferiorX = document.getElementById('inferiorX');
    const superiorX = document.getElementById('superiorX');
    const calculateButton = document.getElementById('calculateButton');
    calculateButton === null || calculateButton === void 0 ? void 0 : calculateButton.addEventListener('click', () => {
        let currentLimits = {
            inferiorLimit: Number(inferiorX.value),
            superiorLimit: Number(superiorX.value)
        };
        let i = 0;
        let previousValue = 0;
        let currentValue = 0;
        let error = 100;
        do {
            // Calcular punto medio
            const midPoint = calculateMidPoint(currentLimits.inferiorLimit, currentLimits.superiorLimit);
            // Evaluar el valor del punto medio
            const evaluatedPoint = evaluarEcuacion(midPoint);
            // Actualizar los limites
            currentLimits = compareValue({
                evaluatedValue: evaluatedPoint,
                insertedValue: midPoint,
                currentLimits: currentLimits
            });
            previousValue = currentValue;
            currentValue = midPoint;
            // Calcular error
            if (i != 0) {
                error = calculateError(previousValue, currentValue);
            }
            i++;
        } while (i > 0 && error > 1);
        console.log(`Resultado ${currentValue}`);
    });
});
function evaluarEcuacion(xValue) {
    const ecuation = document.getElementById('ecuation').value;
    // Primero reemplazar x con su valor numérico (entre paréntesis)
    let expression = ecuation.replace(/x/g, `(${xValue})`);
    // Luego hacer las transformaciones
    expression = expression
        // Reemplazar ^ con ** para potencias
        .replace(/\^/g, '**')
        // Manejar multiplicación implícita
        .replace(/(\d+)([a-zA-Z])/g, '$1*$2')
        .replace(/(\d+)\(/g, '$1*(')
        .replace(/([a-zA-Z])\(/g, '$1*(');
    console.log("Expresión a evaluar:", expression);
    try {
        // Evaluar la expresión
        const result = Function(`"use strict"; return ${expression}`)();
        return result;
    }
    catch (error) {
        console.error("Error al evaluar:", error);
        throw error;
    }
}
function calculateMidPoint(x1, x2) {
    return (x2 + x1) / 2;
}
function compareValue({ evaluatedValue, insertedValue, currentLimits }) {
    if (evaluatedValue < 0) {
        return Object.assign(Object.assign({}, currentLimits), { inferiorLimit: insertedValue });
    }
    else if (evaluatedValue > 0) {
        return Object.assign(Object.assign({}, currentLimits), { superiorLimit: insertedValue });
    }
    else {
        return {
            inferiorLimit: 0,
            superiorLimit: 0
        };
    }
}
function calculateError(previousValue, currentValue) {
    return Math.abs((previousValue - currentValue) / previousValue) * 100;
}
