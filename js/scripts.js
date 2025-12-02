/**
 * BASES DE DATOS II - JavaScript Interactivo
 * Funcionalidades: Navegación, Tabs, Editor SQL, Animaciones
 */

document.addEventListener('DOMContentLoaded', function() {
    // =====================
    // Navegación
    // =====================
    
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    // Scroll effect for header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 10, 15, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        } else {
            header.style.background = 'rgba(10, 10, 15, 0.8)';
            header.style.boxShadow = 'none';
        }
    });
    
    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });
    
    // =====================
    // Code Tabs
    // =====================
    
    const tabContainers = document.querySelectorAll('.code-example, .code-tabs');
    
    tabContainers.forEach(container => {
        const tabBtns = container.querySelectorAll('.tab-btn');
        const panels = container.querySelectorAll('.code-panel') || 
                       container.parentElement.querySelectorAll('.code-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active from all tabs in this container
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Find the panels container
                const panelsContainer = container.querySelector('.code-panels') || 
                                       container.parentElement.querySelector('.code-panels');
                
                if (panelsContainer) {
                    const allPanels = panelsContainer.querySelectorAll('.code-panel');
                    allPanels.forEach(panel => {
                        panel.classList.remove('active');
                        if (panel.id === tabId) {
                            panel.classList.add('active');
                        }
                    });
                }
            });
        });
    });
    
    // =====================
    // Copy Code Buttons
    // =====================
    
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            const codeId = this.getAttribute('data-code');
            const codeElement = document.getElementById(codeId);
            
            if (codeElement) {
                const codeText = codeElement.textContent;
                
                try {
                    await navigator.clipboard.writeText(codeText);
                    
                    // Visual feedback
                    const originalText = this.textContent;
                    this.textContent = '✓ Copiado!';
                    this.style.background = 'rgba(16, 185, 129, 0.2)';
                    this.style.borderColor = '#10b981';
                    this.style.color = '#10b981';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.background = '';
                        this.style.borderColor = '';
                        this.style.color = '';
                    }, 2000);
                } catch (err) {
                    console.error('Error al copiar:', err);
                    this.textContent = '❌ Error';
                    setTimeout(() => {
                        this.textContent = '📋 Copiar';
                    }, 2000);
                }
            }
        });
    });
    
    // =====================
    // SQL Editor Practice
    // =====================
    
    const sqlEditor = document.getElementById('sqlEditor');
    const runQueryBtn = document.getElementById('runQuery');
    const clearQueryBtn = document.getElementById('clearQuery');
    const queryOutput = document.getElementById('queryOutput');
    const exerciseItems = document.querySelectorAll('.exercise-item');
    const exerciseDescription = document.querySelector('.exercise-description');
    
    // Exercise data
    const exercises = {
        1: {
            title: 'Ejercicio 1: Crear Procedimiento',
            description: 'Crea un procedimiento que muestre los productos con stock menor a un valor dado como parámetro.',
            defaultCode: `-- Escribe tu código SQL aquí
CREATE PROCEDURE sp_ProductosBajoStock
    @StockMinimo INT
AS
BEGIN
    SELECT ProductoID, Nombre, Stock
    FROM Productos
    WHERE Stock < @StockMinimo
    ORDER BY Stock ASC;
END;`,
            expectedKeywords: ['CREATE', 'PROCEDURE', 'SELECT', 'FROM', 'WHERE']
        },
        2: {
            title: 'Ejercicio 2: Crear Trigger',
            description: 'Crea un trigger que registre en una tabla de auditoría cada vez que se elimine un producto.',
            defaultCode: `-- Crea un trigger de auditoría para eliminación
CREATE TRIGGER trg_AuditarEliminacion
ON Productos
AFTER DELETE
AS
BEGIN
    INSERT INTO AuditoriaProductos 
        (ProductoID, Accion, Fecha, Usuario)
    SELECT 
        ProductoID, 
        'DELETE',
        GETDATE(),
        SYSTEM_USER
    FROM deleted;
END;`,
            expectedKeywords: ['CREATE', 'TRIGGER', 'DELETE', 'INSERT', 'deleted']
        },
        3: {
            title: 'Ejercicio 3: Optimizar Consulta',
            description: 'Optimiza la siguiente consulta que actualmente tarda 10 segundos en ejecutarse.',
            defaultCode: `-- Consulta original (NO optimizada):
-- SELECT * FROM Ventas WHERE YEAR(Fecha) = 2024

-- Tu versión optimizada:
SELECT 
    VentaID,
    ClienteID,
    Total,
    Fecha
FROM Ventas
WHERE Fecha >= '2024-01-01' 
  AND Fecha < '2025-01-01'

-- Índice sugerido:
-- CREATE INDEX IX_Ventas_Fecha ON Ventas(Fecha);`,
            expectedKeywords: ['SELECT', 'FROM', 'WHERE', 'INDEX']
        }
    };
    
    // Exercise selection
    exerciseItems.forEach(item => {
        item.addEventListener('click', function() {
            const exerciseNum = this.getAttribute('data-exercise');
            const exercise = exercises[exerciseNum];
            
            if (exercise) {
                // Update active state
                exerciseItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Update editor
                sqlEditor.value = exercise.defaultCode;
                
                // Update description
                if (exerciseDescription) {
                    exerciseDescription.innerHTML = `
                        <h5>${exercise.title}</h5>
                        <p>${exercise.description}</p>
                    `;
                }
                
                // Clear output
                queryOutput.innerHTML = `
                    <div class="output-placeholder">
                        <span class="output-icon">📊</span>
                        <p>Los resultados aparecerán aquí al ejecutar tu consulta</p>
                    </div>
                `;
            }
        });
    });
    
    // Run query simulation
    if (runQueryBtn) {
        runQueryBtn.addEventListener('click', function() {
            const query = sqlEditor.value.trim();
            
            if (!query) {
                showOutput('error', 'Por favor, escribe una consulta SQL.');
                return;
            }
            
            // Simulate query execution
            this.disabled = true;
            this.innerHTML = '<span class="spinner">⏳</span> Ejecutando...';
            
            setTimeout(() => {
                analyzeAndShowResult(query);
                this.disabled = false;
                this.innerHTML = '<span>▶</span> Ejecutar';
            }, 1500);
        });
    }
    
    // Clear query
    if (clearQueryBtn) {
        clearQueryBtn.addEventListener('click', function() {
            sqlEditor.value = '';
            queryOutput.innerHTML = `
                <div class="output-placeholder">
                    <span class="output-icon">📊</span>
                    <p>Los resultados aparecerán aquí al ejecutar tu consulta</p>
                </div>
            `;
        });
    }
    
    function analyzeAndShowResult(query) {
        const upperQuery = query.toUpperCase();
        let resultHTML = '';
        
        // Check for different SQL statements
        if (upperQuery.includes('CREATE PROCEDURE') || upperQuery.includes('CREATE PROC')) {
            resultHTML = generateProcedureResult(query);
        } else if (upperQuery.includes('CREATE TRIGGER')) {
            resultHTML = generateTriggerResult(query);
        } else if (upperQuery.includes('SELECT')) {
            resultHTML = generateSelectResult(query);
        } else if (upperQuery.includes('CREATE INDEX')) {
            resultHTML = generateIndexResult(query);
        } else {
            resultHTML = `
                <div class="output-success">
                    <h5>✅ Consulta analizada</h5>
                    <p>Tu código SQL ha sido procesado correctamente.</p>
                    <div class="analysis-tips">
                        <h6>💡 Sugerencias:</h6>
                        <ul>
                            <li>Asegúrate de usar índices en columnas frecuentemente consultadas</li>
                            <li>Evita SELECT * en producción</li>
                            <li>Considera el uso de transacciones para operaciones múltiples</li>
                        </ul>
                    </div>
                </div>
            `;
        }
        
        queryOutput.innerHTML = resultHTML;
    }
    
    function generateProcedureResult(query) {
        const procNameMatch = query.match(/PROCEDURE\s+(\w+)/i);
        const procName = procNameMatch ? procNameMatch[1] : 'sp_MiProcedimiento';
        
        return `
            <div class="output-success">
                <h5>✅ Procedimiento creado exitosamente</h5>
                <div class="result-details">
                    <p><strong>Nombre:</strong> ${procName}</p>
                    <p><strong>Estado:</strong> Compilado correctamente</p>
                </div>
                <div class="execution-example">
                    <h6>📝 Ejemplo de ejecución:</h6>
                    <code>EXEC ${procName} @Parametro = valor;</code>
                </div>
                <div class="analysis-feedback good">
                    <span class="feedback-icon">👍</span>
                    <p>¡Buen trabajo! Tu procedimiento sigue las mejores prácticas.</p>
                </div>
            </div>
        `;
    }
    
    function generateTriggerResult(query) {
        const triggerNameMatch = query.match(/TRIGGER\s+(\w+)/i);
        const triggerName = triggerNameMatch ? triggerNameMatch[1] : 'trg_MiTrigger';
        
        let triggerType = 'AFTER';
        if (query.toUpperCase().includes('INSTEAD OF')) triggerType = 'INSTEAD OF';
        if (query.toUpperCase().includes('BEFORE')) triggerType = 'BEFORE';
        
        let event = [];
        if (query.toUpperCase().includes('INSERT')) event.push('INSERT');
        if (query.toUpperCase().includes('UPDATE')) event.push('UPDATE');
        if (query.toUpperCase().includes('DELETE')) event.push('DELETE');
        
        return `
            <div class="output-success">
                <h5>✅ Trigger creado exitosamente</h5>
                <div class="result-details">
                    <p><strong>Nombre:</strong> ${triggerName}</p>
                    <p><strong>Tipo:</strong> ${triggerType}</p>
                    <p><strong>Eventos:</strong> ${event.join(', ') || 'No especificado'}</p>
                </div>
                <div class="analysis-feedback good">
                    <span class="feedback-icon">⚡</span>
                    <p>El trigger se ejecutará automáticamente en cada operación ${event.join('/')}.</p>
                </div>
                <div class="warning-note">
                    <h6>⚠️ Recordatorio:</h6>
                    <p>Los triggers pueden afectar el rendimiento. Úsalos con moderación.</p>
                </div>
            </div>
        `;
    }
    
    function generateSelectResult(query) {
        // Simulated result data
        const sampleData = [
            { ProductoID: 1, Nombre: 'Laptop HP', Stock: 5 },
            { ProductoID: 3, Nombre: 'Mouse Logitech', Stock: 8 },
            { ProductoID: 7, Nombre: 'Teclado Mecánico', Stock: 3 }
        ];
        
        let isOptimized = !query.toUpperCase().includes('SELECT *') && 
                          !query.toUpperCase().includes('YEAR(') &&
                          !query.toUpperCase().includes('MONTH(');
        
        return `
            <div class="output-success">
                <h5>✅ Consulta ejecutada</h5>
                <p class="rows-affected">${sampleData.length} filas retornadas en 0.${Math.floor(Math.random() * 9) + 1}s</p>
                
                <div class="result-table-container">
                    <table class="result-data-table">
                        <thead>
                            <tr>
                                <th>ProductoID</th>
                                <th>Nombre</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sampleData.map(row => `
                                <tr>
                                    <td>${row.ProductoID}</td>
                                    <td>${row.Nombre}</td>
                                    <td class="${row.Stock < 10 ? 'low-stock' : ''}">${row.Stock}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="analysis-feedback ${isOptimized ? 'good' : 'warning'}">
                    <span class="feedback-icon">${isOptimized ? '🚀' : '⚠️'}</span>
                    <p>${isOptimized 
                        ? '¡Excelente! Tu consulta está bien optimizada.' 
                        : 'Sugerencia: Evita SELECT * y funciones en cláusulas WHERE para mejor rendimiento.'}</p>
                </div>
            </div>
        `;
    }
    
    function generateIndexResult(query) {
        const indexNameMatch = query.match(/INDEX\s+(\w+)/i);
        const indexName = indexNameMatch ? indexNameMatch[1] : 'IX_MiIndice';
        
        return `
            <div class="output-success">
                <h5>✅ Índice creado exitosamente</h5>
                <div class="result-details">
                    <p><strong>Nombre:</strong> ${indexName}</p>
                    <p><strong>Tipo:</strong> Non-Clustered</p>
                </div>
                <div class="performance-impact">
                    <h6>📈 Impacto estimado:</h6>
                    <div class="impact-meter">
                        <span class="meter-label">Mejora en consultas SELECT:</span>
                        <div class="meter-bar">
                            <div class="meter-fill" style="width: 75%"></div>
                        </div>
                        <span class="meter-value">+75%</span>
                    </div>
                    <div class="impact-meter">
                        <span class="meter-label">Impacto en INSERT/UPDATE:</span>
                        <div class="meter-bar warning">
                            <div class="meter-fill" style="width: 15%"></div>
                        </div>
                        <span class="meter-value">-15%</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    function showOutput(type, message) {
        const icons = {
            error: '❌',
            success: '✅',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        queryOutput.innerHTML = `
            <div class="output-${type}">
                <span class="output-msg-icon">${icons[type]}</span>
                <p>${message}</p>
            </div>
        `;
    }
    
    // =====================
    // Intersection Observer for Animations
    // =====================
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all content blocks
    document.querySelectorAll('.content-block, .objective-card, .case-study').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .output-success {
            animation: fadeIn 0.3s ease;
        }
        
        .output-error {
            color: #ef4444;
            padding: 1rem;
            background: rgba(239, 68, 68, 0.1);
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .result-details {
            background: rgba(255,255,255,0.03);
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
        }
        
        .result-details p {
            margin: 0.5rem 0;
            color: #94a3b8;
        }
        
        .execution-example {
            margin-top: 1rem;
            padding: 1rem;
            background: #0d1117;
            border-radius: 8px;
        }
        
        .execution-example h6 {
            color: #64748b;
            margin-bottom: 0.5rem;
            font-size: 0.85rem;
        }
        
        .execution-example code {
            font-family: 'JetBrains Mono', monospace;
            color: #00d4aa;
        }
        
        .analysis-feedback {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
        }
        
        .analysis-feedback.good {
            background: rgba(16, 185, 129, 0.1);
            border-left: 3px solid #10b981;
        }
        
        .analysis-feedback.warning {
            background: rgba(245, 158, 11, 0.1);
            border-left: 3px solid #f59e0b;
        }
        
        .feedback-icon {
            font-size: 1.5rem;
        }
        
        .analysis-feedback p {
            color: #94a3b8;
            margin: 0;
        }
        
        .warning-note {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(245, 158, 11, 0.1);
            border-radius: 8px;
        }
        
        .warning-note h6 {
            color: #f59e0b;
            margin-bottom: 0.5rem;
        }
        
        .warning-note p {
            color: #94a3b8;
            margin: 0;
            font-size: 0.9rem;
        }
        
        .rows-affected {
            color: #64748b;
            font-size: 0.85rem;
            margin-bottom: 1rem;
        }
        
        .result-table-container {
            overflow-x: auto;
            margin: 1rem 0;
        }
        
        .result-data-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .result-data-table th,
        .result-data-table td {
            padding: 0.75rem 1rem;
            text-align: left;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .result-data-table th {
            background: rgba(255,255,255,0.05);
            color: #64748b;
            font-size: 0.8rem;
            text-transform: uppercase;
        }
        
        .result-data-table td {
            color: #e2e8f0;
        }
        
        .result-data-table .low-stock {
            color: #ef4444;
            font-weight: 600;
        }
        
        .performance-impact {
            margin-top: 1rem;
        }
        
        .performance-impact h6 {
            color: #64748b;
            margin-bottom: 1rem;
        }
        
        .impact-meter {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.75rem;
        }
        
        .meter-label {
            font-size: 0.85rem;
            color: #94a3b8;
            min-width: 200px;
        }
        
        .meter-bar {
            flex: 1;
            height: 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .meter-fill {
            height: 100%;
            background: #10b981;
            border-radius: 4px;
            transition: width 1s ease;
        }
        
        .meter-bar.warning .meter-fill {
            background: #f59e0b;
        }
        
        .meter-value {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            color: #10b981;
            min-width: 50px;
        }
        
        .meter-bar.warning + .meter-value {
            color: #f59e0b;
        }
        
        .analysis-tips {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(59, 130, 246, 0.1);
            border-radius: 8px;
        }
        
        .analysis-tips h6 {
            color: #3b82f6;
            margin-bottom: 0.5rem;
        }
        
        .analysis-tips ul {
            margin: 0;
            padding-left: 1.5rem;
            color: #94a3b8;
        }
        
        .analysis-tips li {
            margin: 0.25rem 0;
            font-size: 0.9rem;
        }
        
        .spinner {
            display: inline-block;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // =====================
    // Typing Effect for Hero
    // =====================
    
    const codeContent = document.querySelector('.hero-visual .code-content code');
    if (codeContent) {
        const originalHTML = codeContent.innerHTML;
        codeContent.innerHTML = '';
        
        let i = 0;
        const typeSpeed = 20;
        
        function typeWriter() {
            if (i < originalHTML.length) {
                // Handle HTML tags
                if (originalHTML.charAt(i) === '<') {
                    const tagEnd = originalHTML.indexOf('>', i);
                    codeContent.innerHTML += originalHTML.substring(i, tagEnd + 1);
                    i = tagEnd + 1;
                } else {
                    codeContent.innerHTML += originalHTML.charAt(i);
                    i++;
                }
                setTimeout(typeWriter, typeSpeed);
            }
        }
        
        // Start typing after a delay
        setTimeout(typeWriter, 1000);
    }
    
    // =====================
    // Progress Indicator
    // =====================
    
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    const progressStyle = document.createElement('style');
    progressStyle.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(255,255,255,0.1);
            z-index: 9999;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #00d4aa, #6366f1);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(progressStyle);
    
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        document.querySelector('.progress-fill').style.width = progress + '%';
    });
    
    // =====================
    // Keyboard Shortcuts
    // =====================
    
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to run query
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (document.activeElement === sqlEditor) {
                e.preventDefault();
                runQueryBtn.click();
            }
        }
        
        // Escape to clear
        if (e.key === 'Escape' && document.activeElement === sqlEditor) {
            sqlEditor.blur();
        }
    });
    
    // =====================
    // Initialize Tooltips
    // =====================
    
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            this.appendChild(tooltip);
            
            setTimeout(() => tooltip.classList.add('visible'), 10);
        });
        
        el.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) {
                tooltip.classList.remove('visible');
                setTimeout(() => tooltip.remove(), 200);
            }
        });
    });
    
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: #1a1a24;
            color: #e2e8f0;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.8rem;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.2s, transform 0.2s;
            pointer-events: none;
            z-index: 1000;
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .tooltip.visible {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    `;
    document.head.appendChild(tooltipStyle);
    
    console.log('🚀 Bases de Datos II - Curso cargado correctamente');
});