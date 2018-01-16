/***
* Skill.js
***/

function Skill(config)
{
	AnimationObject.call(this, config);
	
	this.bounding = Circle.prototype.makeCircle();
	
	this.name = "Skill_base";
	this.id = "Skill_base";
	this.maxLevel = 5;
	this.level = 0;
	this.damage = 1;
	//The direction and the bounding box need be modified
	this.direction = Direction.NONE;
	this.speed = 1;
	this.doubleDamageRate = 0;
	//response times to the millisecond
	this.lifeTime = 500;
	
	this.released = false;
	
	this.mapReference = this;//这里需要修改
}

Skill.prototype = new AnimationObject();
Skill.prototype.constructor = Skill;

Skill.prototype.getBoundingBox = function()
{
	var halfEdge = bounding.radius / Math.SQRT2;
	
	var left = bounding.center.x - halfEdge;
	var top = bounding.center.y - halfEdge;
	return new Rect(left, top, halfEdge * 2, halfEdge * 2);
}

Skill.prototype.getCenter = function()
{
	return bounding.center;
}

Skill.prototype.getRadius = function()
{
	return bounding.radius;
}


Skill.prototype.testHit = function(object)
{
	if (GameMap.isValidMapObject(object))
	{
		var box = object.getBoundingBox();
		
		return this.bounding.intersects(box) && !this.bounding.contains(box);
	}
	else
	{
		return false;
	}
}

Skill.prototype.onHit = function(object) {
	
	//技能击中物体动画
	
	return true;
}


function Skill_Melee(config)
{
	Skill.call(this, config);
	
	this.name = "Skill_Melee";
	this.id = "Skill_Melee";
	this.bounding = Circle.prototype.makeCircle();
	
	this.maxLevel = 5;
	this.level = 0;
	this.damage = 1;
	//The direction and the bounding box need be modified
	this.direction = Direction.NONE;
	this.speed = 1;
	this.doubleDamageRate = 0;
	//response times to the millisecond
	this.lifeTime = 200;
	
	this.released = false;
	this.mapReference = this;//这里需要修改
	
	this.time = 1;
}
// inheritance
Skill_Melee.prototype = Object.create(Skill.prototype);  
// child.prototype = new parent();
Skill_Melee.prototype.constructor = Skill_Melee;  

Skill.prototype.testHit = function(object)
{
	if (GameMap.isValidMapObject(object))
	{
		var box = object.getBoundingBox();
		
		return this.bounding.intersects(box) && !this.bounding.contains(box);
	}
	else
	{
		return false;
	}
}

//只调用一次，如果未击中则消失
Skill_Melee.prototype.release = function() 
{
	
	//说明上一个技能的生命周期结束，开始下一个
	if(this.lifeTime<=0) {
		//技能生命周期结束动画
		GameMap.removeObject(this, 5);
		this.released = false;
		this.lifeTime = 200;
		this.bounding = new circle(this.mapReference.bounding.center,this.radius);
	}
	
	if(!this.released) {
		
		//技能物体加进来
		GameMap.addObject(this, 5);
		var sqrt2_2 = 0.7071067811865475;
		switch (this.direction) {
			case Direction.NONE: this.skillDirection = new Point(0,0);break;
		
			case Direction.NORTH: this.skillDirection = new Point(1,0);break;
			case Direction.EAST: this.skillDirection = new Point(0,1);break;
			case Direction.SOUTH: this.skillDirection = new Point(-1,0);break;
			case Direction.WEST: this.skillDirection = new Point(0,-1);break;
		
			case Direction.NORTHEAST: this.skillDirection = new Point(sqrt2_2,sqrt2_2);break;
			case Direction.SOUTHEAST: this.skillDirection = new Point(sqrt2_2,-sqrt2_2);break;
			case Direction.NORTHWEST: this.skillDirection = new Point(-sqrt2_2,sqrt2_2);break;
			case Direction.SOUTHWEST: this.skillDirection = new Point(-sqrt2_2,-sqrt2_2);break;
		
			default : this.skillDirection = new Point(0,0);break;
		}
		this.released = true;
	}
	//冷冻时间
	this.lifeTime--;
	
}
  
// rewrite function
Skill_Melee.prototype.toNextLevel = function()
{
    if (this.level<this.maxLevel)
	{
		this.level = this.level + 1;
		
		//Update the properties of the level
		this.damage = this.damage + 0.3;
		//
		//this.speed = 0x7ffffff;
		
		this.doubleDamageRate = this.level*0.05;
		//this.freezingTime = this.freezingTime-this.level*100;
	}
	else
	{
		//Whether reminding users

	}
}

function Skill_Ranged(config)
{
	Skill.call(this, config);
	
	this.name = "Skill_Ranged";
	this.id = "Skill_Ranged";
	this.bounding = Circle.prototype.makeCircle();
	
	this.maxLevel = 5;
	this.level = 0;
	this.damage = 1.5;
	//The direction and the bounding box need be modified
	this.direction = Direction.NONE;
	this.speed = 20/1000;
	this.doubleDamageRate = 0;
	//response times to the millisecond
	this.lifeTime = 500;
	
	this.released = false;
	this.mapReference = this;//这里需要修改
	
	this.time = 1;
}
// inheritance
Skill_Ranged.prototype = Object.create(Skill.prototype);  
// child.prototype = new parent();
Skill_Ranged.prototype.constructor = Skill_Ranged;  
  

Skill_Ranged.prototype.testHit = function(object)
{
	if (GameMap.isValidMapObject(object))
	{
		var box = object.getBoundingBox();
		
		return this.bounding.intersects(box) && !this.bounding.contains(box);
	}
	else
	{
		return false;
	}
}

Skill_Ranged.prototype.onHit = function(object) {
	
	//技能击中物体动画
	
	return true;
}

Skill_Ranged.prototype.release = function() 
{
	//说明上一个技能的生命周期结束，开始下一个
	if(this.lifeTime<=0) {
		
		//技能生命周期结束动画
		GameMap.removeObject(this, 5);
		this.released = false;
		this.lifeTime = 500;
		this.bounding = new circle(this.mapReference.bounding.center,this.radius);
	}

	
	if(!this.released) {
		
		//技能物体加进来
		GameMap.addObject(this, 5);
		var sqrt2_2 = 0.7071067811865475;
		switch (this.direction) {
			case Direction.NONE: this.skillDirection = new Point(0,0);break;
		
			case Direction.NORTH: this.skillDirection = new Point(1,0);break;
			case Direction.EAST: this.skillDirection = new Point(0,1);break;
			case Direction.SOUTH: this.skillDirection = new Point(-1,0);break;
			case Direction.WEST: this.skillDirection = new Point(0,-1);break;
		
			case Direction.NORTHEAST: this.skillDirection = new Point(sqrt2_2,sqrt2_2);break;
			case Direction.SOUTHEAST: this.skillDirection = new Point(sqrt2_2,-sqrt2_2);break;
			case Direction.NORTHWEST: this.skillDirection = new Point(-sqrt2_2,sqrt2_2);break;
			case Direction.SOUTHWEST: this.skillDirection = new Point(-sqrt2_2,-sqrt2_2);break;
		
			default : this.skillDirection = new Point(0,0);break;
		}
		this.released = true;
	}
	
	
	
	

	//Firing skills along a certain direction.
	var centerPoint = this.getCenter();
	var radius = this.getRadius();
	
	
	var newPoint = new Point(skillDirection.x*this.speed+centerPoint.x,
							skillDirection.y*this.speed+centerPoint.y);
	
	//更新技能位置信息
	var newBounding = new Circle(newPoint, radius);
	
	this.bounding = newBounding;
	
	this.lifeTime = this.lifeTime-1;
}



Skill_Ranged.prototype.toNextLevel = function() 
{
	if (this.level<this.maxLevel)
	{
		//Update the window data: Property entries
		this.level = this.level + 1;
		//Update the properties of the level
		this.damage = this.damage + 0.3;
		this.speed = 0.5;
		this.doubleDamageRate = this.level*0.05;
	}
	else
	{
		//Whether reminding users
		
		
	}
}
//大招伤害高，但是速度慢？
function Skill_Ultimate(config)
{
	Skill.call(this, config);
	
	this.name = "Skill_Ultimate";
	this.id = "Skill_Ultimate";
	this.bounding = Circle.prototype.makeCircle();
	
	this.maxLevel = 5;
	this.level = 0;
	this.damage = 1.5;
	//The direction and the bounding box need be modified
	this.direction = Direction.NONE;
	this.speed = 20/1000;
	this.doubleDamageRate = 0;
	//response times to the millisecond
	this.lifeTime = 1000;
	
	this.released = false;
	this.mapReference = this;//这里需要修改

}
// inheritance
Skill_Ultimate.prototype = Object.create(Skill.prototype);  
// child.prototype = new parent();
Skill_Ultimate.prototype.constructor = Skill_Ultimate;  


Skill_Ultimate.prototype.release = function() 
{
	
	if(this.lifeTime<=0) {
		//技能生命周期结束动画
		GameMap.removeObject(this, 5);
		this.released = false;
		this.lifeTime = 1000;
		this.bounding = new circle(this.mapReference.bounding.center,this.radius);
	}

	
	if(!this.released) {
		
		//技能物体加进来
		GameMap.addObject(this, 5);
		var sqrt2_2 = 0.7071067811865475;
		switch (this.direction) {
			case Direction.NONE: this.skillDirection = new Point(0,0);break;
		
			case Direction.NORTH: this.skillDirection = new Point(1,0);break;
			case Direction.EAST: this.skillDirection = new Point(0,1);break;
			case Direction.SOUTH: this.skillDirection = new Point(-1,0);break;
			case Direction.WEST: this.skillDirection = new Point(0,-1);break;
		
			case Direction.NORTHEAST: this.skillDirection = new Point(sqrt2_2,sqrt2_2);break;
			case Direction.SOUTHEAST: this.skillDirection = new Point(sqrt2_2,-sqrt2_2);break;
			case Direction.NORTHWEST: this.skillDirection = new Point(-sqrt2_2,sqrt2_2);break;
			case Direction.SOUTHWEST: this.skillDirection = new Point(-sqrt2_2,-sqrt2_2);break;
		
			default : this.skillDirection = new Point(0,0);break;
		}
		this.released = true;
	}
	
	
	
	this.lifeTime = this.lifeTime-1;
	
	//Firing skills along a certain direction.
	var centerPoint = this.getCenter();
	var radius = this.getRadius();
	
	
	var newPoint = new Point(skillDirection.x*this.speed+centerPoint.x,
							skillDirection.y*this.speed+centerPoint.y);
	
	//更新技能位置信息
	var newBounding = new Circle(newPoint, radius);
	
	this.bounding = newBounding;
}
  

Skill_Ultimate.prototype.toNextLevel = function()
{
    if (this.level<this.maxLevel)
	{
		this.level = this.level + 1;
		
		//Update the properties of the level
		this.damage = this.damage + 0.3;
		//
		this.speed = 20/1000;
		this.doubleDamageRate = this.level*0.15;
		//this.freezingTime = this.freezingTime-this.level*100;
	}
	else
	{
		//Whether reminding users
		
	}
}













