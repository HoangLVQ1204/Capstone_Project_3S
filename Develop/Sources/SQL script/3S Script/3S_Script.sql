	-- role
insert into role values ('1', 'Shipper');
insert into role values ('2', 'Store');
insert into role values ('3', 'Admin');

-- workingstatus

insert into workingstatus values ('1', 'On');
insert into workingstatus values ('2', 'Off');
insert into workingstatus values ('3', 'Busy');

-- user

insert into "user" values ('hoang', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '3', '1', '1');
insert into "user" values ('huykool', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '1', '1', '1');
insert into "user" values ('quyensheep', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '1', '1', '1');
insert into "user" values ('khanhkute', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '2', '1', '1');
insert into "user" values ('nhungkaka', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '2', '1', '1');
insert into "user" values ('khoangkiti', '$2a$10$029HEemrvDiCarL93NlTWOtjVvT4tPXJsahQyJygiKZTJBm43uXOq', '3', '1', '1');

-- profile

insert into profile values ('hoang', 'Nguyen Khac Hoang', '12213444', 'Ha Dong - Ha Noi', '1993-4-5', 'hoangnk@gmail.com', '0988277221', '1234,2344','assets/img/myavatar.jpg');
insert into profile values ('huykool', 'Tran Dinh Hoang Huy', '23221123', 'Da nang - Da Nang', '1993-5-1', 'huytdh@gmail.com', '0166466566', '43434,43434','myavatar.jpg');
insert into profile values ('quyensheep', 'Nguyen Van Quyen', '33323222', 'Luc Nam - Bac Giang', '1993-3-26', 'quyennv@gmail.com', '0167932122', '-34343,3434','myavatar.jpg');
insert into profile values ('khanhkute', 'Kieu Cao Khanh', '1232323', 'Thach That - Ha Noi', '1993-8-5', 'khanhkc@gmail.com', '093332212', '3434,-3434','myavatar.jpg');
insert into profile values ('nhungkaka', 'Nguyen Thi Hong Nhung', '232322', 'Xuan Mai - Son Tay', '1993-10-10', 'nhungnth@gmail.com', '0988888302', '-343443,-3434','myavatar.jpg');
insert into profile values ('khoangkiti', 'Nguyen Van Hoang', '122134433', 'Tu Son - Bac Ninh', '1993-2-2', 'hoangkiti@gmail.com', '09999999', '-232,-1111','myavatar.jpg');

-- store
insert into store values ('str1', 'habbit shop', 'beautiful shop', 'Tu Liem - Ha Noi', '21.005','105.834', '0988666543', 'str1@gmail.com','', '2015-4-5');
insert into store values ('str2', 'sheep shop', 'beautiful shop', 'Cau Giay - Ha Noi', '21.205','105.734', '0988262712', 'str2@gmail.com','', '2015-12-3');
insert into store values ('str3', 'wall shop', 'beautiful shop', 'Hoan Kiem - Ha Noi', '20.905','105.934', '0162928111', 'str3@gmail.com','', '2015-2-28');
 

-- managestore

insert into managestore values ('khanhkute', 'str1');
insert into managestore values ('nhungkaka', 'str2');


-- generalledger

insert into generalledger (adminid, storeid, amount, balance, paydate, note, payfrom, totaldelivery, totalcod) values ('khoangkiti', 'str1', null, '20000', '2015-10-24 00:00:00', 'Weekly total', null, '20000','0');
insert into generalledger (adminid, storeid, amount, balance, paydate, note, payfrom, totaldelivery, totalcod) values ('khoangkiti', 'str2', null, '-30000', '2015-10-24 00:00:00', 'Weekly total', null, '30000','60000');
insert into generalledger (adminid, storeid, amount, balance, paydate, note, payfrom, totaldelivery, totalcod) values ('khoangkiti', 'str3', null, '130000', '2015-10-24 00:00:00', 'Weekly total', null, '150000','20000');
insert into generalledger (adminid, storeid, amount, balance, paydate, note, payfrom, totaldelivery, totalcod) values ('hoang', 'str1', '10000', '10000', '2015-10-25 00:00:00', 'Pay to system', '1', '10000','0');
insert into generalledger (adminid, storeid, amount, balance, paydate, note, payfrom, totaldelivery, totalcod) values ('khoangkiti', 'str1', '10000', '0', '2015-10-26 00:00:00', 'Pay to system', '1', '0','0');

-- stock

insert into stock values ('1', 'Cau Giay Stock', '34 Xuan Thuy - Cau Giay - Ha Noi', 'hoang', '23123,2323');
insert into stock values ('2', 'Hoan Kiem Stock', 'Hoan Kiem - Ha Noi', 'khoangkiti', '12323,-2323');

-- orderstatus
-- 1: Trang thai tao don hang ban dau.
-- 2: Đến store lấy hàng
-- 3: Mang hàng về kho
-- 4: Hang luu trong kho
-- 5: Giao hang
-- Status Pending vs Cancel ở trong bảng order(isPending, isCancel)
-- 6: Done
-- 7: Cancel, store chua confirm
-- 8: Cancel,  order bi cancel
insert into orderstatus values ('1', 'Waiting');
insert into orderstatus values ('2', 'Picking up');
insert into orderstatus values ('3', 'Bring to stock');
insert into orderstatus values ('4', 'In stock');
insert into orderstatus values ('5', 'Delivering');
insert into orderstatus values ('6', 'Canceling');
insert into orderstatus values ('7', 'Done');

-- ordertype

insert into ordertype  values ('1', 'normal');
insert into ordertype  values ('2', 'express');


-- order
insert into "order" values ('ord1', 'str1', '1', 'Tu Liem - Ha Noi', 'Cau Giay - Ha Noi', '2015-3-19', '2015-3-21','2015-10-5','2015-10-6', '01687555261', 'Nguyen Van Quyen', '1', '1', 'false', 'false','false', '20000', '0', '21.005,105.834', '21.005,105.834');
insert into "order" values ('ord2', 'str2', '2', 'Ho Tung Mau - Ha Noi', 'Hoan Kiem - Ha Noi', '2015-5-23', '2015-5-25','2015-10-5','2015-10-5', '0988627075', 'Nguyen Van Long', '1', '1', 'false', 'false', 'false', '0', '2000000', '21.005,105.834', '21.005,105.834');
insert into "order" values ('ord3', 'str3', '1', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5','2015-10-5', '0988627975', 'Nguyen Van Binh', '1', '5', 'false', 'false', 'false', '10000', '400000', '21.115,105.734', '20.975,105.754');
insert into "order" values ('ord4', 'str2', '1', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5','2015-10-5', '0988627975', 'Nguyen Van Binh', '1', '2', 'false', 'false', 'false', '10000', '400000', '21.031,105.756', '21.123,105.847');
insert into "order" values ('ord5', 'str2', '1', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5','2015-10-5', '0988627975', 'Nguyen Van Binh', '1', '1', 'false', 'false', 'false', '10000', '400000', '21.047,105.834', '21.167,105.819');
insert into "order" values ('ord6', 'str2', '1', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5','2015-10-5', '0988627975', 'Nguyen Van Binh', '1', '5', 'false', 'false', 'false', '10000', '400000', '21.030,105.834', '21.029,105.843');
insert into "order" values ('ord7', 'str2', '1', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '1', '1', 'false', 'false', 'false', '10000', '400000', '21.031,105.834', '21.028,105.894');
insert into "order" values ('ord8', 'str2', '1', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '7', 'true', 'false', 'false', '10000', '400000', '21.125,105.834', '21.027,105.648');
insert into "order" values ('ord9', 'str2', '1', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '1', 'true', 'false', 'false', '10000', '400000', '21.032,105.834', '21.026,105.759');
insert into "order" values ('ord10', 'str2', '1', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2',null,null, '0988627975', 'Nguyen Van Binh', '2',null, 'false', 'true', 'false', '10000', '400000', '21.033,105.834', '21.005,025.4568');
insert into "order" values ('ord11', 'str2', '2', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2',null,null, '0988627975', 'Nguyen Van Binh', '2',null, 'false', 'true', 'false', '10000', '400000', '21.097,105.834', '21.005,024.975');
insert into "order" values ('ord12', 'str2', '2', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2',null,null, '0988627975', 'Nguyen Van Binh', '2',null, 'false', 'true', 'false', '10000', '400000', '21.095,105.834', '21.005,013.358');
insert into "order" values ('ord13', 'str2', '2', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2',null,null, '0988627975', 'Nguyen Van Binh', '2', null, 'false', 'true', 'false', '10000', '400000', '21.093,105.834', '21.005,112.875');
insert into "order" values ('ord14', 'str2', '2', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '3', 'true', 'false', 'false', '10000', '400000', '21.091,105.834', '21.011,105.896');
insert into "order" values ('ord15', 'str2', '2', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '4', 'false', 'false', 'false', '10000', '400000', '21.044,105.834', '21.154,105.869');
insert into "order" values ('ord16', 'str2', '2', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '5', 'false', 'false', 'false', '10000', '400000', '21.052,105.834', '21.155,105.848');
insert into "order" values ('ord17', 'str2', '2', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '5', 'true', 'false', 'true', '10000', '400000', '21.056,105.834', '21.166,105.853');
insert into "order" values ('ord18', 'str2', '2', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '6', 'false', 'false', 'true', '10000', '400000', '21.058,105.834', '21.187,105.784');
insert into "order" values ('ord19', 'str2', '2', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '7', 'false', 'false', 'true', '10000', '400000', '21.033,105.834', '21.155,105.734');
insert into "order" values ('ord20', 'str2', '2', 'Cát Linh, Ba Đình, Hà Nội, Việt Nam', '112 Giảng Võ, Đống Đa,  Hà Nội, Việt Nam', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '7', 'false', 'false', 'true', '10000', '400000', '21.023,105.834', '21.365,105.769');


-- taskstatus
insert into taskstatus VALUES  ('1', 'NotActive');
insert into taskstatus VALUES ('2', 'Actived');
insert into taskstatus  VALUES ('3', 'Done');
insert into taskstatus VALUES ('4', 'Fail');
-- tasktype
insert into tasktype VALUES ('1', 'Pickup');
insert into tasktype  VALUES ('2', 'Ship');
insert into tasktype VALUES ('3', 'Express');
insert into tasktype VALUES ('4', 'Return');

-- task
insert into task(orderid, shipperid, adminID, statusID, typeID, taskDate) values ('ord1', 'huykool', 'khoangkiti', '1', '1', '2015-2-9');
insert into task(orderid, shipperid, adminID, statusID, typeID, taskDate) values ('ord2', 'quyensheep', 'hoang', '1', '1', '2015-2-10');
insert into task(orderid, shipperid, adminID, statusID, typeID, taskDate) values ('ord3', 'huykool', 'hoang', '2', '2', '2015-2-10');
insert into task(orderid, shipperid, adminID, statusID, typeID, taskDate) values ('ord4', 'huykool', 'hoang', '3', '1',  '2015-2-15');
insert into task(orderid, shipperid, adminID, statusID, typeID, taskDate) values ('ord5', 'huykool', 'hoang', '4', '1', '2015-2-10');
insert into task(orderid, shipperid, adminID, statusID, typeID, taskDate) values ('ord6', 'huykool', 'hoang', '2', '2',  '2015-2-15');
insert into task(orderid, shipperid, adminID, statusID, typeID, taskDate) values ('ord7', 'huykool', 'hoang', '4', '3', '2015-2-9');
insert into task(orderid, shipperid, adminID, statusID, typeID, taskDate) values ('ord8', 'huykool', 'hoang', '2', '4', '2015-2-10');


-- goods

insert into goods values ('1', 'Apricot', 'ord1',null, '32.00', '20', '50', '35', 'Very height', '2');
insert into goods values ('2', 'Asparagus', 'ord2', null, '34.00', '34', '34', '50', 'Very width', '1');
insert into goods values ('3', 'Aubergine', 'ord3', null, '34.00', '34', '34', '50', 'Very width', '3');
insert into goods values ('4', 'Avocado', 'ord4', null, '34.00', '34', '34', '50', 'Very width', '1');
insert into goods values ('5', 'Banana', 'ord5', null, '34.00', '34', '34', '50', 'Very width', '4');
insert into goods values ('6', 'Banana', 'ord6', null, '34.00', '34', '34', '50', 'Very width', '1');
insert into goods values ('7', 'Beetroot', 'ord7', null, '34.00', '34', '34', '50', 'Very width', '2');
insert into goods values ('8', 'Black-eye bean', 'ord8', null, '34.00', '34', '34', '50', 'Very width', '3');
insert into goods values ('9', 'Broad bean', 'ord9', null, '34.00', '34', '34', '50', 'Very width', '1');
insert into goods values ('10', 'Broccoli', 'ord10', null, '34.00', '34', '34', '50', 'Very width', '4');
insert into goods values ('11', 'Broccoli', 'ord11', null, '34.00', '34', '34', '50', 'Very width', '3');
insert into goods values ('12', 'Brussels sprout', 'ord12', null, '34.00', '34', '34', '50', 'Very width', '2');
insert into goods values ('13', 'Butternut Squash', 'ord13', null, '34.00', '34', '34', '50', 'Very width', '1');
insert into goods values ('14', 'Carrot', 'ord14', null, '34.00', '34', '34', '50', 'Very width', '3');
insert into goods values ('15', 'Cherry', 'ord15', '2', '34.00', '34', '34', '50', 'Very width', '2');
insert into goods values ('16', 'Clementine', 'ord16', null, '34.00', '34', '34', '50', 'Very width', '4');
insert into goods values ('17', 'Courgette', 'ord17', null, '34.00', '34', '34', '50', 'Very width', '1');
insert into goods values ('18', 'Date', 'ord18', null, '34.00', '34', '34', '50', 'Very width', '4');
insert into goods values ('19', 'Elderberry', 'ord19', null, '34.00', '34', '34', '50', 'Very width', '2');
insert into goods values ('20', 'Endive', 'ord20', null, '34.00', '34', '34', '50', 'Very width', '3');

-- confirmationcodetype
insert into confirmationcodetype values ('2', 'Gathering');
insert into confirmationcodetype values ('3', 'In Stock');
insert into confirmationcodetype values ('5', 'Return store');
insert into confirmationcodetype values ('6', 'Deliver');

-- confirmationcode
insert into confirmationcode values ('1', '234222', '2', 'ord1');
insert into confirmationcode values ('2', '233333', '3', 'ord1');
insert into confirmationcode values ('3', '333222', '5', 'ord1');
insert into confirmationcode values ('4', '122111', '6', 'ord1');

insert into confirmationcode values ('5', '123987', '2', 'ord2');
insert into confirmationcode values ('6', '998022', '3', 'ord2');
insert into confirmationcode values ('7', '090909', '5', 'ord2');
insert into confirmationcode values ('8', '080872', '6', 'ord2');

insert into confirmationcode values( '9', '123459', '2', 'ord3');
insert into confirmationcode values( '10', '123460', '3', 'ord3');
insert into confirmationcode values( '11', '123461', '5', 'ord3');
insert into confirmationcode values( '12', '123462', '6', 'ord3');

insert into confirmationcode values( '13', '123463', '2', 'ord4');
insert into confirmationcode values( '14', '123464', '3', 'ord4');
insert into confirmationcode values( '15', '123465', '5', 'ord4');
insert into confirmationcode values( '16', '123466', '6', 'ord4');

insert into confirmationcode values( '17', '123467', '2', 'ord5');
insert into confirmationcode values( '18', '123468', '3', 'ord5');
insert into confirmationcode values( '19', '123469', '5', 'ord5');
insert into confirmationcode values( '20', '123470', '6', 'ord5');

insert into confirmationcode values( '21', '123471', '2', 'ord6');
insert into confirmationcode values( '22', '123472', '3', 'ord6');
insert into confirmationcode values( '23', '123473', '5', 'ord6');
insert into confirmationcode values( '24', '123474', '6', 'ord6');

insert into confirmationcode values( '25', '123475', '2', 'ord7');
insert into confirmationcode values( '26', '123476', '3', 'ord7');
insert into confirmationcode values( '27', '123477', '5', 'ord7');
insert into confirmationcode values( '28', '123478', '6', 'ord7');

insert into confirmationcode values( '29', '123479', '2', 'ord8');
insert into confirmationcode values( '30', '123480', '3', 'ord8');
insert into confirmationcode values( '31', '123481', '5', 'ord8');
insert into confirmationcode values( '32', '123482', '6', 'ord8');
insert into confirmationcode values( '33', '123483', '2', 'ord9');
insert into confirmationcode values( '34', '123484', '3', 'ord9');
insert into confirmationcode values( '35', '123485', '5', 'ord9');
insert into confirmationcode values( '36', '123486', '6', 'ord9');
insert into confirmationcode values( '37', '123487', '2', 'ord10');
insert into confirmationcode values( '38', '123488', '3', 'ord10');
insert into confirmationcode values( '39', '123489', '5', 'ord10');
insert into confirmationcode values( '40', '123490', '6', 'ord10');
insert into confirmationcode values( '41', '123491', '2', 'ord11');
insert into confirmationcode values( '42', '123492', '3', 'ord11');
insert into confirmationcode values( '43', '123493', '5', 'ord11');
insert into confirmationcode values( '44', '123494', '6', 'ord11');
insert into confirmationcode values( '45', '123495', '2', 'ord12');
insert into confirmationcode values( '46', '123496', '3', 'ord12');
insert into confirmationcode values( '47', '123497', '5', 'ord12');
insert into confirmationcode values( '48', '123498', '6', 'ord12');
insert into confirmationcode values( '49', '123499', '2', 'ord13');
insert into confirmationcode values( '50', '123500', '3', 'ord13');
insert into confirmationcode values( '51', '123501', '5', 'ord13');
insert into confirmationcode values( '52', '123502', '6', 'ord13');
insert into confirmationcode values( '53', '123503', '2', 'ord14');
insert into confirmationcode values( '54', '123504', '3', 'ord14');
insert into confirmationcode values( '55', '123505', '5', 'ord14');
insert into confirmationcode values( '56', '123506', '6', 'ord14');
insert into confirmationcode values( '57', '123507', '2', 'ord15');
insert into confirmationcode values( '58', '123508', '3', 'ord15');
insert into confirmationcode values( '59', '123509', '5', 'ord15');
insert into confirmationcode values( '60', '123510', '6', 'ord15');
insert into confirmationcode values( '61', '123511', '2', 'ord16');
insert into confirmationcode values( '62', '123512', '3', 'ord16');
insert into confirmationcode values( '63', '123513', '5', 'ord16');
insert into confirmationcode values( '64', '123514', '6', 'ord16');
insert into confirmationcode values( '65', '123515', '2', 'ord17');
insert into confirmationcode values( '66', '123516', '3', 'ord17');
insert into confirmationcode values( '67', '123517', '5', 'ord17');
insert into confirmationcode values( '68', '123518', '6', 'ord17');
insert into confirmationcode values( '69', '123519', '2', 'ord18');
insert into confirmationcode values( '70', '123520', '3', 'ord18');
insert into confirmationcode values( '71', '123521', '5', 'ord18');
insert into confirmationcode values( '72', '123522', '6', 'ord18');
insert into confirmationcode values( '73', '123523', '2', 'ord19');
insert into confirmationcode values( '74', '123524', '3', 'ord19');
insert into confirmationcode values( '75', '123525', '5', 'ord19');
insert into confirmationcode values( '76', '123526', '6', 'ord19');
insert into confirmationcode values( '77', '123527', '2', 'ord20');
insert into confirmationcode values( '78', '123528', '3', 'ord20');
insert into confirmationcode values( '79', '123529', '5', 'ord20');
insert into confirmationcode values( '80', '123530', '6', 'ord20');

-- issuecategory
insert into issuecategory  values ('1', 'Pending');
insert into issuecategory  values ('2', 'Cancel');

--issue Type
insert into issuetype values ('1', '1', 'Traffic jam');
insert into issuetype values ('2', '1', 'Vehicle');
insert into issuetype values ('3', '1', 'Accident');
insert into issuetype values ('4', '2', 'Goods is broken');
insert into issuetype values ('5', '2', 'Cannot contact with customer');
insert into issuetype values ('6', '1', 'Other');
insert into issuetype values ('7', '2', 'Other');


-- issue:id, issuecategory, reason, description
insert into issue (typeid, description, isresolved, createddate)   values ('1', 'Tắc đường quá, em chưa đi tiếp được', 'false', '2015-11-1');
insert into issue (typeid, description, isresolved, createddate)    values ('1', 'Em bị hỏng xe, đang vá xăm', 'false', '2015-11-1');
insert into issue (typeid, description, isresolved, createddate)    values ('1', 'Em vừa bị tai nạn nhẹ, xin phép giao chậm', 'true', '2015-11-1');
insert into issue (typeid, description, isresolved, createddate)    values ('2', 'Các đơn hàng này bị hỏng rồi, Admin xem giúp em', 'true', '2015-11-1');

-- orderissue
insert into orderissue values ('1', 'ord1');
insert into orderissue values ('2', 'ord1');
insert into orderissue values ('3', 'ord2');
insert into orderissue values ('4', 'ord2');

-- orderlog
insert into orderlog  values ('1', 'ord1', 'str1', '1', '1', 'Tu Liem - Ha Noi', 'Cau Giay - Ha Noi', '2015-3-19', '2015-3-21', '01687555261', 'Nguyen Van Quyen', '1', '1', '20000', '0', '21.015,105.854', '21.025,105.884', '2015-9-8', 'khoangkiti');
insert into orderlog values ('2', 'ord2', 'str2', '2', '2', 'Ho Tung Mau - Ha Noi', 'Hoan Kiem - Ha Noi', '2015-5-23', '2015-5-25', '0988627075', 'Nguyen Van Long', '2', '2', '0', '2000000', '21.045,105.834', '21.105,105.854', '2015-4-5', 'hoang');

-- bannedhistorylog
insert into bannedhistorylog values ('1', 'khoangkiti', 'quyensheep', 'Reject order', '2015-9-8');