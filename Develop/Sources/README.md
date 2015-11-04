Repository for website English Center

## Test API
A way to test API, install httpie by **npm i -g httpie**

## Write and run test
If you write and run test, install mocha by **npm i -g mocha**

## Connect Database Server
Username: **englishaholic**
Password: **englishaholic**
Database for development: **englishaholic**
Database for testing: **englishaholic-test**

## Correcting model
After copying a model into a module, you should change **sequelize.define(...)** like this:

```javascript
var User = sequelize.define('User', {
    userId : {
    	type: DataTypes.INTEGER,
      	**autoIncrement: true**,   
      	primaryKey: true
    }
    fullName : Sequelize.STRING,    
    birthday : Sequelize.DATE
}, **{
	freezeTableName: true,
    timestamps: false
}**);
```

**Please note that you should put autoIncrement into ID of table**
You can reference to **User module**.