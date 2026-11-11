// Countdown 
// const countdownDate = new Date("2026-09-10T23:59:59").getTime();

// const interval = setInterval(() => {
//     const now = new Date().getTime();
//     const distance = countdownDate - now;

//     // Quando acabar o tempo
//     if (distance <= 0) {
//         clearInterval(interval);

//         document.getElementById("days").innerText = "00";
//         document.getElementById("hours").innerText = "00";
//         document.getElementById("minutes").innerText = "00";
//         document.getElementById("seconds").innerText = "00";

//         return;
//     }

//     const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
//     const minutes = Math.floor((distance / (1000 * 60)) % 60);
//     const seconds = Math.floor((distance / 1000) % 60);

//     document.getElementById("days").innerText = String(days).padStart(2, '0');
//     document.getElementById("hours").innerText = String(hours).padStart(2, '0');
//     document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
//     document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');

// }, 1000);