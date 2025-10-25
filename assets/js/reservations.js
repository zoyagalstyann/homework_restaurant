// Reservations page functionality
class ReservationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setMinDate();
    }

    setupEventListeners() {
        const reservationForm = document.getElementById('reservationForm');
        if (reservationForm) {
            reservationForm.addEventListener('submit', (e) => this.submitReservation(e));
            
            // Real-time validation
            const inputs = reservationForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        }
    }

    setMinDate() {
        const dateInput = document.getElementById('reservationDate');
        if (dateInput) {
            const today = new Date();
            const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
            dateInput.min = tomorrow.toISOString().split('T')[0];
        }
    }

    validateField(field) {
        const errorElement = document.getElementById(field.name + 'Error');
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearError(field);

        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            errorMessage = 'Այս դաշտը պարտադիր է';
            isValid = false;
        }

        // Specific field validations
        switch (field.type) {
            case 'email':
                if (field.value && !this.isValidEmail(field.value)) {
                    errorMessage = 'Մուտքագրեք ճիշտ էլ․հասցե';
                    isValid = false;
                }
                break;

            case 'tel':
                if (field.value && !this.isValidPhone(field.value)) {
                    errorMessage = 'Մուտքագրեք ճիշտ հեռախոսի համար';
                    isValid = false;
                }
                break;

            case 'date':
                if (field.value) {
                    const selectedDate = new Date(field.value);
                    const today = new Date();
                    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
                    
                    if (selectedDate < tomorrow) {
                        errorMessage = 'Reservations are only possible from tomorrow onwards';
                        isValid = false;
                    }
                }
                break;

            case 'time':
                if (field.value) {
                    const [hours, minutes] = field.value.split(':').map(Number);
                    const timeInMinutes = hours * 60 + minutes;
                    const openTime = 11 * 60; // 11:00
                    const closeTime = 23 * 60; // 23:00
                    
                    if (timeInMinutes < openTime || timeInMinutes > closeTime) {
                        errorMessage = 'Restaurant is open from 11:00 AM to 11:00 PM';
                        isValid = false;
                    }
                }
                break;
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        }

        return isValid;
    }

    showError(field, message) {
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
        }
        field.parentElement.classList.add('error');
    }

    clearError(field) {
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.parentElement.classList.remove('error');
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async submitReservation(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        // Validate form
        if (!this.validateForm(form)) {
            app.showNotification('Please correct the errors and try again', 'error');
            return;
        }

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            const formData = new FormData(form);
            const reservationData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                city: formData.get('city') || null,
                reservationDate: formData.get('reservationDate'),
                reservationTime: formData.get('reservationTime'),
                guestCount: parseInt(formData.get('guestCount')),
                tableNumber: parseInt(formData.get('tableNumber')),
                specialRequests: formData.get('specialRequests') || null,
                status: 'pending'
            };

            await app.apiRequest('/reservations', {
                method: 'POST',
                body: JSON.stringify(reservationData)
            });

            // Show success message
            form.style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            
            app.showNotification('Reservation made successfully!');

        } catch (error) {
            console.error('Reservation submission failed:', error);
            app.showNotification('Reservation failed. Please try again', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Armenian phone number validation (simplified)
        const phoneRegex = /^(\+374|0)[0-9]{8}$/;
        return phoneRegex.test(phone.replace(/[\s-]/g, ''));
    }
}

// Initialize reservation manager
const reservationManager = new ReservationManager();