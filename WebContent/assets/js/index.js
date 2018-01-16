// JavaScript Document

function $(id)
{
	return document.getElementById(id);
}

function startGame(event)
{
	window.location.href = "main.html";
}

window.onload = function(event)
{
	$("start").onclick = startGame;
}