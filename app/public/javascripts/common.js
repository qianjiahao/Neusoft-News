window.onload = function(){
	
	loadbar();
	// scrollTop();

}

function scrollTop(){
	var topBtn = document.getElementById('backtotop');
	var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
	var timer = null;
	var isTop = true;

	window.onscroll = function(){
		var osTop = document.documentElement.scrollTop || document.body.scrollTop;
		if(osTop >= clientHeight){
			topBtn.style.display = 'block';
		}else{
			topBtn.style.display = 'none';
		}
		if(!isTop){
			clearTimeout(timer);
		}
		isTop = false;	
	}

	topBtn.onclick = function(){
		timer = setInterval(function(){
			var osTop = document.documentElement.scrollTop || document.body.scrollTop;
			var isSpeed = Math.floor(-osTop / 6);
			isTop = true;

			document.documentElement.scrollTop  =  document.body.scrollTop = osTop + isSpeed ;

			if(osTop == 0){
				clearTimeout(timer);
			}
		},15);
		
	}
}


function loadbar(){
	var bar  = document.getElementById('loadbar');
	var box = document.getElementById('loadbox');
	var timer;
	var width= 0;
	var speed = 0;
	var sum = document.body.scrollWidth + 10;

	timer = setInterval(function(){
		if(width >= sum){
			clearTimeout(timer);
			setTimeout(function(){
				bar.style.display = 'none';
			},300);
		} 
		bar.style.width = width + 'px';
		speed = Math.ceil((sum - width)/13);
		width = width + speed;
	},3);

}

