document.addEventListener("DOMContentLoaded", function() {
    const mobileIcon = document.getElementById("bar");
    const navbar = document.getElementById("navbar");
    
    mobileIcon.addEventListener("click", function() {
        navbar.classList.toggle("show");
    });
});
