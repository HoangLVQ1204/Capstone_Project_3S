CREATE TABLE Roles
(
roleID int PRIMARY KEY,
roleName varchar(20)
);

CREATE TABLE UserLogin
(
username varchar(8) PRIMARY KEY,
password varchar(255),
userRole int REFERENCES Roles(roleID),
-- 0 la admin, 1  --
userStatus int,
 --0 la chua accept, 1 la bi ban, 2 la binh thuong--
 token varchar(255)
 );

CREATE TABLE Admins
(
adminID varchar(8) REFERENCES UserLogin(username) PRIMARY KEY,
name varchar(50),
identityCard varchar(10),
address varchar(100),
DoB date,
email varchar(50),
phoneNumber varchar(9)
);

CREATE TABLE ShipperStatus
(
statusID int PRIMARY KEY,
statusName varchar(20)
--working status cua shipper: busy, available, away--
);

CREATE TABLE Shippers
(
shipperID varchar(8) REFERENCES UserLogin(username) PRIMARY KEY,
name varchar(50),
identityCard varchar(10),
address varchar(100),
DoB date,
email varchar(50),
phoneNumber varchar(9),
statusID int REFERENCES ShipperStatus(statusID)
);

CREATE TABLE StoreManagers
(
managerID varchar(8) PRIMARY KEY,
name varchar(50),
identityCard varchar(10),
address varchar(100),
DoB date,
email varchar(50),
phoneNumber varchar(11)
);

CREATE TABLE Stores
(
storeID varchar(8) REFERENCES UserLogin(username) PRIMARY KEY,
name varchar(50),
description text,
address varchar(100),
phoneNumber varchar(11),
email varchar(50)
);

CREATE TABLE ManageStores
(
managerID varchar(8) REFERENCES StoreManagers(managerID),
storeID varchar(8) REFERENCES Stores(storeID),
PRIMARY KEY (managerID, storeID)
);

CREATE TABLE TransferLedgers	
(
paymentID int PRIMARY KEY,
adminID varchar(8) REFERENCES Admins(adminID),
storeID varchar(8) REFERENCES Stores(storeID),
amount BIGINT,
payFrom int,
--0 la cua hang tra cho he thong va 1 la nguoc lai--
payTime timestamptz
);

CREATE TABLE GeneralLedgers	
(
ledgerID int PRIMARY KEY,
paymentID int REFERENCES TransferLedgers(paymentID),
debitAmount BIGINT,
creditAmount BIGINT,
balance BIGINT,
date timestamptz,
storeID varchar(8) REFERENCES Stores(storeID),
note text
);

CREATE TABLE Stocks
(
stockID int PRIMARY KEY,
name varchar(50),
address varchar(100),
adminID varchar(8) REFERENCES Admins(adminID)
);

CREATE TABLE OrderStatus
(
statusID int PRIMARY KEY,
statusName varchar(20)
--Status cua don hang: gathering, delivering,....--
);

CREATE TABLE OrderTypes
(
typeID int PRIMARY KEY,
typeName varchar(20)
--Loai chuyen nhanh hay cham--
);

CREATE TABLE Goods
(
goodsID int PRIMARY KEY,
weight float,
lengthSize float,
widthSize float,
heightSize float,
description text
);

CREATE TABLE Orders
(
orderID varchar(8) PRIMARY KEY,
storeID varchar(8) REFERENCES Stores(storeID),
shipperID varchar(8) REFERENCES Shippers(shipperID),
orderTypeID int REFERENCES OrderTypes(typeID),
pickUpAddress varchar(100),
deliveryAddress varchar(100),
pickUpDate date,
deliveryDate date,
recipientPhone varchar(11),
recipientName varchar(50),
ledgerID int REFERENCES GeneralLedgers(ledgerID),
statusID  int REFERENCES OrderStatus(statusID),
goods int REFERENCES Goods(goodsID),
stockID int REFERENCES Stocks(stockID),
fee BIGINT,
CoD BIGINT
);

CREATE TABLE ConfirmationCodeTypes
(
typeID int PRIMARY KEY,
codeType varchar(20)
);

CREATE TABLE ConfirmationCodes
(
codeID int PRIMARY KEY,
codeContent int,
typeID int REFERENCES ConfirmationCodeTypes(typeID),
orderID varchar(8) REFERENCES Orders(orderID)
);

CREATE TABLE Tasks
(
taskID int PRIMARY KEY,
workType varchar(20),--type of work: gather, delivery--
status varchar(20),--status of task: normal or express --
shipperID varchar(8) REFERENCES Shippers(shipperID),
adminID varchar(8) REFERENCES Admins(adminID),
orderID varchar(8) REFERENCES Orders(orderID),
workTimes int
);

CREATE TABLE IssueCategories
(
categoryID int PRIMARY KEY,
categoryName varchar(50)
);

CREATE TABLE IssuePriorities
(
priorityID int PRIMARY KEY,
priority varchar(20)
);

CREATE TABLE Issues
(
issueID int PRIMARY KEY,
category int REFERENCES IssueCategories(categoryID),
priority int REFERENCES IssuePriorities(priorityID),
description text
);

CREATE TABLE OrderIssues
(
issueID int REFERENCES Issues(issueID),
orderID varchar(8) REFERENCES Orders(orderID),
PRIMARY KEY(issueID, orderID)
);

CREATE TABLE UpdatingLogs
(
logID bigint PRIMARY KEY,
orderID varchar(8) REFERENCES Orders(orderID),
storeID varchar(8) REFERENCES Stores(storeID),
shipperID varchar(8) REFERENCES Shippers(shipperID),
orderTypeID int REFERENCES OrderTypes(typeID),
pickUpAddress varchar(100),
deliveryAddress varchar(100),
pickUpDate date,
deliveryDate date,
recipientPhone varchar(11),
recipientName varchar(50),
ledgerID int REFERENCES GeneralLedgers(ledgerID),
statusID  int REFERENCES OrderStatus(statusID),
goods int REFERENCES Goods(goodsID),
stockID int REFERENCES Stocks(stockID),
fee BIGINT,
CoD BIGINT,
updateTime timestamptz,
updater varchar(8) REFERENCES UserLogin(username)
);

CREATE TABLE BannedHistoryLogs
(
logID int PRIMARY KEY,
adminID varchar(8) REFERENCES Admins(adminID),
username varchar(8) REFERENCES UserLogin(username),
reason text,
bannedTime date,
type varchar(5)
);

/*
DROP TABLE BannedHistoryLogs;
DROP TABLE UpdatingLogs;
DROP TABLE OrderIssues;
DROP TABLE Issues;
DROP TABLE IssuePriorities;
DROP TABLE IssueCategories;
DROP TABLE Tasks;
DROP TABLE ConfirmationCodes;
DROP TABLE ConfirmationCodeTypes;
DROP TABLE Orders;
DROP TABLE Goods;

DROP TABLE OrderTypes;
DROP TABLE OrderStatus;

DROP TABLE Stocks;
DROP TABLE GeneralLedgers;
DROP TABLE TransferLedgers;
DROP TABLE ManageStores;
DROP TABLE Stores;
DROP TABLE StoreManagers;
DROP TABLE Shippers;
DROP TABLE ShipperStatus;
DROP TABLE Admins;
DROP TABLE UserLogin;
DROP TABLE Roles;
*/