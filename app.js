var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require("express-handlebars");
var i18n = require("i18n");
var index = require('./routes/index');
var confRouter = require("./routes/conf");
var GridService = require("./public/javascripts/grids");
var Configuration = require("./public/javascripts/configuration");
var Contract = require("./public/javascripts/contract");
var Earth = require("./public/javascripts/Earth");
var config = require("./config/config.json");

const app = express();
// init log
const log4js = require('log4js');
log4js.configure({
    appenders: {
        appLogs: {
            type: 'file',
            filename: 'logs/app.log',
            pattern: '.yyyy-MM-dd',
            compress: true
        },
        reqLogs: {
            type: 'file',
            filename: 'logs/req.log',
            pattern: '.yyyy-MM-dd',
            compress: true
        },
        console: {
            type: 'console'
        }
    },
    categories: {
        req: {
            appenders: [
                'console',
                'reqLogs'
            ],
            level: 'trace'
        },
        default: {
            appenders: [
                'console',
                'appLogs'
            ],
            level: 'trace'
        }
    }
});
var logger = log4js.getLogger();

/*
app.use(log4js.connectLogger(log4js.getLogger('req'), {
    level: 'info'
}));*/

//the number doesn't mean anything
//var gridServ = new GridService(10);
//app.set("grid", gridServ);

var configuration = new Configuration();
app.set("configuration", configuration);

if (!config.hasOwnProperty("network")) {
    //TODO: log
    //default use ropsten
    config.network = "3";
}

var networkMap = {
    "1": "mainnet",
    "3": "ropsten"
};

if(!config.hasOwnProperty("network")){
    logger.error("network id not found in config");
    process.exit(-1);
}

if(!networkMap.hasOwnProperty(config.network)){
    logger.error(`network id ${config.network} is not supported`);
    process.exit(-1);
}

if(!Earth.contractAddrs.hasOwnProperty(config.network)){
    logger.error(`the contract is not deployed in network ${config.network}`);
    process.exit(-1);
}

var Web3 = require("web3");
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(`https://${networkMap[config.network]}.infura.io/vAugb8H4cG1bOuFMZj3y`));
var contract = web3.eth.contract(Earth.abi);
var ins = contract.at(Earth.contractAddrs[config.network]);
var delegate = new Contract(ins);
logger.info(`connect to network ${networkMap[config.network]}, contract address is ${Earth.contractAddrs[config.network]}`);

delegate.fee((err, fee) => {
    if(err){
        logger.error(`fail to get contract tx fee, contract init failed, ${err}`);
        process.exit(-1);
    } else {
        logger.info(`current contract tx fee is ${fee}`);
    }
});

app.set("contract", delegate);

//var web3 = new Web3(new Web3.providers.HttpProvider("https://" + networkMap[config.network] + ".infura.io/vAugb8H4cG1bOuFMZj3y"));

if (Earth.contractAddrs.hasOwnProperty(config.network)) {
    var contractAddr = Earth.contractAddrs[config.network];
    var contractAbi = Earth.abi;
    //var ins = new web3.eth.Contract(contractAbi, contractAddr);
} else {
    //TODO: error
    console.log("network not suppored");
    process.exit(-1);
}
//app.set("web3", web3);

i18n.configure({
    locales: ['en', 'ch'],
    defaultLocale: "ch",
    cookie: 'locale',
    directory: __dirname + '/public/locales'
});

// view engine setup
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        t: function (word) {
            return this.__(word);
        },
        l: function () {
            return this.locale;
        }
    }
}));

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(i18n.init);

app.use("/conf", confRouter);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err.toString());
});

module.exports = app;
