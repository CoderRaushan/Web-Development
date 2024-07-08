document.getElementById('confetti-button').addEventListener('click', () => {
    // Trigger confetti
    confetti({
        particleCount: 150,
        spread: 60,
    });

    // Show the congratulatory message
    const congratsMessage = document.getElementById('congrats-message');
    congratsMessage.classList.add('show');

    // Remove the message after a while
    setTimeout(() => {
        congratsMessage.classList.remove('show');
    }, 3000); // The message will be visible for 3 seconds
});
