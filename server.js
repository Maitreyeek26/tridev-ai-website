const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'change-me';
const DB = path.join(__dirname, 'data', 'inquiries.json');

app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const services = [
  { icon: '🖼️', title: '2D Image Annotation', text: 'Bounding boxes, polygons, keypoints and semantic segmentation for computer vision models.' },
  { icon: '🏷️', title: 'Data Labeling', text: 'Text, audio, video and image classification and tagging with multi-stage QA.' },
  { icon: '🧠', title: 'AI Model Support', text: 'Dataset curation, validation and edge-case review to improve model performance.' },
  { icon: '💻', title: 'Website Development', text: 'Fast, responsive, secure websites and web apps built end to end.' },
  { icon: '⚙️', title: 'Custom Software', text: 'APIs, dashboards and automation tools tailored to your workflow.' },
  { icon: '📊', title: 'Data Processing', text: 'Cleaning, structuring and converting data into training-ready formats.' }
];
const projects = [
  { id: 1, cat: 'annotation', title: 'Autonomous Driving Dataset', text: '120,000 street images annotated with boxes and polygons.', result: '99.9% accuracy' },
  { id: 2, cat: 'annotation', title: 'Retail Shelf Recognition', text: 'Product detection labels across 800+ SKUs.', result: 'Delivered 2 days early' },
  { id: 3, cat: 'web', title: 'E-commerce Platform', text: 'Full-stack store with payments and admin dashboard.', result: '+65% conversions' },
  { id: 4, cat: 'web', title: 'Healthcare Booking Portal', text: 'Secure appointment system for a multi-clinic network.', result: 'Live in 3 weeks' },
  { id: 5, cat: 'ai', title: 'Medical Imaging Labels', text: 'Pixel-level segmentation reviewed by trained specialists.', result: '100% QA pass' },
  { id: 6, cat: 'ai', title: 'Chatbot Training Data', text: '500k conversation turns labeled for intent and sentiment.', result: 'On-time delivery' }
];

app.get('/api/services', (req, res) => res.json(services));
app.get('/api/projects', (req, res) => res.json(projects));

app.post('/api/contact', (req, res) => {
  const { name, email, service, message } = req.body || {};
  if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ ok: false, error: 'Please fill in name, a valid email and a message.' });
  let list = [];
  try { list = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch (e) {}
  list.push({ id: Date.now(), name: String(name).slice(0, 100), email: String(email).slice(0, 150),
    service: String(service || '').slice(0, 100), message: String(message).slice(0, 2000), date: new Date().toISOString() });
  fs.writeFileSync(DB, JSON.stringify(list, null, 2));
  res.json({ ok: true });
});

app.get('/api/inquiries', (req, res) => {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });
  try { res.json(JSON.parse(fs.readFileSync(DB, 'utf8'))); } catch (e) { res.json([]); }
});

app.listen(PORT, () => console.log(`Site running at http://localhost:${PORT}`));
