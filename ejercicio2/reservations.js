
class Customer {           // Clase que permite representar a un cliente
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    get info() {
        return `${this.name} (${this.email})`;
    }
}

class Reservation {         // Inicializa las propiedades id, customer, date y guests.
    constructor(id, customer, date, guests) {
        this.id = id;
        this.customer = customer;
        this.date = new Date(date);
        this.guests = guests;
    }

    get info() {            // Propiedad Computada info: Devuelve una cadena con la fecha y hora de la reserva,
                            // la información del cliente y el número de comensales.
        return `Fecha y hora: ${this.date.toLocaleString()}, Cliente: ${this.customer.info}, Número de comensales: ${this.guests}`;
    }

    static validateReservation(date, guests) {  // Método estático validateReservation: Verifica si la fecha de la reserva
        // es posterior a la fecha actual y si el número de comensales es mayor a 0.
        const reservationDate = new Date(date);
        const currentDate = new Date();
        return reservationDate > currentDate && guests > 0;
    }
}

class Restaurant {         // Esta clase permite agregar y renderizar reservas
    constructor(name) {
        this.name = name;
        this.reservations = [];
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }

    render() {
        const container = document.getElementById("reservations-list");
        container.innerHTML = "";
        this.reservations.forEach((reservation) => {
            const reservationCard = document.createElement("div");
            reservationCard.className = "box";
            reservationCard.innerHTML = `
                    <p class="subtitle has-text-primary">
                        Reserva ${
                            reservation.id
                        } - ${reservation.date.toLocaleString()}
                    </p>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                ${reservation.info}
                            </p>
                        </div>
                    </div>
              `;
            container.appendChild(reservationCard);
        });
    }
    
}

document
    .getElementById("reservation-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const customerName = document.getElementById("customer-name").value;
        const customerEmail = document.getElementById("customer-email").value;
        const reservationDate =
            document.getElementById("reservation-date").value;
        const guests = parseInt(document.getElementById("guests").value);

        if (Reservation.validateReservation(reservationDate, guests)) {
            const customerId = restaurant.reservations.length + 1;
            const reservationId = restaurant.reservations.length + 1;

            const customer = new Customer(
                customerId,
                customerName,
                customerEmail
            );
            const reservation = new Reservation(
                reservationId,
                customer,
                reservationDate,
                guests
            );

            restaurant.addReservation(reservation);
            restaurant.render();

        } else {
            alert("Datos de reserva inválidos");
            return;
        }
    });

const restaurant = new Restaurant("El Lojal Kolinar");

const customer1 = new Customer(1, "Shallan Davar", "shallan@gmail.com");
const reservation1 = new Reservation(1, customer1, "2024-12-31T20:00:00", 4);

if (Reservation.validateReservation(reservation1.date, reservation1.guests)) {
    restaurant.addReservation(reservation1);
    restaurant.render();
    /*ver porque no blanquea
    document.getElementById("customer-name").value = '';
    document.getElementById("customer-email").value = '';
    document.getElementById("reservation-date").value = '';
    document.getElementById("guests").value = '';*/

    
} else {
    alert("Datos de reserva inválidos");
}
