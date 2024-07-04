class Sensor {                                   //Implementar la propiedad computada `updateValue` 
        constructor(id, name, type, value, unit, updated_at) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.value = value;
        this.unit = unit;
        this.updated_at = updated_at;
        
        Object.defineProperty(this, 'updateValue', {
            set(newValue) {                     //mediante un *setter* que permita actualizar el valor del sensor y la fecha de actualización.

                this.value = newValue;
                this.updated_at = new Date().toISOString();
            }
        });
    }
}

class SensorManager {
    constructor() {
        this.sensors = [];
    }

    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    async loadSensors(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al cargar los sensores');
            }
            const sensorsData = await response.json();
            sensorsData.forEach(sensorData => {
                const sensor = new Sensor(
                    sensorData.id,
                    sensorData.name,
                    sensorData.type,
                    sensorData.value,
                    sensorData.unit,
                    sensorData.updated_at
                );
                this.addSensor(sensor);
            });
            this.render();
        } catch (error) {
            console.error('Error:', error);
        }
    }
 
    updateSensor(id) {
        const sensor = this.sensors.find((sensor) => sensor.id === id);
        if (sensor) {
            let newValue;
            switch (sensor.type) {
                case "temperatura": // Rango de -30 a 50 grados Celsius
                    newValue = (Math.random() * 80 - 30).toFixed(2);
                    break;
                case "humedad": // Rango de 0 a 100%
                    newValue = (Math.random() * 100).toFixed(2);
                    break;
                case "presion": // Rango de 960 a 1040 hPa (hectopascales o milibares)
                    newValue = (Math.random() * 80 + 960).toFixed(2);
                    break;
                default: // Valor por defecto si el tipo es desconocido
                    newValue = (Math.random() * 100).toFixed(2);
            }
            sensor.updateValue = newValue;                  //actualizamos el valor del sensor utilizando el setter updateValue
            this.render();
        } else {
            console.error(`Sensor ID ${id} no encontrado`);
        }
    }
    //Para cargar un archivo JSON se utiliza una solicitud HTTP (un fetch en un entorno de navegador)
    //Debe ser una funcion? entonces falta palabra function
    //Se define una función loadSensors que toma una URL como parámetro.
    //Se utiliza fetch para hacer una solicitud HTTP GET al archivo JSON.
    //Si la respuesta es exitosa, se convierte a un objeto JavaScript usando response.json().
    //La función devuelve la lista de sensores.
    render() {
        const container = document.getElementById('sensor-container');
        container.innerHTML = '';
        this.sensors.forEach(sensor => {
            const sensorCard = document.createElement('div');
            sensorCard.className = 'column is-one-third';
            sensorCard.innerHTML = `
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Sensor ID: ${sensor.id}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                <strong>Tipo:</strong> ${sensor.type}
                            </p>
                            <p>
                               <strong>Valor:</strong> 
                               ${sensor.value} ${sensor.unit}
                            </p>
                        </div>
                        <time datetime="${sensor.updated_at}">
                            Última actualización: ${new Date(sensor.updated_at).toLocaleString()}
                        </time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item update-button" data-id="${sensor.id}">Actualizar</a>
                    </footer>
                </div>
            `;
            container.appendChild(sensorCard);
        });

        const updateButtons = document.querySelectorAll('.update-button');
        updateButtons.forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                const sensorId = parseInt(button.getAttribute('data-id'));
                this.updateSensor(sensorId);
            });
        });
    }

 
}

const monitor = new SensorManager();

monitor.loadSensors("sensors.json");

//Se llama a loadSensors con la URL 'sensors.json', y luego se registra en la consola la lista de sensores.

