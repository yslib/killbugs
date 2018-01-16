/***
* Enemy.js
***/

function Enemy(config)
{
	Character.call(this, config);
	this.lifecycle = 20;
	this.currentDirection = Direction.NONE;
	this.responseDistance = 50;
	
	this.directionVector = null;
	this.possibleDirection = new Array(4);
	this.player = null;
	this.time = 5;
}

Enemy.prototype = new Character();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.takeDamage = function(damage)
{
	Character.prototype.takeDamage(damage);
}

Enemy.prototype.testHit = function(object)
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

Enemy.prototype.onHit = function(object) {
	
	if(object instanceof Skill) {
		
		//判断技能是否为敌军

		
		if(object.mapReference instanceof Enemy) {
			
			//敌军自己打到自己，技能消失，血量不变
			return false;
		}
		
		var damage = object.damage;
		if(Math.random()<=object.doubleDamageRate) {
			damage = 2*damage;
		}
		this.HP = this.HP-damage;
		if(this.HP<=0) {
			//敌军阵亡
			GameMap.removeObjcet(this, 5);
			return true;
		}
		else {
			return false;
		}
	}
	//碰到非技能物体例如player和墙壁，就向其他方向运动
	else {

		var objectBounding = object.bounding;
		
		//都是圆形吗
		
		//恢复到原来位置
			
		var enemyPoint = this.bounding.center;
		var playerPoint = player.bounding.center;
		
		var enemyDirection = this.directionVector;
	
		var axis = 0;
		if(abs(enemyDirection.x)<abs(enemyDirection.y)) axis = 1;
		if(enemyDirection.x<0) {
			enemyDirection.x = -1;
			
		}
		else if(enemyDirection.x>0) {
			enemyDirection.x=1;
			
		}
		if(enemyDirection.y<0) {
			enemyDirection.y = -1;
			
		}
		else if(enemyDirection.y>0) {
			enemyDirection.y=1;
			
		}
		var newBounding = null;
		if(axis==0)
			newBounding = new Point(enemyPoint.x,enemyPoint.y-enemyDirection.y*this.speed);
		else
			newBounding = new Point(enemyPoint.x-enemyDirection.x*this.speed,enemyPoint.y);
		
		
		//和原来方向相反运动
		switch(this.currentDirection) {
			
			case Direction.WEST: 
				this.currentDirection = Direction.EAST;
				newBounding.x = newBounding.x+this.speed;
				break;
			case Direction.EAST:
				this.currentDirection = Direction.WEST;
				newBounding.x = newBounding.x-this.speed;
				break;
			case Direction.NORTH: 
				this.currentDirection = Direction.SOUTH;
				newBounding.x = newBounding.y-this.speed;
				break;
			case Direction.SOUTH:
				this.currentDirection = Direction.NORTH;
				newBounding.x = newBounding.y+this.speed;
				break;
			
		}
		this.bounding = new Circle(newBounding, this.bounding.radius);
		this.time = 5;
		
		
	}
	
	return false;
}


//敌军的移动，分两种情况探讨，如果在响应距离之内，向player移动。如果在响应距离之外，自由移动。
Enemy.prototype.doNextStep = function(player) {
	
	this.player = player;
	
	var circlePlayer = player.bounding;
	//The two bounding box interect with each other.
	var centerDistance = this.bounding.centerDistanceWith(circlePlayer);
	var surfaceDistance = this.bounding.surfaceDistanceWith(circlePlayer);
	
	
	var enemyPoint = this.bounding.center;
	var playerPoint = player.bounding.center;
	
	if(surfaceDistance<=this.responseDistance) {
		
		this.directionVector = new Point(playerPoint.x-enemyPoint.x, playerPoint.y-enemyPoint.y);
		var enemyDirection = this.directionVector;
		
		var newBounding = new Point(enemyPoint.x,enemyPoint.y);
		
		if(this.time>=0) {
			
			switch(this.currentDirection) {
				
				case Direction.WEST: 
					newBounding.x = newBounding.x-this.speed;
					break;
				case Direction.EAST:
					newBounding.x = newBounding.x+this.speed;
					break;
				case Direction.NORTH: 
					newBounding.x = newBounding.y+this.speed;
					break;
				case Direction.SOUTH:
					newBounding.x = newBounding.y-this.speed;
					break;
				
			}
			this.bounding = new Circle(new Point(enemyPoint.x+enemyDirection.x*this.speed,enemyPoint.y),this.bounding.radius);
			time--;
			return;
		}
		
		
		var axis = 0;
		if(abs(enemyDirection.x)<abs(enemyDirection.y)) axis = 1;
		if(enemyDirection.x<0) {
			enemyDirection.x = -1;
			this.currentDirection = Direction.WEST;
		}
		else if(enemyDirection.x>0) {
			enemyDirection.x=1;
			this.currentDirection = Direction.EAST;
		}
		if(enemyDirection.y<0) {
			enemyDirection.y = -1;
			this.currentDirection = Direction.SOUTH;
		}
		else if(enemyDirection.y>0) {
			enemyDirection.y=1;
			this.currentDirection = Direction.NORTH;
		}
		
		
		//说明两者相交了
		if(surfaceDistance<=0) {
			//避免这种问题的发生
			
			if(axis==0) {
				this.bounding = new Circle(new Point(enemyPoint.x-enemyDirection.x*this.speed,enemyPoint.y),this.bounding.radius);
			}
			
			else {
				this.bounding = new Circle(new Point(enemyPoint.x,enemyPoint.y-enemyDirection.y*this.speed),this.bounding.radius);
			}
			
		}
		else {
			
			
			//确定enemy的移动方向，暂定上下左右
			if(axis==0) {
				
				this.bounding = new Circle(new Point(enemyPoint.x+enemyDirection.x*this.speed,enemyPoint.y),this.bounding.radius);
			}
			else {
				this.bounding = new Circle(new Point(enemyPoint.x,enemyPoint.y+enemyDirection.y*this.speed),this.bounding.radius);			
			}
			
		}
		
	}
	//在响应距离之外，随机移动
	else {
		
		
		var enemyPoint = this.bounding.center;
		var playerPoint = player.bounding.center;
		var newBounding = Circle.prototype.makeCircle();
		var enemyDirection = Point.prototype.makePoint();
		//Init direction
		if(this.direction = Direction.NONE)
		{
			var index = Math.floor(Math.random()*4);
			
			switch(index)
			{
				case 0:enemyDirection.x=1;enemyDirection.y=0;break;
				case 1:enemyDirection.x=0;enemyDirection.y=1;break;
				case 2:enemyDirection.x=-1;enemyDirection.y=0;break;
				case 3:enemyDirection.x=0;enemyDirection.y=-1;break;
			}
			newBounding = new Circle(new Point(enemyPoint.x+enemyDirection.x*this.speed,enemyPoint.y+enemyDirection.y*this.speed),this.bounding.radius);
			
		}
		
		else
		{
			switch(this.direction)
			{
				case Direction.EAST:enemyDirection.x=1;enemyDirection.y=0;break;
				case Direction.NORTH:enemyDirection.x=0;enemyDirection.y=1;break;
				case Direction.WEST:enemyDirection.x=-1;enemyDirection.y=0;break;
				case Direction.SOUTH:enemyDirection.x=0;enemyDirection.y=-1;break;
			}
			newBounding = new Circle(new Point(enemyPoint.x+enemyDirection.x*this.speed,enemyPoint.y+enemyDirection.y*this.speed),this.bounding.radius);
			
		}
		this.bounding = newBounding;
	}

	
	
}




//是否攻击的操作
Enemy.prototype.doNextAction = function(player)
{
	
	
}

function Enemy_Melee(config)
{
	Enemy.call(this, config);
	this.lifecycle = 20;
	this.currentDirection = Direction.NONE;
	this.responseDistance = 60;
	this.skills[0] = new Skill_Melee(config);
	
	this.skills[0].mapReference = this;
	
}
Enemy_Melee.prototype = Object.create(Enemy.prototype);  
Enemy_Melee.prototype.constructor = Enemy_Melee;

// rewrite function
Enemy_Melee.prototype.doNextAction = function(player)
{
	var circlePlayer = player.bounding;
	//The two bounding box interect with each other.
	var centerDistance = this.bounding.centerDistanceWith(circlePlayer);
	var surfaceDistance = this.bounding.surfaceDistanceWith(circlePlayer);
	
	for(var i=0;i<this.skills.length;i++)
	{
		var skill = skills[i];
		if(skill.bounding.radius>=centerDistance)
		{
			//set atack direction
			var enemyPoint = this.bounding.center;
			var circlePoint = circlePlayer.center;
			var x_axis = circlePoint.x-enemyPoint.x;
			var y_axis = circlePoint.y-enemyPoint.y;
			var tempDirection = Direction.NONE;
			if(abs(x_axis)>abs(y_axis)) {
				if(x_axis>0) tempDirection = Direction.EAST;
				else tempDirection = Direction.WEST;
			}
			else
			{
				if(y_axis>0) tempDirection = Direction.NORTH;
				else tempDirection = Direction.SOUTH;
			}
			
			//方向和敌军的移动方向一致？
			//this.skill[i].direction = this.currentDirection;
			this.skill[i].direction = tempDirection;
			
			//Release skill
			this.skill[i].release();
			
			//break;
		}
	}
}


function Enemy_Ranged(config)
{
	Enemy.call(this, config);
	this.lifecycle = 20;
	this.currentDirection = Direction.NONE;
	this.responseDistance = 60;
	this.skills[0] = new Skill_Ranged(config);
	this.skills[0].mapReference = this;
}
Enemy_Ranged.prototype = Object.create(Enemy.prototype);  
Enemy_Ranged.prototype.constructor = Enemy_Ranged;

// rewrite function
Enemy_Ranged.prototype.doNextAction = function(player)
{
	var circlePlayer = player.bounding;
	//The two bounding box interect with each other.
	var centerDistance = this.bounding.centerDistanceWith(circlePlayer);
	var surfaceDistance = this.bounding.surfaceDistanceWith(circlePlayer);
	
	for(var i=0;i<this.skills.length;i++)
	{
		var skill = skills[i];
		if(skill.bounding.radius>=surfaceDistance)
		{
			//set atack direction
			var enemyPoint = this.bounding.center;
			var circlePoint = circlePlayer.center;
			var x_axis = circlePoint.x-enemyPoint.x;
			var y_axis = circlePoint.y-enemyPoint.y;
			var tempDirection = Direction.NONE;
			if(abs(x_axis)>abs(y_axis)) {
				if(x_axis>0) tempDirection = Direction.EAST;
				else tempDirection = Direction.WEST;
			}
			else
			{
				if(y_axis>0) tempDirection = Direction.NORTH;
				else tempDirection = Direction.SOUTH;
			}
			this.skill[i].direction = tempDirection;
			
			//Release skill
			this.skill[i].release();
			//break;
		}
	}
}




// end of Enemy.js


/***
* Boss.js
***/

function Boss(config)
{
	Enemy.call(this, config);
	this.skills[0]= new Skill_Melee(config);
	this.skills[1]= new Skill_Ranged(config);
	this.skills[2]= new Skill_Ultimate(config);
	
	this.skills[0].mapReference = this;
	this.skills[1].mapReference = this;
	this.skills[2].mapReference = this;
	this.HP=1000;
	this.speed = 100;
	this.name = "Dead Line";
}

Boss.prototype = new Enemy();
Boss.prototype.constructor = Boss;


//是否重新实现boss的自动移动

Boss.prototype.onDefeated = function()
{
	//Set onDefeated parameter
	
	if(this.HP<=0) {
		
		//最终死亡动画
		
		//战胜跳转，成绩展示等
		
	}
	
}

Boss.prototype.makeSpeech = function()
{
	
	//情节展示
	
	
}

// end of Boss.js