import express from 'express';

import cors from 'cors';



// const host = process.env.HOST ?? 'localhost';

const app = express();

app.use(cors({
    origin : ['http://localhost:3000'],
    allowedHeaders :['Content-Type', 'Authorization'],
    credentials : true
  }
));

const port = process.env.PORT ? Number(process.env.PORT) : 6001;

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}/api`);
});

server.on('error', (error) => {
    console.error("Server Error:  ",error);
});
