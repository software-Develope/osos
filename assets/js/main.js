document.addEventListener('DOMContentLoaded', () => {
    // Bottom Navigation Logic
    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                // Scrolling down & past header
                bottomNav.classList.add('hidden');
            } else {
                // Scrolling up
                bottomNav.classList.remove('hidden');
            }
            lastScrollY = window.scrollY;
        });
    }

    // Counter Animation Logic
    const counters = document.querySelectorAll('.counter');
    
    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    
                    // Increment speed (higher divisor = slower)
                    const inc = target / 50;
                    
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter); // Animate only once
            }
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, {
        threshold: 0.5 
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Cards Entrance Animation
    const cards = document.querySelectorAll('.card');
    
    const animateCards = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const index = Array.from(cards).indexOf(card);
                
                setTimeout(() => {
                    card.classList.remove('hidden-card');
                }, index * 400); // 400ms stagger delay
                
                observer.unobserve(card);
            }
        });
    };
    
    const cardObserver = new IntersectionObserver(animateCards, {
        threshold: 0.2
    });
    
    cards.forEach(card => {
        card.classList.add('hidden-card');
        cardObserver.observe(card);
    });
});
