function convertToStarArray(stars){
  var array=[];
  for(var i=1;i<=5;i++){
    if(i<=stars){
      array.push(1);
    }
    else{
      array.push(0);
    }
  }
  return array;
}
module.exports=({
  convertToStarArray: convertToStarArray
})