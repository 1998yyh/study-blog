# mysql

```sql
UPDATE `hello-mysql`.`student` SET `email` = 'xxx@qq.com' WHERE (`id` = '10');
UPDATE `hello-mysql`.`student` SET `email` = 'xxx@qq.com' WHERE (`id` = '2');

DELETE FROM `hello-mysql`.`student` WHERE (`id` = '2');
```

## 基础操作

以学生表为例子


1. 创建表 
``` sql
CREATE TABLE student(
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Id',
    name VARCHAR(50) NOT NULL COMMENT '学生名',
    gender VARCHAR(10) NOT NULL COMMENT '性别',
    age INT NOT NULL COMMENT '年龄',
    class VARCHAR(50) NOT NULL COMMENT '班级名',
    score INT NOT NULL COMMENT '分数'
) CHARSET=utf8mb4

```


2. 删除表
``` sql
drop table student;
```

3. 查询整表
``` sql
SELECT * FROM student;
```

4. 插入数据
``` sql
INSERT INTO student (name, gender, age, class, score)
  VALUES 
    ('张三', '男',18, '一班',90),
    ('李四', '女',19, '二班',85),
    ('王五', '男',20, '三班',70),
    ('赵六', '女',18, '一班',95),
    ('钱七', '男',19, '二班',80),
    ('孙八', '女',20, '三班',75),
    ('周九', '男',18, '一班',85),
    ('吴十', '女',19, '二班',90),
    ('郑十一', '男',20, '三班',60),
    ('王十二', '女',18, '一班',95),
    ('赵十三', '男',19, '二班',75),
    ('钱十四', '女',20, '三班',80),
    ('孙十五', '男',18, '一班',90),
    ('周十六', '女',19, '二班',85),
    ('吴十七', '男',20, '三班',70),
    ('郑十八', '女',18, '一班',95),
    ('王十九', '男',19, '二班',80),
    ('赵二十', '女',20, '三班',75);
```

5. 指定列查询

``` sql
SELECT name, score FROM student;
SELECT name as "名字", score as "分数" FROM student;
-- 查询带条件
SELECT name as "名字", score as "分数" FROM student WHERE age >= 19;
-- 查询多个条件
select name as '名字',class as '班级' from student where gender='男' and score >= 90;
```

6. Like模糊查询

``` sql
select * from student where name like '王%';
```

7. in / not in集合

``` sql
select * from student where class in ('一班', '二班');
select * from student where class not in ('一班', '二班');
```

8. between and 指定区间

``` sql
select * from student where age between 18 and 20;
```

9. limit 分页返回

``` sql
select * from student limit 0,5
-- 第二页的数据
select * from student limit 5,5
select * from student limit 5;
```


10. order by 指定排序

order by 指定根据 score 升序排列，如果 score 相同再根据 age 降序排列。
``` sql
select name,age,score from student order by score asc, age desc;
```

11. 分组统计 group by

```sql
SELECT class as `班级`, AVG(score) as `平均成绩`  from student group by class order by `平均成绩` DESC;
```


12. 统计数量 count 

```sql
select class, count(*) as count from student group by class;
```

13. 分组之后的过滤


``` sql
SELECT class, AVG(score) AS avg_score FROM student GROUP BY class HAVING avg_score > 90;
```

14. 去重

``` sql
SELECT DISTINCT class from student;
```

15. 聚合函数：用于对数据的统计，比如 AVG、COUNT、SUM、MIN、MAX。

``` sql
select avg(score) as '平均成绩',count(*) as '人数',sum(score) as '总成绩',min(score) as '最低分', max(score) as '最高分' from student 

```


16. 字符串函数

``` sql
SELECT CONCAT('xx', name, 'yy'), SUBSTR(name,2,3), LENGTH(name), UPPER('aa'), LOWER('TT') FROM student;
```


17. 数值处理

``` sql
SELECT ROUND(1.234567, 2), CEIL(1.234567), FLOOR(1.234567), ABS(-1.234567), MOD(5, 2);
```


18. 数值函数：用于对数值的处理，比如 ROUND、CEIL、FLOOR、ABS、MOD。

分别是 ROUND 四舍五入、CEIL 向上取整、FLOOR 向下取整、ABS 绝对值、MOD 取模。

``` sql
SELECT ROUND(1.234567, 2), CEIL(1.234567), FLOOR(1.234567), ABS(-1.234567), MOD(5, 2);
```

19. 对日期、时间进行处理，比如 DATE、TIME、YEAR、MONTH、DAY

``` sql
SELECT YEAR('2023-06-01 22:06:03'), MONTH('2023-06-01 22:06:03'),DAY('2023-06-01 22:06:03'),DATE('2023-06-01 22:06:03'), TIME('2023-06-01 22:06:03');

```

20. 条件函数：根据条件是否成立返回不同的值，比如 IF、CASE

``` sql
select name, if(score >=60, '及格', '不及格') from student;
SELECT name, score, CASE WHEN score >=90 THEN '优秀' WHEN score >=60 THEN '良好'ELSE '差' END AS '档次' FROM student;

```


## 一对一查询 ，JOIN查询，


创建一个USER表
``` sql
CREATE TABLE `hello-mysql`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` VARCHAR(45) NOT NULL COMMENT '名字',
  PRIMARY KEY (`id`)
);
```

创建一个ID_CARD表
``` sql
CREATE TABLE `id_card` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `card_name` varchar(45) NOT NULL COMMENT '身份证号',
  `user_id` int DEFAULT NULL COMMENT '用户 id',
  PRIMARY KEY (`id`),
  INDEX `card_id_idx` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
)  CHARSET=utf8mb4
```



向USER表插入数据
``` sql
INSERT INTO `user` (`name`)
	VALUES
		('张三'),
		('李四'),
		('王五'),
		('赵六'),
		('孙七'),
		('周八'),
		('吴九'),
		('郑十'),
		('钱十一'),
		('陈十二'); 

```

向ID_CARD表插入数据
``` sql
INSERT INTO id_card (card_name, user_id) 
    VALUES
  ('110101199001011234',1),
	('310101199002022345',2),
	('440101199003033456',3),
	('440301199004044567',4),
	('510101199005055678',5),
	('330101199006066789',6),
	('320101199007077890',7),
	('500101199008088901',8),
	('420101199009099012',9),
	('610101199010101023',10);
```


连表查询
``` sql
SELECT * FROM user JOIN id_card ON user.id = id_card.user_id;


SELECT user.id, name, id_card.id as card_id, card_name 
    FROM user
    JOIN id_card ON user.id = id_card.user_id;

-- JOIN ON 相当于 INNER JOIN ON
SELECT user.id, name, id_card.id as card_id, card_name 
    FROM user
    INNER JOIN id_card ON user.id = id_card.user_id;

-- 左连 id_card 没有的数据 显示NULL
SELECT user.id, name, id_card.id as card_id, card_name 
    FROM user
    LEFT JOIN id_card ON user.id = id_card.user_id;

-- 右连 user 里没有的数据 显示NULL
SELECT user.id, name, id_card.id as card_id, card_name 
    FROM user
    RIGHT JOIN id_card ON user.id = id_card.user_id;
```
INNER:
![](https://pic.imgdb.cn/item/65fc03c59f345e8d03098fe9.png)

LEFT：
![](https://pic.imgdb.cn/item/65fc038f9f345e8d03089bd3.png)

RIGHT：
![](https://pic.imgdb.cn/item/65fc03a49f345e8d0308fed8.png)



更新时有几种策略：

CASCADE： 主表主键更新，从表关联记录的外键跟着更新，主表记录删除，从表关联记录删除

SET NULL：主表主键更新或者主表记录删除，从表关联记录的外键设置为 null

RESTRICT：只有没有从表的关联记录时，才允许删除主表记录或者更新主表记录的主键 id

NO ACTION： 同 RESTRICT，只是 sql 标准里分了 4 种，但 mysql 里 NO ACTION 等同于 RESTRICT。