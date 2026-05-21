<template>
  <div fixed top-10 bottom-0 right-0 pointer-events-none class="-z-1">
    <svg viewBox="-200 -150 400 300">
      <defs>
        <line id="ray" x1="-5" x2="5"></line>
        <clipPath id="cp">
          <rect x="-200" y="-150" width="400" height="150"></rect>
        </clipPath>
      </defs>
      <line id="line" x1="-76" x2="76"></line>
      <text text-anchor="middle" y="45">开心每一天</text>
      <g id="sun" clip-path="url(#cp)">
        <g id="mover">
          <circle id="main" r="50"></circle>
          <g id="eyes">
            <circle r="3" cx="-13"></circle>
            <circle r="3" cx="13"></circle>
          </g>
          <g id="rays">
            <use xlink:href="#ray" transform="rotate(315) translate(70)"></use>
            <use xlink:href="#ray" transform="rotate(270) translate(70)"></use>
            <use xlink:href="#ray" transform="rotate(225) translate(70)"></use>
            <use xlink:href="#ray" transform="rotate(180) translate(70)"></use>
            <use xlink:href="#ray" transform="rotate(135) translate(70)"></use>
            <use xlink:href="#ray" transform="rotate(90) translate(70)"></use>
            <use xlink:href="#ray" transform="rotate(45) translate(70)"></use>
            <use xlink:href="#ray" transform="rotate(0) translate(70)"></use>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
* {
	stroke: #765d20;
	stroke-linecap: round;
	vector-effect: non-scaling-stroke;
}
svg {
	width: 400px;
  height: 300px;
}
text {
	font: .875em century gothic, verdana, sans-serif;
}
#mover {
  animation: sun-motion 5s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite;
}
#main {
  fill: transparent;
	stroke-width: 7;
}
#eyes {
  animation: eye-motion 5s ease-out infinite;
}
#eyes circle { 
  fill: #765d20; 
}
#ray {
  stroke-width: 4;
}
#rays {
  animation: rot 5s linear infinite;
}
@keyframes rot {
	to { 
    transform: rotate(.25turn); 
  }
}
@keyframes eye-motion {
	0%, 20%, 49%, 100% { transform: translate(-13px); }
	21%, 25%, 29%, 47% { transform: translate(13px) scaleY(1); }
	27% { transform: translate(13px) scaleY(0); }
	48% { transform: translate(0); }
}
@keyframes sun-motion {
	0%, 99%, 100% { transform: translateY(-16px); }
	50% { transform: translateY(-29px); }
	52%, 98% { transform: translate(4px) scaleY(1.25); }
	53%, 97% { transform: translateY(23px); }
}
</style>
