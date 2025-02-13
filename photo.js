// Function to handle file upload
function uploadFile(cardType) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const card = document.getElementById(`${cardType}-card`);

            // Check if a message already exists and remove it
            const existingMessage = card.querySelector('.submitted-message');
            if (existingMessage) {
                card.removeChild(existingMessage);
            }

            // Add a submission message
            const message = document.createElement('p');
            message.className = 'submitted-message';
            message.textContent = 'Your picture is submitted.';
            message.style.color = 'green';
            message.style.marginTop = '10px';
            message.style.fontWeight = 'bold';

            card.appendChild(message);
        }
    };
    fileInput.click();
}

// Function to validate images and handle submit
function submitImages() {
    const requiredCards = ['nid-card', 'user-pic-card', 'doc-card', 'extra1-card'];
    let allImagesUploaded = true;

    requiredCards.forEach(cardId => {
        const card = document.getElementById(cardId);
        if (!card.querySelector('.submitted-message')) {
            allImagesUploaded = false;
        }
    });

    if (allImagesUploaded) {
        alert('All images uploaded successfully!');
    } else {
        alert('You must add images to all cards before submitting.');
    }
}
