## to start project run: 
```
vendor/bin/yii serve --docroot=./web --port=8123
```

## to create migration comment component->request in config.php and run: 
```
vendor/bin/yii migrate/create --appconfig=config.php create_post_table --fields="title:string,body:text"
```