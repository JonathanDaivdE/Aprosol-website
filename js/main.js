document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdownParents = document.querySelectorAll('.has-dropdown');

    // Toggle dropdown on click (≤1024px)
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            if (window.innerWidth <= 1024) {
                event.preventDefault();
                const parentLi = toggle.closest('.has-dropdown');
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

                // Close all other open dropdowns
                dropdownParents.forEach(li => {
                    if (li !== parentLi) {
                        li.classList.remove('is-open');
                        li.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current dropdown
                parentLi.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', !isExpanded);
            }
        });
    });

    // Close dropdown when clicking outside (only once)
    document.addEventListener('click', function(event) {
        dropdownParents.forEach(parentLi => {
            if (!parentLi.contains(event.target)) {
                parentLi.classList.remove('is-open');
                parentLi.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Hamburger menu toggle (unchanged)
    const hamburger = document.querySelector('.hamburger');
    const mainMenu = document.querySelector('.main-menu');
    hamburger.addEventListener('click', function() {
        const isMenuOpen = mainMenu.classList.toggle('is-open');
        hamburger.setAttribute('aria-expanded', isMenuOpen);
        document.body.classList.toggle('no-scroll', isMenuOpen);

        // Close all dropdowns when menu closes
        if (!isMenuOpen) {
            dropdownParents.forEach(openDropdown => {
                openDropdown.classList.remove('is-open');
                openDropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Responsive menu close on resize (unchanged)
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    function handleMobileMenu(e) {
        if (!e.matches && mainMenu.classList.contains('is-open')) {
            mainMenu.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        }
    }
    mediaQuery.addEventListener('change', handleMobileMenu);

    // Career form resume validation
    const careerForm = document.querySelector('.career-form');
    const resumeInput = document.getElementById('resume');
    const resumeError = document.getElementById('resume-error');
    const MAX_BYTES = 4 * 1024 * 1024; // 4MB

    function showResumeError(msg) {
        resumeError.textContent = msg;
        resumeError.style.display = msg ? 'block' : 'none';
    }

    if (resumeInput) {
        resumeInput.addEventListener('change', function () {
            const file = resumeInput.files[0];
            if (!file) {
                showResumeError('');
                return;
            }
            if (file.size > MAX_BYTES) {
                showResumeError('File is too large. Maximum allowed size is 4 MB.');
                resumeInput.value = ''; // clear selection
            } else {
                showResumeError('');
            }
        });
    }

    if (careerForm) {
        careerForm.addEventListener('submit', function (e) {
            const file = resumeInput && resumeInput.files[0];
            if (file && file.size > MAX_BYTES) {
                e.preventDefault();
                showResumeError('File is too large. Maximum allowed size is 4 MB.');
                resumeInput.focus();
            }
            // optionally check required file presence here
        });
    }

    // Back to top button (auto-inserted on all pages that load main.js)
    (function() {
        // avoid duplicate if script runs multiple times
        if (document.getElementById('back-to-top')) return;

        const btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.type = 'button';
        btn.title = 'Back to top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = '&#8679;'; // up arrow
        document.body.appendChild(btn);

        const toggle = () => {
            if (window.scrollY > 300) btn.classList.add('visible');
            else btn.classList.remove('visible');
        };

        // show/hide on scroll
        window.addEventListener('scroll', toggle, { passive: true });
        // initial state
        toggle();

        // click and keyboard activation
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    })();
});