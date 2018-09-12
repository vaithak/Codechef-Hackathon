function random(min,max){
  return min + Math.floor(Math.random() * (max-min));
}

module.exports = random;
