var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-type, Accept, x-token, X-Key");
      if (req.method == 'OPTIONS') {
        res.status(200).end();
    
    } else {
        next();
    }
});
router.post('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-type, Accept, x-token, X-Key");
        if (req.method == 'OPTIONS') {
          res.status(200).end();
      
      } else {
          next();
      }
  });

module.exports = router;
