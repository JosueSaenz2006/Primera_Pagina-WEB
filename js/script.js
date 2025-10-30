// ===============================================
// script.js (versión en español)
// ===============================================
// FUNCIONALIDADES:
// - Copiar correo al portapapeles (con método moderno y de respaldo)
// - Validación del formulario de contacto (nombre + correo)
// - Mensajes de error visibles debajo de cada campo
// - Notificaciones tipo "toast" (mensajes flotantes temporales)
// - Detección de preferencia de movimiento reducido
// - Alternancia de modo oscuro / claro con guardado en localStorage
// ===============================================

(
  function()
  {
  'use strict';

  /* ===============================================
     FUNCIÓN: Crear y mostrar una notificación "toast"
     =============================================== */
  function crearAviso(mensaje, tiempo = 3000)
  {
    const aviso = document.createElement('div');
    aviso.className = 'toast';
    aviso.textContent = mensaje;
    document.body.appendChild(aviso);
    // Forzar animación
    void aviso.offsetWidth;
    aviso.classList.add('mostrar');
    // Ocultar el aviso luego de cierto tiempo
    setTimeout(()=>
    {
      aviso.classList.remove('mostrar');
      setTimeout(()=>aviso.remove(), 250);
    }, tiempo);
  }

  /* ===============================================
     FUNCIÓN: Copiar texto (método antiguo)
     =============================================== */
  function copiaAntigua(texto)
  {
    const areaTexto = document.createElement('textarea');
    areaTexto.value = texto;
    areaTexto.style.top = '0';
    areaTexto.style.left = '0';
    areaTexto.style.position = 'fixed';
    document.body.appendChild(areaTexto);
    areaTexto.focus();
    areaTexto.select();
    try
    {
      const exito = document.execCommand('copy');
      document.body.removeChild(areaTexto);
      return exito;
    }
    catch(err)
    {
      document.body.removeChild(areaTexto);
      return false;
    }
  }

  /* ===============================================
     FUNCIÓN: Copiar texto al portapapeles (moderna o de respaldo)
     =============================================== */
  function copiarAlPortapapeles(texto)
  {
    if(navigator.clipboard && navigator.clipboard.writeText)
    {
      return navigator.clipboard.writeText(texto)
        .then(()=>true)
        .catch(()=>copiaAntigua(texto));
    }
    return Promise.resolve(copiaAntigua(texto));
  }

  /* ===============================================
     FUNCIÓN: Configurar botón para copiar correo
     =============================================== */
  function configurarCopiaCorreo()
  {
    const boton = document.querySelector('.boton-copiar');
    if(!boton) return;

    const correo = boton.dataset.correo || document.querySelector('.texto-correo')?.textContent?.trim();

    boton.addEventListener('click', ()=>
    {
      if(!correo) return crearAviso('No hay correo disponible');
      copiarAlPortapapeles(correo).then(exito=>
      {
        if(exito) crearAviso('Correo copiado al portapapeles');
        else crearAviso('No se pudo copiar. Copia manualmente.');
      });
    });
  }

  /* ===============================================
     FUNCIÓN: Validar correo electrónico
     =============================================== */
  function validarCorreo(correo)
  {
    const expresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresion.test(String(correo).toLowerCase());
  }

  /* ===============================================
     FUNCIÓN: Configurar validación del formulario
     =============================================== */
  function configurarFormulario()
  {
    const formulario = document.querySelector('.formulario-contacto');
    if(!formulario) return;

    const campoNombre = formulario.querySelector('#nombre');
    const campoCorreo = formulario.querySelector('#correo');
    const errorNombre = formulario.querySelector('#error-nombre');
    const errorCorreo = formulario.querySelector('#error-correo');
    const botonEnviar = formulario.querySelector('#boton-enviar');

    function limpiarErrores()
    {
      [errorNombre, errorCorreo].forEach(e => { if(e) e.textContent = ''; });
      [campoNombre, campoCorreo].forEach(i => { if(i) i.classList.remove('entrada--error'); });
    }

    function mostrarError(campo, contenedor, mensaje)
    {
      if(contenedor) contenedor.textContent = mensaje;
      if(campo) campo.classList.add('entrada--error');
    }

    formulario.addEventListener('submit', function(evento)
    {
      evento.preventDefault();
      limpiarErrores();

      let valido = true;
      const nombre = campoNombre?.value?.trim() || '';
      const correo = campoCorreo?.value?.trim() || '';

      if(!nombre)
      {
        valido = false;
        mostrarError(campoNombre, errorNombre, 'El nombre es obligatorio');
      }

      if(!correo)
      {
        valido = false;
        mostrarError(campoCorreo, errorCorreo, 'El correo es obligatorio');
      } 

      else if(!validarCorreo(correo))
      {
        valido = false;
        mostrarError(campoCorreo, errorCorreo, 'Introduce un correo válido');
      }

      if(!valido) return;

      // Simulación del envío del formulario
      if(botonEnviar)
      {
        botonEnviar.disabled = true;
        const textoOriginal = botonEnviar.value;
        botonEnviar.value = 'Enviando...';
        setTimeout(()=>
        {
          botonEnviar.disabled = false;
          botonEnviar.value = textoOriginal;
          crearAviso('Formulario enviado (simulado)');
          formulario.reset();
        }, 1000);
      } 
      else 
      {
        crearAviso('Formulario válido (no se detectó botón)');
      }
    });

    // Validación en tiempo real (al salir de los campos)
    if(campoNombre)
    {
      campoNombre.addEventListener('blur', ()=>
      {
        if(campoNombre.value.trim() === '') mostrarError(campoNombre, errorNombre, 'El nombre es obligatorio');
        else errorNombre.textContent = '';
      });
    }

    if(campoCorreo){
      campoCorreo.addEventListener('blur', ()=>
      {
        const valor = campoCorreo.value.trim();
        if(valor === '') mostrarError(campoCorreo, errorCorreo, 'El correo es obligatorio');
        else if(!validarCorreo(valor)) mostrarError(campoCorreo, errorCorreo, 'Introduce un correo válido');
        else errorCorreo.textContent = '';
      });
    }
  }

  /* ===============================================
     FUNCIÓN: Aplicar modo de movimiento reducido
     =============================================== */
  function aplicarMovimientoReducido()
  {
    try
    {
      if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      {
        document.body.classList.add('movimiento-reducido');
      }
    }
    catch(e)
    { 
      /* ignorar errores */ 
    }
  }

  /* ===============================================
     FUNCIÓN: Cambiar tema (oscuro / claro)
     =============================================== */
  function establecerClaseTema(tema)
  {
    if(tema === 'oscuro') document.body.classList.add('oscuro');
    else document.body.classList.remove('oscuro');
  }

  function actualizarBotonTema(boton, tema)
  {
    if(!boton) return;
    const esOscuro = tema === 'oscuro';
    boton.setAttribute('aria-pressed', String(esOscuro));
    boton.textContent = esOscuro ? '☀️ Modo claro' : '🌙 Modo oscuro';
  }

  function configurarCambioTema()
  {
    const boton = document.getElementById('boton-tema');
    if(!boton) return;

    // Preferencia inicial: guardada > sistema > claro
    const guardado = localStorage.getItem('tema');
    let tema = guardado || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro');

    establecerClaseTema(tema);
    actualizarBotonTema(boton, tema);

    boton.addEventListener('click', ()=>
    {
      const nuevoTema = document.body.classList.contains('oscuro') ? 'claro' : 'oscuro';
      establecerClaseTema(nuevoTema);
      localStorage.setItem('tema', nuevoTema);
      actualizarBotonTema(boton, nuevoTema);
    });
  }

  /* ===============================================
     INICIO AUTOMÁTICO AL CARGAR LA PÁGINA
     =============================================== */
  document.addEventListener('DOMContentLoaded', function()
  {
    aplicarMovimientoReducido();
    configurarCopiaCorreo();
    configurarFormulario();
    configurarCambioTema();
  });

})();

/* ===============================================
   FUNCIÓN: Cambiar tema (oscuro / claro)
   =============================================== */
function establecerClaseTema(tema) {
  // Usamos la clase 'dark' porque el CSS la espera (body.dark { ... })
  if (tema === 'dark') document.body.classList.add('dark');
  else document.body.classList.remove('dark');
}

function actualizarBotonTema(boton, tema) {
  if (!boton) return;
  const esOscuro = (tema === 'dark');
  boton.setAttribute('aria-pressed', String(esOscuro));
  boton.textContent = esOscuro ? '☀️ Modo claro' : '🌙 Modo oscuro';
}

function configurarCambioTema() {
  const boton = document.getElementById('boton-tema');
  if (!boton) return;

  // Normalizamos: si guardaste 'tema' como 'oscuro' antes, lo mapeamos a 'dark'
  const guardadoRaw = localStorage.getItem('tema') || localStorage.getItem('theme');
  const guardado = (guardadoRaw === 'oscuro') ? 'dark' : (guardadoRaw === 'claro' ? 'light' : guardadoRaw);

  // Sistema: 'dark' o 'light'
  const sistema = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';

  let tema = guardado || sistema || 'light';

  establecerClaseTema(tema);
  actualizarBotonTema(boton, tema);

  boton.addEventListener('click', () => {
    const nuevoTema = document.body.classList.contains('dark') ? 'light' : 'dark';
    establecerClaseTema(nuevoTema);
    localStorage.setItem('tema', nuevoTema); // seguimos usando la clave 'tema'
    actualizarBotonTema(boton, nuevoTema);
  });
}

