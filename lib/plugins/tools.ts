function hexFormat(str: string) {
  if (str.length > 6) {
    throw Error("wrong hex");
  } else {
    let add = "";
    for (let i = str.length; i < 6; i++) {
      add += "0";
    }
    return "#" + add + str;
  }
}

function rgb2hex(rgbArr: any) {
  return parseInt(
    rgbArr[0].toString(16) + rgbArr[1].toString(16) + rgbArr[2].toString(16),
    16
  );
}
