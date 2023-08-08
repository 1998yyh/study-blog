# unpack 列表的展开收起 css

## 核心点

1. grid-template-rows:0fr -> 1fr 

## 代码

```html
<aside>
  <ul>
    <li>
      <input hidden type="checkbox" id="s1" checked />
      <label for="s1">工作台</label>
      <div class="sub">
        <ul>
          <li>项目列表</li>
          <li>数据配置器</li>
        </ul>
      </div>
    </li>
    <li>
      <input hidden type="checkbox" id="s2" />
      <label for="s2">权限管理</label>
      <div class="sub">
        <ul>
          <li>权限申请</li>
          <li>我的申请</li>
          <li>权限审批</li>
        </ul>
      </div>
    </li>
    <li>
      <input hidden type="checkbox" id="s3" />
      <label for="s3">后台管理</label>
      <div class="sub">
        <ul>
          <li>菜单管理</li>
          <li>站点管理</li>
          <li>角色管理</li>
          <li>用户管理</li>
          <li>接口管理</li>
        </ul>
      </div>
    </li>
  </ul>
</aside>
```

```css
html,
body {
  margin: 0;
  height: 100%;
  display: flex;
  justify-content: center;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  min-height: 0;
}
aside {
  margin-top: 50px;
  align-self: flex-start;
  width: 200px;
  color: rgba(255, 255, 255, 0.65);
  background: #001529;
}
label {
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 4px;
  opacity: 0.85;
}
label::after {
  content: "";
  width: 15px;
  height: 15px;
  margin-left: auto;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E %3Cpath fill='%23fff' d='M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z'%3E%3C/path%3E %3C/svg%3E")
    center no-repeat;
}
label:hover {
  opacity: 1;
}
li {
  padding: 0 4px;
  line-height: 40px;
}
.sub li {
  padding: 0 25px;
  font-size: 14px;
}
:checked + label::after {
  transform: scaleY(-1);
}
.sub {
  display: grid;
  grid-template-rows: 0fr;
  transition: 0.3s;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.65);
}
:checked + label::after {
  transform: scaleY(-1);
}
:checked ~ .sub {
  grid-template-rows: 1fr;
}
```

##
