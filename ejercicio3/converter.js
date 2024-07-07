class Currency {            //El proposito de la clase es representar una moneda
    constructor(code, name) {
        this.code = code;   //ej de codigo para el dolar: USD
        this.name = name;   //ej. United States Dollar
    }
}

class CurrencyConverter {   // Clase para Gestionar la obtención de monedas y la conversión de divisas.
    constructor(apiUrl) {
        this.apiUrl = apiUrl;//URL de la API para obtener datos de divisas
        this.currencies = [];//Arreglo de objetos Currency obtenidos de la API
    }

    async getCurrencies() { //Obtener la lista de monedas desde la API
        try {   //Realiza una petición al endpoint /currencies de la API de Frankfurter.
            const response = await fetch(`${this.apiUrl}/currencies`);//fetch: Realiza una petición GET a la URL https://api.frankfurter.app/currencies.
            const data = await response.json();//convierte la respuesta a formato json
            //Almacena las monedas obtenidas en this.currencies como instancias de la clase Currency.
            this.currencies = Object.keys(data).map(code => new Currency(code, data[code]));
        } catch (error) {
            console.error("Error al obtener las monedas:", error);
        }
    }

    async convertCurrency(amount, fromCurrency, toCurrency) {
                            //Convertir una cantidad de una moneda a otra usando la API
        //Recibe amount, fromCurrency (instancia de Currency), y toCurrency (instancia de Currency).
        try {
            if (fromCurrency.code === toCurrency.code) { //Si los codigos de la moneda son iguales retorna (el monto sin convertir) amount sin realizar ninguna petición
                return amount;
            }
            //Si los códigos de moneda son diferentes, realiza una petición HTTP a la API y retorna el monto convertido
            //fetch: Realiza una petición HTTP GET a la URL ${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code} 
            //para obtener la tasa de conversión.
            const response = await fetch(`${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`);
            const data = await response.json();//Convierte la respuesta en formato JSON.
            return data.rates[toCurrency.code];// Retorna la cantidad convertida.
        } catch (error) {   //Maneja errores en caso de que la petición falle y retorna null en caso de error
            console.error("Error al convertir la moneda:", error);
            return null;
        }
    }
}
                            //Codigo del evento DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => { //Espera a que el DOM este cargado
    //Inicializa el formulario y los elementos de selección (select).
    const form = document.getElementById("conversion-form");//Obtiene referencias a elementos del formulario
    const resultDiv = document.getElementById("result");    //y resultados
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const converter = new CurrencyConverter("https://api.frankfurter.app");//Crea una instancia de CurrencyConverter
                                                                        //con la URL de la API
    //Cuando el documento se carga, se llama a getCurrencies y se llena el formulario con las monedas obtenidas:
                                                                        
    await converter.getCurrencies(); //Llama al metodo getCurrencies para obtener la lista de monedas disponibles
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);
    //Llena los elementos select (fromCurrencySelect, toCurrencySelect) con las monedas obtenidas
    // usando la función populateCurrencies

    /********Manejo del Formulario */
    form.addEventListener("submit", async (event) => {  //Añade un eventListener al formulario p manejar el evento enio
        event.preventDefault();
            //Obtiene los valores del formulario (amount, fromCurrency, toCurrency)
        const amount = document.getElementById("amount").value;
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );
        //Llama a convertCurrency para convertir la cantidad especificada 
        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );
        // Muestra el resultado de la conversión en resultDiv.
        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${
                fromCurrency.code
            } son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }
    });

    function populateCurrencies(selectElement, currencies) {//Esta funcion Llena un elemento select con las monedas disponibles
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
});
