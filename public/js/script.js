document.addEventListener('DOMContentLoaded', function() {
    const fileInputs = ['nid', 'passport', 'document', 'additional'];
    const uploadedFiles = {};

    fileInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('type', inputId);

                try {
                    const response = await fetch('/upload', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    if (data.success) {
                        uploadedFiles[inputId] = data.fileId;
                        const status = input.parentElement.querySelector('.status');
                        status.textContent = 'Image uploaded successfully!';
                    }
                } catch (error) {
                    console.error('Upload failed:', error);
                }
            }
        });
    });

    document.getElementById('submit-btn').addEventListener('click', function() {
        if (Object.keys(uploadedFiles).length === 4) {
            alert('Information collected successfully!');
            location.reload();
        } else {
            alert('Please upload all required images first!');
        }
    });
}); 