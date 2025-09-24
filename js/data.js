// Datos simulados para el sistema de votaciones
const ELECTIONS_DATA = {
    elections: [
        {
            id: 1,
            title: "Presidente Estudiantil",
            description: "Elige al presidente del consejo estudiantil",
            icon: "fas fa-crown",
            candidates: [
                {
                    id: 101,
                    name: "María González",
                    description: "Estudiante de Ingeniería de Sistemas, 8vo semestre",
                    party: "Lista Azul - Progreso Estudiantil",
                    platform: "Mejora de infraestructura tecnológica y espacios de estudio"
                },
                {
                    id: 102,
                    name: "Carlos Rodríguez",
                    description: "Estudiante de Administración, 7mo semestre",
                    party: "Lista Verde - Futuro Sostenible",
                    platform: "Programas de sostenibilidad ambiental y bienestar estudiantil"
                },
                {
                    id: 103,
                    name: "Ana Martínez",
                    description: "Estudiante de Psicología, 6to semestre",
                    party: "Lista Roja - Unión Estudiantil",
                    platform: "Apoyo psicológico gratuito y actividades culturales"
                }
            ]
        },
        {
            id: 2,
            title: "Vicepresidente Académico",
            description: "Representante estudiantil para asuntos académicos",
            icon: "fas fa-graduation-cap",
            candidates: [
                {
                    id: 201,
                    name: "Luis Herrera",
                    description: "Estudiante de Derecho, 9no semestre",
                    party: "Lista Azul - Progreso Estudiantil",
                    platform: "Mejora en los procesos de evaluación y tutorías académicas"
                },
                {
                    id: 202,
                    name: "Sofia Vargas",
                    description: "Estudiante de Medicina, 5to semestre",
                    party: "Lista Verde - Futuro Sostenible",
                    platform: "Programas de intercambio y prácticas profesionales"
                }
            ]
        },
        {
            id: 3,
            title: "Representante de Bienestar",
            description: "Encargado del bienestar y actividades estudiantiles",
            icon: "fas fa-heart",
            candidates: [
                {
                    id: 301,
                    name: "Diego Morales",
                    description: "Estudiante de Educación Física, 4to semestre",
                    party: "Lista Roja - Unión Estudiantil",
                    platform: "Deportes, recreación y salud mental estudiantil"
                },
                {
                    id: 302,
                    name: "Valentina López",
                    description: "Estudiante de Trabajo Social, 6to semestre",
                    party: "Lista Verde - Futuro Sostenible",
                    platform: "Programas de apoyo social y becas estudiantiles"
                },
                {
                    id: 303,
                    name: "Alejandro Ruiz",
                    description: "Estudiante de Comunicación Social, 5to semestre",
                    party: "Lista Azul - Progreso Estudiantil",
                    platform: "Comunicación efectiva y eventos culturales"
                }
            ]
        }
    ]
};

// Datos de usuarios simulados
const USERS_DATA = {
    students: [
        {
            id: "20220001",
            name: "Juan Pérez",
            password: "123456",
            program: "Ingeniería de Sistemas",
            hasVoted: false
        },
        {
            id: "20220002",
            name: "Laura Sánchez",
            password: "123456",
            program: "Administración de Empresas",
            hasVoted: false
        },
        {
            id: "20220003",
            name: "Pedro Jiménez",
            password: "123456",
            program: "Medicina",
            hasVoted: true
        },
        {
            id: "20220004",
            name: "Carmen Duarte",
            password: "123456",
            program: "Psicología",
            hasVoted: false
        },
        {
            id: "20220005",
            name: "Miguel Torres",
            password: "123456",
            program: "Derecho",
            hasVoted: false
        }
    ],
    admins: [
        {
            id: "00000000",
            name: "Administrador Sistema",
            password: "admin123"
        }
    ]
};

// Resultados simulados (se actualizan dinámicamente)
let VOTING_RESULTS = {
    totalVotes: 0,
    totalStudents: USERS_DATA.students.length,
    results: {
        1: { // Presidente Estudiantil
            101: 0, // María González
            102: 0, // Carlos Rodríguez  
            103: 0  // Ana Martínez
        },
        2: { // Vicepresidente Académico
            201: 0, // Luis Herrera
            202: 0  // Sofia Vargas
        },
        3: { // Representante de Bienestar
            301: 0, // Diego Morales
            302: 0, // Valentina López
            303: 0  // Alejandro Ruiz
        }
    }
};

// Función para obtener datos de elección por ID
function getElectionById(electionId) {
    return ELECTIONS_DATA.elections.find(election => election.id === electionId);
}

// Función para obtener candidato por ID
function getCandidateById(candidateId) {
    for (let election of ELECTIONS_DATA.elections) {
        const candidate = election.candidates.find(c => c.id === candidateId);
        if (candidate) {
            return candidate;
        }
    }
    return null;
}

// Función para validar usuario estudiante
function validateStudent(studentId, password) {
    return USERS_DATA.students.find(
        student => student.id === studentId && student.password === password
    );
}

// Función para validar administrador
function validateAdmin(adminId, password) {
    return USERS_DATA.admins.find(
        admin => admin.id === adminId && admin.password === password
    );
}

// Función para marcar estudiante como votante
function markStudentAsVoted(studentId) {
    const student = USERS_DATA.students.find(s => s.id === studentId);
    if (student) {
        student.hasVoted = true;
        return true;
    }
    return false;
}

// Función para registrar votos
function registerVotes(votes) {
    // votes es un objeto con electionId: candidateId
    for (let electionId in votes) {
        const candidateId = votes[electionId];
        if (VOTING_RESULTS.results[electionId] && 
            VOTING_RESULTS.results[electionId].hasOwnProperty(candidateId)) {
            VOTING_RESULTS.results[electionId][candidateId]++;
        }
    }
    VOTING_RESULTS.totalVotes++;
}

// Función para obtener resultados
function getResults() {
    return VOTING_RESULTS;
}

// Función para calcular estadísticas
function getStatistics() {
    const votedStudents = USERS_DATA.students.filter(s => s.hasVoted).length;
    const participationRate = ((votedStudents / USERS_DATA.students.length) * 100).toFixed(1);
    
    return {
        totalVotes: VOTING_RESULTS.totalVotes,
        totalStudents: USERS_DATA.students.length,
        votedStudents: votedStudents,
        participationRate: participationRate,
        activeElections: ELECTIONS_DATA.elections.length
    };
}

// Función para obtener candidato ganador por elección
function getWinnerByElection(electionId) {
    const results = VOTING_RESULTS.results[electionId];
    if (!results) return null;
    
    let maxVotes = 0;
    let winnerId = null;
    
    for (let candidateId in results) {
        if (results[candidateId] > maxVotes) {
            maxVotes = results[candidateId];
            winnerId = parseInt(candidateId);
        }
    }
    
    return winnerId ? getCandidateById(winnerId) : null;
}

// Función para exportar resultados (simulada)
function exportResults() {
    const results = getResults();
    const statistics = getStatistics();
    
    const exportData = {
        timestamp: new Date().toISOString(),
        statistics: statistics,
        detailedResults: {}
    };
    
    // Procesar resultados detallados
    for (let election of ELECTIONS_DATA.elections) {
        exportData.detailedResults[election.title] = {};
        
        for (let candidate of election.candidates) {
            const votes = results.results[election.id][candidate.id] || 0;
            exportData.detailedResults[election.title][candidate.name] = {
                votes: votes,
                party: candidate.party,
                percentage: statistics.totalVotes > 0 ? 
                    ((votes / statistics.totalVotes) * 100).toFixed(1) : '0.0'
            };
        }
    }
    
    // Simular descarga
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `resultados_elecciones_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return exportData;
}

// Inicializar algunos votos de ejemplo
function initializeSampleVotes() {
    // Simular algunos votos ya registrados
    registerVotes({1: 101, 2: 201, 3: 302}); // Voto 1
    registerVotes({1: 102, 2: 202, 3: 301}); // Voto 2
    registerVotes({1: 101, 2: 201, 3: 303}); // Voto 3
    
    // Marcar algunos estudiantes como que ya votaron
    markStudentAsVoted("20220003");
}