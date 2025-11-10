<?php

namespace micro\controllers;

use micro\models\LinkSearch;
use Yii;
use yii\rest\ActiveController;

class LinkController extends ActiveController
{
    public $modelClass = 'micro\models\Link';

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        unset($behaviors['rateLimiter']);

        $behaviors['contentNegotiator'] = [
            'class' => \yii\filters\ContentNegotiator::class,
            'formats' => [
                'application/json' => \yii\web\Response::FORMAT_JSON,
            ],
        ];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();
        
        $actions['index']['dataFilter'] = [
            'class' => \yii\data\ActiveDataFilter::class,
            'searchModel' => LinkSearch::class,
        ];
        
        return $actions;
    }
}
