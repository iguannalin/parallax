window.addEventListener("load", () => {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  const container = document.getElementById("container");
  let prev = {x:0,y:0};
  let delta = {x:0, y:0};
  const oracles = [];

  // scale/map function from -- https://stackoverflow.com/a/23202637
  function scale (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  let int = 2;

  window.onmousemove = (c) => {
    if (c.x < prev.x) {
      // moved left, move shadows right
      delta.x = int;
    } else {
      // moved right
      delta.x = -int;
    }
    if (c.y < prev.y) {
      // moved up, move shadows down
      delta.y = -int;
    } else {
      // moved down
      delta.y = int;
    }
    prev = {x:c.x, y:c.y};
    fixShadows();
  }

  function fixShadows() {
    // filter: invert(0.9) drop-shadow(55px 73px 3px fuchsia);
    // -webkit-filter: invert(0.9) drop-shadow(55px 73px 3px fuchsia);
    oracles.forEach((o) => {
      let filter = "invert(0.9) drop-shadow(fuchsia 0px 0px 3px)";
      if (o.style.filter) {
        let posse = o.style.filter.split("drop-shadow(fuchsia ")[1].split("px ");
        filter = `invert(0.9) drop-shadow(fuchsia ${+posse[0]+delta.x}px ${+posse[1]+delta.y}px 3px)`;
        // console.log(+posse[0]);
      }
      o.style.filter = filter;
    });
  }

  let links = [];
  // svgs from -- https://commons.wikimedia.org/w/index.php?search=oracle.svg&title=Special:MediaSearch&go=Go&type=image
  fetch("https://annaylin.com/100-days/oracles/links.json").then((r)=>r.json()).then((d)=>{
    links = d;
    for (let i = 0; i < getRandomInt(4,6); i++) {
      fetch(links[getRandomInt(0,links.length)]).then((d)=>d.blob()).then((r)=>{
        const a = document.createElement('a');
        const img = document.createElement('img');
        img.src = URL.createObjectURL(r);
        oracles.push(img);
        fixShadows();
        a.appendChild(img)
        a.href = ".";
        container.appendChild(a);
      })
    }
  });
});