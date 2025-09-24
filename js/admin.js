// Sistema de administración
class AdminSystem {
    constructor() {
        this.refreshInterval = null;
    }

    // Inicializar panel de administración
    init() {
        if (!authSystem.isAdmin()) {
            console.warn('Acceso denegado: se requieren permisos de administrador');
            return;
        }

        this.loadAdminData();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    // Cargar datos administrativos
    loadAdminData() {
        this.updateStatistics();
        this.loadDetailedResults();
    }

    // Actualizar estadísticas
    updateStatistics() {
        const stats = getStatistics();
        
        // Actualizar tarjetas de estadísticas
        const totalVotesElement = document.getElementById('total-votes');
        const participationRateElement = document.getElementById('participation-rate');
        const activeElectionsElement = document.getElementById('active-elections');

        if (totalVotesElement) {
            this.animateCounter(totalVotesElement, stats.totalVotes);
        }

        if (participationRateElement) {
            participationRateElement.textContent = `${stats.participationRate}%`;
        }

        if (activeElectionsElement) {
            activeElectionsElement.textContent = stats.activeElections;
        }
    }

    // Animar contador numérico
    animateCounter(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const increment = Math.ceil((targetValue - currentValue) / 20);
        
        if (currentValue < targetValue) {
            element.textContent = currentValue + increment;
            setTimeout(() => this.animateCounter(element, targetValue), 50);
        } else {
            element.textContent = targetValue;
        }
    }

    // Cargar resultados detallados
    loadDetailedResults() {
        const container = document.getElementById('admin-results-container');
        if (!container) return;

        container.innerHTML = '';
        const results = getResults();

        // Crear tabla de resultados
        const table = this.createResultsTable(results);
        container.appendChild(table);

        // Crear gráficos de resultados
        const chartsContainer = this.createChartsContainer(results);
        container.appendChild(chartsContainer);
    }

    // Crear tabla de resultados
    createResultsTable(results) {
        const table = document.createElement('div');
        table.className = 'admin-results-table';

        let tableHTML = `
            <h4><i class="fas fa-table"></i> Resultados Detallados</h4>
            <div class="table-responsive">
                <table class="results-table">
                    <thead>
                        <tr>
                            <th>Elección</th>
                            <th>Candidato</th>
                            <th>Partido</th>
                            <th>Votos</th>
                            <th>Porcentaje</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        ELECTIONS_DATA.elections.forEach(election => {
            const electionResults = results.results[election.id];
            let totalVotesForElection = 0;

            // Calcular total de votos para esta elección
            for (let candidateId in electionResults) {
                totalVotesForElection += electionResults[candidateId];
            }

            election.candidates.forEach((candidate, index) => {
                const votes = electionResults[candidate.id] || 0;
                const percentage = totalVotesForElection > 0 ? 
                    ((votes / totalVotesForElection) * 100).toFixed(1) : '0.0';
                
                const isWinner = this.isWinner(candidate.id, electionResults);
                const rowClass = index === 0 ? 'first-in-group' : '';

                tableHTML += `
                    <tr class="${rowClass}">
                        <td class="election-cell">${index === 0 ? election.title : ''}</td>
                        <td class="candidate-cell">
                            <strong>${candidate.name}</strong>
                        </td>
                        <td class="party-cell">${candidate.party}</td>
                        <td class="votes-cell">
                            <span class="vote-count">${votes}</span>
                        </td>
                        <td class="percentage-cell">
                            <div class="percentage-bar">
                                <div class="percentage-fill" style="width: ${percentage}%"></div>
                                <span class="percentage-text">${percentage}%</span>
                            </div>
                        </td>
                        <td class="status-cell">
                            ${isWinner ? '<span class="winner-badge"><i class="fas fa-crown"></i> Ganador</span>' : ''}
                        </td>
                    </tr>
                `;
            });
        });

        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;

        table.innerHTML = tableHTML;
        return table;
    }

    // Verificar si un candidato es ganador
    isWinner(candidateId, electionResults) {
        let maxVotes = 0;
        let winnerId = null;

        for (let id in electionResults) {
            if (electionResults[id] > maxVotes) {
                maxVotes = electionResults[id];
                winnerId = parseInt(id);
            }
        }

        return winnerId === candidateId && maxVotes > 0;
    }

    // Crear contenedor de gráficos
    createChartsContainer(results) {
        const container = document.createElement('div');
        container.className = 'charts-container';

        container.innerHTML = `
            <h4><i class="fas fa-chart-pie"></i> Visualización de Resultados</h4>
            <div class="charts-grid">
                ${this.createElectionCharts(results)}
            </div>
            <div class="participation-chart">
                ${this.createParticipationChart()}
            </div>
        `;

        return container;
    }

    // Crear gráficos por elección
    createElectionCharts(results) {
        let chartsHTML = '';

        ELECTIONS_DATA.elections.forEach(election => {
            const electionResults = results.results[election.id];
            let totalVotes = 0;

            for (let candidateId in electionResults) {
                totalVotes += electionResults[candidateId];
            }

            chartsHTML += `
                <div class="election-chart">
                    <h5>${election.title}</h5>
                    <div class="chart-bars">
                        ${election.candidates.map(candidate => {
                            const votes = electionResults[candidate.id] || 0;
                            const percentage = totalVotes > 0 ? 
                                ((votes / totalVotes) * 100).toFixed(1) : 0;
                            
                            return `
                                <div class="chart-bar-item">
                                    <div class="bar-label">${candidate.name}</div>
                                    <div class="bar-container">
                                        <div class="bar-fill" style="width: ${percentage}%"></div>
                                        <span class="bar-value">${votes}</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        });

        return chartsHTML;
    }

    // Crear gráfico de participación
    createParticipationChart() {
        const stats = getStatistics();
        const participated = stats.votedStudents;
        const notParticipated = stats.totalStudents - stats.votedStudents;

        return `
            <h5>Participación General</h5>
            <div class="participation-stats">
                <div class="participation-bar">
                    <div class="participated" style="width: ${stats.participationRate}%">
                        <span>Participaron: ${participated} (${stats.participationRate}%)</span>
                    </div>
                    <div class="not-participated">
                        <span>No participaron: ${notParticipated}</span>
                    </div>
                </div>
                <div class="participation-details">
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span>Total estudiantes: ${stats.totalStudents}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-vote-yea"></i>
                        <span>Total votos: ${stats.totalVotes}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Configurar event listeners
    setupEventListeners() {
        // Botón ver resultados
        const viewResultsBtn = document.getElementById('view-results-admin');
        viewResultsBtn?.addEventListener('click', () => {
            this.showPublicResults();
        });

        // Botón exportar
        const exportBtn = document.getElementById('export-results');
        exportBtn?.addEventListener('click', () => {
            this.exportResults();
        });

        // Botón logout
        const logoutBtn = document.getElementById('admin-logout');
        logoutBtn?.addEventListener('click', () => {
            this.logout();
        });

        // Refrescar datos manualmente
        const refreshBtn = document.getElementById('refresh-data');
        refreshBtn?.addEventListener('click', () => {
            this.refreshData();
        });
    }

    // Mostrar resultados públicos
    showPublicResults() {
        showPage('results-page');
        votingSystem.loadResults();

        // Agregar botón para volver al panel admin
        const backBtn = document.getElementById('back-to-voting');
        if (backBtn) {
            backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Volver al Panel';
            backBtn.onclick = () => {
                showPage('admin-page');
                this.init();
            };
        }
    }

    // Exportar resultados
    exportResults() {
        try {
            const exportData = exportResults(); // Función desde data.js
            
            // Mostrar confirmación
            this.showExportConfirmation();
            
            console.log('Datos exportados:', exportData);
        } catch (error) {
            console.error('Error al exportar:', error);
            this.showError('Error al exportar los resultados');
        }
    }

    // Mostrar confirmación de exportación
    showExportConfirmation() {
        const confirmationDiv = document.createElement('div');
        confirmationDiv.className = 'alert alert-success export-confirmation';
        confirmationDiv.innerHTML = `
            <i class="fas fa-download"></i> 
            Resultados exportados exitosamente
        `;
        
        const adminSection = document.querySelector('.admin-section');
        adminSection.insertBefore(confirmationDiv, adminSection.firstChild);

        // Auto-remover después de 3 segundos
        setTimeout(() => {
            if (confirmationDiv.parentNode) {
                confirmationDiv.remove();
            }
        }, 3000);
    }

    // Refrescar datos
    refreshData() {
        const refreshBtn = document.getElementById('refresh-data');
        if (refreshBtn) {
            const originalText = refreshBtn.innerHTML;
            refreshBtn.innerHTML = '<div class="loading"></div> Actualizando...';
            refreshBtn.disabled = true;

            setTimeout(() => {
                this.loadAdminData();
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
            }, 1000);
        }
    }

    // Iniciar auto-refresh
    startAutoRefresh() {
        // Actualizar cada 30 segundos
        this.refreshInterval = setInterval(() => {
            this.updateStatistics();
        }, 30000);
    }

    // Detener auto-refresh
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Cerrar sesión de admin
    logout() {
        this.stopAutoRefresh();
        authSystem.logout();
        showPage('login-page');
    }

    // Mostrar error
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error admin-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        const adminSection = document.querySelector('.admin-section');
        adminSection.insertBefore(errorDiv, adminSection.firstChild);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Generar reporte detallado
    generateDetailedReport() {
        const results = getResults();
        const stats = getStatistics();
        const timestamp = new Date().toLocaleString('es-ES');

        let report = `REPORTE DE ELECCIONES ESTUDIANTILES\n`;
        report += `Generado: ${timestamp}\n`;
        report += `=====================================\n\n`;
        
        report += `ESTADÍSTICAS GENERALES:\n`;
        report += `- Total de estudiantes habilitados: ${stats.totalStudents}\n`;
        report += `- Total de votos emitidos: ${stats.totalVotes}\n`;
        report += `- Estudiantes que votaron: ${stats.votedStudents}\n`;
        report += `- Porcentaje de participación: ${stats.participationRate}%\n\n`;

        ELECTIONS_DATA.elections.forEach(election => {
            report += `${election.title.toUpperCase()}:\n`;
            report += `-${'='.repeat(election.title.length)}\n`;
            
            const electionResults = results.results[election.id];
            let totalVotesForElection = 0;

            for (let candidateId in electionResults) {
                totalVotesForElection += electionResults[candidateId];
            }

            election.candidates.forEach(candidate => {
                const votes = electionResults[candidate.id] || 0;
                const percentage = totalVotesForElection > 0 ? 
                    ((votes / totalVotesForElection) * 100).toFixed(1) : '0.0';
                
                report += `  ${candidate.name} (${candidate.party}): ${votes} votos (${percentage}%)\n`;
            });
            
            report += `  Total de votos en esta elección: ${totalVotesForElection}\n\n`;
        });

        return report;
    }
}

// Instancia global del sistema de administración
const adminSystem = new AdminSystem();