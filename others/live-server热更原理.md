# live-server

这段代码会创建一个socket，其监听服务器传递的消息，如果是`refreshcss`说明是css文件发生改变，这时候页面是需要重新加载的，我们将其所有的旧的link标签删除，增加新的时间戳后插入页面中，这样就做到了无感刷新。

如果是js只能重新刷新页面。

``` html
<script type="text/javascript">
	// <![CDATA[  <-- For SVG support
	if ('WebSocket' in window) {
		(function() {
			function refreshCSS() {
				var sheets = [].slice.call(document.getElementsByTagName("link"));
				var head = document.getElementsByTagName("head")[0];
				for (var i = 0; i < sheets.length; ++i) {
					var elem = sheets[i];
					head.removeChild(elem);
					var rel = elem.rel;
					if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
						var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
						elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
					}
					head.appendChild(elem);
				}
			}
			var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
			var address = protocol + window.location.host + window.location.pathname + '/ws';
			var socket = new WebSocket(address);
			socket.onmessage = function(msg) {
				if (msg.data == 'reload') window.location.reload();
				else if (msg.data == 'refreshcss') refreshCSS();
			};
			console.log('Live reload enabled.');
		})();
	}
	// ]]>
</script>
```

在服务端首先会创建一个服务，然后引入各类中间件，其中一个是处理文件流的，当请求了某个文件的时候，判断文件类型，如果是html等文件，会注入上面这段代码。

利用send库创建静态资源服务，并对流内容通过event-straem库进行修改

利用open库打开浏览器或者其他应用

利用chokidar进行文件内容变更的监听

利用faye-websocket在客户端连接时才初始化ws服务并建立一对一的连接