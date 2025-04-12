document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    const nameInput = contactForm.querySelector('input[placeholder="Ваше имя"]');
    const emailInput = contactForm.querySelector('input[placeholder="Ваш адрес электронной почты"]');
    const messageInput = contactForm.querySelector('textarea');

    // Загрузка сохраненных данных из localStorage
    const loadSavedData = () => {
        const savedData = JSON.parse(localStorage.getItem('contactFormData') || '{}');
        nameInput.value = savedData.name || '';
        emailInput.value = savedData.email || '';
        messageInput.value = savedData.message || '';
    };

    // Сохранение данных в localStorage
    const saveFormData = () => {
        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value
        };
        localStorage.setItem('contactFormData', JSON.stringify(formData));
    };

    // Валидация email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Валидация формы
    const validateForm = () => {
        let isValid = true;
        let errorMessage = '';

        if (!nameInput.value.trim()) {
            errorMessage = 'Пожалуйста, введите ваше имя';
            isValid = false;
        } else if (!emailInput.value.trim()) {
            errorMessage = 'Пожалуйста, введите ваш email';
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            errorMessage = 'Пожалуйста, введите корректный email';
            isValid = false;
        } else if (!messageInput.value.trim()) {
            errorMessage = 'Пожалуйста, введите ваше сообщение';
            isValid = false;
        }

        if (!isValid) {
            alert(errorMessage);
        }

        return isValid;
    };

    // Обработка отправки формы
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm()) {
            // Здесь можно добавить логику отправки данных на сервер
            alert('Сообщение успешно отправлено!');
            
            // Очистка формы и localStorage
            contactForm.reset();
            localStorage.removeItem('contactFormData');
        }
    });

    // Сохранение данных при вводе
    nameInput.addEventListener('input', saveFormData);
    emailInput.addEventListener('input', saveFormData);
    messageInput.addEventListener('input', saveFormData);

    // Загрузка сохраненных данных при загрузке страницы
    loadSavedData();
});