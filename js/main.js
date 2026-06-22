$(document).ready(function () {
    // VISTA: LOGIN
    // Cambiar Icono Visibilidad Contraseña
    $('#toggle-pwd-btn').on('click', function () {
        const passwordInput = $('#password');
        const iconInstance = $(this).find('i');

        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            iconContainer.html('<i data-lucide="eye-off" style="width: 16px; height: 16px;"></i>');
        } else {
            passwordInput.attr('type', 'password');
            iconContainer.html('<i data-lucide="eye" style="width: 16px; height: 16px;"></i>');
        }
        
        lucide.createIcons();
    });

    // Obtener Cuentas Demo
    $('.demo-item').on('click', function (e) {
        const targetUser = $(this).data('user');
        const targetPass = $(this).data('pass');

        $('#email').val(targetUser).removeClass('is-invalid');
        $('#password').val(targetPass).removeClass('is-invalid');
        
        $('#error-email, #error-password').hide();

        $(this).css('background-color', 'rgba(30, 58, 96, 0.08)');
        setTimeout(() => {
            $(this).css('background-color', '#ffffff');
        }, 200);
    });

    $('.copy-action-btn').on('click', function (e) {
        e.stopPropagation();
        $(this).parent('.demo-item').trigger('click');
    });

    // Formulario Login
    $('#form-login').on('submit', function (e) {
        e.preventDefault();
        
        const emailInput = $('#email');
        const passwordInput = $('#password');
        
        let isValid = true;

        // Validar Correo
        if ($.trim(emailInput.val()) === "") {
            emailInput.addClass('is-invalid');
            $('#error-email').text('El correo electrónico es obligatorio').show();
            isValid = false;
        } else {
            emailInput.removeClass('is-invalid');
            $('#error-email').hide();
        }

        // Validar Contraseña
        if ($.trim(passwordInput.val()) === "") {
            passwordInput.addClass('is-invalid');
            $('#error-password').text('La contraseña es obligatoria').show();
            isValid = false;
        } else {
            passwordInput.removeClass('is-invalid');
            $('#error-password').hide();
        }

        if ($.trim(passwordInput.val()) === "") {
            passwordInput.addClass('is-invalid');
            $('#error-password').show();
            isValid = false;
        } else {
            passwordInput.removeClass('is-invalid');
            $('#error-password').hide();
        }

        if (isValid) {
            window.location.href = "case-inbox.html";
        }
    });

    $('#email, #password').on('input', function() {
        if ($(this).val().trim() !== "") {
            $(this).removeClass('is-invalid');
            $(this).closest('.mb-3').find('.error-feedback').hide();
        }
    });

    
    // VISTA: CASE INBOX
    if ($('#case-inbox-container').length > 0) {

        let currentDataset = [...MOCK_CASES];
        let itemsPerPage = 10;
        let currentPage = 1;
        let activeSortColumn = null;
        let sortAscending = true;
        
        function populateResponsablesFilter() {
            const selectResponsable = $('#filter-responsable');            
            const todosLosResponsables = MOCK_CASES.map(caso => caso.responsable ? caso.responsable.trim() : '');
            const responsablesUnicos = [...new Set(todosLosResponsables)]
                .filter(nombre => nombre !== '')
                .sort((a, b) => a.localeCompare(b));

            selectResponsable.html('<option value="">Todos</option>');
            $.each(responsablesUnicos, function(idx, nombre) {
                selectResponsable.append(`<option value="${nombre}">${nombre}</option>`);
            });
        }
        
        $('#toggle-sidebar-collapse').on('click', function () {
            const sidebar = $('#main-sidebar');
            const icon = $('#toggle-icon');
            
            sidebar.toggleClass('collapsed');
            
            if (sidebar.hasClass('collapsed')) {
                $(this).html('<i data-lucide="chevron-right" id="toggle-icon" style="width: 12px; height: 12px;"></i>');
            } else {
                $(this).html('<i data-lucide="chevron-left" id="toggle-icon" style="width: 12px; height: 12px;"></i>');
            }
            lucide.createIcons();
        });

        $('#btn-toggle-filters').on('click', function() {
            $('#filter-dropdown-panel').toggleClass('d-none');
        });

        // Permitir solo selección de 1 filtro SLA a la vez
        $('.chk-sla-group').on('change', function() {
            if ($(this).is(':checked')) {
                $('.chk-sla-group').not(this).prop('checked', false).trigger('change');
            }
        });

        function getTipoBadgeClass(value) {
            if (value === "Felicitación") return "badge-tipo-felicitacion";
            if (value === "Sugerencia") return "badge-tipo-sugerencia";
            if (value === "Queja") return "badge-tipo-queja";
            if (value === "Petición") return "badge-tipo-peticion";
            return "badge-tipo-reclamo";
        }

        function getPrioridadClass(value) {
            if (value === "Baja") return "priority-baja-tag";
            if (value === "Normal") return "priority-normal-tag";
            if (value === "Alta") return "priority-alta-tag";
            return "priority-critica-tag";
        }

        function getEstadoClass(value) {
            if (value === "Cerrado") return "status-cerrado-tag";
            if (value === "Radicado") return "status-radicado-tag";
            return "status-gestion-tag";
        }

        function getSlaClass(value) {
            if (value === "Cerrado") return "sla-cerrado-tag";
            if (value === "Vencido") return "sla-vencido-tag";
            if (value === "En tiempo") return "sla-entiempo-tag";
            return "sla-proximo-tag";
        }

        function getSlaContainer(value) {
            let tagClass = "sla-entiempo-tag";
            let dotColor = "#10b981";

            if (value === "Cerrado") { tagClass = "sla-cerrado-tag"; dotColor = "#94a3b8"; }
            else if (value === "Vencido") { tagClass = "sla-vencido-tag"; dotColor = "#ef4444"; }
            else if (value === "Por vencer") { tagClass = "sla-proximo-tag"; dotColor = "#f59e0b"; }

            return `<span class="${tagClass} align-items-center" style="display: inline-flex; font-size: 10px; padding: 2px 6px; border-radius: 9999px; white-space: nowrap;">
                        <span class="d-inline-block rounded-circle" style="width:6px; height:6px; margin-right: .375rem; background-color:${dotColor}">
                        </span>${value}
                    </span>`;
        }

        
        function renderTable() {
            const tbody = $('#table-cases-body');
            tbody.empty();

            // Si el set filtrado está vacío, mostrar cuadro sin coincidencias
            if (currentDataset.length === 0) {
                const emptyTr = `
                    <tr>
                        <td colspan="13" class="px-4 py-5 text-center">
                            <div class="w-100 d-flex flex-column align-items-center justify-content-center" style="gap: 12px;">
                                <i data-lucide="search" class="text-muted-30" style="width:36px; height:36px;"></i>
                                <p class="m-0" style="color: var(--text-muted); font-size: .875rem; line-height: 1.25rem;">No se encontraron casos</p>
                                <p class="text-xs text-muted-60 m-0">Ajuste los filtros o el término de búsqueda</p>
                                <button id="btn-empty-clear" class="btn btn-link shadow-none">Limpiar todos los filtros</button>
                            </div>
                        </td>
                    </tr>
                `;
                tbody.append(emptyTr);
                lucide.createIcons();
                $('#table-counter-text').html(`Mostrando <span style="color: var(--text-dark);">0</span> de <span style="color: var(--text-dark);">0</span> casos`);
                $('#pagination-wrapper').empty();
                return;
            }

            // Cálculos del rango de paginación
            const totalItems = currentDataset.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            if (currentPage > totalPages) currentPage = totalPages || 1;

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
            const paginatedChunk = currentDataset.slice(startIndex, startIndex + itemsPerPage);

            // Inyectar Filas calculando propiedades en línea
            $.each(paginatedChunk, function(idx, item) {
                const trHtml = `
                    <tr>
                        <td><span class="txt-radicado">${item.radicado}</span></td>
                        <td><span class="txt-muted">${item.fechaRad}</span></td>
                        <td><span class="badge-custom ${getTipoBadgeClass(item.tipo)}">${item.tipo}</span></td>
                        <td><span class="txt-dark" style="white-space: nowrap;">${item.servicio}</span></td>
                        <td><span class="txt-dark">${item.categoria}</span></td>
                        <td><span class="txt-muted cell-truncate" style="max-width: 120px;" title="${item.subcategoria}">${item.subcategoria}</span></td>
                        <td><span class="txt-dark cell-truncate" style="max-width: 140px;" title="${item.asociado}">${item.asociado}</span></td>
                        <td><span class="txt-muted cell-truncate" style="max-width: 130px;" title="${item.responsable}">${item.responsable}</span></td>
                        <td><span class="badge-custom ${getPrioridadClass(item.prioridad)}">${item.prioridad}</span></td>
                        <td><span class="badge-custom ${getEstadoClass(item.estado)}">${item.estado}</span></td>
                        <td><span class="${getSlaClass(item.semaforo)}" style="font-variant-numeric: tabular-nums; font-size: .75rem; line-height: 1rem; white-space: nowrap; background-color: transparent;">${item.limiteSla}</span></td>
                        <td>${getSlaContainer(item.semaforo)}</td>
                        <td>
                            <a class="btn-action-view" title="Ver detalle del caso" href="case-detail.html?radicado=${item.radicado}">
                                <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
                            </a>
                        </td>
                    </tr>
                `;
                tbody.append(trHtml);
            });

            const displayStart = totalItems === 0 ? 0 : startIndex + 1;
            $('#table-counter-text').html(
                `Mostrando <span style="color: var(--text-dark)">${displayStart}-${endIndex}</span> de <span style="color: var(--text-dark);">${totalItems}</span> casos`
            );
            
            // Re-renderizar Componentes del paginador
            buildPaginationControls(totalPages);
            lucide.createIcons();
        }

        function buildPaginationControls(totalPages) {
            const wrapper = $('#pagination-wrapper');
            wrapper.empty();
            if (totalPages <= 1) return;

            const prevDisabled = currentPage === 1 ? 'btn-disabled' : '';
            const prevBtn = `
                <button class="page-btn-custom btn-default page-node-trigger ${prevDisabled}" data-page="${currentPage - 1}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left" aria-hidden="true">
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                </button>
            `;
            wrapper.append(prevBtn);

            for (let i = 1; i <= totalPages; i++) {
                const isActive = (i === currentPage);
                
                const btnThemes = isActive 
                    ? 'btn-active'
                    : 'btn-default';

                wrapper.append(`
                    <button class="${btnThemes} page-btn-custom page-node-trigger" data-page="${i}">
                        ${i}
                    </button>
                `);
            }

            const nextDisabled = currentPage === totalPages ? 'btn-disabled' : '';
            const nextBtn = `
                <button class="page-btn-custom btn-default page-node-trigger ${nextDisabled}" data-page="${currentPage + 1}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right" aria-hidden="true">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                </button>
            `;

            wrapper.append(nextBtn);
        }

        // Interacción Nodos de Páginas         
        $(document).on('click', '.page-node-trigger', function() {
            currentPage = $(this).data('page');
            renderTable();
        });

        $('#items-per-page-select').on('change', function() {
            itemsPerPage = parseInt($(this).val());
            currentPage = 1;
            renderTable();
        });

        function executeFiltersPipeline() {
            const query = $('#global-search').val().toLowerCase().trim();
            const fEstado = $('#filter-estado').val();
            const fTipo = $('#filter-tipo').val();
            const fServicio = $('#filter-servicio').val();
            const fResponsable = $('#filter-responsable').val();
            const fPrioridad = $('#filter-prioridad').val();
            const fSlaVencido = $('#chk-sla-vencido').is(':checked');
            const fSlaProximo = $('#chk-sla-proximo').is(':checked');

            let filterCounter = 0;
            if (query) filterCounter++;
            if (fEstado) filterCounter++;
            if (fTipo) filterCounter++;
            if (fServicio) filterCounter++;
            if (fResponsable) filterCounter++;
            if (fPrioridad) filterCounter++;
            if (fSlaVencido) filterCounter++;
            if (fSlaProximo) filterCounter++;

            if (filterCounter > 0 || query.length > 0) {
                $('#btn-clear-all-filters').removeClass('d-none');
            } else {
                $('#btn-clear-all-filters').addClass('d-none');
            }

            if (filterCounter > 0) {
                $('#filter-counter-badge').html(filterCounter).removeClass('d-none').addClass('d-flex');
            } else {
                $('#filter-counter-badge').addClass('d-none').removeClass('d-flex');
            }

            // Aplicar Filtros
            currentDataset = MOCK_CASES.filter(item => {
                if (query && !item.radicado.toLowerCase().includes(query) && !item.asociado.toLowerCase().includes(query)) return false;
                if (fEstado && item.estado !== fEstado) return false;
                if (fTipo && item.tipo !== fTipo) return false;
                if (fServicio && item.servicio !== fServicio) return false;
                if (fResponsable && item.responsable !== fResponsable) return false;
                if (fPrioridad && item.prioridad !== fPrioridad) return false;
                if (fSlaVencido && item.semaforo !== "Vencido") return false;
                if (fSlaProximo && item.semaforo !== "Por vencer") return false;
                return true;
            });

            // Aplicar Ordenamiento
            if (activeSortColumn) {
                applySortingLogic(activeSortColumn, false);
            }

            renderTable();
        }
        
        $('#global-search').on('input', executeFiltersPipeline);
        $('#filter-dropdown-panel select').on('change', executeFiltersPipeline);
        $('#filter-dropdown-panel input[type="checkbox"]').on('change', executeFiltersPipeline);

        // Botón de Limpieza General
        function resetFiltersSystem() {
            $('#global-search').val('');
            $('#filter-dropdown-panel select').val('');
            $('#filter-dropdown-panel input[type="checkbox"]').prop('checked', false);
            executeFiltersPipeline();
        }
        $('#btn-clear-all-filters').on('click', resetFiltersSystem);
        $(document).on('click', '#btn-empty-clear', resetFiltersSystem);

        // Logica de Ordenamiento
        function applySortingLogic(columnKey, toggleDirection = true) {
            if (toggleDirection) {
                if (activeSortColumn === columnKey) {
                    sortAscending = !sortAscending;
                } else {
                    activeSortColumn = columnKey;
                    sortAscending = true;
                }
            }

            currentDataset.sort((a, b) => {
                let valA = (a[columnKey] || '').toString().toLowerCase();
                let valB = (b[columnKey] || '').toString().toLowerCase();
                
                return sortAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
            });

            // Actualizar iconografía de los th
            $('.sortable-header').each(function() {
                const th = $(this);
                const icon = th.find('i, svg'); 
                if (th.data('sort') === columnKey) {
                    const nextIconName = sortAscending ? 'chevron-up' : 'chevron-down';
                    icon.replaceWith(`<i data-lucide="${nextIconName}" class="sort-icon-active"></i>`);
                } else {
                    icon.replaceWith(`<i data-lucide="chevron-down" class="sort-icon-muted"></i>`);
                }
            });

            lucide.createIcons();
        }

        $('.sortable-header').on('click', function() {
            const columnKey = $(this).data('sort');
            applySortingLogic(columnKey, true);
            renderTable();
        });
        
        $(document).on('click', '.go-to-detail', function () {
            const radId = $(this).data('id');
            window.location.href = `case-detail.html?radicado=${radId}`;
        });

        // Inicializar Renderizado Primario
        populateResponsablesFilter();
        executeFiltersPipeline();
    }
    
    
    // VISTA: CASE DETAIL
});