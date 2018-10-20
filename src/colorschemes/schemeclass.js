export const StaticSchemeClass = function(map){
  this.defaultColor = "#ffffff";
  this.type = "static";
  this.map = map;
  this.getColor = function(letter){
    if(this.map[letter] !== undefined){
      return this.map[letter]; 
    }else{
      return this.defaultColor;
    }
  };
};

export const DynSchemeClass = function(fun,opt){
  this.type = "dyn";
  this.opt = opt;
  // init
  if(fun.init !== undefined){
    fun.init.call(this);
    this.getColor = fun.run;
    this.reset = fun.init;
  }else{
    this.getColor = fun;
  }
};
