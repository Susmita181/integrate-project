const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
const app = express();
require('dotenv').config();

let gfs;
const conn = mongoose.connection;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    console.log('Mongoose connection state:', mongoose.connection.readyState);
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

conn.once('open', () => {
    console.log('Connected to MongoDB Atlas successfully');
    // Initialize GridFS
    try {
        gfs = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'uploads'
        });
        console.log('GridFS initialized');
    } catch (error) {
        console.error('GridFS initialization error:', error);
    }
});

conn.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
// Create GridFS storage engine
const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const filename = Date.now() + path.extname(file.originalname);
        // Save to local filesystem
        const localPath = path.join(__dirname, 'uploads', filename);
        file.stream.pipe(fs.createWriteStream(localPath));
        
        return {
            filename: filename,
            bucketName: 'uploads',
            metadata: {
                type: req.body.type,
                uploadDate: new Date(),
                localPath: localPath
            }
        };
    }
});

// Add this at the top of your file with other requires
const fs = require('fs');

// Add this to serve uploaded files statically
app.use('/uploads', express.static('uploads'));
const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use('/views', express.static('views'));

// Add this middleware at the top after your other middleware
// Add '/front' to the public routes list and modify the root route
// Modify the middleware section
app.use((req, res, next) => {
    const publicRoutes = [
        '/',          // Add root path
        '/front',
        '/login', 
        '/signup',
        '/services',  // Make sure this is added
        '/option',    // Add this line
        '/joblist',    // Add this line
        '/js/firebase-config.js',
        '/css/style.css',
        'https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js',
        'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js'
    ];
    
    if (publicRoutes.includes(req.path) || req.path.startsWith('/css/') || req.path.startsWith('/js/')) {
        return next();
    }

    if (req.path === '/dashboard') {
        return res.redirect('/login');
    }

    next();
});

// Move these routes before the middleware
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'front.html'));
});

app.get('/front', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'front.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login page.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});
app.get('/option', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'option.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/manual', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'manual.html'));
});
app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'services.html'));
});

// Add this new route for joblist
app.get('/joblist', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'joblist.html'));
});
// Add these new routes
app.get('/travel', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'travel.html'));
});

app.get('/hospital', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'hospital.html'));
});
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        
        console.log('Uploaded file details:', {
            id: req.file.id,
            filename: req.file.filename,
            contentType: req.file.contentType,
            size: req.file.size,
            metadata: req.file.metadata
        });
        
        res.json({ 
            success: true, 
            fileId: req.file.id,
            filename: req.file.filename,
            contentType: req.file.contentType,
            size: req.file.size,
            metadata: req.file.metadata,
            viewUrl: `/image/${req.file.filename}`,
            downloadUrl: `/download/${req.file.filename}`
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all files
app.get('/images', async (req, res) => {
    try {
        const files = await conn.db.collection('uploads.files').find().toArray();
        res.json(files);
    } catch (error) {
        console.error('Error getting files:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get a single file
app.get('/image/:filename', async (req, res) => {
    try {
        const file = await conn.db.collection('uploads.files').findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const readStream = gfs.openDownloadStreamByName(file.filename);
        readStream.pipe(res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add a download route
app.get('/download/:filename', async (req, res) => {
    try {
        const file = await conn.db.collection('uploads.files').findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
        
        const readStream = gfs.openDownloadStreamByName(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add this to check connection status
app.get('/check-connection', async (req, res) => {
    try {
        const collections = await conn.db.listCollections().toArray();
        console.log('Available collections:', collections);
        res.json({ 
            connected: mongoose.connection.readyState === 1,
            collections: collections
        });
    } catch (error) {
        console.error('Check connection error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add a simple viewer route
app.get('/viewer', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Image Viewer</title>
                <style>
                    .image-container { margin: 20px; }
                    img { max-width: 300px; margin: 10px; }
                </style>
            </head>
            <body>
                <div id="images" class="image-container"></div>
                <script>
                    fetch('/images')
                        .then(res => res.json())
                        .then(files => {
                            const container = document.getElementById('images');
                            files.forEach(file => {
                                const img = document.createElement('img');
                                img.src = '/image/' + file.filename;
                                container.appendChild(img);
                            });
                        });
                </script>
            </body>
        </html>
    `);
});

// Modify the submit route
app.post('/submit', async (req, res) => {
    try {
        res.json({ 
            success: true, 
            message: 'Information collected successfully!'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit'
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
        app.listen(PORT + 1);
    } else {
        console.error('Server error:', err);
    }
});