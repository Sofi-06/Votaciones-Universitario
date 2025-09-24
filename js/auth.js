// Sistema de autenticación
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.userType = null; // 'student' or 'admin'
    }

    // Iniciar sesión como estudiante
    loginStudent(studentId, password) {
        const student = validateStudent(studentId, password);
        if (student) {
            this.currentUser = student;
            this.userType = 'student';
            this.saveSession();
            return {
                success: true,
                user: student,
                message: 'Inicio de sesión exitoso'
            };
        }
        return {
            success: false,
            message: 'Número de estudiante o contraseña incorrectos'
        };
    }

    // Iniciar sesión como administrador
    loginAdmin(adminId, password) {
        const admin = validateAdmin(adminId, password);
        if (admin) {
            this.currentUser = admin;
            this.userType = 'admin';
            this.saveSession();
            return {
                success: true,
                user: admin,
                message: 'Inicio de sesión administrativo exitoso'
            };
        }
        return {
            success: false,
            message: 'Credenciales de administrador incorrectas'
        };
    }

    // Cerrar sesión
    logout() {
        this.currentUser = null;
        this.userType = null;
        this.clearSession();
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Verificar si es estudiante
    isStudent() {
        return this.userType === 'student';
    }

    // Verificar si es administrador
    isAdmin() {
        return this.userType === 'admin';
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar si el estudiante ya votó
    hasVoted() {
        if (this.isStudent()) {
            return this.currentUser.hasVoted;
        }
        return false;
    }

    // Guardar sesión en localStorage
    saveSession() {
        const sessionData = {
            user: this.currentUser,
            userType: this.userType,
            timestamp: Date.now()
        };
        localStorage.setItem('votingSession', JSON.stringify(sessionData));
    }

    // Cargar sesión desde localStorage
    loadSession() {
        try {
            const sessionData = localStorage.getItem('votingSession');
            if (sessionData) {
                const parsed = JSON.parse(sessionData);
                
                // Verificar que la sesión no haya expirado (24 horas)
                const sessionAge = Date.now() - parsed.timestamp;
                const maxAge = 24 * 60 * 60 * 1000; // 24 horas en millisegundos
                
                if (sessionAge < maxAge) {
                    this.currentUser = parsed.user;
                    this.userType = parsed.userType;
                    return true;
                } else {
                    this.clearSession();
                }
            }
        } catch (error) {
            console.error('Error loading session:', error);
            this.clearSession();
        }
        return false;
    }

    // Limpiar sesión
    clearSession() {
        localStorage.removeItem('votingSession');
    }

    // Validar formato de número de estudiante
    validateStudentIdFormat(studentId) {
        // Permitir tanto estudiantes (8 dígitos) como admin (00000000)
        const regex = /^\d{8}$/;
        return regex.test(studentId);
    }

    // Validar fortaleza de contraseña (básico)
    validatePasswordStrength(password) {
        if (password.length < 6) {
            return {
                valid: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            };
        }
        return {
            valid: true,
            message: 'Contraseña válida'
        };
    }

    // Generar token de sesión (simulado)
    generateSessionToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}

// Instancia global del sistema de autenticación
const authSystem = new AuthSystem();

// Funciones de utilidad para manejo de formularios
function showLoginError(message) {
    // Remover errores anteriores
    const existingError = document.querySelector('.login-error');
    if (existingError) {
        existingError.remove();
    }

    // Crear y mostrar nuevo error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error login-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    
    const loginForm = document.getElementById('login-form');
    loginForm.insertBefore(errorDiv, loginForm.firstChild);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function showLoginSuccess(message) {
    // Remover mensajes anteriores
    const existingMessages = document.querySelectorAll('.login-error, .login-success');
    existingMessages.forEach(msg => msg.remove());

    // Crear y mostrar mensaje de éxito
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success login-success';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    const loginForm = document.getElementById('login-form');
    loginForm.insertBefore(successDiv, loginForm.firstChild);
}

// Validación en tiempo real del formulario
function setupFormValidation() {
    const studentIdInput = document.getElementById('student-id');
    const passwordInput = document.getElementById('password');

    // Validación del número de estudiante
    studentIdInput.addEventListener('input', function() {
        const value = this.value.trim();
        const submitButton = document.querySelector('#login-form button[type="submit"]');
        const isAdminMode = submitButton && submitButton.innerHTML.includes('Admin');
        
        // Solo aplicar validación numérica si NO es modo admin
        if (!isAdminMode) {
            // Remover caracteres no numéricos
            this.value = value.replace(/[^0-9]/g, '');
            
            // Limitar a 8 dígitos
            if (this.value.length > 8) {
                this.value = this.value.slice(0, 8);
            }

            // Validar formato visual para estudiantes
            if (value.length > 0 && !authSystem.validateStudentIdFormat(this.value)) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#e1e5e9';
            }
        } else {
            // En modo admin, permitir cualquier carácter
            this.style.borderColor = '#e1e5e9';
        }
    });

    // Validación de contraseña
    passwordInput.addEventListener('input', function() {
        const validation = authSystem.validatePasswordStrength(this.value);
        if (!validation.valid && this.value.length > 0) {
            this.style.borderColor = '#ffc107';
        } else {
            this.style.borderColor = '#e1e5e9';
        }
    });
}

// Función para mostrar estado de carga en botón
function setButtonLoading(button, loading = true) {
    if (loading) {
        button.disabled = true;
        const originalText = button.innerHTML;
        button.dataset.originalText = originalText;
        button.innerHTML = '<div class="loading"></div> Verificando...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}

// Función para manejar el cambio entre modo estudiante y administrador
function toggleLoginMode(isAdmin = false) {
    const studentIdInput = document.getElementById('student-id');
    const passwordInput = document.getElementById('password');
    const submitButton = document.querySelector('#login-form button[type="submit"]');
    const adminLink = document.getElementById('admin-link');

    if (isAdmin) {
        studentIdInput.placeholder = 'Usuario Administrador';
        studentIdInput.type = 'text';
        submitButton.innerHTML = '<i class="fas fa-user-shield"></i> Acceder como Admin';
        adminLink.textContent = 'Acceso estudiantil';
        adminLink.dataset.mode = 'student';
    } else {
        studentIdInput.placeholder = 'Número de Estudiante';
        studentIdInput.type = 'text';
        submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
        adminLink.textContent = 'Acceso administrativo';
        adminLink.dataset.mode = 'admin';
    }

    // Limpiar campos
    studentIdInput.value = '';
    passwordInput.value = '';
    
    // Resetear estilos
    studentIdInput.style.borderColor = '#e1e5e9';
    passwordInput.style.borderColor = '#e1e5e9';
    
    // Remover mensajes de error
    const existingMessages = document.querySelectorAll('.login-error, .login-success');
    existingMessages.forEach(msg => msg.remove());
}