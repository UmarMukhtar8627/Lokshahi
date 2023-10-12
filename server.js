const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
const serviceAccount = require('./loginuserdata-c634a-firebase-adminsdk-5j3yq-fa55e6622c.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

app.use(bodyParser.json());

// Middleware to verify Firebase ID tokens
const verifyFirebaseToken = async (req, res, next) => {
  const idToken = req.header('Authorization');

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Protected route example
app.get('/api/protected', verifyFirebaseToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
