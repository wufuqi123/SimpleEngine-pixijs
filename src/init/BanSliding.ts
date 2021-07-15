document.documentElement.style.overflow = "hidden";
document.body.style.overflow = "hidden";

var move = function (e:any) {
  e.preventDefault && e.preventDefault();
  e.returnValue = false;
  e.stopPropagation && e.stopPropagation();
  return false;
};
var keyFunc = function (e:any) {
  if (37 <= e.keyCode && e.keyCode <= 40) {
    return move(e);
  }
};
document.body.onkeydown = keyFunc;