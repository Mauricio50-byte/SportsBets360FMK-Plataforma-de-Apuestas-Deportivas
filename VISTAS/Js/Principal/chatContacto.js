// JavaScript para la funcionalidad del chat en contacto.html
// SportsBets360FMk - Funcionalidad del chat en vivo

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const btnIniciarChat = document.getElementById('iniciar-chat');
    const ventanaChat = document.getElementById('ventana-chat');
    const btnCerrarChat = document.getElementById('cerrar-chat');
    const inputMensaje = document.getElementById('mensaje-usuario');
    const btnEnviarMensaje = document.getElementById('enviar-mensaje');
    const mensajesChat = document.getElementById('mensajes-chat');
    
    // Lista de posibles respuestas automáticas para simular una conversación
    const respuestasAutomaticas = [
        "Gracias por contactarnos. En breve un asesor se comunicará contigo.",
        "Entiendo tu consulta. ¿Podrías proporcionar más detalles para ayudarte mejor?",
        "Estamos verificando esa información. Te responderemos a la brevedad.",
        "Para ese tipo de consulta, te recomendamos contactar directamente con uno de nuestros asesores por WhatsApp.",
        "Gracias por tu interés en nuestros servicios. ¿Hay algo más en lo que podamos ayudarte?",
        "Tu solicitud está siendo procesada. Te contactaremos pronto.",
        "En SportsBets360FMk nos preocupamos por ofrecerte la mejor experiencia. Un asesor especializado te contactará para resolver todas tus dudas.",
        "Recuerda que nuestro horario de atención es de 7am a 7pm. ¿En qué momento te resulta más conveniente que te contactemos?",
        "¿Te gustaría recibir información sobre nuestras promociones y bonos especiales?",
        "Para brindarte un mejor servicio, ¿podrías indicarnos qué deportes te interesan más para apostar?"
    ];
    
    // Función para obtener una respuesta aleatoria
    function obtenerRespuestaAleatoria() {
        const indice = Math.floor(Math.random() * respuestasAutomaticas.length);
        return respuestasAutomaticas[indice];
    }
    
    // Abrir ventana de chat
    btnIniciarChat.addEventListener('click', function() {
        ventanaChat.classList.add('activo');
    });
    
    // Cerrar ventana de chat
    btnCerrarChat.addEventListener('click', function() {
        ventanaChat.classList.remove('activo');
    });
    
    // Función para enviar mensaje
    function enviarMensaje() {
        const mensaje = inputMensaje.value.trim();
        if (mensaje) {
            // Agregar mensaje del usuario
            const mensajeUsuario = document.createElement('div');
            mensajeUsuario.className = 'mensaje-usuario';
            mensajeUsuario.innerHTML = `<p>${mensaje}</p>`;
            mensajesChat.appendChild(mensajeUsuario);
            
            // Limpiar input
            inputMensaje.value = '';
            
            // Scroll al final del chat
            mensajesChat.scrollTop = mensajesChat.scrollHeight;
            
            // Simular tiempo de espera para la respuesta (entre 1 y 3 segundos)
            const tiempoEspera = Math.floor(Math.random() * 2000) + 1000;
            
            // Mostrar indicador de "escribiendo..."
            const escribiendo = document.createElement('div');
            escribiendo.className = 'mensaje-sistema escribiendo';
            escribiendo.innerHTML = '<p>Escribiendo...</p>';
            mensajesChat.appendChild(escribiendo);
            mensajesChat.scrollTop = mensajesChat.scrollHeight;
            
            // Después del tiempo de espera, mostrar respuesta
            setTimeout(function() {
                // Eliminar el indicador de "escribiendo..."
                mensajesChat.removeChild(escribiendo);
                
                // Agregar respuesta automática
                const mensajeRespuesta = document.createElement('div');
                mensajeRespuesta.className = 'mensaje-sistema';
                mensajeRespuesta.innerHTML = `<p>${obtenerRespuestaAleatoria()}</p>`;
                mensajesChat.appendChild(mensajeRespuesta);
                
                // Scroll al final del chat
                mensajesChat.scrollTop = mensajesChat.scrollHeight;
                
                // Si es el primer mensaje del usuario, ofrecer opciones después de 2 segundos
                if (document.querySelectorAll('.mensaje-usuario').length === 1) {
                    setTimeout(function() {
                        const mensajeOpciones = document.createElement('div');
                        mensajeOpciones.className = 'mensaje-sistema';
                        mensajeOpciones.innerHTML = `
                            <p>¿En qué podemos ayudarte hoy?</p>
                            <div class="opciones-chat">
                                <button class="opcion-chat">Información de apuestas</button>
                                <button class="opcion-chat">Problemas con mi cuenta</button>
                                <button class="opcion-chat">Métodos de pago</button>
                                <button class="opcion-chat">Hablar con un asesor</button>
                            </div>
                        `;
                        mensajesChat.appendChild(mensajeOpciones);
                        mensajesChat.scrollTop = mensajesChat.scrollHeight;
                        
                        // Añadir eventos a los botones de opciones
                        document.querySelectorAll('.opcion-chat').forEach(boton => {
                            boton.addEventListener('click', function() {
                                const opcionSeleccionada = this.textContent;
                                
                                // Simular selección de opción como mensaje del usuario
                                const mensajeOpcion = document.createElement('div');
                                mensajeOpcion.className = 'mensaje-usuario';
                                mensajeOpcion.innerHTML = `<p>${opcionSeleccionada}</p>`;
                                mensajesChat.appendChild(mensajeOpcion);
                                
                                // Respuesta específica según la opción
                                setTimeout(function() {
                                    const respuestaOpcion = document.createElement('div');
                                    respuestaOpcion.className = 'mensaje-sistema';
                                    
                                    let textoRespuesta = '';
                                    switch(opcionSeleccionada) {
                                        case 'Información de apuestas':
                                            textoRespuesta = 'En SportsBets360FMk ofrecemos múltiples opciones de apuestas deportivas. ¿Hay algún deporte específico que te interese?';
                                            break;
                                        case 'Problemas con mi cuenta':
                                            textoRespuesta = 'Lamentamos los inconvenientes. Para resolver problemas con tu cuenta, necesitaremos más detalles. ¿Podrías describirnos qué problema tienes?';
                                            break;
                                        case 'Métodos de pago':
                                            textoRespuesta = 'Contamos con diversos métodos de pago: tarjetas de crédito/débito, transferencias bancarias, billeteras electrónicas y más. ¿Qué método te gustaría utilizar?';
                                            break;
                                        case 'Hablar con un asesor':
                                            textoRespuesta = 'En breve un asesor se comunicará contigo. También puedes contactarnos directamente por WhatsApp o llamando a nuestros números telefónicos para una atención más rápida.';
                                            break;
                                        default:
                                            textoRespuesta = 'Gracias por tu consulta. ¿En qué más podemos ayudarte?';
                                    }
                                    
                                    respuestaOpcion.innerHTML = `<p>${textoRespuesta}</p>`;
                                    mensajesChat.appendChild(respuestaOpcion);
                                    mensajesChat.scrollTop = mensajesChat.scrollHeight;
                                }, 1000);
                            });
                        });
                    }, 2000);
                }
            }, tiempoEspera);
        }
    }
    
    // Evento click para enviar mensaje
    btnEnviarMensaje.addEventListener('click', enviarMensaje);
    
    // Evento Enter para enviar mensaje
    inputMensaje.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enviarMensaje();
        }
    });
    
    // Formulario de contacto
    const formContacto = document.getElementById('form-contacto');
    if (formContacto) {
        formContacto.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los valores del formulario
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const asunto = document.getElementById('asunto').value;
            
            // Aquí iría la lógica para enviar el formulario a un backend
            // Por ahora, solo mostramos un mensaje de confirmación
            alert(`¡Gracias ${nombre} por tu mensaje! Te contactaremos pronto en ${email} respecto a: "${asunto}".`);
            formContacto.reset();
        });
    }
    
    // Botón de WhatsApp flotante - funcionalidad adicional
    const btnWhatsApp = document.querySelector('.btn-whatsapp');
    if (btnWhatsApp) {
        btnWhatsApp.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        btnWhatsApp.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    }
});

// Añadir estilos CSS adicionales para las opciones de chat
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.innerHTML = `
        .opciones-chat {
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-top: 8px;
        }
        
        .opcion-chat {
            background-color: #eaeaea;
            border: none;
            border-radius: 15px;
            padding: 8px 12px;
            text-align: left;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .opcion-chat:hover {
            background-color: #d8d8d8;
        }
        
        .mensaje-sistema.escribiendo p {
            display: flex;
            align-items: center;
        }
        
        .mensaje-sistema.escribiendo p:after {
            content: '';
            width: 30px;
            height: 10px;
            margin-left: 5px;
            background-image: url('data:image/gif;base64,R0lGODlhHgAKAOZ/AAAAAFF/oWSLqW2TsHGXs3SZtnebunqguJmzx5q0yJu1yZ63zJ+3zaC4zqG5z6K5z6K60KO60aW80qa806e81Ki91am+1qi+1au/16vA16zC2a7D2q7E2q/G3LHH3LLI3rPJ37XM4LfO4bjP4rvS47vT5bzT5L3U5b7V5r/W5r/X58DX58HY6MLZ6MLa6cPb6sTb68Xc68bd7Mfe7Mjf7Mjg7cnf7crh7srh78ri78vj78zi787j8M7k8M/l8dDl8tDm8dHm8tLo89Pp9NPq9NTq9NXr9dbr9tfs9tjt9tnu99rv99vv99zw+N3w+N3x+d7x+d/y+eHy+eLz+uP0+uT0+uX1++b1++f2++j2++j3/On3/Or4/Ov4/Oz5/O/6/PD6/fH7/fL7/fP7/fT8/vX8/vb8/vb9/vf9/vj9/vn9/vn+//v+/vz+//z+/////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAeAAoAAAfzgH+CgxMVg4eCFjVlbH+BFiRjZDFnQxU4JRYvUmRoK1FkPhUwLhY5Vno3RlAgEhUrHRZOZGhjR0wNEBUKNBY0alVXQU4kGFZVZHp6LEIYbldzdnNlPUocZVdSJEtaDBpqIzlZTQsackQMQ184AgphEklmMF5QNwcGZQVsF09iRFBwS0KCD7IIQNhQggWLDDmAxnCxAUQKEBZULAAiCFEDPiMoVFAw6JAJCR8EGOBhgAkTDw0kQIBg5UAGAQYMMGBgx4KFCQQGsEAAgQHQPxMYJDDwdMECBRHylDnYYEGAAQgWFIiqlUxFBwoKRFWg4ClDnQmxciLDJnFWMFG5Zq2gyKtYRFuxBAEAOw==');
            background-repeat: no-repeat;
            background-position: center;
        }
    `;
    document.head.appendChild(style);
});