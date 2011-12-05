{
	"fixtures": [
		{
			"path": "^\/api",
			"proxy": {
				"host": "api.over-blog.dev",
				"port": 80,
				"replace_url": "^\/api(/.*?)$"
			}
		}
	],
	"port": 1636
}
