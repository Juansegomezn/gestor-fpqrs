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
        
        $('#toggle-sidebar-collapse').on('click', function () {
            const sidebar = $('#main-sidebar');
            const icon = $('#toggle-icon');
            
            sidebar.toggleClass('collapsed');
            
            if (sidebar.hasClass('collapsed')) {
                $(this).html('<i data-lucide="chevron-right" id="toggle-icon"></i>');
            } else {
                $(this).html('<i data-lucide="chevron-left" id="toggle-icon"></i>');
            }
            lucide.createIcons();
        });

        function renderHighFidelityTable(dataset) {
            const tbody = $('#table-cases-body');
            tbody.empty();

            if(dataset.length === 0) {
                tbody.append('<tr><td colspan="13" class="text-center py-4 text-muted">Ningún radicado coincide con los filtros.</td></tr>');
                return;
            }

            $.each(dataset, function (idx, item) {
                const trHtml = `
                    <tr class="align-middle">
                        <td><span class="text-xs font-semibold text-primary">${item.radicado}</span></td>
                        <td><span class="text-xs text-muted-foreground">${item.fechaRad}</span></td>
                        <td><span class="inline-flex items-center rounded-full text-[10px] px-2 py-0.5 ${item.tipoBadge}">${item.tipo}</span></td>
                        <td><span class="text-xs text-dark">${item.servicio}</span></td>
                        <td><span class="text-xs text-dark">${item.categoria}</span></td>
                        <td><span class="text-xs text-muted max-w-[120px] d-block text-truncate" title="${item.subcategoria}">${item.subcategoria}</span></td>
                        <td><span class="text-xs text-dark font-medium max-w-[140px] d-block text-truncate" title="${item.asociado}">${item.asociado}</span></td>
                        <td><span class="text-xs text-muted max-w-[130px] d-block text-truncate" title="${item.responsable}">${item.responsable}</span></td>
                        <td><span class="${item.prioridadClass}">${item.prioridad}</span></td>
                        <td><span class="${item.estadoClass}">${item.estado}</span></td>
                        <td><span class="text-xs text-muted">${item.limiteSla}</span></td>
                        <td>
                            <span class="inline-flex items-center ${item.semaforoClass}">
                                <span class="d-inline-block rounded-circle me-1.5" style="width:6px; height:6px; background-color:${item.dotColor}"></span>
                                ${item.semaforo}
                            </span>
                        </td>
                        <td class="text-end">
                            <button type="button" class="btn p-1 border-0 text-muted-foreground go-to-detail" data-id="${item.radicado}">
                                <i data-lucide="eye" style="width:14px; height:14px;"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.append(trHtml);
            });

            lucide.createIcons();
            $('#table-counter-text').text(`Mostrando ${dataset.length} de ${MOCK_CASES.length} registros`);
        }

        renderHighFidelityTable(MOCK_CASES);

        // Global Search Filter (radicado y asociado)
        $('#global-search').on('input', function () {
            const query = $(this).val().toLowerCase().trim();
            
            const results = MOCK_CASES.filter(c => 
                c.radicado.toLowerCase().includes(query) || 
                c.asociado.toLowerCase().includes(query)
            );
            
            renderHighFidelityTable(results);
        });

        $(document).on('click', '.go-to-detail', function () {
            const radId = $(this).data('id');
            window.location.href = `case-detail.html?radicado=${radId}`;
        });
    }
    
    
    // VISTA: CASE DETAIL
});