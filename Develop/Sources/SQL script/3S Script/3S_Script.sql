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

insert into profile values ('hoang', 'Nguyen Khac Hoang', '12213444', 'Ha Dong - Ha Noi', '1993-4-5', 'hoangnk@gmail.com', '0988277221', '1234,2344');
insert into profile values ('huykool', 'Tran Dinh Hoang Huy', '23221123', 'Da nang - Da Nang', '1993-5-1', 'huytdh@gmail.com', '0166466566', '43434,43434');
insert into profile values ('quyensheep', 'Nguyen Van Quyen', '33323222', 'Luc Nam - Bac Giang', '1993-3-26', 'quyennv@gmail.com', '0167932122', '-34343,3434');
insert into profile values ('khanhkute', 'Kieu Cao Khanh', '1232323', 'Thach That - Ha Noi', '1993-8-5', 'khanhkc@gmail.com', '093332212', '3434,-3434');
insert into profile values ('nhungkaka', 'Nguyen Thi Hong Nhung', '232322', 'Xuan Mai - Son Tay', '1993-10-10', 'nhungnth@gmail.com', '0988888302', '-343443,-3434');
insert into profile values ('khoangkiti', 'Nguyen Van Hoang', '122134433', 'Tu Son - Bac Ninh', '1993-2-2', 'hoangkiti@gmail.com', '09999999', '-232,-1111');

-- store
insert into store values ('str1', 'habbit shop', 'beautiful shop', 'Tu Liem - Ha Noi', '2323,2323', '0988666543', 'str1@gmail.com', '2015-4-5');
insert into store values ('str2', 'sheep shop', 'beautiful shop', 'Cau Giay - Ha Noi', '-2323,928392', '0988262712', 'str2@gmail.com', '2015-12-3');
insert into store values ('str3', 'wall shop', 'beautiful shop', 'Hoan Kiem - Ha Noi', '-23232,-2332223', '0162928111', 'str3@gmail.com', '2015-2-28');
 

-- managestore

insert into managestore values ('khanhkute', 'str1');
insert into managestore values ('nhungkaka', 'str2');


-- generalledger

insert into generalledger values ('1', 'khoangkiti', 'str1', null, '20000', '2015-10-24 00:00:00', 'Weekly total', null, '20000','0');
insert into generalledger values ('2', 'khoangkiti', 'str2', null, '-30000', '2015-10-24 00:00:00', 'Weekly total', null, '30000','60000');
insert into generalledger values ('3', 'khoangkiti', 'str3', null, '130000', '2015-10-24 00:00:00', 'Weekly total', null, '150000','20000');
insert into generalledger values ('4', 'hoang', 'str1', '10000', '10000', '2015-10-25 00:00:00', 'Pay to system', '1', '10000','0');
insert into generalledger values ('5', 'khoangkiti', 'str1', '10000', '0', '2015-10-26 00:00:00', 'Pay to system', '1', '0','0');

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
insert into orderstatus values ('6', 'Done');
insert into orderstatus values ('7', 'Canceling');
insert into orderstatus values ('8', 'Cancel');

-- ordertype

insert into ordertype  values ('1', 'normal');
insert into ordertype  values ('2', 'express');


-- order
insert into "order" values ('ord1', 'str1', '1', 'Tu Liem - Ha Noi', 'Cau Giay - Ha Noi', '2015-3-19', '2015-3-21','2015-10-5','2015-10-6', '01687555261', 'Nguyen Van Quyen', '1', '8', 'false', 'false','false', '20000', '0', '23232,32323', '2323,23232');
insert into "order" values ('ord2', 'str2', '2', 'Ho Tung Mau - Ha Noi', 'Hoan Kiem - Ha Noi', '2015-5-23', '2015-5-25','2015-10-5','2015-10-5', '0988627075', 'Nguyen Van Long', '1', '8', 'false', 'false', 'false', '0', '2000000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord3', 'str3', '1', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5','2015-10-5', '0988627975', 'Nguyen Van Binh', '1', '8', 'false', 'false', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord4', 'str2', '1', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5','2015-10-5', '0988627975', 'Nguyen Van Binh', '1', '8', 'false', 'false', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord5', 'str2', '1', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5','2015-10-5', '0988627975', 'Nguyen Van Binh', '1', '8', 'false', 'false', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord6', 'str2', '1', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5','2015-10-5', '0988627975', 'Nguyen Van Binh', '1', '8', 'false', 'false', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord7', 'str2', '1', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '1', '2', 'false', 'false', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord8', 'str2', '1', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '1', 'true', 'false', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord9', 'str2', '1', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '1', 'true', 'false', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord10', 'str2', '1', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2',null,null, '0988627975', 'Nguyen Van Binh', '2',null, 'false', 'true', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord11', 'str2', '2', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2',null,null, '0988627975', 'Nguyen Van Binh', '2',null, 'false', 'true', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord12', 'str2', '2', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2',null,null, '0988627975', 'Nguyen Van Binh', '2',null, 'false', 'true', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord13', 'str2', '2', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2',null,null, '0988627975', 'Nguyen Van Binh', '2', null, 'false', 'true', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord14', 'str2', '2', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '3', 'true', 'false', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord15', 'str2', '2', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '4', 'false', 'false', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord16', 'str2', '2', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '5', 'false', 'false', 'false', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord17', 'str2', '2', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '5', 'true', 'false', 'true', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord18', 'str2', '2', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '6', 'false', 'false', 'true', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord19', 'str2', '2', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '7', 'false', 'false', 'true', '10000', '400000', '2323,-23233', '2323,-23233');
insert into "order" values ('ord20', 'str2', '2', 'Thuy Khue - Ha Noi', 'Hoang Hoa Tham - Ha Noi', '2015-1-1', '2015-1-2','2015-10-5',null, '0988627975', 'Nguyen Van Binh', '2', '7', 'false', 'false', 'true', '10000', '400000', '2323,-23233', '2323,-23233');


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
insert into task values ('1','ord1', 'huykool', 'khoangkiti', '1','2015-2-9');
insert into task values ('2','ord2', 'quyensheep', 'hoang', '1', '2015-2-10');
insert into task values ('3','ord3', 'huykool', 'hoang', '2', '2015-2-15');

-- goods

insert into goods values ('1', 'ord1',null, '32.00', '20', '50', '35', 'Very height', '2');
insert into goods values ('2', 'ord2', null, '34.00', '34', '34', '50', 'Very width', '1');
insert into goods values ('3', 'ord3', null, '34.00', '34', '34', '50', 'Very width', '3');
insert into goods values ('4', 'ord4', null, '34.00', '34', '34', '50', 'Very width', '1');
insert into goods values ('5', 'ord5', null, '34.00', '34', '34', '50', 'Very width', '4');
insert into goods values ('6', 'ord6', null, '34.00', '34', '34', '50', 'Very width', '1');
insert into goods values ('7', 'ord7', null, '34.00', '34', '34', '50', 'Very width', '2');
insert into goods values ('8', 'ord8', null, '34.00', '34', '34', '50', 'Very width', '3');
insert into goods values ('9', 'ord9', null, '34.00', '34', '34', '50', 'Very width', '1');
insert into goods values ('10', 'ord10', null, '34.00', '34', '34', '50', 'Very width', '4');
insert into goods values ('11', 'ord11', null, '34.00', '34', '34', '50', 'Very width', '3');
insert into goods values ('12', 'ord12', null, '34.00', '34', '34', '50', 'Very width', '2');
insert into goods values ('13', 'ord13', null, '34.00', '34', '34', '50', 'Very width', '1');
insert into goods values ('14', 'ord14', null, '34.00', '34', '34', '50', 'Very width', '3');
insert into goods values ('15', 'ord15', '2', '34.00', '34', '34', '50', 'Very width', '2');
insert into goods values ('16', 'ord16', null, '34.00', '34', '34', '50', 'Very width', '4');
insert into goods values ('17', 'ord17', null, '34.00', '34', '34', '50', 'Very width', '1');
insert into goods values ('18', 'ord18', null, '34.00', '34', '34', '50', 'Very width', '4');
insert into goods values ('19', 'ord19', null, '34.00', '34', '34', '50', 'Very width', '2');
insert into goods values ('20', 'ord20', null, '34.00', '34', '34', '50', 'Very width', '3');

-- confirmationcodetype
insert into confirmationcodetype values ('1', 'Gathering');
insert into confirmationcodetype values ('2', 'In Stock');
insert into confirmationcodetype values ('3', 'Out Stock');
insert into confirmationcodetype values ('4', 'Deliver');

-- confirmationcode
insert into confirmationcode values ('1', '234222', '1', 'ord1');
insert into confirmationcode values ('2', '233333', '2', 'ord1');
insert into confirmationcode values ('3', '333222', '3', 'ord1');
insert into confirmationcode values ('4', '122111', '4', 'ord1');

insert into confirmationcode values ('5', '123987', '1', 'ord2');
insert into confirmationcode values ('6', '998022', '2', 'ord2');
insert into confirmationcode values ('7', '090909', '3', 'ord2');
insert into confirmationcode values ('8', '080872', '4', 'ord2');

insert into confirmationcode values( '9', '123459', '1', 'ord3');
insert into confirmationcode values( '10', '123460', '2', 'ord3');
insert into confirmationcode values( '11', '123461', '3', 'ord3');
insert into confirmationcode values( '12', '123462', '4', 'ord3');
insert into confirmationcode values( '13', '123463', '1', 'ord4');
insert into confirmationcode values( '14', '123464', '2', 'ord4');
insert into confirmationcode values( '15', '123465', '3', 'ord4');
insert into confirmationcode values( '16', '123466', '4', 'ord4');
insert into confirmationcode values( '17', '123467', '1', 'ord5');
insert into confirmationcode values( '18', '123468', '2', 'ord5');
insert into confirmationcode values( '19', '123469', '3', 'ord5');
insert into confirmationcode values( '20', '123470', '4', 'ord5');
insert into confirmationcode values( '21', '123471', '1', 'ord6');
insert into confirmationcode values( '22', '123472', '2', 'ord6');
insert into confirmationcode values( '23', '123473', '3', 'ord6');
insert into confirmationcode values( '24', '123474', '4', 'ord6');
insert into confirmationcode values( '25', '123475', '1', 'ord7');
insert into confirmationcode values( '26', '123476', '2', 'ord7');
insert into confirmationcode values( '27', '123477', '3', 'ord7');
insert into confirmationcode values( '28', '123478', '4', 'ord7');
insert into confirmationcode values( '29', '123479', '1', 'ord8');
insert into confirmationcode values( '30', '123480', '2', 'ord8');
insert into confirmationcode values( '31', '123481', '3', 'ord8');
insert into confirmationcode values( '32', '123482', '4', 'ord8');
insert into confirmationcode values( '33', '123483', '1', 'ord9');
insert into confirmationcode values( '34', '123484', '2', 'ord9');
insert into confirmationcode values( '35', '123485', '3', 'ord9');
insert into confirmationcode values( '36', '123486', '4', 'ord9');
insert into confirmationcode values( '37', '123487', '1', 'ord10');
insert into confirmationcode values( '38', '123488', '2', 'ord10');
insert into confirmationcode values( '39', '123489', '3', 'ord10');
insert into confirmationcode values( '40', '123490', '4', 'ord10');
insert into confirmationcode values( '41', '123491', '1', 'ord11');
insert into confirmationcode values( '42', '123492', '2', 'ord11');
insert into confirmationcode values( '43', '123493', '3', 'ord11');
insert into confirmationcode values( '44', '123494', '4', 'ord11');
insert into confirmationcode values( '45', '123495', '1', 'ord12');
insert into confirmationcode values( '46', '123496', '2', 'ord12');
insert into confirmationcode values( '47', '123497', '3', 'ord12');
insert into confirmationcode values( '48', '123498', '4', 'ord12');
insert into confirmationcode values( '49', '123499', '1', 'ord13');
insert into confirmationcode values( '50', '123500', '2', 'ord13');
insert into confirmationcode values( '51', '123501', '3', 'ord13');
insert into confirmationcode values( '52', '123502', '4', 'ord13');
insert into confirmationcode values( '53', '123503', '1', 'ord14');
insert into confirmationcode values( '54', '123504', '2', 'ord14');
insert into confirmationcode values( '55', '123505', '3', 'ord14');
insert into confirmationcode values( '56', '123506', '4', 'ord14');
insert into confirmationcode values( '57', '123507', '1', 'ord15');
insert into confirmationcode values( '58', '123508', '2', 'ord15');
insert into confirmationcode values( '59', '123509', '3', 'ord15');
insert into confirmationcode values( '60', '123510', '4', 'ord15');
insert into confirmationcode values( '61', '123511', '1', 'ord16');
insert into confirmationcode values( '62', '123512', '2', 'ord16');
insert into confirmationcode values( '63', '123513', '3', 'ord16');
insert into confirmationcode values( '64', '123514', '4', 'ord16');
insert into confirmationcode values( '65', '123515', '1', 'ord17');
insert into confirmationcode values( '66', '123516', '2', 'ord17');
insert into confirmationcode values( '67', '123517', '3', 'ord17');
insert into confirmationcode values( '68', '123518', '4', 'ord17');
insert into confirmationcode values( '69', '123519', '1', 'ord18');
insert into confirmationcode values( '70', '123520', '2', 'ord18');
insert into confirmationcode values( '71', '123521', '3', 'ord18');
insert into confirmationcode values( '72', '123522', '4', 'ord18');
insert into confirmationcode values( '73', '123523', '1', 'ord19');
insert into confirmationcode values( '74', '123524', '2', 'ord19');
insert into confirmationcode values( '75', '123525', '3', 'ord19');
insert into confirmationcode values( '76', '123526', '4', 'ord19');
insert into confirmationcode values( '77', '123527', '1', 'ord20');
insert into confirmationcode values( '78', '123528', '2', 'ord20');
insert into confirmationcode values( '79', '123529', '3', 'ord20');
insert into confirmationcode values( '80', '123530', '4', 'ord20');

-- issuecategory
insert into issuecategory  values ('1', 'Ca Nhan');
insert into issuecategory  values ('2', 'Phuong Tien');
insert into issuecategory  values ('3', 'Thoi Tiet');

-- issuepriority
--insert into issuepriority values ('1', 'High');
--insert into issuepriority values ('2', 'Medium');
--insert into issuepriority values ('3', 'Low');

-- issue
insert into issue (category,content)   values ('1', 'Toi co viec ban');
insert into issue (category,content)   values ('1', 'Hom nay co bao');
insert into issue (category,content)   values ('2', 'Xe toi bi thung nop');
insert into issue (category,content)   values ('2', 'Dien thoai toi het pin');
insert into issue (category,content)   values ('3', 'Hom nay co bao');

-- orderissue
insert into orderissue values ('1', 'ord1', '2015-12-4', 'this is description 1');
insert into orderissue values ('2', 'ord1', '2015-12-4', 'this is description 2');
insert into orderissue values ('3', 'ord2', '2015-4-19', 'this is description 3');
insert into orderissue values ('4', 'ord2', '2015-4-19', 'this is description 4');

-- orderlog
insert into orderlog  values ('1', 'ord1', 'str1', '1', '1', 'Tu Liem - Ha Noi', 'Cau Giay - Ha Noi', '2015-3-19', '2015-3-21', '01687555261', 'Nguyen Van Quyen', '1', '1', '20000', '0', '23232,32323', '2323,23232', '2015-9-8', 'khoangkiti');
insert into orderlog values ('2', 'ord2', 'str2', '2', '2', 'Ho Tung Mau - Ha Noi', 'Hoan Kiem - Ha Noi', '2015-5-23', '2015-5-25', '0988627075', 'Nguyen Van Long', '2', '2', '0', '2000000', '2323,-23233', '2323,-23233', '2015-4-5', 'hoang');

-- bannedhistorylog
insert into bannedhistorylog values ('1', 'khoangkiti', 'quyensheep', 'Reject order', '2015-9-8');