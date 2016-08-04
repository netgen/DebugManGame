function playSound(name) {
	var obj = $("#" + name + ".mp3");

	if (!obj) {
		obj = document.createElement("audio");
		obj.setAttribute("id", name);
		obj.src = "assets/sound/" + name + ".mp3";
		obj.autoPlay = false;
		obj.preLoad = true;
		$("body").append(obj.innerHTML);
	}

	obj = $("#" + name + ".mp3");
	console.log(obj);
	obj[0].play();
}