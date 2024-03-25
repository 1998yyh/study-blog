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



更新时有几种策略（外建的级连方式）：

CASCADE： 主表主键更新，从表关联记录的外键跟着更新，主表记录删除，从表关联记录删除

SET NULL：主表主键更新或者主表记录删除，从表关联记录的外键设置为 null

RESTRICT：只有没有从表的关联记录时，才允许删除主表记录或者更新主表记录的主键 id

NO ACTION： 同 RESTRICT，只是 sql 标准里分了 4 种，但 mysql 里 NO ACTION 等同于 RESTRICT。

RESTIRCT 和 NO ACTION 的处理逻辑：只要从表有关联记录，就不能更新 id 或者删除记录。

CASCADE 的处理逻辑：主表删除，从表关联记录也级联删除，主表 id 更新，从表关联记录也跟着更新。

set null 的处理逻辑：主表记录删除或者修改 id，从表关联记录外键置为 null。



## 一对多


我们创建一个部门表 


``` sql
CREATE TABLE `hello-mysql`.`department` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
);

```


同样的方式创建 employee 表：

``` sql
CREATE TABLE `hello-mysql`.`employee` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `department_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `department_id_idx` (`department_id` ASC) VISIBLE,
  CONSTRAINT `department_id`
    FOREIGN KEY (`department_id`)
    REFERENCES `hello-mysql`.`department` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL);
```


我们往部门表里放几个数据

``` sql
INSERT INTO `department` (`id`, `name`) 
    VALUES 
        (1, '人事部'),
        (2, '财务部'),
        (3, '市场部'),
        (4, '技术部'),
        (5, '销售部'),
        (6, '客服部'),
        (7, '采购部'),
        (8, '行政部'),
        (9, '品控部'),
        (10, '研发部');

```


往员工表里放几个数据

```sql
INSERT INTO `employee` (`id`, `name`, `department_id`)
    VALUES 
        (1, '张三', 1),
        (2, '李四', 2), 
        (3, '王五', 3),
        (4, '赵六', 4),
        (5, '钱七', 5),
        (6, '孙八', 5),
        (7, '周九', 5),
        (8, '吴十', 8),
        (9, '郑十一', 9),
        (10, '王十二', 10);

```


查询部门ID为5的 员工

``` sql
select * from department
    join employee on department.id = employee.department_id
    where department.id = 5

```


试试左连 

```sql
select * from department
    left join employee on department.id = employee.department_id

```

![](https://pic.imgdb.cn/item/65fd52ac9f345e8d031364f7.png)

department 没有员工的显示null


右连类似

当我们删除 部门表中一个，去查询员工表

![](https://pic.imgdb.cn/item/65fd53669f345e8d0317269b.png)

对应该部门的员工部门ID 变成了NULL


## 多对多

比如文章与标签的关系，一个文章可能有多个标签，一个标签也可能被多个文章所有。

现在是多对多了，每一方都是多的一方。这时候是不是双方都要添加外键呢？

一般我们是这样设计：

![](https://pic.imgdb.cn/item/65fd54689f345e8d031cc434.png)


我们开始创建表

``` sql
-- 创建文章表
CREATE TABLE `article` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `title` VARCHAR(50) NOT NULL,
 `content` TEXT NOT NULL,
 PRIMARY KEY (`id`)
) CHARSET=utf8mb4;

-- 插入数据
INSERT INTO `article` (`title`, `content`)
    VALUES
            ('文章1', '这是文章1的内容。'),
            ('文章2', '这是文章2的内容。'),
            ('文章3', '这是文章3的内容。'),
            ('文章4', '这是文章4的内容。'),
            ('文章5', '这是文章5的内容。');

-- 创建TAG表
CREATE TABLE `tag` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `name` VARCHAR(50) NOT NULL,
 PRIMARY KEY (`id`)
);

-- 插入数据
INSERT INTO `tag` (`name`)
    VALUES
            ('标签1'),
            ('标签2'),
            ('标签3'),
            ('标签4'),
            ('标签5');
```


然后我们创建中间表 中间表的级联方式要设置为 CASCADE，这个是固定的。

``` sql
CREATE TABLE `hello-mysql`.`article_tag` (
  `article_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`article_id`, `tag_id`),
  INDEX `tag_id_idx` (`tag_id` ASC) VISIBLE,
  CONSTRAINT `article_id`
    FOREIGN KEY (`article_id`)
    REFERENCES `hello-mysql`.`article` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `tag_id`
    FOREIGN KEY (`tag_id`)
    REFERENCES `hello-mysql`.`tag` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

```

primary key (article_id, tag_id) 是指定复合主键。

后面分别是添加两个外键约束。

我们插入几条数据
```sql
INSERT INTO `article_tag` (`article_id`, `tag_id`)
    VALUES
    (1,1), (1,2), (1,3),
    (2,2), (2,3), (2,4),
    (3,3), (3,4), (3,5),
    (4,4), (4,5), (4,1),
    (5,5), (5,1), (5,2);

```


进行三个表的关联查询


```sql
SELECT * FROM article a 
    JOIN article_tag at ON a.id = at.article_id
    JOIN tag t ON t.id = at.tag_id
    WHERE a.id = 1

```

当然我们也可以指定返回的列

``` sql
SELECT t.name AS 标签名, a.title AS 文章标题
    FROM article a 
    JOIN article_tag at ON a.id = at.article_id
    JOIN tag t ON t.id = at.tag_id
    WHERE a.id = 1

```

当我们删除文章1时

```sql
delete from article where id = 1;
```

会发现article_tag表的关系也被删除了 ,这就是 CASCADE 的作用。

当然，删除的只是关系，并不影响 id=1 的标签：