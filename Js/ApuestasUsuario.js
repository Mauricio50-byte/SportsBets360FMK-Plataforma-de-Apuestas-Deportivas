export function initUserBets() {
    
    const searchInput = document.getElementById('search-apuestas');
    const searchBtn = document.getElementById('search-btn');
    const todosBtn = document.getElementById('todos-btn');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            filterApuestas(searchInput.value);
        });
    }
    
    if (todosBtn) {
        todosBtn.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            showAllApuestas();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterApuestas(searchInput.value);
            }
        });
    }
    
    
    initBetActions();
}


export function createApuestasUsuariosContent() {
    const contentArea = document.querySelector('.content');
    if (!contentArea) return;
    
    const apuestasUsuariosContent = document.createElement('div');
    apuestasUsuariosContent.className = 'apuestas-usuarios-container';
    apuestasUsuariosContent.innerHTML = `
        <h2>Apuestas de Usuarios</h2>
        <div class="search-container">
            <input type="text" id="search-apuestas" placeholder="Busca por fecha de apuesta (29/09/2019)">
            <button class="btn-primary" id="search-btn">Buscar</button>
            <button class="btn-secondary" id="todos-btn">Todos</button>
        </div>
        <div class="apuestas-table">
            <table>
                <thead>
                    <tr>
                        <th>Apuesta</th>
                        <th>Porcentaje</th>
                        <th>Ganancia</th>
                        <th>Equipo ganador</th>
                        <th>Estado</th>
                        <th>Usuario</th>
                        <th>Fecha</th>
                        <th>Ticket</th>
                        <th>Pagar</th>
                        <th>Estado</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody id="apuestas-table-body">
                    <!-- Sample row for demonstration -->
                    <tr class="table-row">
                        <td class="cell">$50</td>
                        <td class="cell">25%</td>
                        <td class="cell">$75</td>
                        <td class="cell">Barcelona</td>
                        <td class="cell"><span class="status-indicator"></span></td>
                        <td class="cell">usuario123</td>
                        <td class="cell">29/09/2023</td>
                        <td class="cell">T12345678</td>
                        <td class="cell"><span class="payment-icon">💰</span></td>
                        <td class="cell"><span class="status-text">Pendiente</span></td>
                        <td class="cell"><span class="delete-icon">🗑️</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    contentArea.appendChild(apuestasUsuariosContent);
    
    
    initUserBets();
}


function initBetActions() {
    
    const deleteIcons = document.querySelectorAll('.delete-icon');
    deleteIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const row = this.closest('.table-row');
            if (!row) return;
            
            const ticketCell = row.querySelector('.cell:nth-child(8)');
            if (!ticketCell) return;
            
            const ticketId = ticketCell.textContent;
            
            if (confirm(`¿Estás seguro de eliminar la apuesta con ticket ${ticketId}?`)) {
               
                row.style.opacity = '0.5';
                setTimeout(() => {
                    row.remove();
                }, 500);
            }
        });
    });
    
   
    const paymentIcons = document.querySelectorAll('.payment-icon');
    paymentIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const row = this.closest('.table-row');
            if (!row) return;
            
            const ticketCell = row.querySelector('.cell:nth-child(8)');
            const amountCell = row.querySelector('.cell:nth-child(3)');
            
            if (!ticketCell || !amountCell) return;
            
            const ticketId = ticketCell.textContent;
            const amount = amountCell.textContent;
            
            if (confirm(`¿Confirmar pago de ${amount} para el ticket ${ticketId}?`)) {
                
                const statusIndicator = row.querySelector('.status-indicator');
                if (!statusIndicator) return;
                
                statusIndicator.style.backgroundColor = '#ffc107'; 
                
                setTimeout(() => {
                    statusIndicator.style.backgroundColor = '#4CAF50'; 
                    alert(`Pago realizado para ticket ${ticketId}`);
                }, 1000);
            }
        });
    });
    
    
    const statusIndicators = document.querySelectorAll('.status-indicator');
    statusIndicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
           
            const currentColor = getComputedStyle(this).backgroundColor;
            
            if (currentColor === 'rgb(76, 175, 80)' || currentColor === '#4CAF50') {
                this.style.backgroundColor = '#9e9e9e';
            } else {
                this.style.backgroundColor = '#4CAF50';
            }
        });
    });
}

/**
 * @param {string} searchTerm 
 */
function filterApuestas(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach(row => {
        const dateCell = row.querySelector('.cell:nth-child(7)');
        const userCell = row.querySelector('.cell:nth-child(6)');
        const ticketCell = row.querySelector('.cell:nth-child(8)');
        
        if (!dateCell || !userCell || !ticketCell) return;
        
        const date = dateCell.textContent.toLowerCase();
        const user = userCell.textContent.toLowerCase();
        const ticket = ticketCell.textContent.toLowerCase();
        
        if (date.includes(searchTerm) || user.includes(searchTerm) || ticket.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}


function showAllApuestas() {
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach(row => {
        row.style.display = '';
    });
}


export function showApuestasUsuariosContent() {
    
    hideAllContentSections();
    
    
    const apuestasUsuariosContent = document.querySelector('.apuestas-usuarios-container');
    if (apuestasUsuariosContent) {
        apuestasUsuariosContent.style.display = 'block';
    } else {
        
        createApuestasUsuariosContent();
    }
}


function hideAllContentSections() {
    const contentSections = document.querySelectorAll('.content > div:not(.cupon_lineas)');
    contentSections.forEach(section => {
        section.style.display = 'none';
    });
}