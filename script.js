const criptoSelect = document.querySelector('#criptomonedas')
const monedaSelect = document.querySelector('#moneda')
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
  moneda: '',
  criptomoneda: '',
}

//Crear promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>{
  resolve(criptomonedas);
})


document.addEventListener('DOMContentLoaded', () =>{
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);

    criptoSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    fetch(url)
     .then(respuesta => respuesta.json())
     .then(resultado => obtenerCriptomonedas(resultado.Data))
     .then(criptomonedas => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas){
  criptomonedas.forEach(cripto => {
    const {FullName, Name } = cripto.CoinInfo;
    const option = document.createElement('option');
    option.value = Name;
    option.textContent = FullName;
    criptoSelect.appendChild(option);
  })
}

function submitFormulario(e){
  e.preventDefault();
  //validar
  const {moneda, criptomoneda} = objBusqueda;
  if(moneda === ''|| criptomoneda === ''){
      mostrarAlerta('Ambos campos son obligatorios');
      return;
  }
  consultarAPI();
}
function leerValor(e){
  objBusqueda[e.target.name] = e.target.value;
}

function mostrarAlerta(mensaje){
  const existeError = document.querySelector('.error');
  if(!existeError){
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');
  
    divMensaje.textContent = mensaje;  
    formulario.appendChild(divMensaje);
    setTimeout(()=>{
      divMensaje.remove();
    },2000)
  }
}

function consultarAPI(){
  const {moneda, criptomoneda} = objBusqueda;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
  mostrarSpinner();
  fetch(url)
    .then(respuesta => respuesta.json())
    .then(cotizacion => {
      mostrarHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    });
}

function mostrarHTML(cotizacion){

  limpiarHTML();

  const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
  
  const precio = document.createElement('h2');
  precio.classList.add('precio');
  precio.innerHTML = `El valor actual es de ${PRICE}`
  resultado.appendChild(precio);

  const precioAlto = document.createElement('h3');
  precioAlto.innerHTML = `El precio más alto del día es: ${HIGHDAY}`;
  resultado.appendChild(precioAlto);
  
  const precioBajo = document.createElement('h3');
  precioAlto.innerHTML = `El precio más bajo del día es: ${LOWDAY}`;
  resultado.appendChild(precioBajo);

  const cambio = document.createElement('h3');
  cambio.innerHTML = `El cambio en las últimas 24 hrs es de: ${CHANGEPCT24HOUR}%`;
  resultado.appendChild(cambio);

  const actualizacion = document.createElement('h3');
  actualizacion.innerHTML = `La última actualización fue: ${LASTUPDATE}`;
  resultado.appendChild(actualizacion);
}

function limpiarHTML(){
  while(resultado.firstChild){
    resultado.removeChild(resultado.firstChild);
  }
}
function mostrarSpinner(){
  limpiarHTML();
  const spinner = document.createElement('div');
  spinner.classList.add('sk-folding-cube');
  spinner.innerHTML = `
    <div class="sk-cube1 sk-cube"></div>
    <div class="sk-cube2 sk-cube"></div>
    <div class="sk-cube4 sk-cube"></div>
    <div class="sk-cube3 sk-cube"></div>
  `
  resultado.appendChild(spinner);
}