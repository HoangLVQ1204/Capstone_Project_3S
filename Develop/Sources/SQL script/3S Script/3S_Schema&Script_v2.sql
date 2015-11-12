--DROP/DELETE TABLE--

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





/*
Navicat PGSQL Data Transfer

Source Server         : decodedmrq
Source Server Version : 90405
Source Host           : localhost:5432
Source Database       : 3S
Source Schema         : public

Target Server Type    : PGSQL
Target Server Version : 90405
File Encoding         : 65001

Date: 2015-11-12 00:35:27
*/


-- ----------------------------
-- Sequence structure for generalledger_ledgerid_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."generalledger_ledgerid_seq";
CREATE SEQUENCE "public"."generalledger_ledgerid_seq"
 INCREMENT 1
 MINVALUE 1
 MAXVALUE 9223372036854775807
 START 1
 CACHE 1;

-- ----------------------------
-- Sequence structure for issue_issueid_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."issue_issueid_seq";
CREATE SEQUENCE "public"."issue_issueid_seq"
 INCREMENT 1
 MINVALUE 1
 MAXVALUE 9223372036854775807
 START 1
 CACHE 1;

-- ----------------------------
-- Sequence structure for task_taskid_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."task_taskid_seq";
CREATE SEQUENCE "public"."task_taskid_seq"
 INCREMENT 1
 MINVALUE 1
 MAXVALUE 9223372036854775807
 START 1
 CACHE 1;

-- ----------------------------
-- Table structure for bannedhistorylog
-- ----------------------------
DROP TABLE IF EXISTS "public"."bannedhistorylog";
CREATE TABLE "public"."bannedhistorylog" (
"logid" int4 NOT NULL,
"adminid" varchar(20) COLLATE "default",
"shipperid" varchar(20) COLLATE "default",
"storeid" varchar(8) COLLATE "default",
"reason" text COLLATE "default",
"bannedtime" date,
"type" varchar(5) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of bannedhistorylog
-- ----------------------------

-- ----------------------------
-- Table structure for confirmationcode
-- ----------------------------
DROP TABLE IF EXISTS "public"."confirmationcode";
CREATE TABLE "public"."confirmationcode" (
"codeid" int4 NOT NULL,
"codecontent" int4,
"typeid" int4,
"orderid" varchar(8) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of confirmationcode
-- ----------------------------
INSERT INTO "public"."confirmationcode" VALUES ('1', '234222', '2', 'OD122222');
INSERT INTO "public"."confirmationcode" VALUES ('2', '233333', '3', 'OD122222');
INSERT INTO "public"."confirmationcode" VALUES ('3', '333222', '5', 'OD122222');
INSERT INTO "public"."confirmationcode" VALUES ('4', '122111', '6', 'OD122222');
INSERT INTO "public"."confirmationcode" VALUES ('5', '123987', '2', 'OD981921');
INSERT INTO "public"."confirmationcode" VALUES ('6', '998022', '3', 'OD981921');
INSERT INTO "public"."confirmationcode" VALUES ('7', '90909', '5', 'OD981921');
INSERT INTO "public"."confirmationcode" VALUES ('8', '80872', '6', 'OD981921');
INSERT INTO "public"."confirmationcode" VALUES ('9', '123459', '2', 'OD555461');
INSERT INTO "public"."confirmationcode" VALUES ('10', '123460', '3', 'OD555461');
INSERT INTO "public"."confirmationcode" VALUES ('11', '123461', '5', 'OD555461');
INSERT INTO "public"."confirmationcode" VALUES ('12', '123462', '6', 'OD555461');
INSERT INTO "public"."confirmationcode" VALUES ('13', '123463', '2', 'OD123322');
INSERT INTO "public"."confirmationcode" VALUES ('14', '123464', '3', 'OD123322');
INSERT INTO "public"."confirmationcode" VALUES ('15', '123465', '5', 'OD123322');
INSERT INTO "public"."confirmationcode" VALUES ('16', '123466', '6', 'OD123322');
INSERT INTO "public"."confirmationcode" VALUES ('17', '123467', '2', 'OD192851');
INSERT INTO "public"."confirmationcode" VALUES ('18', '123468', '3', 'OD192851');
INSERT INTO "public"."confirmationcode" VALUES ('19', '123469', '5', 'OD192851');
INSERT INTO "public"."confirmationcode" VALUES ('20', '123470', '6', 'OD192851');
INSERT INTO "public"."confirmationcode" VALUES ('21', '123471', '2', 'OD122122');
INSERT INTO "public"."confirmationcode" VALUES ('22', '123472', '3', 'OD122122');
INSERT INTO "public"."confirmationcode" VALUES ('23', '123473', '5', 'OD122122');
INSERT INTO "public"."confirmationcode" VALUES ('24', '123474', '6', 'OD122122');
INSERT INTO "public"."confirmationcode" VALUES ('25', '123475', '2', 'OD999811');
INSERT INTO "public"."confirmationcode" VALUES ('26', '123476', '3', 'OD999811');
INSERT INTO "public"."confirmationcode" VALUES ('27', '123477', '5', 'OD999811');
INSERT INTO "public"."confirmationcode" VALUES ('28', '123478', '6', 'OD999811');
INSERT INTO "public"."confirmationcode" VALUES ('29', '123479', '2', 'OD872818');
INSERT INTO "public"."confirmationcode" VALUES ('30', '123480', '3', 'OD872818');
INSERT INTO "public"."confirmationcode" VALUES ('31', '123481', '5', 'OD872818');
INSERT INTO "public"."confirmationcode" VALUES ('32', '123482', '6', 'OD872818');
INSERT INTO "public"."confirmationcode" VALUES ('33', '123483', '2', 'OD901001');
INSERT INTO "public"."confirmationcode" VALUES ('34', '123484', '3', 'OD901001');
INSERT INTO "public"."confirmationcode" VALUES ('35', '123485', '5', 'OD901001');
INSERT INTO "public"."confirmationcode" VALUES ('36', '123486', '6', 'OD901001');
INSERT INTO "public"."confirmationcode" VALUES ('37', '123487', '2', 'OD828101');
INSERT INTO "public"."confirmationcode" VALUES ('38', '123488', '3', 'OD828101');
INSERT INTO "public"."confirmationcode" VALUES ('39', '123489', '5', 'OD828101');
INSERT INTO "public"."confirmationcode" VALUES ('40', '123490', '6', 'OD828101');
INSERT INTO "public"."confirmationcode" VALUES ('41', '123491', '2', 'OD666121');
INSERT INTO "public"."confirmationcode" VALUES ('42', '123492', '3', 'OD666121');
INSERT INTO "public"."confirmationcode" VALUES ('43', '123493', '5', 'OD666121');
INSERT INTO "public"."confirmationcode" VALUES ('44', '123494', '6', 'OD666121');
INSERT INTO "public"."confirmationcode" VALUES ('45', '123495', '2', 'OD090909');
INSERT INTO "public"."confirmationcode" VALUES ('46', '123496', '3', 'OD090909');
INSERT INTO "public"."confirmationcode" VALUES ('47', '123497', '5', 'OD090909');
INSERT INTO "public"."confirmationcode" VALUES ('48', '123498', '6', 'OD090909');
INSERT INTO "public"."confirmationcode" VALUES ('49', '123499', '2', 'OD190271');
INSERT INTO "public"."confirmationcode" VALUES ('50', '123500', '3', 'OD190271');
INSERT INTO "public"."confirmationcode" VALUES ('51', '123501', '5', 'OD190271');
INSERT INTO "public"."confirmationcode" VALUES ('52', '123502', '6', 'OD190271');
INSERT INTO "public"."confirmationcode" VALUES ('53', '123503', '2', 'OD154444');
INSERT INTO "public"."confirmationcode" VALUES ('54', '123504', '3', 'OD154444');
INSERT INTO "public"."confirmationcode" VALUES ('55', '123505', '5', 'OD154444');
INSERT INTO "public"."confirmationcode" VALUES ('56', '123506', '6', 'OD154444');

-- ----------------------------
-- Table structure for confirmationcodetype
-- ----------------------------
DROP TABLE IF EXISTS "public"."confirmationcodetype";
CREATE TABLE "public"."confirmationcodetype" (
"typeid" int4 NOT NULL,
"codetype" varchar(20) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of confirmationcodetype
-- ----------------------------
INSERT INTO "public"."confirmationcodetype" VALUES ('2', 'Gathering');
INSERT INTO "public"."confirmationcodetype" VALUES ('3', 'In Stock');
INSERT INTO "public"."confirmationcodetype" VALUES ('5', 'Return store');
INSERT INTO "public"."confirmationcodetype" VALUES ('6', 'Deliver');

-- ----------------------------
-- Table structure for confirmationcodetypes
-- ----------------------------
DROP TABLE IF EXISTS "public"."confirmationcodetypes";
CREATE TABLE "public"."confirmationcodetypes" (
"typeid" int4 NOT NULL,
"codetype" varchar(255) COLLATE "default",
"createdAt" timestamptz(6) NOT NULL,
"updatedAt" timestamptz(6) NOT NULL
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of confirmationcodetypes
-- ----------------------------

-- ----------------------------
-- Table structure for generalledger
-- ----------------------------
DROP TABLE IF EXISTS "public"."generalledger";
CREATE TABLE "public"."generalledger" (
"ledgerid" int4 DEFAULT nextval('generalledger_ledgerid_seq'::regclass) NOT NULL,
"adminid" varchar(20) COLLATE "default",
"storeid" varchar(8) COLLATE "default",
"amount" int8,
"balance" int8,
"paydate" timestamp(6),
"note" text COLLATE "default",
"payfrom" int4,
"totaldelivery" int8,
"totalcod" int8
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of generalledger
-- ----------------------------
INSERT INTO "public"."generalledger" VALUES ('1', 'AD000001', 'STR003', null, '30000', '2015-11-07 00:00:00', 'auto', '3', '50000', '20000');
INSERT INTO "public"."generalledger" VALUES ('2', 'AD000001', 'STR001', null, '-50000', '2015-11-07 00:00:00', 'auto', '3', '50000', '100000');
INSERT INTO "public"."generalledger" VALUES ('3', 'AD000001', 'STR003', '20000', '10000', '2015-11-08 00:00:00', 'admin tinh', '1', '30000', '20000');
INSERT INTO "public"."generalledger" VALUES ('4', 'AD000001', 'STR003', '10000', '0', '2015-11-09 00:00:00', 'admin tu nhap', '1', '20000', '20000');
INSERT INTO "public"."generalledger" VALUES ('5', 'AD000001', 'STR001', '-30000', '-20000', '2015-11-08 00:00:00', 'admin tu nhap', '2', '50000', '70000');
INSERT INTO "public"."generalledger" VALUES ('6', 'AD000001', 'STR001', '-20000', '0', '2015-11-09 00:00:00', 'abc', '2', '50000', '50000');
INSERT INTO "public"."generalledger" VALUES ('7', 'AD000001', 'STR004', null, '-130000', '2015-11-07 00:00:00', 'auto', '3', '120000', '250000');
INSERT INTO "public"."generalledger" VALUES ('8', 'AD000001', 'STR004', '-120000', '-10000', '2015-11-08 00:00:00', 'admin tra cho cua hang', '2', '120000', '130000');
INSERT INTO "public"."generalledger" VALUES ('9', 'AD000001', 'STR004', '-10000', '0', '2015-11-09 00:00:00', 'admin tra cho store', '2', '120000', '120000');

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS "public"."goods";
CREATE TABLE "public"."goods" (
"goodsid" int4 NOT NULL,
"goodsname" varchar(20) COLLATE "default",
"orderid" varchar(8) COLLATE "default",
"stockid" int4,
"weight" float8,
"lengthsize" float8,
"widthsize" float8,
"heightsize" float8,
"description" text COLLATE "default",
"amount" int4
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO "public"."goods" VALUES ('1', 'Apricot', 'OD122222', null, '32', '20', '50', '35', 'Very height', '2');
INSERT INTO "public"."goods" VALUES ('2', 'Asparagus', 'OD981921', null, '34', '34', '34', '50', 'Very width', '1');
INSERT INTO "public"."goods" VALUES ('3', 'Aubergine', 'OD555461', null, '34', '34', '34', '50', 'Very width', '3');
INSERT INTO "public"."goods" VALUES ('4', 'Avocado', 'OD555461', null, '34', '34', '34', '50', 'Very width', '1');
INSERT INTO "public"."goods" VALUES ('5', 'Banana', 'OD123322', null, '34', '34', '34', '50', 'Very width', '4');
INSERT INTO "public"."goods" VALUES ('6', 'Banana', 'OD123322', null, '34', '34', '34', '50', 'Very width', '1');
INSERT INTO "public"."goods" VALUES ('7', 'Beetroot', 'OD192851', null, '34', '34', '34', '50', 'Very width', '2');
INSERT INTO "public"."goods" VALUES ('8', 'Black-eye bean', 'OD122122', '1', '34', '34', '34', '50', 'Very width', '3');
INSERT INTO "public"."goods" VALUES ('9', 'Broad bean', 'OD999811', null, '34', '34', '34', '50', 'Very width', '1');
INSERT INTO "public"."goods" VALUES ('10', 'Broccoli', 'OD872818', null, '34', '34', '34', '50', 'Very width', '4');
INSERT INTO "public"."goods" VALUES ('11', 'Broccoli', 'OD901001', null, '34', '34', '34', '50', 'Very width', '3');
INSERT INTO "public"."goods" VALUES ('12', 'Brussels sprout', 'OD828101', null, '34', '34', '34', '50', 'Very width', '2');
INSERT INTO "public"."goods" VALUES ('13', 'Butternut Squash', 'OD666121', null, '34', '34', '34', '50', 'Very width', '1');
INSERT INTO "public"."goods" VALUES ('14', 'Carrot', 'OD090909', null, '34', '34', '34', '50', 'Very width', '3');
INSERT INTO "public"."goods" VALUES ('15', 'Cherry', 'OD190271', null, '34', '34', '34', '50', 'Very width', '2');
INSERT INTO "public"."goods" VALUES ('16', 'Clementine', 'OD154444', null, '34', '34', '34', '50', 'Very width', '4');
INSERT INTO "public"."goods" VALUES ('17', 'Courgette', 'OD901001', null, '34', '34', '34', '50', 'Very width', '1');
INSERT INTO "public"."goods" VALUES ('18', 'Date', 'OD154444', null, '34', '34', '34', '50', 'Very width', '4');
INSERT INTO "public"."goods" VALUES ('19', 'Elderberry', 'OD190271', null, '34', '34', '34', '50', 'Very width', '2');
INSERT INTO "public"."goods" VALUES ('20', 'Endive', 'OD190271', null, '34', '34', '34', '50', 'Very width', '3');

-- ----------------------------
-- Table structure for issue
-- ----------------------------
DROP TABLE IF EXISTS "public"."issue";
CREATE TABLE "public"."issue" (
"issueid" int4 DEFAULT nextval('issue_issueid_seq'::regclass) NOT NULL,
"typeid" int4,
"description" text COLLATE "default",
"isresolved" bool,
"resolvetype" int4,
"createddate" date
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of issue
-- ----------------------------
INSERT INTO "public"."issue" VALUES ('1', '1', 'Tắc đường quá, em chưa đi tiếp được', 't', '1', '2015-11-11');
INSERT INTO "public"."issue" VALUES ('2', '2', 'Em bị hỏng xe, đang vá xăm', 't', '1', '2015-11-11');

-- ----------------------------
-- Table structure for issuecategory
-- ----------------------------
DROP TABLE IF EXISTS "public"."issuecategory";
CREATE TABLE "public"."issuecategory" (
"categoryid" int4 NOT NULL,
"categoryname" varchar(50) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of issuecategory
-- ----------------------------
INSERT INTO "public"."issuecategory" VALUES ('1', 'Pending');
INSERT INTO "public"."issuecategory" VALUES ('2', 'Cancel');

-- ----------------------------
-- Table structure for issuetype
-- ----------------------------
DROP TABLE IF EXISTS "public"."issuetype";
CREATE TABLE "public"."issuetype" (
"typeid" int4 NOT NULL,
"categoryid" int4,
"typename" text COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of issuetype
-- ----------------------------
INSERT INTO "public"."issuetype" VALUES ('1', '1', 'Traffic jam');
INSERT INTO "public"."issuetype" VALUES ('2', '1', 'Vehicle');
INSERT INTO "public"."issuetype" VALUES ('3', '1', 'Accident');
INSERT INTO "public"."issuetype" VALUES ('4', '2', 'Goods is broken');
INSERT INTO "public"."issuetype" VALUES ('5', '2', 'Cannot contact with customer');
INSERT INTO "public"."issuetype" VALUES ('6', '1', 'Other');
INSERT INTO "public"."issuetype" VALUES ('7', '2', 'Other');

-- ----------------------------
-- Table structure for managestore
-- ----------------------------
DROP TABLE IF EXISTS "public"."managestore";
CREATE TABLE "public"."managestore" (
"managerid" varchar(20) COLLATE "default" NOT NULL,
"storeid" varchar(8) COLLATE "default" NOT NULL
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of managestore
-- ----------------------------
INSERT INTO "public"."managestore" VALUES ('ST000001', 'STR001');
INSERT INTO "public"."managestore" VALUES ('ST000002', 'STR002');
INSERT INTO "public"."managestore" VALUES ('ST000003', 'STR003');
INSERT INTO "public"."managestore" VALUES ('ST000004', 'STR004');

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS "public"."order";
CREATE TABLE "public"."order" (
"orderid" varchar(8) COLLATE "default" NOT NULL,
"storeid" varchar(8) COLLATE "default",
"ordertypeid" int4,
"pickupaddress" varchar(100) COLLATE "default",
"deliveryaddress" varchar(100) COLLATE "default",
"pickupdate" date,
"createdate" date,
"completedate" date,
"recipientphone" varchar(11) COLLATE "default",
"recipientname" varchar(50) COLLATE "default",
"ledgerid" int4,
"statusid" int4,
"ispending" bool,
"isdraff" bool,
"fee" int8,
"cod" int8,
"pickupaddresscoordination" text COLLATE "default",
"deliveryaddresscoordination" text COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO "public"."order" VALUES ('OD090909', 'STR001', '1', 'Quận Long Biên - Hà Nội', 'Quận Thanh Xuân - Hà Nội', '2015-11-09', '2015-11-09', null, '0911212122', 'Anh Khanh', null, '1', 'f', 'f', '50000', '10000', '514515', '5151');
INSERT INTO "public"."order" VALUES ('OD122122', 'STR002', '1', 'Thị xã Sơn Tây - Hà Nội', 'Huyện Phúc Thọ- Hà Nội', '2015-11-09', '2015-11-09', null, '0944512111', 'Chi Nghia', null, '4', 'f', 'f', '100000', '0', '51251514', '5151');
INSERT INTO "public"."order" VALUES ('OD122222', 'STR002', '1', 'Huyện Gia Lâm - Hà Nội', 'Huyện Đông Anh - Hà Nội', '2015-11-09', '2015-11-09', null, '0944151544', 'Anh Kien', null, '2', 'f', 'f','50000', '500000', '215454', '515415');
INSERT INTO "public"."order" VALUES ('OD123322', 'STR002', '1', 'Quận Tây Hồ - Hà Nội', 'Quận Cầu Giấy - Hà Nội', '2015-11-09', '2015-11-09', '2015-11-11', '0165554222', 'Anh Loang', null, '7', 'f', 'f','10000', '20000', '515151', '515151');
INSERT INTO "public"."order" VALUES ('OD123451', 'STR003', '1', 'Từ Liêm - Hà Nội', 'Cầu Giấy - Hà Nội', '2015-11-04', '2015-11-06', '2015-11-07', '0911241212', 'Anh Hoàng', '1', '7', 'f', 'f', '50000', '20000', '3524231545115', '54545454');
INSERT INTO "public"."order" VALUES ('OD154444', 'STR002', '1', 'Huyện Từ Liêm - Hà Nội', 'Huyện Thanh Trì - Hà Nội', '2015-11-09', '2015-11-08', null, '0955412112', 'Anh Hoang', null, '1', 'f', 'f', '10000', '5000', '5515616', '5151515');
INSERT INTO "public"."order" VALUES ('OD154515', 'STR004', '1', 'Quận Hoàng Mai - Hà Nội', 'Quận Thanh Xuân - Hà Nội', '2015-11-03', '2015-11-02', '2015-11-04', '0912311221', 'Anh Nam', '7', '7', 'f', 'f', '20000', '200000', '2121515', '216156151');
INSERT INTO "public"."order" VALUES ('OD190271', 'STR001', '1', 'Huyện Từ Liêm - Hà Nội', 'Huyện Thanh Trì - Hà Nội', '2015-11-09', '2015-11-09', null, '01645445454', 'Anh Tam', null, '2', 'f', 'f', '60000', '400000', '5454', '5454');
INSERT INTO "public"."order" VALUES ('OD192851', 'STR001', '2', 'Quận Hà Đông - Hà Nội', 'Huyện Ba Vì - Hà Nội', '2015-11-11', '2015-11-11', null, '0911215455', 'Anh Fan', null, '6', 'f', 'f', '20000', '100000', '5215151', '51515');
INSERT INTO "public"."order" VALUES ('OD515645', 'STR004', '1', 'Quận Cầu Giấy - Hà Nội', 'Quận Tây Hồ - Hà Nội', '2015-11-03', '2015-11-02', '2015-11-04', '0165554512', 'Anh Hải', null, '7', 'f', 'f', '100000', '50000', '155111', '561155611');
INSERT INTO "public"."order" VALUES ('OD555461', 'STR004', '2', 'Huyện Thanh Trì - Hà Nội', 'Huyện Gia Lâm - Hà Nội', '2015-11-11', '2015-11-11', null, '0165545555', 'Anh Huy', null, '2', 'f', 'f','50000', '500000', '545641', '65415615');
INSERT INTO "public"."order" VALUES ('OD666121', 'STR002', '2', 'Quận Hai Bà Trưng - Hà Nội', 'Quận Ba Đình - Hà Nội', '2015-11-11', '2015-11-11', null, '0941121212', 'Anh Manh', null, '5', 'f', 'f','38000', '80000', '5451541', '515151');
INSERT INTO "public"."order" VALUES ('OD666612', 'STR001', '1', 'Hoàn Kiếm - Hà Nội', 'Hai Bà Trưng - Hà Nội', '2015-11-04', '2015-11-03', '2015-11-07', '01625456455', 'Anh Kinh', '2', '7', 'f', 'f','50000', '100000', '4545614564', '564561564564');
INSERT INTO "public"."order" VALUES ('OD828101', 'STR003', '1', 'Quận Hoàn Kiếm - Hà Nội', 'Quận Đống Đa - Hà Nội', '2015-11-09', '2015-11-09', null, '0944545421', 'Anh Tien', null, '5', 'f', 'f','20000', '0', '515645', '5454');
INSERT INTO "public"."order" VALUES ('OD872818', 'STR003', '1', 'Huyện Thanh Trì - Hà Nội', 'Quận Thanh Xuân - Hà Nội', '2015-11-09', '2015-11-09', null, '0168445455', 'Anh Anhki', null, '2', 'f', 'f','50000', '0', '54545', '54564');
INSERT INTO "public"."order" VALUES ('OD901001', 'STR003', '2', 'Huyện Đan Phượng - Hà Nội', 'Huyện Hoài Đức - Hà Nội', '2015-11-11', '2015-11-11', null, '01644511122', 'Anh Dien', null, '2', 'f', 'f','50000', '100000', '656556', '6565');
INSERT INTO "public"."order" VALUES ('OD981921', 'STR001', '1', 'Huyện Đông Anh - Hà Nội', 'Huyện Sóc Sơn - Hà Nội', '2015-11-10', '2015-11-10', '2015-11-11', '09445211542', 'Anh Ranh', null, '7', 'f', 'f','80000', '900000', '474454', '1111223');
INSERT INTO "public"."order" VALUES ('OD999811', 'STR002', '1', 'Huyện Đan Phượng - Hà Nội', 'Huyện Hoài Đức - Hà Nội', '2015-11-09', '2015-11-09', '2015-11-13', '0955412121', 'Chi Anh', null, '8', 'f', 'f','40000', '0', '5156456', '545454');


-- ----------------------------
-- Table structure for orderissue
-- ----------------------------
DROP TABLE IF EXISTS "public"."orderissue";
CREATE TABLE "public"."orderissue" (
"issueid" int4 NOT NULL,
"orderid" varchar(8) COLLATE "default" NOT NULL
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of orderissue
-- ----------------------------
INSERT INTO "public"."orderissue" VALUES ('1', 'OD981921');
INSERT INTO "public"."orderissue" VALUES ('2', 'OD828101');

-- ----------------------------
-- Table structure for orderlog
-- ----------------------------
DROP TABLE IF EXISTS "public"."orderlog";
CREATE TABLE "public"."orderlog" (
"logid" int8 NOT NULL,
"orderid" varchar(8) COLLATE "default",
"storeid" varchar(8) COLLATE "default",
"taskid" varchar(8) COLLATE "default",
"ordertypeid" int4,
"pickupaddress" varchar(100) COLLATE "default",
"deliveryaddress" varchar(100) COLLATE "default",
"pickupdate" date,
"deliverydate" date,
"recipientphone" varchar(11) COLLATE "default",
"recipientname" varchar(50) COLLATE "default",
"ledgerid" int4,
"statusid" int4,
"fee" int8,
"cod" int8,
"pickupaddresscoordination" text COLLATE "default",
"deliveryaddresscoordination" text COLLATE "default",
"uptimestamp" timestamp(6),
"updater" varchar(20) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of orderlog
-- ----------------------------
INSERT INTO "public"."orderlog" VALUES ('1', 'OD981921', 'STR001', '2', '1', 'Huyện Đông Anh - Hà Nội', 'Huyện Sóc Sơn - Hà Nội', '2015-11-10', '2015-11-11', '09445211542', 'Anh Ranh', null, '5', '80000', '900000', '474454', '1111223', '2015-11-10 00:00:00', 'AD000001');
INSERT INTO "public"."orderlog" VALUES ('2', 'OD828101', 'STR003', '9', '1', 'Quận Hoàn Kiếm - Hà Nội', 'Quận Đống Đa - Hà Nội', '2015-11-09', '2015-11-13', '0944545421', 'Anh Tien', null, '5', '20000', '0', '515645', '5454', '2015-11-10 00:00:00', 'AD000001');

-- ----------------------------
-- Table structure for orderstatus
-- ----------------------------
DROP TABLE IF EXISTS "public"."orderstatus";
CREATE TABLE "public"."orderstatus" (
"statusid" int4 NOT NULL,
"statusname" varchar(20) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of orderstatus
-- ----------------------------
INSERT INTO "public"."orderstatus" VALUES ('1', 'Waiting');
INSERT INTO "public"."orderstatus" VALUES ('2', 'Picking up');
INSERT INTO "public"."orderstatus" VALUES ('3', 'Bring to stock');
INSERT INTO "public"."orderstatus" VALUES ('4', 'In stock');
INSERT INTO "public"."orderstatus" VALUES ('5', 'Delivering');
INSERT INTO "public"."orderstatus" VALUES ('6', 'Canceling');
INSERT INTO "public"."orderstatus" VALUES ('7', 'Done');
INSERT INTO "public"."orderstatus" VALUES ('8', 'Cancel');

-- ----------------------------
-- Table structure for ordertype
-- ----------------------------
DROP TABLE IF EXISTS "public"."ordertype";
CREATE TABLE "public"."ordertype" (
"typeid" int4 NOT NULL,
"typename" varchar(20) COLLATE "default",
"nextaction" varchar(20) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of ordertype
-- ----------------------------
INSERT INTO "public"."ordertype" VALUES ('1', 'normal', null);
INSERT INTO "public"."ordertype" VALUES ('2', 'express', null);

-- ----------------------------
-- Table structure for profile
-- ----------------------------
DROP TABLE IF EXISTS "public"."profile";
CREATE TABLE "public"."profile" (
"username" varchar(20) COLLATE "default" NOT NULL,
"name" varchar(50) COLLATE "default",
"identitycard" varchar(10) COLLATE "default",
"address" varchar(100) COLLATE "default",
"dob" date,
"email" varchar(50) COLLATE "default",
"phonenumber" varchar(11) COLLATE "default",
"avatar" varchar(50) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of profile
-- ----------------------------
INSERT INTO "public"."profile" VALUES ('AD000001', 'Nguyễn Khắc Hoàng', '122137977', 'Hà Đông - Hà Nội', '1993-04-05', 'hoangnk@gmail.com', '01679515231', 'assets/avatar/admin/AD000001.jpg');
INSERT INTO "public"."profile" VALUES ('AD000002', 'Lê Văn Quý Hoàng', '122451211', 'Huế - Đà Nẵng', '1993-06-06', 'hoanglvq@gmail.com', '0955215789', 'assets/avatar/admin/AD000002.jpg');
INSERT INTO "public"."profile" VALUES ('SP000001', 'Nguyễn Văn Quyền', '122137977', 'Lục Nam - Bắc Giang', '1993-02-03', 'quyennv@gmail.com', '01679212645', 'assets/avatar/shipper/SP000002.jpg');
INSERT INTO "public"."profile" VALUES ('SP000002', 'Trần Đình Hoàng Huy', '122456741', 'Hội An - Quảng Nam', '1993-06-08', 'huytdh@gmail.com', '01644895422', 'assets/avatar/shipper/SP000001.jpg');
INSERT INTO "public"."profile" VALUES ('ST000001', 'Kiều Cao Khanh', '1223156455', 'Thạch Thất - Hà Nội', '1993-02-18', 'khanhkc@gmail.com', '0168654789', 'assets/avatar/store_ower/ST000001.jpg');
INSERT INTO "public"."profile" VALUES ('ST000002', 'Nguyễn Hồng Nhung', '1224564789', 'Xuân Mai - Hà Nội', '1993-02-03', 'nhungNH@gmail.com', '0988756412', 'assets/avatar/store_ower/ST000002.jpg');
INSERT INTO "public"."profile" VALUES ('ST000003', 'Nguyễn Văn B', '1224564789', 'Xuân Mai - Hà Nội', '1993-02-03', 'bnv@gmail.com', '0988756412', 'assets/avatar/store_ower/Default.png');
INSERT INTO "public"."profile" VALUES ('ST000004', 'Nguyễn Văn C', '1224564789', 'Xuân Mai - Hà Nội', '1993-02-03', 'cnv@gmail.com', '0988756412', 'assets/avatar/store_ower/Default.png');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS "public"."role";
CREATE TABLE "public"."role" (
"roleid" int4 NOT NULL,
"rolename" varchar(20) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO "public"."role" VALUES ('1', 'Shipper');
INSERT INTO "public"."role" VALUES ('2', 'Store');
INSERT INTO "public"."role" VALUES ('3', 'Admin');

-- ----------------------------
-- Table structure for stock
-- ----------------------------
DROP TABLE IF EXISTS "public"."stock";
CREATE TABLE "public"."stock" (
"stockid" int4 NOT NULL,
"name" varchar(50) COLLATE "default",
"address" varchar(100) COLLATE "default",
"adminid" varchar(20) COLLATE "default",
"addresscoordination" text COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of stock
-- ----------------------------
INSERT INTO "public"."stock" VALUES ('1', 'KarrayWell Cầu Giấy', '34 Xuân Thủy - Cầu Giấy - Hà Nội', 'AD000001', '5645645,545');
INSERT INTO "public"."stock" VALUES ('2', 'KarryWell Hoàn Kiếm', '77 Hoàn Kiếm - Hà Nội', 'AD000002', '56221,12121');

-- ----------------------------
-- Table structure for store
-- ----------------------------
DROP TABLE IF EXISTS "public"."store";
CREATE TABLE "public"."store" (
"storeid" varchar(8) COLLATE "default" NOT NULL,
"name" varchar(50) COLLATE "default",
"description" text COLLATE "default",
"address" varchar(100) COLLATE "default",
"latitude" varchar(30) COLLATE "default",
"longitude" varchar(30) COLLATE "default",
"phonenumber" varchar(11) COLLATE "default",
"email" varchar(50) COLLATE "default",
"avatar" varchar(50) COLLATE "default",
"registereddate" timestamp(6)
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of store
-- ----------------------------
INSERT INTO "public"."store" VALUES ('STR001', 'Domino Shop', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', '180 Hàng Bông,Hoàn Kiếm,Hà Nội,Việt Nam', '21.028893', '105.844896', '01645897445', 'khanhkc@gmail.com', 'assets/avatar/store/STR001.jpg', '2015-12-20 00:00:00');
INSERT INTO "public"."store" VALUES ('STR002', 'KFC Bà Triệu', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'Ngõ Bà Triệu,Lê Đại Hành,Hồ Tây, Hà Nội', '21.012502', '105.849192', '0955123485', 'khanhkc@gmail.com', 'assets/avatar/store/STR002.png', '2015-12-20 00:00:00');
INSERT INTO "public"."store" VALUES ('STR003', 'Starbucks Coffee', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', '314 Bà Triệu,Lê Đại Hành,Hai Bà Trưng,Hà Nội', '21.010529', '105.849393', '01664458155', 'nhungnth@gmail.com', 'assets/avatar/store/STR003.png', '2015-12-10 00:00:00');
INSERT INTO "public"."store" VALUES ('STR004', 'Shop Trẻ Thơ', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', '133 Thái Hà,Trung Liệt,Đống Đa,Hà Nội', '21.013311', '105.819571', '09445115123', 'nhungnth@gmail.com', 'assets/avatar/store/STR004.png', '2015-12-20 00:00:00');

-- ----------------------------
-- Table structure for task
-- ----------------------------
DROP TABLE IF EXISTS "public"."task";
CREATE TABLE "public"."task" (
"taskid" int4 DEFAULT nextval('task_taskid_seq'::regclass) NOT NULL,
"orderid" varchar(8) COLLATE "default",
"shipperid" varchar(20) COLLATE "default",
"adminid" varchar(20) COLLATE "default",
"statusid" int4,
"typeid" int4,
"taskdate" date
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of task
-- ----------------------------
INSERT INTO "public"."task" VALUES ('1', 'OD122222', 'SP000001', 'AD000001', '2', '1', '2015-11-09');
INSERT INTO "public"."task" VALUES ('2', 'OD981921', 'SP000001', 'AD000001', '2', '2', '2015-11-10');
INSERT INTO "public"."task" VALUES ('3', 'OD555461', 'SP000001', 'AD000001', '2', '3', '2015-11-11');
INSERT INTO "public"."task" VALUES ('4', 'OD123322', 'SP000002', 'AD000002', '2', '1', '2015-11-09');
INSERT INTO "public"."task" VALUES ('5', 'OD192851', 'SP000002', 'AD000002', '4', '4', '2015-11-11');
INSERT INTO "public"."task" VALUES ('6', 'OD999811', 'SP000002', 'AD000002', '2', '2', '2015-11-09');
INSERT INTO "public"."task" VALUES ('7', 'OD872818', 'SP000001', 'AD000001', '2', '1', '2015-11-09');
INSERT INTO "public"."task" VALUES ('8', 'OD901001', 'SP000001', 'AD000001', '2', '3', '2015-11-11');
INSERT INTO "public"."task" VALUES ('9', 'OD828101', 'SP000002', 'AD000001', '3', '2', '2015-11-09');
INSERT INTO "public"."task" VALUES ('10', 'OD666121', 'SP000001', 'AD000001', '2', '3', '2015-11-11');
INSERT INTO "public"."task" VALUES ('11', 'OD090909', 'SP000001', 'AD000001', '1', '1', '2015-11-09');
INSERT INTO "public"."task" VALUES ('12', 'OD190271', 'SP000002', 'AD000001', '2', '1', '2015-11-09');
INSERT INTO "public"."task" VALUES ('13', 'OD154444', 'SP000002', 'AD000002', '1', '1', '2015-11-08');

-- ----------------------------
-- Table structure for taskstatus
-- ----------------------------
DROP TABLE IF EXISTS "public"."taskstatus";
CREATE TABLE "public"."taskstatus" (
"statusid" int4 NOT NULL,
"statusname" varchar(20) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of taskstatus
-- ----------------------------
INSERT INTO "public"."taskstatus" VALUES ('1', 'Inactive');
INSERT INTO "public"."taskstatus" VALUES ('2', 'Active');
INSERT INTO "public"."taskstatus" VALUES ('3', 'Done');
INSERT INTO "public"."taskstatus" VALUES ('4', 'Fail');

-- ----------------------------
-- Table structure for tasktype
-- ----------------------------
DROP TABLE IF EXISTS "public"."tasktype";
CREATE TABLE "public"."tasktype" (
"typeid" int4 NOT NULL,
"typename" varchar(20) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of tasktype
-- ----------------------------
INSERT INTO "public"."tasktype" VALUES ('1', 'Pickup');
INSERT INTO "public"."tasktype" VALUES ('2', 'Ship');
INSERT INTO "public"."tasktype" VALUES ('3', 'Express');
INSERT INTO "public"."tasktype" VALUES ('4', 'Return');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS "public"."user";
CREATE TABLE "public"."user" (
"username" varchar(20) COLLATE "default" NOT NULL,
"password" varchar(255) COLLATE "default",
"userrole" int4,
"userstatus" int4
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO "public"."user" VALUES ('AD000001', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '3', '2');
INSERT INTO "public"."user" VALUES ('AD000002', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '3', '2');
INSERT INTO "public"."user" VALUES ('SP000001', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '1', '2');
INSERT INTO "public"."user" VALUES ('SP000002', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '1', '2');
INSERT INTO "public"."user" VALUES ('ST000001', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '2', '2');
INSERT INTO "public"."user" VALUES ('ST000002', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '2', '2');
INSERT INTO "public"."user" VALUES ('ST000003', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '2', '2');
INSERT INTO "public"."user" VALUES ('ST000004', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '2', '2');

-- ----------------------------
-- Table structure for userstatus
-- ----------------------------
DROP TABLE IF EXISTS "public"."userstatus";
CREATE TABLE "public"."userstatus" (
"statusid" int4 NOT NULL,
"statusname" varchar(10) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of userstatus
-- ----------------------------
INSERT INTO "public"."userstatus" VALUES ('1', 'Inactive');
INSERT INTO "public"."userstatus" VALUES ('2', 'Active');
INSERT INTO "public"."userstatus" VALUES ('3', 'Ban');

-- ----------------------------
-- Table structure for workingstatus
-- ----------------------------
DROP TABLE IF EXISTS "public"."workingstatus";
CREATE TABLE "public"."workingstatus" (
"statusid" int4 NOT NULL,
"statusname" varchar(255) COLLATE "default"
)
WITH (OIDS=FALSE)

;

-- ----------------------------
-- Records of workingstatus
-- ----------------------------

-- ----------------------------
-- Alter Sequences Owned By
-- ----------------------------
ALTER SEQUENCE "public"."generalledger_ledgerid_seq" OWNED BY "generalledger"."ledgerid";
ALTER SEQUENCE "public"."issue_issueid_seq" OWNED BY "issue"."issueid";
ALTER SEQUENCE "public"."task_taskid_seq" OWNED BY "task"."taskid";

-- ----------------------------
-- Primary Key structure for table bannedhistorylog
-- ----------------------------
ALTER TABLE "public"."bannedhistorylog" ADD PRIMARY KEY ("logid");

-- ----------------------------
-- Primary Key structure for table confirmationcode
-- ----------------------------
ALTER TABLE "public"."confirmationcode" ADD PRIMARY KEY ("codeid");

-- ----------------------------
-- Primary Key structure for table confirmationcodetype
-- ----------------------------
ALTER TABLE "public"."confirmationcodetype" ADD PRIMARY KEY ("typeid");

-- ----------------------------
-- Primary Key structure for table confirmationcodetypes
-- ----------------------------
ALTER TABLE "public"."confirmationcodetypes" ADD PRIMARY KEY ("typeid");

-- ----------------------------
-- Primary Key structure for table generalledger
-- ----------------------------
ALTER TABLE "public"."generalledger" ADD PRIMARY KEY ("ledgerid");

-- ----------------------------
-- Primary Key structure for table goods
-- ----------------------------
ALTER TABLE "public"."goods" ADD PRIMARY KEY ("goodsid");

-- ----------------------------
-- Primary Key structure for table issue
-- ----------------------------
ALTER TABLE "public"."issue" ADD PRIMARY KEY ("issueid");

-- ----------------------------
-- Primary Key structure for table issuecategory
-- ----------------------------
ALTER TABLE "public"."issuecategory" ADD PRIMARY KEY ("categoryid");

-- ----------------------------
-- Primary Key structure for table issuetype
-- ----------------------------
ALTER TABLE "public"."issuetype" ADD PRIMARY KEY ("typeid");

-- ----------------------------
-- Primary Key structure for table managestore
-- ----------------------------
ALTER TABLE "public"."managestore" ADD PRIMARY KEY ("managerid", "storeid");

-- ----------------------------
-- Primary Key structure for table order
-- ----------------------------
ALTER TABLE "public"."order" ADD PRIMARY KEY ("orderid");

-- ----------------------------
-- Primary Key structure for table orderissue
-- ----------------------------
ALTER TABLE "public"."orderissue" ADD PRIMARY KEY ("issueid", "orderid");

-- ----------------------------
-- Primary Key structure for table orderlog
-- ----------------------------
ALTER TABLE "public"."orderlog" ADD PRIMARY KEY ("logid");

-- ----------------------------
-- Primary Key structure for table orderstatus
-- ----------------------------
ALTER TABLE "public"."orderstatus" ADD PRIMARY KEY ("statusid");

-- ----------------------------
-- Primary Key structure for table ordertype
-- ----------------------------
ALTER TABLE "public"."ordertype" ADD PRIMARY KEY ("typeid");

-- ----------------------------
-- Primary Key structure for table profile
-- ----------------------------
ALTER TABLE "public"."profile" ADD PRIMARY KEY ("username");

-- ----------------------------
-- Primary Key structure for table role
-- ----------------------------
ALTER TABLE "public"."role" ADD PRIMARY KEY ("roleid");

-- ----------------------------
-- Primary Key structure for table stock
-- ----------------------------
ALTER TABLE "public"."stock" ADD PRIMARY KEY ("stockid");

-- ----------------------------
-- Primary Key structure for table store
-- ----------------------------
ALTER TABLE "public"."store" ADD PRIMARY KEY ("storeid");

-- ----------------------------
-- Primary Key structure for table task
-- ----------------------------
ALTER TABLE "public"."task" ADD PRIMARY KEY ("taskid");

-- ----------------------------
-- Primary Key structure for table taskstatus
-- ----------------------------
ALTER TABLE "public"."taskstatus" ADD PRIMARY KEY ("statusid");

-- ----------------------------
-- Primary Key structure for table tasktype
-- ----------------------------
ALTER TABLE "public"."tasktype" ADD PRIMARY KEY ("typeid");

-- ----------------------------
-- Primary Key structure for table user
-- ----------------------------
ALTER TABLE "public"."user" ADD PRIMARY KEY ("username");

-- ----------------------------
-- Primary Key structure for table userstatus
-- ----------------------------
ALTER TABLE "public"."userstatus" ADD PRIMARY KEY ("statusid");

-- ----------------------------
-- Primary Key structure for table workingstatus
-- ----------------------------
ALTER TABLE "public"."workingstatus" ADD PRIMARY KEY ("statusid");

-- ----------------------------
-- Foreign Key structure for table "public"."bannedhistorylog"
-- ----------------------------
ALTER TABLE "public"."bannedhistorylog" ADD FOREIGN KEY ("storeid") REFERENCES "public"."store" ("storeid") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."bannedhistorylog" ADD FOREIGN KEY ("shipperid") REFERENCES "public"."user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."bannedhistorylog" ADD FOREIGN KEY ("adminid") REFERENCES "public"."user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."confirmationcode"
-- ----------------------------
ALTER TABLE "public"."confirmationcode" ADD FOREIGN KEY ("typeid") REFERENCES "public"."confirmationcodetype" ("typeid") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."confirmationcode" ADD FOREIGN KEY ("orderid") REFERENCES "public"."order" ("orderid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."generalledger"
-- ----------------------------
ALTER TABLE "public"."generalledger" ADD FOREIGN KEY ("storeid") REFERENCES "public"."store" ("storeid") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."generalledger" ADD FOREIGN KEY ("adminid") REFERENCES "public"."user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."goods"
-- ----------------------------
ALTER TABLE "public"."goods" ADD FOREIGN KEY ("orderid") REFERENCES "public"."order" ("orderid") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."goods" ADD FOREIGN KEY ("stockid") REFERENCES "public"."stock" ("stockid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."issue"
-- ----------------------------
ALTER TABLE "public"."issue" ADD FOREIGN KEY ("typeid") REFERENCES "public"."issuetype" ("typeid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."issuetype"
-- ----------------------------
ALTER TABLE "public"."issuetype" ADD FOREIGN KEY ("categoryid") REFERENCES "public"."issuecategory" ("categoryid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."managestore"
-- ----------------------------
ALTER TABLE "public"."managestore" ADD FOREIGN KEY ("storeid") REFERENCES "public"."store" ("storeid") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."managestore" ADD FOREIGN KEY ("managerid") REFERENCES "public"."user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."order"
-- ----------------------------
ALTER TABLE "public"."order" ADD FOREIGN KEY ("ledgerid") REFERENCES "public"."generalledger" ("ledgerid") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."order" ADD FOREIGN KEY ("statusid") REFERENCES "public"."orderstatus" ("statusid") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."order" ADD FOREIGN KEY ("storeid") REFERENCES "public"."store" ("storeid") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."order" ADD FOREIGN KEY ("ordertypeid") REFERENCES "public"."ordertype" ("typeid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."orderissue"
-- ----------------------------
ALTER TABLE "public"."orderissue" ADD FOREIGN KEY ("orderid") REFERENCES "public"."order" ("orderid") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."orderissue" ADD FOREIGN KEY ("issueid") REFERENCES "public"."issue" ("issueid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."orderlog"
-- ----------------------------
ALTER TABLE "public"."orderlog" ADD FOREIGN KEY ("updater") REFERENCES "public"."user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."orderlog" ADD FOREIGN KEY ("orderid") REFERENCES "public"."order" ("orderid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."profile"
-- ----------------------------
ALTER TABLE "public"."profile" ADD FOREIGN KEY ("username") REFERENCES "public"."user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."stock"
-- ----------------------------
ALTER TABLE "public"."stock" ADD FOREIGN KEY ("adminid") REFERENCES "public"."user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."task"
-- ----------------------------
ALTER TABLE "public"."task" ADD FOREIGN KEY ("adminid") REFERENCES "public"."user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."task" ADD FOREIGN KEY ("shipperid") REFERENCES "public"."user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."task" ADD FOREIGN KEY ("typeid") REFERENCES "public"."tasktype" ("typeid") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."task" ADD FOREIGN KEY ("statusid") REFERENCES "public"."taskstatus" ("statusid") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."task" ADD FOREIGN KEY ("orderid") REFERENCES "public"."order" ("orderid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Key structure for table "public"."user"
-- ----------------------------
ALTER TABLE "public"."user" ADD FOREIGN KEY ("userstatus") REFERENCES "public"."userstatus" ("statusid") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."user" ADD FOREIGN KEY ("userrole") REFERENCES "public"."role" ("roleid") ON DELETE NO ACTION ON UPDATE NO ACTION;
