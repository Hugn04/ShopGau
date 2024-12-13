const express = require('express');
const connect = require('./app/config/DB');
const webRouter = require('./routers/web');
const { engine } = require('express-handlebars');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
path.join(__dirname, 'resources/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
    }),
);
app.engine(
    'handlebars',
    engine({
        //extname: '.hbs',
        helpers: {
            isGreaterThan: function (value, threshold, options) {
                if (value > threshold) {
                    return options.fn(this); // nếu value > threshold, chạy phần code trong {{#isGreaterThan}}.
                } else {
                    return options.inverse(this); // nếu không, chạy phần code trong {{else}}
                }
            },
            for: function (from, to, block) {
                let accum = '';
                for (let i = from; i < to; i++) {
                    accum += block.fn(i);
                }
                return accum;
            },
            discount: function (price, seller) {
                const value = price - (seller / 100) * price;
                return value.toLocaleString(2);
            },
            money: function (price, amount) {
                const value = price * amount;

                return value.toLocaleString(2);
            },
            indexPlusOne: function (index) {
                return index + 1;
            },
            isEmpty: function (value, options) {
                if (value) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },
            isEqual: (a, b) => a === b,
            getAccount: function (example) {},
        },
    }),
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'resources/views'));

app.use(webRouter);

async function start() {
    try {
        await connect();
        app.listen(port, () => {
            console.log(`Server start in http://localhost:${port}/`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();
