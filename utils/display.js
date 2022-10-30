
var sdss_image_address = "https://skyserver.sdss.org/dr16/SkyServerWS/ImgCutout/getjpeg?TaskName=Skyserver.Explore.Image"

function radialProgress(selector) {
  const parent = d3.select(selector);
  const size = parent.node().getBoundingClientRect();
  const svg = parent
    .append("svg")
    .attr("width", size.width)
    .attr("height", size.height);
  const outerRadius = Math.min(size.width, size.height) * 0.45;
  const thickness = 10;
  let value = 0;

  const mainArc = d3
    .arc()
    .startAngle(0)
    .endAngle(Math.PI * 2)
    .innerRadius(outerRadius - thickness)
    .outerRadius(outerRadius);

  svg
    .append("path")
    .attr("class", "progress-bar-bg")
    .attr("transform", `translate(${size.width / 2},${size.height / 2})`)
    .attr("d", mainArc());

  const mainArcPath = svg
    .append("path")
    .attr("class", "progress-bar")
    .attr("transform", `translate(${size.width / 2},${size.height / 2})`);

  svg
    .append("circle")
    .attr("class", "progress-bar")
    .attr(
      "transform",
      `translate(${size.width / 2},${
        size.height / 2 - outerRadius + thickness / 2
      })`
    )
    .attr("width", thickness)
    .attr("height", thickness)
    .attr("r", thickness / 2);

  const end = svg
    .append("circle")
    .attr("class", "progress-bar")
    .attr(
      "transform",
      `translate(${size.width / 2},${
        size.height / 2 - outerRadius + thickness / 2
      })`
    )
    .attr("width", thickness)
    .attr("height", thickness)
    .attr("r", thickness / 2);

  let percentLabel = svg
    .append("text")
    .attr("class", "progress-label")
    .attr("transform", `translate(${size.width / 2},${size.height / 2})`)
    .text("0");

  return {
    update: function (progressPercent) {
      const startValue = value;
      const startAngle = (Math.PI * startValue) / 50;
      const angleDiff = (Math.PI * progressPercent) / 50 - startAngle;
      const startAngleDeg = (startAngle / Math.PI) * 180;
      const angleDiffDeg = (angleDiff / Math.PI) * 180;
      const transitionDuration = 1500;

      mainArcPath
        .transition()
        .duration(transitionDuration)
        .attrTween("d", function () {
          return function (t) {
            mainArc.endAngle(startAngle + angleDiff * t);
            return mainArc();
          };
        });
      end
        .transition()
        .duration(transitionDuration)
        .attrTween("transform", function () {
          return function (t) {
            return (
              `translate(${size.width / 2},${size.height / 2})` +
              `rotate(${startAngleDeg + angleDiffDeg * t})` +
              `translate(0,-${outerRadius - thickness / 2})`
            );
          };
        });
      percentLabel
        .transition()
        .duration(transitionDuration)
        .tween("bla", function () {
          return function (t) {
            percentLabel.text(
              Math.round(startValue + (progressPercent - startValue) * t)
            );
          };
        });
      value = progressPercent;
    },
  };
}


function appendImages(similar_galaxies, container_name) {
    for (var i = 0; i < similar_galaxies.length; i++) {
        ra = similar_galaxies[i]["ra"]
        dec = similar_galaxies[i]["dec"]
        sdss_explorer_address = `https://skyserver.sdss.org/dr16/en/tools/explore/summary.aspx?ra=${ra}&dec=${dec}`
        sdss_path = sdss_image_address + `&ra=${ra}&dec=${dec}` + "&width=256&height=256"

        var a = document.createElement('a');
        var img = document.createElement("img");
        img.src = sdss_path;
        img.width = 64;
        img.height = 64;
        a.href=sdss_explorer_address
        a.target="_blank"
        a.appendChild(img)
        document.getElementById(container_name).appendChild(a)
    }
}

function changeFormValueAndSubmit(ra, dec){
    document.getElementById("ra").value = ra
    document.getElementById("dec").value = dec
    document.getElementById('submit_button').click();

}

function clean(){
    var imagecontainer = document.getElementById("imagecontainer");
    imagecontainer.innerHTML = ""
}

function setText(text){
    var explanation = document.getElementById("explanation");
    if (text === ""){
        explanation.innerHTML = ""
    } else {
        explanation.innerHTML = `<div class="loader">${text}<span class="loader__dot">.</span><span class="loader__dot">.</span><span class="loader__dot">.</span></div>`;
    }
}

function setWidget(display){
    var widget = document.getElementById("widget");
    widget.style.visibility = display
}