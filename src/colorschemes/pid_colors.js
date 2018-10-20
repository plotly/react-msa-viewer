const pid = {};

// calculating the conservation is expensive 
// we only want to do it once
pid.init = function(){
  this.cons = this.opt.conservation();
}

pid.run = function(letter,opts){
  var cons = this.cons[opts.pos];
  if(cons > 0.8){
    return "#6464ff";
  }else if(cons > 0.6){
    return "#9da5ff";
  }else if(cons > 0.4){
    return "#cccccc";
  }else{
    return "#ffffff";
  }
}

export default pid;
