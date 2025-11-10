<?php
return [
    'id' => 'micro-app',
    // basePath (базовый путь) приложения будет каталог `micro-app`
    'basePath' => __DIR__,
    // это пространство имен где приложение будет искать все контроллеры
    'controllerNamespace' => 'micro\controllers',
    // установим псевдоним '@micro', чтобы включить автозагрузку классов из пространства имен 'micro'
    'aliases' => [
        '@micro' => __DIR__,
    ],
    'components' => [
        'request' => [
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ],
            'enableCookieValidation' => false,
            'enableCsrfValidation' => false,
        ],
        'db' => [
            'class' => 'yii\db\Connection',
            'dsn' => 'sqlite:@micro/database.sqlite',
        ],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'enableStrictParsing' => false,
            'showScriptName' => false,
            'rules' => [
            ],
        ]
    ],
];
