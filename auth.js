// Authentication and session management for the Member Portal
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const authContainer = document.getElementById('auth-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');
    const signupConfirmPassword = document.getElementById('signup-confirm-password');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const logoutBtn = document.getElementById('logout-btn');
    const authMessage = document.getElementById('auth-message');
    const userEmailDisplay = document.getElementById('user-email-display');

    // Helper functions
    function showMessage(text, type) {
        if (!authMessage) return;
        authMessage.textContent = text;
        authMessage.className = `auth-message ${type}`;
        authMessage.style.display = 'block';
    }

    function clearMessage() {
        if (!authMessage) return;
        authMessage.style.display = 'none';
        authMessage.textContent = '';
        authMessage.className = 'auth-message';
    }

    // Toggle to Signup Form
    if (showSignup && signupForm && loginForm) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            clearMessage();
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        });
    }

    // Toggle to Login Form
    if (showLogin && signupForm && loginForm) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            clearMessage();
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }

    // Sign Up Handler
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearMessage();

            const email = signupEmail.value.trim();
            const password = signupPassword.value;
            const confirmPassword = signupConfirmPassword.value;

            if (password !== confirmPassword) {
                showMessage('Passwords do not match.', 'error');
                return;
            }

            try {
                const { data, error } = await window.supabase.auth.signUp({
                    email: email,
                    password: password
                });

                if (error) throw error;

                if (data?.session) {
                    showMessage('Registration successful!', 'success');
                } else {
                    showMessage('Registration successful! Please check your email to confirm your account.', 'success');
                    signupForm.reset();
                }
            } catch (err) {
                showMessage(err.message || 'An error occurred during sign up.', 'error');
            }
        });
    }

    // Login Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearMessage();

            const email = loginEmail.value.trim();
            const password = loginPassword.value;

            try {
                const { data, error } = await window.supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) throw error;

                showMessage('Login successful!', 'success');
            } catch (err) {
                showMessage(err.message || 'Invalid email or password.', 'error');
            }
        });
    }

    // Logout Handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const { error } = await window.supabase.auth.signOut();
                if (error) throw error;
            } catch (err) {
                console.error('Error signing out:', err.message);
            }
        });
    }

    // Persist Session & Manage UI States
    if (window.supabase) {
        window.supabase.auth.onAuthStateChange((event, session) => {
            const user = session?.user;
            if (user) {
                // Logged in
                if (authContainer) authContainer.style.display = 'none';
                if (dashboardContainer) dashboardContainer.style.display = 'block';
                if (userEmailDisplay) userEmailDisplay.textContent = user.email;
            } else {
                // Logged out
                if (dashboardContainer) dashboardContainer.style.display = 'none';
                if (authContainer) authContainer.style.display = 'block';
                if (loginForm) loginForm.style.display = 'block';
                if (signupForm) signupForm.style.display = 'none';
                clearMessage();
            }
        });
    } else {
        console.error('Supabase client was not initialized.');
    }
});
