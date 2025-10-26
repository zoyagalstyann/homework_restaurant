import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const toggleBtns = document.querySelectorAll('.toggle-btn');
const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const successMessage = document.getElementById('successMessage');
const successText = document.getElementById('successText');

toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const formType = btn.getAttribute('data-form');

    toggleBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (formType === 'signin') {
      signinForm.classList.add('active');
      signupForm.classList.remove('active');
    } else {
      signupForm.classList.add('active');
      signinForm.classList.remove('active');
    }

    successMessage.style.display = 'none';
    clearErrors();
  });
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const submitBtn = loginForm.querySelector('button[type="submit"]');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    successText.textContent = 'Successfully signed in! Redirecting...';
    successMessage.style.display = 'block';
    loginForm.style.display = 'none';

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);

  } catch (error) {
    showError('loginEmailError', error.message);
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const submitBtn = registerForm.querySelector('button[type="submit"]');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  const formData = {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    address: document.getElementById('address').value.trim(),
    city: document.getElementById('city').value.trim(),
    birthDate: document.getElementById('birthDate').value || null,
    password: document.getElementById('password').value,
    confirmPassword: document.getElementById('confirmPassword').value,
    newsletter: document.getElementById('newsletter').checked,
    terms: document.getElementById('terms').checked
  };

  if (!validateForm(formData)) {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    return;
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password
    });

    if (authError) throw authError;

    const { error: profileError } = await supabase
      .from('customers')
      .insert([{
        id: authData.user.id,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        birth_date: formData.birthDate,
        newsletter: formData.newsletter
      }]);

    if (profileError) throw profileError;

    successText.textContent = 'Registration successful! You can now sign in with your credentials.';
    successMessage.style.display = 'block';
    registerForm.reset();
    registerForm.style.display = 'none';

    setTimeout(() => {
      toggleBtns[0].click();
      registerForm.style.display = 'block';
    }, 2000);

  } catch (error) {
    showError('emailError', error.message);
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

function validateForm(formData) {
  let isValid = true;

  if (formData.firstName.length < 2) {
    showError('firstNameError', 'First name must be at least 2 characters');
    isValid = false;
  }

  if (formData.lastName.length < 2) {
    showError('lastNameError', 'Last name must be at least 2 characters');
    isValid = false;
  }

  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(formData.phone) || formData.phone.length < 8) {
    showError('phoneError', 'Please enter a valid phone number');
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    showError('emailError', 'Please enter a valid email address');
    isValid = false;
  }

  if (formData.address.length < 5) {
    showError('addressError', 'Please enter a complete address');
    isValid = false;
  }

  if (formData.city.length < 2) {
    showError('cityError', 'Please enter a valid city name');
    isValid = false;
  }

  if (formData.password.length < 6) {
    showError('passwordError', 'Password must be at least 6 characters');
    isValid = false;
  }

  if (formData.password !== formData.confirmPassword) {
    showError('confirmPasswordError', 'Passwords do not match');
    isValid = false;
  }

  if (!formData.terms) {
    showError('termsError', 'You must agree to the Terms of Service');
    isValid = false;
  }

  return isValid;
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    const formGroup = errorElement.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('error');
    }
  }
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
  document.querySelectorAll('.form-group').forEach(el => {
    el.classList.remove('error');
  });
}

window.addEventListener('load', async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    window.location.href = 'index.html';
  }
});
