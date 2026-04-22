let miToken = localStorage.getItem('token') || "";
const displayResultado = document.getElementById('resultado');

function obtenerCredenciales() {
    const userVal = document.getElementById('username').value.trim();
    const passVal = document.getElementById('password').value;

    if (!userVal || !passVal) {
        mostrarResultado("⚠️ Completa usuario y contraseña.", "#dc3545", "#f8d7da");
        return null;
    }

    return { userVal, passVal };
}

function mostrarResultado(mensaje, color = "#333", fondo = "#e9ecef") {
    displayResultado.innerText = mensaje;
    displayResultado.style.color = color;
    displayResultado.parentElement.style.backgroundColor = fondo;
}

// Función para Login
async function login() {
    const credenciales = obtenerCredenciales();
    if (!credenciales) return;

    const { userVal, passVal } = credenciales;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userVal, password: passVal })
        });
        
        const data = await res.json();
        
        if (data.token) {
            // 2. Guardar token para futuras peticiones (2FA y Datos Secretos)
            miToken = data.token;
            localStorage.setItem('token', data.token);
            mostrarResultado(" ¡Login exito Configure su 2FA para continuar.", "#28a745", "#d4edda");

            // 3. MOSTRAR LA SECCIÓN DE 2FA
            const section2FA = document.getElementById('section-2fa');
            if (section2FA) {
                section2FA.style.display = 'block';
            }

        } else {
            mostrarResultado(`❌ Error: ${data.error || 'Credenciales inválidas'}`, "#dc3545", "#f8d7da");
        }
    } catch (error) {
        mostrarResultado("⚠️ Error de conexión con el servidor.", "#dc3545", "#f8d7da");
    }
}

// Función para Registro
async function register() {
    const credenciales = obtenerCredenciales();
    if (!credenciales) return;

    const { userVal, passVal } = credenciales;

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userVal, password: passVal })
        });

        const data = await res.json();

        if (res.ok) {
            mostrarResultado("✅ Usuario registrado con éxito. Ahora puedes iniciar sesión.", "#28a745", "#d4edda");
        } else {
            mostrarResultado(`❌ Error: ${data.error || 'No se pudo registrar el usuario'}`, "#dc3545", "#f8d7da");
        }
    } catch (error) {
        mostrarResultado("⚠️ Error de conexión con el servidor.", "#dc3545", "#f8d7da");
    }
}

// Función para ver el secreto
async function verSecreto() {
    if (!miToken) {
        mostrarResultado("❌ Error: Primero debes iniciar sesión.", "#dc3545", "#f8d7da");
        return;
    }

    try {
        const res = await fetch('/api/admin-only', {
            headers: { 'Authorization': `Bearer ${miToken}` }
        });
        
        const data = await res.json();
        mostrarResultado(JSON.stringify(data, null, 2));
    } catch (error) {
        mostrarResultado("⚠️ Error al obtener datos.", "#dc3545", "#f8d7da");
    }
}

// Asignación de eventos a los botones
document.getElementById('btnLogin').addEventListener('click', login);
document.getElementById('btnRegister').addEventListener('click', register);
document.getElementById('btnSecret').addEventListener('click', verSecreto);
