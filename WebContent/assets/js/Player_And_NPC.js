
/***
* Player.js
***/

function Player(config)
{
	Character.call(this, config);

	this.experience = 0;
	this.maxExperience = 10;
	this.skills[0] = new Skill_Melee(config);
	this.skills[1] = new Skill_Ranged(config);
	this.skills[2] = new Skill_Ultimate(config);
	this.skills[0].mapReference = this;
	this.skills[1].mapReference = this;
	this.skills[2].mapReference = this;
	
	this.lastBounding = this.bounding;
}

Player.prototype = new Character();
Player.prototype.constructor = Player;

Player.prototype.onHit = function(object) {
	
	if(object instanceof Skill) {
	
		if(object.mapReference instanceof Player) {
			
			//技能消失，伤害不变
			return false;
		}
		//敌军伤害
		else {
			var damage = object.damage;
			if(Math.random()<=object.doubleDamageRate) {
				damage = 2*damage;
			}
			this.HP = this.HP-damage;
			if(this.HP<=0) {
				//自己阵亡
				GameMap.removeObjcet(this, 5);
				
				//跳转失败画面
				return true;
			}
			else {
				//受伤画面？
				return false;
			}
		}
	}
	//非技能，敌人或墙体
	else {
		//恢复原来位置，不再向前移动
		this.bounding = this.lastBounding;
		return false;
	}
	
}




//如果经验值达到一定值，则进入下一层，同时更新其相应的技能
Player.prototype.toNextLevel = function() 
{
	
	if(this.experience>=this.maxExperience) {
		
		this.experience = this.experience - this.maxExperience;
		this.HP = this.maxHP;
		this.MP = this.maxMP;
		this.speed = this.speed+10;
		for(var i=0;i<this.skills.length;i++) {		
			this.skills[i].toNextLevel();
		}
	}
}

Player.prototype.takeDamage = function(damage)
{
	Character.prototype.takeDamage(damage);
}

Player.prototype.onDefeated = function()
{
	//出现失败画面
	
	return;

}

Player.prototype.makeSpeech = function()
{
	
}

//
Player.prototype.turn = function(dir)
{
	direction = dir;
}

Player.prototype.stepForward = function()
{
	//接收键盘事件
	var dir = Direction.NONE;
	this.turn(dir);
	var sqrt2_2 = 0.7071067811865475;
	var dirvector = new Point(0,0);
	switch (this.direction) {
		case Direction.NONE: dirvector = new Point(0,0);break;
	
		case Direction.NORTH: dirvector = new Point(1,0);break;
		case Direction.EAST: dirvector = new Point(0,1);break;
		case Direction.SOUTH: dirvector = new Point(-1,0);break;
		case Direction.WEST: dirvector = new Point(0,-1);break;
	
		case Direction.NORTHEAST: dirvector = new Point(sqrt2_2,sqrt2_2);break;
		case Direction.SOUTHEAST: dirvector = new Point(sqrt2_2,-sqrt2_2);break;
		case Direction.NORTHWEST: dirvector = new Point(-sqrt2_2,sqrt2_2);break;
		case Direction.SOUTHWEST: dirvector = new Point(-sqrt2_2,-sqrt2_2);break;
	
		default : dirvector = new Point(0,0);break;
	}
	var centerPoint = this.bounding.center;
	var newPoint = new Point(centerPoint.x+this.speed*dirvector.x,centerPoint.y+this.speed*dirvector.y);
	
	this.lastBounding = this.bounding;
	this.bounding = new circle(newPoint, this.bounding.radius);
	
}

Player.prototype.releaseSkill = function(number)
{
	switch(number) {
		
		case 0: this.skills[0].release();break;
		case 1:	this.skills[1].release();break;
		case 2: this.skills[2].release();break;
		
		
	}
}


// end of Player.js


/***
* NPC.js
***/

function NPC(config)
{
	Character.call(this, config);
}

NPC.prototype = new Character()
NPC.prototype.constructor = NPC;

NPC.prototype.takeDamage = function(damage)
{

}

NPC.prototype.makeSpeech = function()
{
	//
}

// end of NPC.js