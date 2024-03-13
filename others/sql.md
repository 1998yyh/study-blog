# mysql

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