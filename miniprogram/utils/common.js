var common={
  guid:function(){
    return Number(Math.random().toString().substr(3,3) + Date.now()).toString(36);
  },
  gHz(path){
    var pathlen = path.lastIndexOf(".")
    return path.substring(pathlen)    
  }
}

module.exports = common