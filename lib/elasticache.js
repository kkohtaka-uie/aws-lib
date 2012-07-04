
exports.init = function(genericAWSClient) {
  // Creates an ElastiCache API client
  var createElastiCacheClient = function (accessKeyId, secretAccessKey, options) {
    options = options || {};

    var client = elastiCacheClient({
      host: options.host || "elasticache.us-east-1.amazonaws.com",
      path: options.path || "/",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      secure: options.secure,
      version: options.version
    });
    return client;
  }
  // Amazon ElastiCache API handler which is wrapped around the genericAWSClient
  var elastiCacheClient = function(obj) {
    var aws = genericAWSClient({
      host: obj.host, path: obj.path, accessKeyId: obj.accessKeyId,
      secretAccessKey: obj.secretAccessKey, secure: obj.secure
    });
    obj.call = function(action, query, callback) {
      query["Action"] = action
      query["Version"] = obj.version || '2012-03-09'
      query["SignatureMethod"] = "HmacSHA256"
      query["SignatureVersion"] = "2"
      return aws.call(action, query, callback);
    }
    return obj;
  }
  return createElastiCacheClient;
}
