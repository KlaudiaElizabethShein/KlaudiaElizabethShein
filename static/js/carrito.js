/*------------------------------------------- Datos del Carrito -----------------------------------------*/
let tabla_carrito = document.querySelector("#cuerpo-tabla-carrito");
let btn_carrito = document.querySelector("#boton-add-carrito");
let btn_producto = document.querySelector("#btn-nuevo-producto")
let input_nombre_producto = document.getElementById("input_nombre_producto");
let input_precio = document.getElementById("input_precio");
let input_URL = document.getElementById("input_URL");
let input_cantidad = document.getElementById("input_cantidad");
let text_area = document.querySelector("#text-area-descripcion");
let lista_producto = [];

btn_producto.addEventListener("click", () => {
  // Limpiar los campos de los inputs
  input_nombre_producto.value = "";
  input_precio.value = "";
  input_URL.value = "";
  input_cantidad.value = "";
  text_area.value = "";
})

function actualizarTabla() {
  tabla_carrito.innerHTML = '';

  if (lista_producto.length === 0) {
    // Si no hay datos, muestra el mensaje de "No hay datos..."
    const noDataRow = document.createElement('tr');
    noDataRow.id = 'no-data-row-carrito';
    noDataRow.innerHTML = '<td colspan="7" class="text-center">No hay datos para mostrar.</td>';
    tabla_carrito.appendChild(noDataRow);
  } else {
    lista_producto.forEach((producto, index) => {
      const numeroSerie = index + 1;
      const fila_tabla_carrito = document.createElement('tr');
      fila_tabla_carrito.innerHTML = `
    <td>${numeroSerie}</td>
    <td>${producto.nombre}</td>
    <td>$ ${producto.precio.toFixed(2)}</td>
    <td>${producto.Cantidad}</td>
    <td><button class="editar btn btn-success" data-index="${index}"><i class="fas fa-pencil-alt"></i></button></td>
    <td><button class="borrar btn btn-danger" data-index="${index}"><i class="fas fa-trash-alt"></i></button></td>
  `;
      tabla_carrito.appendChild(fila_tabla_carrito);
    });
  }
  // Agrega eventos a los botones de editar
  const botonesEditar = document.querySelectorAll('.editar');
  botonesEditar.forEach(boton => {
    boton.addEventListener('click', () => {
      const index = parseInt(boton.dataset.index);
      const producto = lista_producto[index];

      // Prepara el modal para editar
      const inputNombre = document.getElementById('input_nombre_producto');
      const inputPrecio = document.getElementById('input_precio');
      const inputURL = document.getElementById('input_URL');
      const inputCantidad = document.getElementById('input_cantidad');
      // ... (Agregar otros campos del modal si es necesario)

      inputNombre.value = producto.nombre;
      inputPrecio.value = producto.precio;
      inputURL.value = producto.URL;
      inputCantidad.value = producto.Cantidad;
      // ... (Asignar valores a otros campos del modal)

      // Cambia el texto del botón "Añadir al Carrito" a "Guardar Cambios"
      const btnAddCarrito = document.getElementById('boton-add-carrito');
      btnAddCarrito.textContent = 'Guardar Cambios';

      // Agrega un atributo al botón para indicar que se trata de una edición
      btnAddCarrito.dataset.index = index;

      // Abre el modal
      const modalCarrito = document.getElementById('modal-carrito');
      const modal = bootstrap.Modal.getInstance(modalCarrito);
      modal.show();
    });
  });

  // Agregar evento click a botones de borrar
  const botonesBorrar = document.querySelectorAll('.borrar');
  botonesBorrar.forEach(boton => {
    boton.addEventListener('click', () => {
      const index = parseInt(boton.dataset.index);
      lista_producto.splice(index, 1);
      actualizarTabla();
    });
  });
}

btn_carrito.addEventListener("click", () => {
  const nombre = input_nombre_producto.value.trim();
  const precio = input_precio.value.trim().replace(/,/g, '.');
  const URL = input_URL.value.trim();
  const Cantidad = input_cantidad.value.trim();
  const descripcion = text_area.value.trim();

  // Validaciones
  if (nombre === "" || precio === "" || URL === "" || Cantidad === "" || descripcion === "") {
    alert("Por favor, complete todos los campos.");
    return;
  }

  // Convertir precio a número
  const precioNumero = parseFloat(precio);

  // Validar precio
  if (isNaN(precioNumero) || precioNumero <= 0) {
    alert("Por favor, ingrese un precio válido.");
    return;
  }

  // Validar cantidad
  const cantidadNumero = parseInt(Cantidad);
  if (isNaN(cantidadNumero) || cantidadNumero <= 0) {
    alert("Por favor, ingrese una cantidad válida.");
    return;
  }
  // Validar url
  if (!URL.startsWith("http://") && !URL.startsWith("https://")) {
    alert("Por favor, ingrese una URL válida que comience con 'http://' o 'https://'.");
    return;
  }


  // Verifica si se está editando un producto o se está agregando uno nuevo
  if (btn_carrito.dataset.index !== undefined) {
    // Editar producto existente
    const index = parseInt(btn_carrito.dataset.index);
    lista_producto[index] = {
      nombre: nombre,
      precio: precioNumero,
      URL: URL,
      Cantidad: cantidadNumero,
      descripcion: descripcion
    };

    // Restablece el texto del botón
    btn_carrito.textContent = 'Añadir al Carrito';
    delete btn_carrito.dataset.index;

  } else {
    // Agregar nuevo producto
    const nuevoProducto = {
      nombre: nombre,
      precio: precioNumero,
      URL: URL,
      Cantidad: cantidadNumero,
      descripcion: descripcion
    };
    lista_producto.push(nuevoProducto);
  }

  const exampleModal = document.getElementById('modal-carrito');
  const modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();

  actualizarTabla();
});

/*------------------------------------------- Datos de la Persona y enviar pedido-----------------------------------------*/
let inputNombre = document.getElementById('input_nombre_persona');
let inputTelefono = document.getElementById('input_telefono');
let inputDomicilio = document.getElementById('input_domicilio');
let domicilioSi = document.getElementById('domicilioSi');
let domicilioNo = document.getElementById('domicilioNo');
let areaDomicilio = document.getElementById('areaDomicilio');
let btn_enviar_pedido_modal = document.getElementById("boton-add-pedido");
let btn_enviar_pedido = document.getElementById("enviar-pedido");
let lista_persona = [];
const modal = new bootstrap.Modal(document.getElementById('modal-confirmar-pedido'));

domicilioSi.addEventListener('change', () => {
  areaDomicilio.style.display = 'block';
});

domicilioNo.addEventListener('change', () => {
  areaDomicilio.style.display = 'none';
});

btn_enviar_pedido.addEventListener("click", () => {
  if (lista_producto.length === 0) {
    alert("Debe añadir al menos un producto.");
    return;
  }

  let total = 0;

  // Generar el contenido de la tabla con los datos del pedido
  lista_producto.forEach((producto) => {
    total += parseFloat(producto.precio) * parseInt(producto.Cantidad);
  });

  let totalUSD = total.toFixed(2);
  let totalMLC = (total * 1.35).toFixed(2);
  let totalCUPEfectivo = (total * 350).toFixed(2);
  let totalCUPTransferencia = (total * 350 * 1.05).toFixed(2);

  // Llenar el modal con la tabla de resumen del pedido
  let modalBody = document.querySelector('#modal-confirmar-pedido .modal-body');
  modalBody.innerHTML = `
    <h5 class="mb-3">Importe (inicial/no incluye costos de paquetería ni comisión):</h5>
    <ul class="list-group">
      <li class="list-group-item">USD: $ ${totalUSD}</li>
      <li class="list-group-item">MLC: $ ${totalMLC}</li>
      <li class="list-group-item">CUP (efectivo): $ ${totalCUPEfectivo}</li>
      <li class="list-group-item">CUP (transferencia): $ ${totalCUPTransferencia}</li>
    </ul>`;

  // Mostrar el modal
  modal.show();
});

const sendMesage = (message) => {
  var requestOptions = {
    method: 'GET',
  }
  fetch(
    `https://api.callmebot.com/text.php?user=@Murmaider_Kitsune&text=${message}`,
    requestOptions
  )
    .then(response => response.text())
    .then(result => {
      console.log(result)
    })
    .catch(error => console.log(error));

    /** Se Realiza lo mismo una Segunda Vez para la otra persona que reciba el mensaje*/
    var requestOptions = {
      method: 'GET',
    }
    fetch(
      `https://api.callmebot.com/text.php?user=@dejenme_dormir&text=${message}`,
      requestOptions
    )
      .then(response => response.text())
      .then(result => {
        console.log(result)
      })
      .catch(error => console.log(error));
}

//const userName = "@Murmaider_Kitsune"
var text = ""

btn_enviar_pedido_modal.addEventListener("click", () => {
  const nombre_persona = inputNombre.value.trim();
  const telefono = inputTelefono.value.trim();
  const domicilio = inputDomicilio.value.trim();

  // Validaciones
  if (nombre_persona === '') {
    alert("Por favor, Introduzca su Nombre.");
    return;
  } else if (telefono === '') {
    alert("Por favor, Introduzca su número de teléfono.");
    return;
  } else if (telefono.length !== 8) {
    alert("El número de teléfono debe tener 8 dígitos.");
    return;
  } else if (isNaN(telefono)) {
    alert("El número de teléfono no puede contener letras.");
    return;
  } else if (areaDomicilio.style.display === 'block' && inputDomicilio.value === "") {
    alert("Debe introducir un lugar para el domicilio.");
    return;
  }

  const datosPersona = {
    nombre: nombre_persona,
    telefono: telefono,
    domicilio: domicilio
  };
  lista_persona.push(datosPersona);

  const modalPersona = document.getElementById('modal-persona');
  const modal = bootstrap.Modal.getInstance(modalPersona);
  modal.hide();
  let contador = 1

  message = `
🛒 *_Comprobante de compra_* 🧾

👤 *Cliente:* 
`
  message += `
	- Nombre: ${lista_persona[0].nombre}
	- Nro: ${lista_persona[0].telefono}
	`

  message += lista_persona[0].domicilio ? `- Domicilio: ${lista_persona[0].domicilio}` : ``;

  message += `
🏪 *Tienda:* - 
`
  const time = Date.now()
  const hoy = new Date(time).toLocaleDateString()
  message += `
🗓 *Fecha:* ${hoy} 

🛒 *Artículos en el carrito:*
`
  let total = 0
  lista_producto.forEach(e => {
    total += parseFloat(e.precio) * parseInt(e.Cantidad)
    message += `
${contador} - ${e.nombre}: 
- Precio: $ ${e.precio}
- Cantidad: ${e.Cantidad}
- URL: ${e.URL.replace(/#/g, "%23").replace(/&/g, "%26")}
- Descripcion: ${e.descripcion}
--------------------------------------------`
    contador++
  })

  let totalUSD = total.toFixed(2);
  let totalMLC = (total * 1.35).toFixed(2);
  let totalCUPEfectivo = (total * 350).toFixed(2);
  let totalCUPTransferencia = (total * 350 * 1.05).toFixed(2);

  message += `
🧾 *Importe _(inicial/no incluye costos de paquetería ni comisión)_* 📥
USD: $ ${totalUSD}
MLC (1.35): $ ${totalMLC}
CUP (efectivo/350): $ ${totalCUPEfectivo}
CUP (transferencia/1.05):$ ${totalCUPTransferencia}

📝 El segundo pago se realiza al llegar la compra, que sería el coste de paquetería (peso en libra x 9 USD) y comisión (1 USD por artículo) 

Muchas Gracias por comprar con nosotros 🤍
_Klaudia Elízabeth Shein_ 🛍️
`

  message = encodeURI(message)
  sendMesage(message)
  alert("Tu pedido está en camino. Revisaremos tus datos y un administrador se pondrá en contacto contigo para coordinar el pago. ¡Gracias por tu compra!");
  lista_persona = [];
  lista_producto = [];
  actualizarTabla();
});


