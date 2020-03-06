  var AWS = require('aws-sdk');
  AWS.config.loadFromPath('./config.json');

  var db = new AWS.DynamoDB();

  function keyvaluestore(table) {
    this.LRU = require("lru-cache");
    this.cache = new this.LRU({ max: 500 });
    this.tableName = table;
  };

  /**
   * Initialize the tables
   * 
   */
  keyvaluestore.prototype.init = function(whendone) {
    
    var tableName = this.tableName;
    var self = this;
    
    whendone(); //Call Callback function.
  };

  /**
   * Get result(s) by key
   * 
   * @param search
   * 
   * Callback returns a list of objects with keys "inx" and "value"
   */
  
keyvaluestore.prototype.get = function(search, callback) {
    var self = this;
    
    if (self.cache.get(search))
          callback(null, self.cache.get(search));
    else {
        
      /*
       * 
       * La función QUERY debe generar un arreglo de objetos JSON con cada
       * una de los resultados obtenidos. (inx, value, key).
       * Al final este arreglo debe ser insertado al cache. Y llamar a callback
       * 
       * Ejemplo:
       *    var items = [];
       *    items.push({"inx": data.Items[0].inx.N, "value": data.Items[0].value.S, "key": data.Items[0].key});
       *    self.cache.set(search, items)
       *    callback(err, items);
       */

      if(this.tableName == 'images') {
        let params = {
          TableName: this.tableName,
          ProjectionExpression: '#murl, #keyw',
          KeyConditionExpression: '#keyw = :key',
          ExpressionAttributeNames: {
            '#keyw': 'keyword',
            '#murl': 'url'
          },
          ExpressionAttributeValues:{
            ":key" : {S: search}
          }   
        };

        db.query(params, (err, data) => {
          if(err) {
            console.log(err);
          } else {
            let items = [];
            data.Items.forEach(item => {
              items.push({
                "keyword": item.keyword
                ,"url": item.url.S
              });
            });
            self.cache.set(search,items);
            callback(null,items);
            };
          }
        );
      } else if (this.tableName == 'labels') {        
        var params = {
          TableName: this.tableName,
          ProjectionExpression: 'inx, #cat, #keyw',
          KeyConditionExpression: '#keyw = :key',
          ExpressionAttributeNames: {
            '#keyw': 'keyword',
            '#cat': 'category'
          },
          ExpressionAttributeValues:{
            ":key" : {S: search}
          }
        };

        db.query(params, (err, data) => {
          if(err) {
            console.log(err);
          } else {
            let items = [];
            data.Items.forEach(item => {
              items.push({
                "keyword": item.keyword
                ,"inx": item.inx.N
                ,"category": item.category.S
              });
            });
            self.cache.set(search,items);
            callback(null,items);
            };
          }
        );
      }
    }
  };


  module.exports = keyvaluestore;
