const form = document.getElementById('professionalForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const successBox = document.getElementById('successBox');

// ---------- Real-time Validation ----------
document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', function() {
        validateField(this);
    });
    field.addEventListener('input', function() {
        if (this.classList.contains('error')) validateField(this);
    });
});

function validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return;
    const errorSpan = group.querySelector('.error-msg');
    let isValid = true;

    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
    }
    if (field.type === 'email' && field.value.trim()) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(field.value.trim())) isValid = false;
    }

    group.classList.toggle('error', !isValid);
    group.classList.toggle('success', isValid && field.value.trim() !== '');
    return isValid;
}

// ---------- Form Submit ----------
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate all fields
    let allValid = true;
    document.querySelectorAll('#professionalForm [required]').forEach(f => {
        if (!validateField(f)) allValid = false;
    });
    if (!allValid) return;

    // Collect Data
    const data = {
        name: document.getElementById('fullName').value.trim(),
        email: document.getElementById('emailId').value.trim(),
        phone: document.getElementById('phoneNo').value.trim(),
        company: document.getElementById('companyName').value.trim(),
        source: document.getElementById('hearAbout').value,
        rating: document.querySelector('input[name="rating"]:checked')?.value || 'N/A',
        feedback: document.getElementById('feedbackMsg').value.trim(),
        newsletter: document.getElementById('newsletterToggle').checked
    };

    // Show Loader
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    submitBtn.disabled = true;

    // ---------- SEND TO FORMPREE (Replace with your endpoint) ----------
    fetch('https://formspree.io/f/YOUR_ENDPOINT_HERE', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
    })
    .then(() => {
        // Success
        form.querySelectorAll('.form-group, .submit-btn, .form-header').forEach(el => {
            el.style.display = 'none';
        });
        successBox.style.display = 'block';
    })
    .catch(err => {
        alert('⚠️ Submission failed. Please try again later.');
        console.error(err);
    })
    .finally(() => {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    });
});

// ---------- Reset Form ----------
function resetForm() {
    form.reset();
    successBox.style.display = 'none';
    document.querySelectorAll('.form-group, .submit-btn, .form-header').forEach(el => {
        el.style.display = '';
    });
    document.querySelectorAll('.form-group').forEach(g => {
        g.classList.remove('success', 'error');
    });
}