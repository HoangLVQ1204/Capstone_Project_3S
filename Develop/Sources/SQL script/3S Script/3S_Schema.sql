CREATE TABLE Role
(
roleID int PRIMARY KEY,
roleName varchar(20)
);

/*CREATE TABLE WorkingStatus
(
statusID int PRIMARY KEY,
statusName varchar(20)
--working status cua shipper: busy, available, away--
);*/

-- UserStatus: user duoc accept boi admin hay chua
--1 la chua inactive, 2 la active, 3 la ban--
create table UserStatus
(
 statusID int PRIMARY KEY,
 statusName varchar(10)
);

CREATE TABLE "user"
(
username varchar(20) PRIMARY KEY,
password varchar(255),
userRole int REFERENCES Role(roleID),
-- 0 la admin, 1  --
userStatus int REFERENCES UserStatus(statusID)
 );

CREATE TABLE Profile
(
username varchar(20) REFERENCES "user"(username) PRIMARY KEY,
name varchar(50),
identityCard varchar(10),
address varchar(100),
DoB date,
email varchar(50),
phoneNumber varchar(11),
addressCoordination text,
avatar varchar(50)
);



CREATE TABLE Store
(
storeID varchar(8) PRIMARY KEY,
name varchar(50),
description text,
address varchar(100),
latitude varchar(30),
longitude varchar(30),
phoneNumber varchar(11),
email varchar(50),
avatar varchar(50),
registeredDate timestamp
);

CREATE TABLE ManageStore
(
managerID varchar(20) REFERENCES "user"(username),
storeID varchar(8) REFERENCES Store(storeID),
PRIMARY KEY (managerID, storeID)
);


CREATE TABLE GeneralLedger
(
ledgerID SERIAL PRIMARY KEY,
adminID varchar(20) REFERENCES "user"(username),
storeID varchar(8) REFERENCES Store(storeID),
amount BIGINT,
balance BIGINT,
payDate timestamp,
note text,
-- payFrom1 la cua hang tra cho he thong , 2 la nguoc lai va 3 la he thong tong ket don hang sau 1 tuan--
payFrom int,
--totalDelivery: != NULL, khi cuối tuần thực hiện thanh toán thì mới update
totalDelivery BIGINT,
totalCOD BIGINT
);

CREATE TABLE Stock
(
stockID int PRIMARY KEY,
name varchar(50),
address varchar(100),
adminID varchar(20) REFERENCES "user"(username),
addressCoordination text
);

CREATE TABLE OrderStatus
(
statusID int PRIMARY KEY,
statusName varchar(20)
);

CREATE TABLE OrderType
(
typeID int PRIMARY KEY,
typeName varchar(20),
nextAction varchar(20)
--Loai chuyen nhanh hay cham--
);

--isPending: Khi issue đc gửi lên từ shipper. Thì isPending = 'True'
--isDraff: Khi store save đơn hàng mà chưa tạo đơn hàng thì isDraff = 'True'
CREATE TABLE "order"
(
orderID varchar(8) PRIMARY KEY,
storeID varchar(8) REFERENCES Store(storeID),
orderTypeID int REFERENCES OrderType(typeID),
pickUpAddress varchar(100),
deliveryAddress varchar(100),
pickUpDate date,
deliveryDate date,
createDate date,
doneDate date,
recipientPhone varchar(11),
recipientName varchar(50),
ledgerID int REFERENCES GeneralLedger(ledgerID),
statusID  int REFERENCES OrderStatus(statusID),
isPending boolean,
isDraff boolean,
isCancel boolean,
fee BIGINT,
Cod BIGINT,
pickUpAddressCoordination text,
deliveryAddressCoordination text
);


CREATE TABLE TaskStatus
(
statusID int PRIMARY KEY,
statusName varchar(20)
);

CREATE TABLE TaskType
(
typeID int PRIMARY KEY,
typeName varchar(20)
);

CREATE TABLE Task
(
taskID SERIAL PRIMARY KEY,
orderID varchar(8) REFERENCES "order"(orderID),
shipperID varchar(20) REFERENCES "user"(username),
adminID varchar(20) REFERENCES "user"(username),
statusID int REFERENCES TaskStatus(statusID),
typeID int REFERENCES TaskType(typeID),
taskDate date
);

CREATE TABLE Goods
(
goodsID int PRIMARY KEY,
goodsName varchar(20),
orderID varchar(8) REFERENCES "order"(orderID),
stockID int REFERENCES Stock(stockID),
weight float,
lengthSize float,
widthSize float,
heightSize float,
description text,
amount int
);

CREATE TABLE ConfirmationCodeType
(
typeID int PRIMARY KEY,
codeType varchar(20)
);

CREATE TABLE ConfirmationCode
(
codeID int PRIMARY KEY,
codeContent int,
typeID int REFERENCES ConfirmationCodeType(typeID),
orderID varchar(8) REFERENCES "order"(orderID)
);



CREATE TABLE IssueCategory
(
categoryID int PRIMARY KEY,
categoryName varchar(50)
);

CREATE TABLE IssueType
(
typeID int PRIMARY KEY,
categoryID int REFERENCES IssueCategory(categoryID),
typeName text
);

--resolveType: 1: continue, 2: changeShipper
CREATE TABLE Issue
(
issueID SERIAL PRIMARY KEY,
typeID int REFERENCES IssueType(typeID),
description text,
isResolved boolean,
resolveType int,
createdDate date
);

CREATE TABLE OrderIssue
(
issueID int REFERENCES Issue(issueID),
orderID varchar(8) REFERENCES "order"(orderID),
PRIMARY KEY(issueID, orderID)
);

CREATE TABLE OrderLog
(
logID bigint PRIMARY KEY,
orderID varchar(8) REFERENCES "order"(orderID),
storeID varchar(8),
taskID varchar(8),
orderTypeID int,
pickUpAddress varchar(100),
deliveryAddress varchar(100),
pickUpDate date,
deliveryDate date,
recipientPhone varchar(11),
recipientName varchar(50),
ledgerID int,
statusID int,
fee BIGINT,
CoD BIGINT,
pickUpAddressCoordination text,
deliveryAddressCoordination text,
uptimestamp timestamp,
updater varchar(20) REFERENCES "user"(username)
);

CREATE TABLE BannedHistoryLog
(
logID SERIAL PRIMARY KEY,
adminID varchar(20) REFERENCES "user"(username),
shipperID varchar(20)REFERENCES "user"(username),
storeID varchar(8) REFERENCES store(storeID),
reason text,
bannedTime date,
type int
--1 la ban, 2 la unban--
);



/*
DROP TABLE BannedHistoryLog;
DROP TABLE OrderLog;
DROP TABLE OrderIssue;
DROP TABLE Issue;
DROP TABLE IssueType;
DROP TABLE IssueCategory;
DROP TABLE ConfirmationCode;
DROP TABLE ConfirmationCodeType;
DROP TABLE Goods;
DROP TABLE Task;
DROP TABLE TaskStatus;
DROP TABLE TaskType;
DROP TABLE "order";
DROP TABLE OrderType;
DROP TABLE OrderStatus;
DROP TABLE Stock;
DROP TABLE GeneralLedger;
DROP TABLE ManageStore;
DROP TABLE Store;
DROP TABLE Profile;
DROP TABLE "user";
DROP TABLE UserStatus;
DROP TABLE Role;
*/