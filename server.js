const app = require('./app'); // Import the app instance
const dotenv = require('dotenv'); // Import dotenv for environment variables

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 3000; // Use port from environment variable or default to 3000



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
