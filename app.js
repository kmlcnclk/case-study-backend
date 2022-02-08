const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const mainRouter = require('./routers/mainRouter');
const customErrorHandler = require('./errors/customErrorHandler');
const connectDatabase = require('./databases/connectDatabase');

dotenv.config({});

connectDatabase();

const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(mainRouter);
app.use('*', (req, res) => {
  return res.status(404).send(
    `<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;flex-direction:column;">
      <h2 style="color:#333;font-family:sans-serif;">
        <strong>
          &#128550;
        </strong>
      </h2>
      <h2 style="color:#333;font-family:sans-serif;">
        <strong>
          404 Not Found
        </strong>
      </h2>
      </div>`
  );
});

app.use(customErrorHandler);

app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}/`));
