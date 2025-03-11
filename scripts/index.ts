document.addEventListener('DOMContentLoaded', () => {
  const inferiorX = document.getElementById('inferiorX') as HTMLInputElement
  const superiorX = document.getElementById('superiorX') as HTMLInputElement
  const calculateButton = document.getElementById('calculateButton') as HTMLButtonElement

  calculateButton?.addEventListener('click', () => {
    let currentLimits: Limits = {
      inferiorLimit: Number(inferiorX.value),
      superiorLimit: Number(superiorX.value)
    }
    let i = 0
    let previousValue = 0
    let currentValue = 0
    let error = 100
    do {
      // Calcular punto medio
      const midPoint = calculateMidPoint(currentLimits.inferiorLimit, currentLimits.superiorLimit)
      // Evaluar el valor del punto medio
      const evaluatedPoint = evaluarEcuacion(midPoint)
      // Actualizar los limites
      currentLimits = compareValue({
        evaluatedValue: evaluatedPoint,
        insertedValue: midPoint,
        currentLimits: currentLimits
      })
      previousValue = currentValue
      currentValue = midPoint
      // Calcular error
      if(i!=0){
        error = calculateError(previousValue, currentValue)
      }
      i++
    } while (i>0 && error>1);
    console.log(`Resultado ${currentValue}`)
  })

})

function evaluarEcuacion(xValue: number): number {
  const ecuation: string = (document.getElementById('ecuation') as HTMLInputElement).value;
  
  // Primero reemplazar x con su valor numérico (entre paréntesis)
  let expression: string = ecuation.replace(/x/g, `(${xValue})`);
  
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
    const result: number = Function(`"use strict"; return ${expression}`)();
    return result;
  } catch (error) {
    console.error("Error al evaluar:", error);
    throw error;
  }
}

function calculateMidPoint(x1: number, x2: number): number {
  return (x2 + x1) / 2
}

type Limits = {
  inferiorLimit: number,
  superiorLimit: number
}

function compareValue({
  evaluatedValue,
  insertedValue, 
  currentLimits
} : {evaluatedValue: number, insertedValue: number, currentLimits: Limits}): Limits {
  if (evaluatedValue < 0) {
    return { ...currentLimits, inferiorLimit: insertedValue }
  } else if (evaluatedValue > 0) {
    return { ...currentLimits, superiorLimit: insertedValue }
  }
  else {
    return {
      inferiorLimit: 0,
      superiorLimit: 0
    }
  }
}

function calculateError(previousValue: number, currentValue: number): number{
  return Math.abs((previousValue - currentValue) / previousValue) * 100
}