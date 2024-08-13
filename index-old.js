const express = require('express');

const app = express();
app.use(express.raw());
app.use(express.static(`${__dirname}/public/`));
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
    const myRowData = 'Hello';
    response.render('index', {
        myRowData,
    });
});

app.listen(3000, () => {
    console.log('Listening port 3000');
});
