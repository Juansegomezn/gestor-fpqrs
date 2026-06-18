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
    if ($('#case-inbox').length > 0) {
      
    }
});