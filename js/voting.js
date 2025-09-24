// Sistema de votación
class VotingSystem {
    constructor() {
        this.selectedVotes = {}; // electionId: candidateId
        this.isSubmitting = false;
    }

    // Inicializar el sistema de votación
    init() {
        this.loadElections();
        this.setupEventListeners();
    }

    // Cargar y mostrar las elecciones
    loadElections() {
        const container = document.getElementById('elections-container');
        if (!container) return;

        container.innerHTML = '';

        ELECTIONS_DATA.elections.forEach((election, index) => {
            const electionCard = this.createElectionCard(election);
            container.appendChild(electionCard);
            
            // Animación escalonada
            setTimeout(() => {
                electionCard.style.opacity = '1';
                electionCard.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Crear tarjeta de elección
    createElectionCard(election) {
        const card = document.createElement('div');
        card.className = 'election-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.3s ease';

        card.innerHTML = `
            <h3>
                <i class="${election.icon}"></i>
                ${election.title}
            </h3>
            <p>${election.description}</p>
            <div class="candidates-grid" data-election-id="${election.id}">
                ${election.candidates.map(candidate => 
                    this.createCandidateCard(candidate, election.id)
                ).join('')}
            </div>
        `;

        return card;
    }

    // Crear tarjeta de candidato
    createCandidateCard(candidate, electionId) {
        return `
            <div class="candidate-card" 
                 data-candidate-id="${candidate.id}" 
                 data-election-id="${electionId}">
                <i class="fas fa-check-circle check-icon"></i>
                <h4>${candidate.name}</h4>
                <p>${candidate.description}</p>
                <div class="party">${candidate.party}</div>
                <div class="platform">${candidate.platform}</div>
            </div>
        `;
    }

    // Configurar event listeners
    setupEventListeners() {
        // Event delegation para candidatos
        document.addEventListener('click', (e) => {
            if (e.target.closest('.candidate-card')) {
                this.handleCandidateSelection(e.target.closest('.candidate-card'));
            }
        });

        // Botón de envío de votos
        const submitButton = document.getElementById('submit-votes');
        if (submitButton) {
            submitButton.addEventListener('click', () => this.submitVotes());
        }

        // Modal de confirmación
        this.setupConfirmationModal();
    }

    // Manejar selección de candidato
    handleCandidateSelection(candidateCard) {
        const candidateId = parseInt(candidateCard.dataset.candidateId);
        const electionId = parseInt(candidateCard.dataset.electionId);

        // Deseleccionar otros candidatos de la misma elección
        const electionContainer = candidateCard.closest('[data-election-id]');
        const otherCandidates = electionContainer.querySelectorAll('.candidate-card');
        
        otherCandidates.forEach(card => {
            card.classList.remove('selected');
        });

        // Seleccionar candidato actual
        candidateCard.classList.add('selected');
        this.selectedVotes[electionId] = candidateId;

        // Actualizar botón de envío
        this.updateSubmitButton();

        // Efecto visual
        this.showSelectionFeedback(candidateCard);
    }

    // Mostrar feedback visual de selección
    showSelectionFeedback(candidateCard) {
        // Efecto de pulso
        candidateCard.style.transform = 'scale(1.05)';
        setTimeout(() => {
            candidateCard.style.transform = 'scale(1)';
        }, 150);

        // Sonido de confirmación (opcional)
        // this.playSelectionSound();
    }

    // Actualizar estado del botón de envío
    updateSubmitButton() {
        const submitButton = document.getElementById('submit-votes');
        if (!submitButton) return;

        const selectedCount = Object.keys(this.selectedVotes).length;
        const totalElections = ELECTIONS_DATA.elections.length;

        if (selectedCount > 0) {
            submitButton.disabled = false;
            submitButton.innerHTML = `
                <i class="fas fa-check-circle"></i>
                Confirmar Votos (${selectedCount}/${totalElections})
            `;
        } else {
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <i class="fas fa-check-circle"></i>
                Selecciona al menos un candidato
            `;
        }
    }

    // Configurar modal de confirmación
    setupConfirmationModal() {
        const modal = document.getElementById('confirmation-modal');
        const confirmButton = document.getElementById('confirm-submit');
        const cancelButton = document.getElementById('cancel-submit');

        if (confirmButton) {
            confirmButton.addEventListener('click', () => {
                this.confirmSubmission();
                modal.classList.remove('active');
            });
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // Cerrar modal al hacer clic fuera
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Enviar votos (mostrar confirmación)
    submitVotes() {
        if (this.isSubmitting) return;
        
        const selectedCount = Object.keys(this.selectedVotes).length;
        if (selectedCount === 0) {
            this.showError('Por favor, selecciona al menos un candidato antes de continuar.');
            return;
        }

        // Mostrar modal de confirmación
        const modal = document.getElementById('confirmation-modal');
        modal.classList.add('active');

        // Actualizar contenido del modal con selecciones
        this.updateConfirmationModal();
    }

    // Actualizar contenido del modal de confirmación
    updateConfirmationModal() {
        const modal = document.getElementById('confirmation-modal');
        const modalContent = modal.querySelector('.modal-content');
        
        let summaryHTML = '<h3>Confirmar Votación</h3><div class="vote-summary">';
        
        for (let electionId in this.selectedVotes) {
            const election = getElectionById(parseInt(electionId));
            const candidate = getCandidateById(this.selectedVotes[electionId]);
            
            if (election && candidate) {
                summaryHTML += `
                    <div class="vote-item">
                        <strong>${election.title}:</strong> ${candidate.name}
                    </div>
                `;
            }
        }
        
        summaryHTML += '</div><p>¿Estás seguro de que deseas enviar estos votos? Esta acción no se puede deshacer.</p>';
        
        modalContent.innerHTML = summaryHTML + `
            <div class="modal-actions">
                <button id="confirm-submit" class="btn btn-success">Sí, Confirmar</button>
                <button id="cancel-submit" class="btn btn-secondary">Cancelar</button>
            </div>
        `;

        // Re-configurar event listeners
        this.setupConfirmationModal();
    }

    // Confirmar y procesar envío
    async confirmSubmission() {
        if (this.isSubmitting) return;
        
        this.isSubmitting = true;
        const submitButton = document.getElementById('submit-votes');
        
        try {
            // Mostrar estado de carga
            setButtonLoading(submitButton, true);
            
            // Simular procesamiento
            await this.processVotes();
            
            // Marcar estudiante como votante
            markStudentAsVoted(authSystem.getCurrentUser().id);
            
            // Mostrar página de confirmación
            this.showConfirmationPage();
            
        } catch (error) {
            console.error('Error submitting votes:', error);
            this.showError('Error al procesar los votos. Por favor, intenta nuevamente.');
        } finally {
            this.isSubmitting = false;
            setButtonLoading(submitButton, false);
        }
    }

    // Procesar votos (simulación de envío al servidor)
    async processVotes() {
        return new Promise((resolve) => {
            // Simular delay de red
            setTimeout(() => {
                // Registrar votos en el sistema
                registerVotes(this.selectedVotes);
                resolve();
            }, 2000);
        });
    }

    // Mostrar página de confirmación
    showConfirmationPage() {
        showPage('confirmation-page');
        
        // Configurar botones de la página de confirmación
        const viewResultsBtn = document.getElementById('view-results');
        const finishVotingBtn = document.getElementById('finish-voting');

        if (viewResultsBtn) {
            viewResultsBtn.addEventListener('click', () => {
                this.showResults();
            });
        }

        if (finishVotingBtn) {
            finishVotingBtn.addEventListener('click', () => {
                authSystem.logout();
                showPage('login-page');
            });
        }
    }

    // Mostrar resultados
    showResults() {
        showPage('results-page');
        this.loadResults();
    }

    // Cargar y mostrar resultados
    loadResults() {
        const container = document.getElementById('results-container');
        if (!container) return;

        container.innerHTML = '';
        const results = getResults();

        ELECTIONS_DATA.elections.forEach(election => {
            const resultCard = this.createResultCard(election, results);
            container.appendChild(resultCard);
        });
    }

    // Crear tarjeta de resultados
    createResultCard(election, results) {
        const card = document.createElement('div');
        card.className = 'result-card';

        let totalVotesForElection = 0;
        const electionResults = results.results[election.id];
        
        // Calcular total de votos para esta elección
        for (let candidateId in electionResults) {
            totalVotesForElection += electionResults[candidateId];
        }

        let resultsHTML = '';
        election.candidates.forEach(candidate => {
            const votes = electionResults[candidate.id] || 0;
            const percentage = totalVotesForElection > 0 ? 
                ((votes / totalVotesForElection) * 100).toFixed(1) : 0;

            resultsHTML += `
                <div class="result-item">
                    <div class="candidate-info">
                        <strong>${candidate.name}</strong>
                        <span>${candidate.party}</span>
                    </div>
                    <div class="result-bar">
                        <div class="result-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="result-stats">
                        <span>${votes} votos (${percentage}%)</span>
                    </div>
                </div>
            `;
        });

        card.innerHTML = `
            <h3><i class="${election.icon}"></i> ${election.title}</h3>
            <div class="results-list">
                ${resultsHTML}
            </div>
            <div class="result-summary">
                Total de votos: ${totalVotesForElection}
            </div>
        `;

        return card;
    }

    // Mostrar mensaje de error
    showError(message) {
        // Remover errores anteriores
        const existingError = document.querySelector('.voting-error');
        if (existingError) {
            existingError.remove();
        }

        // Crear nuevo error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error voting-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        const votingSection = document.querySelector('.voting-section');
        votingSection.insertBefore(errorDiv, votingSection.firstChild);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Verificar si el usuario ya votó
    checkVotingStatus() {
        if (authSystem.hasVoted()) {
            this.showAlreadyVotedMessage();
            return false;
        }
        return true;
    }

    // Mostrar mensaje para usuarios que ya votaron
    showAlreadyVotedMessage() {
        const container = document.getElementById('elections-container');
        container.innerHTML = `
            <div class="already-voted-message">
                <i class="fas fa-check-circle"></i>
                <h3>¡Ya has ejercido tu voto!</h3>
                <p>Gracias por participar en las elecciones estudiantiles.</p>
                <div class="already-voted-actions">
                    <button id="view-results-already-voted" class="btn btn-primary">
                        <i class="fas fa-chart-bar"></i>
                        Ver Resultados
                    </button>
                </div>
            </div>
        `;

        // Configurar botón de resultados
        document.getElementById('view-results-already-voted')?.addEventListener('click', () => {
            this.showResults();
        });

        // Ocultar botón de envío
        const submitButton = document.getElementById('submit-votes');
        if (submitButton) {
            submitButton.style.display = 'none';
        }
    }
}

// Instancia global del sistema de votación
const votingSystem = new VotingSystem();