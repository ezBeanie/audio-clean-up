const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });
dotenv.config({ path: '../.env.local', override: true });

const app = express();
const router = express.Router();
const PORT = process.env.SERVER_PORT || 8080;
const ALLOWED_AUDIO_TYPES = ['.wav', '.mp3', '.flac', '.aac', '.ogg', '.m4a'];
const ALLOWED_VIDEO_TYPES = ['.mp4', '.mov', '.mkv', '.avi'];
const ALLOWED_FILE_TYPES = [...ALLOWED_AUDIO_TYPES, ...ALLOWED_VIDEO_TYPES];

const processingQueue = [];
let separationRunning = false;

// Setup Multer for audio uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use('/api', router);

router.post('/separate-audios', upload.array('files[]'), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No video or audio files uploaded under files[] field.' });
  }

  for (const file of req.files) {
    try {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!ALLOWED_FILE_TYPES.includes(ext)) {
        fs.unlinkSync(file.path);
        return res
          .status(400)
          .json({ error: `${file.originalname} is not a supported audio file.` });
      }

      enqueueFileForProcessing(file, ALLOWED_AUDIO_TYPES.includes(ext));
    } catch (error) {
      console.error('Error processing file:', file.originalname, error);
      return res.status(500).json({ error: `Error processing file: ${file.originalname}` });
    }
  }

  res.status(200).json({ message: 'Files uploaded. Processing started.' });
});

function enqueueFileForProcessing(file, isAudio = false) {
  console.log('➕ Enqueuing file for processing:', file.originalname);
  processingQueue.push(file);
  if (!separationRunning) processQueue();
}

// Background processor loop
async function processQueue() {
  if (processingQueue.length === 0) return;
  separationRunning = true;

  const file = processingQueue.shift();
  console.log('📁 Processing next file:', file.originalname);

  try {
    const outputDir = await runDemucs(file);

    console.log('✅ Separation completed for:', file.originalname, outputDir);
  } catch (error) {
    console.error('❌ Error during separation for:', file.originalname, error);
  } finally {
    // Process next file in queue
    await processQueue();
  }

  if (processingQueue.length === 0) {
    separationRunning = false;
  }
}

async function runDemucs(inputFile, extraArgs = []) {
  const venvPython = path.join(__dirname, '..', '.venv', 'Scripts', 'python.exe');
  const args = [
    '-m',
    'demucs',
    '-n',
    'htdemucs_ft',
    '--two-stems=vocals',
    '--mp3',
    inputFile.path,
    ...extraArgs
  ];

  return new Promise((resolve, reject) => {
    const proc = spawn(venvPython, args);

    proc.stdout.on('data', (data) => {
      console.log(`[demucs] ${data}`);
    });

    proc.stderr.on('data', (data) => {
      console.error(`[demucs error] ${data}`);
    });

    proc.on('close', (code) => {
      if (code === 0) {
        // Demucs always puts outputs under "separated/<model>/<filename>/"
        const outputDir = path.join(__dirname, '..', 'separated');
        resolve(outputDir);
      } else {
        reject(new Error(`Demucs exited with code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
