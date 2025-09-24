// Archivo principal de JavaScript - Controla la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar datos de ejemplo
    initializeSampleVotes();
    
    // Cargar sesión existente si existe
    if (authSystem.loadSession()) {
        if (authSystem.isStudent()) {
            initializeStudentView();
        } else if (authSystem.isAdmin()) {
            initializeAdminView();
        }
    } else {
        showPage('login-page');
    }

    // Configurar event listeners
    setupGlobalEventListeners();
    
    // Configurar validación de formulario
    setupFormValidation();
});

// Función para mostrar páginas
function showPage(pageId) {
    // Ocultar todas las páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Mostrar página seleccionada
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Actualizar URL sin recargar página
    history.pushState({ page: pageId }, '', `#${pageId}`);
}

// Configurar event listeners globales
function setupGlobalEventListeners() {
    // Formulario de login
    const loginForm = document.getElementById('login-form');
    loginForm?.addEventListener('submit', handleLogin);

    // Enlaces y botones de navegación
    const adminLink = document.getElementById('admin-link');
    adminLink?.addEventListener('click', handleAdminLinkClick);

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn?.addEventListener('click', handleLogout);

    const backToVotingBtn = document.getElementById('back-to-voting');
    backToVotingBtn?.addEventListener('click', handleBackToVoting);

    // Manejar navegación del navegador
    window.addEventListener('popstate', handlePopState);

    // Prevenir envío accidental del formulario
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
            const form = e.target.closest('form');
            if (form) {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        }
    });
}

// Manejar login
async function handleLogin(e) {
    e.preventDefault();
    
    const studentIdInput = document.getElementById('student-id');
    const passwordInput = document.getElementById('password');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    const studentId = studentIdInput.value.trim();
    const password = passwordInput.value;

    // Validación básica
    if (!studentId || !password) {
        showLoginError('Por favor, completa todos los campos');
        return;
    }

    // Mostrar estado de carga
    setButtonLoading(submitButton, true);

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        let authResult;
        
        // Determinar si es modo admin o estudiante
        const isAdminMode = submitButton.innerHTML.includes('Admin');
        
        // Intentar primero como admin si es 00000000 o modo admin
        if (studentId === "00000000" || isAdminMode) {
            authResult = authSystem.loginAdmin(studentId, password);
            // Si falla como admin, intentar como estudiante
            if (!authResult.success && studentId !== "00000000") {
                authResult = authSystem.loginStudent(studentId, password);
            }
        } else {
            // Intentar como estudiante primero
            authResult = authSystem.loginStudent(studentId, password);
            // Si falla como estudiante, intentar como admin
            if (!authResult.success) {
                authResult = authSystem.loginAdmin(studentId, password);
            }
        }

        if (authResult.success) {
            showLoginSuccess(authResult.message);
            
            // Limpiar formulario
            studentIdInput.value = '';
            passwordInput.value = '';
            
            // Redirigir según tipo de usuario
            setTimeout(() => {
                if (authSystem.isStudent()) {
                    initializeStudentView();
                } else if (authSystem.isAdmin()) {
                    initializeAdminView();
                }
            }, 1000);
            
        } else {
            showLoginError(authResult.message);
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showLoginError(error.message || 'Error al iniciar sesión');
    } finally {
        setButtonLoading(submitButton, false);
    }
}

// Manejar clic en enlace de administrador
function handleAdminLinkClick(e) {
    e.preventDefault();
    const currentMode = e.target.dataset.mode || 'admin';
    toggleLoginMode(currentMode === 'admin');
    e.target.dataset.mode = currentMode === 'admin' ? 'student' : 'admin';
}

// Manejar logout
function handleLogout() {
    // Mostrar confirmación
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        authSystem.logout();
        showPage('login-page');
        
        // Limpiar formulario de login
        document.getElementById('student-id').value = '';
        document.getElementById('password').value = '';
        
        // Resetear modo de login
        toggleLoginMode(false);
    }
}

// Manejar volver a votación
function handleBackToVoting() {
    if (authSystem.isStudent()) {
        showPage('voting-page');
    } else if (authSystem.isAdmin()) {
        showPage('admin-page');
    } else {
        showPage('login-page');
    }
}

// Manejar navegación del navegador
function handlePopState(e) {
    if (e.state && e.state.page) {
        showPage(e.state.page);
    }
}

// Inicializar vista de estudiante
function initializeStudentView() {
    showPage('voting-page');
    
    // Actualizar información del usuario
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        const user = authSystem.getCurrentUser();
        userNameElement.textContent = `${user.name} (${user.program})`;
    }

    // Verificar estado de votación
    if (votingSystem.checkVotingStatus()) {
        // Inicializar sistema de votación si aún no ha votado
        votingSystem.init();
    }
}

// Inicializar vista de administrador
function initializeAdminView() {
    showPage('admin-page');
    adminSystem.init();
}

// Función de utilidad para manejo de errores globales
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
    
    // Mostrar mensaje de error al usuario en casos críticos
    if (e.error.name === 'TypeError' || e.error.name === 'ReferenceError') {
        showGlobalError('Ha ocurrido un error inesperado. Por favor, recarga la página.');
    }
});

// Mostrar error global
function showGlobalError(message) {
    const existingError = document.querySelector('.global-error');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error global-error';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translateX(-50%)';
    errorDiv.style.zIndex = '9999';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i> 
        ${message}
        <button onclick="this.parentElement.remove()" style="margin-left: 10px; background: none; border: none; color: inherit; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(errorDiv);

    // Auto-remover después de 8 segundos
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 8000);
}

// Función para debug (solo en desarrollo)
function enableDebugMode() {
    window.votingDebug = {
        authSystem,
        votingSystem,
        adminSystem,
        data: {
            elections: ELECTIONS_DATA,
            users: USERS_DATA,
            results: VOTING_RESULTS
        },
        utils: {
            showPage,
            getStatistics,
            exportResults
        }
    };
    
    console.log('Debug mode enabled. Access via window.votingDebug');
}

// Funciones de utilidad adicionales
function formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Funciones de accesibilidad
function setupAccessibility() {
    // Navegación por teclado
    document.addEventListener('keydown', function(e) {
        // ESC para cerrar modales
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }

        // Tab navigation improvements
        if (e.key === 'Tab') {
            const focusableElements = document.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const focusedIndex = Array.from(focusableElements).indexOf(document.activeElement);
            
            if (e.shiftKey) {
                // Shift + Tab (backward)
                if (focusedIndex <= 0) {
                    e.preventDefault();
                    focusableElements[focusableElements.length - 1].focus();
                }
            } else {
                // Tab (forward)
                if (focusedIndex >= focusableElements.length - 1) {
                    e.preventDefault();
                    focusableElements[0].focus();
                }
            }
        }
    });

    // Anunciar cambios de página a screen readers
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const element = mutation.target;
                if (element.classList.contains('page') && element.classList.contains('active')) {
                    const pageTitle = element.querySelector('h1, h2')?.textContent || 'Página cargada';
                    // Anunciar a screen readers
                    const announcement = document.createElement('div');
                    announcement.setAttribute('aria-live', 'polite');
                    announcement.setAttribute('aria-atomic', 'true');
                    announcement.style.position = 'absolute';
                    announcement.style.left = '-10000px';
                    announcement.textContent = `Navegando a: ${pageTitle}`;
                    document.body.appendChild(announcement);
                    
                    setTimeout(() => {
                        document.body.removeChild(announcement);
                    }, 1000);
                }
            }
        });
    });

    // Observar cambios en las páginas
    document.querySelectorAll('.page').forEach(page => {
        observer.observe(page, { attributes: true });
    });
}

// Inicializar accesibilidad cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupAccessibility);

// Habilitar debug en desarrollo
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    enableDebugMode();
}