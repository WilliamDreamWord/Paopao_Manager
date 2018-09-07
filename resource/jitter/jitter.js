/**
 * 抖动效果
 * @param {*} obj 控件ID
 * @param {*} time time震动时间长
 * @param {*} wh wh震动幅度px
 * @param {*} fx fx动画速度
 */
function flash(obj,time,wh,fx)
{ 
	$(function(){
	var $panel = $(obj);
	var offset = $panel.offset()-$panel.width();
	var x= offset.left;
	var y= offset.top;
	for(var i=1; i<=time; i++){
		if(i%2==0)
		{
			$panel.animate({left:'+'+wh+'px'},fx);
		}else
		{
			$panel.animate({left:'-'+wh+'px'},fx);
		}
			
	}
	$panel.animate({left:0},fx);
	$panel.offset({ top: y, left: x });
		
	})
}