# Typeorm

创建项目

npx typeorm@latest init --name typeorm-all-feature --database mysql


修改datasource

``` js
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Aaa } from "./entity/Aaa"

export const AppDataSource = new DataSource({
    // type 是数据库的类型，因为 TypeORM 不只支持 MySQL 还支持 postgres、oracle、sqllite 等数据库。
    type: "mysql",
    // host、port 是指定数据库服务器的主机和端口号。
    host: "localhost",
    port: 3306,
    // user、password 是登录数据库的用户名和密码。
    username: "root",
    password: "yang",
    // database 是要指定操作的 database，因为 mysql 是可以有多个 database 或者叫 schema 的。
    database: "practice",
    // synchronize 是根据同步建表，也就是当 database 里没有和 Entity 对应的表的时候，会自动生成建表 sql 语句并执行。
    synchronize: true,
    // logging 是打印生成的 sql 语句。
    logging: true,
    // entities 是指定有哪些和数据库的表对应的 Entity。
    entities: [User],
    // 除了 class，还可以通过这种方式指定：
    //   entities: ["./**/entity/*.ts"],
    // migrations 是修改表结构之类的 sql，暂时用不到，就不展开了。
    migrations: [],
    // subscribers 是一些 Entity 生命周期的订阅者，比如 insert、update、remove 前后，可以加入一些逻辑：
    subscribers: [],
    // poolSize 是指定数据库连接池中连接的最大数量。
    poolSize: 10,
    // connectorPackage 是指定用什么驱动包。
    connectorPackage: 'mysql2',
    // extra 是额外发送给驱动包的一些选项。
    extra: {
        authPlugin: 'sha256_password',
    }
})

```


## 语法

save：新增或者修改 Entity，如果传入了 id 会先 select 再决定修改还新增
``` js
const user = new User()

user.firstName = "aaa111"
user.lastName = "bbb"
user.age = 25

await AppDataSource.manager.save(user)
```
update：直接修改 Entity，不会先 select

``` js
const user = new User()
// 如果指定了 ID 就变成了修改
user.id = 1;
user.firstName = "aaa111"
user.lastName = "bbb"
user.age = 25

await AppDataSource.manager.save(user)
```

insert：直接插入 Entity
delete：删除 Entity，通过 id
``` js
// 删除 & 批量删除
await AppDataSource.manager.delete(User, 1);
await AppDataSource.manager.delete(User, [2,3]);
```
remove：删除 Entity，通过对象
find：查找多条记录，可以指定 where、order by 等条件
findBy：查找多条记录，第二个参数直接指定 where 条件，更简便一点
findAndCount：查找多条记录，并返回总数量
findByAndCount：根据条件查找多条记录，并返回总数量
findOne：查找单条记录，可以指定 where、order by 等条件
findOneBy：查找单条记录，第二个参数直接指定 where 条件，更简便一点
findOneOrFail：查找失败会抛 EntityNotFoundError 的异常
query：直接执行 sql 语句
createQueryBuilder：创建复杂 sql 语句，比如 join 多个 Entity 的查询
transaction：包裹一层事务的 sql
getRepository：拿到对单个 Entity 操作的类，方法同 EntityManager


## query build

复杂 sql 语句不会直接写，而是会用 query builder：

``` js
const queryBuilder = await AppDataSource.manager.createQueryBuilder();

const user = await queryBuilder.select("user")
    .from(User, "user")
    .where("user.age = :age", { age: 21 })
    .getOne();

console.log(user);
```