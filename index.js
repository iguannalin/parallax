window.addEventListener("load", () => {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
  let os = 100;
  let square = 100;
  let wx = 0;
  let wy = 0;
  const container = document.getElementById("container");
  let time = 2000;
  let prev = {x:0,y:0};
  let delta = {x:0, y:0};
  const shadows = [];

  // get window position code from -- https://stackoverflow.com/a/17980638
  function get_window_x_pos()
  {
    let winx;
    if(window.screenX)
        winx=window.screenX;
    else if(window.screenLeft)
        winx=window.screenLeft;
    return winx;
  }
  function get_window_y_pos()
  {
    let winy;
    if(window.screenY)
        winy=window.screenY;
    else if(window.screenTop)
        winy=window.screenTop;
    return winy;
  }

  wx = get_window_x_pos();
  wy = get_window_y_pos();

  // setInterval(() => {
  //   let x = get_window_x_pos();
  //   let y = get_window_y_pos();
  //   wx = x; wy = y;
  //   if (x != wx || y != wy) console.log("x moved"); 
  // }, 100);

  // scale/map function from -- https://stackoverflow.com/a/23202637
  function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }
  
  function createWindow(index) {
    const text = `<!DOCTYPE html><html> <head> <title>keep</title> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"><style>body {background-color: rgb(35, 35, 35); margin-top: 25vh; text-align: center; font-size: 36px;}</style></head> <body><div id="container">${index == 0 ? "🕐" : "🪞"}</div><script>setTimeout(window.close, ${time});</script></body></html>`;
    const blob = new Blob([text], {type: "text/html"});
    const blobUrl = URL.createObjectURL(blob);
    const wLeft = wx + getRandomInt(-os, window.innerWidth+os);
    const wTop = wy + getRandomInt(-os, window.innerHeight+os);
    window.open(blobUrl, '_blank', `popup,width=100,height=100,left=${wLeft},top=${wTop}`);
    window.URL.revokeObjectURL(blobUrl);

    const span = document.createElement("span");
    span.className = "shadow";
    span.style.width = square+'px';
    span.style.height = square+'px';
    let sT = scale(wTop, 0, screen.height, 0, window.innerHeight) + "px";
    let sL = scale(wLeft, 0, screen.width, 0, window.innerWidth) + "px";
    console.log({sT, sL});
    span.style.top = sT;
    span.style.left = sL;
    shadows.push(span);
    container.appendChild(span);
  }

  function moveShadows() {
    shadows.forEach((s) => {
      s.style.left = +(s.style.left.split("px")[0]) + delta.x + "px";
      s.style.top = +(s.style.top.split("px")[0]) + delta.y + "px";
    })
  }

  window.onmousemove = (c) => {
    if (c.x < prev.x) {
      // moved left, move shadows right
      delta.x = 1;
    } else {
      // moved right
      delta.x = -1;
    }
    if (c.y < prev.y) {
      // moved up, move shadows down
      delta.y = -1;
    } else {
      // moved down
      delta.y = 1;
    }
    prev = {x:c.x, y:c.y};
    moveShadows();
  }

  
  // setInterval(() => {
  //   for (let i = 0; i < 2; i++) createWindow(i);
  // }, time+500);
});