
let selectedBets = [];


export function initBettingFunctionality() {
    
    const betOptions = document.querySelectorAll('.bet-option');
    
    betOptions.forEach(option => {
        option.addEventListener('click', function() {
            
            const matchContainer = this.closest('.match-container');
            if (!matchContainer) return;
            
            const matchInfoElement = matchContainer.querySelector('.match-info');
            if (!matchInfoElement) return;
            
            const matchInfo = matchInfoElement.textContent.trim();
            
            let betType = '';
            if (this.classList.contains('team1')) {
                betType = 'local';
            } else if (this.classList.contains('draw')) {
                betType = 'empate';
            } else if (this.classList.contains('team2')) {
                betType = 'visitante';
            } else {
                return; 
            }
            
            
            const teamNameElement = this.querySelector('.team-name');
            const oddsElement = this.querySelector('.odds');
            
            if (!teamNameElement || !oddsElement) return;
            
            const teamName = teamNameElement.textContent.trim();
            const odds = parseFloat(oddsElement.textContent.trim());
            
            if (isNaN(odds)) return; 
            
            const betData = {
                matchInfo,
                betType,
                teamName,
                odds
            };
            
           
            const existingIndex = selectedBets.findIndex(bet => 
                bet.matchInfo === betData.matchInfo && bet.betType === betData.betType
            );
            
            if (existingIndex !== -1) {
                
                selectedBets.splice(existingIndex, 1);
                this.classList.remove('selected');
            } else {
                
                const siblingOptions = matchContainer.querySelectorAll('.bet-option');
                siblingOptions.forEach(sibling => {
                    if (sibling !== this) {
                        sibling.classList.remove('selected');
                    }
                });
                
               
                selectedBets = selectedBets.filter(bet => 
                    bet.matchInfo !== betData.matchInfo
                );
                
                
                selectedBets.push(betData);
                this.classList.add('selected');
            }
            
            
            updateBettingSlip();
        });
    });

    
    const montoApostarInput = document.getElementById('monto-apostar');
    if (montoApostarInput) {
        montoApostarInput.addEventListener('input', function() {
            
            let value = this.value.replace(/[^\d.]/g, '');
            
            
            const decimalCount = (value.match(/\./g) || []).length;
            if (decimalCount > 1) {
                value = value.replace(/\.(?=.*\.)/g, '');
            }
            
            this.value = value;
            updateBettingSlip();
        });
    }

 
    const realizarApuestaBtn = document.getElementById('realizar-apuesta-btn');
    if (realizarApuestaBtn) {
        realizarApuestaBtn.addEventListener('click', handleBetSubmission);
    }

    
    updateBettingSlip();
}


export function updateBettingSlip() {
    const totalLineasInput = document.getElementById('total-lineas');
    const montoApostarInput = document.getElementById('monto-apostar');
    const cuotaTotalInput = document.getElementById('cuota-total');
    const gananciaTotalInput = document.getElementById('ganancia-total');
    
    if (!totalLineasInput || !montoApostarInput || !cuotaTotalInput || !gananciaTotalInput) {
        console.error('Error: One or more betting slip elements not found');
        return;
    }
    
    
    totalLineasInput.value = selectedBets.length;
    
   
    let totalOdds = 1;
    selectedBets.forEach(bet => {
        totalOdds *= bet.odds;
    });
    
    
    totalOdds = Math.round(totalOdds * 100) / 100;
    cuotaTotalInput.value = totalOdds.toFixed(2);
    
    
    const betAmount = parseFloat(montoApostarInput.value) || 0;
    const potentialWinnings = betAmount * totalOdds;
    gananciaTotalInput.value = potentialWinnings.toFixed(2);
    
    
    updateBettingSlipUI();
    
    
    updateCuponLineas();
}


export function updateCuponLineas() {
    const cuponLineas = document.getElementById('cupon_lineas');
    if (cuponLineas) {
        
        cuponLineas.style.display = 'block';
        
        
        const betCountBadge = document.querySelector('.bet-count-badge');
        if (betCountBadge) {
            betCountBadge.textContent = selectedBets.length;
            
            if (selectedBets.length > 0) {
                betCountBadge.style.display = 'inline-block';
            } else {
                betCountBadge.style.display = 'none';
            }
        }
    }
}


function updateBettingSlipUI() {
    const bettingSlipContainer = document.querySelector('.betting-slip-selections');
    if (!bettingSlipContainer) return;
    
    
    bettingSlipContainer.innerHTML = '';
    
    // Add each bet to the slip
    selectedBets.forEach((bet, index) => {
        const selectionElement = document.createElement('div');
        selectionElement.className = 'betting-slip-selection';
        
        // Create remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-selection';
        removeButton.textContent = '×';
        removeButton.dataset.index = index;
        removeButton.addEventListener('click', function() {
            // Remove this bet
            const betIndex = parseInt(this.dataset.index);
            if (isNaN(betIndex)) return;
            
            const removedBet = selectedBets[betIndex];
            selectedBets.splice(betIndex, 1);
            
            // Also remove selected class from corresponding bet option
            document.querySelectorAll('.bet-option.selected').forEach(option => {
                const matchInfo = option.closest('.match-container')?.querySelector('.match-info')?.textContent.trim();
                const betType = option.classList.contains('team1') ? 'local' : 
                              option.classList.contains('draw') ? 'empate' : 'visitante';
                
                if (matchInfo === removedBet.matchInfo && betType === removedBet.betType) {
                    option.classList.remove('selected');
                }
            });
            
            // Update betting slip
            updateBettingSlip();
        });
        
        // Create selection text
        const selectionText = document.createElement('div');
        selectionText.className = 'selection-text';
        selectionText.innerHTML = `
            <div class="selection-match">${bet.matchInfo}</div>
            <div class="selection-bet">
                <span class="selection-type">${bet.betType.toUpperCase()}: </span>
                <span class="selection-team">${bet.teamName}</span>
                <span class="selection-odds">${bet.odds.toFixed(2)}</span>
            </div>
        `;
        
        // Append elements
        selectionElement.appendChild(removeButton);
        selectionElement.appendChild(selectionText);
        bettingSlipContainer.appendChild(selectionElement);
    });
}

/**
 * Handle submission of a bet
 */
function handleBetSubmission() {
    const totalLines = parseInt(document.getElementById('total-lineas')?.value) || 0;
    const betAmount = parseFloat(document.getElementById('monto-apostar')?.value) || 0;
    const balanceElement = document.querySelector('.balance-amount');
    
    if (!balanceElement) {
        alert('Error: No se pudo encontrar el elemento de saldo');
        return;
    }
    
    const currentBalance = parseFloat(balanceElement.textContent.replace(/[^\d.]/g, '')) || 0;
    
    if (totalLines === 0) {
        alert('Debes seleccionar al menos una apuesta');
        return;
    }
    
    if (betAmount <= 0) {
        alert('El monto a apostar debe ser mayor a 0');
        return;
    }
    
    if (betAmount > currentBalance) {
        alert('No tienes saldo suficiente para realizar esta apuesta');
        return;
    }
    
    // Process bet (in a real app, this would send data to a server)
    // Generate a unique ticket ID
    const ticketId = 'T' + Date.now().toString().substring(7);
    
    // Create a record of the bet
    const betRecord = {
        ticketId,
        timestamp: new Date(),
        selections: [...selectedBets],
        amount: betAmount,
        potentialWin: parseFloat(document.getElementById('ganancia-total')?.value) || 0,
        status: 'pendiente'
    };
    
    // Save bet record (in a real app, this would be saved to a database)
    console.log('Bet placed:', betRecord);
    
    // Update the balance
    const newBalance = currentBalance - betAmount;
    balanceElement.textContent = `$ ${newBalance.toFixed(2)}`;
    
    // Reset betting slip
    selectedBets = [];
    document.querySelectorAll('.bet-option.selected').forEach(option => {
        option.classList.remove('selected');
    });
    
    updateBettingSlip();
    if (document.getElementById('monto-apostar')) {
        document.getElementById('monto-apostar').value = '';
    }
    
    alert(`¡Apuesta realizada con éxito! Ticket #${ticketId}`);
}

/**
 * Reset all selections in the betting slip
 */
export function resetBettingSlip() {
    selectedBets = [];
    document.querySelectorAll('.bet-option.selected').forEach(option => {
        option.classList.remove('selected');
    });
    
    updateBettingSlip();
    const montoInput = document.getElementById('monto-apostar');
    if (montoInput) montoInput.value = '';
}